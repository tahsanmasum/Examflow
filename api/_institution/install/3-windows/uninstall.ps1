<#
  Removes the ExamFlow scheduled task and program. DATA and SETTINGS are kept unless you add -Purge.
    powershell -ExecutionPolicy Bypass -File install\3-windows\uninstall.ps1
    powershell -ExecutionPolicy Bypass -File install\3-windows\uninstall.ps1 -Purge   (deletes exams and results!)
#>
param([switch]$Purge, [string]$InstallDir = (Join-Path $env:ProgramFiles 'ExamFlow'), [string]$DataDir = (Join-Path $env:ProgramData 'ExamFlow'))
$ErrorActionPreference = 'Stop'
if (Get-ScheduledTask -TaskName 'ExamFlow' -ErrorAction SilentlyContinue) {
  Stop-ScheduledTask -TaskName 'ExamFlow' -ErrorAction SilentlyContinue
  Unregister-ScheduledTask -TaskName 'ExamFlow' -Confirm:$false
  Write-Host 'OK  task removed'
}
Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine -like '*server\src\server.js*' } | ForEach-Object { Invoke-CimMethod -InputObject $_ -MethodName Terminate | Out-Null }
Get-NetFirewallRule -DisplayName 'ExamFlow' -ErrorAction SilentlyContinue | Remove-NetFirewallRule
if (Test-Path $InstallDir) { Remove-Item -LiteralPath $InstallDir -Recurse -Force; Write-Host ('OK  program removed (' + $InstallDir + ')') }
if ($Purge) {
  $a = Read-Host ('Delete ALL ExamFlow data and settings in ' + $DataDir + '? Type DELETE to confirm')
  if ($a -eq 'DELETE') { Remove-Item -LiteralPath $DataDir -Recurse -Force; Write-Host 'OK  data and settings deleted' } else { Write-Host 'Kept the data.' }
} else { Write-Host ('Kept: data and settings in ' + $DataDir + '. (An external database is never touched.)') }
