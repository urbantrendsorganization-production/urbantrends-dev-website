import time
import requests as http_requests

from django.db import connection
from django.core.cache import cache

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.pagination import PageNumberPagination
from rest_framework import serializers as drf_serializers

from .models import (
    SiteSettings, HeroStat, Partner, Testimonial,
    ChangelogEntry, TeamMember, AboutMetric, ServiceStatus, Tool, Project, ContactInquiry,
)
from .serializers import (
    SiteSettingsSerializer, HeroStatSerializer, PartnerSerializer,
    TestimonialSerializer, ChangelogEntrySerializer,
    TeamMemberSerializer, AboutMetricSerializer, ToolSerializer,
    ProjectSerializer, ContactInquirySerializer,
)


class HomeDataView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        ctx = {'request': request}
        settings = SiteSettings.get()
        stats = HeroStat.objects.filter(is_active=True)
        partners_rails = Partner.objects.filter(category='rails', is_active=True)
        partners_trusted = Partner.objects.filter(category='trusted_by', is_active=True)
        testimonials = Testimonial.objects.filter(is_active=True)

        return Response({
            'settings':         SiteSettingsSerializer(settings).data,
            'stats':            HeroStatSerializer(stats, many=True).data,
            'partners_rails':   PartnerSerializer(partners_rails, many=True, context=ctx).data,
            'partners_trusted': PartnerSerializer(partners_trusted, many=True, context=ctx).data,
            'testimonials':     self._testimonials(testimonials),
        })

    def _testimonials(self, editorial):
        """Editorial testimonials plus approved customer reviews, in one list.

        Reviews (services.Review) are mapped into the same shape the frontend
        Testimonials section already renders, carrying an extra `rating` so the
        UI can show stars. Imported lazily to avoid a hard app-load dependency.
        """
        data = TestimonialSerializer(editorial, many=True).data
        for t in data:
            t['rating'] = None  # keep the shape uniform

        from services.models import Review
        reviews = (
            Review.objects.filter(is_approved=True)
            .select_related('customer')
            .order_by('-approved_at')[:12]
        )
        for r in reviews:
            data.append({
                'quote': r.comment,
                'author_name': r.author_name or 'Client',
                'author_role': r.author_role,
                'company': r.company,
                'photo_url': '',
                'product_label': '',
                'product_accent_color': '#34D399',
                'rating': r.rating,
            })
        return data


class ChangelogPagination(PageNumberPagination):
    page_size = 20


class ChangelogView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class   = ChangelogEntrySerializer
    pagination_class   = ChangelogPagination

    def get_queryset(self):
        return ChangelogEntry.objects.filter(is_published=True).order_by('-date')


class AboutView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        team    = TeamMember.objects.filter(is_active=True)
        metrics = AboutMetric.objects.all()
        return Response({
            'team':    TeamMemberSerializer(team, many=True).data,
            'metrics': AboutMetricSerializer(metrics, many=True).data,
        })


class StatusView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        services = ServiceStatus.objects.filter(is_active=True)
        results = []

        for svc in services:
            start = time.monotonic()
            try:
                resp = http_requests.get(svc.url, timeout=4)
                elapsed = round((time.monotonic() - start) * 1000)
                if resp.status_code < 400:
                    status = 'operational'
                elif resp.status_code < 500:
                    status = 'degraded'
                else:
                    status = 'down'
            except Exception:
                elapsed = None
                status = 'down'

            results.append({
                'name':        svc.name,
                'url':         svc.url,
                'status':      status,
                'response_ms': elapsed,
            })

        return Response(results)


class ToolsView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class   = ToolSerializer

    def get_queryset(self):
        qs = Tool.objects.filter(is_active=True)
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category=category)
        return qs


class ProjectsView(ListAPIView):
    """GET /api/cms/projects — published portfolio entries.

    Query params:
      ?featured=true   only homepage-featured projects
      ?category=<key>  filter by category
    """
    permission_classes = [AllowAny]
    serializer_class   = ProjectSerializer

    def get_queryset(self):
        qs = Project.objects.filter(is_active=True)
        if self.request.query_params.get('featured') in ('1', 'true', 'True'):
            qs = qs.filter(is_featured=True)
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category=category)
        return qs


class HealthView(APIView):
    """GET /api/health — lightweight liveness + component check."""
    permission_classes = [AllowAny]

    def get(self, request):
        components = {}

        # Database
        try:
            connection.ensure_connection()
            components['database'] = 'operational'
        except Exception:
            components['database'] = 'down'

        # Cache
        try:
            cache.set('__health__', 1, 5)
            components['cache'] = 'operational' if cache.get('__health__') else 'degraded'
        except Exception:
            components['cache'] = 'down'

        overall = 'operational' if all(v == 'operational' for v in components.values()) else 'degraded'
        return Response({'status': overall, 'components': components})


class ContactView(CreateAPIView):
    """POST /api/contact — public contact/inquiry form submission."""
    authentication_classes = []
    permission_classes     = [AllowAny]
    serializer_class       = ContactInquirySerializer


class MonitoringAlertView(APIView):
    """GET /api/cms/monitoring-alert — returns stored service health for the admin banner.
    Only accessible to staff (logged-in admin users).
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        services = ServiceStatus.objects.filter(is_active=True)
        alerts = [
            {'name': s.name, 'status': s.last_status}
            for s in services
            if s.last_status in ('degraded', 'down')
        ]
        latest = services.exclude(last_checked_at=None).order_by('-last_checked_at').first()
        return Response({
            'alerts':     alerts,
            'checked_at': latest.last_checked_at.isoformat() if latest and latest.last_checked_at else None,
        })
