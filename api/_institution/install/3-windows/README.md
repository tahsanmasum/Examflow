# Type 3 — Windows Server (no Docker)

**For:** Windows Server 2016 / 2019 / 2022 / 2025, or Windows 10/11.

ExamFlow runs as the built-in **Local Service** account. A scheduled task named **ExamFlow** starts it with Windows, and it restarts itself if it stops.

**You need:**
- Node.js 22.13 or newer: the Windows 64-bit LTS `.msi` from nodejs.org. Or add `-InstallNode` and the script uses winget.
- 2 CPU, 4 GB RAM and 10 GB of disk;
- outbound HTTPS to GHUM.

## Install

1. Right-click **PowerShell** and choose **Run as administrator**.
2. Run:

```powershell
cd C:\path\to\the\unzipped\package
powershell -ExecutionPolicy Bypass -File install\3-windows\install.ps1
```

The script:
1. Checks Node.js.
2. Checks the package signature and every file.
3. Asks the questions and writes the settings to `C:\ProgramData\ExamFlow\examflow.env`. Only Administrators can change that file; the service can only read it.
4. Installs the program in `C:\Program Files\ExamFlow\releases\<version>`.
5. Runs the full check, including the database.
6. Registers and starts the task.
7. Asks for GHUM's registration code.

The data is in `C:\ProgramData\ExamFlow\data`, and the log in `C:\ProgramData\ExamFlow\logs\examflow.log`.

**Database:** SQL Server is the usual choice on Windows.
1. Edit `C:\ProgramData\ExamFlow\examflow.env`: set `DB_TYPE=mssql`, `DB_HOST`, `DB_NAME`, `DB_USER` and `DB_PASSWORD`.
2. For a Windows account, use `DB_AUTH=windows` and `DB_DOMAIN`.
3. Run the script again.

See [`DATABASES.md`](../../DATABASES.md). Oracle, PostgreSQL, MySQL and MongoDB work the same way.

Options:

| Option | Does |
|---|---|
| `-Code XXXX-XXXX-XXXX` | Registers without the question. |
| `-EnvFile path` | Uses a settings file you prepared. |
| `-Port 8080` | Sets the port. |
| `-OpenFirewall` | Use only when the HTTPS proxy is on **another** machine. |
| `-NoStart` | Installs without starting. |
| `-InstallDir` / `-DataDir` | Other folders. |

## HTTPS with IIS

ExamFlow listens on `127.0.0.1:8080`.

1. Install **URL Rewrite** and **Application Request Routing** (ARR) from Microsoft.
2. In IIS Manager:
   1. Server node → *Application Request Routing Cache* → *Server Proxy Settings* → tick **Enable proxy**.
   2. Create a site for `examflow.your-university.edu` with your certificate on port 443.
   3. Add this `web.config` to the site's folder:

```xml
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="ExamFlow" stopProcessing="true">
          <match url="(.*)" />
          <action type="Rewrite" url="http://127.0.0.1:8080/{R:1}" />
          <serverVariables><set name="HTTP_X_FORWARDED_PROTO" value="https" /></serverVariables>
        </rule>
      </rules>
    </rewrite>
    <security><requestFiltering><requestLimits maxAllowedContentLength="3145728" /></requestFiltering></security>
  </system.webServer>
</configuration>
```

Then add `HTTP_X_FORWARDED_PROTO` under *URL Rewrite* → *View Server Variables*.

Alternatively, Caddy for Windows does HTTPS with no IIS: `caddy run --config Caddyfile`, using `Caddyfile.example` from the package.

## Everyday

PowerShell as administrator:

```powershell
$env:EXAMFLOW_ENV_FILE = 'C:\ProgramData\ExamFlow\examflow.env'
cd 'C:\Program Files\ExamFlow\releases\<version>'
node server/src/cli.js status          # also: teachers, teacher-codes, db-check, backup, licence, fetch-models
Get-Content C:\ProgramData\ExamFlow\logs\examflow.log -Tail 50 -Wait
Restart-ScheduledTask ExamFlow   # or: Stop-ScheduledTask ExamFlow; Start-ScheduledTask ExamFlow
```

## Upgrade and remove

- **Upgrade:**
  1. Unzip the new package.
  2. Run `install\3-windows\install.ps1` from it.

  The settings and data stay. The previous version stays in `releases\` for going back.
- **Remove:** `install\3-windows\uninstall.ps1`. This keeps the data and settings; add `-Purge` to delete them.
