from rest_framework import serializers
from .models import GitHubAccount, GitHubRepo


class GitHubAccountSerializer(serializers.ModelSerializer):
    repo_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = GitHubAccount
        fields = ['id', 'login', 'account_type', 'avatar_url', 'synced_at', 'repo_count']


class GitHubRepoSerializer(serializers.ModelSerializer):
    account_login = serializers.CharField(source='account.login', read_only=True)

    class Meta:
        model = GitHubRepo
        fields = [
            'id', 'github_id', 'account_login', 'name', 'full_name', 'description',
            'html_url', 'language', 'stars', 'forks', 'is_private', 'is_archived',
            'default_branch', 'topics', 'pushed_at', 'synced_at',
            'is_featured', 'project_label',
        ]
        read_only_fields = fields
