#!/bin/sh
set -e

echo "=== Starting TimeZone Watches Container ==="

# Wait for MySQL database if host is specified
if [ -n "$DB_HOST" ]; then
  echo "Waiting for MySQL at $DB_HOST:$DB_PORT..."
  while ! nc -z "$DB_HOST" "$DB_PORT"; do
    sleep 1
  done
  echo "MySQL is up and running!"
fi

echo "Applying database migrations..."
python manage.py makemigrations accounts products cart orders --noinput || true
python manage.py migrate --noinput

echo "Seeding initial watch catalog (12 sample luxury watches)..."
python manage.py seed_watches || true

echo "Starting server..."
exec "$@"
