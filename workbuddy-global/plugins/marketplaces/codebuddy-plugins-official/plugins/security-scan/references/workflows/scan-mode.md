# 扫描模式策略

> 引用方：commands/project.md、commands/diff.md

定义 Light（快速扫描）和 Deep（深度扫描）在各阶段的执行策略差异。

---

## 模式选择交互

> 完整交互流程：Ref `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/initialization.md > init-步骤2: 模式选择`

若用户通过 `--scan-level light` 或 `--scan-level deep` 指定了扫描模式，则**直接采用**该模式，跳过交互。否则弹出交互让用户选择"快速扫描（Light）"或"深度扫描（Deep）"。

> 模式选择在权限配置（init-步骤1）之后、环境准备（init-步骤3/4）之前执行。后续步骤按需准备：Light 跳过 LSP，Deep 才做 LSP 探活+安装。

记录 `scanMode = "light" | "deep"`。

---

## 阶段0: 初始化差异

> 完整初始化流程：Ref `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/initialization.md`

本节仅列出 Light/Deep 两种模式在初始化阶段的**策略差异**：

| 维度 | Light | Deep |
|------|-------|------|
| 权限检查与配置（init-步骤1） | 检查 + 自动修复 | 同 Light |
| 模式选择（init-步骤2） | 交互选择 | 同 Light |
| tree-sitter（init-步骤3） | **整体跳过** | 检测 + 自动安装 |
| LSP 探活与安装（init-步骤4） | **整体跳过** | 探活 + 自动安装二进制 + 二次探活 |
| 环境就绪确认（init-步骤5） | 直接输出就绪信息（无 pendingActions） | 可能包含 LSP / tree-sitter 降级提示 |

---

## 阶段1: 探索差异

### Light 模式

编排器内快速完成基础探索（Grep/Glob，不启动 Agent）：
1. 文件枚举 + 技术栈识别
2. Sink 粗定位、凭证/密钥检测、配置基线、CVE 扫描

### Deep 模式

先执行 Light 模式的基础探索，然后将探索结果写入索引数据库，最后启动 indexer Agent 从 indexer-步骤2 开始构建语义索引：

#### 1.1 编排器写入索引数据库（脚本化 indexer-步骤1 前置）

基础探索完成后，编排器通过脚本批量执行 indexer-步骤1 的确定性工作，并将结果写入 `project-index.db`：

```bash
# 1. 初始化索引数据库
python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/index_db.py" init --batch-dir security-scan-output/{audit_batch_id}

# 2. 检测项目框架（确定性）
python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/orchestration_helper.py" detect-framework --project-path .

# 3. 写入项目元数据 + 文件清单（编排器已有的枚举结果）
python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/index_db.py" write --batch-dir security-scan-output/{audit_batch_id} --data '{
  "phase": "phase1",
  "meta": {
    "framework": "{framework}",
    "file_count": "{fileCount}",
    "total_lines": "{totalLines}",
    "language": "{primaryLanguage}"
  },
  "table": "files",
  "rows": [{fileRows}]
}'

# 4. 脚本化 Sink grep（替代手动 Grep 循环）
python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/pattern_grep.py" grep-sinks \
  --batch-dir security-scan-output/{audit_batch_id} \
  --patterns-file "${CODEBUDDY_PLUGIN_ROOT}/resource/scan-data/sink-patterns.yaml" \
  --project-path .

# 5. 脚本化入口点检测
python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/pattern_grep.py" grep-entries \
  --batch-dir security-scan-output/{audit_batch_id} \
  --project-path .

# 6. 脚本化攻击面检测
python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/pattern_grep.py" grep-attack-surface \
  --batch-dir security-scan-output/{audit_batch_id} \
  --project-path .

# 7. 脚本化防御检测（基础）
python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/pattern_grep.py" grep-defenses \
  --batch-dir security-scan-output/{audit_batch_id} \
  --project-path .

# 8. 脚本化敏感信息检测
python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/pattern_grep.py" grep-secrets \
  --batch-dir security-scan-output/{audit_batch_id} \
  --project-path .

# 9. 写入框架隐式行为（编排器探索阶段检测到的）
python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/index_db.py" write --batch-dir security-scan-output/{audit_batch_id} --data '{
  "phase": "phase1",
  "table": "framework_behaviors",
  "rows": [{behaviorRows}]
}'

# 10. 标记 phase1 完成（触发增量扫描启动）
python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/index_db.py" write --batch-dir security-scan-output/{audit_batch_id} --data '{"phase":"phase1","phase_status":"completed"}'
```

> **脚本化优势**：步骤 4-8 由 `pattern_grep.py` 确定性执行（无 LLM 参与），结果直接写入 DB。
> 编排器无需手动构造 Grep 命令、解析输出、拼装 JSON、写入 DB，减少 5-8 个 LLM turns。

#### 1.2 启动 indexer Agent（从 indexer-步骤2 开始）

```
Task(indexer):
  prompt:
    构建项目语义索引（SQLite 数据库）。
    [batch-dir] security-scan-output/{audit_batch_id}
    [lspStatus] {lspStatus}
    [db-tool] ${CODEBUDDY_PLUGIN_ROOT}/scripts/index_db.py
    [ts-parser] ${CODEBUDDY_PLUGIN_ROOT}/scripts/ts_parser.py
    [memory-hints] {memory_hints_json}
    [structureCache] {structureCache_json}
    [scan-mode] deep
    {scope == "diff" ? "[scope] diff\n[changed-files] {changedCodeFiles}\n[related-files-limit] {limit}" : ""}
  max_turns: 30
  mode: bypassPermissions
```

indexer Agent 启动后检测到 indexer-步骤1 已由编排器完成（`phases.phase1 == "completed"`），自动跳过 indexer-步骤1，从 indexer-步骤2 开始执行：
- **indexer-步骤2**（AST 精化，双引擎）：tree-sitter 引导安装 + 批量解析持久化（persist）+ Sink AST 验证；结果缓存到 SQLite（ast_functions、ast_calls、ast_refined_sinks 等），后续阶段通过 cached-query 复用
- **indexer-步骤3**（LSP 语义精化）：端点精化、Sink 调用追踪、调用图构建、防御映射

---

## 阶段2: 扫描差异

### Light 模式: 编排器内联扫描

不启动独立 Agent，编排器在主窗口内执行：

1. **导出 indexer findings**（密钥/配置/CVE）：

```bash
python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/index_db.py" query --batch-dir security-scan-output/{audit_batch_id} --preset indexer-findings
```

2. **Sink 风险评估**：

```bash
python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/index_db.py" query --batch-dir security-scan-output/{audit_batch_id} --preset sinks-by-severity --limit 30
```

对 S1（critical 优先级）Sink 执行轻量分析：
- Read Sink 所在代码上下文（+/-20 行）
- 检查是否存在直接防御（参数化查询、白名单、编码等）
- 产出 finding（`sourceAgent: "light-inline"`，`confidence` 上限 90）

3. **合并结果**：

```bash
python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/merge_findings.py" merge-scan --batch-dir security-scan-output/{audit_batch_id} --extra-agents indexer-findings,light-inline
```

### Deep 模式: 三 Agent 并行扫描

#### 2.0 增量门控：根据 phase 状态渐进式启动扫描 Agent

扫描 Agent 依赖 indexer 产出的语义索引数据。编排器通过脚本检查 phase 状态，**渐进式启动** Agent：

```bash
# 脚本化门控检查（替代手动 SQL 查询和 if/else 判断）
python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/orchestration_helper.py" should-launch-agent \
  --batch-dir security-scan-output/{audit_batch_id} \
  --agent vuln-scan
# 返回: {"action": "launch|wait|already_run", "reason": "...", ...}
```

**Phase 与 Agent 启动对应关系**：

| Phase 完成 | 可启动的 Agent | 数据可用性 |
|-----------|---------------|----------|
| phase1 | vuln-scan, red-team | 有 coarse sink，但无 AST/LSP |
| phase1_5 | 触发已启动 agent 的 re-run | 有 AST 数据（精确行号+函数范围） |
| phase2 | logic-scan | endpoints/call_graph/defenses 可用 |
| phase2 | 触发所有 agent final re-run | LSP 数据完整，traceMethod=LSP |

**Re-run 机制**：

```bash
# 检查是否需要 re-run（检测 phase 更新）
python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/orchestration_helper.py" should-rerun-agent \
  --batch-dir security-scan-output/{audit_batch_id} \
  --agent vuln-scan
# 返回: {"action": "rerun|no_action|skip", "reason": "New data available: phase1 → phase1_5", "instruction": "rm agents/vuln-scan.json && relaunch"}
```

Re-run 时删除 agent 输出文件，让 agent 重新查询最新 DB 数据。每个 agent 最多 re-run 2 次。

**增量扫描时序**：

```
时间轴
│ phase1 完成
├─→ 启动 vuln-scan-v1 (phase1 sink)
├─→ 启动 red-team-v1 (phase1 数据)
│
│ phase1_5 完成
├─→ 检查 should-rerun-agent vuln-scan → rerun
├─→ 检查 should-rerun-agent red-team → rerun
├─→ vuln-scan-v2 (AST 数据)
├─→ red-team-v2 (AST 数据)
│
│ phase2 完成
├─→ 启动 logic-scan (endpoints 可用)
├─→ 检查 should-rerun-agent vuln-scan → rerun
├─→ 检查 should-rerun-agent red-team → rerun
├─→ vuln-scan-v3 (LSP 完整数据)
├─→ red-team-v3 (LSP 完整数据)
│
│ 所有 agent 完成
└─→ 启动验证流程
```

> **重要**：logic-scan 的 `min_phase` 为 `phase2`（依赖 endpoints 表），不在 phase1 时启动。
> vuln-scan 和 red-team 可在 phase1 启动，但产出的 findings 置信度上限为 90（Grep+Read fallback）。
> phase2 后的 final re-run 使 findings 获得 LSP 数据支持，置信度上限提升至 100。

#### 2.0a 进度监控

编排器通过脚本监控整体进度：

```bash
python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/orchestration_helper.py" summarize-progress \
  --batch-dir security-scan-output/{audit_batch_id}
# 返回: {"progress": "5/8", "progress_pct": 63, "next_actions": [...], ...}
```

`next_actions` 字段给出下一步操作建议（launch_agent / rerun_agent / start_verification / wait）。

#### 2.1 启动扫描 Agent（增量启动）

根据 2.0 的门控结果，分阶段启动 Agent。每个 Agent 在输出中记录 `metadata.index_phase`，供 re-run 判断使用：

```
Task(vuln-scan):
  prompt:
    执行 Source→Sink 数据流追踪漏洞审计（C1 注入类）。
    [batch-dir] security-scan-output/{audit_batch_id}
    [scan-mode] deep
    [db-tool] ${CODEBUDDY_PLUGIN_ROOT}/scripts/index_db.py
    [输出文件] agents/vuln-scan.json
    [index-phase] {current_phase}  # phase1 | phase1_5 | phase2
  max_turns: 25
  mode: bypassPermissions

Task(logic-scan):  # 仅在 phase2 完成后启动
  prompt:
    执行认证授权（C3）+ 业务逻辑（C7）安全审计。
    [batch-dir] security-scan-output/{audit_batch_id}
    [scan-mode] deep
    [db-tool] ${CODEBUDDY_PLUGIN_ROOT}/scripts/index_db.py
    [输出文件] agents/logic-scan.json
    [index-phase] {current_phase}
  max_turns: 25
  mode: bypassPermissions

Task(red-team):
  prompt:
    以红队视角执行 3 核心猎杀问题深度审计（Q1 自造轮子、Q2 异常路径、Q3 信任穿越）。
    [batch-dir] security-scan-output/{audit_batch_id}
    [scan-mode] deep
    [db-tool] ${CODEBUDDY_PLUGIN_ROOT}/scripts/index_db.py
    [输出文件] agents/red-team.json
    [index-phase] {current_phase}
  max_turns: 25
  mode: bypassPermissions
```

> **Agent 输出 metadata 要求**：每个 Agent 必须在 JSON 输出中包含 `metadata.index_phase` 字段：
> ```json
> {
>   "metadata": {
>     "index_phase": "phase1",  // 运行时的 phase 状态
>     "rerun_count": 0          // re-run 次数
>   },
>   "findings": [...]
> }
> ```
> 此字段使 `should-rerun-agent` 脚本能判断是否有新数据可用。

#### 2.2 等待期间前置工作 + 流式处理

启动 Agent 后，编排器执行前置工作（不空等）：

1. **导出 indexer findings**（密钥/配置/CVE 检测结果）：

```bash
python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/index_db.py" query --batch-dir security-scan-output/{audit_batch_id} --preset indexer-findings
```

2. **加载框架知识文件**（按技术栈）

3. **等待扫描 Agent 完成**：编排器通过检查 `security-scan-output/{audit_batch_id}/agents/` 目录下各 Agent 的 JSON 产物是否落盘来判断完成状态。

#### 2.3 续扫处理

对 `status: "partial"` 且有 `pendingSinks`/`pendingEndpoints` 的 Agent：
- vuln-scan：启动续扫实例（max_turns: 15），仅处理 `pendingSinks`
- logic-scan：启动续扫实例（max_turns: 12），仅处理 `pendingEndpoints`

#### 2.4 合并扫描结果

```bash
python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/merge_findings.py" merge-scan --batch-dir security-scan-output/{audit_batch_id} --extra-agents indexer-findings,vuln-scan,logic-scan,red-team
```

#### 2.5 WebSearch 情报增强（Deep 模式专属）

> Ref: `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/orchestration.md > WebSearch 情报增强`（完整场景、预算控制和降级策略见该节）

跳过条件：无 `webSearchCandidate: true` 的 CVE 条目且无 `auditDimension: "C7.7"` 的条目。

---

## 阶段3: 验证差异

> 完整验证流程：Ref `${CODEBUDDY_PLUGIN_ROOT}/references/workflows/verification.md`

本节仅列出 Light/Deep 两种模式在验证阶段的**策略差异**：

- **Light**：仅验证 Critical + High，编排器内联验证（代码存在性 + 基础防御检查），置信度上限 90
- **Deep**：验证全部 findings，5 层混合验证（脚本 3 层 + verifier Agent + 脚本评分 2 层），置信度上限 100

---

## 阶段4: 修复差异

| 维度 | Light | Deep |
|------|-------|------|
| 自动修复 | 受限（置信度上限 90，需满足门控条件） | 完整支持（confidence >= 90 可自动修复） |
| 报告生成输入 | `merged-scan.json`（无 `finding-*.json`，`generate_report.py` 自动 fallback） | `finding-*.json` + `summary.json`（由 `merge-verify` 生成） |
| 修复 finding 来源 | `merged-scan.json`（`confidence >= 90`，跳过 `challengeVerdict` 检查） | `score-results.json` 或 `agents/verifier-*.json`（完整资格检查） |

---

## 错误处理

### Light 模式

1. 基础探索失败 -> 终止审计，提示用户重试
2. 编排器内联分析异常 -> 基于已有 indexer findings 继续生成报告

### Deep 模式

1. **indexer 失败**：终止审计，提示用户重试
2. **扫描 Agent 失败**：检查 `agents/{agent-name}.json` 是否有部分产物，有则纳入合并
3. **verifier Agent 失败**：跳过该分片，使用脚本验证结果
4. **确定性脚本失败（score/quality）**：脚本失败不阻断流程，仍可生成报告

产物完整性检查（Deep 模式）：

```bash
python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/checkpoint_verify.py" verify-artifacts --batch-dir security-scan-output/{audit_batch_id} --agents vuln-scan,logic-scan,red-team
```

---

## 模式对比

| 维度 | Light（快速扫描） | Deep（深度扫描） |
|------|------------------|-----------------|
| 探索 | 基础探索（Grep/Glob） | 基础探索 + 编排器写入索引 DB + indexer 语义索引（indexer-步骤2 AST + indexer-步骤3 LSP） |
| tree-sitter 检测与安装 | 跳过 | 检测 + 自动安装 |
| LSP | 跳过 | 探活 + 语义追踪 |
| AST 精化 | 跳过 | indexer-步骤2 双引擎，结果持久化到 SQLite |
| 扫描 | 编排器内联 | vuln-scan + logic-scan + red-team 并行 |
| 验证 | 轻量验证 | 脚本验证（pre-check → chain-verify → challenge）+ verifier Agent + 脚本评分（score → quality） |
| WebSearch 情报增强 | 无 | 有（CVE 实时验证 + 0day 情报感知） |
| 置信度上限 | 90 | 100 |
| 自动修复 | 受限 | 完整支持 |
