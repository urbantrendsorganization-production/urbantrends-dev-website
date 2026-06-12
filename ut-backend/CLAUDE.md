# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Setup

```bash
source venv/bin/activate
python manage.py migrate
python manage.py runserver
```

## Common Commands

```bash
python manage.py runserver          # Start dev server (default :8000)
python manage.py migrate            # Apply migrations
python manage.py makemigrations     # Generate migrations after model changes
python manage.py test               # Run all tests
python manage.py test accounts      # Run tests for a specific app
python manage.py createsuperuser    # Create admin user
```

## Architecture

Django 6.0.5 backend for the UrbanTrends website. The frontend lives in `../ut-frontend`.

**Project layout:**
- `main_backend/` — Django project config: `settings.py`, `urls.py`, `wsgi.py`, `asgi.py`
- `accounts/` — User auth/session app (currently scaffolded, not yet implemented)
- `db.sqlite3` — SQLite database (development only)

**Session management** uses `django-qsessions` (`qsessions.backends.cached_db`), which stores sessions in the DB with device/user-agent metadata. `ua-parser` is installed for parsing User-Agent strings — relevant for session device tracking.

Session cookie settings in `settings.py` enforce `Secure`, `HttpOnly`, `SameSite=Lax`, and browser-close expiry.

**URL routing:** Only `admin/` is wired up so far. App-level URL includes go in `main_backend/urls.py`.

**Timezone:** `Africa/Nairobi` (UTC+3).
