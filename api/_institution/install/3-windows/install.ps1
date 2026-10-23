<#
  ExamFlow institution server - TYPE 3: Windows Server 2016 / 2019 / 2022 / 2025 (or Windows 10/11)

  Right-click PowerShell > "Run as administrator", go to the unzipped package folder, then:

    powershell -ExecutionPolicy Bypass -File install\3-windows\install.ps1

  Options:
    -Code CODE        register with GHUM right away (the one-time registration code from GHUM)
    -EnvFile PATH     use this settings file instead of asking
    -InstallNode      install Node.js LTS with winget if it is missing or too old
    -Port 8080        port ExamFlow listens on (only this machine can reach it; IIS/Caddy gives HTTPS)
    -OpenFirewall     also allow -Port through Windows Firewall (only if another machine runs the HTTPS proxy)
    -NoStart          install and check, do not start
    -InstallDir / -DataDir   defaults: C:\Program Files\ExamFlow  and  C:\ProgramData\ExamFlow

  ExamFlow runs as the built-in "Local Service" account, starts with Windows (a scheduled task
  named "ExamFlow") and restarts itself if it stops. Running this again with a NEWER package
  upgrades it; data and settings stay. Remove: install\3-windows\uninstall.ps1
#>
[CmdletBinding()]
param(
  [string]$Code = '',
  [string]$EnvFile = '',
  [switch]$InstallNode,
  [int]$Port = 8080,
  [switch]$OpenFirewall,
  [switch]$NoStart,
  [string]$InstallDir = '',
  [string]$DataDir = '',
  [switch]$DryRun   # for testing this script anywhere: no Windows services, tasks or firewall changes
)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version 2.0

function Say([string]$m) { Write-Host ''; Write-Host ('> ' + $m) -ForegroundColor Cyan }
function Ok([string]$m)  { Write-Host ('  OK  ' + $m) -ForegroundColor Green }
function Die([string]$m) { Write-Host ''; Write-Host ('X  ' + $m) -ForegroundColor Red; exit 1 }
function Ask([string]$q, [string]$d) {
  if (-not [Environment]::UserInteractive -or $DryRun) { return $d }
  $a = Read-Host ('  ' + $q + $(if ($d) { ' [' + $d + ']' } else { '' }))
  if ([string]::IsNullOrWhiteSpace($a)) { return $d } else { return $a.Trim() }
}
function Write-Utf8NoBom([string]$path, [string]$text) { [IO.File]::WriteAllText($path, $text, (New-Object Text.UTF8Encoding($false))) }
function Set-Key([string]$file, [string]$key, [string]$value) {
  $lines = @(Get-Content -LiteralPath $file -Encoding UTF8)
  $done = $false
  for ($i = 0; $i -lt $lines.Count; $i++) {
    if (-not $done -and $lines[$i] -match ('^#?\s*' + [regex]::Escape($key) + '=')) { $lines[$i] = $key + '=' + $value; $done = $true }
  }
  if (-not $done) { $lines += ($key + '=' + $value) }
  Write-Utf8NoBom $file (($lines -join "`r`n") + "`r`n")
}
function Get-Key([string]$file, [string]$key) {
  foreach ($l in (Get-Content -LiteralPath $file -Encoding UTF8)) { if ($l -match ('^' + [regex]::Escape($key) + '=(.*)$')) { return $Matches[1].Trim() } }
  return ''
}

$IsWin = ($env:OS -eq 'Windows_NT')
$Pkg = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
if (-not $InstallDir) { $InstallDir = $(if ($IsWin) { Join-Path $env:ProgramFiles 'ExamFlow' } else { '/tmp/examflow-win/program' }) }
if (-not $DataDir)    { $DataDir    = $(if ($IsWin) { Join-Path $env:ProgramData 'ExamFlow' } else { '/tmp/examflow-win/data' }) }
$SettingsFile = Join-Path $DataDir 'examflow.env'
$DbDir   = Join-Path $DataDir 'data'
$LogDir  = Join-Path $DataDir 'logs'
$TaskName = 'ExamFlow'
$Account  = 'NT AUTHORITY\LOCAL SERVICE'

if (-not (Test-Path (Join-Path $Pkg 'manifest.json'))) { Die ('Run this from the unzipped ExamFlow package (manifest.json not found in ' + $Pkg + ').') }
if ($IsWin -and -not $DryRun) {
  $admin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
  if (-not $admin) { Die 'Run PowerShell as Administrator (right-click > Run as administrator).' }
}

# 1. Node.js 22.13 or newer
Say 'Checking Node.js'
function Find-Node {
  $c = Get-Command node -ErrorAction SilentlyContinue
  if ($c) { return $c.Source }
  foreach ($p in @("$env:ProgramFiles\nodejs\node.exe", "${env:ProgramFiles(x86)}\nodejs\node.exe")) { if ($p -and (Test-Path $p)) { return $p } }
  return $null
}
function Test-NodeVersion([string]$exe) {
  if (-not $exe) { return $false }
  $v = (& $exe -p 'process.versions.node') 2>$null
  if (-not $v) { return $false }
  $parts = $v.Split('.'); $a = [int]$parts[0]; $b = [int]$parts[1]
  return ($a -gt 22 -or ($a -eq 22 -and $b -ge 13))
}
$Node = Find-Node
if (-not (Test-NodeVersion $Node)) {
  if ($InstallNode -and (Get-Command winget -ErrorAction SilentlyContinue)) {
    Say 'Installing Node.js LTS with winget'
    winget install --id OpenJS.NodeJS.LTS -e --silent --accept-package-agreements --accept-source-agreements | Out-Host
    $env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')
    $Node = Find-Node
  }
  if (-not (Test-NodeVersion $Node)) {
    Die ("Node.js 22.13 or newer is needed. Install the Windows 64-bit LTS from https://nodejs.org (the .msi), or run again with -InstallNode (needs winget), then run this again.")
  }
}
Ok ('Node.js ' + (& $Node --version) + ' at ' + $Node)
$env:NODE_OPTIONS = '--disable-warning=ExperimentalWarning'

# 2. The package is genuine and complete
Say 'Checking the package signature and every file'
$check = @'
const { readPackage } = require(process.argv[2] + "/server/src/package.js");
const p = readPackage(process.argv[2]);
if (!p.ok) { console.error(p.errors.map(e => "  - " + e).join("\n")); process.exit(1); }
console.log("  OK  package " + p.manifest.packageId + " v" + p.manifest.packageVersion + " for " + p.manifest.institution.name + " (key " + p.fingerprint + ")");
'@
# (run from a file: Windows PowerShell 5.1 would strip the quotes from an inline script)
$checkFile = Join-Path ([IO.Path]::GetTempPath()) ('examflow-verify-' + [Guid]::NewGuid().ToString('N') + '.js')
Write-Utf8NoBom $checkFile $check
& $Node $checkFile $Pkg
$verifyRc = $LASTEXITCODE
Remove-Item -LiteralPath $checkFile -Force -ErrorAction SilentlyContinue
if ($verifyRc -ne 0) { Die 'The package check failed. Do not install it; ask GHUM for a fresh package.' }

# 3. Folders and settings
Say 'Settings'
foreach ($d in @($InstallDir, (Join-Path $InstallDir 'releases'), $DataDir, $DbDir, $LogDir)) { New-Item -ItemType Directory -Force -Path $d | Out-Null }
if ($EnvFile) {
  if (-not (Test-Path $EnvFile)) { Die ('-EnvFile not found: ' + $EnvFile) }
  Copy-Item -LiteralPath $EnvFile -Destination $SettingsFile -Force; Ok ('settings copied from ' + $EnvFile)
} elseif (Test-Path $SettingsFile) {
  Ok ('keeping the existing settings in ' + $SettingsFile)
} elseif (Test-Path (Join-Path $Pkg '.env')) {
  Copy-Item -LiteralPath (Join-Path $Pkg '.env') -Destination $SettingsFile; Ok 'settings copied from the package folder (.env)'
} else {
  Copy-Item -LiteralPath (Join-Path $Pkg '.env.example') -Destination $SettingsFile
  Write-Host ('  A few questions (Enter keeps the suggestion; change anything later in ' + $SettingsFile + '):')
  Set-Key $SettingsFile 'PUBLIC_URL' (Ask 'Address teachers will open (https://...)' 'https://examflow.your-university.edu')
  Set-Key $SettingsFile 'INSTITUTION_ADMIN_EMAILS' (Ask 'Admin emails, comma-separated' 'exam-office@your-university.edu')
  $auth = Ask 'Teacher sign-in: local (codes) or oidc (Microsoft Entra ID / Google / ADFS)' 'local'
  Set-Key $SettingsFile 'AUTH_MODE' $auth
  if ($auth -eq 'oidc') { Write-Host ('  -> fill OIDC_ISSUER, OIDC_CLIENT_ID and OIDC_CLIENT_SECRET in ' + $SettingsFile + ' before starting.') }
  Ok 'settings written (database: built-in SQLite; for SQL Server, Oracle, PostgreSQL, MySQL or MongoDB see DATABASES.md)'
}
Set-Key $SettingsFile 'DATA_DIR' $DbDir
if (-not (Get-Key $SettingsFile 'HOST')) { Set-Key $SettingsFile 'HOST' '127.0.0.1' }
if (-not (Get-Key $SettingsFile 'TRUST_PROXY')) { Set-Key $SettingsFile 'TRUST_PROXY' '1' }
$cur = Get-Key $SettingsFile 'PORT'; if ($cur) { $Port = [int]$cur } else { Set-Key $SettingsFile 'PORT' ([string]$Port) }
if ($IsWin -and -not $DryRun) {
  # settings: Administrators + SYSTEM full, Local Service read. Data folder: Local Service may change.
  & icacls $SettingsFile /inheritance:r /grant:r '*S-1-5-32-544:(F)' '*S-1-5-18:(F)' '*S-1-5-19:(R)' | Out-Null
  & icacls $DbDir /grant '*S-1-5-19:(OI)(CI)(M)' | Out-Null
  & icacls $LogDir /grant '*S-1-5-19:(OI)(CI)(M)' | Out-Null
}
Ok ('settings: ' + $SettingsFile + '   data: ' + $DbDir)

# 4. Install this version next to earlier ones
Say 'Installing the program'
$name = Split-Path $Pkg -Leaf
$Rel = Join-Path (Join-Path $InstallDir 'releases') $name
if ($Rel -ne $Pkg) {
  if (Test-Path $Rel) { $Rel = $Rel + '-' + (Get-Date -Format 'yyyyMMdd-HHmmss') }
  New-Item -ItemType Directory -Force -Path $Rel | Out-Null
  Get-ChildItem -LiteralPath $Pkg -Force | Where-Object { $_.Name -notin @('.env', 'data', 'backups') } | ForEach-Object { Copy-Item -LiteralPath $_.FullName -Destination $Rel -Recurse -Force }
}
Ok ('installed in ' + $Rel)

# 5. Full check (settings, signature, database)
Say 'Checking settings, package and database'
$env:EXAMFLOW_ENV_FILE = $SettingsFile
Push-Location $Rel
& $Node server/src/cli.js check
$rc = $LASTEXITCODE
Pop-Location
if ($rc -ne 0) { Die ('Fix the problems above in ' + $SettingsFile + ', then run this again (nothing was started).') }

# 6. The runner: keeps ExamFlow running, writes a log
$Runner = Join-Path $InstallDir 'run-examflow.cmd'
$runnerText = @"
@echo off
rem ExamFlow institution server - started at boot by the scheduled task "ExamFlow". Written by install.ps1.
set EXAMFLOW_ENV_FILE=$SettingsFile
set NODE_ENV=production
set NODE_OPTIONS=--disable-warning=ExperimentalWarning
cd /d "$Rel"
:loop
"$Node" server\src\server.js >> "$LogDir\examflow.log" 2>&1
set RC=%ERRORLEVEL%
rem exit codes 2-5 = a settings / package / database problem: wait a minute before trying again
set WAIT=4
if %RC% GEQ 2 if %RC% LEQ 5 set WAIT=61
rem (ping is used as a pause: "timeout" does not wait inside a scheduled task)
ping -n %WAIT% 127.0.0.1 >nul
goto loop
"@
Write-Utf8NoBom $Runner ($runnerText -replace "`r?`n", "`r`n")
Ok ('runner: ' + $Runner)

function Stop-ExamFlow {
  if (-not $IsWin -or $DryRun) { return }
  $t = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
  if ($t) { Stop-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue }
  Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine -like '*server\src\server.js*' -and $_.ExecutablePath -eq $Node } |
    ForEach-Object { Invoke-CimMethod -InputObject $_ -MethodName Terminate | Out-Null }
}
function Test-Health {
  try { $r = Invoke-WebRequest -UseBasicParsing -TimeoutSec 3 -Uri ('http://127.0.0.1:' + $Port + '/healthz'); return ($r.StatusCode -eq 200) } catch { return $false }
}

# 7. Scheduled task: starts at boot as Local Service
if ($IsWin -and -not $DryRun) {
  Say 'Setting up the ExamFlow task (starts with Windows, restarts if it stops)'
  Stop-ExamFlow
  $action    = New-ScheduledTaskAction -Execute 'cmd.exe' -Argument ('/c "' + $Runner + '"') -WorkingDirectory $Rel
  $trigger   = New-ScheduledTaskTrigger -AtStartup
  $principal = New-ScheduledTaskPrincipal -UserId $Account -LogonType ServiceAccount -RunLevel Limited
  $settings  = New-ScheduledTaskSettingsSet -ExecutionTimeLimit ([TimeSpan]::Zero) -RestartCount 999 -RestartInterval (New-TimeSpan -Minutes 1) -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -MultipleInstances IgnoreNew
  Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description 'ExamFlow institution server' -Force | Out-Null
  Ok ('task "' + $TaskName + '" registered (runs as Local Service)')
  if ($OpenFirewall) {
    if (-not (Get-NetFirewallRule -DisplayName 'ExamFlow' -ErrorAction SilentlyContinue)) { New-NetFirewallRule -DisplayName 'ExamFlow' -Direction Inbound -Protocol TCP -LocalPort $Port -Action Allow | Out-Null }
    Set-Key $SettingsFile 'HOST' '0.0.0.0'
    Ok ('firewall: port ' + $Port + ' open (HOST=0.0.0.0)')
  }
  if (-not $NoStart) {
    Start-ScheduledTask -TaskName $TaskName
    $healthy = $false
    for ($i = 0; $i -lt 40 -and -not $healthy; $i++) { Start-Sleep -Milliseconds 500; $healthy = Test-Health }
    if (-not $healthy) { Get-Content (Join-Path $LogDir 'examflow.log') -Tail 30 -ErrorAction SilentlyContinue | Out-Host; Die 'ExamFlow did not become healthy (log above).' }
    Ok ('running on http://127.0.0.1:' + $Port)
  }
} else {
  Say 'Dry run: no scheduled task, firewall rule or start'
  Write-Host ('  would register task "' + $TaskName + '" running ' + $Runner + ' as ' + $Account)
  $NoStart = $true
}

# 8. Register with GHUM (once per server)
Push-Location $Rel
if (-not $Code -and -not $DryRun) {
  $st = (& $Node server/src/cli.js status 2>$null) -join "`n"
  if ($st -notmatch 'Registered: yes') { $Code = Ask 'Registration code from GHUM (leave empty to do it later)' '' }
}
if ($Code) {
  Say 'Registering this server with GHUM'
  & $Node server/src/cli.js register --code $Code
  if ($LASTEXITCODE -ne 0) { Pop-Location; Die 'Registration failed (message above).' }
  if (-not $NoStart) { Stop-ExamFlow; Start-ScheduledTask -TaskName $TaskName }
}
Pop-Location

Say 'Done'
Write-Host ("  Program:  $Rel")
Write-Host ("  Data:     $DbDir      Settings: $SettingsFile      Log: $LogDir\examflow.log")
Write-Host ("  ExamFlow listens on 127.0.0.1:$Port. Give it HTTPS with IIS (see README.md in this folder) or Caddy.")
Write-Host  '  Commands (PowerShell as administrator):'
Write-Host ("    `$env:EXAMFLOW_ENV_FILE='$SettingsFile'; cd '$Rel'; node server/src/cli.js <status|teachers|teacher-codes|db-check|backup>")
