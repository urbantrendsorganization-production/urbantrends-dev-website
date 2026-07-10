from django.db import migrations


PRODUCTS = [
    {
        'name': 'RentFlow',
        'tag': 'SaaS · PropTech',
        'status': 'live',
        'description': (
            'Property management that reconciles M-Pesa Paybill settlements to the '
            'right unit, tenant, and invoice — automatically, including on weekends.'
        ),
        'features': [
            'M-Pesa Paybill auto-reconciliation',
            'Tenant, lease & unit management',
            'Automated invoices and receipts',
        ],
        'accent_color': '#34D399',
        'link_url': '/rentflow',
        'cta_label': 'View product',
        'icon_path': 'M3 21h18M6 21V5a2 2 0 012-2h8a2 2 0 012 2v16M9 7h.01M9 11h.01M9 15h.01M14 7h.01M14 11h.01M14 15h.01',
        'order': 0,
    },
    {
        'name': 'SiteChat',
        'tag': 'SDK · Messaging',
        'status': 'beta',
        'description': (
            'An embeddable, end-to-end encrypted chat SDK. Drop a widget into any '
            'site and talk to your customers over an encrypted, hosted relay.'
        ),
        'features': [
            'Drop-in embeddable widget',
            'End-to-end encrypted messages',
            'Client SDK + hosted relay',
        ],
        'accent_color': '#22D3EE',
        'link_url': '/contact',
        'cta_label': 'Request access',
        'icon_path': 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
        'order': 1,
    },
    {
        'name': 'Conduit',
        'tag': 'Platform · White-label',
        'status': 'soon',
        'description': (
            'A white-label, multi-tenant client portal engine. Spin up branded '
            'portals for each of your clients from a single codebase.'
        ),
        'features': [
            'Multi-tenant, white-label',
            'Fully branded client portals',
            'Role-based access control',
        ],
        'accent_color': '#A78BFA',
        'link_url': '',
        'cta_label': 'View product',
        'icon_path': 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
        'order': 2,
    },
    {
        'name': 'OnboardKit',
        'tag': 'Portal · KYC',
        'status': 'soon',
        'description': (
            'A client onboarding and KYC portal. Guide new clients through '
            'structured onboarding with document capture and a compliance-ready audit trail.'
        ),
        'features': [
            'Guided onboarding flows',
            'KYC document capture',
            'Compliance-ready audit trail',
        ],
        'accent_color': '#F59E0B',
        'link_url': '',
        'cta_label': 'View product',
        'icon_path': 'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8M17 11l2 2 4-4',
        'order': 3,
    },
]


def seed(apps, schema_editor):
    Product = apps.get_model('cms', 'Product')
    for data in PRODUCTS:
        Product.objects.get_or_create(name=data['name'], defaults=data)


def unseed(apps, schema_editor):
    Product = apps.get_model('cms', 'Product')
    Product.objects.filter(name__in=[p['name'] for p in PRODUCTS]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0011_product'),
    ]

    operations = [
        migrations.RunPython(seed, unseed),
    ]
