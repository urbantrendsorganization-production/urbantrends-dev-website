import os
from django.core.management.base import BaseCommand
from cms.models import ServiceStatus

BACKEND = os.environ.get("BACKEND_URL", "http://localhost:8000")
FRONTEND = os.environ.get("FRONTEND_BASE_URL", "http://localhost:3000")

DEFAULT_SERVICES = [
    {"name": "Django API",      "url": f"{BACKEND}/api/health",     "order": 0},
    {"name": "CMS — Home data", "url": f"{BACKEND}/api/cms/home",   "order": 1},
    {"name": "Services API",    "url": f"{BACKEND}/api/services",   "order": 2},
    {"name": "Blog API",        "url": f"{BACKEND}/api/blog/posts", "order": 3},
    {"name": "Tools API",       "url": f"{BACKEND}/api/cms/tools",  "order": 4},
    {"name": "Frontend",        "url": f"{FRONTEND}",               "order": 5},
]


class Command(BaseCommand):
    help = "Seed default ServiceStatus monitoring entries"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear", action="store_true",
            help="Remove all existing entries before seeding",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            deleted, _ = ServiceStatus.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Cleared {deleted} existing entries"))

        created = 0
        for svc in DEFAULT_SERVICES:
            _, was_created = ServiceStatus.objects.get_or_create(
                name=svc["name"],
                defaults={"url": svc["url"], "order": svc["order"], "is_active": True},
            )
            if was_created:
                created += 1
                self.stdout.write(f"  + {svc['name']}")
            else:
                self.stdout.write(f"  · {svc['name']} (already exists)")

        self.stdout.write(self.style.SUCCESS(f"\nDone — {created} new entries seeded."))
