from django.db import migrations


INTEGRATIONS = [
    {
        'name': 'RentFlow',
        'accent_color': '#34D399',
        'tagline': 'Plug rent payments and M-Pesa reconciliation into your property app.',
        'is_available': True,
        'order': 0,
    },
    {
        'name': 'PortfolioU',
        'accent_color': '#A78BFA',
        'tagline': 'Access the talent shortlist API to match candidates to roles.',
        'is_available': False,
        'order': 1,
    },
    {
        'name': 'TrendyyLeads',
        'accent_color': '#FB923C',
        'tagline': 'Pull enriched, scored leads directly into your CRM.',
        'is_available': False,
        'order': 2,
    },
    {
        'name': 'AcademyOS',
        'accent_color': '#60A5FA',
        'tagline': 'Integrate fee collection and grade reporting into school portals.',
        'is_available': False,
        'order': 3,
    },
    {
        'name': 'Developer Tools',
        'accent_color': '#22D3EE',
        'tagline': 'Daraja Playground, Scaffold CLI, and OG Studio — free to use.',
        'is_available': True,
        'order': 4,
    },
]


def seed(apps, schema_editor):
    DeveloperIntegration = apps.get_model('cms', 'DeveloperIntegration')
    for data in INTEGRATIONS:
        DeveloperIntegration.objects.get_or_create(name=data['name'], defaults=data)


def unseed(apps, schema_editor):
    DeveloperIntegration = apps.get_model('cms', 'DeveloperIntegration')
    DeveloperIntegration.objects.filter(name__in=[i['name'] for i in INTEGRATIONS]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0013_developerintegration'),
    ]

    operations = [
        migrations.RunPython(seed, unseed),
    ]
