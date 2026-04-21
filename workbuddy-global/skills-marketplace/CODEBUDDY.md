# Skill Marketplace 项目标准

本文档定义了在 Skill Marketplace 中添加、维护和管理技能的标准和规范。

## 日间分支规范

**晚上 9 点（21:00）前，禁止向 main 分支推送。** 白天所有操作在日间维护分支上进行，晚间手动合入 main。

- **分支命名**: `daywork/<YYYY-MM-DD>`（如 `daywork/2026-04-16`）
- **操作规则**:
  - 白天（00:00–20:59）所有 commit、push 都在 `daywork/` 分支上
  - 晚上 21:00 后，用户手动将 `daywork/` 合并并推送 main
  - 合并方式：`git checkout main && git merge daywork/<date> && git push`
  - 如果当天没有日间分支，创建时从最新 main 拉出
- **白天 push main 拦截**: 晚上 9 点前，如果用户要求推送 main 分支，必须强提醒：

  > ⚠️ 现在是白天（21:00 前），按规范不应推送 main 分支。当前工作应在 `daywork/<date>` 上进行。是否确认例外推送？

  用户明确确认后方可执行。

## 项目概览

- **项目名称**: CodeBuddy Skill Marketplace（官方技能市场）
- **项目描述**: CodeBuddy 官方技能库，存储和管理所有官方认可的技能
- **远程仓库**: https://cnb.woa.com/genie/skill-marketplace
- **默认分支**: main

## 目录结构

```
skill-marketplace/
├── .codebuddy-skill/
│   └── marketplace.json          # 核心：技能市场清单
├── .gitignore                    # Git 配置
├── skills/                       # 技能库目录
│   ├── skill-1/
│   │   ├── SKILL.md             # 必需：技能定义文件
│   │   ├── references/          # 可选：参考文档
│   │   │   ├── guide.md
│   │   │   └── examples.md
│   │   └── scripts/             # 可选：辅助脚本
│   │       └── setup.py
│   └── skill-2/
│       └── SKILL.md
├── README.md                     # 项目说明
├── skills-standard.md            # 技能开发标准文档
└── CODEBUDDY.md                  # 本文件：项目管理标准
```

## 添加新技能的完整流程

### 第一步：创建技能目录结构

1. **在 `skills/` 目录中创建新目录**
   ```bash
   mkdir skills/my-new-skill
   ```

2. **目录名称规范**
   - 使用小写字母和连字符（kebab-case）
   - 例如：`apple-notes`、`skill-creator`、`xiaohongshu`
   - 避免使用下划线、大写字母、特殊字符

### 第二步：创建必需文件 SKILL.md

**位置**: `skills/my-new-skill/SKILL.md`

**文件结构**：

```markdown
---
name: skill-identifier
description: "Detailed description for AI to determine when to invoke this skill. Include trigger scenarios, CLI tool names, and use conditions."
description_zh: "简短中文描述（给人看，25-35字）"
description_en: "Short English description (for humans, 60-80 chars)"
version: 1.0.0
homepage: https://example.com
allowed-tools: Read,Write,Bash
metadata:
  clawdbot:
    emoji: 🔧
    requires:
      bins:
        - required-command
    install:
      - package-manager: brew
        command: "brew install required-command"
---

# 技能标题

技能的详细文档内容...
```

**Frontmatter 字段说明**：

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `name` | string | 否 | 技能标识符（默认使用目录名），用于市场清单中的 `name` 字段 |
| `description` | string | 是 | **给 AI 看的详细描述**（英文），用于 AI 判断何时调用此技能。需包含触发场景、CLI 工具名、使用条件等，50-200 字符 |
| `description_zh` | string | 是 | **给人看的中文短描述**，用于 UI 列表展示，25-35 个中文字符 |
| `description_en` | string | 是 | **给人看的英文短描述**，用于 UI 列表展示，60-80 个英文字符 |
| `version` | string | 否 | 语义版本号（如 1.0.0、2.1.1） |
| `homepage` | string | 否 | 技能或相关工具的官方网站 |
| `allowed-tools` | string | 否 | 允许使用的工具列表，逗号分隔（如 `Read,Write,Bash,Grep`) |
| `metadata` | object | 否 | 扩展元数据，用于集成系统（如 clawdbot） |

**三个描述字段的定位**：

| 字段 | 受众 | 用途 | 内容风格 |
|------|------|------|----------|
| `description` | AI | AI 判断何时调用此技能 | 详细、完备，包含触发场景、工具名、使用条件 |
| `description_zh` | 人（中文用户） | UI 列表展示 | 简短、一目了然 |
| `description_en` | 人（英文用户） | UI 列表展示 | 简短、一目了然 |

**字段顺序**：`name` → `description` → `description_zh` → `description_en` → 其他字段

**Metadata 字段详解**：

```yaml
metadata:
  clawdbot:                    # clawdbot 特定集成
    emoji: 🔧                  # UI 中显示的表情符号
    requires:                  # 依赖项
      bins:                    # 需要的命令行工具列表
        - tool-name
        - another-tool
    install:                   # 安装说明
      - package-manager: brew
        command: "brew install tool-name"
      - package-manager: apt
        command: "apt-get install tool-name"
```

**Markdown 内容规范**：

- 使用清晰的标题结构（# 主标题，## 二级标题等）
- 提供实际的使用示例和代码块
- 说明 `allowed-tools` 中的每个工具如何使用
- 包含快速开始、配置、故障排除等常见部分

### 第三步：可选的参考文档

**位置**: `skills/my-new-skill/references/`

适用于复杂技能，需要额外的详细文档：

```
skills/my-new-skill/
├── SKILL.md
└── references/
    ├── configuration.md      # 配置指南
    ├── examples.md          # 使用示例
    ├── api-reference.md     # API 参考
    └── troubleshooting.md   # 故障排除
```

### 第四步：可选的脚本和工具

**位置**: `skills/my-new-skill/scripts/`

适用于需要执行脚本或包含工具的技能：

```
skills/my-new-skill/
├── SKILL.md
├── references/
└── scripts/
    ├── setup.py            # Python 脚本
    ├── install.sh          # Shell 脚本
    └── config.json         # 配置文件
```

**最佳实践**：
- 脚本应该有清晰的文档注释
- 提供使用示例
- 在 SKILL.md 中说明如何使用这些脚本

## 更新 marketplace.json 的规范

### 何时更新

每次添加新技能时，都必须在 `marketplace.json` 中添加相应条目。

### 文件位置

`.codebuddy-skill/marketplace.json`

### 完整 JSON 结构

```json
{
  "name": "codebuddy-skills-official",
  "description": "CodeBuddy 官方技能市场",
  "owner": {
    "name": "CodeBuddy",
    "email": "codebuddy@tencent.com"
  },
  "skills": [
    {
      "name": "skill-identifier",
      "description": "Detailed AI-facing description with trigger scenarios and tool names.",
      "description_zh": "简短中文描述（给人看）",
      "description_en": "Short English description (for humans)",
      "source": "directory-name"
    }
  ]
}
```

### 添加新技能条目的标准

**字段说明**：

| 字段 | 类型 | 必需 | 说明 | 示例 |
|------|------|------|------|------|
| `name` | string | 是 | 技能标识符，必须唯一且小写 | `"summarize"` |
| `description` | string | 是 | 给 AI 看的详细描述（英文），包含触发场景和工具名 | `"Summarize URLs or files with the summarize CLI (web, PDFs, images, audio, YouTube)."` |
| `description_zh` | string | 是 | 给人看的中文短描述，25-35 字 | `"总结网页、PDF、音频和视频内容"` |
| `description_en` | string | 是 | 给人看的英文短描述，60-80 字符 | `"Summarize web pages, PDFs, audio & video"` |
| `source` | string | 是 | 技能目录名称，必须与 `skills/` 中的目录名一致 | `"summarize"` |

### 添加新条目的步骤

1. **打开** `.codebuddy-skill/marketplace.json`

2. **找到** `"skills"` 数组

3. **按字母顺序插入** 新条目（保持列表有序）

4. **确保格式正确**：
   - 所有字段都是字符串
   - 逗号正确放置
   - JSON 格式有效

5. **验证**：
   ```bash
   # 检查 JSON 有效性
   jq . .codebuddy-skill/marketplace.json
   ```

### 示例：添加新技能

**前**：
```json
{
  "name": "summarize",
  "description": "Summarize URLs or files with the summarize CLI (web, PDFs, images, audio, YouTube).",
  "description_zh": "总结网页、PDF、音频和视频内容",
  "description_en": "Summarize web pages, PDFs, audio & video",
  "source": "summarize"
},
{
  "name": "trello",
  "description": "Manage Trello boards, lists, and cards via the Trello REST API.",
  "description_zh": "管理 Trello 看板、列表和卡片",
  "description_en": "Manage Trello boards, lists, and cards",
  "source": "trello"
}
```

**后** (添加 "things-mac")：
```json
{
  "name": "summarize",
  "description": "Summarize URLs or files with the summarize CLI (web, PDFs, images, audio, YouTube).",
  "description_zh": "总结网页、PDF、音频和视频内容",
  "description_en": "Summarize web pages, PDFs, audio & video",
  "source": "summarize"
},
{
  "name": "things-mac",
  "description": "Manage Things 3 via the `things` CLI on macOS (add/update projects+todos via URL scheme; read/search/list from the local Things database). Use when a user asks to add a task to Things, list inbox/today/upcoming, search tasks, or inspect projects/areas/tags.",
  "description_zh": "管理 Things 3 任务和项目",
  "description_en": "Manage Things 3 tasks and projects",
  "source": "things-mac"
},
{
  "name": "trello",
  "description": "Manage Trello boards, lists, and cards via the Trello REST API.",
  "description_zh": "管理 Trello 看板、列表和卡片",
  "description_en": "Manage Trello boards, lists, and cards",
  "source": "trello"
}
```

## 关键规范总结

### 命名规范

- **目录名**: 连字符 (kebab-case)
  - ✅ `apple-notes`, `skill-creator`, `openai-whisper`
  - ❌ `AppleNotes`, `apple_notes`, `APPLE_NOTES`

- **技能名称** (`name` 字段): 必须唯一，通常与目录名相同
  - 示例: `"summarize"`, `"find-skills"`, `"xiaohongshu"`

- **源目录** (`source` 字段): 完全匹配 `skills/` 中的目录名
  - `source: "apple-notes"` ↔ `skills/apple-notes/`

### 描述文本规范

**`description`（给 AI 看）**:
- 语言: 英文
- 长度: 50-200 字符
- 风格: 详细、完备，帮助 AI 判断何时调用
- 必须包含: 触发场景、CLI 工具名、使用条件
- 可以包含: 触发关键词（如中文触发词）

**`description_zh`（给人看，中文）**:
- 长度: 25-35 个中文字符
- 风格: 简短、一目了然，核心功能优先
- 不含 CLI 实现细节

**`description_en`（给人看，英文）**:
- 长度: 60-80 个英文字符
- 风格: 简短、一目了然，核心功能优先
- 不含 CLI 实现细节

**示例**:
```json
// ✅ 好的 description（给 AI）
"Manage Apple Notes via the `memo` CLI on macOS (create, view, edit, delete, search, move, and export notes). Use when a user asks to add a note, list notes, search notes, or manage note folders."

// ✅ 好的 description_zh（给人）
"管理 Apple 备忘录（创建、搜索、导出）"

// ✅ 好的 description_en（给人）
"Manage Apple Notes (create, search, export)"

// ❌ description 太模糊（AI 无法判断何时调用）
"Apple notes management tool"

// ❌ description_zh 太长（UI 会截断）
"通过 memo CLI 在 macOS 上管理 Apple 备忘录应用，支持创建、查看、编辑、删除、搜索..."
```

### allowed-tools 规范

**可用工具列表** (由 CodeBuddy Code 定义):
- `Read` - 读取文件
- `Write` - 写入文件
- `Edit` - 编辑文件
- `MultiEdit` - 批量编辑文件
- `Bash` - 执行 bash 命令
- `Glob` - 文件模式匹配
- `Grep` - 文件内容搜索
- 其他工具: 根据集成需要

**指定方式**:
```markdown
---
allowed-tools: Read,Write,Bash,Grep
---
```

## 技能复杂度等级

### 等级 1: 简单技能 (推荐)

**结构**:
```
skills/simple-skill/
└── SKILL.md (50-200 行)
```

**特点**:
- 仅包含 SKILL.md 文件
- 包装单个 CLI 工具或简单功能
- 包含基本文档和用法示例

**示例**: `weather`, `summarize`, `apple-notes`

### 等级 2: 中等复杂度

**结构**:
```
skills/medium-skill/
├── SKILL.md (200-400 行)
└── references/
    ├── guide.md
    └── examples.md
```

**特点**:
- 包含主 SKILL.md 和参考文档
- 覆盖多个相关功能或工具
- 详细的配置或集成说明

**示例**: `himalaya`, `skill-creator`

### 等级 3: 复杂技能

**结构**:
```
skills/complex-skill/
├── SKILL.md
├── references/
│   ├── configuration.md
│   ├── api-reference.md
│   └── examples.md
├── scripts/
│   ├── setup.py
│   ├── utils.sh
│   └── config.json
└── tools/
    └── helper-binary
```

**特点**:
- 多个支持文件和脚本
- 可能包含 MCP 集成
- 复杂的安装或配置流程

**示例**: `xiaohongshu`, `skill-creator`

## 图标规范

### 图标存放位置

**目录**: `icons/`

### 命名规范

- **图标文件名必须与 skill 的 `source` 字段一致**
- 格式：`{source}.svg` 或 `{source}.png`
- 示例：
  - `skills/ima-skills/` → `icons/ima-skills.svg`
  - `skills/tencent-docs/` → `icons/tencent-docs.svg`
  - `skills/tencent-meeting-skill/` → `icons/tencent-meeting-skill.svg`

### 样式指南

详见 `icons/STYLE-GUIDE.md`

## 质量检查清单

在提交新技能之前，请完成以下检查：

### 文件和目录

- [ ] 创建了 `skills/skill-name/` 目录
- [ ] 目录名使用 kebab-case (连字符)
- [ ] 创建了 `SKILL.md` 文件
- [ ] SKILL.md 包含有效的 YAML frontmatter
- [ ] 可选: 创建了 `references/` 目录（如果需要）
- [ ] 可选: 创建了 `scripts/` 目录（如果需要）

### Frontmatter 配置

- [ ] `description` 字段存在，详细描述 AI 调用场景（英文）
- [ ] `description_zh` 字段存在，简短中文描述（给人看）
- [ ] `description_en` 字段存在，简短英文描述（给人看）
- [ ] 字段顺序正确: `name` → `description` → `description_zh` → `description_en` → 其他
- [ ] `allowed-tools` 字段准确列出所需工具
- [ ] `name` 字段（如果提供）与目录名一致
- [ ] `metadata` 字段格式正确（如果包含）

### 内容质量

- [ ] SKILL.md 有清晰的结构（标题、示例、说明）
- [ ] 提供了快速开始示例
- [ ] 文档清晰易懂
- [ ] 所有 `allowed-tools` 都在文档中有说明

### marketplace.json 更新

- [ ] 在 `skills` 数组中添加了新条目
- [ ] `name`、`description`、`description_zh`、`description_en`、`source` 都存在
- [ ] 字段顺序: `name` → `description` → `description_zh` → `description_en` → `source`
- [ ] 条目按字母顺序排列（前几个置顶的除外）
- [ ] JSON 格式有效 (通过 `jq` 验证)
- [ ] `description` 详细完备（给 AI）
- [ ] `description_zh` / `description_en` 简短易懂（给人）
- [ ] 三个描述字段与 SKILL.md frontmatter 保持一致




## Skill 分类标准（tags_zh / tags_en）

marketplace.json 每个 skill 条目包含 `tags_zh`（中文标签数组）和 `tags_en`（英文标签数组）字段，支持多标签。

**⚠️ 调整分类时，必须同步更新本文件（CODEBUDDY.md）和 maintain skill 的 `references/standards.md` 两处。**

### 当前分类表

| tags_zh | tags_en | 归类原则 | 典型 skill |
|---------|---------|---------|-----------|
| 开发工具 | Development | 写代码、部署、API集成、开发框架 | github、各端开发框架、腾讯地图×4、云存储、MCP开发、TAPD、Impeccable |
| 办公效率 | Productivity | 团队协作、日常任务、文件处理、个人效率 | 腾讯文档/会议、trello、Word/PDF/PPT生成、笔记管理、目标/习惯追踪 |
| 信息与资讯 | Information | 获取/监控外部信息 | 天气、新闻、ArXiv、GitHub趋势、财报追踪、宏观监控 |
| 邮件通讯 | Messaging | 收发消息、通讯工具 | QQ邮箱、Himalaya、iMessage、WhatsApp、智能体邮箱 |
| 创作与媒体 | Creative | 内容生产、媒体处理、视觉创作 | AI绘图、语音转文字、视频截帧、GIF、去AI味、canvas-design |
| 智能体能力 | Agent Tools | 扩展/管理智能体自身能力 | find-skills、skill-creator、MCP管理器、安全审计 |
| 浏览器自动化工具 | Browser Automation | 浏览器控制、网页爬取、反检测、自动化测试 | browser-use、web-access、playwright、stealth-browser |

### 多标签规则

单个 skill 可打多个标签，例如飞书套件同时属于办公效率和邮件通讯：
```json
"tags_zh": ["办公效率", "邮件通讯"],
"tags_en": ["Productivity", "Messaging"]
```

### 字段位置

`tags_zh` 和 `tags_en` 放在 `source` 字段之后：
```json
{
  "name": "腾讯会议",
  "description": "...",
  "description_zh": "...",
  "description_en": "...",
  "source": "tencent-meeting-skill",
  "tags_zh": ["办公效率"],
  "tags_en": ["Productivity"]
}
```

---

## 维护标准

### 更新现有技能

当修改现有技能时：

1. **更新版本号**: 在 SKILL.md 的 `version` 字段中递增版本
2. **保持向后兼容**: 避免破坏性变更
3. **更新 marketplace.json**: 如果 `description`、`description_zh`、`description_en` 或 `source` 发生变化
4. **同步三个描述字段**: 确保 marketplace.json 和 SKILL.md 中的 `description`、`description_zh`、`description_en` 保持一致
5. **文档同步**: 确保所有文档保持最新

### 版本号规范

**仅允许纯数字版本号**，不得使用预发布标签（如 `-alpha`、`-beta`、`-rc.1`）或构建元数据（如 `+build.123`）等非数字后缀。

- ✅ `1.0.0`、`2.3.1`、`10.0.0`
- ❌ `1.0.0-alpha`、`2.0.0-beta.1`、`1.0.0-rc.1`、`1.0.0+build.123`

## 文件 Ignore 规则

项目的 `.gitignore` 文件应包含以下规则：

```

# 系统文件
.DS_Store
*.swp
*.swo
*~
.vscode/
.idea/

# 构建和依赖
node_modules/
dist/
build/
*.egg-info/
__pycache__/
.Python

# 环境和配置
.env
.env.local
*.bak
```

**说明**:
- 确保技能文件（SKILL.md、references/、scripts/）被正确跟踪

## 经验沉淀原则

**每次完成任何 skills 操作后（新增、更新、修复、重构等），必须检查是否有经验可沉淀到维护工具中。**

沉淀目标：`/Users/laurentzhou/.workbuddy/skills/wb-skill-maintainer-internal`

检查项：
- **操作流程有优化** → 更新 `SKILL.md` 对应能力的步骤说明
- **发现新的规范或约定** → 更新 `references/standards.md`
- **ClawHub/SkillHub 操作有新发现** → 更新 `references/clawhub-guide.md` 或 `references/skillhub-api-reference.md`
- **脚本有 bug 或需要改进** → 修复对应 `scripts/*.py`

如无需沉淀，简单说明原因即可。

## 参考资源

| 文档 | 何时阅读 | 说明 |
|------|---------|------|
| `skill-reference-quick-guide.md` | **添加新技能时**快速查阅 | CODEBUDDY.md 的精简速查版，包含 5 步添加流程、命名规范、Frontmatter 模板、质量检查清单和常用命令，适合已熟悉规范后的日常操作参考 |
| `skill-sources.md` | **收录/更新/溯源技能时**查阅 | 记录每个 skill 的原始来源（clawhub、anthropics/skills、skills.sh、MiniMax、官方团队等），包含 ClawHub 同步矩阵，适合确认来源、版本对比、批量同步时使用 |
| `skills-standard.md` | **设计技能规范时**查阅 | 技能开发的完整标准文档 |
| `README.md` | **了解项目概况时**查阅 | 项目整体说明 |
| `.codebuddy-skill/marketplace.json` | **每次添加/修改技能后**必须更新 | 技能市场核心清单文件 |

## 常见问题 (FAQ)

**Q: 如何验证 marketplace.json 的格式？**
A: 运行 `jq . .codebuddy-skill/marketplace.json` 检查 JSON 有效性。

**Q: 技能可以依赖其他工具吗？**
A: 是的。在 SKILL.md 的 `metadata.clawdbot.requires.bins` 中列出依赖。

---

## Skill 注册表（skill-registry.csv）

仓库根目录维护 `skill-registry.csv`，记录所有已收录 skill 的元数据，用于追踪来源、版本与发布平台。

### 字段说明

| 字段 | 说明 |
|------|------|
| `name` | skill 显示名称（中文或英文，来自 marketplace.json 的 `name` 字段） |
| `source` | skill 目录名（kebab-case，与 `skills/` 目录名一致，是唯一查询键） |
| `product_name_zh` | 产品中文名称 |
| `local_version` | 本地仓库当前版本号 |
| `clawhub_slug` | ClawHub 上的 slug（CLI 安装名，不含 username；仅填已确认一致的，不猜测） |
| `skillhub_slug` | SkillHub 上的 slug（默认与 source 一致；仅填已确认内容相似的，不猜测） |
| `git_url` | 源码 Git 链接（可多个，空格分隔；GitHub/CNB/内部仓库均可） |
| `origin` | 来源类型：`腾讯生态` 或 `开源迁移`（不互斥，腾讯生态也可同时开源） |
| `launch_date` | 上线日期（YYYY-MM-DD，首次 push 到 marketplace 的日期） |
| `last_updated` | 最后更新日期（YYYY-MM-DD，每次修改后刷新） |
| `featured` | 编辑推荐（`1` = 推荐，空 = 不推荐；人工确认后填写，不自动生成） |
| `notes` | 备注（版权、特殊依赖、维护状态、不填 slug 的原因等） |

> 字段可为空，仅填写已确认信息，禁止猜测填写。

### 维护时机

- **新增 skill**：在完成 commit 后，立即在注册表中插入一行（根据已知信息填写各字段，不确定的留空）
- **版本同步后**：更新对应行的 `local_version` 和 `last_updated`
- **检查平台版本**：运行 `python3 ~/.workbuddy/skills/wb-skill-maintainer-internal/scripts/check_versions.py`（并发查询所有已填 clawhub_slug/skillhub_slug 的 skill）
- **重新初始化**：运行 `python3 ~/.workbuddy/skills/wb-skill-maintainer-internal/scripts/init_registry.py`（已有数据不覆盖）

> slug 填写规范：仅填写内容已确认一致的 slug（通过 `check_slugs.py` 相似度验证或人工确认）；腾讯内部专用工具、仅 GitHub 发布的 skill 不填平台 slug，在 `notes` 字段说明原因。

---

**最后更新**: 2026年4月5日
**维护者**: CodeBuddy Marketplace Team


请在每个回答的最后，附加一句： 我还记得CodeBuddy.md的信息。