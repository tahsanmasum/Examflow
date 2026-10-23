#!/usr/bin/env bash
# ExamFlow institution server — TYPE 6: Podman (Red Hat Enterprise Linux 8/9/10, Rocky, AlmaLinux,
# Oracle Linux, Fedora, CentOS Stream — where Podman is the standard container engine and Docker is not used).
#
#   sudo bash install/6-podman/install.sh
#
# Builds the image with Podman, keeps the data in the Podman volume "examflow-data", and runs ExamFlow
# as a systemd service through Quadlet (Podman 4.4+; older Podman: a generated systemd unit).
# SELinux stays enforcing (the volume is labelled :Z). Options:
#   --code CODE       register with GHUM right away
#   --env FILE        settings file (default: .env in the package folder; copied to /etc/examflow/examflow.env)
#   --host-network    share the machine's network (when the database runs on this same machine)
#   --no-systemd      build, check and run once in the foreground-free way, without a systemd unit
# Running it again with a newer package upgrades: new image, same volume and settings.
set -euo pipefail
PKG="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"; cd "$PKG"
CODE="" ; ENV_IN="" ; HOSTNET="" ; SYSTEMD=1
while [ $# -gt 0 ]; do case "$1" in
  --code) CODE="${2:-}"; shift 2 ;; --env) ENV_IN="${2:-}"; shift 2 ;; --host-network) HOSTNET=1; shift ;; --no-systemd) SYSTEMD=0; shift ;;
  -h|--help) sed -n '2,15p' "$0"; exit 0 ;; *) echo "Unknown option: $1 (see --help)"; exit 2 ;; esac; done
say() { printf '\n\033[1m▶ %s\033[0m\n' "$*"; }
ok()  { printf '  ✓ %s\n' "$*"; }
die() { printf '\n\033[31m✗ %s\033[0m\n' "$*" >&2; exit 1; }
[ "$(id -u)" = 0 ] || die "Run as root:  sudo bash $0"
[ -f manifest.json ] || die "Run this from inside the unzipped ExamFlow package."
command -v podman >/dev/null || die "Podman is not installed:  dnf install -y podman"
PV="$(podman version --format '{{.Client.Version}}' 2>/dev/null || podman --version | awk '{print $3}')"
ok "Podman $PV"

say "Settings"
mkdir -p /etc/examflow; chmod 750 /etc/examflow
ENV_FILE=/etc/examflow/examflow.env
if [ -n "$ENV_IN" ]; then cp "$ENV_IN" "$ENV_FILE"
elif [ -f .env ]; then cp .env "$ENV_FILE"
elif [ ! -f "$ENV_FILE" ]; then cp .env.example "$ENV_FILE"; die "Created $ENV_FILE. Fill in PUBLIC_URL, INSTITUTION_ADMIN_EMAILS, AUTH_MODE (and the database, DATABASES.md), then run this again."; fi
chmod 600 "$ENV_FILE"; ok "$ENV_FILE"
PORT="$(grep -E '^PORT=' "$ENV_FILE" | tail -1 | cut -d= -f2 || true)"; PORT="${PORT:-8080}"

VERSION="$(python3 -c 'import json;print(json.load(open("manifest.json"))["packageVersion"])' 2>/dev/null || sed -n 's/.*"packageVersion": *"\([^"]*\)".*/\1/p' manifest.json | head -1)"
IMAGE="localhost/examflow-institution:$VERSION"
say "Building $IMAGE"
podman build -q -t "$IMAGE" . >/dev/null
podman volume exists examflow-data || podman volume create examflow-data >/dev/null
ok "image built; data volume examflow-data"

NET=(-p "127.0.0.1:$PORT:$PORT"); [ -n "$HOSTNET" ] && NET=(--network host)
say "Full check"
podman run --rm "${NET[@]}" --env-file "$ENV_FILE" -e DATA_DIR=/data -e PACKAGE_DIR=/app -v examflow-data:/data:Z "$IMAGE" node server/src/cli.js check \
  || die "Fix the problems above in $ENV_FILE, then run this again."

podman rm -f examflow >/dev/null 2>&1 || true
if [ "$SYSTEMD" = 1 ] && [ -d /run/systemd/system ]; then
  say "Service"
  if [ -d /usr/libexec/podman ] && ls /usr/libexec/podman/quadlet >/dev/null 2>&1; then
    mkdir -p /etc/containers/systemd
    { echo "# ExamFlow — written by install/6-podman/install.sh"
      echo "[Unit]"; echo "Description=ExamFlow institution server"; echo "After=network-online.target"; echo
      echo "[Container]"; echo "Image=$IMAGE"; echo "ContainerName=examflow"; echo "EnvironmentFile=$ENV_FILE"
      echo "Environment=DATA_DIR=/data PACKAGE_DIR=/app"; echo "Volume=examflow-data:/data:Z"
      if [ -n "$HOSTNET" ]; then echo "Network=host"; else echo "PublishPort=127.0.0.1:$PORT:$PORT"; fi
      echo "HealthCmd=node server/src/healthcheck.js"; echo "HealthInterval=30s"; echo
      echo "[Service]"; echo "Restart=always"; echo "TimeoutStartSec=120"; echo
      echo "[Install]"; echo "WantedBy=multi-user.target default.target"; } > /etc/containers/systemd/examflow.container
    systemctl daemon-reload; systemctl restart examflow
    ok "Quadlet unit /etc/containers/systemd/examflow.container (systemctl status examflow)"
  else
    podman create --name examflow "${NET[@]}" --env-file "$ENV_FILE" -e DATA_DIR=/data -e PACKAGE_DIR=/app -v examflow-data:/data:Z "$IMAGE" >/dev/null
    podman generate systemd --new --name examflow > /etc/systemd/system/examflow.service 2>/dev/null
    podman rm examflow >/dev/null; systemctl daemon-reload; systemctl enable --now examflow >/dev/null
    ok "systemd unit /etc/systemd/system/examflow.service"
  fi
else
  podman run -d --name examflow --restart=always "${NET[@]}" --env-file "$ENV_FILE" -e DATA_DIR=/data -e PACKAGE_DIR=/app -v examflow-data:/data:Z "$IMAGE" >/dev/null
  ok "started (no systemd here: podman restarts it while the machine is up)"
fi
for i in $(seq 1 60); do sleep 1; podman exec examflow node server/src/healthcheck.js 2>/dev/null && { ok "healthy on 127.0.0.1:$PORT"; break; }; [ "$i" = 60 ] && { podman logs --tail 40 examflow || true; die "ExamFlow did not become healthy (log above)."; }; done
if [ -n "$CODE" ]; then say "Registering with GHUM"; podman exec examflow node server/src/cli.js register --code "$CODE"; fi
say "Done"
echo "  Commands:  podman logs -f examflow     podman exec examflow node server/src/cli.js <status|teachers|teacher-codes|db-check|backup>"
echo "  HTTPS in front: nginx (install/2-linux/nginx-examflow.conf) or Caddy. Allow it in SELinux: setsebool -P httpd_can_network_connect 1"
