---
description: 全项目代码安全审计。支持 light（快速扫描）和 deep（深度扫描）两种模式。
argument-hint: "[file_path...] [--scan-level light|deep] [--include *.py,*.js] [--exclude node_modules,dist]"
allowed-tools: Bash, Read, Glob, Write, Grep, Task, Edit, MultiEdit, LSP, WebSearch, AskUserQuestion
---

# 全项目安全审计

> 所有面向用户的输出使用**简体中文**。禁止使用 emoji。JSON 字段名保持英文。

---

## 编排器核心原则

> Ref: `${CODEBUDDY_PLUGIN_ROOT}/references/contracts/orchestrator-contract.md`（仅在执行到编排调度时 Read，不提前加载）

---

## 初始化

> Ref: `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/initialization.md`（仅在执行初始化时 Read，不提前加载）

按共享初始化流程依次执行 init-步骤0~5（**插件根目录解析**、权限、模式选择、tree-sitter、LSP、环境确认）。

> **init-步骤0 必须最先执行**：通过 Glob 搜索 `**/security-scan/.codebuddy-plugin/plugin.json` 确定性解析插件根目录绝对路径，记录为 `CODEBUDDY_PLUGIN_ROOT`。后续所有 Bash 调用插件脚本前必须 `export CODEBUDDY_PLUGIN_ROOT="<路径>"`。详见 initialization.md。

project 模式无额外差异，完整按 initialization.md 执行。

输出初始化摘要：
> Ref: `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/post-audit.md > 进度与摘要输出 > 阶段0: 初始化摘要`

---

## 阶段1: 探索

> 进度与摘要格式 Ref: `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/post-audit.md > 进度与摘要输出 > 阶段1: 探索`

### 探索阶段：初始化工作目录和检测历史扫描记忆

```bash
audit_batch_id="project-${scanMode}-$(date +%Y%m%d%H%M%S)"
mkdir -p security-scan-output/$audit_batch_id/agents
```

初始化 SQLite 索引数据库 + 长期记忆库：

```bash
python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/index_db.py" init --batch-dir security-scan-output/$audit_batch_id --batch-id $audit_batch_id
```

查询长期记忆（如有历史扫描）：

```bash
python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/index_db.py" query --batch-dir security-scan-output/$audit_batch_id --preset memory-hints --project-path "$(pwd)"
```

查询项目结构缓存（如有历史扫描的结构快照）：

```bash
python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/index_db.py" query --batch-dir security-scan-output/$audit_batch_id --preset cached-structure --project-path "$(pwd)"
```

记录 `structureCache`（`cached-structure` 返回的 JSON）。

**缓存复用规则**：
- `structureCache.cached == true` → indexer-1.2 改为增量模式：通过 `content_hash` 比对识别新增/变更/删除的文件，对变更文件重新执行 Sink + 入口点 Grep，技术栈通过标记文件 Glob 校验后决定复用或重检
- `structureCache.cached == false` → 正常执行 indexer-1.2 全量枚举

输出任务摘要：

```
  **[1.1]** 工作目录已初始化：`security-scan-output/{audit_batch_id}`
  {hasMemoryHints ? "历史扫描记忆已加载，共 **" + memoryCount + "** 条提示" : "无历史扫描记忆"}
  {structureCache.cached ? "项目结构缓存命中：**" + structureCache.fileCount + "** 个文件，**" + structureCache.entryPointCount + "** 个入口点（将增量更新）" : "无结构缓存，将执行全量枚举"}
```

### 探索阶段：基础探索

> 基础探索逻辑的权威定义：`agents/indexer.md > indexer-步骤1`。
> Light 模式由编排器内联执行 indexer-步骤1 逻辑，Deep 模式由 indexer Agent 完整执行（编排器仍先执行基础探索，indexer 在此基础上构建完整语义索引）。

在编排器内按 `agents/indexer.md > indexer-步骤1` 的流程快速完成基础枚举：

- `structureCache.cached == true` → 增量模式（详见 `agents/indexer.md > indexer-1.0a 缓存加速`）
- `structureCache.cached == false` → 全量枚举

基础探索包含：文件枚举 + 技术栈识别、入口点粗定位、Sink 粗定位、凭证/密钥检测、配置基线、CVE 扫描。

输出任务摘要：

```
  **[1.2]** 基础探索完成
    文件枚举：**{fileCount}** 个源文件，**{totalLines}** 行代码
    技术栈：**{framework}**
    入口点文件：**{entryPointFiles}** 个
    Sink 粗定位：**{sinkCount}** 个候选 Sink
    凭证检测：**{secretCount}** 个疑似硬编码密钥
    配置基线：**{configIssueCount}** 个不安全配置项
    依赖安全：**{cveCount}** 个已知 CVE
```

### 探索阶段：Deep 模式深度探索

> **仅 Deep 模式执行**。Light 模式跳过，直接进入阶段2。
> Ref: `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/scan-mode.md > 阶段1: 探索差异 > Deep 模式`

启动 indexer Agent 构建完整语义索引。

输出任务摘要：

```
  **[1.3]** 深度探索完成（indexer Agent）
    语义索引已构建：`project-index.db`
    端点：**{endpointCount}** 个 API 端点
    调用图：**{callGraphEdges}** 条调用关系
    防御映射：**{defenseCount}** 个防御点
```

### 探索阶段：生成扫描计划

生成 `batch-plan.json` 以保障扫描元数据完整性（供后续 merge_findings.py 和 generate_report.py 使用）：

```bash
python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/index_db.py" query --batch-dir security-scan-output/$audit_batch_id --preset summary > /tmp/summary_out.json 2>/dev/null

# 提取必要的扫描数据并生成 batch-plan.json
python3 << 'PYTHON_INLINE_SCRIPT'
import json
import os

batch_dir = "security-scan-output/${audit_batch_id}"
summary_out = json.loads(open("/tmp/summary_out.json").read())

# 计算源文件总数（从索引数据库或环保存的fileCount）
file_count = summary_out.get("fileCount", 0)
if file_count == 0:
    # Fallback: 从 git ls-files 快速统计
    import subprocess
    try:
        result = subprocess.run(
            "git ls-files --cached --others --exclude-standard | grep -E '\\.(java|kt|kts|py|go|js|ts|jsx|tsx|php|rb|cs|cpp|c|rs|swift|vue)$' | wc -l",
            shell=True, capture_output=True, text=True
        )
        file_count = int(result.stdout.strip()) if result.stdout.strip().isdigit() else 0
    except:
        file_count = 0

batch_plan = {
    "total_files": file_count,
    "scan_mode": "${scanMode}",
    "framework": summary_out.get("framework", "unknown"),
    "entry_points": summary_out.get("entryPointCount", 0),
    "scan_timestamp": "$(date -Iseconds)"
}

batch_plan_file = os.path.join(batch_dir, "batch-plan.json")
with open(batch_plan_file, 'w') as f:
    json.dump(batch_plan, f, ensure_ascii=False, indent=2)

print(f"已生成 {batch_plan_file}")
PYTHON_INLINE_SCRIPT
```

### 探索阶段：探索阶段摘要

```bash
python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/index_db.py" query --batch-dir security-scan-output/$audit_batch_id --preset summary
```

**条件规则加载**：按技术栈加载框架安全知识。
> Ref: `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/orchestration.md > 条件规则加载`

输出探索阶段完成摘要（project 模式）：
> Ref: `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/post-audit.md > 进度与摘要输出 > 阶段1: 探索 > 阶段完成摘要 > project 模式`

---

## 阶段2: 扫描

> 进度与摘要格式 Ref: `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/post-audit.md > 进度与摘要输出 > 阶段2: 扫描`
> 扫描策略 Ref: `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/scan-mode.md > 阶段2: 扫描差异`（仅在执行扫描阶段时 Read，不提前加载）

按 scanMode 执行对应的扫描策略（Light 编排器内联 / Deep 三 Agent 并行）。

> **Deep 模式关键**：并行启动 vuln-scan + logic-scan + red-team 三个 Agent。启动后主窗口**不空转等待**——先执行前置工作（导出 indexer findings、加载知识文件），再检查各 Agent 产物是否落盘。详见 `workflows/scan-mode.md > Deep 模式 > 2.2 等待期间前置工作 + 流式处理`。

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
