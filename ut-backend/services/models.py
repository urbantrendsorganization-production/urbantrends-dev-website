from decimal import Decimal

from django.conf import settings
from django.db import models
from django.utils import timezone


class ServiceCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    is_tiered = models.BooleanField(
        default=False,
        help_text="Services in this category are sold as Basic / Standard / Premium tiers.",
    )
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = 'service categories'

    def __str__(self):
        return self.name


class Service(models.Model):
    category = models.ForeignKey(
        ServiceCategory, on_delete=models.CASCADE, related_name='services'
    )
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    tagline = models.CharField(max_length=300)
    description = models.TextField()
    icon_path = models.CharField(
        max_length=500, blank=True,
        help_text="SVG path d= attribute for the service icon",
    )
    accent_color = models.CharField(
        max_length=20, default='#22D3EE',
        help_text="CSS color used for accents on this service's card",
    )
    is_active = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    is_tiered = models.BooleanField(
        default=False,
        help_text="Sell this service as Basic / Standard / Premium tiers "
                  "(also enabled automatically for tier-based categories).",
    )
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

    @property
    def uses_tiers(self):
        return self.is_tiered or (self.category_id is not None and self.category.is_tiered)


class PricingPlan(models.Model):
    BILLING_CHOICES = [
        ('one_time', 'One-time'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ]
    TIER_CHOICES = [
        ('basic', 'Basic'),
        ('standard', 'Standard'),
        ('premium', 'Premium'),
    ]
    # Rank used to order tier cards Basic → Standard → Premium.
    TIER_RANK = {'basic': 0, 'standard': 1, 'premium': 2}

    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='plans')
    tier = models.CharField(
        max_length=20, choices=TIER_CHOICES, blank=True,
        help_text="Set for services in a tier-based category. Leave blank for custom plans.",
    )
    name = models.CharField(max_length=100)
    description = models.TextField(
        blank=True,
        help_text="Short summary shown under the tier name on the pricing card.",
    )
    price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        help_text="Leave blank when is_quote=True",
    )
    billing_cycle = models.CharField(max_length=20, choices=BILLING_CHOICES, blank=True)
    is_quote = models.BooleanField(
        default=False,
        help_text="Show 'Request a quote' instead of a fixed price",
    )
    features = models.JSONField(
        default=list,
        help_text='List of feature strings, e.g. ["Feature A", "Feature B"]',
    )
    is_popular = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return f"{self.service.name} — {self.name}"


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('quoted', 'Quote Sent'),
        ('active', 'In Progress'),
        ('on_hold', 'On Hold'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='orders',
    )
    service = models.ForeignKey(Service, on_delete=models.PROTECT, related_name='orders')
    pricing_plan = models.ForeignKey(
        PricingPlan,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders',
        help_text="Null for custom-quote orders",
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    requirements = models.TextField(help_text="Customer's brief — what they need done")
    internal_notes = models.TextField(blank=True, help_text="Visible to staff only")
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_orders',
        limit_choices_to={'is_staff': True},
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Track status at load time so signals can detect actual changes.
        self._loaded_status = self.status

    def __str__(self):
        return f"Order #{self.pk} — {self.customer.email} / {self.service.name}"


class OrderMessage(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    content = models.TextField()
    is_internal = models.BooleanField(
        default=False,
        help_text="Internal notes are only visible to staff members",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Message on Order #{self.order_id} by {self.sender.email}"


class QuoteRequest(models.Model):
    BUDGET_CHOICES = [
        ('not_sure',   'Not sure yet'),
        ('under_50k',  'Under KES 50,000'),
        ('50k_200k',   'KES 50,000 – 200,000'),
        ('200k_500k',  'KES 200,000 – 500,000'),
        ('500k_1m',    'KES 500,000 – 1,000,000'),
        ('over_1m',    'Over KES 1,000,000'),
    ]
    TIMELINE_CHOICES = [
        ('flexible',   'Flexible / Not sure'),
        ('asap',       'ASAP (within 2 weeks)'),
        ('1_month',    'Within 1 month'),
        ('1_3_months', '1 – 3 months'),
        ('3_6_months', '3 – 6 months'),
        ('6_plus',     '6+ months'),
    ]
    STATUS_CHOICES = [
        ('new',       'New'),
        ('in_review', 'In Review'),
        ('replied',   'Replied'),
        ('closed',    'Closed'),
    ]

    service_name   = models.CharField(max_length=200)
    name           = models.CharField(max_length=200)
    email          = models.EmailField()
    company        = models.CharField(max_length=200, blank=True)
    phone          = models.CharField(max_length=30, blank=True)
    budget_range   = models.CharField(max_length=20, choices=BUDGET_CHOICES, default='not_sure')
    timeline       = models.CharField(max_length=20, choices=TIMELINE_CHOICES, default='flexible')
    brief          = models.TextField()
    status         = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    internal_notes = models.TextField(blank=True, help_text='Staff-only notes')
    created_at     = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Quote Request'

    def __str__(self):
        return f'{self.name} <{self.email}> — {self.service_name}'


class Invoice(models.Model):
    STATUS_CHOICES = [
        ('draft',     'Draft'),
        ('sent',      'Sent'),
        ('paid',      'Paid'),
        ('overdue',   'Overdue'),
        ('cancelled', 'Cancelled'),
    ]
    order          = models.OneToOneField(Order, on_delete=models.PROTECT, related_name='invoice')
    invoice_number = models.CharField(max_length=50, unique=True, blank=True)
    subtotal       = models.DecimalField(max_digits=12, decimal_places=2)
    tax_rate       = models.DecimalField(
        max_digits=5, decimal_places=2, default=0,
        help_text="Percentage — e.g. 16 for 16% VAT",
    )
    total          = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    currency       = models.CharField(max_length=3, default='KES')
    notes          = models.TextField(blank=True, help_text="Visible to the customer")
    status         = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    due_date       = models.DateField(null=True, blank=True)
    issued_at      = models.DateTimeField(null=True, blank=True)
    paid_at        = models.DateTimeField(null=True, blank=True)
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.invoice_number or 'Draft'} — {self.order}"

    def save(self, *args, **kwargs):
        # Auto-compute total
        self.total = (self.subtotal or Decimal(0)) * (1 + (self.tax_rate or Decimal(0)) / Decimal(100))

        # Stamp timestamps on status transitions
        if self.pk:
            try:
                prev = Invoice.objects.get(pk=self.pk)
                if prev.status != 'sent' and self.status == 'sent' and not self.issued_at:
                    self.issued_at = timezone.now()
                if prev.status != 'paid' and self.status == 'paid' and not self.paid_at:
                    self.paid_at = timezone.now()
            except Invoice.DoesNotExist:
                pass

        super().save(*args, **kwargs)

        # Generate invoice number after first save so we have the pk
        if not self.invoice_number:
            year = self.created_at.year
            self.invoice_number = f"INV-{year}-{self.pk:04d}"
            Invoice.objects.filter(pk=self.pk).update(invoice_number=self.invoice_number)


class Review(models.Model):
    """A customer's review of a completed order.

    Reviews are private until a staff member approves one; approved reviews
    surface publicly in the site's Testimonials section (see cms.HomeDataView).
    One review per order.
    """
    RATING_CHOICES = [(i, '★' * i) for i in range(1, 6)]

    order = models.OneToOneField(
        Order, on_delete=models.CASCADE, related_name='review'
    )
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews'
    )
    rating = models.PositiveSmallIntegerField(choices=RATING_CHOICES)
    comment = models.TextField(help_text="The customer's review text.")
    author_name = models.CharField(
        max_length=100, blank=True,
        help_text="Name shown publicly. Defaults to the customer's name.",
    )
    author_role = models.CharField(
        max_length=150, blank=True, help_text="e.g. 'CTO', 'Operations Lead'",
    )
    company = models.CharField(max_length=100, blank=True)
    is_approved = models.BooleanField(
        default=False,
        help_text="Approved reviews appear publicly in the Testimonials section.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Review {self.rating}★ on Order #{self.order_id} by {self.customer.email}"

    def save(self, *args, **kwargs):
        # Stamp approval time on the transition to approved.
        if self.is_approved and self.approved_at is None:
            self.approved_at = timezone.now()
        if not self.is_approved:
            self.approved_at = None
        super().save(*args, **kwargs)
