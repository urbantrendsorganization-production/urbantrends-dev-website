from django.urls import path
from .views import (
    HomeDataView, ChangelogView, AboutView, StatusView,
    ToolsView, ProjectsView, ProductsView, DeveloperIntegrationsView,
    HealthView, PingView, ContactView, MonitoringAlertView,
)

urlpatterns = [
    path('health',                  HealthView.as_view()),
    path('ping',                    PingView.as_view()),
    path('contact',                 ContactView.as_view()),
    path('cms/home',                HomeDataView.as_view()),
    path('cms/changelog',           ChangelogView.as_view()),
    path('cms/about',               AboutView.as_view()),
    path('cms/status',              StatusView.as_view()),
    path('cms/tools',               ToolsView.as_view()),
    path('cms/projects',            ProjectsView.as_view()),
    path('cms/products',            ProductsView.as_view()),
    path('cms/developer-integrations', DeveloperIntegrationsView.as_view()),
    path('cms/monitoring-alert',    MonitoringAlertView.as_view()),
]
