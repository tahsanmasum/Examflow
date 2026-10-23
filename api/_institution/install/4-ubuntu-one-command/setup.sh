#!/usr/bin/env bash
# ExamFlow institution server — TYPE 4: a fresh Ubuntu server, ONE command, everything included.
#
#   sudo bash install/4-ubuntu-one-command/setup.sh
#
# For Ubuntu 22.04 / 24.04 (Debian 12 works too) with a DNS name pointing at this server and
# ports 80 + 443 open. It installs Docker and Caddy (free automatic HTTPS certificates), asks
# four questions, starts ExamFlow and registers it with GHUM. Nothing else to set up.
#
# Answer the questions in advance (no prompts):
#   sudo bash install/4-ubuntu-one-command/setup.sh --domain examflow.uni.edu \
#        --admins exam-office@uni.edu --code ABCD-EFGH-IJKL [--auth local|oidc] [--db sqlite|postgres|mariadb]
#   --db postgres / mariadb also runs that database in Docker for ExamFlow (default: built-in SQLite).
#   To use the university's EXISTING database server instead, put its DB_* settings in .env first
#   (see DATABASES.md) and run this script; it keeps them.
set -euo pipefail
PKG="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DOMAIN="" ; ADMINS="" ; CODE="" ; AUTH="" ; DB="" ; YES=0
while [ $# -gt 0 ]; do case "$1" in
  --domain) DOMAIN="${2:-}"; shift 2 ;; --admins) ADMINS="${2:-}"; shift 2 ;; --code) CODE="${2:-}"; shift 2 ;;
  --auth) AUTH="${2:-}"; shift 2 ;; --db) DB="${2:-}"; shift 2 ;; --yes|-y) YES=1; shift ;;
  -h|--help) sed -n '2,18p' "$0"; exit 0 ;; *) echo "Unknown option: $1 (see --help)"; exit 2 ;; esac; done
say() { printf '\n\033[1m▶ %s\033[0m\n' "$*"; }
ok()  { printf '  ✓ %s\n' "$*"; }
die() { printf '\n\033[31m✗ %s\033[0m\n' "$*" >&2; exit 1; }
ask() { local q="$1" d="${2:-}" a; if [ -t 0 ] && [ "$YES" = 0 ]; then read -r -p "  $q${d:+ [$d]}: " a; echo "${a:-$d}"; else echo "$d"; fi; }
setkey() { local k="$1" v="$2" f="$3"
  if grep -qE "^#?\s*$k=" "$f"; then awk -v k="$k" -v v="$v" 'BEGIN{d=0} { if (!d && $0 ~ "^#?[[:space:]]*" k "=") { print k "=" v; d=1 } else print }' "$f" > "$f.tmp" && mv "$f.tmp" "$f"; else echo "$k=$v" >> "$f"; fi; }
prev_env() { # newest .env in a sibling ExamFlow package folder (an earlier version unzipped next to this one)
  local f best="" bt=0 t; for f in "$(dirname "$PKG")"/*/.env; do [ -f "$f" ] && [ "$f" != "$PKG/.env" ] && [ -f "$(dirname "$f")/manifest.json" ] || continue
    t=$(stat -c %Y "$f" 2>/dev/null || stat -f %m "$f"); [ "$t" -gt "$bt" ] && { bt=$t; best=$f; }; done; echo "$best"; }
has_systemd() { [ -d /run/systemd/system ] && command -v systemctl >/dev/null; }

[ "$(id -u)" = 0 ] || die "Run as root:  sudo bash $0"
. /etc/os-release 2>/dev/null || true
case "${ID:-}" in ubuntu|debian) ;; *) die "This one-command setup is for Ubuntu or Debian (found: ${PRETTY_NAME:-unknown}). On other systems use install type 1 (Docker) or 2 (Linux without Docker)." ;; esac
[ -f "$PKG/manifest.json" ] || die "Run this from inside the unzipped ExamFlow package."
cd "$PKG"
PREV="$(prev_env)"
if [ ! -f .env ] && [ -n "$PREV" ]; then cp "$PREV" .env; ok "settings carried over from the earlier version: $PREV"; fi

# ── questions ──
say "ExamFlow setup for ${PRETTY_NAME:-this server}"
[ -z "$DOMAIN" ] && DOMAIN="$(ask 'Web address for ExamFlow (a DNS name pointing at this server)' "$(grep -E '^PUBLIC_URL=' .env 2>/dev/null | sed -E 's#^PUBLIC_URL=https?://##; s#/.*##' || true)")"
[ -n "$DOMAIN" ] || die "A web address is needed, e.g. --domain examflow.your-university.edu"
DOMAIN="${DOMAIN#https://}"; DOMAIN="${DOMAIN#http://}"; DOMAIN="${DOMAIN%%/*}"
[ -z "$ADMINS" ] && ADMINS="$(ask 'Admin emails (may open the Admin Monitor), comma-separated' "$(grep -E '^INSTITUTION_ADMIN_EMAILS=' .env 2>/dev/null | cut -d= -f2- || true)")"
[ -z "$AUTH" ] && AUTH="$(ask 'Teacher sign-in: local (activation codes) or oidc (Google / Microsoft / Keycloak)' "$(grep -E '^AUTH_MODE=' .env 2>/dev/null | cut -d= -f2- || echo local)")"
case "$AUTH" in local|oidc) ;; *) die "--auth must be local or oidc" ;; esac
EXISTING_DB="$(grep -E '^DB_TYPE=' .env 2>/dev/null | cut -d= -f2- || true)"
if [ -z "$DB" ]; then
  if [ -n "$EXISTING_DB" ] && [ "$EXISTING_DB" != sqlite ]; then DB=external; ok "using the database already set in .env (DB_TYPE=$EXISTING_DB)"
  else DB="$(ask 'Database: sqlite (built in), postgres or mariadb (run in Docker)' 'sqlite')"; fi
fi
case "$DB" in sqlite|external) WITH=() ;; postgres|postgresql) WITH=(--with postgres) ;; mariadb|mysql) WITH=(--with mariadb) ;; *) die "--db must be sqlite, postgres or mariadb" ;; esac

# ── Docker ──
say "Docker"
if docker version >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then ok "already installed ($(docker --version | cut -d, -f1))"
else
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -qq
  apt-get install -y -qq docker.io >/dev/null
  apt-get install -y -qq docker-compose-v2 >/dev/null 2>&1 || apt-get install -y -qq docker-compose-plugin >/dev/null 2>&1 \
    || die "Could not install the Docker Compose plugin. Install docker-compose-v2 (Ubuntu) or docker-compose-plugin (Docker's repository) and run this again."
  if has_systemd; then systemctl enable --now docker >/dev/null; else (dockerd >/var/log/dockerd.log 2>&1 &) ; sleep 5; fi
  docker version >/dev/null 2>&1 || die "Docker was installed but is not running."
  ok "installed $(docker --version | cut -d, -f1)"
fi

# ── Caddy (HTTPS) ──
say "HTTPS (Caddy, free automatic certificates)"
if ! command -v caddy >/dev/null; then
  export DEBIAN_FRONTEND=noninteractive
  apt-get install -y -qq caddy >/dev/null 2>&1 || {
    apt-get install -y -qq debian-keyring debian-archive-keyring apt-transport-https curl gpg >/dev/null
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor --yes -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' > /etc/apt/sources.list.d/caddy-stable.list
    apt-get update -qq && apt-get install -y -qq caddy >/dev/null; }
fi
command -v caddy >/dev/null || die "Caddy could not be installed. Install it (https://caddyserver.com/docs/install) and run this again."
mkdir -p /etc/caddy
if [ -f /etc/caddy/Caddyfile ] && ! grep -q 'ExamFlow' /etc/caddy/Caddyfile; then cp /etc/caddy/Caddyfile "/etc/caddy/Caddyfile.before-examflow.$(date +%s)"; ok "kept a copy of the old Caddyfile"; fi
cat > /etc/caddy/Caddyfile <<EOF
# ExamFlow — written by install/4-ubuntu-one-command/setup.sh
$DOMAIN {
    encode gzip
    request_body {
        max_size 3MB
    }
    reverse_proxy 127.0.0.1:8080
}
EOF
caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1 || die "The Caddy configuration is not valid (domain: $DOMAIN)."
if has_systemd; then systemctl enable caddy >/dev/null 2>&1; systemctl restart caddy
else caddy stop >/dev/null 2>&1 || true; caddy start --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1; fi
command -v ufw >/dev/null && ufw status 2>/dev/null | grep -q 'Status: active' && { ufw allow 80/tcp >/dev/null; ufw allow 443/tcp >/dev/null; ok "opened ports 80 and 443 in the firewall"; }
ok "https://$DOMAIN → ExamFlow"

# ── settings ──
say "Settings"
[ -f .env ] || cp .env.example .env
setkey PUBLIC_URL "https://$DOMAIN" .env
[ -n "$ADMINS" ] && setkey INSTITUTION_ADMIN_EMAILS "$ADMINS" .env
setkey AUTH_MODE "$AUTH" .env
setkey TRUST_PROXY 1 .env
chmod 600 .env
if [ "$AUTH" = oidc ] && ! grep -qE '^OIDC_CLIENT_ID=.+' .env; then
  echo "  AUTH_MODE=oidc needs your identity provider's details. Redirect URI to register there: https://$DOMAIN/auth/oidc/callback"
  setkey OIDC_ISSUER "$(ask 'OIDC issuer (e.g. https://accounts.google.com or https://login.microsoftonline.com/TENANT/v2.0)' '')" .env
  setkey OIDC_CLIENT_ID "$(ask 'OIDC client ID' '')" .env
  setkey OIDC_CLIENT_SECRET "$(ask 'OIDC client secret' '')" .env
fi
ok ".env saved (only root can read it)"

# ── start (type 1 does the rest) ──
ARGS=("${WITH[@]}"); [ -n "$CODE" ] && ARGS+=(--code "$CODE")
bash install/1-docker/install.sh "${ARGS[@]}"

say "ExamFlow is live at https://$DOMAIN"
cat <<EOF
  First visit may take a minute while the certificate is issued (DNS for $DOMAIN must point here,
  ports 80 and 443 must be reachable).
  Next: give teachers their sign-in codes (AUTH_MODE=local):
    cd $PKG && docker compose exec examflow node server/src/cli.js teacher-codes
  To upgrade later: unzip the new package and run this same command from it.
EOF
