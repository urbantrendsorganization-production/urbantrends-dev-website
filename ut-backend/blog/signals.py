from django.conf import settings
from django.core.mail import send_mail
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Subscription

FRONTEND = settings.FRONTEND_BASE_URL
FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif"


def _welcome_html(email):
    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:{FONT};-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:48px 16px 56px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="max-width:560px;">

          <tr>
            <td style="padding-bottom:24px;">
              <span style="font-size:16px;font-weight:700;color:#111111;
                           letter-spacing:-0.03em;font-family:{FONT};">
                UrbanTrends
              </span>
            </td>
          </tr>

          <tr>
            <td style="background:#ffffff;border-radius:12px;border:1px solid #e4e4e7;overflow:hidden;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td height="4" bgcolor="#34D399"
                      style="font-size:0;line-height:0;background-color:#34D399;">&nbsp;</td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:32px 32px 36px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.1em;
                              text-transform:uppercase;color:#888888;font-family:{FONT};">
                      UrbanTrends Blog
                    </p>
                    <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#111111;
                               line-height:1.2;font-family:{FONT};">
                      You&rsquo;re subscribed.
                    </h1>
                    <p style="margin:0 0 24px;font-size:15px;color:#555555;line-height:1.7;
                              font-family:{FONT};">
                      Thanks for subscribing to the UrbanTrends blog. We write about engineering
                      decisions, product thinking, and building software for East Africa.
                      You&rsquo;ll hear from us when something worth reading goes up &mdash; no noise.
                    </p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                           border="0" style="margin-top:8px;">
                      <tr>
                        <td>
                          <a href="{FRONTEND}/blog"
                             style="display:inline-block;background:#111111;color:#ffffff;
                                    font-size:14px;font-weight:600;text-decoration:none;
                                    padding:13px 26px;border-radius:8px;font-family:{FONT};">
                            Browse the blog &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 0 0;text-align:center;font-family:{FONT};">
              <p style="margin:0 0 6px;font-size:12px;color:#aaaaaa;">
                UrbanTrends &middot; Nairobi, Kenya
              </p>
              <p style="margin:0;font-size:12px;color:#aaaaaa;">
                <a href="{FRONTEND}/blog" style="color:#aaaaaa;text-decoration:underline;">
                  Visit the blog
                </a>
                &nbsp;&middot;&nbsp;
                <a href="{FRONTEND}/contact" style="color:#aaaaaa;text-decoration:underline;">
                  Contact us
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


@receiver(post_save, sender=Subscription)
def send_welcome_email(sender, instance, created, **kwargs):
    if not created:
        return
    send_mail(
        subject='You\'re subscribed to the UrbanTrends blog',
        message=(
            f'Hi {instance.email},\n\n'
            f'Thanks for subscribing! We write about engineering, product thinking, '
            f'and building software for East Africa.\n\n'
            f'Read the blog: {FRONTEND}/blog\n\n'
            f'— UrbanTrends team'
        ),
        html_message=_welcome_html(instance.email),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[instance.email],
        fail_silently=True,
    )
