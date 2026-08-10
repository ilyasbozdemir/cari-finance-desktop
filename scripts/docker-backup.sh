#!/bin/sh
# Automated SQLite & .cari Backup Script for Docker Volume

BACKUP_DIR="/app/backups"
DATA_DIR="/app/data"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/cari_finance_backup_${TIMESTAMP}.cari"

mkdir -p "${BACKUP_DIR}"

if [ -f "${DATA_DIR}/cari_finance.db" ]; then
  echo "[$(date)] Starting automatic SQLite database backup..."
  cp "${DATA_DIR}/cari_finance.db" "${BACKUP_FILE}"
  echo "[$(date)] Backup created successfully: ${BACKUP_FILE}"

  # Retain last 30 daily backups
  find "${BACKUP_DIR}" -type f -name "*.cari" -mtime +30 -exec rm -f {} \;
  echo "[$(date)] Cleaned up backups older than 30 days."
else
  echo "[$(date)] Warning: Database file ${DATA_DIR}/cari_finance.db not found!"
fi
