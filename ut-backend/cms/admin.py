import time
import requests as http_requests

from django.contrib import admin
from django.utils import timezone
from django.utils.html import format_html

from .models import (
    SiteSettings, HeroStat, Partner, Testimonial,
    ChangelogEntry, TeamMember, AboutMetric, ServiceStatus, Tool, Project, Product,
    DeveloperIntegration, ContactInquiry,
)


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Hero Copy', {
            'fields': ('hero_eyebrow', 'hero_headline', 'hero_subheading'),
        }),
        ('Hero Visual Template', {
            'fields': ('active_hero_template',),
            'description': (
                '<strong>orbital</strong> — animated SVG orbital diagram (default). '
                '<strong>code</strong> — dual code-window editor. '
                '<strong>grid</strong> — isometric SVG grid. '
                '<strong>minimal</strong> — large typographic layout.'
            ),
        }),
        ('Call-to-Action Buttons', {
            'fields': (
                ('hero_primary_cta_text', 'hero_primary_cta_url'),
                ('hero_secondary_cta_text', 'hero_secondary_cta_url'),
            ),
        }),
        ('Strip Labels', {
            'fields': ('trust_strip_label', 'logo_strip_label'),
        }),
    )

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(HeroStat)
class HeroStatAdmin(admin.ModelAdmin):
    list_display  = ['value', 'label', 'order', 'is_active']
    list_editable = ['order', 'is_active']
    ordering      = ['order']


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display  = ['name', 'category', 'order', 'is_active', 'logo_preview']
    list_editable = ['order', 'is_active']
    list_filter   = ['category', 'is_active']
    search_fields = ['name']
    ordering      = ['order', 'name']
    readonly_fields = ['logo_preview']
    fieldsets = (
        ('Identity', {
            'fields': ('name', 'category', 'website_url', 'is_active', 'order'),
        }),
        ('Logo', {
            'fields': ('logo_image', 'logo_url', 'logo_preview'),
            'description': (
                'Upload a file <strong>or</strong> paste an image URL — whichever you set is used. '
                'Upload takes priority over URL if both are filled.'
            ),
        }),
    )

    @admin.display(description='Preview')
    def logo_preview(self, obj):
        src = ''
        if obj.logo_image:
            src = obj.logo_image.url
        elif obj.logo_url:
            src = obj.logo_url
        if src:
            return format_html(
                '<img src="{}" style="height:36px;max-width:120px;object-fit:contain;'
                'background:#161619;border-radius:6px;padding:4px;" />',
                src
            )
        return '—'


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display  = ['author_name', 'author_role', 'company', 'product_label', 'order', 'is_active']
    list_editable = ['order', 'is_active']
    list_filter   = ['is_active', 'product_label']
    search_fields = ['author_name', 'company', 'quote']
    fieldsets = (
        ('Quote', {'fields': ('quote',)}),
        ('Author', {'fields': ('author_name', 'author_role', 'company', 'photo_url')}),
        ('Product Tag', {'fields': ('product_label', 'product_accent_color')}),
        ('Display', {'fields': ('is_active', 'order')}),
    )


@admin.register(ChangelogEntry)
class ChangelogEntryAdmin(admin.ModelAdmin):
    list_display  = ['date', 'product', 'version', 'title', 'is_published', 'created_at']
    list_filter   = ['is_published', 'product']
    search_fields = ['title', 'body', 'product', 'version']
    ordering      = ['-date']
    fieldsets = (
        ('Release', {'fields': ('date', 'product', 'version', 'title')}),
        ('Content', {
            'fields': ('body', 'tags'),
            'description': (
                'Tags format: <code>[{"type": "new", "text": "..."}, '
                '{"type": "imp", "text": "..."}, {"type": "fix", "text": "..."}]</code>. '
                'Valid types: <strong>new</strong>, <strong>imp</strong> (improvement), <strong>fix</strong>.'
            ),
        }),
        ('Publishing', {'fields': ('is_published',)}),
    )
    actions = ['publish_entries', 'unpublish_entries']

    @admin.action(description='Publish selected entries')
    def publish_entries(self, request, queryset):
        updated = queryset.update(is_published=True)
        self.message_user(request, f'{updated} entr{"y" if updated == 1 else "ies"} published.')

    @admin.action(description='Unpublish selected entries')
    def unpublish_entries(self, request, queryset):
        updated = queryset.update(is_published=False)
        self.message_user(request, f'{updated} entr{"y" if updated == 1 else "ies"} unpublished.')


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display  = ['name', 'role', 'is_founder', 'order', 'is_active']
    list_editable = ['is_founder', 'order', 'is_active']
    list_filter   = ['is_founder', 'is_active']
    search_fields = ['name', 'role']


@admin.register(AboutMetric)
class AboutMetricAdmin(admin.ModelAdmin):
    list_display  = ['value', 'label', 'order']
    list_editable = ['order']


@admin.register(ServiceStatus)
class ServiceStatusAdmin(admin.ModelAdmin):
    list_display  = ['name', 'status_badge', 'last_response_ms', 'last_checked_at', 'order', 'is_active']
    list_editable = ['order', 'is_active']
    readonly_fields = ['last_status', 'last_response_ms', 'last_checked_at', 'consecutive_fails']
    actions       = ['check_now']
    fieldsets = (
        ('Endpoint', {'fields': ('name', 'url', 'is_active', 'order')}),
        ('Last probe result', {
            'fields': ('last_status', 'last_response_ms', 'last_checked_at', 'consecutive_fails'),
            'description': (
                'Updated automatically by <code>python manage.py check_services</code> '
                'or the "Probe now" action. Run check_services on a cron job '
                '(e.g. every 5 minutes) for continuous monitoring.'
            ),
        }),
    )

    @admin.display(description='Status')
    def status_badge(self, obj):
        colours = {
            'operational': ('#d1fae5', '#065f46'),
            'degraded':    ('#fef3c7', '#92400e'),
            'down':        ('#fee2e2', '#991b1b'),
            'unknown':     ('#f0f0ee', '#666'),
        }
        bg, fg = colours.get(obj.last_status, colours['unknown'])
        return format_html(
            '<span style="background:{};color:{};padding:3px 10px;border-radius:20px;'
            'font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;">{}</span>',
            bg, fg, obj.last_status,
        )

    @admin.action(description='Probe selected endpoints now (saves results)')
    def check_now(self, request, queryset):
        results = []
        for svc in queryset:
            prev = svc.last_status
            start = time.monotonic()
            try:
                resp = http_requests.get(svc.url, timeout=4)
                ms = round((time.monotonic() - start) * 1000)
                if resp.status_code < 400:
                    status = 'operational'
                elif resp.status_code < 500:
                    status = 'degraded'
                else:
                    status = 'down'
            except Exception as exc:
                ms, status = None, 'down'

            if status in ('down', 'degraded'):
                svc.consecutive_fails += 1
            else:
                svc.consecutive_fails = 0

            svc.last_status      = status
            svc.last_response_ms = ms
            svc.last_checked_at  = timezone.now()
            svc.save(update_fields=['last_status', 'last_response_ms', 'last_checked_at', 'consecutive_fails'])

            sym = '✓' if status == 'operational' else '✗'
            results.append(f'{sym} {svc.name}: {status}' + (f' ({ms}ms)' if ms else ''))

        self.message_user(request, ' | '.join(results))


@admin.register(Tool)
class ToolAdmin(admin.ModelAdmin):
    list_display  = ['name', 'category', 'is_free', 'is_coming_soon', 'order', 'is_active', 'has_icon']
    list_editable = ['order', 'is_active', 'is_coming_soon']
    list_filter   = ['category', 'is_active', 'is_free', 'is_coming_soon']
    search_fields = ['name', 'tagline', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order', '-created_at']
    fieldsets = (
        ('Identity', {
            'fields': ('name', 'slug', 'category', 'tagline', 'description'),
        }),
        ('Visual', {
            'fields': ('icon_svg', 'accent_color'),
            'description': (
                'Icon: paste SVG path/shape content only — <strong>no outer &lt;svg&gt; tag</strong>. '
                'ViewBox is "0 0 24 24". Example: <code>&lt;path d="M7 8l4 4-4 4M13 16h4"/&gt;</code>. '
                'Accent color: hex value used for the icon glow and card highlight.'
            ),
        }),
        ('Call to Action', {
            'fields': ('cta_label', 'cta_url'),
            'description': 'Leave CTA URL blank if the tool is not yet live — the card will show "Coming soon".',
        }),
        ('Display', {
            'fields': ('is_free', 'is_coming_soon', 'is_active', 'order'),
        }),
    )

    @admin.display(boolean=True, description='Has icon')
    def has_icon(self, obj):
        return bool(obj.icon_svg)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display  = ['title', 'client', 'category', 'year', 'is_featured', 'order', 'is_active', 'cover_preview']
    list_editable = ['is_featured', 'order', 'is_active']
    list_filter   = ['category', 'is_featured', 'is_active']
    search_fields = ['title', 'client', 'summary', 'description']
    prepopulated_fields = {'slug': ('title',)}
    ordering      = ['order', '-completed_at']
    readonly_fields = ['cover_preview']
    fieldsets = (
        ('Identity', {
            'fields': ('title', 'slug', 'client', 'category'),
        }),
        ('Content', {
            'fields': ('summary', 'description', 'tags'),
            'description': (
                'Tags format: a JSON list of strings, e.g. '
                '<code>["Next.js", "Django", "M-Pesa"]</code>.'
            ),
        }),
        ('Cover', {
            'fields': ('cover_image', 'cover_url', 'cover_preview'),
            'description': (
                'Upload a file <strong>or</strong> paste an image URL — whichever you set is used. '
                'Upload takes priority over URL if both are filled.'
            ),
        }),
        ('Details', {
            'fields': ('accent_color', 'live_url', 'result_metric', 'year', 'completed_at'),
        }),
        ('Display', {
            'fields': ('is_featured', 'is_active', 'order'),
            'description': 'Check <strong>is_featured</strong> to surface the project in the homepage "Recent work" teaser.',
        }),
    )

    @admin.display(description='Cover')
    def cover_preview(self, obj):
        src = ''
        if obj.cover_image:
            src = obj.cover_image.url
        elif obj.cover_url:
            src = obj.cover_url
        if src:
            return format_html(
                '<img src="{}" style="height:54px;max-width:160px;object-fit:cover;'
                'background:#161619;border-radius:6px;" />',
                src
            )
        return '—'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display  = ['name', 'tag', 'status', 'order', 'is_active', 'has_icon']
    list_editable = ['status', 'order', 'is_active']
    list_filter   = ['status', 'is_active']
    search_fields = ['name', 'tag', 'description']
    ordering      = ['order', '-created_at']
    fieldsets = (
        ('Identity', {
            'fields': ('name', 'tag', 'status', 'description'),
        }),
        ('Features', {
            'fields': ('features',),
            'description': (
                'A JSON list of short strings shown as ticked bullets, e.g. '
                '<code>["Auto-reconciliation", "Tenant ledgers", "Automated receipts"]</code>.'
            ),
        }),
        ('Visual', {
            'fields': ('icon_path', 'accent_color'),
            'description': (
                'Icon: paste <strong>SVG path data only</strong> — the value of a single '
                '<code>&lt;path d="…"&gt;</code> on a "0 0 24 24" viewBox '
                '(e.g. <code>M3 3h7v7H3z</code>). Accent color: hex used for the card highlight and icon glow.'
            ),
        }),
        ('Link', {
            'fields': ('link_url', 'cta_label'),
            'description': (
                'Where the card points, e.g. <code>/rentflow</code> or <code>/contact</code>. '
                'While status is <strong>Coming soon</strong> the card is non-clickable and the link is ignored.'
            ),
        }),
        ('Display', {
            'fields': ('is_active', 'order'),
        }),
    )

    @admin.display(boolean=True, description='Has icon')
    def has_icon(self, obj):
        return bool(obj.icon_path)


@admin.register(DeveloperIntegration)
class DeveloperIntegrationAdmin(admin.ModelAdmin):
    list_display  = ['name', 'tagline', 'is_available', 'order', 'is_active']
    list_editable = ['is_available', 'order', 'is_active']
    list_filter   = ['is_available', 'is_active']
    search_fields = ['name', 'tagline']
    ordering      = ['order', '-created_at']
    fieldsets = (
        ('Identity', {
            'fields': ('name', 'tagline', 'accent_color'),
            'description': 'Shown on the <strong>Developers</strong> page "integration surface" grid.',
        }),
        ('Display', {
            'fields': ('is_available', 'is_active', 'order'),
            'description': 'Check <strong>Is available</strong> for the green "Available" badge; '
                           'leave unchecked for "Coming soon".',
        }),
    )


@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display  = ['name', 'email', 'subject', 'created_at', 'is_read']
    list_filter   = ['subject', 'is_read']
    list_editable = ['is_read']
    search_fields = ['name', 'email', 'message']
    ordering      = ['-created_at']
    readonly_fields = ['name', 'email', 'subject', 'message', 'created_at']

    def has_add_permission(self, request):
        return False
