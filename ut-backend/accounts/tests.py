import re

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core import mail
from django.test import TestCase, override_settings

User = get_user_model()

CODE_REQUEST_URL = "/_allauth/browser/v1/auth/code/request"
CODE_CONFIRM_URL = "/_allauth/browser/v1/auth/code/confirm"


class SessionBackendCoherenceTests(TestCase):
    """Guards the config that caused email codes to be rejected in production.

    A read-through session cache (`cached_db`) served by a per-process cache is
    incoherent under gunicorn: worker A can hand back a session snapshot taken
    before worker B wrote to it. allauth stashes the pending login stage in the
    session between /auth/code/request and /auth/code/confirm, so losing that
    write makes confirm 409.
    """

    NON_SHARED_BACKENDS = (
        "django.core.cache.backends.locmem.LocMemCache",
        "django.core.cache.backends.dummy.DummyCache",
        "django.core.cache.backends.filebased.FileBasedCache",
    )

    def test_cached_sessions_require_a_shared_cache(self):
        if "cached" not in settings.SESSION_ENGINE:
            return

        backend = settings.CACHES["default"]["BACKEND"]
        self.assertNotIn(
            backend,
            self.NON_SHARED_BACKENDS,
            f"SESSION_ENGINE={settings.SESSION_ENGINE} reads sessions through the "
            f"cache, but {backend} is not shared between gunicorn workers. "
            "Either point REDIS_URL at a shared cache or use "
            "qsessions.backends.db.",
        )

    def test_session_engine_tracks_redis_availability(self):
        if settings.REDIS_URL:
            self.assertEqual(settings.SESSION_ENGINE, "qsessions.backends.cached_db")
        else:
            self.assertEqual(settings.SESSION_ENGINE, "qsessions.backends.db")


@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
class LoginByCodeFlowTests(TestCase):
    """End-to-end cover for the flow that was returning 409."""

    def setUp(self):
        self.user = User.objects.create(email="code-login@example.com")
        self.user.set_unusable_password()
        self.user.save()
        self.user.emailaddress_set.create(
            email=self.user.email, verified=True, primary=True
        )

    def _csrf_token(self):
        # allauth's headless config endpoint seeds the csrftoken cookie.
        self.client.get("/_allauth/browser/v1/config")
        return self.client.cookies["csrftoken"].value

    def _post(self, url, payload):
        return self.client.post(
            url,
            payload,
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self._csrf_token(),
        )

    def test_requested_code_is_accepted_by_confirm(self):
        response = self._post(CODE_REQUEST_URL, {"email": self.user.email})
        self.assertIn(response.status_code, (200, 401))
        self.assertEqual(len(mail.outbox), 1)

        # allauth formats the code in groups, e.g. "BPLG-LGTW".
        match = re.search(r"\b([A-Z0-9]{4}-[A-Z0-9]{4})\b", mail.outbox[0].body)
        self.assertIsNotNone(
            match, f"no sign-in code in email body:\n{mail.outbox[0].body}"
        )
        code = match.group(1)

        response = self._post(CODE_CONFIRM_URL, {"code": code})

        self.assertNotEqual(
            response.status_code,
            409,
            "confirm could not find the pending login stage stashed by request — "
            "the session did not survive between the two calls",
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["meta"]["is_authenticated"])
