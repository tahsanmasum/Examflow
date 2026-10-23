# Type 5 — Kubernetes / OpenShift

**For:** a university data centre that runs containers on a cluster. That includes:
- plain Kubernetes, Rancher/RKE2, k3s, VMware Tanzu;
- Azure AKS, Amazon EKS, Google GKE;
- **Red Hat OpenShift**.

**You need:**
- `kubectl` (or `oc`), logged in to the cluster;
- `docker`, `podman` or `buildah`, to build the image;
- a container registry the cluster can pull from;
- an ingress controller (OpenShift: the built-in router);
- a StorageClass for a 10 GB volume.

## Install

From the unzipped package folder:

```bash
cp .env.example .env && nano .env      # PUBLIC_URL=https://examflow.uni.edu, admins, sign-in, database (DATABASES.md)
bash install/5-kubernetes/install.sh --registry registry.uni.edu/examflow --domain examflow.uni.edu --code XXXX-XXXX-XXXX
```

The script:
1. Builds and pushes the image (tagged with the package version).
2. Creates the `examflow` namespace, a 10 Gi PersistentVolumeClaim for `/data`, and the Deployment. It runs as a non-root user with a read-only root filesystem and no Linux capabilities.
3. Stores `.env` as the Secret `examflow-env`.
4. Creates the Service and an Ingress. On OpenShift it creates a Route instead.
5. Waits for the rollout, runs the full check inside the pod, and registers with GHUM.

On OpenShift, `oc` is detected and the restricted security profile is respected: no fixed user ID.

| Option | Use |
|---|---|
| `--namespace` | Another namespace. |
| `--ingress-class` | Another ingress controller (traefik, haproxy, …). |
| `--storage 20Gi` | A bigger data volume. |
| `--no-build` | The image was built and pushed elsewhere. |

The manifests (`examflow.yaml`, `ingress.yaml`, `openshift-route.yaml`) are plain YAML. Your GitOps tool (Argo CD, Flux) can use them directly after replacing the `@…@` values.

**One replica, on purpose.** The server's identity with GHUM lives on the data volume, which only one pod uses at a time.

**HTTPS:** put your certificate in the Secret `examflow-tls`, or let cert-manager issue one.

## Everyday

```bash
kubectl -n examflow logs -f deployment/examflow
kubectl -n examflow exec deployment/examflow -- node server/src/cli.js status     # teachers, teacher-codes, db-check, backup …
```

**Upgrade:** run `install.sh` again from the new package. It builds a new image tag; the data volume stays.

**Backups:**
- the volume: Velero, or your storage's snapshots;
- your database: its own backup.
