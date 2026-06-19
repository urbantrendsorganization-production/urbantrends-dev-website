import os
from django.shortcuts import redirect
from django.contrib.admin.views.decorators import staff_member_required
from django.conf import settings
from django.http import JsonResponse

from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import GmailThread
from .serializers import GmailThreadSerializer, GmailThreadDetailSerializer

# Google always returns extra scopes (openid, profile, email) alongside the
# requested ones. Tell oauthlib not to treat a broader scope as an error.
os.environ.setdefault('OAUTHLIB_RELAX_TOKEN_SCOPE', '1')

if settings.DEBUG:
    os.environ.setdefault('OAUTHLIB_INSECURE_TRANSPORT', '1')


@staff_member_required
def gmail_auth(request):
    from google_auth_oauthlib.flow import Flow
    flow = Flow.from_client_config(
        {
            'web': {
                'client_id': os.environ.get('GOOGLE_CLIENT_ID', ''),
                'client_secret': os.environ.get('GOOGLE_CLIENT_SECRET', ''),
                'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
                'token_uri': 'https://oauth2.googleapis.com/token',
                'redirect_uris': [os.environ.get('GOOGLE_REDIRECT_URI', '')],
            }
        },
        scopes=['https://www.googleapis.com/auth/gmail.readonly'],
        redirect_uri=os.environ.get('GOOGLE_REDIRECT_URI', ''),
    )
    auth_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        prompt='consent',
    )
    request.session['gmail_oauth_state'] = state
    return redirect(auth_url)


@staff_member_required
def gmail_callback(request):
    from google_auth_oauthlib.flow import Flow
    from googleapiclient.discovery import build
    from .models import GmailCredential
    from django.utils import timezone
    from datetime import timezone as dt_timezone

    expected_state = request.session.pop('gmail_oauth_state', None)
    incoming_state = request.GET.get('state')
    if not expected_state or incoming_state != expected_state:
        return JsonResponse({'error': 'Invalid OAuth state'}, status=400)

    flow = Flow.from_client_config(
        {
            'web': {
                'client_id': os.environ.get('GOOGLE_CLIENT_ID', ''),
                'client_secret': os.environ.get('GOOGLE_CLIENT_SECRET', ''),
                'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
                'token_uri': 'https://oauth2.googleapis.com/token',
                'redirect_uris': [os.environ.get('GOOGLE_REDIRECT_URI', '')],
            }
        },
        scopes=['https://www.googleapis.com/auth/gmail.readonly'],
        redirect_uri=os.environ.get('GOOGLE_REDIRECT_URI', ''),
        state=expected_state,
    )
    flow.fetch_token(authorization_response=request.build_absolute_uri())
    creds = flow.credentials
    service = build('gmail', 'v1', credentials=creds)
    profile = service.users().getProfile(userId='me').execute()

    expiry = creds.expiry
    if expiry and expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=dt_timezone.utc)

    GmailCredential.objects.update_or_create(
        pk=1,
        defaults={
            'access_token': creds.token or '',
            'refresh_token': creds.refresh_token or '',
            'token_expiry': expiry or timezone.now(),
            'connected_email': profile.get('emailAddress', ''),
        },
    )
    return redirect('/admin/gmail/gmailcredential/')


class GmailThreadListView(generics.ListAPIView):
    serializer_class = GmailThreadSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return GmailThread.objects.select_related('client', 'order').filter(is_archived=False)


class GmailThreadDetailView(generics.RetrieveAPIView):
    serializer_class = GmailThreadDetailSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'thread_id'
    lookup_url_kwarg = 'tid'

    def get_queryset(self):
        return GmailThread.objects.prefetch_related('messages').all()


class GmailSyncView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        from .api import sync_inbox
        try:
            count = sync_inbox(max_results=100)
            return Response({'synced': count})
        except Exception as exc:
            return Response({'error': str(exc)}, status=502)
