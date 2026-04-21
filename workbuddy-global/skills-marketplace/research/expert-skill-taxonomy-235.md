# 专家 Skill Taxonomy 溯源研究（235 个 unique skill）

> **来源文档**：PDF（封面标注"120+ 可组合 Skill 模块"）
> **实际数量**：30 个专家 × (5 核心 + 3 辅助) = 240 槽位，去重后 235 个独立 skill
> **重复 skill（5 个）**：`fact_check`、`platform_optimize`、`risk_disclosure`、`timeline_manage`、`version_control`
> **研究日期**：2026-04-13
> **目的**：仅做来源研究，不收录

---

## 来源标记说明

| 标记 | 含义 |
|------|------|
| `clawhub` | clawhub.com 上有同名或近似 skill |
| `skillhub` | SkillHub 平台上有匹配 |
| `github` | GitHub 上有相关开源项目 |
| `marketplace` | 本仓库 marketplace 已有相关 skill |
| `custom` | 未找到外部来源，疑似文档作者自定义 |
| `concept` | 是通用概念/方法论名称，非特定工具 |

---

## 场景一：内容创作场景

### 1. 故事创作专家 `expert.story.creator`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `plot_structure` | 核心 | `custom` | chinese-novelist-skill 有引用 |
| `character_design` | 核心 | `github` | LobeHub: Character Design Prompter (eli-yu) |
| `dialogue_writing` | 核心 | `custom` | novel-writer-skills 有引用 |
| `scene_setting` | 核心 | `custom` | |
| `pacing_control` | 核心 | `custom` | |
| `world_building` | 辅助 | `custom` | |
| `foreshadowing` | 辅助 | `custom` | |
| `conflict_design` | 辅助 | `custom` | |

### 2. 营销文案专家 `expert.marketing.copywriter`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `hook_writing` | 核心 | `skillhub` `github` | hook-and-headline-writing (secondsky-claude-skills) |
| `pain_point` | 核心 | `skillhub` | pain-point-marketing-loop (skills.rest), painpoint-discovery (skillhub.club) |
| `cta_design` | 核心 | `custom` | |
| `aIDA_framework` | 核心 | `custom` | 仅找到不相关的 AIDA 楼宇自动化 skill |
| `headline_crafting` | 核心 | `skillhub` | 被 hook-and-headline-writing 覆盖 |
| `tone_matching` | 辅助 | `custom` | |
| `platform_optimize` | 辅助 | | **重复×3**（营销/短视频/有声） |
| `ab_test_version` | 辅助 | `custom` | |

### 3. 科普解读专家 `expert.science.explainer`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `analogy_creation` | 核心 | `custom` | |
| `jargon_simplify` | 核心 | `github` | simplify skill (AISkills/copilot-skills) |
| `concept_visualize` | 核心 | `custom` | |
| `step_by_step` | 核心 | `concept` | 通用方法论 |
| `example_selection` | 核心 | `custom` | |
| `fact_check` | 辅助 | `concept` | **重复×2**（科普/编辑），通用能力名称 |
| `audience_adapt` | 辅助 | `custom` | |
| `depth_balance` | 辅助 | `custom` | |

### 4. 情感写作专家 `expert.emotional.writer`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `sensory_detail` | 核心 | `custom` | |
| `emotional_arc` | 核心 | `github` | emotional-arc-designer (antigravity-awesome-skills) |
| `show_not_tell` | 核心 | `github` | show-dont-tell (grandiamo/claude-skills) |
| `resonance_point` | 核心 | `custom` | |
| `voice_authentic` | 核心 | `custom` | MCP Market 有 Brand Voice Capture 近似概念 |
| `memory_evoking` | 辅助 | `custom` | |
| `metaphor_emotional` | 辅助 | `custom` | |
| `ending_impact` | 辅助 | `custom` | |

### 5. 翻译本地化专家 `expert.localization.translator`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `semantic_transfer` | 核心 | `custom` | |
| `cultural_adapt` | 核心 | `skillhub` | Cultural-Adaptation-Advisor (skillshub), learning-cultural-adaptation-skill (skillsmp.com) |
| `idiom_localize` | 核心 | `custom` | |
| `tone_preserve` | 核心 | `custom` | |
| `terminology_manage` | 核心 | `custom` | |
| `context_infer` | 辅助 | `custom` | |
| `style_matching` | 辅助 | `custom` | |
| `quality_check` | 辅助 | `concept` | 通用能力名称 |

---

## 场景二：商业转化场景

### 6. 广告投放专家 `expert.ad.campaign`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `audience_targeting` | 核心 | `github` | ads-skills (adkit-so) 含 audience targeting |
| `ad_copywriting` | 核心 | `github` | afrexai-copywriting-mastery (clawhub-skills) |
| `platform_spec` | 核心 | `custom` | |
| `budget_allocation` | 核心 | `custom` | |
| `creative_rotation` | 核心 | `custom` | |
| `keyword_research` | 辅助 | `concept` | SEO 通用术语 |
| `competitor_analysis` | 辅助 | `concept` | 通用商业分析术语 |
| `performance_forecast` | 辅助 | `custom` | |

### 7. 产品卖点专家 `expert.product.usp`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `usp_extraction` | 核心 | `custom` | |
| `competitor_diff` | 核心 | `custom` | |
| `benefit_translate` | 核心 | `custom` | |
| `proof_building` | 核心 | `custom` | |
| `objection_handle` | 核心 | `custom` | |
| `feature_benefit` | 辅助 | `custom` | |
| `value_proposition` | 辅助 | `concept` | 通用商业术语 |
| `persona_match` | 辅助 | `custom` | |

### 8. 转化漏斗专家 `expert.funnel.optimizer`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `funnel_design` | 核心 | `github` | sales-funnel-design (openclaw/skills) |
| `landing_page` | 核心 | `clawhub` `skillsh` | landing-gen (clawhub), landing-page-builder (skills.sh) |
| `email_sequence` | 核心 | `custom` | |
| `cta_optimize` | 核心 | `custom` | |
| `abandonment_recover` | 核心 | `custom` | |
| `user_journey` | 辅助 | `concept` | 通用 UX 术语 |
| `psychological_trigger` | 辅助 | `custom` | |
| `split_test` | 辅助 | `concept` | A/B 测试通用术语 |

### 9. 品牌叙事专家 `expert.brand.storyteller`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `brand_origin` | 核心 | `custom` | |
| `value_articulate` | 核心 | `custom` | |
| `founder_story` | 核心 | `custom` | |
| `brand_voice` | 核心 | `custom` | MCP Market 有 Brand Voice Capture 近似概念 |
| `mission_vision` | 核心 | `custom` | |
| `archetype_match` | 辅助 | `custom` | |
| `tone_guide` | 辅助 | `custom` | |
| `story_framework` | 辅助 | `custom` | |

### 10. 危机公关专家 `expert.crisis.pr`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `crisis_assess` | 核心 | `custom` | |
| `statement_draft` | 核心 | `custom` | |
| `media_response` | 核心 | `custom` | |
| `timeline_manage` | 核心 | | **重复×2**（危机/合规） |
| `stakeholder_comm` | 核心 | `custom` | |
| `tone_calibration` | 辅助 | `custom` | |
| `risk_mitigate` | 辅助 | `custom` | |
| `reputation_repair` | 辅助 | `custom` | |

---

## 场景三：专业服务场景

### 11. 金融研报专家 `expert.finance.research`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `industry_analysis` | 核心 | `concept` | 通用金融分析术语 |
| `financial_model` | 核心 | `concept` | 通用金融术语 |
| `valuation_method` | 核心 | `custom` | |
| `risk_assessment` | 核心 | `concept` | 通用风控术语 |
| `investment_thesis` | 核心 | `custom` | |
| `data_visualize` | 辅助 | `concept` | 通用数据可视化术语 |
| `competitor_matrix` | 辅助 | `custom` | |
| `sensitivity_analysis` | 辅助 | `concept` | 通用金融术语 |

### 12. 法律文书专家 `expert.legal.document`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `legal_research` | 核心 | `github` | Golden2002/legal-research-skill, 2026-legal-research-agent |
| `fact_organization` | 核心 | `custom` | |
| `argument_structure` | 核心 | `custom` | |
| `citation_format` | 核心 | `concept` | 通用学术术语 |
| `legal_language` | 核心 | `custom` | |
| `precedent_search` | 辅助 | `custom` | |
| `risk_disclosure` | 辅助 | | **重复×2**（法律/合规） |
| `procedural_guide` | 辅助 | `custom` | |

### 13. 合同审核专家 `expert.contract.reviewer`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `clause_drafting` | 核心 | `clawhub` `github` | contract-review-cn (clawhub), contract-review-skill (claude-office-skills, 619 installs) |
| `risk_identify` | 核心 | `custom` | |
| `term_negotiate` | 核心 | `custom` | |
| `compliance_check` | 核心 | `concept` | 通用合规术语 |
| `amendment_track` | 核心 | `custom` | |
| `template_library` | 辅助 | `custom` | |
| `obligation_map` | 辅助 | `custom` | |
| `termination_clause` | 辅助 | `custom` | |

### 14. 投资分析专家 `expert.investment.analyst`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `due_diligence` | 核心 | `concept` | Anthropic 教程引用，非独立 skill |
| `business_model` | 核心 | `concept` | 通用商业术语 |
| `market_sizing` | 核心 | `custom` | |
| `deal_structure` | 核心 | `custom` | |
| `return_analysis` | 核心 | `custom` | |
| `management_assess` | 辅助 | `custom` | |
| `exit_strategy` | 辅助 | `concept` | 通用投资术语 |
| `term_sheet` | 辅助 | `concept` | 通用投资术语 |

### 15. 合规披露专家 `expert.compliance.disclosure`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `regulation_follow` | 核心 | `custom` | |
| `disclosure_format` | 核心 | `custom` | |
| `materiality_judge` | 核心 | `custom` | |
| `risk_disclosure` | 核心 | | **重复**（见法律文书） |
| `audit_support` | 核心 | `custom` | |
| `timeline_manage` | 辅助 | | **重复**（见危机公关） |
| `board_communication` | 辅助 | `custom` | |
| `investor_relation` | 辅助 | `custom` | |

---

## 场景四：知识管理场景

### 16. 学术论文专家 `expert.academic.paper`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `lit_review` | 核心 | `custom` | |
| `methodology_design` | 核心 | `custom` | |
| `academic_writing` | 核心 | `concept` | 通用学术术语 |
| `citation_style` | 核心 | `concept` | 通用学术术语 |
| `abstract_draft` | 核心 | `custom` | |
| `research_gap` | 辅助 | `concept` | 通用学术术语 |
| `hypothesis_frame` | 辅助 | `custom` | |
| `peer_response` | 辅助 | `custom` | |

### 17. 技术文档专家 `expert.tech.document`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `api_documentation` | 核心 | `concept` | 通用开发术语 |
| `code_example` | 核心 | `concept` | 通用开发术语 |
| `architecture_diagram` | 核心 | `custom` | |
| `version_control` | 核心 | | **重复×2**（技术文档/编辑） |
| `troubleshoot_guide` | 核心 | `custom` | |
| `developer_persona` | 辅助 | `custom` | |
| `change_log` | 辅助 | `concept` | 通用开发术语 |
| `quick_start` | 辅助 | `concept` | 通用文档术语 |

### 18. 知识库构建专家 `expert.knowledge.base`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `info_architecture` | 核心 | `concept` | 通用 UX 术语 |
| `content_taxonomy` | 核心 | `custom` | |
| `search_optimize` | 核心 | `concept` | 通用 SEO 术语 |
| `faq_generation` | 核心 | `custom` | |
| `knowledge_graph` | 核心 | `concept` | 通用 AI 术语 |
| `user_journey_map` | 辅助 | `concept` | 通用 UX 术语 |
| `content_audit` | 辅助 | `concept` | 通用内容运营术语 |
| `maintenance_plan` | 辅助 | `custom` | |

### 19. 培训教材专家 `expert.training.material`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `curriculum_design` | 核心 | `custom` | |
| `learning_objective` | 核心 | `custom` | |
| `exercise_creation` | 核心 | `custom` | |
| `assessment_design` | 核心 | `custom` | |
| `instruction_design` | 核心 | `custom` | |
| `slide_design` | 辅助 | `custom` | |
| `case_study` | 辅助 | `concept` | 通用术语 |
| `facilitator_guide` | 辅助 | `custom` | |

### 20. 研究报告专家 `expert.research.report`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `research_framework` | 核心 | `custom` | |
| `data_analysis` | 核心 | `concept` | 通用术语 |
| `trend_insight` | 核心 | `custom` | |
| `case_selection` | 核心 | `custom` | |
| `executive_summary` | 核心 | `concept` | 通用商业术语 |
| `interview_guide` | 辅助 | `custom` | |
| `survey_design` | 辅助 | `custom` | |
| `recommendation_frame` | 辅助 | `custom` | |

---

## 场景五：传播运营场景

### 21. 新闻稿件专家 `expert.news.release`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `news_angle` | 核心 | `custom` | |
| `inverted_pyramid` | 核心 | `concept` | 新闻写作通用结构 |
| `quote_crafting` | 核心 | `custom` | |
| `media_list` | 核心 | `custom` | |
| `press_kit` | 核心 | `custom` | |
| `timing_strategy` | 辅助 | `custom` | |
| `follow_up` | 辅助 | `custom` | |
| `distribution_channel` | 辅助 | `custom` | |

### 22. 新媒体运营专家 `expert.social.media`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `content_calendar` | 核心 | `custom` | |
| `platform_algorithm` | 核心 | `custom` | |
| `engagement_boost` | 核心 | `custom` | |
| `hot_topic_ride` | 核心 | `custom` | |
| `community_growth` | 核心 | `custom` | |
| `analytics_read` | 辅助 | `custom` | |
| `competitor_monitor` | 辅助 | `custom` | |
| `influencer_collab` | 辅助 | `custom` | |

### 23. 社群互动专家 `expert.community.engagement`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `welcome_sequence` | 核心 | `custom` | |
| `topic_seeding` | 核心 | `custom` | |
| `ugc_encourage` | 核心 | `custom` | |
| `event_hosting` | 核心 | `custom` | |
| `conflict_moderate` | 核心 | `custom` | |
| `member_segment` | 辅助 | `custom` | |
| `reward_system` | 辅助 | `custom` | |
| `feedback_collect` | 辅助 | `custom` | |

### 24. 短视频脚本专家 `expert.video.script`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `hook_design` | 核心 | `custom` | |
| `script_pacing` | 核心 | `custom` | |
| `visual_direction` | 核心 | `custom` | |
| `call_to_action` | 核心 | `concept` | 通用营销术语 |
| `story_in_seconds` | 核心 | `custom` | |
| `trend_analysis` | 辅助 | `concept` | 通用术语 |
| `subtitle_optimize` | 辅助 | `custom` | |
| `thumbnail_text` | 辅助 | `custom` | |

### 25. 活动策划专家 `expert.event.planning`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `event_concept` | 核心 | `custom` | |
| `run_of_show` | 核心 | `custom` | |
| `invitation_copy` | 核心 | `custom` | |
| `on_site_script` | 核心 | `custom` | |
| `post_event_report` | 核心 | `custom` | |
| `budget_planning` | 辅助 | `concept` | 通用术语 |
| `vendor_brief` | 辅助 | `custom` | |
| `contingency_plan` | 辅助 | `custom` | |

---

## 场景六：出版策划场景

### 26. 图书策划专家 `expert.book.planning`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `market_analysis` | 核心 | `concept` | 通用商业术语 |
| `topic_hunt` | 核心 | `custom` | |
| `positioning_strategy` | 核心 | `custom` | |
| `author_match` | 核心 | `custom` | |
| `sales_forecast` | 核心 | `custom` | |
| `competitive_title` | 辅助 | `custom` | |
| `series_planning` | 辅助 | `custom` | |
| `rights_deal` | 辅助 | `custom` | |

### 27. 编辑加工专家 `expert.editing.process`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `structural_edit` | 核心 | `custom` | |
| `line_editing` | 核心 | `github` | feishu-aily-skills 有引用 |
| `copy_editing` | 核心 | `github` | copy-editing (feishu-aily-skills), openclaw-master-skills |
| `fact_check` | 核心 | `concept` | **重复**（见科普解读），通用能力名称 |
| `style_consistency` | 核心 | `custom` | |
| `author_feedback` | 辅助 | `custom` | |
| `version_control` | 辅助 | | **重复**（见技术文档） |
| `proofreading` | 辅助 | `concept` | 通用编辑术语 |

### 28. 版权运营专家 `expert.rights.management`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `rights_assessment` | 核心 | `custom` | |
| `contract_negotiate` | 核心 | `custom` | |
| `licensing_deal` | 核心 | `custom` | |
| `royalty_structure` | 核心 | `custom` | |
| `infringement_handle` | 核心 | `custom` | |
| `market_scan` | 辅助 | `custom` | |
| `territory_rights` | 辅助 | `custom` | |
| `reversion_clause` | 辅助 | `custom` | |

### 29. 影视改编专家 `expert.adaptation.screen`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `source_analysis` | 核心 | `custom` | |
| `adaptation_strategy` | 核心 | `custom` | |
| `visual_conversion` | 核心 | `custom` | |
| `dialogue_adapt` | 核心 | `custom` | |
| `format_transform` | 核心 | `custom` | |
| `genre_shift` | 辅助 | `custom` | |
| `length_adjust` | 辅助 | `custom` | |
| `rights_clear` | 辅助 | `custom` | |

### 30. 有声内容专家 `expert.audio.content`

| skill | 类型 | 来源 | 备注 |
|-------|------|------|------|
| `audio_script` | 核心 | `custom` | |
| `voice_direction` | 核心 | `custom` | |
| `episode_structure` | 核心 | `custom` | |
| `audio_format` | 核心 | `custom` | |
| `listener_retention` | 核心 | `custom` | |
| `sound_design` | 辅助 | `custom` | |
| `platform_optimize` | 辅助 | | **重复**（见营销文案） |
| `monetization_model` | 辅助 | `custom` | |

---

## 去重汇总（5 个重复 skill）

| skill | 出现次数 | 出现位置 |
|-------|---------|---------|
| `fact_check` | 2 | 科普解读(辅助) → 编辑加工(核心) |
| `platform_optimize` | 3 | 营销文案(辅助) → 短视频脚本(辅助) → 有声内容(辅助) |
| `risk_disclosure` | 2 | 法律文书(辅助) → 合规披露(核心) |
| `timeline_manage` | 2 | 危机公关(核心) → 合规披露(辅助) |
| `version_control` | 2 | 技术文档(核心) → 编辑加工(辅助) |

---

## 来源研究结果

> 以下结论基于 2026-04-13 对 clawhub.com、SkillHub、GitHub、skills.sh 的检索。

### 整体判断

**这 235 个 skill 是人为设计的专家/技能分类体系（taxonomy），不是从某个标准 skill 仓库直接导出的。**

核心证据：
1. 命名使用 `underscore_separated` 格式，而现有平台（clawhub、skills.sh、GitHub）普遍使用 `hyphen-separated`
2. 绝大多数 skill 名称在任何平台上都找不到精确匹配
3. 每个专家恰好 5 核心 + 3 辅助的整齐结构，明显是人为设计而非自然生长
4. 重复 skill 只有 5 个（235 中仅 2.1%），说明是刻意去重后的分类设计

### 平台匹配情况

235 个 skill 中，在外部平台找到精确或近似匹配的约 **15 个**（6.4%），其余均为 `custom`（自定义概念名称）。

#### 有精确/近似匹配的 skill

| skill 名称 | 匹配平台 | 匹配 skill | 备注 |
|------------|---------|-----------|------|
| `hook_writing` | skillhub.club, GitHub | `hook-and-headline-writing` (secondsky-claude-skills) | 精确匹配 |
| `pain_point` | skills.rest, skillhub.club | `pain-point-marketing-loop`, `painpoint-discovery` | 精确匹配 |
| `emotional_arc` | GitHub | `emotional-arc-designer` (antigravity-awesome-skills) | 精确匹配 |
| `show_not_tell` | GitHub | `show-dont-tell` (grandiamo/claude-skills) | 精确匹配 |
| `cultural_adapt` | skillhub, skillsmp.com | `Cultural-Adaptation-Advisor`, `learning-cultural-adaptation-skill` | 精确匹配 |
| `audience_targeting` | GitHub | `ads-skills` (adkit-so) 含 audience targeting | 近似匹配 |
| `ad_copywriting` | GitHub | `afrexai-copywriting-mastery` (clawhub-skills) | 近似匹配 |
| `funnel_design` | GitHub | `sales-funnel-design` (openclaw/skills) | 精确匹配 |
| `landing_page` | clawhub, skills.sh | `landing-gen` (clawhub), `landing-page-builder` (skills.sh) | 近似匹配 |
| `copy_editing` | GitHub | `copy-editing` (feishu-aily-skills) | 精确匹配 |
| `line_editing` | GitHub | 同上仓库有引用 | 近似匹配 |
| `legal_research` | GitHub | `Golden2002/legal-research-skill`, `2026-legal-research-agent` | 精确匹配 |
| `clause_drafting` | clawhub, GitHub | `contract-review-cn` (clawhub), `contract-review-skill` (claude-office-skills) | 近似匹配（合同审核而非起草） |
| `due_diligence` | Anthropic 教程 | "Six skills for financial service professionals" | 概念引用，非独立 skill |
| `character_design` | LobeHub | `Character Design Prompter` (eli-yu-first-skillshub) | 偏 UI/prompt 设计 |

#### 无匹配的 skill（约 220 个）

绝大多数 skill 属于以下情况之一：
- **通用方法论概念**：如 `pacing_control`、`inverted_pyramid`、`executive_summary` — 这些是写作/商业方法论术语，不是工具化的 skill
- **高度垂直的领域术语**：如 `royalty_structure`、`reversion_clause`、`materiality_judge` — 过于细分，无独立 skill 实现
- **行为描述而非工具**：如 `memory_evoking`、`resonance_point`、`voice_authentic` — 描述的是写作技巧，不是可安装的能力

### 与现有 marketplace skill 的关联

156 个现有 marketplace skill 中，约 59 个（38%）与这份 30 专家分类有概念关联：

| 分类 | 关联 marketplace skill | 覆盖度 |
|------|----------------------|--------|
| **内容创作** | FBS-BookWriter、content-factory、humanizer、ArXiv论文精读 | 中（翻译本地化为空白） |
| **商业转化** | AdMapix、conversion-ops、sales-playbook、market-researcher、brand-guidelines | 中 |
| **专业服务** | NeoData金融搜索、财报追踪、宏观数据监控、Deep Research、fintech-engineer | 中（合同审核/合规为空白） |
| **知识管理** | ArXiv系列、ima-skills、腾讯乐享、Deep Research、autoresearch、Education、tutor-skills | 强 |
| **传播运营** | 腾讯新闻、news-summary、content-repurposer、x-longform-post、podcast-ops、Remotion视频创作 | 中 |
| **出版策划** | FBS-BookWriter、sag、openai-whisper、podcast-ops | 弱（版权/影视改编为空白） |

#### marketplace 空白领域（taxonomy 有但 marketplace 无）

1. **翻译本地化** — 0 个相关 skill
2. **合同审核/法律文书** — 0 个专门 skill
3. **版权/IP 管理** — 0 个相关 skill
4. **影视改编** — 0 个相关 skill
5. **危机公关** — 仅腾讯新闻勉强相关

---

## 结论与建议

### 性质判断

这份 235 skill 清单是**人为设计的内容行业专家能力分类体系**，特点：
- 面向内容创作、商业转化、专业服务、知识管理、传播运营、出版策划 6 大场景
- 每个 skill 是一个**能力标签**（capability tag），不是一个可安装执行的工具
- 与现有 skill 生态（clawhub/skillhub/GitHub）的命名和粒度都不同
- 更接近"AI 写作助手的能力矩阵设计文档"，而非"待收录的 skill 列表"

### 可收录性评估

| 维度 | 评估 |
|------|------|
| 直接收录 | **不适合** — 这些是能力标签，不是独立 SKILL.md |
| 作为参考设计新 skill | **有价值** — 识别出 5 个 marketplace 空白领域 |
| 外部平台有对应实现 | **约 15 个**（6.4%）有近似匹配可考虑收录 |
| 作为 FBS-BookWriter 内部模块 | **最契合** — 出版策划场景（专家 26-30）与 FBS 高度重叠 |

### 值得关注的外部 skill（可单独收录）

| 外部 skill | 平台 | 对应 taxonomy skill | 收录建议 |
|-----------|------|---------------------|---------|
| `contract-review-cn` | clawhub | clause_drafting 系列 | 填补法律空白 |
| `legal-research-skill` | GitHub | legal_research 系列 | 填补法律空白 |
| `sales-funnel-design` | openclaw | funnel_design | 填补转化空白 |
| `hook-and-headline-writing` | skillhub | hook_writing | 营销写作 |
| `show-dont-tell` | GitHub | show_not_tell | 写作技巧 |
| `emotional-arc-designer` | GitHub | emotional_arc | 写作技巧 |
| `ads-skills` | GitHub | audience_targeting 系列 | 广告投放 |
| `landing-page-builder` | skills.sh | landing_page | 转化工具 |
