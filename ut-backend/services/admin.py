from django import forms
from django.contrib import admin, messages
from django.forms.models import BaseInlineFormSet

from .models import Invoice, Order, OrderMessage, PricingPlan, QuoteRequest, Service, ServiceCategory
from .signals import send_invoice_email


class ServiceInline(admin.TabularInline):
    model = Service
    fields = ('name', 'slug', 'tagline', 'is_active', 'is_featured', 'order')
    extra = 1
    prepopulated_fields = {'slug': ('name',)}
    show_change_link = True


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_tiered', 'order')
    list_editable = ('is_tiered', 'order')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ServiceInline]


def _is_tiered(service):
    return bool(service and service.pk and service.uses_tiers)


def _missing_tiers(service):
    """Tiers not yet created for this service, in Basic → Standard → Premium order."""
    existing = set(service.plans.values_list('tier', flat=True))
    return [(t, label) for t, label in PricingPlan.TIER_CHOICES if t not in existing]


class PricingPlanInlineFormSet(BaseInlineFormSet):
    def __init__(self, *args, **kwargs):
        instance = kwargs.get('instance')
        if _is_tiered(instance):
            # Pre-fill the extra rows with the tier + name that are still missing,
            # so staff only have to set prices/descriptions to complete the three tiers.
            kwargs['initial'] = [
                {'tier': t, 'name': label} for t, label in _missing_tiers(instance)
            ]
        super().__init__(*args, **kwargs)


class PricingPlanAdminForm(forms.ModelForm):
    """Edit the `features` JSON list as one inclusion per line."""
    features = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={'rows': 5, 'cols': 30, 'placeholder': 'One inclusion per line'}),
        help_text="One item per line — shown in the card's “What's included” dropdown.",
    )

    class Meta:
        model = PricingPlan
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk and isinstance(self.instance.features, list):
            self.initial['features'] = '\n'.join(self.instance.features)

    def clean_features(self):
        raw = self.cleaned_data.get('features', '') or ''
        return [line.strip() for line in raw.splitlines() if line.strip()]


class PricingPlanInline(admin.TabularInline):
    model = PricingPlan
    form = PricingPlanAdminForm
    formset = PricingPlanInlineFormSet
    fields = ('tier', 'name', 'description', 'features', 'price', 'billing_cycle', 'is_quote', 'is_popular', 'order')
    extra = 0

    def get_extra(self, request, obj=None, **kwargs):
        # For a tier-based service, surface one pre-filled row per still-missing tier.
        if _is_tiered(obj):
            return len(_missing_tiers(obj))
        return 0

    def get_max_num(self, request, obj=None, **kwargs):
        # Tier-based services are capped at exactly three tiers.
        if _is_tiered(obj):
            return 3
        return super().get_max_num(request, obj, **kwargs)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'is_active', 'is_featured', 'is_tiered', 'order')
    list_filter = ('is_active', 'is_featured', 'is_tiered', 'category')
    list_editable = ('is_active', 'is_featured', 'is_tiered', 'order')
    search_fields = ('name', 'tagline', 'description')
    prepopulated_fields = {'slug': ('name',)}
    actions = ['mark_tiered', 'unmark_tiered']

    class Media:
        css = {'all': ('services/admin_inline.css',)}

    fieldsets = (
        (None, {
            'fields': ('category', 'name', 'slug', 'tagline', 'description'),
        }),
        ('Display', {
            'fields': ('icon_path', 'accent_color', 'order', 'is_active', 'is_featured', 'is_tiered'),
        }),
    )
    inlines = [PricingPlanInline]

    @admin.action(description='Mark as tiered (Basic / Standard / Premium)')
    def mark_tiered(self, request, queryset):
        updated = queryset.update(is_tiered=True)
        self.message_user(
            request,
            f"{updated} service(s) marked as tiered. Open each one to fill in its three tiers.",
            messages.SUCCESS,
        )

    @admin.action(description='Remove tiered pricing')
    def unmark_tiered(self, request, queryset):
        updated = queryset.update(is_tiered=False)
        self.message_user(request, f"{updated} service(s) no longer tiered.", messages.SUCCESS)


class InvoiceInline(admin.StackedInline):
    model = Invoice
    extra = 1
    max_num = 1
    fields = ('subtotal', 'tax_rate', 'currency', 'due_date', 'notes', 'status',
              'invoice_number', 'total', 'issued_at', 'paid_at', 'created_at')
    readonly_fields = ('invoice_number', 'total', 'issued_at', 'paid_at', 'created_at')
    verbose_name = "Invoice"
    verbose_name_plural = "Invoice"

    def get_extra(self, request, obj=None, **kwargs):
        if obj and hasattr(obj, 'invoice'):
            return 0
        return 1


class MessageHistoryInline(admin.TabularInline):
    """Read-only view of the full message thread."""
    model = OrderMessage
    verbose_name_plural = "Message thread"
    fields = ('from_display', 'content', 'is_internal', 'created_at')
    readonly_fields = ('from_display', 'content', 'is_internal', 'created_at')
    extra = 0
    max_num = 0
    can_delete = False

    @admin.display(description='From')
    def from_display(self, obj):
        label = "Staff" if obj.sender.is_staff else "Customer"
        return f"{label} ({obj.sender.email})"


class SendReplyInline(admin.StackedInline):
    """Staff reply form — sender is set automatically on save."""
    model = OrderMessage
    verbose_name = "Send a reply"
    verbose_name_plural = "Send a reply"
    fields = ('content', 'is_internal')
    extra = 1
    max_num = 1

    def get_queryset(self, request):
        return super().get_queryset(request).none()

    def get_extra(self, request, obj=None, **kwargs):
        return 1 if obj else 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_email', 'service', 'status', 'assigned_to', 'created_at')
    list_filter = ('status', 'service')
    search_fields = ('customer__email', 'service__name', 'requirements')
    readonly_fields = ('customer_email', 'requirements_display', 'created_at', 'updated_at')
    fieldsets = (
        ('Customer', {
            'fields': ('customer_email',),
        }),
        ('Order', {
            'fields': ('service', 'pricing_plan', 'status', 'assigned_to'),
        }),
        ('Client brief', {
            'fields': ('requirements_display',),
        }),
        ('Internal notes', {
            'fields': ('internal_notes',),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
    inlines = [InvoiceInline, MessageHistoryInline, SendReplyInline]

    @admin.display(description='Customer')
    def customer_email(self, obj):
        return obj.customer.email

    @admin.display(description='Client brief')
    def requirements_display(self, obj):
        return obj.requirements

    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)
        for instance in instances:
            if isinstance(instance, OrderMessage) and not instance.pk:
                instance.sender = request.user
            instance.save()
        formset.save_m2m()


@admin.register(QuoteRequest)
class QuoteRequestAdmin(admin.ModelAdmin):
    list_display    = ['name', 'email', 'service_name', 'budget_display', 'timeline_display', 'status', 'created_at']
    list_editable   = ['status']
    list_filter     = ['status', 'budget_range', 'timeline', 'created_at']
    search_fields   = ['name', 'email', 'company', 'service_name', 'brief']
    ordering        = ['-created_at']
    date_hierarchy  = 'created_at'
    readonly_fields = ['service_name', 'name', 'email', 'company', 'phone',
                       'budget_range', 'timeline', 'brief', 'created_at']
    fieldsets = (
        ('Client', {
            'fields': ('name', 'email', 'company', 'phone'),
        }),
        ('Request', {
            'fields': ('service_name', 'budget_range', 'timeline', 'brief'),
        }),
        ('Status & Notes', {
            'fields': ('status', 'internal_notes', 'created_at'),
        }),
    )

    def has_add_permission(self, request):
        return False

    @admin.display(description='Budget')
    def budget_display(self, obj):
        return obj.get_budget_range_display()

    @admin.display(description='Timeline')
    def timeline_display(self, obj):
        return obj.get_timeline_display()

    @admin.display(description='Status')
    def status_badge(self, obj):
        colours = {
            'new':       ('#dbeafe', '#1d4ed8'),
            'in_review': ('#fef3c7', '#92400e'),
            'replied':   ('#d1fae5', '#065f46'),
            'closed':    ('#f0f0ee', '#666'),
        }
        bg, fg = colours.get(obj.status, ('#f0f0ee', '#666'))
        from django.utils.html import format_html
        return format_html(
            '<span style="background:{};color:{};padding:3px 10px;border-radius:20px;'
            'font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;">{}</span>',
            bg, fg, obj.get_status_display(),
        )


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'order_customer', 'order_service', 'total', 'currency', 'status', 'due_date', 'issued_at')
    list_filter = ('status', 'currency')
    search_fields = ('invoice_number', 'order__customer__email', 'order__service__name')
    readonly_fields = ('invoice_number', 'total', 'issued_at', 'paid_at', 'created_at', 'updated_at')
    actions = ['send_invoice']

    @admin.display(description='Customer')
    def order_customer(self, obj):
        return obj.order.customer.email

    @admin.display(description='Service')
    def order_service(self, obj):
        return obj.order.service.name

    @admin.action(description='Resend invoice to customer')
    def send_invoice(self, request, queryset):
        sent = 0
        skipped = 0
        for invoice in queryset.select_related('order__customer', 'order__service', 'order__pricing_plan'):
            if invoice.status == 'cancelled':
                skipped += 1
                continue
            send_invoice_email(invoice)
            sent += 1

        if sent:
            self.message_user(request, f"{sent} invoice(s) resent.", messages.SUCCESS)
        if skipped:
            self.message_user(request, f"{skipped} cancelled invoice(s) skipped.", messages.WARNING)
