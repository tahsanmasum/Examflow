#!/usr/bin/env bash
# ExamFlow institution server — TYPE 5: Kubernetes (any CNCF cluster: on-premises, Rancher/RKE2, k3s,
# Tanzu, AKS, EKS, GKE …) or Red Hat OpenShift.
#
# From the unzipped package folder, on a machine with kubectl (or oc) logged in to the cluster, and
# docker / podman / buildah to build the image:
#
#   bash install/5-kubernetes/install.sh --registry registry.uni.edu/examflow --domain examflow.uni.edu
#
# Options:
#   --registry NAME     where to push the ExamFlow image (your cluster must be able to pull from it)
#   --domain NAME       the https address (an Ingress, or a Route on OpenShift, is created for it)
#   --namespace NAME    default: examflow
#   --openshift         use oc and an OpenShift Route (detected automatically when oc is logged in)
#   --ingress-class C   default: nginx            --storage SIZE   data volume size, default 10Gi
#   --code CODE         register with GHUM right away
#   --no-build          the image is already in the registry (built elsewhere)
# Settings come from .env in the package folder (same keys as every other type; DATABASES.md for databases).
# Running it again with a newer package upgrades: new image, same data volume.
set -euo pipefail
PKG="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"; cd "$PKG"
REGISTRY="" ; DOMAIN="" ; NS=examflow ; OPENSHIFT="" ; CLASS=nginx ; STORAGE=10Gi ; CODE="" ; BUILD=1
while [ $# -gt 0 ]; do case "$1" in
  --registry) REGISTRY="${2:-}"; shift 2 ;; --domain) DOMAIN="${2:-}"; shift 2 ;; --namespace) NS="${2:-}"; shift 2 ;;
  --openshift) OPENSHIFT=1; shift ;; --ingress-class) CLASS="${2:-}"; shift 2 ;; --storage) STORAGE="${2:-}"; shift 2 ;;
  --code) CODE="${2:-}"; shift 2 ;; --no-build) BUILD=0; shift ;;
  -h|--help) sed -n '2,22p' "$0"; exit 0 ;; *) echo "Unknown option: $1 (see --help)"; exit 2 ;; esac; done
say() { printf '\n\033[1m▶ %s\033[0m\n' "$*"; }
ok()  { printf '  ✓ %s\n' "$*"; }
die() { printf '\n\033[31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

[ -f manifest.json ] || die "Run this from inside the unzipped ExamFlow package."
[ -n "$REGISTRY" ] || die "--registry is needed (e.g. registry.uni.edu/examflow, ghcr.io/uni/examflow, 123456789012.dkr.ecr.ap-south-1.amazonaws.com/examflow)."
[ -n "$DOMAIN" ] || die "--domain is needed (the https address teachers will open)."
if [ -z "$OPENSHIFT" ] && command -v oc >/dev/null && oc whoami >/dev/null 2>&1; then OPENSHIFT=1; fi
K=kubectl; [ -n "$OPENSHIFT" ] && K=oc
command -v $K >/dev/null || die "$K is not installed."
$K version >/dev/null 2>&1 || $K cluster-info >/dev/null 2>&1 || die "$K cannot reach the cluster. Log in first (kubeconfig / oc login)."
ok "cluster reachable with $K${OPENSHIFT:+ (OpenShift)}"

say "Settings (.env)"
if [ ! -f .env ]; then cp .env.example .env; die "Created .env from .env.example. Fill in PUBLIC_URL=https://$DOMAIN, INSTITUTION_ADMIN_EMAILS, AUTH_MODE and the database (DATABASES.md), then run this again."; fi
grep -qE "^PUBLIC_URL=https://$DOMAIN/?$" .env || die "PUBLIC_URL in .env must be https://$DOMAIN"
ok ".env will be stored in the cluster as the Secret examflow-env"

VERSION="$(node -e 'console.log(require("./manifest.json").packageVersion)' 2>/dev/null || python3 -c 'import json;print(json.load(open("manifest.json"))["packageVersion"])')"
IMAGE="$REGISTRY:$VERSION"
if [ "$BUILD" = 1 ]; then
  say "Building and pushing $IMAGE"
  if command -v docker >/dev/null && docker version >/dev/null 2>&1; then B=docker; elif command -v podman >/dev/null; then B=podman; elif command -v buildah >/dev/null; then B=buildah; else die "Need docker, podman or buildah to build the image (or build it elsewhere and use --no-build)."; fi
  if [ "$B" = buildah ]; then buildah bud -t "$IMAGE" . && buildah push "$IMAGE"; else $B build -t "$IMAGE" . && $B push "$IMAGE"; fi
  ok "pushed with $B"
fi

say "Applying to namespace $NS"
if [ -n "$OPENSHIFT" ]; then PODSEC=""; else PODSEC='        runAsUser: 1000
        runAsGroup: 1000
        fsGroup: 1000'; fi
render() { python3 - "$1" "$NS" "$IMAGE" "$STORAGE" "$DOMAIN" "$CLASS" "$PODSEC" <<'PY'
import sys
f, ns, image, storage, domain, cls, podsec = sys.argv[1:8]
t = open(f).read()
for k, v in {'@NAMESPACE@': ns, '@IMAGE@': image, '@STORAGE@': storage, '@DOMAIN@': domain, '@INGRESS_CLASS@': cls}.items(): t = t.replace(k, v)
t = t.replace('@PODSECURITY@\n', podsec + '\n' if podsec else '')
sys.stdout.write(t)
PY
}
render install/5-kubernetes/examflow.yaml | $K apply -f -
$K -n "$NS" create secret generic examflow-env --from-env-file=.env --dry-run=client -o yaml | $K apply -f -
if [ -n "$OPENSHIFT" ]; then render install/5-kubernetes/openshift-route.yaml | $K apply -f -; else render install/5-kubernetes/ingress.yaml | $K apply -f -; fi
$K -n "$NS" rollout restart deployment/examflow >/dev/null
$K -n "$NS" rollout status deployment/examflow --timeout=300s || { $K -n "$NS" logs deployment/examflow --tail=40 || true; die "ExamFlow did not become ready (log above)."; }
ok "running"

say "Full check inside the cluster"
$K -n "$NS" exec deployment/examflow -- node server/src/cli.js check || die "Check failed (above). Fix .env and run this again."
if [ -n "$CODE" ]; then say "Registering with GHUM"; $K -n "$NS" exec deployment/examflow -- node server/src/cli.js register --code "$CODE"; fi

say "Done"
cat <<EOF
  ExamFlow runs in namespace $NS (image $IMAGE) at https://$DOMAIN
  Commands:  $K -n $NS logs -f deployment/examflow
             $K -n $NS exec deployment/examflow -- node server/src/cli.js <status|teachers|teacher-codes|db-check|backup|register --code CODE>
  Backups: the PersistentVolumeClaim examflow-data (Velero / your storage snapshots), plus your database's own backup.
EOF
