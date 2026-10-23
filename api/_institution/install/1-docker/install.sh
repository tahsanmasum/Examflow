#!/usr/bin/env bash
# ExamFlow institution server — TYPE 1: any server with Docker (Linux, or Windows/macOS with Docker Desktop)
#
#   bash install/1-docker/install.sh                      built-in SQLite (or the database in .env)
#   bash install/1-docker/install.sh --with postgres      also run a PostgreSQL 16 container for ExamFlow
#   bash install/1-docker/install.sh --with mariadb       also run a MariaDB 11 container for ExamFlow
# Options: --code CODE (register with GHUM now)
# Run it again with a newer package to upgrade: the data (Docker volumes) stays.
set -euo pipefail
PKG="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PKG"
WITH="" ; CODE=""
while [ $# -gt 0 ]; do case "$1" in
  --with) WITH="${2:-}"; shift 2 ;; --code) CODE="${2:-}"; shift 2 ;;
  -h|--help) sed -n '2,9p' "$0"; exit 0 ;; *) echo "Unknown option: $1"; exit 2 ;; esac; done
say() { printf '\n\033[1m▶ %s\033[0m\n' "$*"; }
die() { printf '\n\033[31m✗ %s\033[0m\n' "$*" >&2; exit 1; }
ask() { local q="$1" d="${2:-}" a; if [ -t 0 ]; then read -r -p "  $q${d:+ [$d]}: " a; echo "${a:-$d}"; else echo "$d"; fi; }
prev_env() { # newest .env in a sibling ExamFlow package folder (an earlier version unzipped next to this one)
  local f best="" bt=0 t; for f in "$(dirname "$PKG")"/*/.env; do [ -f "$f" ] && [ "$f" != "$PKG/.env" ] && [ -f "$(dirname "$f")/manifest.json" ] || continue
    t=$(stat -c %Y "$f" 2>/dev/null || stat -f %m "$f"); [ "$t" -gt "$bt" ] && { bt=$t; best=$f; }; done; echo "$best"; }
setkey() { local k="$1" v="$2" f="$3"
  if grep -qE "^#?\s*$k=" "$f"; then awk -v k="$k" -v v="$v" 'BEGIN{d=0} { if (!d && $0 ~ "^#?[[:space:]]*" k "=") { print k "=" v; d=1 } else print }' "$f" > "$f.tmp" && mv "$f.tmp" "$f"; else echo "$k=$v" >> "$f"; fi; }

say "Checking Docker"
docker version >/dev/null 2>&1 || die "Docker is not running or not installed. Install Docker Engine (Linux) or Docker Desktop (Windows/macOS) first: https://docs.docker.com/engine/install/  — or use install type 4 on a fresh Ubuntu server (it installs everything)."
docker compose version >/dev/null 2>&1 || die "The Docker Compose plugin is missing (docker compose …). Install docker-compose-plugin / docker-compose-v2."

FILES=(-f docker-compose.yml)
case "$WITH" in
  "") ;;
  postgres|postgresql) FILES+=(-f install/1-docker/with-postgres.yml) ;;
  mariadb|mysql) FILES+=(-f install/1-docker/with-mariadb.yml) ;;
  *) die "--with must be postgres or mariadb" ;;
esac
# your own adjustments (ports, networks, proxies …) in docker-compose.override.yml are kept
[ -f docker-compose.override.yml ] && FILES+=(-f docker-compose.override.yml)

say "Settings (.env)"
PREV="$(prev_env)"
if [ ! -f .env ] && [ -n "$PREV" ]; then cp "$PREV" .env; echo "  ✓ settings carried over from the earlier version: $PREV"; fi
if [ ! -f .env ]; then
  cp .env.example .env
  URL="$(ask 'Address teachers will open (https://…)' 'https://examflow.your-university.edu')"
  ADM="$(ask 'Admin emails, comma-separated' 'exam-office@your-university.edu')"
  setkey PUBLIC_URL "$URL" .env; setkey INSTITUTION_ADMIN_EMAILS "$ADM" .env
  echo "  ✓ .env created. Edit it any time (sign-in method, database …) and run this again."
else echo "  ✓ using the existing .env"; fi
chmod 600 .env
if [ -n "$WITH" ] && ! grep -qE '^EXAMFLOW_DB_PASSWORD=.+' .env; then
  echo "EXAMFLOW_DB_PASSWORD=$(head -c 24 /dev/urandom | od -An -tx1 | tr -d ' \n')" >> .env
  echo "  ✓ generated a password for the ExamFlow database container (kept in .env)"
fi
echo "${FILES[*]}" | sed 's/-f //g' > .examflow-compose-files

say "Building and checking"
docker compose "${FILES[@]}" build --pull=false examflow
[ -n "$WITH" ] && docker compose "${FILES[@]}" up -d --wait db
docker compose "${FILES[@]}" run --rm --no-deps examflow node server/src/cli.js check || die "Fix the problems above in .env, then run this again."

say "Starting"
# An earlier version, unzipped in another folder, may still run under the container name "examflow".
# Stop and remove that container only; its data volume stays and this version uses it.
OLD_DIR="$(docker inspect -f '{{ index .Config.Labels "com.docker.compose.project.working_dir" }}' examflow 2>/dev/null || true)"
GOBACK=""
if [ -n "$OLD_DIR" ] && [ "$OLD_DIR" != "$PKG" ]; then
  echo "  stopping the earlier version (from $OLD_DIR); the data stays"
  docker stop examflow >/dev/null 2>&1 || true; docker rm examflow >/dev/null
  GOBACK="
  To go back to the earlier version:  cd $OLD_DIR && docker compose up -d"
fi
docker compose "${FILES[@]}" up -d
PORT="$(grep -E '^PORT=' .env | tail -1 | cut -d= -f2 || true)"; PORT="${PORT:-8080}"
for i in $(seq 1 60); do sleep 1
  if docker compose "${FILES[@]}" exec -T examflow node server/src/healthcheck.js 2>/dev/null; then echo "  ✓ running (127.0.0.1:$PORT on this machine)"; break; fi
  [ "$i" = 60 ] && { docker compose "${FILES[@]}" logs --tail 40 examflow; die "The server did not become healthy (log above).$GOBACK"; }
done

if [ -z "$CODE" ] && [ -t 0 ] && ! docker compose "${FILES[@]}" exec -T examflow node server/src/cli.js status 2>/dev/null | grep -q '^Registered: yes'; then
  CODE="$(ask 'Registration code from GHUM (leave empty to do it later)' '')"; fi
if [ -n "$CODE" ]; then
  say "Registering with GHUM"
  docker compose "${FILES[@]}" exec -T examflow node server/src/cli.js register --code "$CODE" || die "Registration failed (message above)."
fi

say "Done"
cat <<EOF2
  ExamFlow runs in Docker and listens on 127.0.0.1:$PORT. Put HTTPS in front of it
  (Caddyfile.example in the package folder, or install/2-linux/nginx-examflow.conf).
  Commands (from $PKG):
    docker compose $(sed 's/[^ ]*/-f &/g' .examflow-compose-files) logs -f examflow
    docker compose $(sed 's/[^ ]*/-f &/g' .examflow-compose-files) exec examflow node server/src/cli.js <status|teachers|teacher-codes|db-check|backup>
EOF2
