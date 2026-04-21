# WorkBuddy Skills 一键安装命令
# 使用方式：将此文件内容复制到新电脑的 PowerShell 管理员窗口执行
# 或者另存为 .ps1 文件后以管理员身份运行

$SkillsDir = "$PSScriptRoot"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  WorkBuddy Skills 一键安装" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$TargetDir = "$env:USERPROFILE\.workbuddy\skills"
if (-not (Test-Path $TargetDir)) {
    New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
    Write-Host "[OK] Created $TargetDir" -ForegroundColor Green
}

$Skills = @(
    "财报追踪",
    "多引擎搜索",
    "飞书套件",
    "内容总结",
    "市场调研",
    "agent-browser-clawdbot",
    "agent-browser-core",
    "agent-browser-stagehand",
    "agent-browser",
    "agent-memory",
    "agentmail",
    "cos-vectors",
    "Excel 文件处理",
    "FBS-BookWriter",
    "feishu-doc",
    "find-skills",
    "github",
    "healthcheck",
    "himalaya",
    "humanizer",
    "ima",
    "lexiang-knowledge-base",
    "nano-banana-pro",
    "obsidian",
    "openclaw-find-skills",
    "openclaw-reminder",
    "openclaw-tavily-search",
    "PDF 文档生成",
    "PPT 演示文稿",
    "proactive-agent-lite",
    "QQ邮箱",
    "self-improving-agent-cn",
    "skill-vetter",
    "summarize-cli",
    "summarize",
    "tavily-search-darry",
    "tavily-search-pro",
    "tavily-search",
    "weather",
    "Word 文档生成",
    "workbuddy-channel-setup",
    "xiucheng-self-improving-agent"
)

$Count = 0
$Skip = 0

foreach ($skill in $Skills) {
    $src = Join-Path $SkillsDir $skill
    $dst = Join-Path $TargetDir $skill

    if (Test-Path $src) {
        if (Test-Path $dst) {
            Write-Host "  [SKIP] $skill  (already exists)" -ForegroundColor Gray
            $Skip++
        } else {
            Copy-Item $src $dst -Recurse -Force
            Write-Host "  [OK]    $skill" -ForegroundColor Green
            $Count++
        }
    } else {
        Write-Host "  [MISS]  $skill  (source not found)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  安装完成！共安装 $Count 个，跳过 $Skip 个已存在" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "目标目录: $TargetDir" -ForegroundColor White
Write-Host ""
