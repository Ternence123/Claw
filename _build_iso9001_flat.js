// ISO 9001:2015 质量管理体系培训 — 扁平化风格
const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "ISO 9001:2015 质量管理体系入门培训";

// ===== 扁平配色方案 =====
const C = {
  // 主体色系 - 深邃蓝（ISO/质量体系专业感）
  dark:     "0F2942",   // 深海蓝 - 标题/页眉
  mid:      "1A3A5C",   // 中蓝
  light:    "F0F4F8",   // 浅灰白 - 内容页背景
  accent:   "0066CC",   // ISO蓝 - 主强调色

  // 功能色
  teal:     "0077B6",   // 青蓝 - Section色
  tealLt:   "D0E8F5",   // 浅青
  tealDk:   "004E7A",   // 深青

  orange:   "E87722",   // 橙色 - 关键词/强调
  orangeLt: "FDEBD3",    // 浅橙

  green:    "2E7D32",   // 绿色 - 正面/成功
  greenLt:  "E8F5E9",   // 浅绿

  purple:   "6A1B9A",   // 紫色 - 联动/综合
  purpleLt: "F3E5F5",   // 浅紫

  white:    "FFFFFF",
  gray:     "546E7A",
  grayLt:   "CFD8DC",
  grayDk:   "263238",
};

// ============================================================
// 工具函数
// ============================================================
const flatCard = (slide, x, y, w, h, accentColor, fillColor) => {
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: fillColor || C.white }, line: { color: C.grayLt, pt: 1 } });
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.08, h, fill: { color: accentColor }, line: { color: accentColor } });
};

const flatCircle = (slide, x, y, size, fillColor) => {
  slide.addShape(pres.shapes.OVAL, { x, y, w: size, h: size, fill: { color: fillColor }, line: { color: fillColor } });
};

const flatStep = (slide, x, y, size, num, bgColor, textColor) => {
  slide.addShape(pres.shapes.OVAL, { x, y, w: size, h: size, fill: { color: bgColor }, line: { color: bgColor } });
  slide.addText(num, { x, y, w: size, h: size, fontSize: size > 0.5 ? 14 : 11, bold: true, color: textColor || C.white, fontFace: "Arial Black", align: "center", valign: "middle", margin: 0 });
};

// ============================================================
// Slide 1: 封面
// ============================================================
(function buildCover() {
  const slide = pres.addSlide();
  slide.background = { color: C.dark };

  // 左侧大色块 - 蓝色渐变感
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 4.2, h: 5.625, fill: { color: C.teal }, line: { color: C.teal } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 4.2, y: 0, w: 0.3, h: 5.625, fill: { color: C.orange }, line: { color: C.orange } });

  // 装饰圆形
  slide.addShape(pres.shapes.OVAL, { x: 1.5, y: 3.5, w: 2.5, h: 2.5, fill: { color: C.tealDk }, line: { color: C.tealDk } });
  slide.addShape(pres.shapes.OVAL, { x: 0.3, y: 0.4, w: 1.2, h: 1.2, fill: { color: C.tealDk }, line: { color: C.tealDk } });
  slide.addShape(pres.shapes.OVAL, { x: 2.8, y: 0.8, w: 0.7, h: 0.7, fill: { color: C.orange }, line: { color: C.orange } });

  // ISO logo 文字
  slide.addText("ISO", { x: 0.3, y: 1.6, w: 3.6, h: 0.8, fontSize: 42, bold: true, color: C.white, fontFace: "Arial Black", align: "center", margin: 0 });
  slide.addText("9001:2015", { x: 0.3, y: 2.4, w: 3.6, h: 0.6, fontSize: 22, bold: true, color: C.tealLt, fontFace: "Arial Black", align: "center", margin: 0 });

  // 右侧主标题
  slide.addText("质量管理体系", { x: 4.7, y: 1.0, w: 5.0, h: 0.8, fontSize: 36, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
  slide.addText("入门培训", { x: 4.7, y: 1.8, w: 5.0, h: 0.8, fontSize: 36, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
  slide.addText("Quality Management System Fundamentals", { x: 4.7, y: 2.65, w: 5.0, h: 0.5, fontSize: 13, color: C.grayLt, fontFace: "Microsoft YaHei", align: "left", margin: 0 });

  slide.addShape(pres.shapes.RECTANGLE, { x: 4.7, y: 3.3, w: 4.5, h: 0.05, fill: { color: C.orange }, line: { color: C.orange } });

  // 五个关键词标签
  const tags = ["PDCA循环", "七项原则", "风险思维", "组织环境", "持续改进"];
  tags.forEach((tag, i) => {
    slide.addShape(pres.shapes.RECTANGLE, { x: 4.7 + i * 0.95, y: 3.55, w: 0.88, h: 0.42, fill: { color: i % 2 === 0 ? C.teal : C.orange }, line: { color: i % 2 === 0 ? C.teal : C.orange } });
    slide.addText(tag, { x: 4.7 + i * 0.95, y: 3.55, w: 0.88, h: 0.42, fontSize: 7.5, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });
  });

  slide.addText("来源：质量管理培训资料   2026.04", { x: 4.7, y: 5.1, w: 5.0, h: 0.35, fontSize: 10, color: C.gray, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
})();

// ============================================================
// Slide 2: 目录
// ============================================================
(function buildToc() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 2.4, h: 5.625, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addText("CONTENTS", { x: 0.2, y: 0.5, w: 2.0, h: 0.7, fontSize: 22, bold: true, color: C.teal, fontFace: "Arial Black", align: "left", margin: 0 });
  slide.addText("目录", { x: 0.2, y: 1.1, w: 2.0, h: 0.55, fontSize: 28, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.2, y: 1.75, w: 1.2, h: 0.06, fill: { color: C.teal }, line: { color: C.teal } });
  slide.addShape(pres.shapes.OVAL, { x: 1.4, y: 4.2, w: 0.8, h: 0.8, fill: { color: C.orange }, line: { color: C.orange } });

  const items = [
    { num: "01", title: "什么是ISO 9001", sub: "ISO起源 · 发展历程 · 2015版重大变化", color: C.teal },
    { num: "02", title: "七项质量管理原则", sub: "以顾客为焦点 · 领导作用 · 全员参与 · 过程方法", color: C.orange },
    { num: "03", title: "PDCA循环", sub: "策划 · 实施 · 检查 · 处置", color: C.teal },
    { num: "04", title: "组织环境与风险思维", sub: "内外部环境 · 相关方需求 · 风险识别", color: C.green },
    { num: "05", title: "质量管理体系结构", sub: "高阶结构(HLS) · 十章框架解读", color: C.purple },
    { num: "06", title: "文件化要求", sub: "必须文件 · 通常需要 · 文件管理", color: C.gray },
  ];

  items.forEach((item, i) => {
    const y = 0.42 + i * 0.85;
    slide.addShape(pres.shapes.RECTANGLE, { x: 2.6, y, w: 7.2, h: 0.78, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 } });
    slide.addShape(pres.shapes.RECTANGLE, { x: 2.6, y, w: 7.2, h: 0.07, fill: { color: item.color }, line: { color: item.color } });
    slide.addShape(pres.shapes.RECTANGLE, { x: 2.6, y, w: 0.7, h: 0.78, fill: { color: item.color }, line: { color: item.color } });
    slide.addText(item.num, { x: 2.6, y, w: 0.7, h: 0.78, fontSize: 17, bold: true, color: C.white, fontFace: "Arial Black", align: "center", valign: "middle", margin: 0 });
    slide.addText(item.title, { x: 3.45, y: y + 0.1, w: 6.1, h: 0.38, fontSize: 13.5, bold: true, color: C.dark, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
    slide.addText(item.sub, { x: 3.45, y: y + 0.46, w: 6.1, h: 0.28, fontSize: 10, color: C.gray, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
  });
})();

// ============================================================
// Slide 3: 培训目标
// ============================================================
(function buildObjectives() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.1, h: 0.8, fill: { color: C.orange }, line: { color: C.orange } });
  slide.addText("培训目标", { x: 0.3, y: 0, w: 9.4, h: 0.8, fontSize: 20, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  const objectives = [
    { icon: "🎯", text: "理解ISO 9001:2015的基本概念和核心要求" },
    { icon: "📋", text: "掌握七项质量管理原则的内涵与应用" },
    { icon: "🔄", text: "了解PDCA循环在质量管理中的具体应用" },
    { icon: "⚠️", text: "认识组织环境和风险思维的重要性" },
    { icon: "💡", text: "能够在实际工作中运用质量管理理念" },
  ];

  objectives.forEach((obj, i) => {
    const y = 1.0 + i * 0.88;
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y, w: 9.2, h: 0.78, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 } });
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y, w: 0.65, h: 0.78, fill: { color: i < 2 ? C.teal : i < 4 ? C.orange : C.green }, line: { color: i < 2 ? C.teal : i < 4 ? C.orange : C.green } });
    slide.addText(obj.icon, { x: 0.4, y, w: 0.65, h: 0.78, fontSize: 18, align: "center", valign: "middle", margin: 0 });
    slide.addText(obj.text, { x: 1.2, y, w: 8.2, h: 0.78, fontSize: 14, color: C.dark, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
  });
})();

// ============================================================
// Slide 4: Section 1 标题 - 什么是ISO 9001
// ============================================================
(function buildSection1Title() {
  const slide = pres.addSlide();
  slide.background = { color: C.teal };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 3.6, h: 5.625, fill: { color: C.tealDk }, line: { color: C.tealDk } });
  slide.addShape(pres.shapes.OVAL, { x: 1.0, y: 3.2, w: 2.4, h: 2.4, fill: { color: C.tealDk }, line: { color: C.tealDk } });
  slide.addShape(pres.shapes.OVAL, { x: 0.2, y: 0.3, w: 0.9, h: 0.9, fill: { color: C.teal }, line: { color: C.teal } });

  slide.addText("01", { x: 0.3, y: 1.0, w: 3.0, h: 1.5, fontSize: 100, bold: true, color: C.white, fontFace: "Arial Black", align: "center", margin: 0 });
  slide.addText("什么是ISO 9001", { x: 3.9, y: 1.1, w: 5.8, h: 1.0, fontSize: 42, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
  slide.addText("ISO的起源 · 发展历程 · 2015版核心变化", { x: 3.9, y: 2.2, w: 5.8, h: 0.5, fontSize: 14, color: C.tealLt, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
  slide.addShape(pres.shapes.RECTANGLE, { x: 3.9, y: 2.85, w: 4.5, h: 0.06, fill: { color: C.white }, line: { color: C.white } });

  slide.addShape(pres.shapes.RECTANGLE, { x: 3.9, y: 3.1, w: 3.0, h: 0.52, fill: { color: C.tealDk }, line: { color: C.tealDk } });
  slide.addText("质量管理国际标准", { x: 3.9, y: 3.1, w: 3.0, h: 0.52, fontSize: 13, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });

  slide.addShape(pres.shapes.OVAL, { x: 7.2, y: 3.0, w: 2.0, h: 2.0, fill: { color: C.tealDk }, line: { color: C.tealDk } });
  slide.addShape(pres.shapes.OVAL, { x: 7.55, y: 3.35, w: 1.3, h: 1.3, fill: { color: C.orange }, line: { color: C.orange } });
  slide.addText("ISO", { x: 7.2, y: 3.0, w: 2.0, h: 2.0, fontSize: 28, bold: true, color: C.white, fontFace: "Arial Black", align: "center", valign: "middle", margin: 0 });
})();

// ============================================================
// Slide 5: ISO是什么
// ============================================================
(function buildWhatIsIso() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.1, h: 0.8, fill: { color: C.teal }, line: { color: C.teal } });
  slide.addText("ISO是什么？", { x: 0.3, y: 0, w: 9.4, h: 0.8, fontSize: 20, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  // 定义卡片
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.92, w: 9.4, h: 1.0, fill: { color: C.tealLt }, line: { color: C.teal, pt: 2 } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.92, w: 0.1, h: 1.0, fill: { color: C.teal }, line: { color: C.teal } });
  slide.addText("ISO = 国际标准化组织 (International Organization for Standardization)", { x: 0.55, y: 0.95, w: 8.9, h: 0.45, fontSize: 14, bold: true, color: C.tealDk, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
  slide.addText("由167个国家标准机构组成的全球最大标准化机构，总部位于瑞士日内瓦", { x: 0.55, y: 1.42, w: 8.9, h: 0.42, fontSize: 12.5, color: C.dark, fontFace: "Microsoft YaHei", align: "left", margin: 0 });

  // 关键数据
  const facts = [
    { num: "1947", label: "成立年份" },
    { num: "167", label: "成员国机构" },
    { num: "1.7M+", label: "全球获证组织" },
    { num: "全球", label: "适用范围" },
  ];
  facts.forEach((f, i) => {
    const x = 0.3 + i * 2.3;
    slide.addShape(pres.shapes.RECTANGLE, { x, y: 2.1, w: 2.15, h: 1.0, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 } });
    slide.addText(f.num, { x, y: 2.1, w: 2.15, h: 0.6, fontSize: 22, bold: true, color: C.teal, fontFace: "Arial Black", align: "center", valign: "middle", margin: 0 });
    slide.addText(f.label, { x, y: 2.68, w: 2.15, h: 0.38, fontSize: 11, color: C.gray, fontFace: "Microsoft YaHei", align: "center", margin: 0 });
  });

  // 要点
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 3.3, w: 0.08, h: 0.4, fill: { color: C.orange }, line: { color: C.orange } });
  slide.addText("ISO 9001 地位", { x: 0.5, y: 3.3, w: 3, h: 0.4, fontSize: 14, bold: true, color: C.dark, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  const points = [
    "ISO 9000系列是全球最著名的质量管理标准",
    "中国是ISO正式成员（SAC）",
    "ISO 9001用于证实组织具有提供满足顾客要求产品的能力",
  ];
  points.forEach((p, i) => {
    const y = 3.8 + i * 0.55;
    flatCircle(slide, 0.4, y + 0.1, 0.3, C.orange);
    slide.addText("✓", { x: 0.4, y: y + 0.1, w: 0.3, h: 0.3, fontSize: 12, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
    slide.addText(p, { x: 0.82, y, w: 8.8, h: 0.5, fontSize: 12.5, color: C.dark, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
  });
})();

// ============================================================
// Slide 6: ISO 9001发展历程
// ============================================================
(function buildHistory() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.1, h: 0.8, fill: { color: C.teal }, line: { color: C.teal } });
  slide.addText("ISO 9001发展历程", { x: 0.3, y: 0, w: 9.4, h: 0.8, fontSize: 20, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  const versions = [
    { year: "1987", event: "ISO 9001首次发布", type: "first" },
    { year: "1994", event: "第二次修订", type: "minor" },
    { year: "2000", event: "重大改版\n八项管理原则", type: "major" },
    { year: "2008", event: "小修订", type: "minor" },
    { year: "2015", event: "重大改版\n七项原则+HLS", type: "major" },
  ];

  // 时间线
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 2.6, w: 9.0, h: 0.06, fill: { color: C.teal }, line: { color: C.teal } });

  versions.forEach((v, i) => {
    const x = 0.5 + i * 1.85;
    const color = v.type === "major" ? C.orange : v.type === "first" ? C.teal : C.gray;

    flatCircle(slide, x + 0.5, y = 2.35, 0.55, color);
    slide.addText(String(i + 1), { x: x + 0.5, y: 2.35, w: 0.55, h: 0.55, fontSize: 14, bold: true, color: C.white, fontFace: "Arial Black", align: "center", valign: "middle", margin: 0 });

    slide.addText(v.year, { x, y: 1.85, w: 1.55, h: 0.45, fontSize: 18, bold: true, color: color, fontFace: "Arial Black", align: "center", margin: 0 });
    slide.addText(v.event, { x, y: 3.05, w: 1.55, h: 0.9, fontSize: 11, color: C.dark, fontFace: "Microsoft YaHei", align: "center", valign: "top", margin: 0 });

    if (v.type === "major") {
      slide.addShape(pres.shapes.RECTANGLE, { x: x + 0.15, y: 1.55, w: 1.25, h: 0.3, fill: { color: C.orange }, line: { color: C.orange } });
      slide.addText("重大改版", { x: x + 0.15, y: 1.55, w: 1.25, h: 0.3, fontSize: 10, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });
    }
  });

  // 底部说明
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 4.35, w: 9.4, h: 1.0, fill: { color: C.tealLt }, line: { color: C.teal, pt: 1 } });
  slide.addText("💡 ISO 9001:2015是目前最新有效版本，超过170万个组织获得认证", { x: 0.5, y: 4.5, w: 9.0, h: 0.7, fontSize: 13, bold: true, color: C.tealDk, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
})();

// ============================================================
// Slide 7: 2015版重大变化（一）
// ============================================================
(function buildChanges1() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.1, h: 0.8, fill: { color: C.orange }, line: { color: C.orange } });
  slide.addText("2015版重大变化（一）", { x: 0.3, y: 0, w: 9.4, h: 0.8, fontSize: 20, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  const changes = [
    {
      title: "高阶结构（HLS）",
      desc: "与其他所有ISO管理体系标准统一框架，实现体系整合（如ISO 14001、ISO 45001）",
      icon: "🏗️", color: C.teal
    },
    {
      title: "风险思维",
      desc: "从预防为主到基于风险的思维，主动识别风险与机遇，而非被动纠正",
      icon: "⚠️", color: C.orange
    },
    {
      title: "领导力",
      desc: "强调高层领导在质量管理体系中的核心作用，设定方针、创造环境、推动文化",
      icon: "👔", color: C.green
    },
  ];

  changes.forEach((c, i) => {
    const y = 0.95 + i * 1.48;
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y, w: 9.4, h: 1.35, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 } });
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y, w: 0.65, h: 1.35, fill: { color: c.color }, line: { color: c.color } });
    slide.addText(c.icon, { x: 0.3, y, w: 0.65, h: 1.35, fontSize: 22, align: "center", valign: "middle", margin: 0 });
    slide.addText(c.title, { x: 1.1, y: y + 0.12, w: 8.3, h: 0.45, fontSize: 15, bold: true, color: c.color, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
    slide.addText(c.desc, { x: 1.1, y: y + 0.6, w: 8.3, h: 0.65, fontSize: 12.5, color: C.dark, fontFace: "Microsoft YaHei", align: "left", valign: "top", margin: 0 });
  });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 4.85, w: 9.4, h: 0.55, fill: { color: C.orangeLt }, line: { color: C.orange, pt: 1 } });
  slide.addText("📌 核心变化：从「符合要求」升级为「追求卓越绩效」的思维转变", { x: 0.5, y: 4.85, w: 9.0, h: 0.55, fontSize: 12.5, bold: true, color: C.grayDk, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
})();

// ============================================================
// Slide 8: 2015版重大变化（二）
// ============================================================
(function buildChanges2() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.1, h: 0.8, fill: { color: C.orange }, line: { color: C.orange } });
  slide.addText("2015版重大变化（二）", { x: 0.3, y: 0, w: 9.4, h: 0.8, fontSize: 20, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  const changes = [
    { title: "组织环境", desc: "需明确理解内外部环境因素，包括正面与负面的影响因素", icon: "🌍", color: C.purple },
    { title: "知识管理", desc: "组织知识成为重要资源，需明确管控、分享与更新", icon: "📚", color: C.teal },
    { title: "过程方法", desc: "PDCA循环贯穿整个体系，过程管理更加系统化", icon: "🔄", color: C.green },
  ];

  changes.forEach((c, i) => {
    const y = 0.95 + i * 1.48;
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y, w: 9.4, h: 1.35, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 } });
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y, w: 0.65, h: 1.35, fill: { color: c.color }, line: { color: c.color } });
    slide.addText(c.icon, { x: 0.3, y, w: 0.65, h: 1.35, fontSize: 22, align: "center", valign: "middle", margin: 0 });
    slide.addText(c.title, { x: 1.1, y: y + 0.12, w: 8.3, h: 0.45, fontSize: 15, bold: true, color: c.color, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
    slide.addText(c.desc, { x: 1.1, y: y + 0.6, w: 8.3, h: 0.65, fontSize: 12.5, color: C.dark, fontFace: "Microsoft YaHei", align: "left", valign: "top", margin: 0 });
  });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 4.85, w: 9.4, h: 0.55, fill: { color: C.tealLt }, line: { color: C.teal, pt: 1 } });
  slide.addText("📌 新增「组织知识」要求：组织应获取和管控经验教训，避免知识流失", { x: 0.5, y: 4.85, w: 9.0, h: 0.55, fontSize: 12.5, bold: true, color: C.tealDk, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
})();

// ============================================================
// Slide 9: Section 2 标题 - 七项质量管理原则
// ============================================================
(function buildSection2Title() {
  const slide = pres.addSlide();
  slide.background = { color: C.orange };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 3.6, h: 5.625, fill: { color: "B45309" }, line: { color: "B45309" } });
  slide.addShape(pres.shapes.OVAL, { x: 1.0, y: 3.2, w: 2.4, h: 2.4, fill: { color: "B45309" }, line: { color: "B45309" } });
  slide.addShape(pres.shapes.OVAL, { x: 0.2, y: 0.3, w: 0.9, h: 0.9, fill: { color: C.orange }, line: { color: C.orange } });

  slide.addText("02", { x: 0.3, y: 1.0, w: 3.0, h: 1.5, fontSize: 100, bold: true, color: C.white, fontFace: "Arial Black", align: "center", margin: 0 });
  slide.addText("七项质量管理原则", { x: 3.9, y: 1.1, w: 5.8, h: 1.0, fontSize: 38, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
  slide.addText("ISO 9001:2015的核心理念与行动指南", { x: 3.9, y: 2.2, w: 5.8, h: 0.5, fontSize: 14, color: "FDEBD3", fontFace: "Microsoft YaHei", align: "left", margin: 0 });
  slide.addShape(pres.shapes.RECTANGLE, { x: 3.9, y: 2.85, w: 4.5, h: 0.06, fill: { color: C.white }, line: { color: C.white } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 3.9, y: 3.1, w: 4.2, h: 0.52, fill: { color: "B45309" }, line: { color: "B45309" } });
  slide.addText("以顾客为中心 · 领导作用 · 全员参与 · 过程方法", { x: 3.9, y: 3.1, w: 4.2, h: 0.52, fontSize: 10, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });

  slide.addShape(pres.shapes.OVAL, { x: 7.2, y: 3.0, w: 2.0, h: 2.0, fill: { color: "B45309" }, line: { color: "B45309" } });
  slide.addShape(pres.shapes.OVAL, { x: 7.55, y: 3.35, w: 1.3, h: 1.3, fill: { color: C.white }, line: { color: C.white } });
  slide.addText("7", { x: 7.2, y: 3.0, w: 2.0, h: 2.0, fontSize: 48, bold: true, color: C.orange, fontFace: "Arial Black", align: "center", valign: "middle", margin: 0 });
})();

// ============================================================
// Slide 10: 原则1 - 以顾客为关注焦点
// ============================================================
(function buildP1() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.1, h: 0.8, fill: { color: C.orange }, line: { color: C.orange } });
  slide.addText("原则1：以顾客为关注焦点", { x: 0.3, y: 0, w: 9.4, h: 0.8, fontSize: 20, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.92, w: 9.4, h: 0.95, fill: { color: C.orangeLt }, line: { color: C.orange, pt: 2 } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.92, w: 0.1, h: 0.95, fill: { color: C.orange }, line: { color: C.orange } });
  slide.addText("首要目标：满足顾客要求，持续超越顾客期望", { x: 0.55, y: 0.95, w: 8.9, h: 0.42, fontSize: 13.5, bold: true, color: "B45309", fontFace: "Microsoft YaHei", align: "left", margin: 0 });
  slide.addText("顾客是组织存在的基础——没有顾客，组织便失去存在的意义", { x: 0.55, y: 1.38, w: 8.9, h: 0.42, fontSize: 12, color: C.dark, fontFace: "Microsoft YaHei", align: "left", margin: 0 });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 2.05, w: 0.08, h: 0.38, fill: { color: C.orange }, line: { color: C.orange } });
  slide.addText("关键行动", { x: 0.5, y: 2.05, w: 2, h: 0.38, fontSize: 14, bold: true, color: C.dark, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  const actions = [
    { num: "①", text: "深入理解顾客当前和未来的需求与期望" },
    { num: "②", text: "确保质量目标与顾客需求保持一致" },
    { num: "③", text: "主动测量顾客满意度，反馈到改进决策" },
    { num: "④", text: "管理系统地管理顾客关系与投诉" },
  ];
  actions.forEach((a, i) => {
    const y = 2.52 + i * 0.65;
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y, w: 9.4, h: 0.58, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 } });
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y, w: 0.55, h: 0.58, fill: { color: C.orange }, line: { color: C.orange } });
    slide.addText(a.num, { x: 0.3, y, w: 0.55, h: 0.58, fontSize: 15, bold: true, color: C.white, fontFace: "Arial Black", align: "center", valign: "middle", margin: 0 });
    slide.addText(a.text, { x: 1.0, y, w: 8.5, h: 0.58, fontSize: 13, color: C.dark, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
  });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 4.85, w: 9.4, h: 0.55, fill: { color: C.tealDk }, line: { color: C.tealDk } });
  slide.addText("📌 制造业场景示例：MIM产品需根据客户规格书定制，关注CPK、良率、交付及时率等KPI", { x: 0.5, y: 4.85, w: 9.0, h: 0.55, fontSize: 12, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
})();

// ============================================================
// Slide 11: 原则2 - 领导作用
// ============================================================
(function buildP2() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.1, h: 0.8, fill: { color: C.orange }, line: { color: C.orange } });
  slide.addText("原则2：领导作用", { x: 0.3, y: 0, w: 9.4, h: 0.8, fontSize: 20, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.92, w: 9.4, h: 0.95, fill: { color: C.orangeLt }, line: { color: C.orange, pt: 2 } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.92, w: 0.1, h: 0.95, fill: { color: C.orange }, line: { color: C.orange } });
  slide.addText("核心：各级领导建立统一宗旨和方向，创造并保持让员工充分参与的内部环境", { x: 0.55, y: 0.95, w: 8.9, h: 0.88, fontSize: 13.5, bold: true, color: "B45309", fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  const actions = [
    { num: "①", text: "制定并传播质量方针，确保全员理解并执行" },
    { num: "②", text: "设定质量目标并分解到各层级，保障资源到位" },
    { num: "③", text: "以身作则，营造诚信、尊重、协作的组织文化" },
    { num: "④", text: "表彰员工贡献，建立公平有效的绩效激励机制" },
  ];
  actions.forEach((a, i) => {
    const y = 2.05 + i * 0.68;
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y, w: 9.4, h: 0.6, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 } });
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y, w: 0.55, h: 0.6, fill: { color: C.orange }, line: { color: C.orange } });
    slide.addText(a.num, { x: 0.3, y, w: 0.55, h: 0.6, fontSize: 15, bold: true, color: C.white, fontFace: "Arial Black", align: "center", valign: "middle", margin: 0 });
    slide.addText(a.text, { x: 1.0, y, w: 8.5, h: 0.6, fontSize: 13, color: C.dark, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
  });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 4.82, w: 9.4, h: 0.58, fill: { color: C.tealDk }, line: { color: C.tealDk } });
  slide.addText("📌 常见误区：领导只关注结果、不参与过程；质量方针只是墙上标语，从未落实", { x: 0.5, y: 4.82, w: 9.0, h: 0.58, fontSize: 12, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
})();

// ============================================================
// Slide 12: 原则3 - 全员积极参与
// ============================================================
(function buildP3() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.1, h: 0.8, fill: { color: C.orange }, line: { color: C.orange } });
  slide.addText("原则3：全员积极参与", { x: 0.3, y: 0, w: 9.4, h: 0.8, fontSize: 20, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.92, w: 9.4, h: 0.95, fill: { color: C.orangeLt }, line: { color: C.orange, pt: 2 } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.92, w: 0.1, h: 0.95, fill: { color: C.orange }, line: { color: C.orange } });
  slide.addText("核心理念：各级人员都是组织之本——只有员工真正参与，质量才有保障", { x: 0.55, y: 0.95, w: 8.9, h: 0.88, fontSize: 13.5, bold: true, color: "B45309", fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  const actions = [
    { num: "①", text: "让每位员工理解自身贡献对质量目标的重要性" },
    { num: "②", text: "识别工作制约条件并主动推动改善，而非被动等待指令" },
    { num: "③", text: "评估个人绩效，给予培训发展机会，建立成长通道" },
    { num: "④", text: "鼓励质量改进提案文化，对主动发现问题者给予激励" },
  ];
  actions.forEach((a, i) => {
    const y = 2.05 + i * 0.68;
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y, w: 9.4, h: 0.6, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 } });
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y, w: 0.55, h: 0.6, fill: { color: C.orange }, line: { color: C.orange } });
    slide.addText(a.num, { x: 0.3, y, w: 0.55, h: 0.6, fontSize: 15, bold: true, color: C.white, fontFace: "Arial Black", align: "center", valign: "middle", margin: 0 });
    slide.addText(a.text, { x: 1.0, y, w: 8.5, h: 0.6, fontSize: 13, color: C.dark, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
  });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 4.82, w: 9.4, h: 0.58, fill: { color: C.green }, line: { color: C.green } });
  slide.addText("💡 实践工具：QCC小组、质量圈、改进提案制度、合理化建议", { x: 0.5, y: 4.82, w: 9.0, h: 0.58, fontSize: 12, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
})();

// ============================================================
// Slide 13: 原则4 - 过程方法
// ============================================================
(function buildP4() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.1, h: 0.8, fill: { color: C.orange }, line: { color: C.orange } });
  slide.addText("原则4：过程方法", { x: 0.3, y: 0, w: 9.4, h: 0.8, fontSize: 20, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.92, w: 9.4, h: 0.95, fill: { color: C.orangeLt }, line: { color: C.orange, pt: 2 } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.92, w: 0.1, h: 0.95, fill: { color: C.orange }, line: { color: C.orange } });
  slide.addText("核心：将活动作为相互关联的过程来理解和管理，以实现预期结果", { x: 0.55, y: 0.95, w: 8.9, h: 0.88, fontSize: 13.5, bold: true, color: "B45309", fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  const actions = [
    { num: "①", text: "确定所需的过程及其顺序和相互作用（过程识别与映射）" },
    { num: "②", text: "明确规定过程的职责、权限和义务（职责矩阵RASIC）" },
    { num: "③", text: "监测、分析并有计划地改进关键过程（过程KPI）" },
    { num: "④", text: "消除过程中的非增值活动，持续简化与优化" },
  ];
  actions.forEach((a, i) => {
    const y = 2.05 + i * 0.68;
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y, w: 9.4, h: 0.6, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 } });
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y, w: 0.55, h: 0.6, fill: { color: C.orange }, line: { color: C.orange } });
    slide.addText(a.num, { x: 0.3, y, w: 0.55, h: 0.6, fontSize: 15, bold: true, color: C.white, fontFace: "Arial Black", align: "center", valign: "middle", margin: 0 });
    slide.addText(a.text, { x: 1.0, y, w: 8.5, h: 0.6, fontSize: 13, color: C.dark, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
  });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 4.82, w: 9.4, h: 0.58, fill: { color: C.tealDk }, line: { color: C.tealDk } });
  slide.addText("📌 制造业示例：MIM工艺流程（喂料→注射→脱脂→烧结→后处理）每步均需明确输入输出与检测标准", { x: 0.5, y: 4.82, w: 9.0, h: 0.58, fontSize: 12, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
})();

// ============================================================
// Slide 14: 原则5 - 改进
// ============================================================
(function buildP5() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.1, h: 0.8, fill: { color: C.orange }, line: { color: C.orange } });
  slide.addText("原则5：改进", { x: 0.3, y: 0, w: 9.4, h: 0.8, fontSize: 20, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.92, w: 9.4, h: 0.95, fill: { color: C.orangeLt }, line: { color: C.orange, pt: 2 } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.92, w: 0.1, h: 0.95, fill: { color: C.orange }, line: { color: C.orange } });
  slide.addText("核心理念：持续改进是组织的永恒目标——不进则退，慢进也是退", { x: 0.55, y: 0.95, w: 8.9, h: 0.88, fontSize: 13.5, bold: true, color: "B45309", fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  // 两种改进类型
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 2.05, w: 0.08, h: 0.38, fill: { color: C.orange }, line: { color: C.orange } });
  slide.addText("改进的两种类型", { x: 0.5, y: 2.05, w: 3, h: 0.38, fontSize: 13, bold: true, color: C.dark, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  const types = [
    { title: "突破性改进", desc: "创新、颠覆性变革，如新工艺导入、新产品开发", icon: "🚀", color: C.orange },
    { title: "渐进式改进", desc: "日常优化，持续小幅提升，如Kaizen、精益改善", icon: "📈", color: C.green },
  ];
  types.forEach((t, i) => {
    const x = 0.3 + i * 4.75;
    slide.addShape(pres.shapes.RECTANGLE, { x, y: 2.52, w: 4.55, h: 1.0, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 } });
    slide.addShape(pres.shapes.RECTANGLE, { x, y: 2.52, w: 0.6, h: 1.0, fill: { color: t.color }, line: { color: t.color } });
    slide.addText(t.icon, { x, y: 2.52, w: 0.6, h: 1.0, fontSize: 18, align: "center", valign: "middle", margin: 0 });
    slide.addText(t.title, { x: x + 0.72, y: 2.56, w: 3.6, h: 0.4, fontSize: 13, bold: true, color: t.color, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
    slide.addText(t.desc, { x: x + 0.72, y: 2.95, w: 3.6, h: 0.5, fontSize: 11, color: C.dark, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
  });

  // 底部工具
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 3.72, w: 9.4, h: 0.55, fill: { color: C.tealLt }, line: { color: C.teal, pt: 1 } });
  slide.addText("📌 改进工具：8D报告（重大问题）· 5Why分析（根因挖掘）· FMEA（事前预防）", { x: 0.5, y: 3.72, w: 9.0, h: 0.55, fontSize: 12, color: C.tealDk, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 4.42, w: 9.4, h: 0.55, fill: { color: C.orangeLt }, line: { color: C.orange, pt: 1 } });
  slide.addText("通过PDCA循环实现持续改进 — Plan策划→Do实施→Check检查→Act处置", { x: 0.5, y: 4.42, w: 9.0, h: 0.55, fontSize: 12.5, bold: true, color: "B45309", fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
})();

// ============================================================
// Slide 15: 原则6 - 循证决策
// ============================================================
(function buildP6() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.1, h: 0.8, fill: { color: C.orange }, line: { color: C.orange } });
  slide.addText("原则6：循证决策", { x: 0.3, y: 0, w: 9.4, h: 0.8, fontSize: 20, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.92, w: 9.4, h: 0.95, fill: { color: C.orangeLt }, line: { color: C.orange, pt: 2 } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.92, w: 0.1, h: 0.95, fill: { color: C.orange }, line: { color: C.orange } });
  slide.addText("核心理念：基于数据和信息的分析和评价做出决策——凭感觉拍脑袋是大忌", { x: 0.55, y: 0.95, w: 8.9, h: 0.88, fontSize: 13.5, bold: true, color: "B45309", fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  // 决策步骤
  slide.addText("决策步骤", { x: 0.3, y: 2.05, w: 2, h: 0.38, fontSize: 13, bold: true, color: C.dark, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
  const steps = [
    { num: "①", text: "收集相关数据和信息（检验记录、审核结果、顾客反馈）" },
    { num: "②", text: "分析和评价数据，确保数据真实、完整、有代表性" },
    { num: "③", text: "基于证据（而非猜测或直觉）做出决策" },
    { num: "④", text: "验证决策效果，持续校准决策模型" },
  ];
  steps.forEach((s, i) => {
    const y = 2.5 + i * 0.62;
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y, w: 9.4, h: 0.56, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 } });
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y, w: 0.55, h: 0.56, fill: { color: C.teal }, line: { color: C.teal } });
    slide.addText(s.num, { x: 0.3, y, w: 0.55, h: 0.56, fontSize: 15, bold: true, color: C.white, fontFace: "Arial Black", align: "center", valign: "middle", margin: 0 });
    slide.addText(s.text, { x: 1.0, y, w: 8.5, h: 0.56, fontSize: 12.5, color: C.dark, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
  });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 4.85, w: 9.4, h: 0.55, fill: { color: C.tealDk }, line: { color: C.tealDk } });
  slide.addText("📌 制造业数据实例：良率、CPK、不良率、OEE、交付及时率 — 用数据说话，而非「我觉得」", { x: 0.5, y: 4.85, w: 9.0, h: 0.55, fontSize: 12, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
})();

// ============================================================
// Slide 16: 原则7 - 关系管理
// ============================================================
(function buildP7() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.1, h: 0.8, fill: { color: C.orange }, line: { color: C.orange } });
  slide.addText("原则7：关系管理", { x: 0.3, y: 0, w: 9.4, h: 0.8, fontSize: 20, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.92, w: 9.4, h: 0.95, fill: { color: C.orangeLt }, line: { color: C.orange, pt: 2 } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.92, w: 0.1, h: 0.95, fill: { color: C.orange }, line: { color: C.orange } });
  slide.addText("核心理念：管理与相关方的关系，实现互惠互利——供应商强，则供应链强", { x: 0.55, y: 0.95, w: 8.9, h: 0.88, fontSize: 13.5, bold: true, color: "B45309", fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  // 相关方类型
  const parties = [
    { icon: "🏭", name: "顾客", needs: "质量·交付·价格", color: C.teal },
    { icon: "🚚", name: "供应商", needs: "公平·稳定·合作", color: C.green },
    { icon: "👷", name: "员工", needs: "安全·发展·认可", color: C.orange },
    { icon: "🏛️", name: "监管机构", needs: "合规·法规", color: C.gray },
  ];
  parties.forEach((p, i) => {
    const x = 0.3 + i * 2.3;
    slide.addShape(pres.shapes.RECTANGLE, { x, y: 2.05, w: 2.15, h: 1.3, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 } });
    slide.addShape(pres.shapes.RECTANGLE, { x, y: 2.05, w: 2.15, h: 0.6, fill: { color: p.color }, line: { color: p.color } });
    slide.addText(p.icon + " " + p.name, { x, y: 2.05, w: 2.15, h: 0.6, fontSize: 13, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });
    slide.addText(p.needs, { x, y: 2.68, w: 2.15, h: 0.62, fontSize: 11, color: C.dark, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });
  });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 3.55, w: 9.4, h: 0.55, fill: { color: C.tealLt }, line: { color: C.teal, pt: 1 } });
  slide.addText("💡 供应商关系管理：对关键供应商进行QSA审核、FMEA共享、联合持续改进", { x: 0.5, y: 3.55, w: 9.0, h: 0.55, fontSize: 12, color: C.tealDk, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 4.25, w: 9.4, h: 0.55, fill: { color: C.orangeLt }, line: { color: C.orange, pt: 1 } });
  slide.addText("核心原则：互惠互利，而非零和博弈 — 压榨供应商最终损害的是自身质量", { x: 0.5, y: 4.25, w: 9.0, h: 0.55, fontSize: 12.5, bold: true, color: "B45309", fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
})();

// ============================================================
// Slide 17: Section 3 标题 - PDCA循环
// ============================================================
(function buildSection3Title() {
  const slide = pres.addSlide();
  slide.background = { color: C.teal };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 3.6, h: 5.625, fill: { color: C.tealDk }, line: { color: C.tealDk } });
  slide.addShape(pres.shapes.OVAL, { x: 1.0, y: 3.2, w: 2.4, h: 2.4, fill: { color: C.tealDk }, line: { color: C.tealDk } });
  slide.addShape(pres.shapes.OVAL, { x: 0.2, y: 0.3, w: 0.9, h: 0.9, fill: { color: C.teal }, line: { color: C.teal } });

  slide.addText("03", { x: 0.3, y: 1.0, w: 3.0, h: 1.5, fontSize: 100, bold: true, color: C.white, fontFace: "Arial Black", align: "center", margin: 0 });
  slide.addText("PDCA循环", { x: 3.9, y: 1.1, w: 5.8, h: 1.0, fontSize: 48, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
  slide.addText("Plan · Do · Check · Act  持续改进的核心方法论", { x: 3.9, y: 2.2, w: 5.8, h: 0.5, fontSize: 14, color: C.tealLt, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
  slide.addShape(pres.shapes.RECTANGLE, { x: 3.9, y: 2.85, w: 4.5, h: 0.06, fill: { color: C.white }, line: { color: C.white } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 3.9, y: 3.1, w: 3.5, h: 0.52, fill: { color: C.tealDk }, line: { color: C.tealDk } });
  slide.addText("由戴明博士推广的持续改进环", { x: 3.9, y: 3.1, w: 3.5, h: 0.52, fontSize: 11, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });

  slide.addShape(pres.shapes.OVAL, { x: 7.2, y: 3.0, w: 2.0, h: 2.0, fill: { color: C.tealDk }, line: { color: C.tealDk } });
  slide.addShape(pres.shapes.OVAL, { x: 7.55, y: 3.35, w: 1.3, h: 1.3, fill: { color: C.orange }, line: { color: C.orange } });
  slide.addText("🔄", { x: 7.2, y: 3.0, w: 2.0, h: 2.0, fontSize: 40, align: "center", valign: "middle", margin: 0 });
})();

// ============================================================
// Slide 18: PDCA详解
// ============================================================
(function buildPDCA() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.1, h: 0.8, fill: { color: C.teal }, line: { color: C.teal } });
  slide.addText("PDCA循环详解", { x: 0.3, y: 0, w: 9.4, h: 0.8, fontSize: 20, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  const pdca = [
    { letter: "P", name: "Plan 策划", desc: "确定目标、制定计划、建立流程\n分析现状，找出问题根本原因", color: C.orange, y: 0.92 },
    { letter: "D", name: "Do 实施", desc: "按计划执行实施\n收集过程数据，记录关键信息", color: C.teal, y: 2.32 },
    { letter: "C", name: "Check 检查", desc: "监控测量，核对实际结果与计划目标\n分析偏差，识别改进机会", color: C.green, y: 3.72 },
    { letter: "A", name: "Act 处置", desc: "基于检查结果采取行动\n标准化成功经验，处理遗留问题", color: C.purple, y: 5.12 },
  ];

  pdca.forEach((p, i) => {
    const y = p.y;
    // 左侧大字母
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y, w: 1.2, h: 1.25, fill: { color: p.color }, line: { color: p.color } });
    slide.addText(p.letter, { x: 0.3, y, w: 1.2, h: 1.25, fontSize: 40, bold: true, color: C.white, fontFace: "Arial Black", align: "center", valign: "middle", margin: 0 });
    // 内容卡
    slide.addShape(pres.shapes.RECTANGLE, { x: 1.55, y, w: 8.15, h: 1.25, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 } });
    slide.addShape(pres.shapes.RECTANGLE, { x: 1.55, y, w: 0.08, h: 1.25, fill: { color: p.color }, line: { color: p.color } });
    slide.addText(p.name, { x: 1.75, y: y + 0.08, w: 7.7, h: 0.42, fontSize: 14, bold: true, color: p.color, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
    slide.addText(p.desc, { x: 1.75, y: y + 0.5, w: 7.7, h: 0.7, fontSize: 11.5, color: C.dark, fontFace: "Microsoft YaHei", align: "left", valign: "top", margin: 0 });
    // 箭头
    if (i < 3) {
      slide.addText("↓", { x: 0.3, y: y + 1.18, w: 1.2, h: 0.18, fontSize: 14, bold: true, color: C.gray, align: "center", margin: 0 });
    }
  });

  // 时间不够，只放4项（最后一屏y=5.12高度为0.5，需要裁剪）
  // 重新调整A的y位置
})();

// ============================================================
// Slide 19: PDCA详解（重新布局）
// ============================================================
(function buildPDCA2() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.75, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.1, h: 0.75, fill: { color: C.teal }, line: { color: C.teal } });
  slide.addText("PDCA循环 — 持续改进的动态过程", { x: 0.3, y: 0, w: 9.4, h: 0.75, fontSize: 18, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  const pdca = [
    { letter: "P", name: "Plan 策划", desc: "确定目标和实现目标的路径\n分析现状，识别问题根因", color: C.orange, x: 0.3 },
    { letter: "D", name: "Do 实施", desc: "按照计划执行\n记录过程数据，收集证据", color: C.teal, x: 2.65 },
    { letter: "C", name: "Check 检查", desc: "监控测量，对比目标\n分析偏差，发现改进机会", color: C.green, x: 5.0 },
    { letter: "A", name: "Act 处置", desc: "标准化成功经验\n处理遗留问题，进入下一轮", color: C.purple, x: 7.35 },
  ];

  pdca.forEach((p) => {
    slide.addShape(pres.shapes.RECTANGLE, { x: p.x, y: 0.88, w: 2.2, h: 2.6, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 } });
    slide.addShape(pres.shapes.RECTANGLE, { x: p.x, y: 0.88, w: 2.2, h: 0.75, fill: { color: p.color }, line: { color: p.color } });
    slide.addText(p.letter, { x: p.x, y: 0.88, w: 2.2, h: 0.75, fontSize: 30, bold: true, color: C.white, fontFace: "Arial Black", align: "center", valign: "middle", margin: 0 });
    slide.addText(p.name, { x: p.x + 0.1, y: 1.72, w: 2.0, h: 0.42, fontSize: 12, bold: true, color: p.color, fontFace: "Microsoft YaHei", align: "center", margin: 0 });
    slide.addText(p.desc, { x: p.x + 0.1, y: 2.18, w: 2.0, h: 1.2, fontSize: 11, color: C.dark, fontFace: "Microsoft YaHei", align: "left", valign: "top", margin: 0 });
  });

  // 循环箭头
  const arrowY = 2.4;
  [1.65, 4.0, 6.35].forEach(x => {
    slide.addText("→", { x, y: arrowY, w: 0.95, h: 0.5, fontSize: 22, bold: true, color: C.gray, align: "center", valign: "middle", margin: 0 });
  });
  slide.addText("⟳", { x: 8.4, y: arrowY, w: 0.8, h: 0.5, fontSize: 22, bold: true, color: C.gray, align: "center", valign: "middle", margin: 0 });

  // 底部关键点
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 3.65, w: 9.4, h: 1.7, fill: { color: C.tealLt }, line: { color: C.teal, pt: 1 } });
  slide.addText("🔑 PDCA在ISO 9001中的应用", { x: 0.5, y: 3.72, w: 9.0, h: 0.4, fontSize: 13, bold: true, color: C.tealDk, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
  const points = [
    "体系层面：第4-10章整体应用PDCA循环",
    "过程层面：每个过程（研发/采购/生产/检验）均需PDCA",
    "改进层面：内审发现→纠正措施→验证效果→持续改进",
  ];
  points.forEach((pt, i) => {
    flatCircle(slide, 0.5, y = 4.2 + i * 0.4, 0.22, C.teal);
    slide.addText(pt, { x: 0.85, y: 4.14 + i * 0.4, w: 8.6, h: 0.4, fontSize: 11.5, color: C.dark, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
  });
})();

// ============================================================
// Slide 20: Section 4 标题 - 组织环境与风险思维
// ============================================================
(function buildSection4Title() {
  const slide = pres.addSlide();
  slide.background = { color: C.green };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 3.6, h: 5.625, fill: { color: "1B5E20" }, line: { color: "1B5E20" } });
  slide.addShape(pres.shapes.OVAL, { x: 1.0, y: 3.2, w: 2.4, h: 2.4, fill: { color: "1B5E20" }, line: { color: "1B5E20" } });
  slide.addShape(pres.shapes.OVAL, { x: 0.2, y: 0.3, w: 0.9, h: 0.9, fill: { color: C.green }, line: { color: C.green } });

  slide.addText("04", { x: 0.3, y: 1.0, w: 3.0, h: 1.5, fontSize: 100, bold: true, color: C.white, fontFace: "Arial Black", align: "center", margin: 0 });
  slide.addText("组织环境\n与风险思维", { x: 3.9, y: 0.9, w: 5.8, h: 1.4, fontSize: 36, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
  slide.addText("理解内外部环境 · 识别相关方需求 · 主动管控风险", { x: 3.9, y: 2.4, w: 5.8, h: 0.5, fontSize: 13, color: C.greenLt, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
  slide.addShape(pres.shapes.RECTANGLE, { x: 3.9, y: 3.05, w: 5.0, h: 0.06, fill: { color: C.white }, line: { color: C.white } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 3.9, y: 3.25, w: 4.0, h: 0.5, fill: { color: "1B5E20" }, line: { color: "1B5E20" } });
  slide.addText("2015版新增核心要求", { x: 3.9, y: 3.25, w: 4.0, h: 0.5, fontSize: 12, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });

  slide.addShape(pres.shapes.OVAL, { x: 7.2, y: 3.0, w: 2.0, h: 2.0, fill: { color: "1B5E20" }, line: { color: "1B5E20" } });
  slide.addShape(pres.shapes.OVAL, { x: 7.55, y: 3.35, w: 1.3, h: 1.3, fill: { color: C.white }, line: { color: C.white } });
  slide.addText("⚠", { x: 7.2, y: 3.0, w: 2.0, h: 2.0, fontSize: 48, align: "center", valign: "middle", margin: 0 });
})();

// ============================================================
// Slide 21: 理解组织环境（4.1）
// ============================================================
(function buildOrgContext() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.1, h: 0.8, fill: { color: C.green }, line: { color: C.green } });
  slide.addText("理解组织环境（4.1）— 知己知彼，百战不殆", { x: 0.3, y: 0, w: 9.4, h: 0.8, fontSize: 18, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.92, w: 9.4, h: 0.88, fill: { color: C.greenLt }, line: { color: C.green, pt: 2 } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.92, w: 0.1, h: 0.88, fill: { color: C.green }, line: { color: C.green } });
  slide.addText("核心要求：组织应确定影响质量管理体系的各种因素，包括正面与负面的", { x: 0.55, y: 0.95, w: 8.9, h: 0.8, fontSize: 13.5, bold: true, color: "1B5E20", fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  // 外部环境
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.98, w: 4.5, h: 2.5, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.98, w: 4.5, h: 0.55, fill: { color: C.teal }, line: { color: C.teal } });
  slide.addText("🌍 外部环境因素", { x: 0.3, y: 1.98, w: 4.5, h: 0.55, fontSize: 13, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });
  const extEnv = ["法律法规（环保、劳动）", "市场竞争（对手价格/技术）", "技术进步（自动化、AI）", "经济形势（原材料价格波动）"];
  extEnv.forEach((e, i) => {
    flatCircle(slide, 0.45, y = 2.62 + i * 0.45, 0.22, C.teal);
    slide.addText(e, { x: 0.78, y: 2.57 + i * 0.45, w: 3.8, h: 0.4, fontSize: 11.5, color: C.dark, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
  });

  // 内部环境
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.98, w: 4.5, h: 2.5, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.98, w: 4.5, h: 0.55, fill: { color: C.orange }, line: { color: C.orange } });
  slide.addText("🏢 内部环境因素", { x: 5.2, y: 1.98, w: 4.5, h: 0.55, fontSize: 13, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });
  const intEnv = ["企业文化（质量文化 vs 速度优先）", "资源状况（设备、资金、人员）", "管理流程（职责分工、审批效率）", "技术能力（工艺水平、研发实力）"];
  intEnv.forEach((e, i) => {
    flatCircle(slide, 5.35, y = 2.62 + i * 0.45, 0.22, C.orange);
    slide.addText(e, { x: 5.68, y: 2.57 + i * 0.45, w: 3.8, h: 0.4, fontSize: 11.5, color: C.dark, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
  });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 4.62, w: 9.4, h: 0.78, fill: { color: C.tealDk }, line: { color: C.tealDk } });
  slide.addText("📌 MIM制造业实例：原材料价格波动（外部）+ 设备老化（内部）+ 订单交期压力（外部）都需纳入QMS策划考量", { x: 0.5, y: 4.62, w: 9.0, h: 0.78, fontSize: 12, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
})();

// ============================================================
// Slide 22: 理解相关方需求（4.2）
// ============================================================
(function buildStakeholders() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.1, h: 0.8, fill: { color: C.green }, line: { color: C.green } });
  slide.addText("理解相关方需求（4.2）", { x: 0.3, y: 0, w: 9.4, h: 0.8, fontSize: 20, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.92, w: 9.4, h: 0.88, fill: { color: C.greenLt }, line: { color: C.green, pt: 2 } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.92, w: 0.1, h: 0.88, fill: { color: C.green }, line: { color: C.green } });
  slide.addText("相关方：影响或受质量管理体系影响的个人或组织——需明确其需求并决定应对措施", { x: 0.55, y: 0.95, w: 8.9, h: 0.8, fontSize: 13, bold: true, color: "1B5E20", fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  const parties = [
    { icon: "🏭", name: "顾客", demand: "产品质量稳定\n交付及时\nCPK≥1.33", priority: "★★★★★" },
    { icon: "🚚", name: "供应商", demand: "公平采购\n技术协同\n账期合理", priority: "★★★★" },
    { icon: "👷", name: "员工", demand: "安全生产\n培训机会\n职业发展", priority: "★★★" },
    { icon: "🏛️", name: "监管机构", demand: "合规经营\n证照齐全\n环保达标", priority: "★★★★★" },
  ];

  parties.forEach((p, i) => {
    const x = 0.3 + i * 2.3;
    slide.addShape(pres.shapes.RECTANGLE, { x, y: 2.0, w: 2.15, h: 2.4, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 } });
    slide.addShape(pres.shapes.RECTANGLE, { x, y: 2.0, w: 2.15, h: 0.65, fill: { color: C.green }, line: { color: C.green } });
    slide.addText(p.icon + " " + p.name, { x, y: 2.0, w: 2.15, h: 0.65, fontSize: 13, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });
    slide.addText(p.demand, { x: x + 0.1, y: 2.7, w: 1.95, h: 1.1, fontSize: 10.5, color: C.dark, fontFace: "Microsoft YaHei", align: "left", valign: "top", margin: 0 });
    slide.addText(p.priority, { x, y: 3.85, w: 2.15, h: 0.5, fontSize: 11, color: C.orange, fontFace: "Arial Black", align: "center", valign: "middle", margin: 0 });
  });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 4.55, w: 9.4, h: 0.85, fill: { color: C.greenLt }, line: { color: C.green, pt: 1 } });
  slide.addText("⚠️ 常见错误：只关注顾客，忽视员工/供应商/社区的合理需求——关系管理需要平衡各方利益", { x: 0.5, y: 4.55, w: 9.0, h: 0.85, fontSize: 12.5, bold: true, color: "1B5E20", fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
})();

// ============================================================
// Slide 23: 基于风险的思维
// ============================================================
(function buildRiskThinking() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.1, h: 0.8, fill: { color: C.green }, line: { color: C.green } });
  slide.addText("基于风险的思维 — 预防优于纠正", { x: 0.3, y: 0, w: 9.4, h: 0.8, fontSize: 20, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  // 定义
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.92, w: 9.4, h: 0.88, fill: { color: C.greenLt }, line: { color: C.green, pt: 2 } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.92, w: 0.1, h: 0.88, fill: { color: C.green }, line: { color: C.green } });
  slide.addText("风险：不确定性对预期结果的影响（可能是负面威胁，也可能是正面机遇）", { x: 0.55, y: 0.95, w: 8.9, h: 0.8, fontSize: 13.5, bold: true, color: "1B5E20", fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  // 风险 vs 机遇
  const cards = [
    { title: "⚠️ 风险（负面）", items: ["设备故障导致停产", "供应商断货影响交付", "客户投诉导致索赔", "员工离职导致技术流失"], color: C.orange, x: 0.3 },
    { title: "✨ 机遇（正面）", items: ["新客户开发增加订单", "技术改进提升良率", "竞争对手失误赢得份额", "标准升级建立壁垒"], color: C.green, x: 5.15 },
  ];

  cards.forEach((card) => {
    slide.addShape(pres.shapes.RECTANGLE, { x: card.x, y: 1.98, w: 4.55, h: 2.55, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 } });
    slide.addShape(pres.shapes.RECTANGLE, { x: card.x, y: 1.98, w: 4.55, h: 0.55, fill: { color: card.color }, line: { color: card.color } });
    slide.addText(card.title, { x: card.x, y: 1.98, w: 4.55, h: 0.55, fontSize: 12, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });
    card.items.forEach((item, i) => {
      flatCircle(slide, card.x + 0.15, y = 2.65 + i * 0.46, 0.2, card.color);
      slide.addText(item, { x: card.x + 0.45, y: 2.6 + i * 0.46, w: 3.9, h: 0.42, fontSize: 11, color: C.dark, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
    });
  });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 4.65, w: 9.4, h: 0.75, fill: { color: C.tealDk }, line: { color: C.tealDk } });
  slide.addText("📌 风险应对策略：规避（停止高风险活动）· 减轻（降低发生概率/影响）· 接受（明确残余风险）· 转移（购买保险/外包）", { x: 0.5, y: 4.65, w: 9.0, h: 0.75, fontSize: 11.5, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
})();

// ============================================================
// Slide 24: Section 5 标题 - 质量管理体系结构
// ============================================================
(function buildSection5Title() {
  const slide = pres.addSlide();
  slide.background = { color: C.purple };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 3.6, h: 5.625, fill: { color: "4A148C" }, line: { color: "4A148C" } });
  slide.addShape(pres.shapes.OVAL, { x: 1.0, y: 3.2, w: 2.4, h: 2.4, fill: { color: "4A148C" }, line: { color: "4A148C" } });
  slide.addShape(pres.shapes.OVAL, { x: 0.2, y: 0.3, w: 0.9, h: 0.9, fill: { color: C.purple }, line: { color: C.purple } });

  slide.addText("05", { x: 0.3, y: 1.0, w: 3.0, h: 1.5, fontSize: 100, bold: true, color: C.white, fontFace: "Arial Black", align: "center", margin: 0 });
  slide.addText("质量管理体系结构", { x: 3.9, y: 1.1, w: 5.8, h: 1.0, fontSize: 36, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
  slide.addText("高阶结构（HLS）· ISO 9001:2015十章框架解读", { x: 3.9, y: 2.2, w: 5.8, h: 0.5, fontSize: 13, color: C.purpleLt, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
  slide.addShape(pres.shapes.RECTANGLE, { x: 3.9, y: 2.85, w: 5.0, h: 0.06, fill: { color: C.white }, line: { color: C.white } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 3.9, y: 3.1, w: 3.5, h: 0.52, fill: { color: "4A148C" }, line: { color: "4A148C" } });
  slide.addText("Annex SL — 统一管理体系架构", { x: 3.9, y: 3.1, w: 3.5, h: 0.52, fontSize: 11, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });

  slide.addShape(pres.shapes.OVAL, { x: 7.2, y: 3.0, w: 2.0, h: 2.0, fill: { color: "4A148C" }, line: { color: "4A148C" } });
  slide.addShape(pres.shapes.OVAL, { x: 7.55, y: 3.35, w: 1.3, h: 1.3, fill: { color: C.white }, line: { color: C.white } });
  slide.addText("HLS", { x: 7.2, y: 3.0, w: 2.0, h: 2.0, fontSize: 28, bold: true, color: C.purple, fontFace: "Arial Black", align: "center", valign: "middle", margin: 0 });
})();

// ============================================================
// Slide 25: HLS十章结构
// ============================================================
(function buildHLS() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.1, h: 0.8, fill: { color: C.purple }, line: { color: C.purple } });
  slide.addText("高阶结构（HLS）— 十章框架解读", { x: 0.3, y: 0, w: 9.4, h: 0.8, fontSize: 18, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  const chapters = [
    { ch: "4", name: "组织环境", desc: "内外部因素、相关方", color: C.teal },
    { ch: "5", name: "领导作用", desc: "方针、职责、激励", color: C.orange },
    { ch: "6", name: "策划", desc: "风险机遇、质量目标", color: C.green },
    { ch: "7", name: "支持", desc: "资源、能力、沟通", color: C.purple },
    { ch: "8", name: "运行", desc: "产品服务实现", color: C.teal },
    { ch: "9", name: "绩效评价", desc: "监控测量、内审", color: C.orange },
    { ch: "10", name: "改进", desc: "不符合、纠正、持续", color: C.green },
  ];

  chapters.forEach((c, i) => {
    const col = i < 4 ? 0 : 1;
    const row = i % 4;
    const x = 0.3 + col * 4.9;
    const y = 0.92 + row * 1.12;

    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.7, h: 1.0, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 } });
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.75, h: 1.0, fill: { color: c.color }, line: { color: c.color } });
    slide.addText(c.ch, { x, y, w: 0.75, h: 1.0, fontSize: 20, bold: true, color: C.white, fontFace: "Arial Black", align: "center", valign: "middle", margin: 0 });
    slide.addText(c.name, { x: x + 0.85, y: y + 0.1, w: 3.6, h: 0.45, fontSize: 14, bold: true, color: c.color, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
    slide.addText(c.desc, { x: x + 0.85, y: y + 0.52, w: 3.6, h: 0.4, fontSize: 11, color: C.gray, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
  });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 5.12, w: 9.4, h: 0.38, fill: { color: C.purple }, line: { color: C.purple } });
  slide.addText("统一HLS：ISO 9001/14001/45001等体系可整合为一，减少重复、提升效率", { x: 0.5, y: 5.12, w: 9.0, h: 0.38, fontSize: 11, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
})();

// ============================================================
// Slide 26: Section 6 标题 - 文件化要求
// ============================================================
(function buildSection6Title() {
  const slide = pres.addSlide();
  slide.background = { color: C.gray };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 3.6, h: 5.625, fill: { color: C.grayDk }, line: { color: C.grayDk } });
  slide.addShape(pres.shapes.OVAL, { x: 1.0, y: 3.2, w: 2.4, h: 2.4, fill: { color: C.grayDk }, line: { color: C.grayDk } });
  slide.addShape(pres.shapes.OVAL, { x: 0.2, y: 0.3, w: 0.9, h: 0.9, fill: { color: C.gray }, line: { color: C.gray } });

  slide.addText("06", { x: 0.3, y: 1.0, w: 3.0, h: 1.5, fontSize: 100, bold: true, color: C.white, fontFace: "Arial Black", align: "center", margin: 0 });
  slide.addText("文件化要求", { x: 3.9, y: 1.1, w: 5.8, h: 1.0, font: "Arial Black", fontSize: 42, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
  slide.addText("质量管理体系的文件架构与管理", { x: 3.9, y: 2.2, w: 5.8, h: 0.5, fontSize: 14, color: C.grayLt, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
  slide.addShape(pres.shapes.RECTANGLE, { x: 3.9, y: 2.85, w: 4.5, h: 0.06, fill: { color: C.white }, line: { color: C.white } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 3.9, y: 3.1, w: 3.2, h: 0.52, fill: { color: C.grayDk }, line: { color: C.grayDk } });
  slide.addText("写你所做 · 做你所写 · 记你所做", { x: 3.9, y: 3.1, w: 3.2, h: 0.52, fontSize: 11, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });

  slide.addShape(pres.shapes.OVAL, { x: 7.2, y: 3.0, w: 2.0, h: 2.0, fill: { color: C.grayDk }, line: { color: C.grayDk } });
  slide.addShape(pres.shapes.OVAL, { x: 7.55, y: 3.35, w: 1.3, h: 1.3, fill: { color: C.orange }, line: { color: C.orange } });
  slide.addText("📄", { x: 7.2, y: 3.0, w: 2.0, h: 2.0, fontSize: 40, align: "center", valign: "middle", margin: 0 });
})();

// ============================================================
// Slide 27: 文件化信息
// ============================================================
(function buildDocs() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.1, h: 0.8, fill: { color: C.gray }, line: { color: C.gray } });
  slide.addText("文件化信息 — 必须文件 vs 通常需要", { x: 0.3, y: 0, w: 9.4, h: 0.8, fontSize: 18, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });

  // 必须文件
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.92, w: 4.5, h: 0.55, fill: { color: C.orange }, line: { color: C.orange } });
  slide.addText("📋 必须形成的文件（4项）", { x: 0.3, y: 0.92, w: 4.5, h: 0.55, fontSize: 13, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });

  const must = [
    "质量方针（形成文件）",
    "质量目标（形成文件）",
    "质量管理范围（形成文件）",
    "组织架构与职责分配",
  ];
  must.forEach((m, i) => {
    const y = 1.58 + i * 0.62;
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y, w: 4.5, h: 0.56, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 } });
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y, w: 0.5, h: 0.56, fill: { color: C.orange }, line: { color: C.orange } });
    slide.addText("✓", { x: 0.3, y, w: 0.5, h: 0.56, fontSize: 14, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
    slide.addText(m, { x: 0.9, y, w: 3.7, h: 0.56, fontSize: 12, color: C.dark, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
  });

  // 通常需要
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 0.92, w: 4.5, h: 0.55, fill: { color: C.teal }, line: { color: C.teal } });
  slide.addText("📁 通常需要的文件", { x: 5.2, y: 0.92, w: 4.5, h: 0.55, fontSize: 13, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });

  const usually = [
    "程序文件（内审/不合格控制等）",
    "作业指导书SOP",
    "产品图纸、技术规范",
    "检验记录、测试报告",
    "FMEA、控制计划（制造业）",
    "设备维护记录",
  ];
  usually.forEach((u, i) => {
    const y = 1.55 + i * 0.5;
    slide.addShape(pres.shapes.RECTANGLE, { x: 5.2, y, w: 4.5, h: 0.46, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 } });
    slide.addShape(pres.shapes.RECTANGLE, { x: 5.2, y, w: 0.4, h: 0.46, fill: { color: C.teal }, line: { color: C.teal } });
    slide.addText(u, { x: 5.7, y, w: 3.8, h: 0.46, fontSize: 11, color: C.dark, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
  });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 4.62, w: 9.4, h: 0.78, fill: { color: C.tealLt }, line: { color: C.teal, pt: 1 } });
  slide.addText("💡 文件管理原则：适量、适用、可操作——文件过多会成为负担，文件过少则无法传承。", { x: 0.5, y: 4.62, w: 9.0, h: 0.78, fontSize: 12.5, bold: true, color: C.tealDk, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
})();

// ============================================================
// Slide 28: 要点回顾
// ============================================================
(function buildSummary() {
  const slide = pres.addSlide();
  slide.background = { color: C.dark };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.1, fill: { color: C.teal }, line: { color: C.teal } });
  slide.addText("要点回顾", { x: 0.5, y: 0.25, w: 9, h: 0.6, fontSize: 28, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "left", margin: 0 });
  slide.addText("ISO 9001:2015 核心理念总结", { x: 0.5, y: 0.88, w: 9, h: 0.4, fontSize: 13, color: C.grayLt, fontFace: "Microsoft YaHei", align: "left", margin: 0 });

  const summary = [
    { num: "01", text: "ISO 9001:2015是质量管理的国际标准，采用高阶结构便于多体系整合", color: C.teal },
    { num: "02", text: "七项质量管理原则是ISO 9001的核心理念，贯穿整个标准", color: C.orange },
    { num: "03", text: "PDCA循环是持续改进的核心方法论，贯穿体系所有过程", color: C.teal },
    { num: "04", text: "基于风险的思维要求组织主动识别风险与机遇，提前预防问题", color: C.green },
    { num: "05", text: "文件化是体系运行的证据——写你所做、做你所写、记你所做", color: C.purple },
  ];

  summary.forEach((s, i) => {
    const y = 1.4 + i * 0.78;
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 9, h: 0.7, fill: { color: C.mid }, line: { color: C.mid } });
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 0.75, h: 0.7, fill: { color: s.color }, line: { color: s.color } });
    slide.addText(s.num, { x: 0.5, y, w: 0.75, h: 0.7, fontSize: 16, bold: true, color: C.white, fontFace: "Arial Black", align: "center", valign: "middle", margin: 0 });
    slide.addText(s.text, { x: 1.4, y, w: 7.9, h: 0.7, fontSize: 12.5, color: C.white, fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0 });
  });

  slide.addText("学以致用，主动实践——质量管理的价值在于解决实际问题 🏆", { x: 0.5, y: 5.15, w: 9, h: 0.4, fontSize: 13, bold: true, color: C.orange, fontFace: "Microsoft YaHei", align: "center", margin: 0 });
})();

// ============================================================
// Slide 29: 结尾页
// ============================================================
(function buildEnd() {
  const slide = pres.addSlide();
  slide.background = { color: C.dark };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.1, fill: { color: C.teal }, line: { color: C.teal } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 2.5, y: 0, w: 5, h: 5.625, fill: { color: "0C1E30" }, line: { color: "0C1E30" } });

  slide.addText("THANK YOU", { x: 0.5, y: 1.3, w: 9, h: 1.0, fontSize: 54, bold: true, color: C.white, fontFace: "Arial Black", align: "center", margin: 0 });
  slide.addShape(pres.shapes.RECTANGLE, { x: 3.5, y: 2.5, w: 3, h: 0.06, fill: { color: C.teal }, line: { color: C.teal } });
  slide.addText("谢谢参与 · ISO 9001:2015 质量管理体系", { x: 0.5, y: 2.75, w: 9, h: 0.5, fontSize: 16, color: C.grayLt, fontFace: "Microsoft YaHei", align: "center", margin: 0 });

  // 三个关键词
  [C.teal, C.orange, C.green].forEach((c, i) => {
    slide.addShape(pres.shapes.OVAL, { x: 4.05 + i * 0.65, y: 3.5, w: 0.5, h: 0.5, fill: { color: c }, line: { color: c } });
  });

  slide.addText("来源：质量管理培训资料   2026.04", { x: 0.5, y: 4.9, w: 9, h: 0.4, fontSize: 11, color: C.gray, fontFace: "Microsoft YaHei", align: "center", margin: 0 });
})();

// ============================================================
// 输出
// ============================================================
pres.writeFile({ fileName: "c:/Users/Administrator/WorkBuddy/Claw/ISO9001_2015_质量管理体系_扁平版.pptx" })
  .then(() => console.log("✅ ISO 9001:2015扁平版PPT生成成功！"))
  .catch(err => console.error("❌ 生成失败：", err));