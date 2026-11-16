# Shared, testable file transaction. Compatible with Windows PowerShell 5.1.
Set-StrictMode -Version Latest
function Copy-YaguaTree {
    param([string]$Source,[string]$Destination)
    [void][IO.Directory]::CreateDirectory($Destination)
    foreach ($item in Get-ChildItem -LiteralPath $Source -Force) {
        if (($item.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { throw "Unsupported linked path: $($item.FullName)" }
        Copy-Item -LiteralPath $item.FullName -Destination $Destination -Recurse -Force -ErrorAction Stop
    }
}
function Test-YaguaPayload {
    param([string]$Path,[string]$IntegrityFile)
    $ErrorActionPreference = 'Stop'
    foreach ($relative in @('index.html','CSXS/manifest.xml','jsx/yagua-host.jsx','js/ae-bridge.js','motion-lab/reference-player.js','library/Fluido_Original_AE2024.aep','assets/fonts/GeistLab760.ttf')) {
        if (-not (Test-Path -LiteralPath (Join-Path $Path $relative) -PathType Leaf)) { throw "Incomplete extension: $relative. Extract the complete ZIP first." }
    }
    [xml]$manifest = Get-Content -LiteralPath (Join-Path $Path 'CSXS/manifest.xml') -Raw
    if ($manifest.ExtensionManifest.ExtensionBundleId -ne 'com.animix.panel') { throw 'Unexpected extension ID.' }
    $integrity = Get-Content -LiteralPath $IntegrityFile -Raw | ConvertFrom-Json
    foreach ($entry in $integrity.files) {
        $file = Join-Path $Path $entry.path
        if (-not (Test-Path -LiteralPath $file -PathType Leaf)) { throw "Missing package file: $($entry.path)" }
        if ((Get-Item -LiteralPath $file -Force).Length -ne $entry.size -or (Get-FileHash -LiteralPath $file -Algorithm SHA256).Hash.ToLowerInvariant() -ne $entry.sha256) { throw "Invalid package file: $($entry.path). Download and extract the ZIP again." }
    }
}
function Install-YaguaTool {
    param([string]$Source,[string]$ExtensionsRoot,[string]$BackupRoot,[string]$WorkRoot,[string]$IntegrityFile,[scriptblock]$ConfigureHost = {})
    $ErrorActionPreference = 'Stop'
    $sourcePath = [IO.Path]::GetFullPath($Source).TrimEnd([IO.Path]::DirectorySeparatorChar)
    $destination = Join-Path $ExtensionsRoot 'YaguaTool'
    Test-YaguaPayload -Path $sourcePath -IntegrityFile $IntegrityFile
    if ([string]::Equals($sourcePath,[IO.Path]::GetFullPath($destination).TrimEnd([IO.Path]::DirectorySeparatorChar),[StringComparison]::OrdinalIgnoreCase)) {
        & $ConfigureHost
        return [pscustomobject]@{Destination=$destination;Backup=$null;AlreadyInstalled=$true}
    }
    # Staging and backups must be outside CEP and outside the source tree.
    foreach ($root in @($BackupRoot,$WorkRoot)) {
        $full = [IO.Path]::GetFullPath($root).TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
        foreach ($parent in @($ExtensionsRoot,$sourcePath)) {
            $prefix = [IO.Path]::GetFullPath($parent).TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
            if ($full.StartsWith($prefix,[StringComparison]::OrdinalIgnoreCase)) { throw 'Staging/backups must be outside CEP and the source folder.' }
        }
    }
    $id = [DateTime]::UtcNow.ToString('yyyyMMdd-HHmmss') + '-' + [Guid]::NewGuid().ToString('N')
    $work = Join-Path $WorkRoot $id
    $stage = Join-Path $work 'stage'
    $backup = Join-Path $BackupRoot $id
    $oldBackup = Join-Path $backup 'YaguaTool'
    $hadOld = Test-Path -LiteralPath $destination
    $touched = $false
    $removed = New-Object 'System.Collections.Generic.List[object]'
    $duplicates = New-Object 'System.Collections.Generic.List[object]'
    [void][IO.Directory]::CreateDirectory($ExtensionsRoot)
    Copy-YaguaTree -Source $sourcePath -Destination $stage
    Test-YaguaPayload -Path $stage -IntegrityFile $IntegrityFile
    # Copy backups; CMD MOVE can fail across redirected Documents/drive boundaries.
    if ($hadOld) { Copy-YaguaTree -Source $destination -Destination $oldBackup }
    foreach ($dir in Get-ChildItem -LiteralPath $ExtensionsRoot -Directory -Force) {
        if ([string]::Equals($dir.FullName,[IO.Path]::GetFullPath($destination),[StringComparison]::OrdinalIgnoreCase)) { continue }
        $manifestPath = Join-Path $dir.FullName 'CSXS/manifest.xml'
        if (-not (Test-Path -LiteralPath $manifestPath -PathType Leaf)) { continue }
        try { [xml]$candidate = Get-Content -LiteralPath $manifestPath -Raw } catch { continue }
        $identity = $candidate.SelectSingleNode('/*[local-name()="ExtensionManifest"]/@ExtensionBundleId')
        if ($null -ne $identity -and $identity.Value -eq 'com.animix.panel') {
            $duplicateBackup = Join-Path (Join-Path $backup 'OtherInstallations') $dir.Name
            Copy-YaguaTree -Source $dir.FullName -Destination $duplicateBackup
            $duplicates.Add([pscustomobject]@{Path=$dir.FullName;Backup=$duplicateBackup})
        }
    }
    try {
        $touched = $true
        if ($hadOld) { Remove-Item -LiteralPath $destination -Recurse -Force -ErrorAction Stop }
        Copy-YaguaTree -Source $stage -Destination $destination
        Test-YaguaPayload -Path $destination -IntegrityFile $IntegrityFile
        & $ConfigureHost
        foreach ($duplicate in $duplicates) {
            $removed.Add($duplicate)
            Remove-Item -LiteralPath $duplicate.Path -Recurse -Force -ErrorAction Stop
        }
    } catch {
        $originalError = $_
        try {
            if ($touched) {
                if (Test-Path -LiteralPath $destination) { Remove-Item -LiteralPath $destination -Recurse -Force -ErrorAction Stop }
                if ($hadOld) { Copy-YaguaTree -Source $oldBackup -Destination $destination }
            }
            foreach ($duplicate in $removed) {
                if (Test-Path -LiteralPath $duplicate.Path) { Remove-Item -LiteralPath $duplicate.Path -Recurse -Force -ErrorAction Stop }
                Copy-YaguaTree -Source $duplicate.Backup -Destination $duplicate.Path
            }
        } catch { throw "Install failed; automatic restore also failed. Backup: $backup. Original: $originalError. Restore: $_" }
        throw "Install failed; previous installation restored. Backup: $backup. Error: $originalError"
    }
    Remove-Item -LiteralPath $work -Recurse -Force -ErrorAction SilentlyContinue
    return [pscustomobject]@{Destination=$destination;Backup=$backup;AlreadyInstalled=$false}
}
