---
description: 配置安全门禁通知渠道和自动扫描设置。交互式引导用户依次完成通知配置和自动扫描配置。
allowed-tools: Read, Write, Bash, AskUserQuestion
---

# 安全门禁配置

> 所有面向用户的输出使用**简体中文**。禁止使用 emoji。JSON 字段名保持英文。

---

## 概述

本命令引导用户**依次**完成两项配置：

| 步骤 | 说明 |
|------|------|
| **步骤 1: 通知配置** | 配置企业微信 Webhook 通知渠道 |
| **步骤 2: 自动扫描配置** | 配置 git commit 后自动扫描的开关和扫描模式 |

每个步骤均可跳过，全部完成后统一写入配置文件。

配置采用**分层架构**：

| 层级 | 路径 | 内容 | Git 提交 |
|------|------|------|---------|
| **用户级** | `~/.codebuddy/security-scan/config.json` | Webhook URL 等个人配置 | 不提交 |
| **项目级** | `.codebuddy/security-scan/config.json` | 门禁模式、auto_scan 等项目配置 | 可提交 |

合并规则：项目级 > 用户级 > 内置默认值。

---

## 步骤 0: 加载现有配置

```bash
# 用户级
ls ~/.codebuddy/security-scan/config.json 2>/dev/null
# 项目级
ls .codebuddy/security-scan/config.json 2>/dev/null
```

如果**任一**配置文件已存在，标记为**已有配置**（后续各步骤进入 Flow B）；否则标记为**首次配置**（后续各步骤进入 Flow A）。

---

## 步骤 1+2: 一次性配置（多标签页）

根据步骤 0 的结果，进入 Flow A 或 Flow B。使用多问题 `AskUserQuestion` 一次展示所有配置项，用户通过顶部标签页（← →）切换，最后一次 Submit 提交。

### Flow A: 首次配置

首次配置直接进入 Webhook URL 输入。这样可以避免先选"配置企业微信通知"后仍需点击 `Submit` 才进入下一步的问题。

```
AskUserQuestion:
  questions:
    - header: "通知配置"
      question: |
        [1/2] 配置企业微信通知

        请直接粘贴企业微信群机器人 Webhook URL（格式:
        https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx）

        也可从下方选项中选择操作。
      options:
        - label: "获取方式"
          description: "了解如何获取企业微信群机器人 Webhook URL"
        - label: "跳过"
          description: "跳过通知配置，使用默认设置（后续可通过 /security-scan:setup 修改）"

    - header: "自动扫描"
      question: |
        [2/2] 配置 git commit 后的自动扫描功能

        当前默认设置:
          自动扫描: 已启用
          扫描模式: Light（快速扫描）

        请选择操作：
      options:
        - label: "使用默认配置"
          description: "启用自动扫描，使用 Light 模式（推荐日常开发使用）"
        - label: "修改扫描模式"
          description: "将扫描模式切换为 Deep 深度扫描"
        - label: "关闭自动扫描"
          description: "关闭 git commit 后的自动扫描功能"
```

**处理逻辑**：

Submit 后同时获得两个标签页的答案，分别处理：

**通知配置标签页**：

- **选择 `跳过`** → 使用默认配置（notification.enabled = false）。
  > 注意："跳过"仅跳过通知渠道，auto_scan 等其他配置项仍按默认值写入。

- **选择 `获取方式`** → 输出获取指引后，**单独重新展示通知配置问题**（单问题模式）：
  ```
  获取企业微信群机器人 Webhook URL:
    1. 打开企业微信群 → 右上角"..." → 群机器人 → 添加机器人
    2. 设置机器人名称（如"安全门禁告警"）
    3. 创建后复制 Webhook URL
  ```

- **通过 Other 输入内容** → 作为 Webhook URL 处理，验证格式：
  - 必须以 `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=` 开头
  - key 参数不能为空
  - 格式不正确时提示并**单独重新展示通知配置问题**

  验证通过后，自动发送测试消息：

  > **注意**：`setup` 是 command（非 agent），框架**不会**自动注入 `CODEBUDDY_PLUGIN_ROOT` 环境变量。
  > 执行 Bash 调用前，必须先用 Glob 工具搜索 `**/security-scan/.codebuddy-plugin/plugin.json` 定位插件根目录，
  > 取 `plugin.json` 路径去掉尾部 `/.codebuddy-plugin/plugin.json` 即为插件根目录绝对路径，记为 `CODEBUDDY_PLUGIN_ROOT`。
  > 然后使用 `export CODEBUDDY_PLUGIN_ROOT="<路径>" && python3 "${CODEBUDDY_PLUGIN_ROOT}/scripts/gate_reminder.py"` 调用脚本。
  > Glob 无结果时，输出错误提示并终止（同 `initialization.md > 解析失败处理`）。

  ```bash
  python3 "<gate_reminder.py 的绝对路径>" test \
    --webhook-url "<用户输入的URL>"
  ```

  - 成功 → "测试消息发送成功，请在企业微信群中确认是否收到。"
  - 失败 → 显示错误信息，提供"重新输入 URL / 保存当前 URL（跳过测试）"选项。选择跳过测试时，仍保存用户输入的 URL 并设置 notification.enabled = true。

**自动扫描标签页**：

- **选择 `使用默认配置`** → 设置 `auto_scan.enabled = true, auto_scan.scan_level = "light"`。

- **选择 `修改扫描模式`** → 进入「扫描模式选择」（单独追问）。

- **选择 `关闭自动扫描`** → 设置 `auto_scan.enabled = false`。

两个标签页的答案均处理完毕后 → 进入**写入配置**。

### Flow B: 更新配置

读取现有配置，展示当前状态。

Webhook URL 脱敏：仅显示前 60 字符 + `...`。

根据当前 `auto_scan.enabled` 的值，动态生成自动扫描标签页的选项：

**当自动扫描已启用时**：

```
AskUserQuestion:
  questions:
    - header: "通知配置"
      question: |
        [1/2] 更新企业微信通知配置

        当前配置:
          Webhook: {masked_url}
          状态: {notification.enabled ? "已启用" : "已关闭"}

        请直接粘贴新的企业微信群机器人 Webhook URL（格式:
        https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx）

        也可从下方选项中选择操作。
      options:
        - label: "发送测试消息"
          description: "使用当前 Webhook URL 发送一条测试消息，验证配置是否有效"
        - label: "关闭通知"
          description: "关闭企业微信通知（保留 URL 配置，后续可重新启用）"
        - label: "跳过"
          description: "不修改通知配置"

    - header: "自动扫描"
      question: |
        [2/2] 更新自动扫描配置

        当前配置:
          状态: 已启用
          扫描模式: {scan_level == "deep" ? "Deep（深度扫描）" : "Light（快速扫描）"}

        请选择扫描模式或其他操作：
      options:
        - label: "Light 快速扫描"
          description: "5-10 分钟，编排器内联扫描，适用于日常开发和 CI/CD{scan_level == 'light' ? '（当前）' : ''}"
        - label: "Deep 深度扫描"
          description: "20-40 分钟，3 Agent 并行 + 语义追踪，适用于发布前审计和安全评审{scan_level == 'deep' ? '（当前）' : ''}"
        - label: "关闭自动扫描"
          description: "关闭 git commit 后的自动扫描功能"
        - label: "跳过"
          description: "不修改自动扫描配置"
```

**当自动扫描已关闭时**：

```
AskUserQuestion:
  questions:
    - header: "通知配置"
      question: |
        （同上，通知配置标签页内容不变）
      options:
        （同上）

    - header: "自动扫描"
      question: |
        [2/2] 更新自动扫描配置

        当前配置:
          状态: 已关闭

        请选择操作：
      options:
        - label: "启用自动扫描"
          description: "启用 git commit 后的自动扫描功能"
        - label: "跳过"
          description: "不修改自动扫描配置"
```

**处理逻辑**：

Submit 后同时获得两个标签页的答案，分别处理：

**通知配置标签页**：

- **选择 `发送测试消息`** → 使用当前配置中的 Webhook URL 执行测试，复用 Flow A 的测试逻辑（注意脚本路径定位方式，见 Flow A 中的注意事项）。

- **选择 `关闭通知`** → 设置 `notification.enabled: false`，保留其他配置（方便后续重新启用）。

- **选择 `跳过`** → 不修改通知配置。

- **通过 Other 输入内容** → 作为新 Webhook URL 处理，复用 Flow A 的 URL 验证与测试流程（注意脚本路径定位方式，见 Flow A 中的注意事项）。

**自动扫描标签页**：

- **选择 `Light 快速扫描`** → 设置 `auto_scan.scan_level = "light"`, `auto_scan.enabled = true`。

- **选择 `Deep 深度扫描`** → 设置 `auto_scan.scan_level = "deep"`, `auto_scan.enabled = true`。

- **选择 `关闭自动扫描`** → 设置 `auto_scan.enabled = false`。

- **选择 `启用自动扫描`** → 进入「扫描模式选择」（单独追问）。

- **选择 `跳过`** → 不修改配置。

两个标签页的答案均处理完毕后 → 进入**写入配置**。

### 扫描模式选择

当用户需要选择扫描模式时（从"修改扫描模式"或"启用自动扫描"进入），单独追问：

```
AskUserQuestion:
  header: "扫描模式"
  question: |
    请选择扫描模式：
  options:
    - label: "Light 快速扫描"
      description: "5-10 分钟，编排器内联扫描，适用于日常开发和 CI/CD（推荐）"
    - label: "Deep 深度扫描"
      description: "20-40 分钟，3 Agent 并行 + 语义追踪，适用于发布前审计和安全评审"
```

- **选择 `Light 快速扫描`** → 设置 `auto_scan.scan_level = "light"`
- **选择 `Deep 深度扫描`** → 设置 `auto_scan.scan_level = "deep"`

设置完成后 → 进入**写入配置**。

---

## 默认配置值

首次配置自动使用以下默认值，无需逐项询问（用户在各步骤中修改的值会覆盖对应默认值）：

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `gate_mode` | `"warn"` | 告警模式，发现问题仅提醒不阻断 |
| `notification.trigger` | `"on_scan"` | 扫描完成且门禁不通过时通知 |
| `auto_scan.enabled` | `true` | git commit 后自动触发 Light 增量扫描 |
| `auto_scan.scan_level` | `"light"` | 自动扫描使用 Light 模式 |

---

## 写入配置

### 分层写入

**用户级** `~/.codebuddy/security-scan/config.json`：
```json
{
  "version": "1.0",
  "configuredAt": "<ISO8601>",
  "notification": {
    "enabled": true,
    "channel": "wecom",
    "webhook_url": "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx",
    "trigger": "on_scan"
  }
}
```

**项目级** `.codebuddy/security-scan/config.json`：
```json
{
  "version": "1.0",
  "configuredAt": "<ISO8601>",
  "gate_mode": "warn",
  "auto_scan": {
    "enabled": true,
    "scan_level": "light"
  }
}
```

### 写入步骤

1. 确保 `~/.codebuddy/security-scan/` 和 `.codebuddy/security-scan/` 目录存在
2. 将通知相关配置写入用户级文件
3. 将门禁策略和自动扫描配置写入项目级文件
4. 如果是更新配置（Flow B），仅更新本次修改的字段，保留未修改的现有配置

### 配置完成输出

```
安全门禁配置完成。

  模式: 告警模式
  自动扫描: {auto_scan.enabled ? "已启用" : "已关闭"}（{auto_scan.scan_level == "deep" ? "Deep" : "Light"}）
  通知渠道: {notification.enabled ? "企业微信机器人" : "未配置"}
  通知时机: {notification.enabled ? "扫描完成后" : "-"}

配置文件:
  用户级: ~/.codebuddy/security-scan/config.json
  项目级: .codebuddy/security-scan/config.json

后续可通过 /security-scan:setup 随时修改配置。
```

---

## 错误处理

- Webhook URL 格式不合法 → 重新询问
- 测试消息发送失败 → 提供"重新输入 URL / 保存当前 URL（跳过测试）"选项
- 目录不存在 → 自动创建
- 配置文件写入失败 → 显示错误并提示手动创建
