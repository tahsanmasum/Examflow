#!/bin/sh
# ExamFlow institution server — TYPE 9: FreeBSD 13.2+ / 14 (also works the same way on other BSDs with rc.d).
#
#   install/9-freebsd/install.sh [--code CODE] [--env FILE] [--install-node]      (as root)
#
# Program: /usr/local/examflow   Data: /var/db/examflow   Settings: /usr/local/etc/examflow/examflow.env
# Service: service examflow start|stop|status   (logs go to syslog: /var/log/messages, tag "examflow")
set -eu
PKG=$(cd "$(dirname "$0")/../.." && pwd)
APP=/usr/local/examflow; DATA=/var/db/examflow; ETC=/usr/local/etc/examflow; ENV_FILE=$ETC/examflow.env
CODE=""; ENV_IN=""; INSTALL_NODE=0
while [ $# -gt 0 ]; do case "$1" in
  --code) CODE="$2"; shift 2 ;; --env) ENV_IN="$2"; shift 2 ;; --install-node) INSTALL_NODE=1; shift ;;
  -h|--help) sed -n '2,8p' "$0"; exit 0 ;; *) echo "Unknown option: $1"; exit 2 ;; esac; done
say() { printf '\n> %s\n' "$*"; }
die() { printf '\nERROR: %s\n' "$*" >&2; exit 1; }
[ "$(id -u)" = 0 ] || die "Run as root."
[ -f "$PKG/manifest.json" ] || die "Run this from inside the unzipped ExamFlow package."

say "Node.js"
node_ok() { command -v node >/dev/null 2>&1 && node -e 'const [a,b]=process.versions.node.split(".").map(Number);process.exit(a>22||(a===22&&b>=13)?0:1)'; }
if ! node_ok; then
  [ "$INSTALL_NODE" = 1 ] || die "Node.js 22.13+ is needed:  pkg install -y node22   (or run with --install-node)"
  pkg install -y node22 >/dev/null; node_ok || die "Node.js 22.13+ could not be installed."
fi
echo "  ok: Node.js $(node --version)"

say "Package signature and files"
NODE_OPTIONS=--disable-warning=ExperimentalWarning node -e '
  const { readPackage } = require(process.argv[1] + "/server/src/package.js"); const p = readPackage(process.argv[1]);
  if (!p.ok) { console.error(p.errors.join("\n")); process.exit(1); } console.log("  ok: " + p.manifest.packageId + " v" + p.manifest.packageVersion + " (key " + p.fingerprint + ")");' "$PKG" || die "Package check failed. Ask GHUM for a fresh package."

say "Account, folders, settings"
pw usershow examflow >/dev/null 2>&1 || pw useradd examflow -d "$DATA" -s /usr/sbin/nologin -c "ExamFlow" >/dev/null
install -d -o examflow -g examflow -m 750 "$DATA"; install -d -o root -g examflow -m 750 "$ETC"; mkdir -p "$APP/releases"
if [ -n "$ENV_IN" ]; then cp "$ENV_IN" "$ENV_FILE"; elif [ ! -f "$ENV_FILE" ]; then
  if [ -f "$PKG/.env" ]; then cp "$PKG/.env" "$ENV_FILE"; else cp "$PKG/.env.example" "$ENV_FILE"; chown root:examflow "$ENV_FILE"; chmod 640 "$ENV_FILE"
    die "Created $ENV_FILE. Fill in PUBLIC_URL, INSTITUTION_ADMIN_EMAILS, AUTH_MODE (and the database, DATABASES.md), then run this again."; fi; fi
grep -q '^DATA_DIR=' "$ENV_FILE" || echo "DATA_DIR=$DATA" >> "$ENV_FILE"
grep -q '^HOST=' "$ENV_FILE" || echo "HOST=127.0.0.1" >> "$ENV_FILE"
grep -q '^TRUST_PROXY=' "$ENV_FILE" || echo "TRUST_PROXY=1" >> "$ENV_FILE"
chown root:examflow "$ENV_FILE"; chmod 640 "$ENV_FILE"

say "Program"
REL="$APP/releases/$(basename "$PKG")"; [ -d "$REL" ] && REL="$REL-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$REL"; (cd "$PKG" && tar --exclude ./.env --exclude ./data -cf - .) | (cd "$REL" && tar -xf -)
chown -R root:wheel "$REL"; chmod -R go-w "$REL"
(cd "$REL" && su -m examflow -c "env EXAMFLOW_ENV_FILE=$ENV_FILE NODE_OPTIONS=--disable-warning=ExperimentalWarning node server/src/cli.js check") || die "Fix the problems above in $ENV_FILE, then run this again."
ln -sfh "$REL" "$APP/current"

say "Service"
install -m 555 "$REL/install/9-freebsd/examflow.rc" /usr/local/etc/rc.d/examflow
sysrc examflow_enable=YES >/dev/null
service examflow restart >/dev/null 2>&1 || service examflow start
if [ -n "$CODE" ]; then (cd "$APP/current" && su -m examflow -c "env EXAMFLOW_ENV_FILE=$ENV_FILE node server/src/cli.js register --code $CODE"); service examflow restart; fi
say "Done. ExamFlow listens on 127.0.0.1 (PORT in $ENV_FILE). HTTPS in front: nginx (pkg install nginx; install/2-linux/nginx-examflow.conf) or Caddy."
