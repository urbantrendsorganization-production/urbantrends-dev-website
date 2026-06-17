from django.contrib import admin
from django.core.mail import EmailMultiAlternatives
from django.utils import timezone
from django.utils.html import format_html

from .models import Client, Receipt


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display  = ['name', 'company', 'email', 'phone', 'created_at']
    search_fields = ['name', 'email', 'company']
    ordering      = ['name']
    fieldsets = (
        ('Contact', {'fields': ('name', 'email', 'phone')}),
        ('Company', {'fields': ('company', 'address')}),
    )

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


class RepoInline(admin.TabularInline):
    model = Receipt.repos.through
    extra = 0
    verbose_name = 'Linked repository'
    verbose_name_plural = 'Linked repositories'
    autocomplete_fields = ['githubrepo']


@admin.register(Receipt)
class ReceiptAdmin(admin.ModelAdmin):
    inlines = [RepoInline]
    list_display        = [
        'receipt_number', 'client', 'title_short',
        'currency', 'total_display', 'status_badge', 'issue_date',
    ]
    list_filter         = ['status', 'currency', 'issue_date']
    search_fields       = ['receipt_number', 'client__name', 'client__email', 'title']
    ordering            = ['-created_at']
    date_hierarchy      = 'issue_date'
    readonly_fields     = [
        'receipt_number', 'download_token', 'sent_at', 'created_at',
        'totals_preview', 'download_link_display',
    ]
    actions             = ['send_receipt', 'mark_as_paid']
    fieldsets = (
        ('Client & Project', {
            'fields': ('client', 'title', 'description', 'deployment'),
        }),
        ('Line Items', {
            'fields': ('line_items',),
            'description': (
                'Enter a JSON array of line items. Each object needs three keys: '
                '<code>description</code> (string), <code>qty</code> (number), '
                '<code>unit_price</code> (number). '
                'Example: <code>[{"description": "Feature development", '
                '"qty": 1, "unit_price": 150000}]</code>'
            ),
        }),
        ('Billing', {
            'fields': ('currency', 'tax_rate', 'notes'),
        }),
        ('Dates', {
            'fields': (('issue_date', 'due_date'), 'paid_date'),
        }),
        ('Status & Tracking', {
            'fields': (
                'status', 'totals_preview',
                'receipt_number', 'download_token',
                'sent_at', 'created_at', 'download_link_display',
            ),
        }),
    )

    # ── List display helpers ───────────────────────────────────────────────────

    @admin.display(description='Project')
    def title_short(self, obj):
        return obj.title[:55] + '…' if len(obj.title) > 55 else obj.title

    @admin.display(description='Total')
    def total_display(self, obj):
        return f"{obj.currency} {obj.total:,.2f}"

    @admin.display(description='Status')
    def status_badge(self, obj):
        colours = {
            'draft':     ('#f0f0ee', '#555'),
            'sent':      ('#dbeafe', '#1d4ed8'),
            'paid':      ('#d1fae5', '#065f46'),
            'cancelled': ('#fee2e2', '#991b1b'),
        }
        bg, fg = colours.get(obj.status, ('#f0f0ee', '#555'))
        return format_html(
            '<span style="background:{};color:{};padding:3px 10px;border-radius:20px;'
            'font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;">'
            '{}</span>',
            bg, fg, obj.get_status_display(),
        )

    # ── Detail readonly fields ─────────────────────────────────────────────────

    @admin.display(description='Totals')
    def totals_preview(self, obj):
        rows = [
            ('Subtotal', f"{obj.currency} {obj.subtotal:,.2f}"),
        ]
        if obj.tax_rate:
            rows.append((f"VAT ({obj.tax_rate}%)", f"{obj.currency} {obj.tax_amount:,.2f}"))
        rows.append(('Total', f"{obj.currency} {obj.total:,.2f}"))
        cells = ''.join(
            f'<tr><td style="color:#999;padding:3px 16px 3px 0">{lbl}</td>'
            f'<td style="font-weight:{"700" if lbl == "Total" else "500"}">{val}</td></tr>'
            for lbl, val in rows
        )
        return format_html('<table style="font-size:13px">{}</table>', cells)

    @admin.display(description='Download link')
    def download_link_display(self, obj):
        if not obj.pk:
            return '—'
        from django.conf import settings as django_settings
        base = getattr(django_settings, 'FRONTEND_BASE_URL', 'http://localhost:3000')
        url  = f"{base}/api/contracts/receipt/{obj.download_token}/"
        return format_html(
            '<a href="{}" target="_blank" rel="noopener" '
            'style="color:#22D3EE;word-break:break-all;">{}</a>',
            url, url,
        )

    # ── Actions ────────────────────────────────────────────────────────────────

    @admin.action(description='Send receipt by email to client')
    def send_receipt(self, request, queryset):
        if not request.user.is_superuser:
            self.message_user(request, 'Only superusers can send receipts.', level='error')
            return
        from django.conf import settings as django_settings

        sent   = 0
        errors = []

        for receipt in queryset:
            if receipt.status == 'cancelled':
                errors.append(f'{receipt.receipt_number}: cancelled — skipped')
                continue

            base = getattr(django_settings, 'FRONTEND_BASE_URL', 'http://localhost:3000')
            url  = f"{base}/api/contracts/receipt/{receipt.download_token}"

            subject   = f"Receipt {receipt.receipt_number} — UrbanTrends"
            text_body = (
                f"Hi {receipt.client.name},\n\n"
                f"Please find your receipt from UrbanTrends.\n\n"
                f"Receipt:  {receipt.receipt_number}\n"
                f"Project:  {receipt.title}\n"
                f"Total:    {receipt.currency} {receipt.total:,.2f}\n"
                f"Date:     {receipt.issue_date}\n\n"
                f"View and download your receipt here:\n{url}\n\n"
                f"Thank you,\nUrbanTrends · Nairobi, Kenya\nhello@urbantrends.dev"
            )
            html_body = f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f2f2f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f0;padding:40px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.08);">
  <tr><td style="background:#0a0a0b;padding:28px 36px;">
    <span style="font-size:18px;font-weight:700;letter-spacing:-.02em;color:#f5f5f6;">
      urbantrends<span style="color:#22D3EE;">.dev</span>
    </span>
  </td></tr>
  <tr><td style="padding:32px 36px 8px;">
    <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;letter-spacing:-.02em;color:#0a0a0b;">Your receipt is ready.</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#666;">Hi {receipt.client.name}, here&rsquo;s your receipt for <strong>{receipt.title}</strong>.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f6;border-radius:10px;padding:18px 22px;margin-bottom:24px;">
      <tr>
        <td style="font-size:13px;color:#999;padding:4px 0;">Receipt</td>
        <td align="right" style="font-size:13px;font-weight:700;color:#0a0a0b;">{receipt.receipt_number}</td>
      </tr>
      <tr>
        <td style="font-size:13px;color:#999;padding:4px 0;">Date</td>
        <td align="right" style="font-size:13px;color:#555;">{receipt.issue_date}</td>
      </tr>
      <tr style="border-top:1px solid #e8e8e4;">
        <td style="font-size:16px;font-weight:700;color:#0a0a0b;padding-top:12px;">Total</td>
        <td align="right" style="font-size:16px;font-weight:700;color:#0a0a0b;padding-top:12px;">{receipt.currency} {receipt.total:,.2f}</td>
      </tr>
    </table>
    <a href="{url}" style="display:inline-block;background:#22D3EE;color:#04181d;text-decoration:none;font-weight:700;padding:13px 28px;border-radius:8px;font-size:15px;margin-bottom:28px;">View &amp; Download Receipt &rarr;</a>
  </td></tr>
  <tr><td style="background:#0a0a0b;padding:20px 36px;">
    <p style="margin:0;font-size:12px;color:#555;">
      UrbanTrends · Nairobi, Kenya ·
      <a href="mailto:hello@urbantrends.dev" style="color:#22D3EE;text-decoration:none;">hello@urbantrends.dev</a><br>
      <span style="color:#444;">This link is unique to this receipt — please don&rsquo;t share it publicly.</span>
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>"""

            try:
                msg = EmailMultiAlternatives(
                    subject,
                    text_body,
                    django_settings.DEFAULT_FROM_EMAIL,
                    [receipt.client.email],
                )
                msg.attach_alternative(html_body, 'text/html')
                msg.send()

                receipt.sent_at = timezone.now()
                if receipt.status == 'draft':
                    receipt.status = 'sent'
                receipt.save(update_fields=['sent_at', 'status'])
                sent += 1
            except Exception as exc:
                errors.append(f'{receipt.receipt_number}: {exc}')

        if sent:
            self.message_user(request, f'{sent} receipt{"s" if sent != 1 else ""} sent successfully.')
        for err in errors:
            self.message_user(request, err, level='error')

    @admin.action(description='Mark selected receipts as paid')
    def mark_as_paid(self, request, queryset):
        if not request.user.is_staff:
            self.message_user(request, 'You do not have permission to mark receipts as paid.', level='error')
            return
        today   = timezone.now().date()
        updated = queryset.exclude(status='cancelled').update(status='paid', paid_date=today)
        self.message_user(request, f'{updated} receipt{"s" if updated != 1 else ""} marked as paid.')
