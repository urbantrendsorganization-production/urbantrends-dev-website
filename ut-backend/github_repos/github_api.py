import os
import requests
from datetime import datetime, timezone

BASE = 'https://api.github.com'


def _headers(token=None):
    token = token or os.environ.get('GITHUB_TOKEN', '')
    return {
        'Authorization': f'Bearer {token}',
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
    }


def parse_pushed_at(raw):
    if not raw:
        return None
    return datetime.fromisoformat(raw.replace('Z', '+00:00'))


def fetch_authenticated_user(token):
    r = requests.get(f'{BASE}/user', headers=_headers(token), timeout=15)
    r.raise_for_status()
    return r.json()


def fetch_user_repos(login, token=None):
    results = []
    page = 1
    while True:
        r = requests.get(
            f'{BASE}/user/repos',
            headers=_headers(token),
            params={'per_page': 100, 'page': page, 'type': 'all'},
            timeout=15,
        )
        r.raise_for_status()
        batch = r.json()
        if not batch:
            break
        results.extend([repo for repo in batch if repo['owner']['login'] == login])
        if len(batch) < 100:
            break
        page += 1
    return results


def fetch_org_repos(org, token=None):
    results = []
    page = 1
    while True:
        r = requests.get(
            f'{BASE}/orgs/{org}/repos',
            headers=_headers(token),
            params={'per_page': 100, 'page': page, 'type': 'all'},
            timeout=15,
        )
        r.raise_for_status()
        batch = r.json()
        if not batch:
            break
        results.extend(batch)
        if len(batch) < 100:
            break
        page += 1
    return results
