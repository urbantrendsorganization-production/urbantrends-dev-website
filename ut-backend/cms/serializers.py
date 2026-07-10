from rest_framework import serializers
from .models import (
    SiteSettings, HeroStat, Partner, Testimonial,
    ChangelogEntry, TeamMember, AboutMetric, Tool, Project, Product,
    DeveloperIntegration, ContactInquiry,
)


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model  = SiteSettings
        fields = [
            'active_hero_template',
            'hero_eyebrow', 'hero_headline', 'hero_subheading',
            'hero_primary_cta_text', 'hero_primary_cta_url',
            'hero_secondary_cta_text', 'hero_secondary_cta_url',
            'trust_strip_label', 'logo_strip_label',
        ]


class HeroStatSerializer(serializers.ModelSerializer):
    class Meta:
        model  = HeroStat
        fields = ['value', 'label', 'order']


class PartnerSerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()

    class Meta:
        model  = Partner
        fields = ['name', 'category', 'logo', 'website_url']

    def get_logo(self, obj):
        # Return a relative /media/... path so the browser loads it same-origin
        # (proxied through the frontend), rather than an absolute URL built from
        # the internal backend host (http://backend:8000) seen on server-side
        # fetches.
        if obj.logo_image:
            return obj.logo_image.url
        return obj.logo_url or ''


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Testimonial
        fields = [
            'quote', 'author_name', 'author_role', 'company',
            'photo_url', 'product_label', 'product_accent_color',
        ]


class ChangelogEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model  = ChangelogEntry
        fields = ['date', 'product', 'version', 'title', 'body', 'tags']


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model  = TeamMember
        fields = ['name', 'role', 'photo_url', 'bio', 'is_founder', 'founder_message']


class AboutMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model  = AboutMetric
        fields = ['value', 'label']


class ToolSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Tool
        fields = [
            'name', 'slug', 'tagline', 'description', 'category',
            'icon_svg', 'accent_color',
            'cta_label', 'cta_url',
            'is_free', 'is_coming_soon',
        ]


class ProjectSerializer(serializers.ModelSerializer):
    cover          = serializers.SerializerMethodField()
    category_label = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model  = Project
        fields = [
            'title', 'slug', 'client', 'category', 'category_label',
            'summary', 'description', 'cover', 'tags', 'accent_color',
            'live_url', 'result_metric', 'year', 'is_featured',
        ]

    def get_cover(self, obj):
        # Relative /media/... path — see PartnerSerializer.get_logo.
        if obj.cover_image:
            return obj.cover_image.url
        return obj.cover_url or ''


class ProductSerializer(serializers.ModelSerializer):
    # Emit the exact camelCase shape the frontend `Product` type consumes, so the
    # API payload drops straight into <ProductShowcase /> with no remapping.
    accent   = serializers.CharField(source='accent_color')
    cta      = serializers.CharField(source='cta_label')
    iconPath = serializers.CharField(source='icon_path')
    href     = serializers.SerializerMethodField()

    class Meta:
        model  = Product
        fields = [
            'name', 'tag', 'accent', 'status', 'description',
            'features', 'href', 'cta', 'iconPath',
        ]

    def get_href(self, obj):
        # "Coming soon" cards are intentionally non-clickable.
        return '' if obj.status == 'soon' else (obj.link_url or '')


class DeveloperIntegrationSerializer(serializers.ModelSerializer):
    # Match the shape the /docs developer grid renders directly.
    pa        = serializers.CharField(source='accent_color')
    available = serializers.BooleanField(source='is_available')

    class Meta:
        model  = DeveloperIntegration
        fields = ['name', 'pa', 'tagline', 'available']


class ContactInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model  = ContactInquiry
        fields = ['name', 'email', 'subject', 'message']
