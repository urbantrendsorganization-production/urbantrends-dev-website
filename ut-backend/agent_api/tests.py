"""End-to-end tests for the Mica agent API.

Covers the load-bearing flows: catalog + form, deterministic quote (rules engine
and PricingPlan fallback), quote→order with session scoping and idempotency,
orders read-back, KB/sitemap whitelists with ETag caching, ticket escalation,
and service-key auth enforcement.
"""
from importlib import import_module

from django.conf import settings
from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings

from services.models import PricingPlan, Service, ServiceCategory

from .models import AgentQuote, KBArticle, SupportTicket
from .models import AgentServiceConfig

User = get_user_model()


def make_session_for(user) -> str:
    """Create a real session carrying this user and return its key, to forward
    as ``X-UT-Session`` exactly as the host site would."""
    engine = import_module(settings.SESSION_ENGINE)
    store = engine.SessionStore()
    store['_auth_user_id'] = str(user.pk)
    store.create()
    return store.session_key


class AgentApiTests(TestCase):
    def setUp(self):
        self.cat = ServiceCategory.objects.create(name='Web', slug='web')
        self.landing = Service.objects.create(
            category=self.cat, name='Landing page', slug='landing_page',
            tagline='A marketing site / landing page.', description='…',
            is_active=True,
        )
        AgentServiceConfig.objects.create(
            service=self.landing,
            aliases=['landing page', 'website'],
            form={
                'title': 'Landing page — project brief',
                'fields': [
                    {'name': 'pages', 'type': 'integer', 'label': 'Pages',
                     'required': True, 'min': 1, 'max': 8, 'default': 1},
                    {'name': 'copywriting', 'type': 'boolean',
                     'label': 'Copywriting?', 'default': False},
                ],
            },
            pricing_rules={
                'base': '25000',
                'base_label': 'Base landing page',
                'rules': [
                    {'kind': 'per_unit', 'field': 'pages', 'label': 'Extra pages',
                     'unit': '8000', 'included': 1},
                    {'kind': 'flag', 'field': 'copywriting', 'label': 'Copywriting',
                     'amount': '12000'},
                ],
            },
        )
        # A second service priced only by a fixed plan (fallback path).
        self.branding = Service.objects.create(
            category=self.cat, name='Branding', slug='branding',
            tagline='Logo & identity.', description='…', is_active=True,
        )
        PricingPlan.objects.create(service=self.branding, name='Starter', price='40000')

        self.user = User.objects.create_user(email='amina@example.com', password='x')

    # ── Catalog ──────────────────────────────────────────────────────────
    def test_services_catalog(self):
        r = self.client.get('/api/v1/agent/services')
        self.assertEqual(r.status_code, 200)
        keys = {s['key'] for s in r.json()['services']}
        self.assertEqual(keys, {'landing_page', 'branding'})
        landing = next(s for s in r.json()['services'] if s['key'] == 'landing_page')
        self.assertEqual(landing['aliases'], ['landing page', 'website'])
        self.assertEqual(landing['form']['fields'][0]['name'], 'pages')

    def test_catalog_is_cacheable(self):
        r1 = self.client.get('/api/v1/agent/services')
        etag = r1['ETag']
        self.assertTrue(etag)
        r2 = self.client.get('/api/v1/agent/services', HTTP_IF_NONE_MATCH=etag)
        self.assertEqual(r2.status_code, 304)

    # ── Quote (deterministic money) ──────────────────────────────────────
    def test_quote_from_rules(self):
        r = self.client.post(
            '/api/v1/agent/services/landing_page/quote',
            data={'params': {'pages': 3, 'copywriting': True}},
            content_type='application/json',
        )
        self.assertEqual(r.status_code, 200)
        body = r.json()
        self.assertEqual(body['amount'], '53000')  # 25000 + 2×8000 + 12000
        self.assertEqual(sum(int(l['amount']) for l in body['breakdown']), 53000)
        self.assertTrue(body['quote_id'].startswith('q_'))

    def test_quote_validation_error(self):
        r = self.client.post(
            '/api/v1/agent/services/landing_page/quote',
            data={'params': {'pages': 99}},
            content_type='application/json',
        )
        self.assertEqual(r.status_code, 422)
        self.assertEqual(r.json()['error']['code'], 'invalid_params')
        self.assertIn('pages', r.json()['error']['fields'])

    def test_quote_fallback_to_plan(self):
        r = self.client.post(
            '/api/v1/agent/services/branding/quote',
            data={'params': {'requirements': 'Logo and brand kit'}},
            content_type='application/json',
        )
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json()['amount'], '40000')

    # ── Orders ───────────────────────────────────────────────────────────
    def _quote_id(self):
        r = self.client.post(
            '/api/v1/agent/services/landing_page/quote',
            data={'params': {'pages': 3, 'copywriting': True}},
            content_type='application/json',
        )
        return r.json()['quote_id']

    def test_order_requires_session(self):
        r = self.client.post(
            '/api/v1/agent/orders',
            data={'quote_id': self._quote_id()}, content_type='application/json',
        )
        self.assertEqual(r.status_code, 401)

    def test_order_from_quote(self):
        qid = self._quote_id()
        sid = make_session_for(self.user)
        r = self.client.post(
            '/api/v1/agent/orders',
            data={'quote_id': qid}, content_type='application/json',
            HTTP_X_UT_SESSION=sid,
        )
        self.assertEqual(r.status_code, 201, r.content)
        body = r.json()
        self.assertEqual(body['status'], 'pending')
        self.assertEqual(body['amount'], '53000')
        self.assertEqual(self.user.orders.count(), 1)
        self.assertEqual(AgentQuote.objects.get(quote_id=qid).order_id, self.user.orders.first().pk)

    def test_order_idempotency(self):
        qid = self._quote_id()
        sid = make_session_for(self.user)
        headers = {'HTTP_X_UT_SESSION': sid, 'HTTP_IDEMPOTENCY_KEY': 'abc-123'}
        r1 = self.client.post('/api/v1/agent/orders', data={'quote_id': qid},
                              content_type='application/json', **headers)
        # A repeat with a fresh quote but same key replays the first result.
        qid2 = self._quote_id()
        r2 = self.client.post('/api/v1/agent/orders', data={'quote_id': qid2},
                              content_type='application/json', **headers)
        self.assertEqual(r1.json()['order_id'], r2.json()['order_id'])
        self.assertEqual(self.user.orders.count(), 1)

    def test_orders_mine(self):
        qid = self._quote_id()
        sid = make_session_for(self.user)
        self.client.post('/api/v1/agent/orders', data={'quote_id': qid},
                         content_type='application/json', HTTP_X_UT_SESSION=sid)
        r = self.client.get('/api/v1/agent/orders/mine', HTTP_X_UT_SESSION=sid)
        self.assertEqual(r.status_code, 200)
        orders = r.json()['orders']
        self.assertEqual(len(orders), 1)
        self.assertEqual(orders[0]['amount'], '53000')
        self.assertTrue(orders[0]['ref'].startswith('UT-ORD-'))

    def test_expired_quote_rejected(self):
        from django.utils import timezone
        from datetime import timedelta
        qid = self._quote_id()
        AgentQuote.objects.filter(quote_id=qid).update(
            expires_at=timezone.now() - timedelta(hours=1))
        sid = make_session_for(self.user)
        r = self.client.post('/api/v1/agent/orders', data={'quote_id': qid},
                             content_type='application/json', HTTP_X_UT_SESSION=sid)
        self.assertEqual(r.status_code, 409)
        self.assertEqual(r.json()['error']['code'], 'quote_expired')

    # ── KB / sitemap ─────────────────────────────────────────────────────
    def test_kb_articles(self):
        r = self.client.get('/api/v1/agent/kb/articles')
        self.assertEqual(r.status_code, 200)
        keys = {a['key'] for a in r.json()['articles']}
        self.assertIn('payment_methods', keys)

    def test_sitemap(self):
        r = self.client.get('/api/v1/agent/sitemap')
        self.assertEqual(r.status_code, 200)
        keys = {d['key'] for d in r.json()['destinations']}
        self.assertIn('signin', keys)
        self.assertIn('orders', keys)

    # ── Tickets ──────────────────────────────────────────────────────────
    def test_create_ticket(self):
        r = self.client.post(
            '/api/v1/agent/tickets',
            data={'subject': 'Refund on order UT-ORD-1', 'category': 'billing',
                  'reason': 'agent_handoff',
                  'transcript': [{'role': 'user', 'text': 'I need a refund'}]},
            content_type='application/json',
        )
        self.assertEqual(r.status_code, 201, r.content)
        self.assertTrue(r.json()['ref'].startswith('UT-'))
        self.assertEqual(SupportTicket.objects.count(), 1)

    def test_ticket_bad_category(self):
        r = self.client.post(
            '/api/v1/agent/tickets',
            data={'subject': 'x', 'category': 'nonsense'},
            content_type='application/json',
        )
        self.assertEqual(r.status_code, 422)

    # ── Service auth ─────────────────────────────────────────────────────
    @override_settings(URBANTRENDS_API_KEY='s3cret')
    def test_service_key_enforced(self):
        anon = self.client.get('/api/v1/agent/services')
        self.assertEqual(anon.status_code, 403)
        bad = self.client.get('/api/v1/agent/services', HTTP_AUTHORIZATION='Bearer nope')
        self.assertEqual(bad.status_code, 403)
        ok = self.client.get('/api/v1/agent/services', HTTP_AUTHORIZATION='Bearer s3cret')
        self.assertEqual(ok.status_code, 200)
