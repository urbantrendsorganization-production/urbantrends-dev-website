"""
python manage.py check_services

Probes all active ServiceStatus endpoints, persists results to the database,
and emails STAFF_NOTIFICATION_EMAIL when a service's status changes.

Run periodically via cron:
    */5 * * * * /path/to/venv/bin/python manage.py check_services
"""

import time
import requests as http_requests

from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone

from cms.models import ServiceStatus


def probe(url: str, timeout: int = 6) -> tuple[str, int | None]:
    """Return (status_str, response_ms)."""
    start = time.monotonic()
    try:
        resp = http_requests.get(url, timeout=timeout)
        ms = round((time.monotonic() - start) * 1000)
        if resp.status_code < 400:
            return 'operational', ms
        elif resp.status_code < 500:
            return 'degraded', ms
        else:
            return 'down', ms
    except Exception:
        return 'down', None


class Command(BaseCommand):
    help = 'Probe all active service endpoints and persist results. Emails on status change.'

    def handle(self, *args, **options):
        services = ServiceStatus.objects.filter(is_active=True)

        if not services.exists():
            self.stdout.write('No active services to check.')
            return

        alerts = []

        for svc in services:
            prev_status = svc.last_status
            new_status, ms = probe(svc.url)

            if new_status in ('down', 'degraded'):
                svc.consecutive_fails += 1
            else:
                svc.consecutive_fails = 0

            svc.last_status     = new_status
            svc.last_response_ms = ms
            svc.last_checked_at  = timezone.now()
            svc.save(update_fields=['last_status', 'last_response_ms', 'last_checked_at', 'consecutive_fails'])

            symbol = '✓' if new_status == 'operational' else '✗'
            self.stdout.write(
                f'  {symbol} {svc.name}: {new_status}'
                + (f' ({ms}ms)' if ms else '')
            )

            if prev_status in ('operational', 'unknown') and new_status in ('down', 'degraded'):
                alerts.append(f'{svc.name} → {new_status}')
            elif prev_status in ('down', 'degraded') and new_status == 'operational':
                alerts.append(f'{svc.name} recovered → operational')

        if alerts:
            self._send_alert(alerts)

        self.stdout.write(self.style.SUCCESS(f'Done. {len(alerts)} status change(s) detected.'))

    def _send_alert(self, alerts: list[str]) -> None:
        recipient = getattr(settings, 'STAFF_NOTIFICATION_EMAIL', settings.DEFAULT_FROM_EMAIL)
        subject   = f'[UrbanTrends] Service alert — {len(alerts)} change(s)'
        body      = (
            'Service status changes detected:\n\n'
            + '\n'.join(f'  · {a}' for a in alerts)
            + '\n\nView details: '
            + getattr(settings, 'FRONTEND_BASE_URL', 'http://localhost:3000')
            + '/status'
        )
        try:
            send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [recipient], fail_silently=True)
        except Exception as exc:
            self.stderr.write(f'Email failed: {exc}')
