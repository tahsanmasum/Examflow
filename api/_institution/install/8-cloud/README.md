# Type 8 — cloud platforms (Microsoft Azure, Amazon Web Services, Google Cloud)

Use this when the university runs services in its own cloud account. The cloud bills the university; nothing goes through GHUM. ExamFlow runs as one container built from this package's `Dockerfile`.

**The rule for every cloud:** the container's own disk is thrown away on every restart, so two things must live outside it:
1. **The data folder** (`DATA_DIR=/data`). It holds the server's identity with GHUM (`server-identity.pem`) and the reading models. Mount a small network volume there:
   - Azure Files
   - Amazon EFS
   - Google Cloud Storage or Filestore
2. **The database.** Use the cloud's managed database, with the `DB_*` settings from [`DATABASES.md`](../../DATABASES.md):
   - Azure SQL, Azure Database for PostgreSQL or MySQL, or Cosmos DB for MongoDB
   - Amazon RDS / Aurora, or DynamoDB
   - Google Cloud SQL, AlloyDB or Firestore

   Don't keep SQLite on a network volume.

Run **one** instance (minimum = maximum = 1). Settings are the same keys as `.env.example`; put the secret ones (passwords, keys) in the cloud's secret store.

Commands below use each cloud's own command-line tool. Replace the names in CAPITALS.

---

## Microsoft Azure — Container Apps

```bash
# 1. Image in your Azure Container Registry
az acr build -r ACRNAME -t examflow:VERSION .                      # run in the package folder

# 2. A storage share for /data, attached to the Container Apps environment
az storage share-rm create -g RG --storage-account STORAGEACCT -n examflow-data --quota 10
az containerapp env storage set -g RG -n ENVNAME --storage-name examflowdata \
   --azure-file-account-name STORAGEACCT --azure-file-account-key KEY --azure-file-share-name examflow-data --access-mode ReadWrite

# 3. The app (settings from your .env; secrets as secretref)
az containerapp create -g RG -n examflow --environment ENVNAME --image ACRNAME.azurecr.io/examflow:VERSION \
   --registry-server ACRNAME.azurecr.io --target-port 8080 --ingress external --min-replicas 1 --max-replicas 1 \
   --secrets db-password=DBPASSWORD \
   --env-vars PUBLIC_URL=https://examflow.uni.edu AUTH_MODE=local INSTITUTION_ADMIN_EMAILS=office@uni.edu TRUST_PROXY=1 \
              DATA_DIR=/data DB_TYPE=mssql DB_HOST=SERVER.database.windows.net DB_NAME=examflow DB_USER=examflow DB_PASSWORD=secretref:db-password
# 4. Mount the share at /data:  az containerapp update … --yaml with volumeMounts (see Microsoft "Use storage mounts in Azure Container Apps")
# 5. Custom domain + free certificate:  az containerapp hostname add / bind --environment ENVNAME --validation-method CNAME
az containerapp exec -g RG -n examflow --command "node server/src/cli.js register --code XXXX-XXXX-XXXX"
```

**Azure App Service for Containers** works the same way:
- Linux plan, `WEBSITES_PORT=8080`;
- Azure Files mounted at `/data`;
- **Always On**;
- one instance.

## Amazon Web Services — ECS on Fargate (with EFS)

App Runner has no volumes, so use ECS Fargate:

```bash
aws ecr create-repository --repository-name examflow
aws ecr get-login-password | docker login --username AWS --password-stdin ACCOUNT.dkr.ecr.REGION.amazonaws.com
docker build -t ACCOUNT.dkr.ecr.REGION.amazonaws.com/examflow:VERSION . && docker push ACCOUNT.dkr.ecr.REGION.amazonaws.com/examflow:VERSION
aws efs create-file-system --encrypted --tags Key=Name,Value=examflow-data      # plus a mount target in each subnet
```

Then a **task definition**:
- the image;
- port 8080;
- an EFS volume mounted at `/data`;
- the settings as `environment`, and the secrets from Secrets Manager as `secrets` (e.g. `DB_PASSWORD`);
- an IAM task role. For `DB_TYPE=dynamodb`, give the role access to the table, and leave out the access keys.

Then a **service**:
- desired count **1**, minimum 0 % healthy / maximum 100 %, so the old task stops before the new one starts;
- behind an **Application Load Balancer**, with an ACM certificate on HTTPS 443 and health check `/healthz`.

Register once:

```bash
aws ecs execute-command --cluster CLUSTER --task TASKID --interactive --command "node server/src/cli.js register --code XXXX-XXXX-XXXX"
```

**Amazon Lightsail** and **EC2** are ordinary servers: use type 4 (Ubuntu) or type 2 there.

## Google Cloud — Cloud Run (with a Cloud Storage volume)

```bash
gcloud artifacts repositories create examflow --repository-format=docker --location=REGION
gcloud builds submit --tag REGION-docker.pkg.dev/PROJECT/examflow/examflow:VERSION .
gcloud storage buckets create gs://PROJECT-examflow-data --location=REGION
gcloud run deploy examflow --image REGION-docker.pkg.dev/PROJECT/examflow/examflow:VERSION --region REGION \
   --port 8080 --min-instances 1 --max-instances 1 --no-cpu-throttling \
   --add-volume name=data,type=cloud-storage,bucket=PROJECT-examflow-data --add-volume-mount volume=data,mount-path=/data \
   --set-env-vars PUBLIC_URL=https://examflow.uni.edu,AUTH_MODE=local,INSTITUTION_ADMIN_EMAILS=office@uni.edu,TRUST_PROXY=1,DATA_DIR=/data,DB_TYPE=firestore,DB_PROJECT=PROJECT \
   --allow-unauthenticated
gcloud beta run domain-mappings create --service examflow --domain examflow.uni.edu --region REGION
```

`--no-cpu-throttling` keeps the licence check-in running between requests.
- **Firestore:** the Cloud Run service account needs the role **Cloud Datastore User**. No key file is needed.
- **Cloud SQL:** add `--add-cloudsql-instances PROJECT:REGION:INSTANCE`, and use `DB_HOST=/cloudsql/PROJECT:REGION:INSTANCE` for PostgreSQL.

Register once. Cloud Run has no "exec", so run it as a one-off Cloud Run job with the same image, volume and settings:

```bash
gcloud run jobs create examflow-register --image … --command node --args server/src/cli.js,register,--code,XXXX-XXXX-XXXX \
   --add-volume … --add-volume-mount … --set-env-vars … && gcloud run jobs execute examflow-register --wait
```

**Google Compute Engine** VMs are ordinary servers: use type 4 or type 2 there.

---

**Other clouds** run any Docker container with a persistent volume, so ExamFlow works there the same way:
- Oracle Cloud (OCI Container Instances; or a VM with type 2 / 4);
- IBM Cloud (Code Engine with a persistent data store);
- Alibaba Cloud, DigitalOcean (App Platform with a volume, or a Droplet with type 4), Linode/Akamai, Hetzner, OVHcloud;
- Bangladesh data centres (BDREN, local hosting): their VMs use type 2 or 4.
