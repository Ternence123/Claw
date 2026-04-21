# Security-Scan — 代码安全审计插件

一款智能代码安全审计工具，通过 **语义索引 + 多 Agent 并行扫描 + 对抗验证** 实现专业级漏洞发现。**新增安全门禁 + Git Hook 自动化**，实现从扫描到通知的全链路自动化。

---

## 工作原理

```
                          ┌──────── ③ 扫描 ────────┬──── ④ 验证 ─────┐
                          │                        │                 │
                          │  indexer ─▶┌───────────┐│  verifier      │
                          │  建索引    │ vuln-scan ││  攻击链验证     │
 ┌────────┐  ┌────────┐  │           │ logic-scan││  对抗审查 ─────┐│
 │ ①初始化 │─▶│ ②探索   │─┤  Deep     │ red-team  ││  过滤误报      ││
 └────────┘  └────────┘  │           └───────────┘│               ││  ┌──────────┐
  权限白名单   文件枚举     │            三路并行     │               ├┼─▶│ ⑤审计报告 │
  模式选择     技术栈识别   ├────────────────────────┼───────────────┤│  └──────────┘
  环境检测     危险函数定位  │                        │               ││   HTML 报告
                          │  Light                 │               ││   修复建议
                          │  编排器内联扫描(Grep)    │  轻量验证 ────┘│   置信度评分
                          │                        │                │
                          └────────────────────────┴────────────────┘

### 扫描 Agent 分工

三个扫描 Agent **并行工作，各看不同维度**，不重复：

**vuln-scan — 追踪数据流**
> 从用户输入（Source）追踪到危险函数（Sink），发现数据流上的安全漏洞。

**logic-scan — 审查业务逻辑**
> 遍历每个 API 端点，检查权限是否完整、业务逻辑是否安全。

**red-team — 挖掘 0day 线索**
> 以攻击者视角，专挖前两个 Agent 覆盖不到的深层风险区域——这些正是 0day 漏洞最常出现的土壤。
> 三个聚焦方向：
> - **自造轮子**：自己实现加密/解析/鉴权而非用成熟库 → 高概率存在缺陷
> - **异常路径**：错误处理导致安全检查被跳过、权限状态不一致 → 传统测试最大盲区
> - **信任穿越**：内部 API 无认证暴露、微服务间盲信、第三方回调无验签

---

## 两种模式

| | Light（快速） | Deep（深度） |
|---|---|---|
| **耗时** | 5-10 分钟 | 20-40 分钟 |
| **适用** | 日常开发、CI/CD、初筛 | 发布前审计、安全评审 |
| **扫描方式** | 编排器内联（Grep/Glob） | 3 Agent 并行 + 语义追踪 |
| **验证深度** | 代码存在性 + 基础防御检查 | 脚本 3 层 + LLM 验证 + 评分 2 层 |
| **升级** | 扫完可一键升 Deep | — |

> 不确定选哪个？**先 Light，再按需升级 Deep。**

---

## 使用方式

**全项目扫描：**
```
/security-scan:project [--scan-level light|deep] [--include *.py,*.js] [--exclude node_modules]
```

**Git 增量扫描：**
```
/security-scan:diff [--commit <hash>] [--scan-level light|deep] [--mode staged|unstaged|all]
```

**自动模式（无人值守）：**
```
/security-scan:diff --commit HEAD --scan-level light --auto
```

> `--auto` 模式跳过所有交互，自动执行扫描、验证、门禁评估和通知。**安全红线**：绝不自动修复代码。

---

## 安全门禁配置

执行 `/security-scan:setup` 配置门禁通知，支持企业微信机器人告警。

### 分层配置架构

| 层级 | 路径 | 内容 | Git 提交 |
|------|------|------|---------|
| **用户级** | `~/.codebuddy/security-scan/config.json` | Webhook URL 等个人配置 | 不提交 |
| **项目级** | `.codebuddy/security-scan/config.json` | 门禁模式、auto_scan 等项目配置 | 可提交 |

合并规则：项目级 > 用户级 > 内置默认值。

### 配置流程

**首次配置**：
1. 执行 `/security-scan:setup`
2. 粘贴企业微信群机器人 Webhook URL（格式：`https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx`）
3. 自动发送测试消息验证配置

**获取 Webhook URL**：
1. 打开企业微信群 → 右上角"..." → 群机器人 → 添加机器人
2. 设置机器人名称（如"安全门禁告警"）
3. 创建后复制 Webhook URL

### 门禁模式

| 模式 | 行为 |
|------|------|
| `warn`（告警） | 发现问题时仅提醒，不阻断操作 |
| `strict`（严格） | 发现问题时强提醒，push 前二次确认 |

### 通知时机

| 配置值 | 触发场景 |
|--------|---------|
| `on_scan` | 扫描完成且门禁不通过时通知 |
| `on_push` | git push 前检测到门禁告警时通知 |
| `both` | 两者都通知 |

### 自动扫描

启用后，每次 `git commit` 成功自动触发 Light 模式增量扫描：

```json
// .codebuddy/security-scan/config.json（项目级）
{
  "version": "1.0",
  "gate_mode": "warn",
  "auto_scan": {
    "enabled": true,
    "scan_level": "light"
  }
}
```

---

## ⚠️ 初始化关键点

### 1. 权限白名单 — 必须配置

首次运行会弹出权限白名单配置确认，**请选择「确认配置」**。

| | 不配置 | 配置后 |
|---|---|---|
| 授权弹窗 | ~100 次/扫描 | ~8 次/扫描 |
| 体验 | 频繁中断 | 基本无感 |

> 白名单仅覆盖插件自身脚本和只读操作，**不涉及项目源码修改**。修复操作仍需逐次确认。
>
> 配置写入 `.codebuddy/settings.json`（项目级），团队可通过 Git 共享。

### 2. Deep 模式的可选依赖

以下依赖**缺失不影响扫描**，仅影响精度，插件会自动降级：

| 依赖 | 用途 | 缺失时 |
|------|------|--------|
| **tree-sitter** | 精确 AST 解析 | 降级为内置正则解析 |
| **LSP 服务器** | 跨文件语义追踪 | 降级为 Grep+Read |


### 3. 环境要求

| 依赖 | 要求 |
|------|------|
| CodeBuddy| 最新版本 |
| Python 3 | 3.8+ |
| Git | 任意版本 |

---

## 扫描产物

输出目录：`security-scan-output/{batch_id}/`

| 文件 | 说明 |
|------|------|
| `project-index.db` | 语义索引数据库 |
| `merged-scan.json` | 合并后的扫描结果 |
| `summary.json` | 验证后摘要 |
| `security-scan-report.html` | **HTML 审计报告**（自动生成） |
| `poc-scripts.py` | **POC 验证脚本**（独立可执行，详见下方） |
| `poc-manifest.json` | POC 清单（验证方式、端点信息） |
| `agents/*.json` | 各 Agent 产物 |

### POC 验证

审计完成后自动生成 `poc-scripts.py`，可对目标服务发送实际探测请求验证漏洞：

```bash
# 基本用法：配置目标地址即可运行
python3 security-scan-output/{batch_id}/poc-scripts.py --base-url http://your-target:8080

# 带认证凭据
python3 security-scan-output/{batch_id}/poc-scripts.py --base-url http://your-target:8080 \
  --cookie "session=abc123" --header "Authorization: Bearer <token>"

# 仅验证指定漏洞
python3 security-scan-output/{batch_id}/poc-scripts.py --base-url http://your-target:8080 --finding f-001

# 输出结果到文件
python3 security-scan-output/{batch_id}/poc-scripts.py --base-url http://your-target:8080 --output poc-results.json
```

> POC 脚本仅发送探测性请求，不执行破坏性操作。建议在测试环境中运行。仅需 `requests` 库（`pip install requests`）。

---

## 常见问题

**Q: 授权弹窗太多？**
→ 配置权限白名单。参考 `resource/permissions-allowlist.yaml` 底部示例，复制到 `.codebuddy/settings.json`。

**Q: Light 还是 Deep？**
→ 日常用 Light（快），发布前用 Deep（全）。不确定就先 Light，扫完可升级。

**Q: tree-sitter / LSP 安装失败？**
→ 不影响扫描，自动降级。如需完整能力：tree-sitter 用 venv 安装，LSP 安装后重启 CodeBuddy。

**Q: 扫描中断了？**
→ 部分 Agent 失败不影响整体，编排器会合并已有产物继续后续流程。

---

## 更多信息

- 版本更新日志：[CHANGELOG.md](./CHANGELOG.md)
- 权限白名单详情：`resource/permissions-allowlist.yaml`
- 自定义规则：将 YAML 文件放入 `resource/custom/` 目录
