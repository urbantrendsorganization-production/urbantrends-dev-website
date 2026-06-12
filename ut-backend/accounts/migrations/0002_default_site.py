from django.conf import settings
from django.db import migrations


def set_default_site(apps, schema_editor):
    Site = apps.get_model("sites", "Site")
    Site.objects.update_or_create(
        id=settings.SITE_ID,
        defaults={"name": "UrbanTrends", "domain": "urbantrends.dev"},
    )


def revert_default_site(apps, schema_editor):
    Site = apps.get_model("sites", "Site")
    Site.objects.filter(id=settings.SITE_ID).update(
        name="example.com", domain="example.com"
    )


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0001_initial"),
        ("sites", "0002_alter_domain_unique"),
    ]

    operations = [
        migrations.RunPython(set_default_site, revert_default_site),
    ]
