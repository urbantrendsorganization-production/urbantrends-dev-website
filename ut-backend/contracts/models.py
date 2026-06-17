import uuid
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import models, transaction
from django.utils import timezone


class Client(models.Model):
    name       = models.CharField(max_length=200)
    email      = models.EmailField(unique=True)
    company    = models.CharField(max_length=200, blank=True)
    phone      = models.CharField(max_length=30, blank=True)
    address    = models.TextField(blank=True, help_text='Billing address')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} — {self.company or self.email}"


class Receipt(models.Model):
    STATUS = [
        ('draft',     'Draft'),
        ('sent',      'Sent'),
        ('paid',      'Paid'),
        ('cancelled', 'Cancelled'),
    ]
    CURRENCIES = [
        ('KES', 'KES — Kenyan Shilling'),
        ('USD', 'USD — US Dollar'),
        ('EUR', 'EUR — Euro'),
        ('GBP', 'GBP — British Pound'),
    ]

    receipt_number = models.CharField(max_length=30, unique=True, blank=True, editable=False)
    client         = models.ForeignKey(Client, on_delete=models.PROTECT, related_name='receipts')
    title          = models.CharField(max_length=300, help_text='e.g. "Phase 1 — Product Development"')
    description    = models.TextField(blank=True, help_text='Optional project description shown on the receipt')
    line_items     = models.JSONField(
        default=list, blank=True,
        help_text=(
            'Array of line items. Format: '
            '[{"description": "Feature development", "qty": 1, "unit_price": 150000}, ...]'
        ),
    )
    currency       = models.CharField(max_length=3, choices=CURRENCIES, default='KES')
    tax_rate       = models.DecimalField(
        max_digits=5, decimal_places=2, default=16.00,
        help_text='VAT rate as a percentage (e.g. 16). Set to 0 to omit tax line.',
    )
    notes          = models.TextField(blank=True, help_text='Shown at the bottom of the receipt')
    status         = models.CharField(max_length=20, choices=STATUS, default='draft')
    issue_date     = models.DateField(default=timezone.now)
    due_date       = models.DateField(null=True, blank=True)
    paid_date      = models.DateField(null=True, blank=True)
    download_token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    sent_at        = models.DateTimeField(null=True, blank=True, editable=False)
    created_at     = models.DateTimeField(auto_now_add=True)
    repos          = models.ManyToManyField(
        'github_repos.GitHubRepo',
        blank=True,
        related_name='receipts',
        help_text='GitHub repos associated with this project',
    )
    deployment     = models.ForeignKey(
        'deployments.VercelProject',
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='receipts',
        help_text='Primary Vercel project for this receipt',
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.receipt_number or '(draft)'} — {self.client.name}"

    def clean(self):
        if self.line_items:
            for i, item in enumerate(self.line_items):
                if not isinstance(item, dict):
                    raise ValidationError(f"line_items[{i}] must be an object")
                try:
                    Decimal(str(item.get('qty', 1)))
                    Decimal(str(item.get('unit_price', 0)))
                except Exception:
                    raise ValidationError(f"line_items[{i}] qty and unit_price must be numeric")

    def save(self, *args, **kwargs):
        if not self.receipt_number:
            with transaction.atomic():
                year = timezone.now().year
                count = Receipt.objects.select_for_update().filter(
                    receipt_number__startswith=f'UT-{year}-'
                ).count()
                self.receipt_number = f'UT-{year}-{str(count + 1).zfill(4)}'
        super().save(*args, **kwargs)

    @property
    def subtotal(self):
        return round(sum(
            (Decimal(str(item.get('qty', 1))) * Decimal(str(item.get('unit_price', 0)))
             for item in (self.line_items or [])),
            Decimal('0'),
        ), 2)

    @property
    def tax_amount(self):
        return round(self.subtotal * self.tax_rate / Decimal('100'), 2)

    @property
    def total(self):
        return round(self.subtotal + self.tax_amount, 2)
