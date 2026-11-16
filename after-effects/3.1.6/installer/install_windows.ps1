param([string]$PackageRoot = $PSScriptRoot)
$ErrorActionPreference = 'Stop'
$log = $null
$transcript = $false
try {
    if ([Environment]::OSVersion.Platform -ne [PlatformID]::Win32NT) { throw 'Run install_windows.bat on Windows.' }
    $local = [Environment]::GetFolderPath('LocalApplicationData')
    $logs = Join-Path $local 'YaguaTool/InstallLogs'
    [void][IO.Directory]::CreateDirectory($logs)
    $log = Join-Path $logs ('install-' + [DateTime]::Now.ToString('yyyyMMdd-HHmmss') + '.log')
    Start-Transcript -LiteralPath $log -Force | Out-Null
    $transcript = $true
    if (Get-Process -Name AfterFX -ErrorAction SilentlyContinue) { throw 'Close After Effects before installing, then run this installer again.' }
    . (Join-Path $PSScriptRoot 'Install-Core.ps1')
    $source = Join-Path $PackageRoot 'Extension/YaguaTool'
    $extensions = Join-Path ([Environment]::GetFolderPath('ApplicationData')) 'Adobe/CEP/extensions'
    $result = Install-YaguaTool -Source $source -ExtensionsRoot $extensions -BackupRoot (Join-Path $local 'YaguaTool/Backups') -WorkRoot (Join-Path $local 'YaguaTool/InstallWork') -IntegrityFile (Join-Path $PSScriptRoot 'PACKAGE_INTEGRITY.json') -ConfigureHost {
        foreach ($version in @(11,12,13)) {
            $key = 'HKCU:\Software\Adobe\CSXS.' + $version
            New-Item -Path $key -Force | Out-Null
            New-ItemProperty -Path $key -Name PlayerDebugMode -PropertyType String -Value '1' -Force | Out-Null
        }
    }
    Write-Host ''
    Write-Host 'INSTALADO CORRECTAMENTE - YaguaTool 3.1.6' -ForegroundColor Green
    Write-Host ('Destino: ' + $result.Destination)
    if ($result.Backup) { Write-Host ('Respaldo: ' + $result.Backup) }
    Write-Host 'Reinicia AE > Ventana > Extensiones (heredadas) > YaguaTool.'
    Write-Host 'Fuente Motion Lab: Extension\YaguaTool\assets\fonts\GeistLab760.ttf'
    Write-Host ('Registro: ' + $log)
    Stop-Transcript | Out-Null
    exit 0
} catch {
    Write-Host ('ERROR: ' + $_.Exception.Message) -ForegroundColor Red
    if ($log) { Write-Host ('Registro: ' + $log) }
    if ($transcript) { Stop-Transcript | Out-Null }
    exit 1
}
