import os
import requests

BASE = 'https://api.vercel.com'

VERCEL_STATUS_MAP = {
    'READY': 'ready',
    'ERROR': 'error',
    'BUILDING': 'building',
    'QUEUED': 'queued',
    'CANCELED': 'cancelled',
    'CANCELLED': 'cancelled',
}


def _headers():
    token = os.environ.get('VERCEL_TOKEN', '')
    return {'Authorization': f'Bearer {token}'}


def _team_params(team_id=None):
    tid = team_id or os.environ.get('VERCEL_TEAM_ID', '')
    return {'teamId': tid} if tid else {}


def trigger_deployment(project_id, branch='main', team_id=None):
    r = requests.post(
        f'{BASE}/v13/deployments',
        headers=_headers(),
        params=_team_params(team_id),
        json={
            'name': project_id,
            'gitSource': {
                'type': 'github',
                'ref': branch,
            },
        },
        timeout=30,
    )
    r.raise_for_status()
    data = r.json()
    raw_status = data.get('readyState', 'QUEUED')
    return {
        'deployment_id': data.get('id', ''),
        'url': f"https://{data.get('url', '')}" if data.get('url') else '',
        'status': VERCEL_STATUS_MAP.get(raw_status.upper(), 'queued'),
    }


def get_deployment(deployment_id, team_id=None):
    r = requests.get(
        f'{BASE}/v13/deployments/{deployment_id}',
        headers=_headers(),
        params=_team_params(team_id),
        timeout=15,
    )
    r.raise_for_status()
    return r.json()


def list_deployments(project_id, team_id=None, limit=10):
    r = requests.get(
        f'{BASE}/v6/deployments',
        headers=_headers(),
        params={**_team_params(team_id), 'projectId': project_id, 'limit': limit},
        timeout=15,
    )
    r.raise_for_status()
    return r.json().get('deployments', [])


def list_projects(team_id=None, limit=100):
    """Return all Vercel projects for the authenticated token."""
    results = []
    params = {**_team_params(team_id), 'limit': limit}
    while True:
        r = requests.get(f'{BASE}/v9/projects', headers=_headers(), params=params, timeout=15)
        r.raise_for_status()
        data = r.json()
        results.extend(data.get('projects', []))
        pagination = data.get('pagination', {})
        next_cursor = pagination.get('next')
        if not next_cursor:
            break
        params['until'] = next_cursor
    return results


def add_domain_alias(deployment_id, alias, team_id=None):
    r = requests.post(
        f'{BASE}/v2/deployments/{deployment_id}/aliases',
        headers=_headers(),
        params=_team_params(team_id),
        json={'alias': alias},
        timeout=15,
    )
    r.raise_for_status()
    return r.json()
