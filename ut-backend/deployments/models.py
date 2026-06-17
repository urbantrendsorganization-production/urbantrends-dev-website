from django.conf import settings
from django.db import models


class VercelProject(models.Model):
    FRAMEWORK_CHOICES = [
        ('nextjs', 'Next.js'),
        ('vite', 'Vite'),
        ('gatsby', 'Gatsby'),
        ('remix', 'Remix'),
        ('other', 'Other'),
    ]
    vercel_project_id = models.CharField(max_length=100, unique=True)
    name              = models.CharField(max_length=200)
    repo              = models.ForeignKey(
        'github_repos.GitHubRepo',
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='vercel_projects',
    )
    framework      = models.CharField(max_length=20, choices=FRAMEWORK_CHOICES, default='nextjs')
    production_url = models.URLField(blank=True)
    custom_domain  = models.CharField(max_length=255, blank=True)
    team_id        = models.CharField(max_length=100, blank=True, help_text='Vercel team ID (optional)')
    notes          = models.TextField(blank=True)
    created_at     = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Vercel Project'

    def __str__(self):
        return self.name


class Deployment(models.Model):
    ENV_CHOICES = [
        ('production', 'Production'),
        ('preview', 'Preview'),
        ('development', 'Development'),
    ]
    STATUS_CHOICES = [
        ('queued', 'Queued'),
        ('building', 'Building'),
        ('ready', 'Ready'),
        ('error', 'Error'),
        ('cancelled', 'Cancelled'),
    ]
    vercel_deployment_id = models.CharField(max_length=200, unique=True)
    project              = models.ForeignKey(VercelProject, on_delete=models.CASCADE, related_name='deployments')
    url                  = models.URLField(blank=True)
    environment          = models.CharField(max_length=20, choices=ENV_CHOICES, default='production')
    branch               = models.CharField(max_length=200, blank=True)
    commit_sha           = models.CharField(max_length=40, blank=True)
    commit_message       = models.CharField(max_length=500, blank=True)
    status               = models.CharField(max_length=20, choices=STATUS_CHOICES, default='queued')
    triggered_by         = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='triggered_deployments',
        limit_choices_to={'is_staff': True},
    )
    created_at = models.DateTimeField(auto_now_add=True)
    ready_at   = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Deployment'

    def __str__(self):
        return f"{self.project.name} — {self.environment} — {self.status}"
