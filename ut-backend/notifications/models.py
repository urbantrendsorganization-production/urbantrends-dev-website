from django.conf import settings
from django.db import models


class Notification(models.Model):
    """An in-app notification shown under the bell in the site header.

    One row per recipient. Staff-facing events (new order, customer message)
    fan out to a row per staff member; customer-facing events (status change,
    staff reply, invoice) create a single row for the order's customer.
    """

    KIND_CHOICES = [
        ('new_order',      'New order'),
        ('order_status',   'Order status changed'),
        ('order_message',  'New message'),
        ('invoice',        'Invoice issued'),
        ('review',         'New review'),
    ]

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
    )
    kind = models.CharField(max_length=20, choices=KIND_CHOICES)
    title = models.CharField(max_length=200)
    body = models.CharField(max_length=500, blank=True)
    # A frontend-relative path the bell links to, e.g. /portal/orders/5
    url = models.CharField(max_length=300, blank=True)
    order = models.ForeignKey(
        'services.Order',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='notifications',
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read']),
        ]

    def __str__(self):
        return f'{self.get_kind_display()} → {self.recipient.email}'
