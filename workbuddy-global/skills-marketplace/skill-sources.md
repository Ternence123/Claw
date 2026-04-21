# Skill 来源索引

记录各 skill 的原始来源与映射关系。

> 最后更新：2026-04-07 | 更新人：协作系统

## 来源说明

| 来源标识 | 说明 |
|---------|------|
| `official` | 官方产品团队直接提供（腾讯系产品、内部仓库）|
| `clawhub` | 从 [clawhub.ai](https://clawhub.ai) 提供的版本（可能比本地更新） |
| `skillhub` | 从 [skillhub.io](https://skillhub.io) 提供的版本 |
| `git.woa.com` | 腾讯内部 Git 仓库 |
| `github` | GitHub 官方或第三方仓库 |
| `anthropics/skills` | 从 [github.com/anthropics/skills](https://github.com/anthropics/skills) 官方仓库 |
| `skills.sh` | 从 [skills.sh](https://skills.sh) 通过 `npx skills add` 安装 |
| `local` | 团队内部文件夹同步 |
| `-` | 来源不明 |

---

## 腾讯生态全景

> **关键规则**：腾讯系官方产品可同时存在于本地市场、clawhub、skillhub，各来源的版本可能不同。  
> 记录原则：既记录官方身份，也记录 clawhub/skillhub 映射链接（两者不冲突）。

| source | 产品名称 | 类型 | 状态 | 本地版本 | clawhub URL | 最后更新 |
|--------|---------|------|------|---------|-----------|--------|
| tencent-docs | 腾讯文档 | skill | 上线 | 1.0.24 | https://clawhub.ai/kn71n4rrmmw7469qstfds7c2z181y79z/tencent-docs | 2026-03-20 |
| tencent-meeting-skill | 腾讯会议 | skill | 上线 | - | - | 2026-03-19 |
| ima-skills | ima 笔记 | skill | 上线 | 1.1.2 | - | 2026-03-20 |
| cnb-skill | CNB.cool | skill | 上线 | 1.0.0 | - | - |
| tapd-openapi | TAPD | skill | 上线 | 1.0 | - | 2026-03-19 |
| lexiang-knowledge-base | 腾讯乐享 | skill | 上线 | 2.0.0 | - | - |
| tencentcloud-cos | 腾讯云 COS | skill | 上线 | - | https://clawhub.ai/shawnminh/tencent-cos-skill | - |
| cos-vectors | 腾讯云 COS 向量 | skill | 上线 | - | - | - |
| tencent-ssv-techforgood | 腾讯技术公益 | skill | 上线 | 1.3.13 | - | - |
| zenstudio | ZenStudio | skill | 上线 | 1.3.2 | https://clawhub.ai/zhaoda/zenstudio | 2026-03-20 |
| andonq | AndonQ（腾讯云安灯） | skill | 上线 | 1.1.9 | - | 2026-03-26 |
| skill-scanner | Skill 安全扫描（朱雀实验室） | skill | 上线 | 1.0.0 | - | - |
| skills-security-check | Skill 安全审计（云鼎实验室） | skill | 上线 | - | - | - |
| cloudq | CloudQ（智能顾问） | skill | 上线 | 1.5.5 | https://clawhub.ai/1ncludesteven/cloudq | 2026-03-26 |
| migraq | MigraQ（云迁移） | skill | 上线 | 1.0.8 | - | - |
| tencent-news | 腾讯新闻 | skill | 上线 | 1.0.7 | https://clawhub.ai/tencentnewsteam/tencent-news | 2026-03-27 |
| tencent-survey | 腾讯问卷 | skill | 上线 | 1.0.2 | - | 2026-03-28 |
| wechatpay-product-coupon | 微信支付商品券 | skill | 上线 | 1.0.0 | - | 2026-03-23 |
| tencentmap-lbs-skill | 腾讯地图 LBS | skill | 上线 | 1.0.0 | https://clawhub.ai/tencent-adm/tencentmap-lbs-skill | 2026-03-18 |
| tencentmap-jsapi-gl-skill | 腾讯地图 JSAPI GL | skill | 上线 | 1.0.0 | https://clawhub.ai/tencent-adm/tencentmap-jsapi-gl-skill | 2026-03-18 |
| tencentmap-miniprogram-skill | 腾讯地图小程序 | skill | 上线 | 1.0.0 | - | 2026-03-18 |
| tencentmap-webservice-skill | 腾讯地图 WebService | skill | 上线 | 1.0.0 | - | 2026-03-18 |
| tdesign-miniprogram | TDesign 微信小程序 | skill | 上线 | 1.0.0 | - | - |
| skyline | Skyline 渲染引擎 | skill | 上线 | 1.0.0 | - | - |
| wechat-miniprogram | 微信小程序框架 | skill | 上线 | 1.0.0 | - | - |
| wechat-article-search | 微信文章搜索 | skill | 上线 | 0.1.0 | https://clawhub.ai/wuchubuzai2018/wechat-article-search | - |
| cloudbase | 腾讯云 CloudBase | skill | 上线 | 2.15.4 | - | - |

### 待收录腾讯系产品

| 产品名称 | 类型 | Git 链接 | clawhub | 备注 |
|---------|------|---------|--------|------|
| 企微（WorkBuddy） | skill | - | - | WorkBuddy 内置 |
| 微信小游戏助手 | plugin + skill | https://wechatgame.tencent.com/ | - | weixin-minigame-helper |
| 腾讯电子签 | skill | - | - | 未上线 |

---

## git.woa.com（腾讯内部 Git）来源

> 腾讯内部 Git 仓库，仅内网可访问。许多腾讯系 skill 的官方源码位于此。

| source 目录 | 产品名称 | git.woa.com 链接 | 本地版本 |
|-----------|---------|----------------|--------|
| tencent-news | 腾讯新闻 | https://git.woa.com/newsai/agent-skills/tree/main/packages/skills/src/skills/tencent-news | 1.0.8 |
| cloudq | CloudQ | https://git.woa.com/tsa/CloudQ | 1.5.5 |
| andonq | AndonQ | https://git.woa.com/AndonNext/AndonQ | 1.1.9 |
| tencent-survey | 腾讯问卷 | https://git.woa.com/ur/mcp-skill | 1.0.2 |
| migraq | MigraQ 云迁移 | https://git.woa.com/msp/ai/skills/cloud-migration-skill | 1.0.8 |
| tencentmap-lbs-skill | 腾讯地图 LBS | https://git.woa.com/lbs-ai/tmap-lbs-plugin/tree/main/skills/TencentMap_lbs_skill | 1.0.0 |
| tencentmap-jsapi-gl-skill | 腾讯地图 JSAPI GL | https://git.woa.com/lbs-ai/tmap-lbs-plugin/tree/main/skills/TencentMap_jsapi_gl_skill | 1.0.0 |
| tencentmap-miniprogram-skill | 腾讯地图小程序 | https://git.woa.com/lbs-ai/tmap-lbs-plugin/tree/main/skills/TencentMap_miniprogram_skill | 1.0.0 |
| tencentmap-webservice-skill | 腾讯地图 WebService | https://git.woa.com/lbs-ai/tmap-lbs-plugin/tree/main/skills/TencentMap_webservice_skill | 1.0.0 |

---

## clawhub 来源

> 以下 URL 均来自 `_meta.json` 中的 `ownerId` + `slug`，格式为 `https://clawhub.ai/<ownerId>/<slug>`，100% 确定。  
> **更新策略**：clawhub 版本常高于本地，定期检查更新。

| source 目录 | 名称 | clawhub 精确 URL | 本地版本 | clawhub 版本 |
|-----------|------|----------------|--------|------------|
| agent-mbti | MBTI 人格诊断 | https://clawhub.ai/kn7ewfx332mk3nevrwg0b59avh80jffv/agent-mbti | 0.1.1 | ? |
| arxiv-reader | ArXiv 论文精读 | https://clawhub.ai/kn7fs3xs9g6y2dpz2h267d22ax811smw/arxiv-reader | 1.0.3 | ? |
| content-factory | 内容工厂 | https://clawhub.ai/kn78rfe4metwyxawfre84sztp17zxtgg/content-factory | 1.0.0 | ? |
| content-repurposer | 内容分发 | https://clawhub.ai/kn7f8evtnf3cehvnk1jcgab17x80ev71/content-repurposer | 1.1.0 | ? |
| earnings-tracker | 财报追踪 | https://clawhub.ai/kn79e7737znkq4877n6wc93wn58292v9/earnings-tracker | 1.1.0 | ? |
| email-skill | 邮件管理 | https://clawhub.ai/kn725kyxpr1g1e3rjqtkp26v0s809930/email-skill | 0.1.0 | ? |
| github-ai-trends | GitHub AI 趋势追踪 | https://clawhub.ai/kn78cz0dbgnkap6d6x36w1g2r980xvky/github-ai-trends | 1.1.0 | ? |
| goal-tracker | 目标追踪 | https://clawhub.ai/kn7cewhb5wnchncy8re254vv5x80t0a8/goal-tracker | 1.0.0 | ? |
| habit-tracker | 习惯打卡 | https://clawhub.ai/kn7dsqp497235e9hhzdwd0q9a57zxjw6/habit-tracker | 1.0.0 | ? |
| imap-smtp-email | IMAP/SMTP 邮件 | https://clawhub.ai/kn70j4ejnwqjpykvwwvgymmdcd8055qp/imap-smtp-email | 0.0.10 | ? |
| macro-monitor | 宏观数据监控 | https://clawhub.ai/kn7bsr0zwrkt96exdxg8xhr0ts80y9mq/macro-monitor | 1.0.2 | ? |
| multi-search-engine | 多引擎搜索 | https://clawhub.ai/kn79j8kk7fb9w10jh83803j7f180a44m/multi-search-engine | 2.0.1 | ? |
| news-summary | 新闻摘要 | https://clawhub.ai/kn72thdm1qe7rrz0vn4vqq3a297ymazh/news-summary | 1.0.1 | ? |
| note-organizer | Joplin 笔记管理 | https://clawhub.ai/kn71ha3d91ekxt8tgtwpvxp6gd82jrhx/note-organizer | 1.0.0 | ? |
| arxiv-watcher | ArXiv 论文追踪 | https://clawhub.ai/kn7c8ew58zsqxsn7a50925ypk97zzatv/arxiv-watcher | 1.0.0 | ? |
| capability-evolver | Capability Evolver | https://clawhub.ai/autogame-17/capability-evolver | 1.40.2 | ? |
| **腾讯系** | | | | |
| cloudq | CloudQ | https://clawhub.ai/1ncludesteven/cloudq | 1.5.5 | ? |
| didi-ride-skill | 滴滴出行 | https://clawhub.ai/didi/didi-ride-skill-official | 1.1.1 | 1.1.1 |
| tencent-docs | 腾讯文档 | https://clawhub.ai/kn71n4rrmmw7469qstfds7c2z181y79z/tencent-docs | 1.0.24 | ? |
| tencent-news | 腾讯新闻 | https://clawhub.ai/tencentnewsteam/tencent-news | 1.0.7 | ? |
| tencentmap-lbs-skill | 腾讯地图 LBS | https://clawhub.ai/tencent-adm/tencentmap-lbs-skill | 1.0.0 | ? |
| tencentmap-jsapi-gl-skill | 腾讯地图 JSAPI GL | https://clawhub.ai/tencent-adm/tencentmap-jsapi-gl-skill | 1.0.0 | ? |
| wechat-article-search | 微信文章搜索 | https://clawhub.ai/wuchubuzai2018/wechat-article-search | 0.1.0 | ? |
| stock-analysis | Stock Analysis | https://clawhub.ai/udiedrichsen/stock-analysis | 6.2.0 | 6.2.0 |
| us-stock-analysis | US Stock Analysis | https://clawhub.ai/veeramanikandanr48/us-stock-analysis | 0.1.1 | 0.1.1 |
| zenstudio | ZenStudio | https://clawhub.ai/zhaoda/zenstudio | 1.3.2 | ? |

### clawhub 来源但 ownerId 不明

| source 目录 | 名称 | 已知 slug | 本地版本 | 备注 |
|-----------|------|---------|--------|------|
| admapix | 广告情报与 App 分析 | admapix | 1.0.28 | - |
| agent-team-orchestration | 多智能体团队编排 | agent-team-orchestration | 1.0.0 | - |
| api-gateway | API 网关 | api-gateway | 1.0.76 | - |
| caldav-calendar | CalDAV 日历 | caldav-calendar | 1.0.1 | - |
| citation-manager | 学术引用管理 | academic-citation-manager | 1.0.0 | openclaw/youstudyeveryday 仓库手动拷贝 |
| cli-anything-hub | CLI 工具集 | cli-anything-hub | 1.0.0 | - |
| fintech-engineer | 金融科技工程专家 | fintech-engineer | 1.0.1 | - |
| marketing-skills | 营销技能包 | marketing-skills | 0.1.2 | 含 22 个子模块 |
| model-usage | 模型用量管理 | model-usage | 1.0.0 | - |
| perplexity | Perplexity 搜索 | perplexity | 1.0.0 | - |
| prompt-engineering-expert | 提示词工程专家 | prompt-engineering-expert | 1.0.0 | - |
| remotion-video-toolkit | Remotion 视频工具包 | remotion-video-toolkit | 1.4.0 | - |
| web-search-exa | Exa 网页搜索 | web-search-exa | 2.0.0 | - |

### 浏览器自动化工具（2026-04-09 批量收录）

| source 目录 | 名称 | clawhub slug | 本地版本 | clawhub 版本 |
|-----------|------|-------------|--------|------------|
| agent-browser-core | Agent Browser Core | agent-browser-core | 1.0.1 | ? |
| browser | Browser (Puppeteer) | browser | 1.0.0 | ? |
| browser-cash | Browser.cash | browser-cash | 1.0.0 | ? |
| browserwing | BrowserWing | browserwing | 1.0.0 | ? |
| clawbrowser | ClawBrowser | clawbrowser | 0.1.1 | ? |
| playwright-browser-automation | Playwright Browser Automation | playwright-browser-automation | 2.0.0 | ? |
| playwright-scraper-skill | Playwright Scraper | playwright-scraper-skill | 1.2.0 | ? |
| smooth-browser | Smooth Browser | smooth-browser | 0.1.0 | ? |
| stagehand-browser-cli | Stagehand Browser CLI | stagehand-browser-cli | 1.0.0 | ? |
| stealth-browser | Stealth Browser | stealth-browser | 1.0.0 | ? |
| web-scraper | Web Scraper | web-scraper | 0.1.1 | ? |

---

## anthropics/skills 官方仓库

| source 目录 | 名称 | GitHub 链接 |
|-----------|------|-----------|
| brand-guidelines | 品牌设计规范 | https://github.com/anthropics/skills |
| canvas-design | 视觉设计 | https://github.com/anthropics/skills |
| mcp-builder | MCP 开发指南 | https://github.com/anthropics/skills |

---

## GitHub 第三方来源

| source 目录 | 名称 | GitHub 链接 | 版本 |
|-----------|------|-----------|-----|
| browser-use | 浏览器自动化 | https://github.com/browser-use/browser-use | 2.0.0 |
| web-access | Web Access（浏览器自动化） | https://github.com/eze-is/web-access | 2.4.3 |
| cloudbase | CloudBase | https://github.com/TencentCloudBase/cloudbase-skills | 2.15.4 |
| wechatpay-product-coupon | 微信支付商品券 | https://github.com/wechatpay-apiv3/wechatpay-skills | 1.0.0 |
| deep-research | Deep Research（结构化深度调研） | https://github.com/Weizhena/Deep-Research-skills | 1.0.0 |
| darwin-skill | 达尔文Skill优化器 | https://github.com/alchaincyf/darwin-skill | 1.0.0 |

---

## skills.sh 来源

| source 目录 | 名称 | skills.sh 地址 | 安装数 |
|-----------|------|--------------|------|
| idea-validator | 创业验证 | https://skills.sh/shipshitdev/library/idea-validator | ~148 |
| market-researcher | 市场调研 | https://skills.sh/404kidwiz/claude-supercode-skills/market-researcher | ~254 |

---

## MiniMax 官方仓库

| source 目录 | 名称 | 说明 |
|-----------|------|------|
| minimax-docx | Word 文档生成 | Word 文档生成与编辑 |
| minimax-pdf | PDF 文档生成 | 高质量 PDF 文档生成 |
| minimax-xlsx | Excel 文件处理 | Excel 文件创建与分析 |
| pptx-generator | PPT 演示文稿 | PowerPoint 演示文稿生成 |
| gif-sticker-maker | GIF 贴纸制作 | 照片转动态 GIF 贴纸 |
| android-native-dev | Android 原生开发 | Android 原生应用开发指南 |
| flutter-dev | Flutter 开发 | Flutter 跨平台开发指南 |
| ios-application-dev | iOS 应用开发 | iOS 应用开发指南 |
| react-native-dev | React Native 开发 | React Native 跨平台开发指南 |
| frontend-dev | 前端开发 | 前端开发与 AI 媒体生成 |
| fullstack-dev | 全栈开发 | 全栈应用架构与开发指南 |
| shader-dev | GLSL Shader 开发 | GLSL Shader 视觉效果开发 |

---

## 来源不明 / 待确认

| source 目录 | 名称 | 线索 |
|-----------|------|------|
| agent-mail | 智能体邮箱 | - |
| anti-distill | 反蒸馏防御 | - |
| apple-notes | Apple 备忘录 | CodeBuddy 内置 |
| apple-reminders | Apple 提醒事项 | CodeBuddy 内置 |
| autoresearch | Karpathy 风格内容优化 | - |
| awesome-design-md | 54 个设计系统模板 | - |
| blogwatcher | 博客监控 | - |
| boss-skills | 蒸馏老板/企业家原型 | - |
| colleague-skill | 蒸馏同事 AI Skill | - |
| content-ops | 内容质量评分与评审 | - |
| conversion-ops | CRO 审计与转化优化 | - |
| deck-generator | AI 演示文稿生成 | - |
| education | 学习助手 | - |
| FBS-BookWriter | FBS-BookWriter | MIT license，福帮手 AI 协同平台 |
| finance-ops | AI CFO 助手 | - |
| find-skills | find-skills | CodeBuddy 内置 |
| gifgrep | GIF 搜索 | - |
| github | github | CodeBuddy 内置 |
| github-trending-cn | GitHub 热门项目 | - |
| gog | Google 全家桶 | - |
| growth-engine | 自主营销实验引擎 | - |
| healthcheck | 健康打卡 | - |
| himalaya | Himalaya 邮件 | 基于 himalaya CLI |
| humanizer | 去 AI 味 | - |
| impeccable | 高品质 UI/UX 设计工具集 | - |
| imsg | iMessage | - |
| lark-unified | 飞书/Lark 全能套件 | - |
| mcporter | MCP 管理器 | - |
| nano-banana-pro | AI 绘图 | - |
| nano-pdf | 轻量 PDF 编辑器 | - |
| neodata-financial-search | 全球金融数据搜索 | - |
| notebooklm-studio | NotebookLM 学习工作室 | - |
| obsidian | Obsidian | 基于 Obsidian，https://help.obsidian.md |
| openclaw-assets-to-workbuddy | OpenClaw 资产导入 WorkBuddy | - |
| openai-image-gen | 批量绘图 | - |
| openai-whisper | 本地语音转文字 | 基于 openai/whisper |
| openai-whisper-api | 语音转文字 API | 基于 OpenAI Whisper API |
| open-lesson | 苏格拉底式 AI 辅导 | - |
| oracle | AI 交叉审查 | - |
| outbound-engine | 自动化外拓邮件引擎 | - |
| peekaboo | macOS 界面自动化 | - |
| podcast-ops | 播客内容拆解 | - |
| qmd | 笔记搜索 | - |
| qq-email | QQ 邮箱 | 第三方野生 skill |
| revenue-intelligence | 收入归因分析 | - |
| sag | 文字转语音 | 基于 ElevenLabs |
| sales-pipeline | 销售管道自动化 | - |
| sales-playbook | 销售剧本与定价 | - |
| seo-ops | SEO 运营自动化 | - |
| skill-creator | 技能创建指南 | CodeBuddy 内置 |
| skill-vetter | skill-vetter | - |
| songsee | 音频可视化 | - |
| summarize | 内容总结 | https://summarize.sh |
| team-ops | 团队绩效审计 | - |
| things-mac | Things 任务 | 基于 Things 3 |
| tmux | tmux | - |
| trello | trello | 基于 Trello REST API |
| tutor-skills | 文档转学习库 | - |
| video-frames | 视频截帧 | - |
| wacli | WhatsApp | 基于 wacli |
| weather | 天气查询 | - |

| x-longform-post | X(Twitter) 长文 | - |
| xiaohongshu | 小红书 | CodeBuddy 内置 |
| xurl | Twitter 分析 | - |
| yourself-skill | 数字分身蒸馏 | - |
| yt-competitive-analysis | YouTube 竞品分析 | - |

---

## 来源映射策略

### 关键规则

1. **腾讯系官方产品** 可同时存在于多个来源平台：
   - `official`：官方产品团队身份（本地市场权威）
   - `clawhub`：第三方平台版本（可能更新更快）
   - `git.woa.com`：腾讯内部 Git 源码库

2. **版本管理**：
   - 本地市场（skill-marketplace）为权威数据源
   - clawhub 版本常领先，定期检查更新
   - git.woa.com 版本作为参考来源，确认官方动态

3. **更新优先级**（从高到低）：
   1. clawhub（通过 `clawhub install` 获取最新）
   2. 官方产品团队发布
   3. git.woa.com（内部源）
   4. 本地同步维护

4. **多来源记录不冲突**：
   - 既要标注官方身份（official）
   - 也要记录 clawhub/skillhub 映射链接
   - 两者相辅相成，提供全景视图

---

## 更新日志

| 日期 | 更新项 | 说明 |
|------|--------|------|
| 2026-04-09 | 浏览器自动化批量收录 + Deep Research | 新增 11 个浏览器自动化 skill（clawhub 来源），新增 deep-research（GitHub 来源） |
| 2026-04-07 | 全量对账 | 补充 41 个未收录技能，修复 qq-email 上线状态，CloudBase 移入正式表 |
| 2026-04-04 | 腾讯生态全景重构 | 添加所有腾讯系产品、git.woa.com 源、clawhub 映射 |
| 2026-04-04 | 来源映射策略 | 文档化腾讯系多来源并存规则 |
| 2026-04-03 | capability-evolver | 新增 v1.40.2 |
| 2026-04-03 | 合并 clawhub-sync-matrix.md | 将同步矩阵内容集成到本文件 |
