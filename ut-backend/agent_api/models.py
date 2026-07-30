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
    session_ref = models.CharField(
        max_length=64, blank=True, db_index=True,
        help_text="Mica conversation this quote belongs to (links it in the dashboard).",
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


class AgentConversation(models.Model):
    """A Mica chat session with a visitor — the container for the transcript and
    the actions Mica took. Staff read the whole story from here in the admin.

    Keyed by ``session_ref`` (Mica's session uuid) so every message, event, quote,
    order, and ticket from the same chat threads back to one row.
    """
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('ended', 'Ended'),
        ('escalated', 'Escalated'),
    ]

    session_ref = models.CharField(max_length=64, unique=True)
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='agent_conversations',
    )
    customer_ref = models.CharField(
        max_length=254, blank=True,
        help_text="Email/handle for an anonymous visitor (no account yet).",
    )
    channel = models.CharField(max_length=40, default='web_widget')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    message_count = models.PositiveIntegerField(default=0)
    started_at = models.DateTimeField(auto_now_add=True)
    last_activity_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-last_activity_at']

    def __str__(self):
        who = self.customer.email if self.customer else (self.customer_ref or 'anonymous')
        return f"{self.ref} — {who}"

    @property
    def ref(self) -> str:
        return f"CONV-{self.pk}"


class AgentMessage(models.Model):
    """One turn in a conversation. ``role`` distinguishes who spoke; ``meta``
    carries structured extras (e.g. the tool a turn invoked)."""
    ROLE_CHOICES = [
        ('user', 'Customer'),
        ('agent', 'Mica'),
        ('system', 'System'),
        ('tool', 'Tool'),
    ]

    conversation = models.ForeignKey(
        AgentConversation, on_delete=models.CASCADE, related_name='messages',
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    text = models.TextField(blank=True)
    meta = models.JSONField(default=dict, blank=True)
    client_id = models.CharField(
        max_length=64, blank=True,
        help_text="Optional Mica-side id used to de-duplicate re-sent messages.",
    )
    at = models.DateTimeField(
        null=True, blank=True, help_text="When the turn happened on Mica's side.",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['at', 'created_at']
        constraints = [
            models.UniqueConstraint(
                fields=['conversation', 'client_id'],
                condition=models.Q(client_id__gt=''),
                name='uniq_message_client_id_per_conversation',
            ),
        ]

    def __str__(self):
        return f"{self.get_role_display()} @ {self.conversation.ref}"


class AgentEvent(models.Model):
    """Append-only audit of what Mica *did* — one row per loop step / tool call.
    Gives staff the reconstructable "why" behind every action."""
    conversation = models.ForeignKey(
        AgentConversation, on_delete=models.CASCADE, null=True, blank=True,
        related_name='events',
    )
    session_ref = models.CharField(max_length=64, blank=True, db_index=True)
    kind = models.CharField(
        max_length=40,
        help_text="e.g. tool_call, tool_result, navigate, quote, order, ticket, "
                  "verify, escalation, error.",
    )
    name = models.CharField(max_length=120, blank=True, help_text="Tool/action name.")
    data = models.JSONField(default=dict, blank=True)
    ok = models.BooleanField(
        null=True, blank=True,
        help_text="Outcome for verify/action steps: passed (true) or failed (false).",
    )
    at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.kind}:{self.name}" if self.name else self.kind


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
