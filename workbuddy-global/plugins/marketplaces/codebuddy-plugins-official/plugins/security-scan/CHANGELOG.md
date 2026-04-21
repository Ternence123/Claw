# 版本更新日志

本文档记录 Security-Scan 插件的版本变更历史。

---

## v3.4.1（2026-04-10）

### 安全门禁 + Git Hook 自动化

> 分层配置架构 + 自动扫描模式 + Push 门禁告警，实现从扫描到通知的全链路自动化。

- **分层配置**：用户级（`~/.codebuddy/security-scan/config.json`）+ 项目级（`.codebuddy/security-scan/config.json`），项目级 > 用户级 > 默认值
- **自动扫描**：`/security-scan:diff --auto` 无人值守模式，跳过所有交互，绝不自动修复代码
- **Git Hook**：`git commit` 后自动触发扫描，`git push` 前检查门禁状态并告警通知
- **通知增强**：`--source` 区分 scan / hook-auto / push 三种来源，匹配 `on_scan` / `on_push` / `both` 触发策略
- **setup 重构**：简化 `/security-scan:setup` 配置流程，分层写入用户级通知 + 项目级门禁策略

---

## v3.3.0（2026-04-07）

### POC 验证脚本输出

> 验证阶段完成后自动生成可独立执行的 POC 验证脚本，支持用户配置目标地址和凭据后对实际服务发送探测性请求验证漏洞。

**核心改动**：

#### 1. 新增 `scripts/poc_generator.py`

POC 验证脚本生成器，两个子命令：
- `generate`：读取审计结果，为每个漏洞生成 POC 函数，输出 `poc-scripts.py`（独立可执行）+ `poc-manifest.json`（清单）
- `run`：通过子进程执行 `poc-scripts.py`，收集验证结果

支持 11 种漏洞类型的专用 POC 模板（SQL 注入、XSS、命令注入、SSRF、路径遍历、IDOR、开放重定向、XXE、CSRF、硬编码密钥、不安全配置）+ 通用 fallback 模板。

#### 2. 字段归一化扩展

- `_common.py` 的 `normalize_finding()` 增加 `pocMethod`/`pocRequestType` 字段归一化
- `to_report_format()` 增加 POC 字段保留

#### 3. 报告集成

- `generate_report.py` 的 JSON 报告 `issue_entry` 增加 `pocMethod`/`pocRequestType` 字段
- HTML 报告 issue 卡片增加「POC 验证方式」展示区域（位于调用链和风险代码之间）

#### 4. 流程集成

- `verification.md` 新增 Stage 6（POC 脚本生成）
- `post-audit.md` 在报告生成前增加 POC 生成步骤
- `project.md` / `diff.md` 编排器更新阶段4执行顺序
- `output-schemas.md` 目录结构增加 `poc-scripts.py` / `poc-manifest.json` / `poc-results.json`

#### 5. 使用方式

```bash
# 自动生成（审计流程中自动执行）
python3 poc_generator.py generate --batch-dir security-scan-output/{batch}

# 用户手动验证
python3 security-scan-output/{batch}/poc-scripts.py --base-url http://target:8080
python3 security-scan-output/{batch}/poc-scripts.py --base-url http://target:8080 --cookie "session=abc" --header "Authorization: Bearer <token>"
```

---

## v3.2.0（2026-03-25）

### 5 Agent 专业化架构 + 混合验证

> 5 Agent 专业化架构（indexer + vuln-scan + logic-scan + red-team + verifier）配合确定性脚本验证，兼顾扫描深度与验证效率。

**核心改动**：

#### 1. 5 Agent 专业化分工

| Agent | 职责 |
|-------|------|
| indexer | 构建项目语义索引（SQLite） |
| vuln-scan | C1 注入类 Source→Sink 数据流追踪 |
| logic-scan | C3 授权 + C7 业务逻辑审计 |
| red-team | 3 核心问题（Q1 自造轮子/Q2 异常路径/Q3 跨边界信任） |
| verifier | LLM 深度验证（攻击链 + 对抗审查） |

#### 2. 混合验证架构

5 层验证流水线：
- **Stage 1-3（脚本）**：pre-check → chain-verify → challenge（零 LLM turns）
- **Stage 4（LLM）**：verifier Agent 深度验证，支持按 sourceAgent 并行分片（verifier-vuln / verifier-logic / verifier-redteam）
- **Stage 5（脚本）**：score + quality（零 LLM turns）

---

## v3.1.6（2026-03-24）

### 缓存增量漏检修复：content_hash 变更检测 + 防御过期清理

> 修复 Light 模式缓存命中时，已有文件中新增的 Sink/入口点被跳过的漏检风险，并增加防御过期标注防止历史防御信息误导分析。

**改动**：

- **`commands/project.md`**：步骤 1.2 缓存命中逻辑重构——增量文件检查增加 `content_hash` 比对，Sink/入口点检测扩展为「新增 + 内容变更文件」
- **`agents/indexer.md`**：Phase 1 缓存加速同步上述变更
- **`scripts/index_db.py`**：`known_defenses` 表新增 `last_confirmed`/`stale` 字段，`memory-sync` 增加过期清理

---

## 早期版本摘要

| 版本 | 日期 | 要点 |
|------|------|------|
| v3.1.5 | 2026-03-23 | 长期记忆扩展：项目结构缓存持久化到 `project-memory.db` |
| v3.1.4 | 2026-03-23 | 移除伪控制预算体系；merge_findings.py 修复；Grep+Read 上限 75→90 |
| v3.1.3 | 2026-03-23 | 全局逻辑审查；shared-initialization.md 抽取；双引擎 AST 架构 |
| v3.1.1 | 2026-03-23 | 内置 AST 精化集成（ts_parser.py）；indexer Phase 1.5 |
| v3.1.0 | 2026-03-23 | Light/Deep 双模式扫描架构；Reference 文件大幅精简 |
| v3.0.0 | 2026-03-22 | 架构重构：SQLite 语义索引 + 并行审计；5 Agent 体系建立 |
| v2.x | 2026-03 | 初始架构迭代：6 Agent → 分级扫描 → 断点恢复 → Critical 级别 |

> 完整历史变更详见 git log。
