"""Agent-facing endpoints under ``/api/v1/agent/`` that Mica calls to source
real business data and perform real actions. See BACKEND_APIS.md.

Every view authenticates the *service* (bearer key); user-scoped views also
resolve the visitor from the forwarded ``X-UT-Session`` and never trust a
caller-supplied customer id for authorization.
"""
import re
from datetime import timedelta
from decimal import Decimal

from django.conf import settings
from django.db import IntegrityError, transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from services.models import Invoice, Order, Service

from .common import (
    AgentView,
    cacheable,
    error,
    iso,
    resolve_session_user,
    shillings,
)
from .forms import ParamError, form_for, validate_params
from .models import (
    AgentQuote,
    IdempotentRequest,
    KBArticle,
    SitemapDestination,
    SupportTicket,
)
from .pricing import QuoteUnavailable, compute

QUOTE_TTL = timedelta(hours=getattr(settings, 'AGENT_QUOTE_TTL_HOURS', 24))


# ── Helpers ─────────────────────────────────────────────────────────────────

def _service_dict(service: Service) -> dict:
    config = getattr(service, 'agent_config', None)
    aliases = list(config.aliases) if config and config.aliases else []
    return {
        'key': service.slug,
        'label': service.name,
        'description': service.tagline or service.description,
        'aliases': aliases,
        'form': form_for(service),
    }


def _agent_services():
    """Active, agent-enabled services. A service is exposed unless it has a
    config explicitly marked inactive."""
    return (
        Service.objects.filter(is_active=True)
        .exclude(agent_config__is_active=False)
        .select_related('category', 'agent_config')
        .prefetch_related('plans')
        .order_by('order', 'name')
    )


def _breakdown_wire(breakdown: list[dict]) -> list[dict]:
    return [{'label': line['label'], 'amount': shillings(line['amount'])} for line in breakdown]


def _quote_dict(quote: AgentQuote) -> dict:
    return {
        'quote_id': quote.quote_id,
        'currency': quote.currency,
        'amount': shillings(quote.amount),
        'breakdown': _breakdown_wire(quote.breakdown),
        'expires_at': iso(quote.expires_at),
    }


def _order_amount(order: Order):
    """Best available amount for an order: its invoice total, else the linked
    agent quote. Returns a whole-shilling string or ``""`` when unknown."""
    invoice = Invoice.objects.filter(order=order).first()
    if invoice is not None:
        return shillings(invoice.total)
    quote = order.agent_quotes.order_by('-created_at').first()
    if quote is not None:
        return shillings(quote.amount)
    return ''


def _order_dict(order: Order, *, with_breakdown: bool = False) -> dict:
    data = {
        'order_id': f'ord_{order.pk}',
        'ref': f'UT-ORD-{order.pk}',
        'service': order.service.slug,
        'status': order.status,
        'currency': 'KES',
        'amount': _order_amount(order),
        'created_at': iso(order.created_at),
    }
    if with_breakdown:
        quote = order.agent_quotes.order_by('-created_at').first()
        if quote is not None:
            data['breakdown'] = _breakdown_wire(quote.breakdown)
    return data


_REF_DIGITS = re.compile(r'(\d+)\s*$')


def _pk_from_ref(ref: str):
    match = _REF_DIGITS.search(ref or '')
    return int(match.group(1)) if match else None


def _idempotent(request, endpoint, producer):
    """Run ``producer() -> (status_code, body)`` at most once per
    Idempotency-Key. A repeat with the same key replays the stored result."""
    key = request.headers.get('Idempotency-Key', '').strip()
    if not key:
        code, body = producer()
        return Response(body, status=code)

    scoped = f'{endpoint}:{key}'
    existing = IdempotentRequest.objects.filter(key=scoped).first()
    if existing is not None:
        return Response(existing.response, status=existing.status_code)

    code, body = producer()
    try:
        IdempotentRequest.objects.create(
            key=scoped, endpoint=endpoint, status_code=code, response=body,
        )
    except IntegrityError:
        # Concurrent duplicate — replay the winner.
        existing = IdempotentRequest.objects.filter(key=scoped).first()
        if existing is not None:
            return Response(existing.response, status=existing.status_code)
    return Response(body, status=code)


# ── §2 Catalog ──────────────────────────────────────────────────────────────

class ServicesView(AgentView, APIView):
    """GET /api/v1/agent/services — full sellable catalog + requirement forms."""

    def get(self, request):
        payload = {'services': [_service_dict(s) for s in _agent_services()]}
        return cacheable(payload, request)


class ServiceDetailView(AgentView, APIView):
    """GET /api/v1/agent/services/{key} — one service (convenience)."""

    def get(self, request, key):
        service = _agent_services().filter(slug=key).first()
        if service is None:
            return error('not_found', 'Unknown service.', status=404)
        return cacheable(_service_dict(service), request)


# ── §3 Quote (deterministic money) ──────────────────────────────────────────

class QuoteView(AgentView, APIView):
    """POST /api/v1/agent/services/{key}/quote — authoritative price."""

    def post(self, request, key):
        service = _agent_services().filter(slug=key).first()
        if service is None:
            return error('not_found', 'Unknown service.', status=404)

        form = form_for(service)
        try:
            params = validate_params(form, request.data.get('params', {}))
        except ParamError as exc:
            return error('invalid_params', 'One or more fields are invalid.',
                         status=422, fields=exc.fields)

        try:
            breakdown = compute(service, params)
        except QuoteUnavailable as exc:
            return error('quote_unavailable', str(exc), status=422)

        amount = sum((line['amount'] for line in breakdown), start=Decimal('0'))
        quote = AgentQuote.objects.create(
            service=service,
            params=params,
            amount=amount,
            breakdown=[{'label': l['label'], 'amount': str(l['amount'])} for l in breakdown],
            customer=resolve_session_user(request),
            expires_at=timezone.now() + QUOTE_TTL,
        )
        return Response(_quote_dict(quote), status=200)


# ── §4 Orders ───────────────────────────────────────────────────────────────

def _requirements_text(service: Service, params: dict) -> str:
    lines = [f'Order placed via Mica for "{service.name}".', '', 'Requirements:']
    if params:
        for name, value in params.items():
            lines.append(f'  • {name}: {value}')
    else:
        lines.append('  • (none collected)')
    return '\n'.join(lines)


class OrdersView(AgentView, APIView):
    """POST /api/v1/agent/orders — create a pending order after a confirmed quote."""

    def post(self, request):
        user = resolve_session_user(request)
        if user is None:
            return error('not_authenticated',
                         'Sign-in required to place an order.', status=401)

        quote = None
        quote_id = request.data.get('quote_id')
        if quote_id:
            quote = AgentQuote.objects.select_related('service').filter(quote_id=quote_id).first()
            if quote is None:
                return error('not_found', 'Unknown quote.', status=404)
            if quote.expires_at <= timezone.now():
                return error('quote_expired', 'That quote has expired.', status=409)
            service = quote.service
            params = quote.params
        else:
            service = _agent_services().filter(slug=request.data.get('service')).first()
            if service is None:
                return error('invalid_params', 'Unknown or missing service.',
                             status=422, fields={'service': 'required'})
            try:
                params = validate_params(form_for(service), request.data.get('params', {}))
            except ParamError as exc:
                return error('invalid_params', 'One or more fields are invalid.',
                             status=422, fields=exc.fields)

        def create():
            with transaction.atomic():
                order = Order.objects.create(
                    customer=user,
                    service=service,
                    status='pending',
                    requirements=_requirements_text(service, params),
                )
                if quote is not None:
                    quote.order = order
                    quote.customer = quote.customer or user
                    quote.save(update_fields=['order', 'customer'])
            body = _order_dict(order, with_breakdown=True)
            return 201, body

        return _idempotent(request, 'orders', create)


class OrdersMineView(AgentView, APIView):
    """GET /api/v1/agent/orders/mine — the visitor's orders."""

    def get(self, request):
        user = resolve_session_user(request)
        if user is None:
            return error('not_authenticated', 'Sign-in required.', status=401)
        orders = (
            Order.objects.filter(customer=user)
            .select_related('service')
            .prefetch_related('agent_quotes')
        )
        return Response({'orders': [_order_dict(o) for o in orders]})


class OrderDetailView(AgentView, APIView):
    """GET /api/v1/agent/orders/{ref} — single order, scoped to the visitor."""

    def get(self, request, ref):
        user = resolve_session_user(request)
        if user is None:
            return error('not_authenticated', 'Sign-in required.', status=401)
        pk = _pk_from_ref(ref)
        order = Order.objects.filter(pk=pk, customer=user).select_related('service').first() if pk else None
        if order is None:
            return error('not_found', 'Unknown order.', status=404)
        return Response(_order_dict(order, with_breakdown=True))


# ── §5 Knowledge base ───────────────────────────────────────────────────────

class KBArticlesView(AgentView, APIView):
    """GET /api/v1/agent/kb/articles — whitelisted support answers."""

    def get(self, request):
        articles = [
            {
                'key': a.key,
                'title': a.title,
                'answer': a.answer,
                'aliases': list(a.aliases or []),
                'tags': list(a.tags or []),
            }
            for a in KBArticle.objects.filter(is_active=True)
        ]
        return cacheable({'articles': articles}, request)


# ── §6 Sitemap ──────────────────────────────────────────────────────────────

class SitemapView(AgentView, APIView):
    """GET /api/v1/agent/sitemap — whitelisted deep-link destinations."""

    def get(self, request):
        destinations = [
            {
                'key': d.key,
                'path': d.path,
                'label': d.label,
                'aliases': list(d.aliases or []),
            }
            for d in SitemapDestination.objects.filter(is_active=True)
        ]
        return cacheable({'destinations': destinations}, request)


# ── §7 Support tickets ──────────────────────────────────────────────────────

VALID_CATEGORIES = {c[0] for c in SupportTicket.CATEGORY_CHOICES}
VALID_REASONS = {r[0] for r in SupportTicket.REASON_CHOICES}


class TicketsView(AgentView, APIView):
    """POST /api/v1/agent/tickets — escalate to a human with the transcript."""

    def post(self, request):
        data = request.data
        subject = (data.get('subject') or '').strip()
        if not subject:
            return error('invalid_params', 'A subject is required.',
                         status=422, fields={'subject': 'required'})

        category = data.get('category', 'general')
        if category not in VALID_CATEGORIES:
            return error('invalid_params', 'Unknown category.',
                         status=422, fields={'category': f'must be one of {sorted(VALID_CATEGORIES)}'})

        reason = data.get('reason', 'agent_handoff')
        if reason not in VALID_REASONS:
            return error('invalid_params', 'Unknown reason.',
                         status=422, fields={'reason': f'must be one of {sorted(VALID_REASONS)}'})

        user = resolve_session_user(request)

        def create():
            ticket = SupportTicket.objects.create(
                subject=subject,
                category=category,
                reason=reason,
                customer=user,
                customer_ref=(data.get('customer_ref') or '')[:254],
                session_ref=(data.get('session_ref') or '')[:64],
                transcript=data.get('transcript') or [],
            )
            self._notify_staff(ticket)
            return 201, {'ticket_id': ticket.ticket_id, 'ref': ticket.ref, 'status': ticket.status}

        return _idempotent(request, 'tickets', create)

    def _notify_staff(self, ticket: SupportTicket) -> None:
        from django.core.mail import send_mail

        base = getattr(settings, 'FRONTEND_BASE_URL', 'http://localhost:3000')
        who = ticket.customer.email if ticket.customer else (ticket.customer_ref or 'anonymous visitor')
        send_mail(
            f'[UrbanTrends] New support ticket {ticket.ref} — {ticket.subject}',
            f'Mica escalated a conversation to a human.\n\n'
            f'Ref:      {ticket.ref}\n'
            f'From:     {who}\n'
            f'Category: {ticket.get_category_display()}\n'
            f'Reason:   {ticket.get_reason_display()}\n\n'
            f'Admin: {base}/admin/agent_api/supportticket/{ticket.pk}/change/',
            settings.DEFAULT_FROM_EMAIL,
            [getattr(settings, 'STAFF_NOTIFICATION_EMAIL', settings.DEFAULT_FROM_EMAIL)],
            fail_silently=True,
        )


class TicketDetailView(AgentView, APIView):
    """GET /api/v1/agent/tickets/{ref} — status read-back."""

    def get(self, request, ref):
        pk = _pk_from_ref(ref)
        ticket = SupportTicket.objects.filter(pk=pk).first() if pk else None
        if ticket is None:
            return error('not_found', 'Unknown ticket.', status=404)
        user = resolve_session_user(request)
        # A signed-in visitor may only read their own tickets.
        if ticket.customer_id and user and ticket.customer_id != user.pk:
            return error('not_found', 'Unknown ticket.', status=404)
        return Response({'ticket_id': ticket.ticket_id, 'ref': ticket.ref, 'status': ticket.status})


# ── §1 Optional customer enrichment ─────────────────────────────────────────

class CustomerMeView(AgentView, APIView):
    """GET /api/v1/agent/customers/me — richer profile for greetings."""

    def get(self, request):
        user = resolve_session_user(request)
        if user is None:
            return error('not_authenticated', 'Sign-in required.', status=401)
        open_orders = Order.objects.filter(
            customer=user,
        ).exclude(status__in=['completed', 'cancelled']).count()
        return Response({
            'id': user.pk,
            'email': user.email,
            'display': (user.get_full_name() or '').strip() or user.email,
            'open_orders': open_orders,
        })
