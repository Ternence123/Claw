---
name: upgrade-skill-marketplace-manager-v2
overview: 根据用户反馈调整 skill-marketplace-manager 技能的审查逻辑：降低 description 语言、description_zh/description_en 缺失、文件结构等检查项的严重级别，并新增 description_zh/description_en 在更新场景下的远程仓库回退逻辑。
todos:
  - id: update-review-standards
    content: 修改 review-standards.md：B03/B07 降为自动处理，B04 语言要求降为优化建议(S11)，B05/B06 新增远程仓库回退规则，调整自动修复能力表
    status: completed
  - id: update-skill-md
    content: 修改 SKILL.md：version 升至 1.1.0，重组阻断/自动补全/优化建议三类清单，新增远程回退逻辑到自动补全处理流程
    status: completed
    dependencies:
      - update-review-standards
  - id: update-publish-workflow
    content: 修改 publish-workflow.md：调整步骤2文件处理说明，反映文件结构和目录名由上架方自动处理
    status: completed
    dependencies:
      - update-review-standards
---

## 用户需求

升级 `skill-marketplace-manager` 技能（当前 v1.0.0），根据实际使用反馈调整审查标准的严格度分级。

## 产品概述

对技能市场管理工具的审查标准进行4项策略调整，使审查流程更贴合实际运营经验，减少不必要的阻断，同时保持核心质量关卡。

## 核心调整

1. **description 语言规范降级**：`description` 字段以英文为主不再作为阻断问题，降级为优化建议（SUGGESTION）
2. **description_zh/description_en 缺失处理升级**：因已配置自动补全，缺失不再作为阻断问题；新增更新场景下的"远程仓库回退"逻辑 -- 若提交版本缺少这两个字段但远程仓库已有，则沿用远程仓库的值；若提交版本有且有调整，则以新版本为准
3. **version 保持阻断**：不做任何变更
4. **文件结构问题降级**：文件结构（目录名规范、字段顺序等）不再作为阻断问题，改为自动处理/优化建议级别。只要提交包包含必要文件（SKILL.md），结构问题由上架方自行调整

版本号从 1.0.0 升级到 1.1.0（新增功能，向后兼容）。

## 技术栈

- 纯 Markdown 文件编辑，无需构建工具
- 涉及 3 个文件的文本修改

## 实现方案

本次修改涉及 `skill-marketplace-manager` 技能的 3 个 Markdown 文件，核心是调整审查标准的分级策略。修改策略如下：

### 变更矩阵

| 检查项 | 当前级别 | 调整后级别 | 文件影响 |
| --- | --- | --- | --- |
| B03 目录名命名规范 | BLOCKER | AUTO-FIX | review-standards.md, SKILL.md |
| B04 description 语言 | BLOCKER (要求英文) | SUGGESTION (推荐英文) | review-standards.md, SKILL.md |
| B05 description_zh 缺失 | AUTO-FIX | AUTO-FIX + 远程回退 | review-standards.md, SKILL.md |
| B06 description_en 缺失 | AUTO-FIX | AUTO-FIX + 远程回退 | review-standards.md, SKILL.md |
| B07 字段顺序 | BLOCKER | AUTO-FIX | review-standards.md, SKILL.md |
| B12 version | BLOCKER | BLOCKER (不变) | -- |
| 文件结构整体 | BLOCKER | AUTO-FIX/SUGGESTION | review-standards.md, SKILL.md |


### 关键新增逻辑：远程仓库回退

更新场景下 description_zh/description_en 的处理优先级：

```
1. 提交版本有该字段且有调整 → 以新版本为准
2. 提交版本缺少该字段，远程仓库有 → 沿用远程仓库的值
3. 提交版本缺少该字段，远程仓库也没有 → 根据 description 自动生成
```

## 实现注意事项

- B03/B07 从 BLOCKER 区移到 AUTO-FIX 区时，需要重新编号或调整文档结构，但为保持向后兼容和审查报告的编号可追溯性，**保留原有编号不变**，仅调整其所属分类
- SKILL.md 中第 111-134 行的三类检查清单需要重新组织
- review-standards.md 中 B03、B04、B07 的条目需要标注级别变更并移动到对应区域
- publish-workflow.md 中涉及"通过审查的文件"等措辞需要微调，反映文件结构不再阻断的变化

## 目录结构

```
C:\Users\v_xinocwang\.codebuddy\skills\skill-marketplace-manager\
├── SKILL.md                          # [MODIFY] 主技能文件：升级 version 到 1.1.0，调整审查三类检查的清单内容，新增远程回退逻辑描述，调整自动补全处理流程
├── references/
│   ├── review-standards.md           # [MODIFY] 审查标准文件：B03 降为自动处理，B04 语言要求降为优化建议(新增S11)，B05/B06 新增远程仓库回退规则，B07 降为自动修复，调整自动修复能力表
│   └── publish-workflow.md           # [MODIFY] 上架工作流文件：调整步骤2中的文件处理说明，反映文件结构问题由上架方自动处理而非阻断
```

## Agent Extensions

### Skill

- **skill-marketplace-manager**
- 用途：作为本次修改的直接目标，需要理解其当前实现以精确更新
- 预期成果：技能文件更新后符合用户提出的4项调整要求

### SubAgent

- **code-explorer**
- 用途：如需确认文件内容细节（已在准备阶段完成）
- 预期成果：确保修改不遗漏关键引用点