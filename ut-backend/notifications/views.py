from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(generics.ListAPIView):
    """GET /api/notifications — the current user's most recent notifications."""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.notifications.all()[:30]


class UnreadCountView(APIView):
    """GET /api/notifications/unread-count — cheap poll target for the bell."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        count = request.user.notifications.filter(is_read=False).count()
        return Response({'count': count})


class MarkReadView(APIView):
    """POST /api/notifications/<pk>/read — mark a single notification read."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        updated = (
            Notification.objects
            .filter(pk=pk, recipient=request.user, is_read=False)
            .update(is_read=True)
        )
        return Response({'updated': updated})


class MarkAllReadView(APIView):
    """POST /api/notifications/read-all — mark every unread notification read."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        updated = (
            request.user.notifications
            .filter(is_read=False)
            .update(is_read=True)
        )
        return Response({'updated': updated})
