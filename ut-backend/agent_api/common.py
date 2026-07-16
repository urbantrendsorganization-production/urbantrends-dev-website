"""Shared plumbing for the agent API: service auth, session resolution, the
error envelope, money formatting, and lightweight ETag caching.

Conventions (see BACKEND_APIS.md §0):
  * Service auth  — ``Authorization: Bearer <URBANTRENDS_API_KEY>`` authenticates
    the *agent service*. When the key is unset (dev/tests) auth is open so the
    suite and local demo run keyless.
  * User scope    — ``X-UT-Session: <sessionid>`` forwards the visitor's host
    session; the backend resolves the user from it and never trusts a
    caller-supplied customer id for authorization.
"""
import hashlib
import json
from datetime import timezone as dt_timezone
from decimal import ROUND_HALF_UP, Decimal
from importlib import import_module

from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import authentication, permissions
from rest_framework.response import Response

User = get_user_model()


# ── Service authentication ──────────────────────────────────────────────────

class HasServiceKey(permissions.BasePermission):
    """Authenticates the agent *service* via a shared bearer key.

    Fails open only when no key is configured (keyless dev/test), per the
    contract's "dev/test keep working keyless" guarantee.
    """
    message = 'Missing or invalid service credential.'

    def has_permission(self, request, view):
        configured = getattr(settings, 'URBANTRENDS_API_KEY', '') or ''
        if not configured:
            return True
        header = request.headers.get('Authorization', '')
        prefix = 'Bearer '
        token = header[len(prefix):].strip() if header.startswith(prefix) else ''
        return bool(token) and _constant_time_eq(token, configured)


def _constant_time_eq(a: str, b: str) -> bool:
    if len(a) != len(b):
        return False
    result = 0
    for x, y in zip(a, b):
        result |= ord(x) ^ ord(y)
    return result == 0


class AgentView:
    """Mixin: agent endpoints authenticate the service, not a Django session,
    so they opt out of DRF's SessionAuthentication (and its CSRF check)."""
    authentication_classes: list = []
    permission_classes = [HasServiceKey]


# ── Visitor session resolution (user-scoped calls) ──────────────────────────

def resolve_session_user(request):
    """Return the ``User`` behind the forwarded ``X-UT-Session`` sessionid, or
    ``None`` when the header is absent, the session is unknown, or anonymous."""
    session_key = request.headers.get('X-UT-Session', '').strip()
    if not session_key:
        return None
    engine = import_module(settings.SESSION_ENGINE)
    try:
        store = engine.SessionStore(session_key)
        uid = store.get('_auth_user_id')
    except Exception:
        return None
    if not uid:
        return None
    return User.objects.filter(pk=uid).first()


# ── Error envelope ──────────────────────────────────────────────────────────

def error(code: str, message: str, *, status: int = 400, fields: dict | None = None) -> Response:
    body = {'error': {'code': code, 'message': message}}
    if fields:
        body['error']['fields'] = fields
    return Response(body, status=status)


# ── Money ───────────────────────────────────────────────────────────────────

def shillings(value) -> str:
    """Whole-shilling string, e.g. ``"25000"`` — the money wire format."""
    dec = value if isinstance(value, Decimal) else Decimal(str(value))
    return str(int(dec.quantize(Decimal('1'), rounding=ROUND_HALF_UP)))


# ── Time ────────────────────────────────────────────────────────────────────

def iso(dt) -> str:
    """UTC ISO-8601 with a trailing ``Z`` (e.g. ``2026-07-16T12:00:00Z``)."""
    return dt.astimezone(dt_timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')


# ── ETag caching (catalog / KB / sitemap) ───────────────────────────────────

def cacheable(payload: dict, request, *, max_age: int = 300) -> Response:
    """Return ``payload`` as a cacheable JSON response with a strong ETag,
    or a 304 when the caller's ``If-None-Match`` still matches."""
    raw = json.dumps(payload, sort_keys=True, default=str).encode()
    etag = '"%s"' % hashlib.sha1(raw).hexdigest()
    if request.headers.get('If-None-Match') == etag:
        resp = Response(status=304)
    else:
        resp = Response(payload)
    resp['ETag'] = etag
    resp['Cache-Control'] = f'public, max-age={max_age}'
    return resp

