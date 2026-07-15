"""Helpers for creating in-app notifications.

These are called from other apps' signals (see ``services/signals.py``) so the
notification-creation logic lives in one place. Import lazily inside functions
where needed to avoid app-loading circular imports.
"""

from django.contrib.auth import get_user_model

from .models import Notification


def push(recipient, *, kind, title, body='', url='', order=None):
    """Create a single notification for one recipient."""
    if recipient is None:
        return None
    return Notification.objects.create(
        recipient=recipient,
        kind=kind,
        title=title,
        body=body,
        url=url,
        order=order,
    )


def push_staff(*, kind, title, body='', url='', order=None, exclude=None):
    """Fan a notification out to every active staff member.

    ``exclude`` is an optional user (e.g. the staff member who triggered the
    event) who should not be notified about their own action.
    """
    User = get_user_model()
    staff = User.objects.filter(is_staff=True, is_active=True)
    if exclude is not None:
        staff = staff.exclude(pk=exclude.pk)

    objs = [
        Notification(
            recipient=member,
            kind=kind,
            title=title,
            body=body,
            url=url,
            order=order,
        )
        for member in staff
    ]
    if objs:
        Notification.objects.bulk_create(objs)
    return objs
