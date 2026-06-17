from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone as tz

from utils.crypto import decrypt_token, encrypt_token


class GmailCredential(models.Model):
    access_token    = models.TextField()
    refresh_token   = models.TextField()
    token_expiry    = models.DateTimeField(default=tz.now)
    connected_email = models.EmailField()
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Gmail Credential'

    def __str__(self):
        return f"{self.connected_email} (expires {self.token_expiry})"

    def save(self, *args, **kwargs):
        self.pk = 1
        if GmailCredential.objects.exclude(pk=self.pk).exists():
            raise ValidationError('Only one GmailCredential row may exist.')
        self.access_token = encrypt_token(self.access_token or '')
        self.refresh_token = encrypt_token(self.refresh_token or '')
        super().save(*args, **kwargs)

    def get_access_token(self) -> str:
        return decrypt_token(self.access_token or '')

    def get_refresh_token(self) -> str:
        return decrypt_token(self.refresh_token or '')

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(
            pk=1,
            defaults={
                'access_token': '',
                'refresh_token': '',
                'token_expiry': tz.now(),
                'connected_email': '',
            }
        )
        return obj


class GmailThread(models.Model):
    thread_id       = models.CharField(max_length=30, unique=True)
    subject         = models.CharField(max_length=500, blank=True)
    snippet         = models.CharField(max_length=500, blank=True)
    from_email      = models.CharField(max_length=300, blank=True)
    to_emails       = models.JSONField(default=list)
    message_count   = models.PositiveIntegerField(default=0)
    last_message_at = models.DateTimeField(null=True, blank=True)
    has_attachments = models.BooleanField(default=False)
    labels          = models.JSONField(default=list)
    is_read         = models.BooleanField(default=False)
    is_starred      = models.BooleanField(default=False)
    is_archived     = models.BooleanField(default=False)
    client          = models.ForeignKey(
        'contracts.Client',
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='gmail_threads',
    )
    order           = models.ForeignKey(
        'services.Order',
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='gmail_threads',
    )
    notes           = models.TextField(blank=True)
    synced_at       = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-last_message_at']
        verbose_name = 'Gmail Thread'
        verbose_name_plural = 'Gmail Threads'

    def __str__(self):
        return f"{self.subject or '(no subject)'} — {self.from_email}"


class GmailMessage(models.Model):
    thread          = models.ForeignKey(GmailThread, on_delete=models.CASCADE, related_name='messages')
    message_id      = models.CharField(max_length=30, unique=True)
    from_email      = models.CharField(max_length=300, blank=True)
    to_emails       = models.JSONField(default=list)
    subject         = models.CharField(max_length=500, blank=True)
    body_text       = models.TextField(blank=True)
    body_html       = models.TextField(blank=True)
    sent_at         = models.DateTimeField(null=True, blank=True)
    has_attachments = models.BooleanField(default=False)

    class Meta:
        ordering = ['sent_at']
        verbose_name = 'Gmail Message'

    def __str__(self):
        return f"Message {self.message_id}"
