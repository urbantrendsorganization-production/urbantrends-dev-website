import hashlib
import hmac
import logging
import secrets
from urllib.parse import urlencode

import requests
from django.conf import settings
from django.contrib.admin.views.decorators import staff_member_required
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from django.db.models import Count
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import GitHubAccount, GitHubRepo
from .serializers import GitHubAccountSerializer, GitHubRepoSerializer

logger = logging.getLogger(__name__)


# GitHub events that should trigger a repo re-sync.
WEBHOOK_SYNC_EVENTS = {'push', 'create', 'delete', 'repository'}

GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize'
GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'


@staff_member_required
def github_auth(request):
    state = secrets.token_urlsafe(24)
    request.session['github_oauth_state'] = state
    params = urlencode({
        'client_id': getattr(settings, 'GITHUB_CLIENT_ID', ''),
        'redirect_uri': getattr(settings, 'GITHUB_OAUTH_REDIRECT_URI', ''),
        'scope': 'repo,read:org',
        'state': state,
    })
    return redirect(f'{GITHUB_AUTHORIZE_URL}?{params}')


@staff_member_required
def github_callback(request):
    state = request.GET.get('state')
    if state != request.session.pop('github_oauth_state', None):
        return HttpResponseBadRequest('Invalid OAuth state.')

    code = request.GET.get('code')
    if not code:
        return HttpResponseBadRequest('Missing OAuth code.')

    # Exchange code for access token
    resp = requests.post(
        GITHUB_TOKEN_URL,
        headers={'Accept': 'application/json'},
        data={
            'client_id': getattr(settings, 'GITHUB_CLIENT_ID', ''),
            'client_secret': getattr(settings, 'GITHUB_CLIENT_SECRET', ''),
            'code': code,
            'redirect_uri': getattr(settings, 'GITHUB_OAUTH_REDIRECT_URI', ''),
        },
        timeout=15,
    )
    resp.raise_for_status()
    token_data = resp.json()
    access_token = token_data.get('access_token', '')
    if not access_token:
        return HttpResponseBadRequest(f'GitHub OAuth error: {token_data.get("error_description", token_data)}')

    # Fetch user profile
    from .github_api import fetch_authenticated_user
    user_data = fetch_authenticated_user(access_token)
    login = user_data['login']
    account_type = 'org' if user_data.get('type') == 'Organization' else 'user'

    from .models import GitHubAccount
    account, created = GitHubAccount.objects.update_or_create(
        login=login,
        defaults={
            'account_type': account_type,
            'avatar_url': user_data.get('avatar_url', ''),
            'access_token': access_token,
            'is_active': True,
        },
    )

    # Sync personal repos immediately
    from .management.commands.sync_github_repos import sync_account
    from .github_api import fetch_user_orgs
    try:
        sync_account(account)
    except Exception:
        logger.exception("Failed to sync repos for GitHub account %s", account.pk)

    # Auto-create and sync each org the user belongs to
    try:
        orgs = fetch_user_orgs(access_token)
    except Exception:
        logger.exception("Failed to fetch org memberships for %s", login)
        orgs = []

    for org in orgs:
        org_account, _ = GitHubAccount.objects.update_or_create(
            login=org['login'],
            defaults={
                'account_type': 'org',
                'avatar_url': org.get('avatar_url', ''),
                'access_token': access_token,
                'is_active': True,
            },
        )
        try:
            sync_account(org_account)
        except Exception:
            logger.exception("Failed to sync repos for org %s", org['login'])

    return redirect('/admin/github_repos/githubaccount/')


def _signature_is_valid(secret, body, header):
    """Constant-time check of GitHub's X-Hub-Signature-256 header."""
    if not secret or not header:
        return False
    if not header.startswith('sha256='):
        return False
    expected = 'sha256=' + hmac.new(
        secret.encode('utf-8'), body, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, header)


@csrf_exempt
@require_POST
def github_webhook(request):
    """Receive GitHub webhook events and re-sync repos for active accounts.

    Authenticates the request via the HMAC-SHA256 signature in
    X-Hub-Signature-256 using GITHUB_WEBHOOK_SECRET. On the configured events
    it runs the same sync logic as the `sync_github_repos` management command.
    """
    secret = getattr(settings, 'GITHUB_WEBHOOK_SECRET', '')
    signature = request.headers.get('X-Hub-Signature-256', '')
    if not _signature_is_valid(secret, request.body, signature):
        return HttpResponseBadRequest('invalid signature')

    event = request.headers.get('X-GitHub-Event', '')
    if event == 'ping':
        return JsonResponse({'pong': True})
    if event not in WEBHOOK_SYNC_EVENTS:
        # Acknowledge events we don't act on so GitHub doesn't retry them.
        return HttpResponse(status=204)

    from .models import GitHubAccount
    from .management.commands.sync_github_repos import sync_account
    results = {}
    errors = {}
    for account in GitHubAccount.objects.filter(is_active=True):
        try:
            results[account.login] = sync_account(account)
        except Exception as exc:
            errors[account.login] = str(exc)
    return JsonResponse({'event': event, 'synced': results, 'errors': errors})


class GitHubAccountListView(generics.ListAPIView):
    serializer_class = GitHubAccountSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return (
            GitHubAccount.objects.filter(is_active=True)
            .annotate(repo_count=Count('repos'))
            .order_by('account_type', 'login')
        )


class GitHubRepoListView(generics.ListAPIView):
    serializer_class = GitHubRepoSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        qs = GitHubRepo.objects.select_related('account').all()
        lang = self.request.query_params.get('language')
        account = self.request.query_params.get('account')
        if lang:
            qs = qs.filter(language=lang)
        if account:
            qs = qs.filter(account__login=account)
        return qs


class GitHubSyncView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        from .models import GitHubAccount
        from .management.commands.sync_github_repos import sync_account
        accounts = GitHubAccount.objects.filter(is_active=True)
        results = {}
        errors = {}
        for account in accounts:
            try:
                count = sync_account(account)
                results[account.login] = count
            except Exception as exc:
                errors[account.login] = str(exc)
        return Response({'synced': results, 'errors': errors})
