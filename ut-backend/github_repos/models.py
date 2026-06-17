from django.db import models

from utils.crypto import decrypt_token, encrypt_token


class GitHubAccount(models.Model):
    ACCOUNT_TYPES = [('user', 'Personal'), ('org', 'Organisation')]
    login        = models.CharField(max_length=100, unique=True)
    account_type = models.CharField(max_length=10, choices=ACCOUNT_TYPES, default='user')
    avatar_url   = models.URLField(blank=True)
    access_token = models.TextField(blank=True)
    is_active    = models.BooleanField(default=True)
    notes        = models.TextField(blank=True)
    synced_at    = models.DateTimeField(null=True, blank=True, editable=False)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['login']
        verbose_name = 'GitHub Account'
        verbose_name_plural = 'GitHub Accounts'

    def __str__(self):
        return f"@{self.login} ({self.get_account_type_display()})"

    def save(self, *args, **kwargs):
        self.access_token = encrypt_token(self.access_token or '')
        super().save(*args, **kwargs)

    def get_access_token(self) -> str:
        return decrypt_token(self.access_token or '')


class GitHubRepo(models.Model):
    github_id      = models.BigIntegerField(unique=True)
    account        = models.ForeignKey(GitHubAccount, on_delete=models.CASCADE, related_name='repos')
    name           = models.CharField(max_length=200)
    full_name      = models.CharField(max_length=300)
    description    = models.TextField(blank=True)
    html_url       = models.URLField()
    language       = models.CharField(max_length=60, blank=True)
    stars          = models.PositiveIntegerField(default=0)
    forks          = models.PositiveIntegerField(default=0)
    is_private     = models.BooleanField(default=False)
    is_archived    = models.BooleanField(default=False)
    default_branch = models.CharField(max_length=100, default='main')
    topics         = models.JSONField(default=list)
    pushed_at      = models.DateTimeField(null=True, blank=True)
    synced_at      = models.DateTimeField(null=True, blank=True)
    is_featured    = models.BooleanField(default=False)
    project_label  = models.CharField(max_length=100, blank=True)
    internal_notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-stars', 'name']
        verbose_name = 'GitHub Repo'
        verbose_name_plural = 'GitHub Repos'

    def __str__(self):
        return self.full_name
