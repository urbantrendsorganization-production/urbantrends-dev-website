from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

from .models import Invoice, Order, OrderMessage

STAFF_EMAIL = getattr(settings, 'STAFF_NOTIFICATION_EMAIL', settings.DEFAULT_FROM_EMAIL)
FRONTEND = settings.FRONTEND_BASE_URL

STATUS_COPY = {
    'pending': (
        "We've received your order",
        "Thanks for submitting — our team will review your requirements and get back to you shortly.",
    ),
    'quoted': (
        "Your quote is ready",
        "We've reviewed your requirements and prepared a quote. Open the message thread to see the details and let us know how you'd like to proceed.",
    ),
    'active': (
        "Work has started on your order",
        "Great news — your order is now in progress. You can follow along and message us directly from your portal.",
    ),
    'on_hold': (
        "Your order is on hold",
        "We've paused work on your order. Check the message thread — our team has left a note with the next steps.",
    ),
    'completed': (
        "Your order is complete",
        "Your order has been completed. We hope everything looks great! Reach out any time if you need further work done.",
    ),
    'cancelled': (
        "Your order has been cancelled",
        "Your order has been cancelled. If this was unexpected or you have questions, reply to this email or contact us directly.",
    ),
}

STATUS_ACCENT = {
    'pending':   '#F59E0B',
    'quoted':    '#A78BFA',
    'active':    '#22D3EE',
    'on_hold':   '#FB923C',
    'completed': '#34D399',
    'cancelled': '#6B7280',
}

STATUS_BADGE_BG = {
    'pending':   '#FEF3C7',
    'quoted':    '#EDE9FE',
    'active':    '#CFFAFE',
    'on_hold':   '#FFEDD5',
    'completed': '#DCFCE7',
    'cancelled': '#F3F4F6',
}

FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif"
MONO = "'SF Mono','Fira Code','Courier New',monospace"


def _order_link(order_id):
    return f"{FRONTEND}/portal/orders/{order_id}"


def _admin_link(order_id):
    return f"{FRONTEND}/admin/services/order/{order_id}/change/"


# ─── HTML base ────────────────────────────────────────────────────────────────

def _html_base(content_html, cta_url=None, cta_label=None, accent='#34D399'):
    cta = ''
    if cta_url and cta_label:
        cta = f'''
        <tr>
          <td style="padding-top:28px;">
            <a href="{cta_url}"
               style="display:inline-block;background:#111111;color:#ffffff;font-size:14px;
                      font-weight:600;text-decoration:none;padding:13px 26px;border-radius:8px;
                      font-family:{FONT};">
              {cta_label} &rarr;
            </a>
          </td>
        </tr>'''

    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:{FONT};-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:48px 16px 56px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="max-width:560px;">

          <!-- Wordmark -->
          <tr>
            <td style="padding-bottom:24px;">
              <span style="font-size:16px;font-weight:700;color:#111111;
                           letter-spacing:-0.03em;font-family:{FONT};">
                UrbanTrends
              </span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:12px;border:1px solid #e4e4e7;
                       overflow:hidden;">

              <!-- Accent stripe -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td height="4" bgcolor="{accent}"
                      style="font-size:0;line-height:0;background-color:{accent};">&nbsp;</td>
                </tr>
              </table>

              <!-- Body -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:32px 32px 36px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      {content_html}
                      {cta}
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 0 0;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:#aaaaaa;font-family:{FONT};">
                UrbanTrends &middot; Nairobi, Kenya
              </p>
              <p style="margin:0;font-size:12px;color:#aaaaaa;font-family:{FONT};">
                <a href="{FRONTEND}/portal/orders" style="color:#aaaaaa;text-decoration:underline;">
                  My orders
                </a>
                &nbsp;&middot;&nbsp;
                <a href="{FRONTEND}/contact" style="color:#aaaaaa;text-decoration:underline;">
                  Contact support
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>'''


def _detail_row(label, value, first=False):
    border = '' if first else 'border-top:1px solid #f0f0f0;'
    return f'''
    <tr>
      <td style="padding:11px 16px;font-size:13px;color:#888888;{border}font-family:{FONT};">
        {label}
      </td>
      <td style="padding:11px 16px;font-size:13px;color:#111111;text-align:right;{border}
                 font-family:{FONT};">
        {value}
      </td>
    </tr>'''


def _total_row(label, value):
    return f'''
    <tr>
      <td style="padding:14px 16px;font-size:15px;font-weight:700;color:#ffffff;
                 background-color:#111111;font-family:{FONT};">
        {label}
      </td>
      <td style="padding:14px 16px;font-size:15px;font-weight:700;color:#ffffff;text-align:right;
                 background-color:#111111;font-family:{MONO};">
        {value}
      </td>
    </tr>'''


# ─── Invoice email ────────────────────────────────────────────────────────────

def send_invoice_email(invoice):
    order = invoice.order
    customer_email = order.customer.email
    plan_label = order.pricing_plan.name if order.pricing_plan else 'Custom'
    tax_amount = invoice.total - invoice.subtotal
    due_label = invoice.due_date.strftime('%d %B %Y') if invoice.due_date else 'Upon receipt'

    # ── Plain text fallback ──
    notes_block = f"\nNotes:\n{invoice.notes}\n" if invoice.notes else ""
    plain = (
        f"Hi {customer_email},\n\n"
        f"Your invoice is ready.\n\n"
        f"Invoice:   {invoice.invoice_number}\n"
        f"Service:   {order.service.name}\n"
        f"Plan:      {plan_label}\n"
        f"Subtotal:  {invoice.currency} {invoice.subtotal:,.2f}\n"
        f"Tax ({invoice.tax_rate}%): {invoice.currency} {tax_amount:,.2f}\n"
        f"Total:     {invoice.currency} {invoice.total:,.2f}\n"
        f"Due:       {due_label}\n"
        f"{notes_block}\n"
        f"View your order: {FRONTEND}/portal/orders/{order.pk}\n\n"
        f"— UrbanTrends team"
    )

    # ── Invoice breakdown table ──
    rows = _detail_row('Service', order.service.name, first=True)
    rows += _detail_row('Plan', plan_label)
    rows += _detail_row('Invoice number', invoice.invoice_number)

    rows += f'''
    <tr>
      <td colspan="2" style="padding:0;font-size:0;line-height:0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td height="1" bgcolor="#e4e4e7" style="font-size:0;line-height:0;">&nbsp;</td></tr>
        </table>
      </td>
    </tr>'''

    rows += _detail_row('Subtotal', f'{invoice.currency} {invoice.subtotal:,.2f}', first=True)
    if invoice.tax_rate:
        rows += _detail_row(f'Tax ({invoice.tax_rate}%)', f'{invoice.currency} {tax_amount:,.2f}')
    rows += _total_row('Total due', f'{invoice.currency} {invoice.total:,.2f}')

    notes_html = ''
    if invoice.notes:
        notes_html = f'''
        <tr>
          <td colspan="2"
              style="padding:12px 16px;font-size:13px;color:#555555;line-height:1.6;
                     background-color:#f9fafb;border-top:1px solid #f0f0f0;font-family:{FONT};">
            {invoice.notes}
          </td>
        </tr>'''

    breakdown = f'''
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="border:1px solid #e4e4e7;border-radius:10px;overflow:hidden;">
      {rows}
      {notes_html}
    </table>'''

    due_badge = f'''
    <p style="margin:20px 0 0;font-size:13px;color:#555555;font-family:{FONT};">
      <span style="font-weight:600;color:#111111;">Due by:</span> {due_label}
    </p>'''

    content = f'''
    <tr>
      <td>
        <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.1em;
                  text-transform:uppercase;color:#888888;font-family:{FONT};">
          Invoice
        </p>
        <h1 style="margin:0 0 6px;font-size:24px;font-weight:700;color:#111111;
                   line-height:1.2;font-family:{FONT};">
          {invoice.invoice_number}
        </h1>
        <p style="margin:0 0 28px;font-size:15px;color:#555555;line-height:1.6;
                  font-family:{FONT};">
          Your invoice for <strong style="color:#111111;">{order.service.name}</strong>
          is ready. Please review and reach out if you have any questions.
        </p>
        {breakdown}
        {due_badge}
      </td>
    </tr>'''

    html = _html_base(content, cta_url=f'{FRONTEND}/portal/orders/{order.pk}',
                      cta_label='View your order', accent='#34D399')

    send_mail(
        subject=f"[UrbanTrends] Invoice {invoice.invoice_number} — {order.service.name}",
        message=plain,
        html_message=html,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[customer_email],
        fail_silently=True,
    )


# ─── Signals ─────────────────────────────────────────────────────────────────

@receiver(post_save, sender=Invoice)
def auto_send_invoice_on_create(sender, instance, created, **kwargs):
    if not created:
        return

    pk = instance.pk

    def _send():
        try:
            inv = (
                Invoice.objects
                .select_related('order__customer', 'order__service', 'order__pricing_plan')
                .get(pk=pk)
            )
        except Invoice.DoesNotExist:
            return
        Invoice.objects.filter(pk=pk).update(status='sent', issued_at=timezone.now())
        inv.status = 'sent'
        inv.issued_at = timezone.now()
        send_invoice_email(inv)

    transaction.on_commit(_send)


@receiver(post_save, sender=Order)
def notify_on_order(sender, instance, created, **kwargs):
    if created:
        _notify_staff_new_order(instance)
        _notify_customer_status_change(instance)  # "We've received your order" confirmation
        instance._loaded_status = instance.status
        return

    if instance.status == instance._loaded_status:
        return

    _notify_customer_status_change(instance)
    instance._loaded_status = instance.status


def _notify_staff_new_order(order):
    plan_label = order.pricing_plan.name if order.pricing_plan else 'Custom quote'
    admin_url = _admin_link(order.pk)

    plain = (
        f"New order #{order.pk} submitted.\n\n"
        f"Customer: {order.customer.email}\n"
        f"Service:  {order.service.name}\n"
        f"Plan:     {plan_label}\n\n"
        f"Requirements:\n{order.requirements}\n\n"
        f"Manage: {admin_url}"
    )

    rows = _detail_row('Customer', order.customer.email, first=True)
    rows += _detail_row('Service', order.service.name)
    rows += _detail_row('Plan', plan_label)
    rows += _detail_row('Order', f'#{order.pk}')

    reqs_html = order.requirements.replace('\n', '<br>')

    content = f'''
    <tr>
      <td>
        <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.1em;
                  text-transform:uppercase;color:#888888;font-family:{FONT};">
          New order
        </p>
        <h1 style="margin:0 0 6px;font-size:24px;font-weight:700;color:#111111;
                   line-height:1.2;font-family:{FONT};">
          Order #{order.pk} is waiting for review
        </h1>
        <p style="margin:0 0 28px;font-size:15px;color:#555555;line-height:1.6;
                  font-family:{FONT};">
          A new service order was just submitted and needs your attention.
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="border:1px solid #e4e4e7;border-radius:10px;overflow:hidden;
                      margin-bottom:24px;">
          {rows}
        </table>
        <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:.06em;
                  text-transform:uppercase;color:#888888;font-family:{FONT};">
          Client brief
        </p>
        <div style="background:#f9fafb;border:1px solid #e4e4e7;border-radius:8px;
                    padding:16px;font-size:14px;color:#333333;line-height:1.7;
                    font-family:{FONT};">
          {reqs_html}
        </div>
      </td>
    </tr>'''

    html = _html_base(content, cta_url=admin_url, cta_label='Review in admin',
                      accent='#34D399')

    send_mail(
        subject=f"New order #{order.pk} — {order.service.name}",
        message=plain,
        html_message=html,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[STAFF_EMAIL],
        fail_silently=True,
    )


def _notify_customer_status_change(order):
    headline, body_copy = STATUS_COPY.get(
        order.status,
        (f"Order update", "Your order status has been updated."),
    )
    accent = STATUS_ACCENT.get(order.status, '#34D399')
    badge_bg = STATUS_BADGE_BG.get(order.status, '#F3F4F6')
    status_label = order.get_status_display()
    order_url = _order_link(order.pk)

    plain = (
        f"Hi {order.customer.email},\n\n"
        f"{body_copy}\n\n"
        f"Service: {order.service.name}\n"
        f"Status:  {status_label}\n\n"
        f"View your order: {order_url}\n\n"
        f"— UrbanTrends team"
    )

    content = f'''
    <tr>
      <td>
        <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.1em;
                  text-transform:uppercase;color:#888888;font-family:{FONT};">
          Order #{order.pk}
        </p>
        <h1 style="margin:0 0 20px;font-size:24px;font-weight:700;color:#111111;
                   line-height:1.2;font-family:{FONT};">
          {headline}
        </h1>
        <span style="display:inline-block;background:{badge_bg};color:{accent};
                     font-size:12px;font-weight:700;letter-spacing:.05em;
                     text-transform:uppercase;padding:5px 12px;border-radius:20px;
                     border:1px solid {accent}30;margin-bottom:24px;font-family:{FONT};">
          {status_label}
        </span>
        <p style="margin:0 0 28px;font-size:15px;color:#555555;line-height:1.7;
                  font-family:{FONT};">
          {body_copy}
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="border:1px solid #e4e4e7;border-radius:10px;overflow:hidden;">
          {_detail_row("Service", order.service.name, first=True)}
          {_detail_row("Order", f"#{order.pk}")}
        </table>
      </td>
    </tr>'''

    html = _html_base(content, cta_url=order_url, cta_label='View your order',
                      accent=accent)

    send_mail(
        subject=f"[UrbanTrends] {headline} — order #{order.pk}",
        message=plain,
        html_message=html,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[order.customer.email],
        fail_silently=True,
    )


@receiver(post_save, sender=OrderMessage)
def notify_on_message(sender, instance, created, **kwargs):
    if not created or instance.is_internal:
        return

    order = instance.order

    if instance.sender.is_staff:
        _notify_customer_new_message(order, instance)
    else:
        _notify_staff_new_message(order, instance)


def _notify_customer_new_message(order, message):
    order_url = _order_link(order.pk)
    msg_html = message.content.replace('\n', '<br>')

    plain = (
        f"Hi {order.customer.email},\n\n"
        f"The UrbanTrends team replied to your order for {order.service.name}:\n\n"
        f"  \"{message.content}\"\n\n"
        f"View the full thread: {order_url}\n\n"
        f"— UrbanTrends team"
    )

    content = f'''
    <tr>
      <td>
        <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.1em;
                  text-transform:uppercase;color:#888888;font-family:{FONT};">
          Order #{order.pk} &middot; {order.service.name}
        </p>
        <h1 style="margin:0 0 24px;font-size:24px;font-weight:700;color:#111111;
                   line-height:1.2;font-family:{FONT};">
          New message from the team
        </h1>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="border-left:3px solid #34D399;border-radius:0 8px 8px 0;
                      background:#f9fafb;margin-bottom:8px;">
          <tr>
            <td style="padding:16px 20px;font-size:15px;color:#333333;line-height:1.7;
                       font-family:{FONT};">
              {msg_html}
            </td>
          </tr>
        </table>
        <p style="margin:0 0 0;font-size:12px;color:#aaaaaa;font-family:{FONT};">
          UrbanTrends team &middot; replied to your order
        </p>
      </td>
    </tr>'''

    html = _html_base(content, cta_url=order_url, cta_label='View the thread',
                      accent='#34D399')

    send_mail(
        subject=f"[UrbanTrends] New message on your order #{order.pk}",
        message=plain,
        html_message=html,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[order.customer.email],
        fail_silently=True,
    )


def _notify_staff_new_message(order, message):
    admin_url = _admin_link(order.pk)
    msg_html = message.content.replace('\n', '<br>')

    plain = (
        f"Customer {order.customer.email} sent a message on order #{order.pk} "
        f"({order.service.name}):\n\n"
        f"  \"{message.content}\"\n\n"
        f"Manage: {admin_url}"
    )

    content = f'''
    <tr>
      <td>
        <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.1em;
                  text-transform:uppercase;color:#888888;font-family:{FONT};">
          Order #{order.pk} &middot; {order.service.name}
        </p>
        <h1 style="margin:0 0 24px;font-size:24px;font-weight:700;color:#111111;
                   line-height:1.2;font-family:{FONT};">
          Customer message
        </h1>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="border:1px solid #e4e4e7;border-radius:10px;overflow:hidden;
                      margin-bottom:20px;">
          {_detail_row("From", order.customer.email, first=True)}
          {_detail_row("Order", f"#{order.pk}")}
          {_detail_row("Service", order.service.name)}
        </table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="border-left:3px solid #A78BFA;border-radius:0 8px 8px 0;
                      background:#f9fafb;margin-bottom:8px;">
          <tr>
            <td style="padding:16px 20px;font-size:15px;color:#333333;line-height:1.7;
                       font-family:{FONT};">
              {msg_html}
            </td>
          </tr>
        </table>
      </td>
    </tr>'''

    html = _html_base(content, cta_url=admin_url, cta_label='Reply in admin',
                      accent='#A78BFA')

    send_mail(
        subject=f"[UrbanTrends] Customer message on order #{order.pk}",
        message=plain,
        html_message=html,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[STAFF_EMAIL],
        fail_silently=True,
    )
