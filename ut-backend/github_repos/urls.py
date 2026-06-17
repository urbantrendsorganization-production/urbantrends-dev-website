from django.urls import path
from .views import GitHubRepoListView, GitHubSyncView, github_webhook, github_auth, github_callback

urlpatterns = [
    path('github/auth', github_auth, name='github-auth'),
    path('github/callback', github_callback, name='github-callback'),
    path('github/repos', GitHubRepoListView.as_view(), name='github-repos'),
    path('github/sync', GitHubSyncView.as_view(), name='github-sync'),
    path('github/webhook', github_webhook, name='github-webhook'),
]
