"""
python manage.py setup_groups

Creates predefined Django permission groups for the UrbanTrends admin dashboard.

Groups
------
Editors   – Can view/add/change (never delete) CMS content, blog posts, and service data.
Viewers   – Read-only access to all non-sensitive models.

Superusers (Edwin Wamuyu, Eric Njeru) retain unrestricted access — they are the only
ones who can add/remove staff, change group membership, and perform destructive actions.
"""

from django.contrib.auth.models import Permission, Group
from django.contrib.contenttypes.models import ContentType
from django.core.management.base import BaseCommand


EDITOR_APPS  = ['cms', 'blog', 'services', 'contracts']
VIEWER_APPS  = ['cms', 'blog', 'services']
SUPERUSER_ONLY_ACTIONS = ['delete_user', 'delete_client', 'delete_receipt']


def _perms_for_apps(apps: list[str], actions: list[str]) -> list[Permission]:
    return list(Permission.objects.filter(
        content_type__app_label__in=apps,
        codename__startswith=tuple(f'{a}_' for a in actions),
    ).filter(
        codename__regex=r'^(' + '|'.join(actions) + r')_',
    ))


class Command(BaseCommand):
    help = 'Create or sync predefined permission groups for the UrbanTrends admin.'

    def handle(self, *args, **options):
        self._setup_editors()
        self._setup_viewers()
        self.stdout.write(self.style.SUCCESS('Permission groups created / updated.'))
        self.stdout.write(
            '\nAssign staff members to groups via:\n'
            '  /admin/auth/group/  (change group membership)\n'
            '  /admin/accounts/user/<id>/change/  (assign groups per user)\n\n'
            'Only superusers (is_superuser=True) can delete records or manage users.\n'
        )

    def _setup_editors(self):
        group, created = Group.objects.get_or_create(name='Editors')
        perms = list(Permission.objects.filter(
            content_type__app_label__in=EDITOR_APPS,
            codename__regex=r'^(view|add|change)_',
        ))
        # Explicitly exclude dangerous permissions
        perms = [p for p in perms if not p.codename.startswith('delete_')]
        group.permissions.set(perms)
        self.stdout.write(f'  {"Created" if created else "Updated"} group "Editors" ({len(perms)} permissions)')

    def _setup_viewers(self):
        group, created = Group.objects.get_or_create(name='Viewers')
        perms = list(Permission.objects.filter(
            content_type__app_label__in=VIEWER_APPS,
            codename__regex=r'^view_',
        ))
        group.permissions.set(perms)
        self.stdout.write(f'  {"Created" if created else "Updated"} group "Viewers" ({len(perms)} permissions)')
