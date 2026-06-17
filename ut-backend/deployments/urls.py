from django.urls import path
from .views import VercelProjectListView, VercelProjectDetailView, TriggerDeploymentView, vercel_sync_view

urlpatterns = [
    path('vercel/sync', vercel_sync_view, name='vercel-sync'),
    path('deployments/projects', VercelProjectListView.as_view(), name='deployment-projects'),
    path('deployments/projects/<int:pk>', VercelProjectDetailView.as_view(), name='deployment-project-detail'),
    path('deployments/projects/<int:pk>/deploy', TriggerDeploymentView.as_view(), name='trigger-deployment'),
]
