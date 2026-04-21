# ConnectorsConfig 说明

本仓库用于维护各个 connector 的配置。所有 connector 统一放在 `connectors/` 目录下，每个 connector 一个子目录；并通过 `.codebuddy-connector/connectors.json` 维护总索引。每个 connector 目录至少包含：

- `mcp.json`：MCP Server 连接配置
- `skills/`：标准 skill 目录（最小可只包含 `SKILL.md`，也可按标准扩展 `references/`、`scripts/` 等文件）

> 当前 CI（`.cnb.yml`）会在 `main` 分支 `push` 后打包整个仓库并上传到 COS。

---

## 目录约定

```text
ConnectorsConfig/
├── .cnb.yml
├── README.md
├── .codebuddy-connector/
│   └── connectors.json
└── connectors/
    └── <connector-name>/
        ├── mcp.json
        └── skills/
            ├── SKILL.md
            ├── references/         # 可选
            │   └── *.md
            └── scripts/            # 可选
                └── *
```

- `<connector-name>` 建议使用小写英文，必要时用连字符（kebab-case）。
- 一个 connector 一个目录，便于独立维护与回滚。
- `source` 字段与目录映射规则：`source = <connector-name>`，对应 `connectors/<source>/`。
- `skills/` 目录遵循标准 skill 结构；你给的示例属于最小形态（仅 `SKILL.md`）。
- 所有 connector 统一维护在 `connectors/` 目录下。

---

## 新增一个 connector（示例：qq）

### 1) 创建目录

```bash
mkdir -p connectors/qq/skills
```

### 2) 新建 `connectors/qq/mcp.json`

用于声明 connector 对应的 MCP Server。

```json
{
  "mcpServers": {
    "qq_connector": {
      "timeout": 600,
      "url": "https://example.com/qq/mcp/sse"
    }
  }
}
```

字段建议：
- `mcpServers`：MCP 服务配置
- `qq_connector`：服务标识（建议唯一、可读）
- `timeout`：超时时间（秒）
- `url`：MCP 服务地址（SSE 场景）


### 3) 新建 `connectors/qq/skills/`（最小示例：仅 `SKILL.md`）

`skills/` 建议按标准 skill 结构组织。最小可用示例只放一个 `SKILL.md`；如果能力复杂，可再增加 `references/`、`scripts/` 等文件。

下面是最小示例的 `connectors/qq/skills/SKILL.md`：

```markdown
---
name: qq
description: "Use QQ connector to access QQ-related MCP capabilities. Invoke this skill when users need QQ connector operations and related MCP data access."
description_zh: "通过 QQ Connector 调用 MCP 能力"
description_en: "Use QQ Connector MCP capabilities"
version: 1.0.0
allowed-tools: Read,Write,Bash
---

# QQ Connector Skill

## 适用场景
- 需要通过 QQ connector 访问 MCP 服务
- 需要执行该 connector 支持的查询或操作

## 使用说明
1. 确保 `../mcp.json` 配置正确
2. 根据能力说明调用对应功能

## 注意事项
- 配置变更后先做格式校验
- 保持描述字段与实际能力一致
```

### 4) 更新 `.codebuddy-connector/connectors.json`

新增 connector 后，必须同步追加索引项（示例）：

```json
{
  "name": "qq",
  "description": "Use QQ connector to access QQ-related MCP capabilities.",
  "description_zh": "通过 QQ Connector 调用 MCP 能力",
  "description_en": "Use QQ Connector MCP capabilities",
  "source": "qq"
}
```

---

## 提交前检查

### 配置校验

```bash
jq . connectors/qq/mcp.json
jq . .codebuddy-connector/connectors.json
```

检查点：
- JSON 格式合法
- `mcpServers` 键存在
- 服务标识命名清晰
- 地址与超时配置正确

### 文档校验

- `skills/` 至少包含 `SKILL.md`（如有需要可包含 `references/`、`scripts/`）
- `name/description/description_zh/description_en` 齐全
- 描述和 connector 实际能力一致

---

## CI 上传逻辑（当前仓库）

`.cnb.yml` 逻辑概要：

1. 在 `main` 分支发生 `push` 时触发
2. 使用 `python:3.11-slim` 镜像
3. 安装 `zip` 与 `coscmd`
4. 打包仓库为 `dist/connectors-config.zip`
5. 分别上传到：
   - 海外 COS（`cos-sg.yaml`）
   - 国内 COS（`cos.yaml`）

目标路径变量：
- `COS_PATH: /connectors-config/`

---

## 建议实践

- 每个 connector 独立目录，避免跨目录耦合
- 配置字段尽量稳定，减少下游兼容成本
- 修改 connector 时同步更新 `skills/SKILL.md` 描述
- 优先增量变更，便于审阅与回滚
