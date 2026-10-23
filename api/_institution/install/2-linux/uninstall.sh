#!/usr/bin/env bash
# Removes the ExamFlow service and program. The DATA and SETTINGS are kept unless you add --purge.
#   sudo bash install/2-linux/uninstall.sh            (keeps /var/lib/examflow and /etc/examflow)
#   sudo bash install/2-linux/uninstall.sh --purge    (deletes them too — exams and results are gone!)
set -euo pipefail
APP_HOME="${EXAMFLOW_HOME:-/opt/examflow}"; DATA_DIR="${EXAMFLOW_DATA:-/var/lib/examflow}"; ETC_DIR="${EXAMFLOW_ETC:-/etc/examflow}"
[ "$(id -u)" = 0 ] || { echo "Run as root: sudo bash $0"; exit 1; }
if command -v systemctl >/dev/null && [ -f /etc/systemd/system/examflow.service ]; then
  systemctl disable --now examflow 2>/dev/null || true
  rm -f /etc/systemd/system/examflow.service; systemctl daemon-reload
  echo "✓ service removed"
fi
rm -rf "$APP_HOME"; echo "✓ program removed ($APP_HOME)"
if [ "${1:-}" = "--purge" ]; then
  read -r -p "Delete ALL ExamFlow data in $DATA_DIR and settings in $ETC_DIR? Type DELETE to confirm: " a
  if [ "$a" = DELETE ]; then rm -rf "$DATA_DIR" "$ETC_DIR"; userdel examflow 2>/dev/null || true; echo "✓ data and settings deleted"; else echo "Kept the data."; fi
else
  echo "Kept: data in $DATA_DIR, settings in $ETC_DIR. (An external database is never touched.)"
fi
