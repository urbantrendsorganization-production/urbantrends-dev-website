from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from .models import GmailCredential, GmailThread, GmailMessage


@admin.register(GmailCredential)
class GmailCredentialAdmin(admin.ModelAdmin):
    readonly_fields = ('connected_email', 'token_expiry', 'created_at', 'updated_at', 'connect_link')
    fields = ('connected_email', 'token_expiry', 'connect_link', 'created_at', 'updated_at')

    def has_add_permission(self, request):
        return not GmailCredential.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser

    @admin.display(description='Connect / Re-authorise')
    def connect_link(self, obj):
        return mark_safe(
            '<a class="button" href="/api/gmail/auth" '
            'style="padding:6px 16px;background:#22D3EE;color:#000;border-radius:6px;'
            'text-decoration:none;font-weight:600;font-size:13px;">Connect Gmail →</a>'
        )


class GmailMessageInline(admin.TabularInline):
    model = GmailMessage
    fields = ('from_email', 'sent_at', 'has_attachments', 'body_snippet')
    readonly_fields = fields
    extra = 0
    max_num = 0
    can_delete = False
    ordering = ('sent_at',)

    @admin.display(description='Message preview')
    def body_snippet(self, obj):
        text = obj.body_text
        if len(text) > 120:
            text = text[:120] + '…'
        return text or '(empty)'


@admin.register(GmailThread)
class GmailThreadAdmin(admin.ModelAdmin):
    list_display  = ('subject_display', 'from_email', 'client_link', 'order_link',
                     'last_message_at', 'read_badge', 'message_count')
    list_filter   = ('is_read', 'is_starred', 'is_archived')
    search_fields = ('subject', 'from_email', 'snippet')
    readonly_fields = ('thread_id', 'subject', 'snippet', 'from_email', 'to_emails',
                       'message_count', 'last_message_at', 'has_attachments', 'labels',
                       'is_read', 'is_starred', 'synced_at')
    inlines = [GmailMessageInline]
    actions = ['sync_inbox_action']
    fieldsets = (
        ('Thread', {
            'fields': ('thread_id', 'subject', 'snippet', 'from_email', 'to_emails',
                       'message_count', 'last_message_at', 'has_attachments',
                       'labels', 'is_read', 'is_starred', 'synced_at'),
        }),
        ('Links & Notes', {
            'fields': ('client', 'order', 'notes', 'is_archived'),
        }),
    )

    @admin.display(description='Subject')
    def subject_display(self, obj):
        subject = obj.subject or '(no subject)'
        if not obj.is_read:
            return format_html('<strong>{}</strong>', subject[:80])
        return subject[:80]

    @admin.display(description='Client')
    def client_link(self, obj):
        if not obj.client:
            return '—'
        return format_html(
            '<a href="/admin/contracts/client/{}/change/">{}</a>',
            obj.client.pk, obj.client.name,
        )

    @admin.display(description='Order')
    def order_link(self, obj):
        if not obj.order:
            return '—'
        return format_html(
            '<a href="/admin/services/order/{}/change/">#{}</a>',
            obj.order.pk, obj.order.pk,
        )

    @admin.display(description='Read')
    def read_badge(self, obj):
        if obj.is_read:
            return format_html(
                '<span style="background:#d1fae5;color:#065f46;padding:2px 8px;'
                'border-radius:12px;font-size:11px;font-weight:700;">Read</span>'
            )
        return format_html(
            '<span style="background:#dbeafe;color:#1e40af;padding:2px 8px;'
            'border-radius:12px;font-size:11px;font-weight:700;">Unread</span>'
        )

    @admin.action(description='Sync inbox from Gmail')
    def sync_inbox_action(self, request, queryset):
        from .api import sync_inbox
        try:
            count = sync_inbox(max_results=100)
            self.message_user(request, f'{count} thread(s) synced from Gmail.')
        except Exception as exc:
            self.message_user(request, str(exc), level='error')
