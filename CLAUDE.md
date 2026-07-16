# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Structure

Two co-located sub-projects that form a single product:

- `ut-frontend/` — Next.js 16 / React 19 app (the public website + auth UI)
- `ut-backend/` — Django 6 API (auth, session management, future business logic)

Sub-project CLAUDE.md files exist and apply within their respective directories.

## Development

### Frontend (`ut-frontend/`)

```bash
npm install
npm run dev       # localhost:3000
npm run build
npm run start
```

No linter or test scripts are configured yet.

### Backend (`ut-backend/`)

```bash
source venv/bin/activate
python manage.py migrate
python manage.py runserver          # localhost:8000
python manage.py test               # all tests
python manage.py test accounts      # single app
python manage.py makemigrations     # after model changes
python manage.py createsuperuser
```

### Environment variables

Backend reads from `ut-backend/.env`:

| Variable | Dev default | Production value |
|---|---|---|
| `RESEND_API_KEY` | _(empty)_ | Resend API key |
| `DEFAULT_FROM_EMAIL` | `noreply@urbantrends.dev` | `noreply@urbantrends.dev` |
| `FRONTEND_BASE_URL` | `http://localhost:3000` | `https://urbantrends.dev` |
| `WEBAUTHN_RP_ID` | `localhost` | `urbantrends.dev` |
| `ALLOWED_HOSTS` | _(empty — localhost only)_ | `api.urbantrends.dev` |
| `CSRF_TRUSTED_ORIGINS` | _(empty — localhost only)_ | `https://urbantrends.dev,https://www.urbantrends.dev` |
| `SECRET_KEY` | `change-me-in-production` | _(long random string)_ |
| `DEBUG` | `True` | `False` |
| `STAFF_NOTIFICATION_EMAIL` | falls back to `DEFAULT_FROM_EMAIL` | ops inbox |
| `URBANTRENDS_API_KEY` | _(empty — agent API auth fails open)_ | long random string; Mica sends it as `Authorization: Bearer …` |
| `AGENT_QUOTE_TTL_HOURS` | `24` | `24` |

Frontend reads from standard Next.js env files (or Vercel project settings):

| Variable | Dev default | Production value |
|---|---|---|
| `BACKEND_URL` | `http://localhost:8000` | `https://api.urbantrends.dev` |
| `NEXT_PUBLIC_SITE_URL` | _(unset)_ | `https://urbantrends.dev` |

## Architecture

### Auth flow (passkey-first)

The frontend is a **headless allauth client**. Django exposes allauth's headless REST API at `/_allauth/browser/v1/`. Next.js proxies `/_allauth/*` and `/accounts/*` to Django via `next.config.ts` rewrites — the browser never talks to `localhost:8000` directly.

`ut-frontend/lib/auth.ts` is the sole auth abstraction. It handles:
- CSRF bootstrapping: GETs `/_allauth/browser/v1/config` before any unsafe verb to seed the `csrftoken` cookie, then sets `X-CSRFToken` on requests
- Passkey (WebAuthn) ceremonies: `passkeyLoginCeremony` / `passkeySignupCeremony` wrap the begin → `navigator.credentials.*` → complete three-leg dance
- allauth's 401 semantics: a 401 means "pending flow step" (e.g. verify email), not "bad credentials" — callers must branch on `data.flows` and `meta.is_authenticated`

On the Django side, `accounts.adapters.AccountAdapter` overrides `save_user` to always set an unusable password — users authenticate exclusively via passkey or email-code, never password.

### Country routing

`proxy.ts` (a Vercel Middleware wrapper) reads `x-vercel-ip-country` and sets a `ut-country` cookie. The `app/[country]/page.tsx` dynamic route renders `HomeContent` for two-letter country codes that appear in its allow-list — unknown codes get a 404. This lets SEO-targeted URLs like `/ke` or `/ng` render the home page with country-specific metadata.

### Frontend design system

No component library. Styles live in `app/globals.css` with CSS custom properties (`--font-sans`, `--font-mono`, `--fg-muted`, `--grid-line`, etc.) and `data-theme="dark|light"` on `<html>`. Theme preference persists in `localStorage` under `ut-theme`; an inline `<script>` in the root layout applies it before first paint to avoid flash.

Fonts: Geist Sans (`--font-sans`) and Geist Mono (`--font-mono`) from `next/font/google`.

### Django apps

- `main_backend/` — project config only (`settings.py`, `urls.py`)
- `accounts/` — custom `User` model (email as `USERNAME_FIELD`, no username), `AccountAdapter`
- Sessions use `qsessions.backends.cached_db` (stores device/user-agent metadata)
- MFA: WebAuthn passkeys primary, TOTP + recovery codes as optional second factors (`fido2` package)
- `WEBAUTHN_RP_ID = "localhost"` in dev; must be changed to apex domain in production
