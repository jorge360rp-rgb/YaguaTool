param([string]$CorePath)
if (-not $CorePath) { $CorePath = Join-Path $PSScriptRoot '../installer/Install-Core.ps1'; if (-not (Test-Path -LiteralPath $CorePath)) { $CorePath = Join-Path $PSScriptRoot '../../Install-Core.ps1' } }
$ErrorActionPreference='Stop'
. $CorePath
function Assert-Yagua([bool]$Condition,[string]$Message) { if (-not $Condition) { throw $Message } }
$root = Join-Path ([IO.Path]::GetTempPath()) ("Yagua [test] O'Brien spaces-" + [Guid]::NewGuid().ToString('N'))
$source=Join-Path $root 'Paquete/Extension/YaguaTool'
$extensions=Join-Path $root 'Usuario/Roaming/Adobe/CEP/extensions'
$backups=Join-Path $root 'Documentos redirigidos/Backups'
$work=Join-Path $root 'LocalAppData/Work'
$integrity=Join-Path $root 'integrity.json'
$checks=New-Object 'System.Collections.Generic.List[string]'
try {
    $files=@('.debug','index.html','CSXS/manifest.xml','jsx/yagua-host.jsx','js/ae-bridge.js','motion-lab/reference-player.js','library/Fluido_Original_AE2024.aep','assets/fonts/GeistLab760.ttf')
    foreach ($name in $files) {
        $file=Join-Path $source $name
        [void][IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($file))
        [IO.File]::WriteAllText($file,'test payload')
    }
    [IO.File]::WriteAllText((Join-Path $source 'CSXS/manifest.xml'),'<ExtensionManifest ExtensionBundleId="com.animix.panel" ExtensionBundleVersion="3.1.6"/>')
    $records=@(foreach($name in $files){$file=Join-Path $source $name;[pscustomobject]@{path=$name;size=(Get-Item -LiteralPath $file -Force).Length;sha256=(Get-FileHash -LiteralPath $file).Hash.ToLowerInvariant()}})
    [IO.File]::WriteAllText($integrity,(@{version='3.1.6';files=$records}|ConvertTo-Json -Depth 5))
    $config={ $script:configured=$true };$script:configured=$false
    $result=Install-YaguaTool -Source $source -ExtensionsRoot $extensions -BackupRoot $backups -WorkRoot $work -IntegrityFile $integrity -ConfigureHost $config
    $destination=Join-Path $extensions 'YaguaTool'
    Assert-Yagua (Test-Path -LiteralPath (Join-Path $destination 'index.html')) 'First install missing payload'
    Assert-Yagua $script:configured 'Configuration callback not called'
    Assert-Yagua (-not (Test-Path -LiteralPath (Join-Path $destination 'YaguaTool'))) 'Nested destination folder'
    Assert-Yagua (Test-Path -LiteralPath (Join-Path $destination '.debug')) 'Hidden debug file missing'
    $checks.Add('First install including hidden .debug; spaces, brackets and apostrophe; exact CEP destination')
    [IO.File]::WriteAllText((Join-Path $destination 'index.html'),'old version')
    $legacy=Join-Path $extensions 'Yaguanimix'
    Copy-YaguaTree -Source $source -Destination $legacy
    $unrelated=Join-Path $extensions 'OtherPlugin/CSXS'
    [void][IO.Directory]::CreateDirectory($unrelated)
    [IO.File]::WriteAllText((Join-Path $unrelated 'manifest.xml'),'<other/>')
    $result=Install-YaguaTool -Source $source -ExtensionsRoot $extensions -BackupRoot $backups -WorkRoot $work -IntegrityFile $integrity -ConfigureHost $config
    Assert-Yagua ([IO.File]::ReadAllText((Join-Path $result.Backup 'YaguaTool/index.html')) -eq 'old version') 'Previous version not backed up'
    Assert-Yagua (-not (Test-Path -LiteralPath $legacy)) 'Duplicate CEP ID left active'
    Assert-Yagua (Test-Path -LiteralPath (Join-Path $result.Backup 'OtherInstallations/Yaguanimix/CSXS/manifest.xml')) 'Duplicate not backed up'
    Assert-Yagua (Test-Path -LiteralPath (Join-Path $unrelated 'manifest.xml')) 'Unrelated plugin changed'
    $checks.Add('Upgrade backups by copy; duplicate ID disabled; unrelated plugin preserved')
    $same=Install-YaguaTool -Source $destination -ExtensionsRoot $extensions -BackupRoot $backups -WorkRoot $work -IntegrityFile $integrity -ConfigureHost $config
    Assert-Yagua $same.AlreadyInstalled 'Same-path install not detected'
    $checks.Add('Already-installed source is not moved or recursively copied')
    [IO.File]::WriteAllText((Join-Path $destination 'index.html'),'rollback marker')
    $failed=$false
    try { Install-YaguaTool -Source $source -ExtensionsRoot $extensions -BackupRoot $backups -WorkRoot $work -IntegrityFile $integrity -ConfigureHost {throw 'simulated registration failure'} | Out-Null } catch { $failed=$true }
    Assert-Yagua $failed 'Failure was not surfaced'
    Assert-Yagua ([IO.File]::ReadAllText((Join-Path $destination 'index.html')) -eq 'rollback marker') 'Old files not restored on failure'
    $checks.Add('Post-copy failure restores previous installation')
    $emptyRoot=Join-Path $root 'NewUser/CEP/extensions'
    $failed=$false
    try { Install-YaguaTool -Source $source -ExtensionsRoot $emptyRoot -BackupRoot $backups -WorkRoot $work -IntegrityFile $integrity -ConfigureHost {throw 'simulated failure'} | Out-Null } catch { $failed=$true }
    Assert-Yagua $failed 'Fresh failure was not surfaced'
    Assert-Yagua (-not (Test-Path -LiteralPath (Join-Path $emptyRoot 'YaguaTool'))) 'Partial new install left behind'
    $checks.Add('Fresh-install failure removes partial destination')
    [IO.File]::WriteAllText((Join-Path $source 'index.html'),'corrupt source')
    $failed=$false
    try { Install-YaguaTool -Source $source -ExtensionsRoot $extensions -BackupRoot $backups -WorkRoot $work -IntegrityFile $integrity | Out-Null } catch { $failed=$true }
    Assert-Yagua $failed 'Corrupt source accepted'
    Assert-Yagua ([IO.File]::ReadAllText((Join-Path $destination 'index.html')) -eq 'rollback marker') 'Corrupt source modified current install'
    $checks.Add('Integrity failure leaves installed version untouched')
    $records[1].size=(Get-Item -LiteralPath (Join-Path $source 'index.html')).Length
    $records[1].sha256=(Get-FileHash -LiteralPath (Join-Path $source 'index.html')).Hash.ToLowerInvariant()
    [IO.File]::WriteAllText($integrity,(@{files=$records}|ConvertTo-Json -Depth 5))
    $failed=$false
    try { Install-YaguaTool -Source $source -ExtensionsRoot $extensions -BackupRoot $backups -WorkRoot (Join-Path $extensions 'bad-stage') -IntegrityFile $integrity | Out-Null } catch { $failed=$true }
    Assert-Yagua $failed 'Recursive/in-CEP staging accepted'
    $checks.Add('In-CEP staging rejected before changes')
    @{engine=$PSVersionTable.PSVersion.ToString();os=[Environment]::OSVersion.Platform.ToString();checks=@($checks);windowsRegistry='Not executed on Linux';windowsLauncher='Not executed on Linux'} | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $PSScriptRoot 'INSTALLER.json') -Encoding UTF8
    Write-Host ('PASS: '+$checks.Count+' installer scenarios')
} finally { if(Test-Path -LiteralPath $root){Remove-Item -LiteralPath $root -Recurse -Force} }
