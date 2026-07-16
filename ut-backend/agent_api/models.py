"""Data models backing the Mica agent API (`/api/v1/agent/…`).

These hold the agent-facing configuration and the state Mica creates when she
acts on a visitor's behalf. See ``BACKEND_APIS.md`` for the full contract.

Guardrail: money is never accepted from the caller. Quotes are computed
server-side (see ``pricing.py``) and persisted here; the order endpoint looks the
amount up by ``quote_id`` rather than trusting the request body.
"""
import secrets

from django.conf import settings
from django.db import models

from services.models import Order, Service


def _quote_id() -> str:
    return f"q_{secrets.token_hex(4)}"


class AgentServiceConfig(models.Model):
    """Agent-specific config for a sellable :class:`services.Service`.

    Holds the requirement *form* Mika renders verbatim and the *pricing rules*
    the deterministic quote engine interprets. Both are optional — when absent,
    the API falls back to a generic brief form and a flat price derived from the
    service's cheapest fixed :class:`services.PricingPlan`.
    """
    service = models.OneToOneField(
        Service, on_delete=models.CASCADE, related_name='agent_config'
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Expose this service to Mica. Inactive services are hidden "
                  "from the agent catalog.",
    )
    aliases = models.JSONField(
        default=list, blank=True,
        help_text='Natural-language aliases, e.g. ["landing page", "website"].',
    )
    form = models.JSONField(
        default=dict, blank=True,
        help_text="Requirement form schema {title, fields:[…]}. Leave empty for "
                  "a generic brief field.",
    )
    pricing_rules = models.JSONField(
        default=dict, blank=True,
        help_text='Deterministic pricing rules {base, base_label, rules:[…]}. '
                  'Leave empty to price from the cheapest fixed PricingPlan.',
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Agent service config'

    def __str__(self):
        return f"Agent config — {self.service.name}"


class AgentQuote(models.Model):
    """A server-authoritative price computed for a service + validated params.

    The ``quote_id`` is handed back to Mika; she references it when placing an
    order so the amount is looked up here, never re-sent. Mirrors the shape of
    the in-repo ``Quote.as_dict()`` on Mica's side.
    """
    quote_id = models.CharField(max_length=32, unique=True, default=_quote_id, editable=False)
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='agent_quotes')
    params = models.JSONField(default=dict)
    currency = models.CharField(max_length=3, default='KES')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    breakdown = models.JSONField(default=list)
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='agent_quotes',
    )
    order = models.ForeignKey(
        Order, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='agent_quotes',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.quote_id} — {self.service.name} ({self.currency} {self.amount})"


class KBArticle(models.Model):
    """A reviewed support answer Mika may serve verbatim (whitelist model)."""
    key = models.SlugField(unique=True, help_text="Stable topic key the model selects from.")
    title = models.CharField(max_length=200)
    answer = models.TextField(help_text="Served verbatim. The model never rewrites this.")
    aliases = models.JSONField(default=list, blank=True)
    tags = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'key']
        verbose_name = 'KB article'

    def __str__(self):
        return f"{self.key} — {self.title}"


class SitemapDestination(models.Model):
    """A whitelisted, site-relative destination Mika's `navigate` tool may use."""
    key = models.SlugField(unique=True)
    path = models.CharField(max_length=300, help_text="Site-relative path, e.g. /pricing.")
    label = models.CharField(max_length=120)
    aliases = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'key']

    def __str__(self):
        return f"{self.key} → {self.path}"


class SupportTicket(models.Model):
    """A human-escalation ticket Mika files, carrying her server-authored transcript."""
    CATEGORY_CHOICES = [
        ('order', 'Order'),
        ('billing', 'Billing'),
        ('technical', 'Technical'),
        ('general', 'General'),
        ('other', 'Other'),
    ]
    REASON_CHOICES = [
        ('agent_handoff', 'Agent hand-off'),
        ('verify_exhausted', 'Verify exhausted'),
    ]
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]

    subject = models.CharField(max_length=300)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general')
    reason = models.CharField(max_length=20, choices=REASON_CHOICES, default='agent_handoff')
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='agent_tickets',
    )
    customer_ref = models.CharField(
        max_length=254, blank=True,
        help_text="Email/handle Mica passed for anonymous or reference use.",
    )
    session_ref = models.CharField(max_length=64, blank=True)
    transcript = models.JSONField(
        default=list, blank=True,
        help_text="Server-authored by Mica from her Message log — trusted evidence.",
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.ref} — {self.subject}"

    @property
    def ref(self) -> str:
        return f"UT-{self.pk}"

    @property
    def ticket_id(self) -> str:
        return f"tkt_{self.pk}"


class IdempotentRequest(models.Model):
    """Stores the outcome of a state-changing POST so a repeated
    ``Idempotency-Key`` returns the original result instead of duplicating work.
    """
    key = models.CharField(max_length=200, unique=True)
    endpoint = models.CharField(max_length=100)
    status_code = models.PositiveSmallIntegerField()
    response = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.endpoint} — {self.key}"
