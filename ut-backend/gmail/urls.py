from django.urls import path
from .views import gmail_auth, gmail_callback, GmailThreadListView, GmailThreadDetailView, GmailSyncView

urlpatterns = [
    path('gmail/auth', gmail_auth, name='gmail-auth'),
    path('gmail/callback', gmail_callback, name='gmail-callback'),
    path('gmail/threads', GmailThreadListView.as_view(), name='gmail-threads'),
    path('gmail/threads/<str:tid>', GmailThreadDetailView.as_view(), name='gmail-thread-detail'),
    path('gmail/sync', GmailSyncView.as_view(), name='gmail-sync'),
]
