#!/usr/bin/env sh
# Apply database migrations, then hand off to the container CMD (gunicorn).
# Migrations run on every boot — they're idempotent, and this keeps the
# single-VPS deploy simple (no separate migrate step to remember).
set -e

echo "Running database migrations..."
python manage.py migrate --noinput

# Re-collect static into STATIC_ROOT. collectstatic also runs at build time,
# but STATIC_ROOT is a shared volume with nginx that may already exist from a
# previous deploy and won't be re-seeded from the image — so refresh it here to
# keep nginx serving the current assets.
echo "Collecting static files..."
python manage.py collectstatic --noinput

exec "$@"
