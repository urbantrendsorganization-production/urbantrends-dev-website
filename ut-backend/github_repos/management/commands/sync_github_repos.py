from django.core.management.base import BaseCommand
from django.utils import timezone


def sync_account(account):
    from github_repos.github_api import fetch_user_repos, fetch_org_repos, parse_pushed_at
    from github_repos.models import GitHubRepo
    token = account.get_access_token() or None
    raw_repos = (
        fetch_org_repos(account.login, token=token)
        if account.account_type == 'org'
        else fetch_user_repos(account.login, token=token)
    )
    now = timezone.now()
    count = 0
    for r in raw_repos:
        GitHubRepo.objects.update_or_create(
            github_id=r['id'],
            defaults={
                'account': account,
                'name': r['name'],
                'full_name': r['full_name'],
                'description': r.get('description') or '',
                'html_url': r['html_url'],
                'language': r.get('language') or '',
                'stars': r.get('stargazers_count', 0),
                'forks': r.get('forks_count', 0),
                'is_private': r.get('private', False),
                'is_archived': r.get('archived', False),
                'default_branch': r.get('default_branch', 'main'),
                'topics': r.get('topics', []),
                'pushed_at': parse_pushed_at(r.get('pushed_at')),
                'synced_at': now,
            },
        )
        count += 1
    account.synced_at = now
    account.save(update_fields=['synced_at'])
    return count


class Command(BaseCommand):
    help = 'Sync GitHub repos from all active GitHubAccounts'

    def handle(self, *args, **options):
        from github_repos.models import GitHubAccount
        accounts = GitHubAccount.objects.filter(is_active=True)
        if not accounts.exists():
            self.stdout.write('No active GitHub accounts configured.')
            return
        total = 0
        for account in accounts:
            try:
                count = sync_account(account)
                total += count
                self.stdout.write(f'  @{account.login}: {count} repos')
            except Exception as exc:
                self.stderr.write(self.style.ERROR(f'  @{account.login}: {exc}'))
        self.stdout.write(self.style.SUCCESS(f'Done. {total} repos synced total.'))
