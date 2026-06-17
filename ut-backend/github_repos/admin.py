from django.contrib import admin
from django.shortcuts import redirect
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from .models import GitHubAccount, GitHubRepo

LANG_COLORS = {
    'Python': ('#3776ab', '#fff'),
    'TypeScript': ('#3178c6', '#fff'),
    'JavaScript': ('#f7df1e', '#000'),
    'Go': ('#00add8', '#fff'),
    'Rust': ('#ce422b', '#fff'),
    'Ruby': ('#cc342d', '#fff'),
    'Java': ('#b07219', '#fff'),
    'Dart': ('#00b4ab', '#fff'),
    'Swift': ('#f05138', '#fff'),
    'Kotlin': ('#a97bff', '#fff'),
    'C': ('#555555', '#fff'),
    'C++': ('#f34b7d', '#fff'),
    'Shell': ('#89e051', '#000'),
    'HTML': ('#e34c26', '#fff'),
    'CSS': ('#563d7c', '#fff'),
}


@admin.register(GitHubAccount)
class GitHubAccountAdmin(admin.ModelAdmin):
    list_display  = ('login', 'account_type', 'is_active', 'connect_link', 'synced_at', 'created_at')
    list_filter   = ('account_type', 'is_active')
    readonly_fields = ('synced_at', 'created_at', 'connect_link')
    exclude = ('access_token',)
    actions = ['sync_repos', 'deploy_to_vercel']

    def has_add_permission(self, request):
        return True

    def add_view(self, request, form_url='', extra_context=None):
        return redirect('/api/github/auth')

    @admin.display(description='GitHub OAuth')
    def connect_link(self, obj=None):
        return mark_safe(
            '<a class="button" href="/api/github/auth" '
            'style="padding:6px 16px;background:#22D3EE;color:#000;border-radius:6px;'
            'text-decoration:none;font-weight:600;font-size:13px;">Connect GitHub →</a>'
        )

    @admin.action(description='Deploy to Vercel (production)')
    def deploy_to_vercel(self, request, queryset):
        from deployments.vercel import trigger_deployment
        from deployments.models import Deployment
        triggered, errors = 0, []
        for repo in queryset:
            projects = list(repo.vercel_projects.all())
            if not projects:
                errors.append(f'{repo.name}: no linked Vercel project')
                continue
            for project in projects:
                try:
                    result = trigger_deployment(
                        project.vercel_project_id,
                        branch=repo.default_branch,
                        team_id=project.team_id or None,
                    )
                    Deployment.objects.create(
                        vercel_deployment_id=result['deployment_id'],
                        project=project,
                        url=result['url'],
                        environment='production',
                        branch=repo.default_branch,
                        status=result['status'],
                        triggered_by=request.user,
                    )
                    triggered += 1
                except Exception as exc:
                    errors.append(f'{repo.name} → {project.name}: {exc}')
        if triggered:
            self.message_user(request, f'{triggered} deployment(s) triggered.')
        for err in errors:
            self.message_user(request, err, level='error')

    @admin.action(description='Sync repos from GitHub')
    def sync_repos(self, request, queryset):
        from .management.commands.sync_github_repos import sync_account
        synced = 0
        errors = []
        for account in queryset.filter(is_active=True):
            try:
                count = sync_account(account)
                synced += count
            except Exception as exc:
                errors.append(f'@{account.login}: {exc}')
        if synced:
            self.message_user(request, f'{synced} repo(s) synced.')
        for err in errors:
            self.message_user(request, err, level='error')


@admin.register(GitHubRepo)
class GitHubRepoAdmin(admin.ModelAdmin):
    list_display   = ('name', 'account', 'language_badge', 'stars', 'privacy_badge',
                      'is_featured', 'pushed_at')
    list_filter    = ('language', 'account', 'is_private', 'is_featured', 'is_archived')
    list_editable  = ('is_featured',)
    search_fields  = ('name', 'full_name', 'description', 'project_label')
    readonly_fields = ('github_id', 'full_name', 'html_url', 'language', 'stars', 'forks',
                       'is_private', 'is_archived', 'default_branch', 'topics',
                       'pushed_at', 'synced_at', 'account', 'name', 'description', 'repo_link')
    fieldsets = (
        ('Repository', {
            'fields': ('github_id', 'account', 'name', 'full_name', 'repo_link',
                       'description', 'language', 'stars', 'forks',
                       'is_private', 'is_archived', 'default_branch', 'topics',
                       'pushed_at', 'synced_at'),
        }),
        ('Staff Enrichment', {
            'fields': ('is_featured', 'project_label', 'internal_notes'),
        }),
    )

    def has_add_permission(self, request):
        return False

    @admin.display(description='Language')
    def language_badge(self, obj):
        if not obj.language:
            return '—'
        bg, fg = LANG_COLORS.get(obj.language, ('#555', '#fff'))
        return format_html(
            '<span style="background:{};color:{};padding:2px 8px;border-radius:12px;'
            'font-size:11px;font-weight:700;">{}</span>',
            bg, fg, obj.language,
        )

    @admin.display(description='Visibility')
    def privacy_badge(self, obj):
        if obj.is_private:
            return format_html(
                '<span style="background:#374151;color:#9ca3af;padding:2px 8px;'
                'border-radius:12px;font-size:11px;font-weight:700;">Private</span>'
            )
        return format_html(
            '<span style="background:#d1fae5;color:#065f46;padding:2px 8px;'
            'border-radius:12px;font-size:11px;font-weight:700;">Public</span>'
        )

    @admin.display(description='GitHub Link')
    def repo_link(self, obj):
        return format_html('<a href="{}" target="_blank" rel="noopener">{}</a>', obj.html_url, obj.html_url)
