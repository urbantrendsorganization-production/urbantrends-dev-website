from django.urls import path
from .views import (
    HomeDataView, ChangelogView, AboutView, StatusView,
    ToolsView, HealthView, ContactView, MonitoringAlertView,
)

urlpatterns = [
    path('health',                  HealthView.as_view()),
    path('contact',                 ContactView.as_view()),
    path('cms/home',                HomeDataView.as_view()),
    path('cms/changelog',           ChangelogView.as_view()),
    path('cms/about',               AboutView.as_view()),
    path('cms/status',              StatusView.as_view()),
    path('cms/tools',               ToolsView.as_view()),
    path('cms/monitoring-alert',    MonitoringAlertView.as_view()),
]
