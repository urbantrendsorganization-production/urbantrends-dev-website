# ---- Builder: install deps (build tools needed for compiled wheels) ----------
FROM python:3.14-slim AS builder

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build
RUN python -m venv /venv
ENV PATH="/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# ---- Runtime: lean image — no compiler, no headers --------------------------
FROM python:3.14-slim AS runtime

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/venv/bin:$PATH"

# Only the PostgreSQL client library is needed at runtime.
RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy the pre-built virtualenv; compiled extensions work because the Python
# version and base OS match the builder stage.
COPY --from=builder /venv /venv

WORKDIR /app

# Copy source. .dockerignore keeps .env, venv, db.sqlite3, __pycache__ out.
COPY . .

# Collect static assets at build time. A throwaway SECRET_KEY is fine here —
# collectstatic never uses the real key; it is injected at runtime.
RUN SECRET_KEY=build-time-collectstatic DEBUG=False \
    python manage.py collectstatic --noinput

# Non-root user for defence-in-depth. UID 1001 avoids colliding with any
# system account present in the base image.
RUN useradd --system --uid 1001 --no-create-home django \
    && chown -R django:django /app

# Entrypoint installed as root so it can live in /usr/local/bin.
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER django
EXPOSE 8000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["gunicorn", "main_backend.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "120", "--forwarded-allow-ips", "*", "--max-requests", "1000", "--max-requests-jitter", "100", "--access-logfile", "-"]
