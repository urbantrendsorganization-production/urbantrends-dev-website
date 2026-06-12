from django.contrib import admin, messages
from django.utils import timezone

from .models import Comment, Post, Subscription, Tag


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display  = ('title', 'author', 'category', 'status', 'published_at', 'read_time')
    list_filter   = ('status', 'category', 'tags')
    search_fields = ('title', 'excerpt', 'body')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields     = ('read_time', 'published_at', 'created_at', 'updated_at')
    filter_horizontal   = ('tags',)
    actions = ['publish_posts', 'unpublish_posts']
    fieldsets = (
        ('Content', {
            'fields': ('title', 'slug', 'excerpt', 'body', 'tags'),
        }),
        ('Media', {
            'fields': ('cover_image_url', 'accent_color', 'category'),
        }),
        ('SEO', {
            'fields': ('meta_description', 'og_image_url'),
            'classes': ('collapse',),
        }),
        ('Publishing', {
            'fields': ('author', 'status', 'read_time', 'published_at', 'created_at', 'updated_at'),
        }),
    )

    @admin.action(description='Publish selected posts')
    def publish_posts(self, request, queryset):
        updated = 0
        for post in queryset.filter(status='draft'):
            post.status = 'published'
            if not post.published_at:
                post.published_at = timezone.now()
            post.save(update_fields=['status', 'published_at'])
            updated += 1
        self.message_user(request, f'{updated} post(s) published.', messages.SUCCESS)

    @admin.action(description='Unpublish selected posts')
    def unpublish_posts(self, request, queryset):
        updated = queryset.filter(status='published').update(status='draft')
        self.message_user(request, f'{updated} post(s) moved back to draft.', messages.SUCCESS)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display  = ('truncated_content', 'user', 'post', 'created_at')
    list_filter   = ('post',)
    search_fields = ('content', 'user__email')
    readonly_fields = ('post', 'user', 'created_at')

    @admin.display(description='Comment')
    def truncated_content(self, obj):
        return obj.content[:80] + ('…' if len(obj.content) > 80 else '')


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display  = ('email', 'user', 'is_active', 'created_at')
    list_filter   = ('is_active',)
    search_fields = ('email',)
    readonly_fields = ('created_at',)
    actions = ['export_emails']

    @admin.action(description='Export emails to console (dev)')
    def export_emails(self, request, queryset):
        emails = ', '.join(queryset.values_list('email', flat=True))
        self.message_user(request, f'Emails: {emails}', messages.INFO)
