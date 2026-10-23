#!/bin/bash
# ExamFlow institution server — TYPE 7: macOS 13 Ventura or newer (Apple silicon or Intel), e.g. a Mac mini server.
#
#   sudo bash install/7-macos/install.sh
#
# Needs Node.js 22.13+ (the nodejs.org macOS installer, or Homebrew: brew install node@22).
# Runs ExamFlow as a launchd service (starts at boot, restarts if it stops) under the unprivileged
# "nobody" account. Program: /usr/local/examflow   Data + settings: /Library/Application Support/ExamFlow
# Options: --code CODE (register now), --env FILE (settings file), --no-start
set -euo pipefail
PKG="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP=/usr/local/examflow ; SUP="/Library/Application Support/ExamFlow" ; DATA="$SUP/data" ; ENV_FILE="$SUP/examflow.env"
LOGS=/Library/Logs/ExamFlow ; LABEL=edu.ghum.examflow ; PLIST=/Library/LaunchDaemons/$LABEL.plist
CODE="" ; ENV_IN="" ; START=1
while [ $# -gt 0 ]; do case "$1" in
  --code) CODE="${2:-}"; shift 2 ;; --env) ENV_IN="${2:-}"; shift 2 ;; --no-start) START=0; shift ;;
  -h|--help) sed -n '2,10p' "$0"; exit 0 ;; *) echo "Unknown option: $1"; exit 2 ;; esac; done
say() { printf '\n\033[1m▶ %s\033[0m\n' "$*"; }
ok()  { printf '  ✓ %s\n' "$*"; }
die() { printf '\n\033[31m✗ %s\033[0m\n' "$*" >&2; exit 1; }
ask() { local q="$1" d="${2:-}" a; if [ -t 0 ]; then read -r -p "  $q${d:+ [$d]}: " a; echo "${a:-$d}"; else echo "$d"; fi; }
setkey() { local k="$1" v="$2" f="$3"
  if grep -qE "^#?[[:space:]]*$k=" "$f"; then awk -v k="$k" -v v="$v" 'BEGIN{d=0} { if (!d && $0 ~ "^#?[[:space:]]*" k "=") { print k "=" v; d=1 } else print }' "$f" > "$f.tmp" && mv "$f.tmp" "$f"; else echo "$k=$v" >> "$f"; fi; }

[ "$(uname -s)" = Darwin ] || die "This is the macOS installer. On Linux use type 2, 4 or 6."
[ "$(id -u)" = 0 ] || die "Run as administrator:  sudo bash $0"
[ -f "$PKG/manifest.json" ] || die "Run this from inside the unzipped ExamFlow package."

say "Checking Node.js"
NODE=""; for n in "$(command -v node || true)" /opt/homebrew/opt/node@22/bin/node /usr/local/opt/node@22/bin/node /opt/homebrew/bin/node /usr/local/bin/node; do
  [ -n "$n" ] && [ -x "$n" ] && "$n" -e 'const [a,b]=process.versions.node.split(".").map(Number);process.exit(a>22||(a===22&&b>=13)?0:1)' 2>/dev/null && { NODE="$n"; break; }; done
[ -n "$NODE" ] || die "Node.js 22.13+ is needed: download the macOS installer from https://nodejs.org, or  brew install node@22  — then run this again."
ok "Node.js $("$NODE" --version) at $NODE"

say "Checking the package signature and every file"
NODE_OPTIONS=--disable-warning=ExperimentalWarning "$NODE" -e '
  const { readPackage } = require(process.argv[1] + "/server/src/package.js"); const p = readPackage(process.argv[1]);
  if (!p.ok) { console.error(p.errors.map(e => "  - " + e).join("\n")); process.exit(1); }
  console.log("  ✓ package " + p.manifest.packageId + " v" + p.manifest.packageVersion + " for " + p.manifest.institution.name + " (key " + p.fingerprint + ")");' "$PKG" \
  || die "The package check failed. Ask GHUM for a fresh package."

say "Settings"
mkdir -p "$DATA" "$LOGS" "$APP/releases"
if [ -n "$ENV_IN" ]; then cp "$ENV_IN" "$ENV_FILE"
elif [ -f "$ENV_FILE" ]; then ok "keeping $ENV_FILE"
elif [ -f "$PKG/.env" ]; then cp "$PKG/.env" "$ENV_FILE"
else
  cp "$PKG/.env.example" "$ENV_FILE"
  setkey PUBLIC_URL "$(ask 'Address teachers will open (https://…)' 'https://examflow.your-university.edu')" "$ENV_FILE"
  setkey INSTITUTION_ADMIN_EMAILS "$(ask 'Admin emails, comma-separated' 'exam-office@your-university.edu')" "$ENV_FILE"
  setkey AUTH_MODE "$(ask 'Teacher sign-in: local or oidc' 'local')" "$ENV_FILE"
fi
setkey DATA_DIR "$DATA" "$ENV_FILE"
grep -qE '^HOST=' "$ENV_FILE" || setkey HOST 127.0.0.1 "$ENV_FILE"
grep -qE '^TRUST_PROXY=' "$ENV_FILE" || setkey TRUST_PROXY 1 "$ENV_FILE"
chown root:wheel "$ENV_FILE"; chmod 644 "$ENV_FILE"   # "nobody" must read it; only administrators can change it
chown -R nobody:nobody "$DATA" "$LOGS"; chmod 700 "$DATA"
PORT="$(grep -E '^PORT=' "$ENV_FILE" | tail -1 | cut -d= -f2 || true)"; PORT="${PORT:-8080}"
ok "settings $ENV_FILE   data $DATA"

say "Installing the program"
REL="$APP/releases/$(basename "$PKG")"; [ -d "$REL" ] && REL="$REL-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$REL"; (cd "$PKG" && tar --exclude=./.env --exclude=./data -cf - .) | (cd "$REL" && tar -xf -)
chown -R root:wheel "$REL"; chmod -R go-w "$REL"
(cd "$REL" && sudo -u nobody env EXAMFLOW_ENV_FILE="$ENV_FILE" NODE_OPTIONS=--disable-warning=ExperimentalWarning "$NODE" server/src/cli.js check) || die "Fix the problems above in $ENV_FILE, then run this again."
ln -sfn "$REL" "$APP/current"
ok "installed in $REL"

say "launchd service $LABEL"
cat > "$PLIST" <<EOP
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>$LABEL</string>
  <key>ProgramArguments</key><array><string>$NODE</string><string>server/src/server.js</string></array>
  <key>WorkingDirectory</key><string>$APP/current</string>
  <key>EnvironmentVariables</key><dict>
    <key>EXAMFLOW_ENV_FILE</key><string>$ENV_FILE</string>
    <key>NODE_ENV</key><string>production</string>
    <key>NODE_OPTIONS</key><string>--disable-warning=ExperimentalWarning</string>
  </dict>
  <key>UserName</key><string>nobody</string>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>ThrottleInterval</key><integer>5</integer>
  <key>StandardOutPath</key><string>$LOGS/examflow.log</string>
  <key>StandardErrorPath</key><string>$LOGS/examflow.log</string>
</dict>
</plist>
EOP
chown root:wheel "$PLIST"; chmod 644 "$PLIST"; plutil -lint "$PLIST" >/dev/null
launchctl bootout system "$PLIST" >/dev/null 2>&1 || true
if [ "$START" = 1 ]; then
  launchctl bootstrap system "$PLIST"
  for i in $(seq 1 40); do sleep 0.5; curl -fs "http://127.0.0.1:$PORT/healthz" >/dev/null && { ok "running on 127.0.0.1:$PORT"; break; }; [ "$i" = 40 ] && { tail -30 "$LOGS/examflow.log"; die "ExamFlow did not become healthy (log above)."; }; done
fi
if [ -n "$CODE" ]; then say "Registering with GHUM"; (cd "$APP/current" && sudo -u nobody env EXAMFLOW_ENV_FILE="$ENV_FILE" "$NODE" server/src/cli.js register --code "$CODE"); launchctl kickstart -k "system/$LABEL"; fi
say "Done"
cat <<EOF
  ExamFlow listens on 127.0.0.1:$PORT. HTTPS in front: Caddy (brew install caddy; Caddyfile.example) or nginx.
  Log: $LOGS/examflow.log      Restart: sudo launchctl kickstart -k system/$LABEL
  Commands: cd $APP/current && sudo -u nobody env EXAMFLOW_ENV_FILE="$ENV_FILE" $NODE server/src/cli.js <status|teachers|teacher-codes|db-check|backup>
  Remove: sudo launchctl bootout system $PLIST; sudo rm -rf $APP $PLIST   (data stays in $SUP)
EOF
