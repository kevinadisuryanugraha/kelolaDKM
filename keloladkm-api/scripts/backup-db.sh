#!/usr/bin/env bash
# ── KelolaDKM API — Database Backup ─────────────────────────────────────────
# Backs up SQLite (default) or MySQL/MariaDB and prunes old backups.
#
# Usage:
#   ./scripts/backup-db.sh
#
# Cron (daily at 02:00, server):
#   0 2 * * * /www/wwwroot/.../keloladkm-api/scripts/backup-db.sh >> /var/log/keloladkm-backup.log 2>&1
#
# Optional env overrides:
#   BACKUP_DIR   (default: ./storage/backups)
#   KEEP_DAYS    (default: 14)
# ────────────────────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"

# Load application .env (if present) so DB_* variables are available.
if [ -f "$APP_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$APP_DIR/.env"
  set +a
fi

BACKUP_DIR="${BACKUP_DIR:-$APP_DIR/storage/backups}"
KEEP_DAYS="${KEEP_DAYS:-14}"
DB_CONNECTION="${DB_CONNECTION:-sqlite}"

mkdir -p "$BACKUP_DIR"
STAMP="$(date +%Y%m%d_%H%M%S)"

if [ "$DB_CONNECTION" = "sqlite" ]; then
  DB_FILE="${DB_DATABASE:-$APP_DIR/database/database.sqlite}"
  if [ ! -f "$DB_FILE" ]; then
    echo "ERROR: SQLite database not found: $DB_FILE" >&2
    exit 1
  fi
  DEST="$BACKUP_DIR/keloladkm-$STAMP.sqlite"
  sqlite3 "$DB_FILE" ".backup '$DEST'"
  echo "Backed up SQLite DB → $DEST"
else
  DEST="$BACKUP_DIR/keloladkm-$STAMP.sql"
  mysqldump \
    -h"${DB_HOST:-127.0.0.1}" \
    -P"${DB_PORT:-3306}" \
    -u"${DB_USERNAME:-root}" \
    -p"${DB_PASSWORD:-}" \
    "${DB_DATABASE:?DB_DATABASE must be set}" > "$DEST"
  echo "Backed up MySQL DB → $DEST"
fi

# Prune backups older than KEEP_DAYS.
find "$BACKUP_DIR" -name 'keloladkm-*' -type f -mtime +"$KEEP_DAYS" -delete
echo "Pruned backups older than ${KEEP_DAYS} days."
