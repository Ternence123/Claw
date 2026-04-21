# WorkBuddy Migration - Pack Script (Run on OLD PC)
# Run as Administrator PowerShell

$ScriptDir = $PSScriptRoot
$Username = $env:USERNAME
$OutDir = "$ScriptDir\transfer-workbuddy"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  WorkBuddy Migration Pack (OLD PC)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[INFO] Current user: $Username" -ForegroundColor White
Write-Host "[INFO] Output dir: $OutDir" -ForegroundColor White
Write-Host ""

# Create output directory
if (Test-Path $OutDir) {
    Write-Host "[WARN] Output dir exists, will overwrite..." -ForegroundColor Yellow
} else {
    New-Item -ItemType Directory -Path $OutDir -Force | Out-Null
}

# Define sources
$WORKBUDDY = "C:\Users\$Username\.workbuddy"
$WORKSPACE = "C:\Users\$Username\WorkBuddy\Claw"
$AUTOMATIONS = "$env:APPDATA\WorkBuddy\automations"
$PLUGINS = "$env:APPDATA\WorkBuddy\plugins"
$SETTINGS = "$env:APPDATA\WorkBuddy\User\settings.json"
$USERDATA = "$env:APPDATA\WorkBuddy\Data"

Write-Host "Sources to pack:" -ForegroundColor Yellow
Write-Host "  1_workbuddy  -> $WORKBUDDY" -ForegroundColor White
Write-Host "  2_workspace  -> $WORKSPACE" -ForegroundColor White
Write-Host "  3_automations-> $AUTOMATIONS" -ForegroundColor White
Write-Host "  4_plugins   -> $PLUGINS" -ForegroundColor White
Write-Host "  5_settings  -> $SETTINGS" -ForegroundColor White
Write-Host "  6_user-data -> $USERDATA" -ForegroundColor White
Write-Host ""

$Confirm = Read-Host "Start packing? (Y/N)"
if ($Confirm -ne "Y" -and $Confirm -ne "y") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host ">>> Packing started..." -ForegroundColor Cyan

# Helper function
function Pack-DirOrFile {
    param($Label, $Src, $Dst)
    Write-Host ">>> [$Label] Packing $Src..." -ForegroundColor Yellow
    if (-not (Test-Path $Src)) {
        Write-Host "    [SKIP] Not found: $Src" -ForegroundColor Gray
        return
    }
    if (Test-Path $Dst) { Remove-Item $Dst -Force }
    if ($Src -like "*.json") {
        Copy-Item $Src $Dst -Force
        $size = (Get-Item $Dst).Length
        Write-Host "    [OK] Copied -> $Dst" -ForegroundColor Green
    } else {
        Compress-Archive -Path $Src -DestinationPath $Dst -Force
        $sizeMB = [math]::Round((Get-Item $Dst).Length / 1MB, 2)
        Write-Host "    [OK] Archived -> $Dst ($sizeMB MB)" -ForegroundColor Green
    }
}

# 1
Pack-DirOrFile "1/6" $WORKBUDDY "$OutDir\1_workbuddy-config.zip"
# 2
Pack-DirOrFile "2/6" $WORKSPACE "$OutDir\2_workspace-Claw.zip"
# 3
Pack-DirOrFile "3/6" $AUTOMATIONS "$OutDir\3_automations-db.zip"
# 4
Pack-DirOrFile "4/6" $PLUGINS "$OutDir\4_plugins.zip"
# 5
if (Test-Path $SETTINGS) {
    Write-Host ">>> [5/6] Copying settings..." -ForegroundColor Yellow
    Copy-Item $SETTINGS "$OutDir\5_settings.json" -Force
    Write-Host "    [OK] Copied settings.json" -ForegroundColor Green
} else {
    Write-Host ">>> [5/6] settings.json not found, skipped." -ForegroundColor Gray
}
# 6
Pack-DirOrFile "6/6" $USERDATA "$OutDir\6_user-data.zip"

# README
$Readme = @"
# WorkBuddy Migration Package
Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

## Contents
1. .workbuddy config (Skills, MCP, identity, memory)
2. WorkBuddy\Claw workspace (project files, memory)
3. automations database (scheduled tasks)
4. plugins
5. settings.json (UI preferences)
6. User Data

## Restore Steps (NEW PC)
1. Install WorkBuddy to: D:\Program Files\WorkBuddy
2. Close WorkBuddy
3. Copy this folder to new PC
4. Run PowerShell as Admin, execute:
   .\transfer-workbuddy-restore-newpc.ps1
5. Script auto-restores everything
6. Reinstall OpenClaw manually:
   npm install -g openclaw
7. Launch WorkBuddy and verify

## Notes
- After restore, verify Skills, automations, and Feishu connection
- Keep old PC files until new PC is confirmed working
"@

$Readme | Out-File -FilePath "$OutDir\README.md" -Encoding UTF8

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Packing Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Generated files:" -ForegroundColor White
Get-ChildItem $OutDir | ForEach-Object {
    $mb = [math]::Round($_.Length / 1MB, 2)
    Write-Host "  $($_.Name) ($mb MB)" -ForegroundColor Cyan
}
Write-Host ""
Write-Host "Next: Copy the entire 'transfer-workbuddy' folder to the new PC" -ForegroundColor Yellow
Write-Host "      Then run transfer-workbuddy-restore-newpc.ps1 on new PC" -ForegroundColor Yellow
