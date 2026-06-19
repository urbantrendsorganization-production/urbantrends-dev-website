# UrbanTrends — Official Website

The public website and API for [urbantrends.dev](https://urbantrends.dev). Built and maintained by the UrbanTrends engineering team.

UrbanTrends is a software studio from Nairobi. We design and ship production-grade products, APIs, integrations, and developer tools for businesses, startups, agencies, and developers across East Africa.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 · React 19 · TypeScript |
| Backend | Django 6 · Django REST Framework |
| Auth | Passkey (WebAuthn) · allauth headless |
| Database | PostgreSQL 16 |
| Reverse proxy | Caddy (TLS + subdomain routing) |
| Deployment | Docker · GitHub Actions · GHCR |

**Domains**
- `urbantrends.dev` — Next.js frontend
- `api.urbantrends.dev` — Django API + admin

---

## Repository Structure

```
urbantrends-dev-website/
├── ut-frontend/          # Next.js app (public website + auth UI)
├── ut-backend/           # Django API (auth, services, CMS, blog, contracts)
├── docker-compose.yml    # Production stack definition
├── Caddyfile.example     # Caddy reverse proxy config reference
└── .github/workflows/    # CI/CD pipelines
```

### Backend apps

| App | Purpose |
|---|---|
| `accounts` | Custom user model, passkey auth via allauth |
| `services` | Service catalog, pricing plans, orders, invoices, quote requests |
| `blog` | Blog posts and comments |
| `cms` | About page content, team members, site metrics |
| `contracts` | Client contracts and agreements |
| `github_repos` | GitHub repository tracking |
| `deployments` | Deployment monitoring |
| `gmail` | Gmail integration |

---

## CI/CD

Every push to `main` triggers a three-stage pipeline:

```
push → CI (tests + build) → Docker build & push (GHCR) → Deploy (VPS)
```

1. **CI** — Django system check + tests, TypeScript type-check, Next.js production build
2. **Build & push** — Docker images built and pushed to GitHub Container Registry
3. **Deploy** — `docker-compose.yml` shipped to VPS; images pulled from GHCR; migrations run

No source code lives on the production server. The VPS runs pre-built containers only.

### Required GitHub secrets

| Secret | Description |
|---|---|
| `VPS_HOST` | Production server IP or hostname |
| `VPS_USER` | SSH username |
| `VPS_SSH_KEY` | SSH private key |
| `VPS_PORT` | SSH port (default: 22) |
| `VPS_DEPLOY_PATH` | Directory on VPS where compose file and `.env` files live |
| `VPS_GHCR_TOKEN` | GitHub classic PAT with `read:packages` scope |

---

## Local Development

### Prerequisites

- Node.js 22+
- Python 3.14+
- Docker (optional, for full-stack local)

### Frontend

```bash
cd ut-frontend
npm install
npm run dev        # http://localhost:3000
npm run build
npx tsc --noEmit   # type-check
```

### Backend

```bash
cd ut-backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in values
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver  # http://localhost:8000
python manage.py test       # run all tests
```

### Full stack (Docker)

```bash
cp .env.example .env          # fill in POSTGRES_PASSWORD etc.
cp ut-backend/.env.example ut-backend/.env   # fill in Django secrets
docker compose up --build
```

Frontend at `http://localhost:3000` · Backend at `http://localhost:8000`

---

## Environment Variables

### Root `.env` (Docker Compose)

| Variable | Description |
|---|---|
| `POSTGRES_USER` | Postgres username |
| `POSTGRES_PASSWORD` | Postgres password |
| `POSTGRES_DB` | Database name |
| `NEXT_PUBLIC_SITE_URL` | Public frontend URL |

### `ut-backend/.env` (Django)

| Variable | Dev default | Production |
|---|---|---|
| `SECRET_KEY` | `change-me-in-production` | Long random string |
| `DEBUG` | `True` | `False` |
| `ALLOWED_HOSTS` | _(localhost only)_ | `api.urbantrends.dev` |
| `CSRF_TRUSTED_ORIGINS` | _(localhost only)_ | `https://urbantrends.dev` |
| `DATABASE_URL` | _(SQLite)_ | Set by Docker Compose |
| `RESEND_API_KEY` | _(empty)_ | Resend API key |
| `DEFAULT_FROM_EMAIL` | `noreply@urbantrends.dev` | `noreply@urbantrends.dev` |
| `FRONTEND_BASE_URL` | `http://localhost:3000` | `https://urbantrends.dev` |
| `WEBAUTHN_RP_ID` | `localhost` | `urbantrends.dev` |

---

## Auth

Authentication is passkey-first. The frontend is a headless allauth client — users register and sign in via WebAuthn passkeys or email verification codes. Passwords are never set.

The frontend proxies `/_allauth/*` and `/accounts/*` to Django. The browser never talks to the API directly.

---

## Production Server Setup (one-time)

```bash
# On the VPS — only config files live here, no source code
mkdir -p /opt/urbantrends/ut-backend

# Place environment files
nano /opt/urbantrends/.env
nano /opt/urbantrends/ut-backend/.env

# The deploy pipeline handles everything else from this point
```

---

## License

MIT — see [LICENSE](LICENSE).

---

Built in Nairobi. © 2026 UrbanTrends.
