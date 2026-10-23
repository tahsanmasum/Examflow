#!/usr/bin/env bash
# ExamFlow institution server — TYPE 2: Linux server WITHOUT Docker (Node.js + systemd)
#
# Works on Ubuntu 20.04+, Debian 11+, RHEL / Rocky / AlmaLinux / Oracle Linux 8+, SUSE 15+.
# Run as root from the unzipped package folder (or anywhere):
#
#   sudo bash install/2-linux/install.sh
#
# Options:
#   --code CODE        register with GHUM right away (the one-time registration code from GHUM)
#   --env FILE         use this settings file instead of asking (copied to /etc/examflow/examflow.env)
#   --install-node     install Node.js 22 from NodeSource if it is missing or too old
#   --no-start         install and check, but do not start the service
#   --no-systemd       for systems without systemd (containers): install and check, print how to start
#
# Running it again with a NEWER package upgrades in place: the data and settings stay, the new
# version is installed next to the old one and the service switches over (the old one is kept
# for going back). Uninstall: sudo bash install/2-linux/uninstall.sh
set -euo pipefail

PKG="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP_HOME="${EXAMFLOW_HOME:-/opt/examflow}"
DATA_DIR="${EXAMFLOW_DATA:-/var/lib/examflow}"
ETC_DIR="${EXAMFLOW_ETC:-/etc/examflow}"
ENV_FILE="$ETC_DIR/examflow.env"
SVC_USER=examflow
CODE="" ; ENV_IN="" ; INSTALL_NODE=0 ; START=1 ; SYSTEMD=1

while [ $# -gt 0 ]; do
  case "$1" in
    --code) CODE="${2:-}"; shift 2 ;;
    --env) ENV_IN="${2:-}"; shift 2 ;;
    --install-node) INSTALL_NODE=1; shift ;;
    --no-start) START=0; shift ;;
    --no-systemd) SYSTEMD=0; shift ;;
    -h|--help) sed -n '2,22p' "$0"; exit 0 ;;
    *) echo "Unknown option: $1 (see --help)"; exit 2 ;;
  esac
done

say()  { printf '\n\033[1m▶ %s\033[0m\n' "$*"; }
ok()   { printf '  ✓ %s\n' "$*"; }
die()  { printf '\n\033[31m✗ %s\033[0m\n' "$*" >&2; exit 1; }
ask()  { local q="$1" d="${2:-}" a; if [ -t 0 ]; then read -r -p "  $q${d:+ [$d]}: " a; echo "${a:-$d}"; else echo "$d"; fi; }

[ "$(id -u)" = 0 ] || die "Run as root:  sudo bash $0"
[ -f "$PKG/manifest.json" ] && [ -f "$PKG/server/src/server.js" ] || die "Run this from inside the unzipped ExamFlow package (manifest.json not found in $PKG)."

# ── 1. Node.js 22.13 or newer ───────────────────────────────────────────────
say "Checking Node.js"
node_ok() { command -v node >/dev/null 2>&1 && node -e 'const [a,b]=process.versions.node.split(".").map(Number);process.exit(a>22||(a===22&&b>=13)?0:1)'; }
if ! node_ok; then
  if [ "$INSTALL_NODE" = 1 ]; then
    say "Installing Node.js 22 (NodeSource)"
    if command -v apt-get >/dev/null; then
      apt-get update -qq && apt-get install -y -qq ca-certificates curl gnupg >/dev/null
      curl -fsSL https://deb.nodesource.com/setup_22.x | bash - >/dev/null && apt-get install -y -qq nodejs >/dev/null
    elif command -v dnf >/dev/null || command -v yum >/dev/null; then
      curl -fsSL https://rpm.nodesource.com/setup_22.x | bash - >/dev/null && (dnf install -y -q nodejs 2>/dev/null || yum install -y -q nodejs)
    elif command -v zypper >/dev/null; then
      zypper --non-interactive install nodejs22 >/dev/null
    else die "Could not find apt, dnf, yum or zypper. Install Node.js 22.13+ from https://nodejs.org and run this again."; fi
    node_ok || die "Node.js was installed but is older than 22.13. Install Node.js 22.13+ from https://nodejs.org and run this again."
  else
    die "Node.js 22.13 or newer is needed (found: $(node --version 2>/dev/null || echo none)).
  Run again with --install-node to install it automatically, or install it yourself:
    Ubuntu/Debian:  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash - && sudo apt-get install -y nodejs
    RHEL/Rocky:     curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash - && sudo dnf install -y nodejs"
  fi
fi
NODE_BIN="$(command -v node)"
ok "Node.js $(node --version) at $NODE_BIN"

# ── 2. The package is genuine and complete ──────────────────────────────────
say "Checking the package signature and every file"
NODE_OPTIONS=--disable-warning=ExperimentalWarning node -e '
  const { readPackage } = require(process.argv[1] + "/server/src/package.js");
  const p = readPackage(process.argv[1]);
  if (!p.ok) { console.error(p.errors.map(e => "  - " + e).join("\n")); process.exit(1); }
  console.log("  ✓ package " + p.manifest.packageId + " v" + p.manifest.packageVersion + " for " + p.manifest.institution.name + " (signed by key " + p.fingerprint + ")");
' "$PKG" || die "The package check failed. Do not install it; ask GHUM for a fresh package."
PKG_NAME="$(basename "$PKG")"

# ── 3. Service account and folders ──────────────────────────────────────────
say "Preparing the service account and folders"
if ! id "$SVC_USER" >/dev/null 2>&1; then
  useradd --system --home-dir "$DATA_DIR" --no-create-home --shell /usr/sbin/nologin "$SVC_USER" 2>/dev/null \
    || useradd -r -d "$DATA_DIR" -s /sbin/nologin "$SVC_USER"
  ok "created system user $SVC_USER"
else ok "system user $SVC_USER exists"; fi
mkdir -p "$APP_HOME/releases" "$DATA_DIR" "$ETC_DIR"
chown "$SVC_USER:$SVC_USER" "$DATA_DIR"; chmod 750 "$DATA_DIR"
chmod 750 "$ETC_DIR"; chown "root:$SVC_USER" "$ETC_DIR"
ok "program: $APP_HOME   data: $DATA_DIR   settings: $ENV_FILE"

# ── 4. Settings ─────────────────────────────────────────────────────────────
say "Settings"
setkey() { # setkey KEY VALUE FILE — replace or add KEY=VALUE
  local k="$1" v="$2" f="$3"
  if grep -qE "^#?\s*$k=" "$f"; then
    awk -v k="$k" -v v="$v" 'BEGIN{d=0} { if (!d && $0 ~ "^#?[[:space:]]*" k "=") { print k "=" v; d=1 } else print }' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
  else echo "$k=$v" >> "$f"; fi
}
if [ -n "$ENV_IN" ]; then
  [ -f "$ENV_IN" ] || die "--env file not found: $ENV_IN"
  cp "$ENV_IN" "$ENV_FILE"; ok "settings copied from $ENV_IN"
elif [ -f "$ENV_FILE" ]; then
  ok "keeping the existing settings in $ENV_FILE"
elif [ -f "$PKG/.env" ]; then
  cp "$PKG/.env" "$ENV_FILE"; ok "settings copied from $PKG/.env"
else
  cp "$PKG/.env.example" "$ENV_FILE"
  echo "  A few questions (press Enter to keep the suggestion; everything can be changed later in $ENV_FILE):"
  URL="$(ask 'Address teachers will open (https://…)' 'https://examflow.your-university.edu')"
  ADM="$(ask 'Admin emails, comma-separated (may open the Admin Monitor)' 'exam-office@your-university.edu')"
  AUTH="$(ask 'Teacher sign-in: local (codes) or oidc (Google/Microsoft/Keycloak)' 'local')"
  setkey PUBLIC_URL "$URL" "$ENV_FILE"; setkey INSTITUTION_ADMIN_EMAILS "$ADM" "$ENV_FILE"; setkey AUTH_MODE "$AUTH" "$ENV_FILE"
  [ "$AUTH" = oidc ] && echo "  → AUTH_MODE=oidc: fill OIDC_ISSUER, OIDC_CLIENT_ID and OIDC_CLIENT_SECRET in $ENV_FILE before starting."
  ok "settings written to $ENV_FILE (database: built-in SQLite; to use PostgreSQL, MySQL, SQL Server, Oracle or MongoDB see DATABASES.md)"
fi
setkey DATA_DIR "$DATA_DIR" "$ENV_FILE"
grep -qE '^HOST=' "$ENV_FILE" || setkey HOST 127.0.0.1 "$ENV_FILE"    # only the HTTPS proxy on this machine talks to it
grep -qE '^TRUST_PROXY=' "$ENV_FILE" || setkey TRUST_PROXY 1 "$ENV_FILE"
chown "root:$SVC_USER" "$ENV_FILE"; chmod 640 "$ENV_FILE"
PORT="$(grep -E '^PORT=' "$ENV_FILE" | tail -1 | cut -d= -f2 || true)"; PORT="${PORT:-8080}"

# ── 5. Install this version next to earlier ones ────────────────────────────
say "Installing the program"
STAMP="$(date +%Y%m%d-%H%M%S)"
REL="$APP_HOME/releases/$PKG_NAME"
if [ "$PKG" != "$REL" ]; then
  [ -d "$REL" ] && REL="$REL-$STAMP"
  mkdir -p "$REL"
  (cd "$PKG" && tar --exclude=./.env --exclude=./data --exclude=./backups -cf - .) | (cd "$REL" && tar -xf -)
fi
chown -R root:root "$REL"; chmod -R go-w "$REL"
ok "installed in $REL"

# ── 6. Full check as the service account (settings, signature, database) ────
say "Checking settings, package and database"
run_cli() { (cd "$REL" && runuser -u "$SVC_USER" -- env EXAMFLOW_ENV_FILE="$ENV_FILE" NODE_OPTIONS=--disable-warning=ExperimentalWarning "$NODE_BIN" server/src/cli.js "$@"); }
if ! run_cli check; then
  die "Fix the problems above in $ENV_FILE, then run this installer again (nothing was started)."
fi
PREV="$(readlink -f "$APP_HOME/current" 2>/dev/null || true)"
ln -sfn "$REL" "$APP_HOME/current"

# ── 7. Service ──────────────────────────────────────────────────────────────
if [ "$SYSTEMD" = 1 ] && command -v systemctl >/dev/null && [ -d /run/systemd/system ]; then
  say "Setting up the examflow service (starts with the machine, restarts if it stops)"
  sed -e "s#@APP@#$APP_HOME/current#g" -e "s#@ENV@#$ENV_FILE#g" -e "s#@NODE@#$NODE_BIN#g" -e "s#@DATA@#$DATA_DIR#g" -e "s#@USER@#$SVC_USER#g" \
    "$REL/install/2-linux/examflow.service" > /etc/systemd/system/examflow.service
  systemctl daemon-reload
  systemctl enable examflow >/dev/null 2>&1
  if [ "$START" = 1 ]; then
    systemctl restart examflow
    for i in $(seq 1 40); do
      sleep 0.5
      if "$NODE_BIN" -e "fetch('http://127.0.0.1:$PORT/healthz').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"; then ok "running on 127.0.0.1:$PORT"; break; fi
      [ "$i" = 40 ] && { journalctl -u examflow -n 30 --no-pager || true; [ -n "$PREV" ] && ln -sfn "$PREV" "$APP_HOME/current" && systemctl restart examflow; die "The server did not become healthy (log above). The previous version was put back."; }
    done
  fi
else
  say "No systemd here: start the server yourself with"
  echo "  cd $APP_HOME/current && sudo -u $SVC_USER env EXAMFLOW_ENV_FILE=$ENV_FILE NODE_OPTIONS=--disable-warning=ExperimentalWarning $NODE_BIN server/src/server.js"
  START=0
fi

# ── 8. Register with GHUM (once per server) ─────────────────────────────────
if [ -z "$CODE" ] && [ -t 0 ] && ! run_cli status 2>/dev/null | grep -q '^Registered: yes'; then
  CODE="$(ask 'Registration code from GHUM (leave empty to do it later)' '')"
fi
if [ -n "$CODE" ]; then
  say "Registering this server with GHUM"
  run_cli register --code "$CODE" || die "Registration failed (message above). Run later: cd $APP_HOME/current && sudo -u $SVC_USER env EXAMFLOW_ENV_FILE=$ENV_FILE node server/src/cli.js register --code CODE"
  [ "$START" = 1 ] && systemctl restart examflow
fi

say "Done"
cat <<EOF
  ExamFlow is installed.     Program: $APP_HOME/current     Data: $DATA_DIR     Settings: $ENV_FILE
  It listens on 127.0.0.1:$PORT. Put HTTPS in front of it (examples next to this script:
  nginx-examflow.conf, or Caddyfile.example in the package folder).

  Everyday commands (as root):
    systemctl status examflow            journalctl -u examflow -f
    cd $APP_HOME/current && sudo -u $SVC_USER env EXAMFLOW_ENV_FILE=$ENV_FILE node server/src/cli.js <command>
       commands: status · licence · teachers · teacher-codes · db-check · backup · register --code CODE
EOF
