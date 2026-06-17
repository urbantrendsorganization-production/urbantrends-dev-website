from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Sync Gmail inbox into the database'

    def add_arguments(self, parser):
        parser.add_argument('--max', type=int, default=100)

    def handle(self, *args, **options):
        from gmail.api import sync_inbox
        try:
            count = sync_inbox(max_results=options['max'])
            self.stdout.write(self.style.SUCCESS(f'{count} thread(s) synced.'))
        except Exception as exc:
            self.stderr.write(self.style.ERROR(str(exc)))
