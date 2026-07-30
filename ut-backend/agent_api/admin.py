from django.contrib import admin

from .models import (
    AgentQuote,
    AgentServiceConfig,
    IdempotentRequest,
    KBArticle,
    SitemapDestination,
    SupportTicket,
)


@admin.register(AgentServiceConfig)
class AgentServiceConfigAdmin(admin.ModelAdmin):
    list_display = ('service', 'is_active', 'updated_at')
    list_filter = ('is_active',)
    search_fields = ('service__name', 'service__slug')
    autocomplete_fields = ('service',)


@admin.register(AgentQuote)
class AgentQuoteAdmin(admin.ModelAdmin):
    list_display = ('quote_id', 'service', 'amount', 'currency', 'customer', 'order', 'created_at', 'expires_at')
    list_filter = ('currency', 'created_at')
    search_fields = ('quote_id', 'service__name', 'customer__email')
    readonly_fields = ('quote_id', 'service', 'params', 'amount', 'breakdown',
                       'currency', 'customer', 'order', 'created_at', 'expires_at')

    def has_add_permission(self, request):
        return False


@admin.register(KBArticle)
class KBArticleAdmin(admin.ModelAdmin):
    list_display = ('key', 'title', 'is_active', 'order', 'updated_at')
    list_filter = ('is_active',)
    search_fields = ('key', 'title', 'answer')
    prepopulated_fields = {'key': ('title',)}


@admin.register(SitemapDestination)
class SitemapDestinationAdmin(admin.ModelAdmin):
    list_display = ('key', 'path', 'label', 'is_active', 'order')
    list_filter = ('is_active',)
    search_fields = ('key', 'path', 'label')


@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ('ref', 'subject', 'category', 'reason', 'status', 'customer', 'created_at')
    list_filter = ('status', 'category', 'reason', 'created_at')
    search_fields = ('subject', 'customer__email', 'customer_ref', 'session_ref')
    readonly_fields = ('reason', 'session_ref', 'transcript', 'created_at', 'updated_at')


@admin.register(IdempotentRequest)
class IdempotentRequestAdmin(admin.ModelAdmin):
    list_display = ('key', 'endpoint', 'status_code', 'created_at')
    search_fields = ('key',)
    readonly_fields = ('key', 'endpoint', 'status_code', 'response', 'created_at')

    def has_add_permission(self, request):
        return False
