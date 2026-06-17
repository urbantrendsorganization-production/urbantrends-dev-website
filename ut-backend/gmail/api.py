import base64
import os
from datetime import datetime, timezone
from email.utils import parseaddr

from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']


def get_credentials():
    from .models import GmailCredential
    cred_obj = GmailCredential.objects.filter(pk=1).first()
    if not cred_obj or not cred_obj.get_refresh_token():
        raise RuntimeError('Gmail not connected. Visit /api/gmail/auth to authorise.')

    creds = Credentials(
        token=cred_obj.get_access_token(),
        refresh_token=cred_obj.get_refresh_token(),
        token_uri='https://oauth2.googleapis.com/token',
        client_id=os.environ.get('GOOGLE_CLIENT_ID', ''),
        client_secret=os.environ.get('GOOGLE_CLIENT_SECRET', ''),
        scopes=SCOPES,
    )
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        cred_obj.access_token = creds.token
        if creds.expiry:
            expiry = creds.expiry
            if expiry.tzinfo is None:
                expiry = expiry.replace(tzinfo=timezone.utc)
            cred_obj.token_expiry = expiry
        cred_obj.save(update_fields=['access_token', 'token_expiry', 'updated_at'])
    return creds


def get_service():
    return build('gmail', 'v1', credentials=get_credentials())


def list_threads(label_ids=None, max_results=50, query=None, service=None):
    if service is None:
        service = get_service()
    params = {'userId': 'me', 'maxResults': max_results}
    if label_ids:
        params['labelIds'] = label_ids
    if query:
        params['q'] = query
    result = service.users().threads().list(**params).execute()
    return result.get('threads', [])


def get_thread(thread_id, service=None):
    if service is None:
        service = get_service()
    return service.users().threads().get(userId='me', id=thread_id, format='full').execute()


def _walk_parts(payload):
    yield payload
    for part in payload.get('parts', []):
        yield from _walk_parts(part)


def _extract_body(payload):
    text_body = ''
    html_body = ''
    for part in _walk_parts(payload):
        mime = part.get('mimeType', '')
        data = part.get('body', {}).get('data', '')
        if not data:
            continue
        try:
            decoded = base64.urlsafe_b64decode(data + '==').decode('utf-8', errors='replace')
        except Exception:
            continue
        if mime == 'text/plain' and not text_body:
            text_body = decoded
        elif mime == 'text/html' and not html_body:
            html_body = decoded
    return text_body[:50000], html_body[:50000]


def parse_message(msg):
    headers = {h['name'].lower(): h['value'] for h in msg.get('payload', {}).get('headers', [])}
    _, from_addr = parseaddr(headers.get('from', ''))
    to_raw = headers.get('to', '')
    to_emails = [parseaddr(a.strip())[1] for a in to_raw.split(',') if a.strip()]
    date_ms = int(msg.get('internalDate', 0))
    sent_at = datetime.fromtimestamp(date_ms / 1000, tz=timezone.utc) if date_ms else None
    body_text, body_html = _extract_body(msg.get('payload', {}))
    has_attachments = any(
        bool(part.get('filename')) for part in _walk_parts(msg.get('payload', {}))
    )
    return {
        'message_id': msg['id'],
        'from_email': from_addr,
        'to_emails': to_emails,
        'subject': headers.get('subject', ''),
        'body_text': body_text,
        'body_html': body_html,
        'sent_at': sent_at,
        'has_attachments': has_attachments,
        'label_ids': msg.get('labelIds', []),
    }


def sync_inbox(max_results=100):
    from django.utils import timezone as tz
    from .models import GmailThread, GmailMessage
    service = get_service()
    threads_meta = list_threads(label_ids=['INBOX'], max_results=max_results, service=service)
    now = tz.now()
    processed = 0
    for t in threads_meta:
        try:
            full = get_thread(t['id'], service=service)
        except Exception:
            continue
        messages = full.get('messages', [])
        if not messages:
            continue
        parsed_messages = [parse_message(m) for m in messages]
        last_msg = max(messages, key=lambda m: int(m.get('internalDate', 0)))
        last_parsed = parse_message(last_msg)
        last_label_ids = last_msg.get('labelIds', [])
        thread_obj, _ = GmailThread.objects.update_or_create(
            thread_id=t['id'],
            defaults={
                'subject': last_parsed['subject'],
                'snippet': full.get('snippet', '')[:500],
                'from_email': last_parsed['from_email'],
                'to_emails': last_parsed['to_emails'],
                'message_count': len(messages),
                'last_message_at': last_parsed['sent_at'],
                'has_attachments': any(p['has_attachments'] for p in parsed_messages),
                'labels': last_label_ids,
                'is_read': 'UNREAD' not in last_label_ids,
                'is_starred': 'STARRED' in last_label_ids,
                'synced_at': now,
            },
        )
        for parsed in parsed_messages:
            GmailMessage.objects.update_or_create(
                message_id=parsed['message_id'],
                defaults={
                    'thread': thread_obj,
                    'from_email': parsed['from_email'],
                    'to_emails': parsed['to_emails'],
                    'subject': parsed['subject'],
                    'body_text': parsed['body_text'],
                    'body_html': parsed['body_html'],
                    'sent_at': parsed['sent_at'],
                    'has_attachments': parsed['has_attachments'],
                },
            )
        processed += 1
    return processed
