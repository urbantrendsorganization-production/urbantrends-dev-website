from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db.models import Count, Sum
from django.db.models.functions import TruncMonth
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Invoice, Order, OrderMessage, QuoteRequest, Review, Service
from .serializers import (
    InvoiceSerializer,
    OrderMessageSerializer,
    OrderSerializer,
    OrderStaffUpdateSerializer,
    QuoteRequestSerializer,
    ReviewSerializer,
    ServiceDetailSerializer,
    ServiceListSerializer,
)


class QuoteRequestView(generics.CreateAPIView):
    """POST /api/services/quote — unauthenticated quote request from the services page."""
    authentication_classes = []
    permission_classes     = [permissions.AllowAny]
    serializer_class       = QuoteRequestSerializer

    def perform_create(self, serializer):
        instance = serializer.save()
        self._notify_staff(instance)

    def _notify_staff(self, quote: QuoteRequest) -> None:
        from django.conf import settings as django_settings
        from django.core.mail import send_mail

        subject = f'[UrbanTrends] New quote request — {quote.service_name}'
        body = (
            f'New quote request received.\n\n'
            f'Service:   {quote.service_name}\n'
            f'Name:      {quote.name}\n'
            f'Email:     {quote.email}\n'
            + (f'Company:   {quote.company}\n' if quote.company else '')
            + (f'Phone:     {quote.phone}\n' if quote.phone else '')
            + f'Budget:    {quote.get_budget_range_display()}\n'
            f'Timeline:  {quote.get_timeline_display()}\n\n'
            f'Brief:\n{quote.brief}\n\n'
            f'Admin: {getattr(django_settings, "FRONTEND_BASE_URL", "http://localhost:3000")}'
            f'/admin/services/quoterequest/{quote.pk}/change/'
        )
        send_mail(
            subject, body,
            django_settings.DEFAULT_FROM_EMAIL,
            [getattr(django_settings, 'STAFF_NOTIFICATION_EMAIL', django_settings.DEFAULT_FROM_EMAIL)],
            fail_silently=True,
        )


class ServiceListView(generics.ListAPIView):
    serializer_class = ServiceListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return (
            Service.objects.filter(is_active=True)
            .select_related('category')
            .prefetch_related('plans')
        )


class ServiceDetailView(generics.RetrieveAPIView):
    serializer_class = ServiceDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return (
            Service.objects.filter(is_active=True)
            .select_related('category')
            .prefetch_related('plans')
        )


class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all().select_related('customer', 'service', 'pricing_plan')
        return (
            Order.objects.filter(customer=user)
            .select_related('service', 'pricing_plan')
        )


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        order = generics.get_object_or_404(Order, pk=self.kwargs['pk'])
        user = self.request.user
        if not user.is_staff and order.customer != user:
            raise PermissionDenied
        return order


class OrderStaffUpdateView(generics.UpdateAPIView):
    serializer_class = OrderStaffUpdateSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Order.objects.all()
    http_method_names = ['patch']


class AnalyticsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        User = get_user_model()
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)
        six_months_ago = now - timedelta(days=182)

        STATUS_LABELS = {
            'pending': 'Pending Review',
            'quoted': 'Quote Sent',
            'active': 'In Progress',
            'on_hold': 'On Hold',
            'completed': 'Completed',
            'cancelled': 'Cancelled',
        }

        status_counts = {
            row['status']: row['count']
            for row in Order.objects.values('status').annotate(count=Count('id'))
        }
        total_orders = sum(status_counts.values())

        by_service = list(
            Order.objects.values('service__name')
            .annotate(count=Count('id'))
            .order_by('-count')[:6]
        )

        by_month_qs = (
            Order.objects.filter(created_at__gte=six_months_ago)
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )

        total_customers = User.objects.filter(is_staff=False).count()
        new_customers_30d = User.objects.filter(
            is_staff=False, date_joined__gte=thirty_days_ago
        ).count()
        total_messages = OrderMessage.objects.filter(is_internal=False).count()
        revenue = (
            Order.objects.filter(
                status='completed',
                pricing_plan__isnull=False,
                pricing_plan__price__isnull=False,
            ).aggregate(total=Sum('pricing_plan__price'))['total'] or 0
        )

        recent = (
            Order.objects.select_related('customer', 'service')
            .order_by('-created_at')[:10]
        )

        return Response({
            'kpis': {
                'total_orders': total_orders,
                'pending': status_counts.get('pending', 0),
                'active': status_counts.get('active', 0),
                'completed': status_counts.get('completed', 0),
                'total_customers': total_customers,
                'new_customers_30d': new_customers_30d,
                'total_messages': total_messages,
                'total_revenue': float(revenue),
            },
            'by_status': [
                {
                    'status': s,
                    'label': STATUS_LABELS[s],
                    'count': status_counts.get(s, 0),
                }
                for s in STATUS_LABELS
            ],
            'by_service': [
                {'name': row['service__name'], 'count': row['count']}
                for row in by_service
            ],
            'by_month': [
                {'month': row['month'].strftime('%Y-%m'), 'count': row['count']}
                for row in by_month_qs
            ],
            'recent_orders': [
                {
                    'id': o.id,
                    'customer': o.customer.email,
                    'service': o.service.name,
                    'status': o.status,
                    'created_at': o.created_at.date().isoformat(),
                }
                for o in recent
            ],
        })


class OrderInvoiceView(generics.RetrieveAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        order = generics.get_object_or_404(Order, pk=self.kwargs['pk'])
        user = self.request.user
        if not user.is_staff and order.customer != user:
            raise PermissionDenied
        return generics.get_object_or_404(Invoice, order=order)


class OrderMessageListCreateView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderMessageSerializer

    def _get_order(self):
        order = generics.get_object_or_404(Order, pk=self.kwargs['pk'])
        user = self.request.user
        if not user.is_staff and order.customer != user:
            raise PermissionDenied
        return order

    def get(self, request, pk):
        order = self._get_order()
        qs = order.messages.select_related('sender')
        if not request.user.is_staff:
            qs = qs.filter(is_internal=False)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    def post(self, request, pk):
        order = self._get_order()
        serializer = self.get_serializer(
            data=request.data,
            context={**self.get_serializer_context(), 'order': order},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class OrderReviewView(generics.GenericAPIView):
    """GET/POST /api/orders/<pk>/review — the customer's review of an order.

    A customer may submit one review per completed order. Reviews are held for
    staff approval before they appear publicly.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ReviewSerializer

    def _get_order(self):
        order = generics.get_object_or_404(Order, pk=self.kwargs['pk'])
        if not self.request.user.is_staff and order.customer != self.request.user:
            raise PermissionDenied
        return order

    def get(self, request, pk):
        order = self._get_order()
        review = getattr(order, 'review', None)
        if review is None:
            return Response(None)
        return Response(self.get_serializer(review).data)

    def post(self, request, pk):
        order = self._get_order()
        if order.customer != request.user:
            raise PermissionDenied("Only the customer can review their order.")
        if order.status != 'completed':
            return Response(
                {'detail': 'You can only review an order once it is completed.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if hasattr(order, 'review'):
            return Response(
                {'detail': 'You have already reviewed this order.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        author_name = (
            serializer.validated_data.get('author_name')
            or order.customer.get_full_name()
            or order.customer.email.split('@')[0]
        )
        review = serializer.save(
            order=order, customer=order.customer, author_name=author_name,
        )
        self._notify_staff(review)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def _notify_staff(self, review: Review) -> None:
        from django.conf import settings as django_settings
        from django.core.mail import send_mail

        from notifications.services import push_staff

        push_staff(
            kind='review',
            title=f"New {review.rating}★ review",
            body=f"{review.author_name} reviewed order #{review.order_id}.",
            url=f"/portal/orders/{review.order_id}",
            order=review.order,
        )

        base = getattr(django_settings, 'FRONTEND_BASE_URL', 'http://localhost:3000')
        send_mail(
            f'[UrbanTrends] New {review.rating}★ review — Order #{review.order_id}',
            (
                f'A new review is awaiting approval.\n\n'
                f'Rating:  {review.rating}/5\n'
                f'From:    {review.author_name} ({review.customer.email})\n'
                f'Order:   #{review.order_id} — {review.order.service.name}\n\n'
                f'Review:\n{review.comment}\n\n'
                f'Approve: {base}/admin/services/review/{review.pk}/change/'
            ),
            django_settings.DEFAULT_FROM_EMAIL,
            [getattr(django_settings, 'STAFF_NOTIFICATION_EMAIL', django_settings.DEFAULT_FROM_EMAIL)],
            fail_silently=True,
        )
