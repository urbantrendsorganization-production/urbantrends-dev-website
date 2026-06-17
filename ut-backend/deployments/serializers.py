from rest_framework import serializers
from .models import VercelProject, Deployment


class DeploymentSerializer(serializers.ModelSerializer):
    triggered_by_email = serializers.EmailField(source='triggered_by.email', read_only=True, default=None)

    class Meta:
        model = Deployment
        fields = [
            'id', 'vercel_deployment_id', 'url', 'environment', 'branch',
            'commit_sha', 'commit_message', 'status', 'triggered_by_email',
            'created_at', 'ready_at',
        ]
        read_only_fields = fields


class VercelProjectSerializer(serializers.ModelSerializer):
    repo_full_name = serializers.CharField(source='repo.full_name', read_only=True, default=None)
    recent_deployments = serializers.SerializerMethodField()

    class Meta:
        model = VercelProject
        fields = [
            'id', 'vercel_project_id', 'name', 'framework', 'production_url',
            'custom_domain', 'repo', 'repo_full_name', 'notes', 'created_at',
            'recent_deployments',
        ]
        read_only_fields = fields

    def get_recent_deployments(self, obj):
        deployments = getattr(obj, 'recent_deploys', None)
        if deployments is None:
            deployments = obj.deployments.order_by('-created_at')[:5]
        return DeploymentSerializer(deployments, many=True).data
