from django.contrib import admin
from django.utils.html import format_html
from .models import VercelProject, Deployment

DEPLOY_STATUS_COLORS = {
    'queued':    ('#f0f0ee', '#555555'),
    'building':  ('#fef3c7', '#92400e'),
    'ready':     ('#d1fae5', '#065f46'),
    'error':     ('#fee2e2', '#991b1b'),
    'cancelled': ('#f3f4f6', '#6b7280'),
}

ENV_COLORS = {
    'production': ('#dbeafe', '#1e40af'),
    'preview':    ('#ede9fe', '#5b21b6'),
    'development':('#f0fdf4', '#166534'),
}


class DeploymentInline(admin.TabularInline):
    model = Deployment
    fields = ('status_badge_display', 'environment_badge', 'branch', 'commit_message',
               'triggered_by', 'created_at', 'deploy_url')
    readonly_fields = fields
    extra = 0
    max_num = 0
    can_delete = False
    ordering = ('-created_at',)

    @admin.display(description='Status')
    def status_badge_display(self, obj):
        bg, fg = DEPLOY_STATUS_COLORS.get(obj.status, ('#f0f0ee', '#555'))
        return format_html(
            '<span style="background:{};color:{};padding:2px 8px;border-radius:12px;'
            'font-size:11px;font-weight:700;">{}</span>',
            bg, fg, obj.get_status_display(),
        )

    @admin.display(description='Env')
    def environment_badge(self, obj):
        bg, fg = ENV_COLORS.get(obj.environment, ('#f0f0ee', '#555'))
        return format_html(
            '<span style="background:{};color:{};padding:2px 6px;border-radius:10px;'
            'font-size:11px;font-weight:600;">{}</span>',
            bg, fg, obj.get_environment_display(),
        )

    @admin.display(description='URL')
    def deploy_url(self, obj):
        if not obj.url:
            return '—'
        return format_html('<a href="{}" target="_blank" rel="noopener">{}</a>', obj.url, obj.url[:60])


@admin.register(VercelProject)
class VercelProjectAdmin(admin.ModelAdmin):
    list_display  = ('name', 'framework', 'production_link', 'repo', 'created_at')
    search_fields = ('name', 'vercel_project_id', 'custom_domain')
    list_filter   = ('framework',)
    readonly_fields = ('created_at',)
    inlines = [DeploymentInline]
    actions = ['sync_from_vercel', 'trigger_production_deploy', 'trigger_preview_deploy']

    def has_add_permission(self, request):
        return False

    @admin.action(description='Sync projects from Vercel')
    def sync_from_vercel(self, request, queryset):
        from .views import sync_vercel_projects
        try:
            count = sync_vercel_projects()
            self.message_user(request, f'{count} Vercel project(s) synced.')
        except Exception as exc:
            self.message_user(request, f'Vercel sync failed: {exc}', level='error')

    fieldsets = (
        ('Project', {
            'fields': ('vercel_project_id', 'name', 'framework', 'repo'),
        }),
        ('URLs', {
            'fields': ('production_url', 'custom_domain'),
        }),
        ('Config', {
            'fields': ('team_id', 'notes', 'created_at'),
        }),
    )

    @admin.display(description='Production URL')
    def production_link(self, obj):
        if not obj.production_url:
            return '—'
        return format_html(
            '<a href="{}" target="_blank" rel="noopener">{}</a>',
            obj.production_url,
            obj.custom_domain or obj.production_url,
        )

    @admin.action(description='Trigger production deployment')
    def trigger_production_deploy(self, request, queryset):
        self._deploy(request, queryset, 'production', 'main')

    @admin.action(description='Trigger preview deployment')
    def trigger_preview_deploy(self, request, queryset):
        self._deploy(request, queryset, 'preview', 'develop')

    def _deploy(self, request, queryset, environment, branch):
        from django.utils import timezone
        from .vercel import trigger_deployment
        triggered = 0
        errors = []
        for project in queryset:
            try:
                result = trigger_deployment(
                    project.vercel_project_id,
                    branch=branch,
                    team_id=project.team_id or None,
                )
                Deployment.objects.create(
                    vercel_deployment_id=result['deployment_id'],
                    project=project,
                    url=result['url'],
                    environment=environment,
                    branch=branch,
                    status=result['status'],
                    triggered_by=request.user,
                )
                triggered += 1
            except Exception as exc:
                errors.append(f'{project.name}: {exc}')
        if triggered:
            self.message_user(request, f'{triggered} deployment(s) triggered.')
        for err in errors:
            self.message_user(request, err, level='error')


@admin.register(Deployment)
class DeploymentAdmin(admin.ModelAdmin):
    list_display  = ('project', 'environment_badge', 'status_badge', 'branch',
                     'triggered_by', 'created_at')
    list_filter   = ('status', 'environment', 'project')
    readonly_fields = ('vercel_deployment_id', 'project', 'url', 'environment', 'branch',
                       'commit_sha', 'commit_message', 'status', 'triggered_by',
                       'created_at', 'ready_at')
    search_fields = ('project__name', 'commit_message', 'commit_sha', 'vercel_deployment_id')

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    @admin.display(description='Status')
    def status_badge(self, obj):
        bg, fg = DEPLOY_STATUS_COLORS.get(obj.status, ('#f0f0ee', '#555'))
        return format_html(
            '<span style="background:{};color:{};padding:2px 8px;border-radius:12px;'
            'font-size:11px;font-weight:700;">{}</span>',
            bg, fg, obj.get_status_display(),
        )

    @admin.display(description='Env')
    def environment_badge(self, obj):
        bg, fg = ENV_COLORS.get(obj.environment, ('#f0f0ee', '#555'))
        return format_html(
            '<span style="background:{};color:{};padding:2px 6px;border-radius:10px;'
            'font-size:11px;font-weight:600;">{}</span>',
            bg, fg, obj.get_environment_display(),
        )
