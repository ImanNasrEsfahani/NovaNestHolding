#!/bin/sh

set -eu

DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-3306}"

# Wait for DB to be ready
echo "Database Host: $DB_HOST"
echo "Database Port: $DB_PORT"
echo "Waiting for database..."
while ! nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 1
done

echo "Database is up - running migrations..."
python manage.py migrate --noinput

echo "Starting server..."
exec "$@"
