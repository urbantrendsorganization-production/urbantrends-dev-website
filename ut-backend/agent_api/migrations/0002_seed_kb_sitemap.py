"""Seed the baseline KB articles and sitemap destinations from BACKEND_APIS.md
so Mika has a working whitelist immediately. Admins edit these afterwards."""
from django.db import migrations

KB_ARTICLES = [
    {
        'key': 'payment_methods',
        'title': 'Payment methods',
        'answer': ("We take payment via M-Pesa or bank transfer once your order "
                   "is confirmed. You'll receive an invoice with the details."),
        'aliases': ['payment', 'how do i pay', 'mpesa', 'bank transfer'],
        'tags': ['billing'],
        'order': 0,
    },
    {
        'key': 'order_status',
        'title': 'Checking your order status',
        'answer': ("You can see every order and its current status under "
                   "“Your orders” once you're signed in. I can take you "
                   "there, or tell you the status of a specific order."),
        'aliases': ['order status', 'where is my order', 'track order'],
        'tags': ['orders'],
        'order': 1,
    },
    {
        'key': 'turnaround',
        'title': 'Typical turnaround',
        'answer': ("Most projects start within a few days of a confirmed order. "
                   "Timelines depend on scope — I can open a ticket to get you "
                   "a precise estimate for your project."),
        'aliases': ['how long', 'timeline', 'delivery time'],
        'tags': ['general'],
        'order': 2,
    },
]

DESTINATIONS = [
    {'key': 'pricing', 'path': '/pricing', 'label': 'Pricing',
     'aliases': ['pricing', 'prices', 'cost', 'plans'], 'order': 0},
    {'key': 'services', 'path': '/services', 'label': 'Services',
     'aliases': ['services', 'what do you do', 'offerings'], 'order': 1},
    {'key': 'orders', 'path': '/portal/orders', 'label': 'Your orders',
     'aliases': ['my orders', 'order history'], 'order': 2},
    {'key': 'signin', 'path': '/login', 'label': 'Sign in',
     'aliases': ['sign in', 'log in', 'my account'], 'order': 3},
    {'key': 'contact', 'path': '/contact', 'label': 'Contact us',
     'aliases': ['contact', 'support', 'talk to a human'], 'order': 4},
]


def seed(apps, schema_editor):
    KBArticle = apps.get_model('agent_api', 'KBArticle')
    SitemapDestination = apps.get_model('agent_api', 'SitemapDestination')
    for row in KB_ARTICLES:
        KBArticle.objects.update_or_create(key=row['key'], defaults=row)
    for row in DESTINATIONS:
        SitemapDestination.objects.update_or_create(key=row['key'], defaults=row)


def unseed(apps, schema_editor):
    KBArticle = apps.get_model('agent_api', 'KBArticle')
    SitemapDestination = apps.get_model('agent_api', 'SitemapDestination')
    KBArticle.objects.filter(key__in=[r['key'] for r in KB_ARTICLES]).delete()
    SitemapDestination.objects.filter(key__in=[r['key'] for r in DESTINATIONS]).delete()


class Migration(migrations.Migration):
    dependencies = [('agent_api', '0001_initial')]
    operations = [migrations.RunPython(seed, unseed)]
