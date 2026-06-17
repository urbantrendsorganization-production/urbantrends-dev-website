from django.contrib.admin.views.decorators import staff_member_required
from django.db.models import Prefetch
from django.shortcuts import redirect
from django.views.decorators.http import require_POST

from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import VercelProject, Deployment
from .serializers import VercelProjectSerializer, DeploymentSerializer


def _project_list_queryset():
    return VercelProject.objects.select_related('repo').prefetch_related(
        Prefetch(
            'deployments',
            queryset=Deployment.objects.order_by('-created_at')[:5],
            to_attr='recent_deploys',
        )
    )


def sync_vercel_projects():
    """Pull all projects from Vercel API and upsert VercelProject records.
    Auto-links to GitHubRepo by matching repo name. Returns count of upserted projects.
    """
    from django.conf import settings
    from github_repos.models import GitHubRepo
    from .vercel import list_projects

    team_id = getattr(settings, 'VERCEL_TEAM_ID', '')
    raw_projects = list_projects(team_id=team_id or None)

    # Build a lookup of repo name → GitHubRepo for auto-linking
    project_names = [(p.get('name') or '').lower() for p in raw_projects]
    repo_lookup = {
        r.name.lower(): r
        for r in GitHubRepo.objects.filter(name__in=project_names)
    }

    count = 0
    for p in raw_projects:
        # Try to detect framework
        fw_raw = (p.get('framework') or '').lower()
        framework = fw_raw if fw_raw in ('nextjs', 'vite', 'gatsby', 'remix') else 'other'

        # Production URL from aliases or targets
        production_url = ''
        targets = p.get('targets') or {}
        prod_target = targets.get('production') or {}
        if prod_target.get('alias'):
            alias = prod_target['alias']
            production_url = f"https://{alias[0]}" if isinstance(alias, list) and alias else ''
        if not production_url and p.get('alias'):
            aliases = p['alias']
            production_url = f"https://{aliases[0]}" if aliases else ''

        # Auto-link to GitHub repo by name match
        project_name = p.get('name', '')
        linked_repo = repo_lookup.get(project_name.lower())

        VercelProject.objects.update_or_create(
            vercel_project_id=p['id'],
            defaults={
                'name': project_name,
                'framework': framework,
                'production_url': production_url,
                'team_id': team_id,
                'repo': linked_repo,
            },
        )
        count += 1
    return count


@staff_member_required
@require_POST
def vercel_sync_view(request):
    """Import all Vercel projects from the API and redirect back to admin."""
    try:
        count = sync_vercel_projects()
        from django.contrib import messages
        messages.success(request, f'{count} Vercel project(s) synced.')
    except Exception as exc:
        from django.contrib import messages
        messages.error(request, f'Vercel sync failed: {exc}')
    return redirect('/admin/deployments/vercelproject/')


class VercelProjectListView(generics.ListAPIView):
    queryset = _project_list_queryset()
    serializer_class = VercelProjectSerializer
    permission_classes = [permissions.IsAdminUser]


class VercelProjectDetailView(generics.RetrieveAPIView):
    queryset = _project_list_queryset()
    serializer_class = VercelProjectSerializer
    permission_classes = [permissions.IsAdminUser]


class TriggerDeploymentView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            project = VercelProject.objects.get(pk=pk)
        except VercelProject.DoesNotExist:
            return Response({'error': 'Project not found.'}, status=status.HTTP_404_NOT_FOUND)

        branch = request.data.get('branch', 'main')
        environment = request.data.get('environment', 'production')

        from .vercel import trigger_deployment
        try:
            result = trigger_deployment(
                project.vercel_project_id,
                branch=branch,
                team_id=project.team_id or None,
            )
        except Exception as exc:
            return Response({'error': str(exc)}, status=status.HTTP_502_BAD_GATEWAY)

        deployment = Deployment.objects.create(
            vercel_deployment_id=result['deployment_id'],
            project=project,
            url=result['url'],
            environment=environment,
            branch=branch,
            status=result['status'],
            triggered_by=request.user,
        )
        return Response(DeploymentSerializer(deployment).data, status=status.HTTP_201_CREATED)
