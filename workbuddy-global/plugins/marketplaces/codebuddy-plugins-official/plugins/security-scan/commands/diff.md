---
description: Git diff 增量安全审计。支持 light（快速扫描）和 deep（深度扫描）两种模式。
argument-hint: "[--commit <hash|base..head>] [--scan-level light|deep] [--mode staged|unstaged|all] [--auto]"
allowed-tools: Bash, Read, Glob, Write, Grep, Task, Edit, MultiEdit, LSP, WebSearch, AskUserQuestion
---

# Git Diff 增量安全审计

> 所有面向用户的输出使用**简体中文**。禁止使用 emoji。JSON 字段名保持英文。

硬约束：
- 必须在 git 仓库中运行
- 文件列表来自 git diff，无需文件枚举
- 关联文件总数上限 = changedCodeFiles x 3

---

## 自动模式（--auto）

当指定 `--auto` 参数时，进入无人值守模式，跳过所有用户交互：

| 交互点 | 正常模式 | --auto 模式 |
|--------|---------|------------|
| 模式选择（init-步骤2） | AskUserQuestion | 使用 `--scan-level` 参数（默认 light） |
| 高风险未验证确认 | AskUserQuestion | 跳过，直接继续 |
| 修复交互 | AskUserQuestion | **跳过修复**，直接进入报告生成 |
| 下一步操作 | AskUserQuestion | 跳过，自动结束 |

`--auto` 模式下的完整流水线：
1. 初始化（跳过交互）→ 2. 探索 → 3. 扫描 → 4. 验证 → 5. 报告生成 → 6. 上报 → 7. 门禁评估 → 8. 门禁通知 → 自动结束

**安全红线**：`--auto` 模式**绝不**执行自动修复（不修改用户代码）。

---

## 编排器核心原则

> Ref: `${CODEBUDDY_PLUGIN_ROOT}/references/contracts/orchestrator-contract.md`（仅在执行到编排调度时 Read，不提前加载）

---

## 初始化

> Ref: `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/initialization.md`（仅在执行初始化时 Read，不提前加载）

按共享初始化流程依次执行 init-步骤0~5。

> **init-步骤0 必须最先执行**：通过 Glob 搜索 `**/security-scan/.codebuddy-plugin/plugin.json` 确定性解析插件根目录绝对路径，记录为 `CODEBUDDY_PLUGIN_ROOT`。后续所有 Bash 调用插件脚本前必须 `export CODEBUDDY_PLUGIN_ROOT="<路径>"`。详见 initialization.md。

diff 模式差异：模式选择交互中的时间预估为 Light 约 1-3 分钟，Deep 约 5-15 分钟。

输出初始化摘要：
> Ref: `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/post-audit.md > 进度与摘要输出 > 阶段0: 初始化摘要`

---

## 阶段1: 探索

> 进度与摘要格式 Ref: `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/post-audit.md > 进度与摘要输出 > 阶段1: 探索`

### 探索阶段：初始化 + 获取变更

```bash
audit_batch_id="diff-${scanMode}-$(date +%Y%m%d%H%M%S)"
mkdir -p security-scan-output/$audit_batch_id/agents
```

初始化 SQLite 索引数据库：

```bash
python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/index_db.py" init --batch-dir security-scan-output/$audit_batch_id --batch-id $audit_batch_id
```

查询长期记忆和项目结构缓存：

```bash
python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/index_db.py" query --batch-dir security-scan-output/$audit_batch_id --preset memory-hints --project-path "$(pwd)"

python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/index_db.py" query --batch-dir security-scan-output/$audit_batch_id --preset cached-structure --project-path "$(pwd)"
```

记录 `structureCache`。diff 模式下结构缓存尤为有价值：有缓存时可直接定位变更文件涉及的入口点和已知 Sink，加速影响范围分析。

获取 git diff 文件列表：

```bash
git diff <base> <head> --name-only --diff-filter=ACMR    # commit range (base..head)
git diff <hash>^ <hash> --name-only --diff-filter=ACMR   # single commit
git diff HEAD --name-only --diff-filter=ACMR              # --mode all (default)
git diff --cached --name-only --diff-filter=ACMR           # --mode staged
git diff --name-only --diff-filter=ACMR                    # --mode unstaged
```

**`--commit` 参数解析规则**：
- `--commit abc1234..def5678` → commit 范围，使用 `git diff abc1234 def5678`
- `--commit abc1234~1..def5678` → 带 `~N` 的范围语法，同上
- `--commit abc1234` → 单个 commit，使用 `git diff abc1234^ abc1234`

**参数自动修正**（防御性校验）：
- `--mode staged` 但 `git diff --cached --name-only` 为空 → 自动修正为 `--commit HEAD`，并向用户说明原因（暂存区已清空，可能是 commit 后触发的被动扫描）
- `--mode all` 但 `git diff HEAD --name-only` 为空 → 自动修正为 `--commit HEAD`，并向用户说明原因

**空文件列表快速退出**：

```
**未检测到任何代码变更**，无需执行安全扫描。
请确认：
  - 当前分支是否有未提交的修改（`git status` 查看）
  - 或指定具体 commit：`/security-scan:diff --commit <hash>`
```

**变更文件分类**：
- **代码文件**：`.java`、`.py`、`.go`、`.js`、`.ts` 等
- **依赖文件**：`pom.xml`、`package.json`、`go.mod` 等
- **配置文件**：`application.yml`、`.env` 等
- **运维文件**：`Dockerfile`、`docker-compose.yml` 等

输出任务摘要：

```
  **[1.1]** 变更获取完成
    变更文件：**{changedFiles}** 个（代码 **{codeFiles}**，配置 **{configFiles}**，依赖 **{depFiles}**，运维 **{opsFiles}**）
```

### 探索阶段：判断是否需要执行完整 diff 流水线

```
hasCodeChanges = true?
  -> true  -> 完整 diff 流水线
  -> false -> 纯配置/依赖变更快速通道（1.3c）
```

### 1.3a 基础探索（hasCodeChanges = true）

编排器内快速完成：
1. **技术栈识别**：Glob + Grep 确认框架
2. **变更文件 Sink 检测**：对变更代码文件 Grep Sink 模式
3. **凭证/密钥检测**：对变更文件 Grep 密钥模式
4. **配置基线检查**：对变更配置文件检查不安全默认值

输出任务摘要：

```
  **[1.3a]** 基础探索完成
    技术栈：**{framework}**
    变更文件 Sink：**{sinkCount}** 个候选 Sink
    凭证检测：**{secretCount}** 个疑似硬编码密钥
    配置基线：**{configIssueCount}** 个不安全配置项
```

### 1.3b Deep 模式深度探索（hasCodeChanges = true）

> **仅 Deep 模式执行**。Light 模式跳过，直接进入阶段2。

先执行 1.3a 的基础探索，然后启动 indexer Agent，`[scope] = diff`：
> Ref: `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/scan-mode.md > 阶段1: 探索差异 > Deep 模式`

indexer 在 diff 模式下额外执行**影响范围扩展**：
> Ref: `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/diff-mode.md > 变更影响范围分析策略`

输出任务摘要：

```
  **[1.3b]** 深度探索完成（indexer Agent）
    语义索引已构建：`project-index.db`
    关联文件：**{relatedFiles}** 个（L1 **{a}**，L2 **{b}**，L3 **{c}**）
    端点：**{endpointCount}** 个 API 端点
    调用图：**{callGraphEdges}** 条调用关系
    防御映射：**{defenseCount}** 个防御点
```

### 1.3c 纯配置/依赖快速通道（hasCodeChanges = false）

```
  **[1.3c]** 探索完成：变更文件 **{n}** 个（均为配置/依赖文件，无代码变更）
  启用**配置快速通道**：仅执行密钥检测 + CVE 扫描 + 配置基线检查
```

编排器内联执行密钥检测 + CVE 扫描 + 配置基线，跳转到阶段4报告生成。

### 探索阶段：探索阶段摘要

输出探索阶段完成摘要（diff 模式）：
> Ref: `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/post-audit.md > 进度与摘要输出 > 阶段1: 探索 > 阶段完成摘要 > diff 模式`

### 探索阶段：生成扫描计划

生成 `batch-plan.json` 以保障审计元数据完整性（供后续 generate_report.py 使用）：

```bash
python3 << 'PYTHON_INLINE_SCRIPT'
import json
import os

batch_dir = "security-scan-output/${audit_batch_id}"

batch_plan = {
    "total_files": {changedFiles},
    "changed_files": {changedFiles},
    "code_files": {codeFiles},
    "config_files": {configFiles},
    "dep_files": {depFiles},
    "scan_mode": "${scanMode}",
    "framework": "{framework}",
    "scan_timestamp": "$(date -Iseconds)"
}

batch_plan_file = os.path.join(batch_dir, "batch-plan.json")
with open(batch_plan_file, 'w') as f:
    json.dump(batch_plan, f, ensure_ascii=False, indent=2)

print(f"已生成 {batch_plan_file}")
PYTHON_INLINE_SCRIPT
```

---

## 阶段2: 扫描

> 进度与摘要格式 Ref: `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/post-audit.md > 进度与摘要输出 > 阶段2: 扫描`
> 扫描策略 Ref: `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/scan-mode.md > 阶段2: 扫描差异`（仅在执行扫描阶段时 Read，不提前加载）

按 scanMode 执行对应的扫描策略。diff 模式的 Deep Agent 提示词需附加变更上下文：
> Ref: `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/diff-mode.md > Agent 提示词注入模板`

> **Deep 模式关键**：并行启动 vuln-scan + logic-scan + red-team 三个 Agent Task 后，主窗口**不空转等待**——先执行前置工作（导出 indexer findings、加载知识文件），再检查各 Agent 产物是否落盘。详见 `workflows/scan-mode.md > Deep 模式 > 2.2 等待期间前置工作 + 流式处理`。

**漏洞链检测**（diff 模式尤为重要）：
> Ref: `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/diff-mode.md > 漏洞链检测重点`

---

## 阶段3: 验证

> 进度与摘要格式 Ref: `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/post-audit.md > 进度与摘要输出 > 阶段3: 验证`

按 scanMode 执行对应的验证策略。

> **完整流程** Read: `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/verification.md`（仅在执行验证阶段时 Read，不提前加载）
>
> - **Light 模式**：轻量验证，仅代码存在性校验（置信度上限 90）
> - **Deep 模式**：确定性脚本验证（Stage 1-3）→ verifier Agent 深度验证（Stage 4）→ 评分 + 质量评估（Stage 5）→ merge-verify 合并

---

## 阶段4: 修复

> 进度与摘要格式 Ref: `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/post-audit.md > 进度与摘要输出 > 阶段4: 修复`

### 修复阶段：修复方案生成

> Ref: `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/post-audit.md > 内联修复执行`

### 修复阶段：POC 生成 + 报告生成 + 记忆同步 + 上报 + 门禁评估 + 门禁通知 + 摘要 + 用户交互

> 按 `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/post-audit.md` 依次执行：POC 验证脚本生成 → 报告生成 → 长期记忆同步 → 静默上报 → 门禁评估 → 门禁通知 → 审计摘要 → 用户交互。
> 以下步骤为**必须执行（MANDATORY）**，不可跳过。

用户选择修复时，按 `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/post-audit.md > 内联修复执行` 执行。
用户选择预览时，使用 `open` 命令打开 HTML 报告。

---

## 错误处理

> Ref: `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/scan-mode.md > 错误处理`（仅在遇到错误时 Read，不提前加载）

diff 模式额外降级策略：indexer 失败时，基于基础探索结果的变更文件列表仍可用，编排器内联执行轻量扫描作为降级。
