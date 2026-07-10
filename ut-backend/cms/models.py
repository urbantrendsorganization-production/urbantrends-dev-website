from django.db import models


class SiteSettings(models.Model):
    HERO_TEMPLATES = [
        ('orbital', 'Orbital Diagram'),
        ('code',    'Code Window'),
        ('grid',    '3D Grid'),
        ('minimal', 'Minimal Typography'),
        ('aurora',  'Platform Stack (layered)'),
        ('bento',   'Capability Bento (what we build)'),
    ]

    active_hero_template = models.CharField(
        max_length=20, choices=HERO_TEMPLATES, default='orbital',
        help_text='Which visual template to display in the hero art area.'
    )
    hero_eyebrow   = models.CharField(max_length=200, default='Multi-product software studio · Est. 2024')
    hero_headline  = models.CharField(max_length=200, default='Infrastructure for the East African internet.')
    hero_subheading = models.TextField(
        blank=True,
        default='We build the SaaS and developer tooling East African operators actually ship on. M-Pesa-native, Daraja-fluent, production-grade — and serious about it.'
    )
    hero_primary_cta_text  = models.CharField(max_length=100, default='Explore products')
    hero_primary_cta_url   = models.CharField(max_length=200, default='#services')
    hero_secondary_cta_text = models.CharField(max_length=100, default='Read the docs')
    hero_secondary_cta_url  = models.CharField(max_length=200, default='#tools')
    trust_strip_label = models.CharField(max_length=200, default='Runs on the rails you already use')
    logo_strip_label  = models.CharField(max_length=200, default='Trusted by operators across East Africa')

    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return 'Site Settings'

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass  # prevent deletion

    @classmethod
    def get(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class HeroStat(models.Model):
    value    = models.CharField(max_length=50, help_text='e.g. "2.4M+"')
    label    = models.CharField(max_length=100, help_text='e.g. "Transactions reconciled"')
    order    = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Hero Stat'

    def __str__(self):
        return f'{self.value} — {self.label}'


class Partner(models.Model):
    CATEGORY_CHOICES = [
        ('rails',      'Trust Strip (Rails)'),
        ('trusted_by', 'Logo Strip (Trusted By)'),
    ]

    name       = models.CharField(max_length=100)
    category   = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='trusted_by')
    logo_image = models.ImageField(
        upload_to='partners/', blank=True, null=True,
        help_text='Upload a PNG, JPG, SVG, or WebP logo file.'
    )
    logo_url   = models.URLField(
        blank=True,
        help_text='Alternative to uploading: paste a direct URL to the logo image.'
    )
    website_url = models.URLField(blank=True, help_text='Link to the partner\'s website (optional).')
    is_active   = models.BooleanField(default=True)
    order       = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return f'{self.name} ({self.get_category_display()})'


class Testimonial(models.Model):
    quote               = models.TextField()
    author_name         = models.CharField(max_length=100)
    author_role         = models.CharField(max_length=150)
    company             = models.CharField(max_length=100)
    photo_url           = models.URLField(blank=True)
    product_label       = models.CharField(max_length=50, blank=True, help_text='e.g. "RentFlow"')
    product_accent_color = models.CharField(max_length=20, blank=True, default='#34D399',
                                            help_text='Hex color for the product badge')
    is_active = models.BooleanField(default=True)
    order     = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.author_name} — {self.company}'


class ChangelogEntry(models.Model):
    date       = models.DateField()
    product    = models.CharField(max_length=50, help_text='e.g. "rentflow", "platform", "tools"')
    version    = models.CharField(max_length=20, help_text='e.g. "v3.1"')
    title      = models.CharField(max_length=200)
    body       = models.TextField(help_text='Short description of what changed.')
    tags       = models.JSONField(
        default=list, blank=True,
        help_text='List of {type: "new"|"imp"|"fix", text: "..."} objects.'
    )
    is_published = models.BooleanField(default=False)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']
        verbose_name = 'Changelog Entry'
        verbose_name_plural = 'Changelog Entries'

    def __str__(self):
        return f'{self.date} — {self.product} {self.version}: {self.title}'


class TeamMember(models.Model):
    name       = models.CharField(max_length=100)
    role       = models.CharField(max_length=150)
    photo_url  = models.URLField(blank=True)
    bio        = models.TextField(blank=True)
    order      = models.PositiveSmallIntegerField(default=0)
    is_active       = models.BooleanField(default=True)
    is_founder      = models.BooleanField(default=False, help_text='Check for founders / co-founders')
    founder_message = models.TextField(
        blank=True,
        help_text='Personal statement shown in the "From our founders" section on the About page.',
    )

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.name} — {self.role}'


class AboutMetric(models.Model):
    value = models.CharField(max_length=50, help_text='e.g. "2026", "5+", "BN-93S95J2J"')
    label = models.CharField(max_length=100, help_text='e.g. "Founded in Nairobi"')
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = 'About Metric'

    def __str__(self):
        return f'{self.value}: {self.label}'


class ServiceStatus(models.Model):
    STATUS_CHOICES = [
        ('operational', 'Operational'),
        ('degraded',    'Degraded'),
        ('down',        'Down'),
        ('unknown',     'Unknown'),
    ]

    name      = models.CharField(max_length=100, help_text='Human-readable service name')
    url       = models.URLField(help_text='Endpoint to probe for health checks')
    is_active = models.BooleanField(default=True)
    order     = models.PositiveSmallIntegerField(default=0)

    # Stored probe results — updated by the check_services management command
    last_status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unknown', editable=False)
    last_response_ms  = models.PositiveIntegerField(null=True, blank=True, editable=False)
    last_checked_at   = models.DateTimeField(null=True, blank=True, editable=False)
    consecutive_fails = models.PositiveSmallIntegerField(default=0, editable=False,
        help_text='Number of consecutive failed probes')

    class Meta:
        ordering = ['order']
        verbose_name = 'Service Status'
        verbose_name_plural = 'Service Statuses'

    def __str__(self):
        return self.name


class Tool(models.Model):
    CATEGORY_CHOICES = [
        ('mpesa',     'M-Pesa'),
        ('developer', 'Developer'),
        ('finance',   'Finance'),
        ('utilities', 'Utilities'),
        ('data',      'Data'),
        ('other',     'Other'),
    ]

    name         = models.CharField(max_length=100)
    slug         = models.SlugField(unique=True, help_text='URL-friendly identifier, e.g. "daraja-playground"')
    tagline      = models.CharField(max_length=200, help_text='One-liner shown on the card')
    description  = models.TextField(blank=True, help_text='Longer description shown on the tool page (Markdown supported)')
    category     = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    icon_svg     = models.TextField(
        blank=True,
        help_text='SVG path/shape content only — no outer <svg> tag. ViewBox is "0 0 24 24". '
                  'Example: <path d="M7 8l4 4-4 4M13 16h4"/>'
    )
    accent_color    = models.CharField(max_length=20, default='#22D3EE', blank=True,
                                       help_text='Hex color for the icon glow and card accent')
    cta_label       = models.CharField(max_length=60, default='Open tool', blank=True,
                                       help_text='Button label, e.g. "Open tool", "Try it free"')
    cta_url         = models.CharField(max_length=500, blank=True,
                                       help_text='Where the CTA button points. Leave blank if not yet live.')
    is_free         = models.BooleanField(default=True)
    is_coming_soon  = models.BooleanField(default=False,
                                          help_text='Grays out the card and replaces the CTA with "Coming soon"')
    is_active       = models.BooleanField(default=True)
    order           = models.PositiveSmallIntegerField(default=0)
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.name


class Project(models.Model):
    """A delivered piece of work, shown in the 'Recent work' showcase."""

    CATEGORY_CHOICES = [
        ('product',     'Product Build'),
        ('web',         'Website / Web App'),
        ('mobile',      'Mobile App'),
        ('integration', 'API & Integration'),
        ('tooling',     'Developer Tooling'),
        ('branding',    'Design & Branding'),
        ('other',       'Other'),
    ]

    title       = models.CharField(max_length=200)
    slug        = models.SlugField(unique=True, help_text='URL-friendly identifier, e.g. "rentflow-rebuild"')
    client      = models.CharField(max_length=150, blank=True, help_text='Client / company name (optional)')
    category    = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='product')
    summary     = models.CharField(max_length=300, help_text='One-liner shown on the card')
    description = models.TextField(blank=True, help_text='Longer write-up shown on the project page (Markdown supported)')

    cover_image = models.ImageField(
        upload_to='projects/', blank=True, null=True,
        help_text='Upload a cover image (PNG, JPG, SVG, or WebP).'
    )
    cover_url   = models.URLField(
        blank=True,
        help_text='Alternative to uploading: paste a direct URL to the cover image.'
    )

    tags         = models.JSONField(
        default=list, blank=True,
        help_text='List of strings shown as chips, e.g. ["Next.js", "Django", "M-Pesa"].'
    )
    accent_color = models.CharField(max_length=20, default='#22D3EE', blank=True,
                                    help_text='Hex color for the card accent')

    live_url      = models.URLField(blank=True, help_text='Live site / product URL (optional)')
    result_metric = models.CharField(
        max_length=120, blank=True,
        help_text='Headline outcome, e.g. "2.4M transactions reconciled" (optional)'
    )
    year          = models.CharField(max_length=10, blank=True, help_text='e.g. "2025"')
    completed_at  = models.DateField(null=True, blank=True, help_text='Completion date — newest shown first')

    is_featured = models.BooleanField(default=False, help_text='Show in the homepage "Recent work" teaser')
    is_active   = models.BooleanField(default=True)
    order       = models.PositiveSmallIntegerField(default=0)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-completed_at', '-created_at']

    def __str__(self):
        return f'{self.title}' + (f' — {self.client}' if self.client else '')


class Product(models.Model):
    """A software product shown on the /products grid and the homepage teaser."""

    STATUS_CHOICES = [
        ('live', 'Live'),
        ('beta', 'Beta'),
        ('soon', 'Coming soon'),
    ]

    name        = models.CharField(max_length=100)
    tag         = models.CharField(max_length=100, help_text='Small label under the name, e.g. "SaaS · PropTech"')
    status      = models.CharField(max_length=10, choices=STATUS_CHOICES, default='soon',
                                   help_text='Drives the badge (LIVE / BETA / COMING SOON) and card styling.')
    description = models.TextField(help_text='Short paragraph shown on the card.')
    features    = models.JSONField(
        default=list, blank=True,
        help_text='List of short strings shown as ticked bullets, e.g. ["Auto-reconciliation", "Tenant ledgers"].'
    )
    icon_path   = models.TextField(
        blank=True,
        help_text='SVG path data only — the value of a single <path d="…"> on a "0 0 24 24" viewBox. '
                  'Example: M3 21h18M6 21V5a2 2 0 012-2h8a2 2 0 012 2v16'
    )
    accent_color = models.CharField(max_length=20, default='#34D399', blank=True,
                                    help_text='Hex color for the card accent and icon glow.')
    link_url     = models.CharField(max_length=500, blank=True,
                                    help_text='Where the card links to, e.g. "/rentflow" or "/contact". '
                                              'Ignored while status is "Coming soon".')
    cta_label    = models.CharField(max_length=60, default='View product', blank=True,
                                    help_text='Card link label, e.g. "View product", "Request access".')
    is_active    = models.BooleanField(default=True)
    order        = models.PositiveSmallIntegerField(default=0)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return f'{self.name} ({self.get_status_display()})'


class DeveloperIntegration(models.Model):
    """An API surface listed on the /docs (Developers) "integration surface" grid."""

    name         = models.CharField(max_length=100)
    tagline      = models.CharField(max_length=200, help_text='One-liner shown under the name.')
    accent_color = models.CharField(max_length=20, default='#22D3EE', blank=True,
                                    help_text='Hex color for the card accent border.')
    is_available = models.BooleanField(
        default=False,
        help_text='Checked = "Available" badge; unchecked = "Coming soon".'
    )
    is_active    = models.BooleanField(default=True)
    order        = models.PositiveSmallIntegerField(default=0)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = 'Developer Integration'

    def __str__(self):
        return f'{self.name}' + ('' if self.is_available else ' (coming soon)')


class ContactInquiry(models.Model):
    SUBJECT_CHOICES = [
        ('general',     'General enquiry'),
        ('project',     'Start a project'),
        ('partnership', 'Partnership'),
        ('careers',     'Careers'),
        ('other',       'Other'),
    ]

    name       = models.CharField(max_length=200)
    email      = models.EmailField()
    subject    = models.CharField(max_length=20, choices=SUBJECT_CHOICES, default='general')
    message    = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read    = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Inquiry'
        verbose_name_plural = 'Contact Inquiries'

    def __str__(self):
        return f'{self.name} <{self.email}> — {self.get_subject_display()}'
