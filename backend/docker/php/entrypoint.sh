#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/html"
SCAFFOLD_DIR="${APP_DIR}/_scaffold"

# If no composer.json present, create Laravel app
if [ ! -f "${APP_DIR}/composer.json" ]; then
  echo "[bootstrap] Creating Laravel app in temp and syncing..."
  rm -rf /tmp/laravel-app && mkdir -p /tmp/laravel-app
  composer create-project laravel/laravel /tmp/laravel-app --no-interaction
  if command -v rsync >/dev/null 2>&1; then
    rsync -a /tmp/laravel-app/ ${APP_DIR}/
  else
    cp -a /tmp/laravel-app/. ${APP_DIR}/
  fi
fi

# Ensure storage directories
mkdir -p ${APP_DIR}/storage/framework/{cache,sessions,testing,views}
mkdir -p ${APP_DIR}/storage/logs
mkdir -p ${APP_DIR}/bootstrap/cache

# Ensure SQLite DB file exists
mkdir -p ${APP_DIR}/storage
if [ ! -f "${APP_DIR}/storage/database.sqlite" ]; then
  touch ${APP_DIR}/storage/database.sqlite
fi

# Composer packages
echo "[bootstrap] Installing required packages..."
composer config allow-plugins.dealerdirect/phpcodesniffer-composer-installer true || true
composer require tymon/jwt-auth:^2.0 league/flysystem-aws-s3-v3:^3.0 minishlink/web-push:^7.0 --no-interaction

# Apply scaffold overlay (routes, controllers, models, migrations, config, views)
if [ -d "${SCAFFOLD_DIR}" ]; then
  echo "[bootstrap] Applying scaffold..."
  if command -v rsync >/dev/null 2>&1; then
    rsync -a ${SCAFFOLD_DIR}/ ${APP_DIR}/
  else
    cp -a ${SCAFFOLD_DIR}/. ${APP_DIR}/
  fi
fi

# App key
if ! grep -q "APP_KEY=" ${APP_DIR}/.env 2>/dev/null; then
  cp ${APP_DIR}/.env.example ${APP_DIR}/.env || true
  php artisan key:generate
fi

# Publish JWT config and secret if not present
if [ ! -f "${APP_DIR}/config/jwt.php" ]; then
  php artisan vendor:publish --provider="Tymon\\JWTAuth\\Providers\\LaravelServiceProvider"
  php artisan jwt:secret --force
fi

# Ensure correct permissions (best effort in container)
chmod -R 777 ${APP_DIR}/storage ${APP_DIR}/bootstrap/cache || true

exec "$@"
