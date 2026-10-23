# Every other kind of server

ExamFlow needs only Node.js 22.13+, or Docker/Podman. So any machine that runs one of those can run it. Use this page to find which install type fits.

| Platform | How |
|---|---|
| **Virtual machines**: VMware vSphere/ESXi, Proxmox VE, Microsoft Hyper-V, Nutanix AHV, KVM/libvirt, XenServer/XCP-ng, OpenStack, VirtualBox | Make a VM. On Ubuntu use **type 4** (or 2). On RHEL/Rocky use **type 2** or **6**. On Windows Server use **type 3**. |
| **Linux containers**: Proxmox LXC, LXD/Incus, systemd-nspawn | **Type 2** inside the container (it has systemd). |
| **Synology NAS** (DSM 7.2+, Container Manager) | Copy the package folder to the NAS. In Container Manager → **Project** → *Create*, pick the folder; it uses `docker-compose.yml`. Fill in `.env` first. HTTPS: DSM's reverse proxy (Control Panel → Login Portal → Advanced → Reverse Proxy) to `localhost:8080`. |
| **QNAP NAS** (Container Station 3) | Container Station → *Applications* → *Create*, and paste `docker-compose.yml`. Or use SSH and **type 1**. |
| **TrueNAS SCALE**, **Unraid**, **OpenMediaVault**, **CasaOS** | Their Docker Compose support with the package's `docker-compose.yml`. Or use SSH and **type 1**. |
| **Docker Desktop** on Windows or macOS | **Type 1** (for testing, or small schools). |
| **Windows** with WSL2 | **Type 3** directly, or type 2 / 4 inside WSL2 Ubuntu. |
| **Linux on ARM64**: AWS Graviton, Ampere, Raspberry Pi 4/5 with 4 GB+ | Every type works. The package has no native code, and Node.js and Docker images exist for ARM64. |
| **Other Linux**: Alpine (OpenRC), Arch, Gentoo, Slackware, NixOS | Install Node.js 22.13+ and run `node server/src/server.js` from the package folder with `EXAMFLOW_ENV_FILE` set, under the system's own service manager. Or use type 1 with Docker. |
| **Other BSD**: OpenBSD, NetBSD | Like **type 9**, with the system's rc scripts. Node.js 22 must be available from its ports. |
| **Kubernetes distributions**: Rancher, Tanzu, OpenShift, AKS, EKS, GKE, k3s, MicroK8s | **Type 5**. |
| **Cloud**: Azure, AWS, Google Cloud, Oracle Cloud, IBM Cloud, DigitalOcean … | **Type 8** for their container services. Their VMs use type 2, 3 or 4. |
| **Platform as a Service**: Render, Railway, Fly.io, Heroku, Dokku, CapRover, Coolify | Deploy the package folder with its `Dockerfile`. Attach a persistent volume at `/data` and use a managed database, as in type 8. Run one instance. |

**Not possible:**
- **IBM AIX, Solaris / illumos, HP-UX:** Node.js 22 doesn't run there. Run ExamFlow in a Linux VM (or LPAR / zone with Linux) next to them. It can still use their databases over the network, for example Db2 or Oracle on AIX.
- **IBM z/OS and IBM i:** run ExamFlow on Linux next to them. ExamFlow's Db2 support is for **Db2 for Linux, UNIX and Windows** 11.5+ (which also runs on AIX). Db2 for z/OS and Db2 for i use different system tables and are not supported as ExamFlow's database.
- **Windows Server 2012 R2 and older:** Node.js 22 doesn't support them. Use Windows Server 2016+ or a Linux VM.
