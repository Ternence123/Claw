// 8D、5Why、FMEA 三大质量工具 PPT — 扁平化风格重制版
const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "8D、5Why、FMEA 三大质量工具实战应用";

// ===== 扁平配色方案 =====
const C = {
  // 主体色系
  dark:     "1E293B",   // 深板岩 - 标题/页眉背景
  mid:      "334155",   // 中板岩
  light:    "F1F5F9",   // 浅灰白 - 内容页背景

  // 工具专属色（扁平纯色）
  fmea:     "0D9488",   // 青绿 - FMEA
  fmeaLt:   "CCFBF1",   // 浅青
  fmeaDk:   "115E59",   // 深青

  why:      "EA580C",   // 橙色 - 5Why
  whyLt:     "FED7AA",   // 浅橙
  whyDk:     "9A3412",   // 深橙

  ed:       "DC2626",   // 红色 - 8D
  edLt:     "FEE2E2",   // 浅红
  edDk:     "991B1B",   // 深红

  link:     "7C3AED",   // 紫色 - 联动
  linkLt:   "EDE9FE",   // 浅紫

  // 功能色
  white:    "FFFFFF",
  gray:     "64748B",
  grayLt:   "E2E8F0",
  grayDk:   "1E293B",
  accent:   "3B82F6",   // 蓝色点缀
  yellow:   "F59E0B",   // 黄色警告
  green:    "10B981",   // 绿色
};

// ============================================================
// 工具函数
// ============================================================
const card = (slide, x, y, w, h, fillColor, borderColor) => {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: fillColor || C.white },
    line: { color: borderColor || C.grayLt, pt: 1 },
  });
};

// 带左侧色条的扁平卡片
const flatCard = (slide, x, y, w, h, accentColor, fillColor) => {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: fillColor || C.white },
    line: { color: C.grayLt, pt: 1 },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.08, h,
    fill: { color: accentColor },
    line: { color: accentColor },
  });
};

// 大号扁平数字
const bigNum = (slide, text, x, y, color, size = 72) => {
  slide.addText(text, {
    x, y, w: 1.5, h: 1.2,
    fontSize: size, bold: true, color,
    fontFace: "Arial Black",
    align: "center", valign: "middle", margin: 0,
  });
};

// 扁平圆形图标
const flatCircle = (slide, x, y, size, fillColor) => {
  slide.addShape(pres.shapes.OVAL, {
    x, y, w: size, h: size,
    fill: { color: fillColor },
    line: { color: fillColor },
  });
};

// 扁平步骤圆
const flatStep = (slide, x, y, size, num, bgColor, textColor) => {
  slide.addShape(pres.shapes.OVAL, {
    x, y, w: size, h: size,
    fill: { color: bgColor },
    line: { color: bgColor },
  });
  slide.addText(num, {
    x, y, w: size, h: size,
    fontSize: size > 0.5 ? 14 : 11, bold: true, color: textColor || C.white,
    fontFace: "Arial Black",
    align: "center", valign: "middle", margin: 0,
  });
};

// ============================================================
// Slide 1: 封面 - 扁平几何风
// ============================================================
(function buildCover() {
  const slide = pres.addSlide();
  slide.background = { color: C.dark };

  // 左侧大色块
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 3.8, h: 5.625,
    fill: { color: C.fmea }, line: { color: C.fmea },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 3.8, y: 0, w: 0.25, h: 5.625,
    fill: { color: C.why }, line: { color: C.why },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 4.05, y: 0, w: 0.25, h: 5.625,
    fill: { color: C.ed }, line: { color: C.ed },
  });

  // 左侧装饰圆形（扁平）
  slide.addShape(pres.shapes.OVAL, {
    x: 1.6, y: 3.6, w: 2.0, h: 2.0,
    fill: { color: C.fmeaDk }, line: { color: C.fmeaDk },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 0.3, y: 0.6, w: 1.2, h: 1.2,
    fill: { color: C.fmeaDk }, line: { color: C.fmeaDk },
  });

  // 左侧文字
  slide.addText("FMEA", {
    x: 0.3, y: 1.85, w: 3.3, h: 0.7,
    fontSize: 38, bold: true, color: C.white,
    fontFace: "Arial Black", align: "center", margin: 0,
  });
  slide.addText("失效模式\n与影响分析", {
    x: 0.3, y: 2.55, w: 3.3, h: 0.8,
    fontSize: 13, color: C.white,
    fontFace: "Microsoft YaHei", align: "center", margin: 0,
  });

  // 右侧主标题
  slide.addText("8D · 5Why · FMEA", {
    x: 4.5, y: 1.1, w: 5.2, h: 1.0,
    fontSize: 42, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", margin: 0,
  });
  slide.addText("三大质量工具实战应用场景详解", {
    x: 4.5, y: 2.1, w: 5.2, h: 0.55,
    fontSize: 17, color: C.fmeaLt,
    fontFace: "Microsoft YaHei", align: "left", margin: 0,
  });

  // 分隔线
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 4.5, y: 2.8, w: 4.5, h: 0.05,
    fill: { color: C.gray }, line: { color: C.gray },
  });

  // 三个工具标签
  const tools = [
    { name: "FMEA", color: C.fmea, x: 4.5 },
    { name: "5Why", color: C.why, x: 6.25 },
    { name: "8D", color: C.ed, x: 8.0 },
  ];
  tools.forEach(t => {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: t.x, y: 3.0, w: 1.5, h: 0.5,
      fill: { color: t.color }, line: { color: t.color },
    });
    slide.addText(t.name, {
      x: t.x, y: 3.0, w: 1.5, h: 0.5,
      fontSize: 14, bold: true, color: C.white,
      fontFace: "Arial Black",
      align: "center", valign: "middle", margin: 0,
    });
  });

  // 底部说明
  slide.addText("事前预防  ·  根源分析  ·  闭环管控", {
    x: 4.5, y: 3.7, w: 5.2, h: 0.4,
    fontSize: 12, color: C.gray,
    fontFace: "Microsoft YaHei", align: "left", margin: 0,
  });
  slide.addText("来源：质谨致远公众号   作者：Mak Mak   2026.04", {
    x: 4.5, y: 5.1, w: 5.2, h: 0.35,
    fontSize: 10, color: C.gray,
    fontFace: "Microsoft YaHei", align: "left", margin: 0,
  });
})();

// ============================================================
// Slide 2: 目录 - 扁平卡片列表
// ============================================================
(function buildToc() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  // 左侧深色导航栏
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 2.4, h: 5.625,
    fill: { color: C.dark }, line: { color: C.dark },
  });
  slide.addText("CONTENTS", {
    x: 0.2, y: 0.5, w: 2.0, h: 0.7,
    fontSize: 24, bold: true, color: C.white,
    fontFace: "Arial Black", align: "left", margin: 0,
  });
  slide.addText("目录", {
    x: 0.2, y: 1.15, w: 2.0, h: 0.5,
    fontSize: 28, bold: true, color: C.fmea,
    fontFace: "Microsoft YaHei", align: "left", margin: 0,
  });

  // 装饰线
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.2, y: 1.75, w: 1.2, h: 0.06,
    fill: { color: C.fmea }, line: { color: C.fmea },
  });

  // 装饰圆
  slide.addShape(pres.shapes.OVAL, {
    x: 1.4, y: 4.0, w: 0.9, h: 0.9,
    fill: { color: C.fmea }, line: { color: C.fmea },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 0.5, y: 4.4, w: 0.5, h: 0.5,
    fill: { color: C.why }, line: { color: C.why },
  });

  const items = [
    { num: "01", title: "为什么需要三大质量工具", sub: "问题与背景", color: C.accent },
    { num: "02", title: "FMEA — 事前风险防控", sub: "定义 · 场景 · 实操 · 避坑", color: C.fmea },
    { num: "03", title: "5Why — 深挖问题根源", sub: "定义 · 场景 · 实操 · 避坑", color: C.why },
    { num: "04", title: "8D — 闭环解决重大问题", sub: "定义 · 场景 · 八步拆解 · 避坑", color: C.ed },
    { num: "05", title: "三大工具联动使用", sub: "全流程闭环逻辑 · 核心总结", color: C.link },
  ];

  items.forEach((item, i) => {
    const y = 0.45 + i * 1.0;
    // 卡片主体
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 2.6, y, w: 7.2, h: 0.88,
      fill: { color: C.white }, line: { color: C.grayLt, pt: 1 },
    });
    // 顶部色带
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 2.6, y, w: 7.2, h: 0.08,
      fill: { color: item.color }, line: { color: item.color },
    });
    // 序号
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 2.6, y, w: 0.72, h: 0.88,
      fill: { color: item.color }, line: { color: item.color },
    });
    slide.addText(item.num, {
      x: 2.6, y, w: 0.72, h: 0.88,
      fontSize: 18, bold: true, color: C.white,
      fontFace: "Arial Black",
      align: "center", valign: "middle", margin: 0,
    });
    // 标题
    slide.addText(item.title, {
      x: 3.5, y: y + 0.12, w: 5.8, h: 0.42,
      fontSize: 14, bold: true, color: C.dark,
      fontFace: "Microsoft YaHei", align: "left", margin: 0,
    });
    slide.addText(item.sub, {
      x: 3.5, y: y + 0.5, w: 5.8, h: 0.28,
      fontSize: 10.5, color: C.gray,
      fontFace: "Microsoft YaHei", align: "left", margin: 0,
    });
  });
})();

// ============================================================
// Slide 3: 引言 - 扁平痛点 + 图标
// ============================================================
(function buildIntro() {
  const slide = pres.addSlide();
  slide.background = { color: C.dark };

  // 顶部标题栏
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.9,
    fill: { color: C.mid }, line: { color: C.mid },
  });
  slide.addText("01", {
    x: 0.4, y: 0.08, w: 0.8, h: 0.7,
    fontSize: 36, bold: true, color: C.accent,
    fontFace: "Arial Black", align: "left", margin: 0,
  });
  slide.addText("为什么需要三大质量工具", {
    x: 1.3, y: 0.08, w: 8, h: 0.7,
    fontSize: 22, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0,
  });

  // 质量人困境标题
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 1.1, w: 0.12, h: 0.5,
    fill: { color: C.ed }, line: { color: C.ed },
  });
  slide.addText("质量人的困境", {
    x: 0.65, y: 1.1, w: 4, h: 0.5,
    fontSize: 16, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0,
  });

  const pains = [
    { icon: "?", text: "背熟了工具流程，却分不清什么时候用、怎么用才落地", color: C.ed },
    { icon: "!", text: "把工具用成纸面流程，解决问题浮于表面", color: C.why },
    { icon: "✕", text: "问题反复爆发、内审外审频频扣分、跨部门推进寸步难行", color: C.ed },
  ];

  pains.forEach((p, i) => {
    const y = 1.7 + i * 0.82;
    // 图标圆
    flatCircle(slide, 0.4, y + 0.1, 0.55, p.color);
    slide.addText(p.icon, {
      x: 0.4, y: y + 0.1, w: 0.55, h: 0.55,
      fontSize: 18, bold: true, color: C.white,
      fontFace: "Arial Black",
      align: "center", valign: "middle", margin: 0,
    });
    // 文字卡片
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 1.1, y, w: 8.5, h: 0.72,
      fill: { color: C.mid }, line: { color: C.mid },
    });
    slide.addText(p.text, {
      x: 1.25, y, w: 8.2, h: 0.72,
      fontSize: 13, color: C.white,
      fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0,
    });
  });

  // 底部解决方案
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 4.25, w: 9.2, h: 0.06,
    fill: { color: C.gray }, line: { color: C.gray },
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 4.5, w: 9.2, h: 0.9,
    fill: { color: C.fmea, transparency: 15 }, line: { color: C.fmea, pt: 1 },
  });
  slide.addText("解决方案", {
    x: 0.6, y: 4.55, w: 1.5, h: 0.35,
    fontSize: 11, bold: true, color: C.fmea,
    fontFace: "Microsoft YaHei", align: "left", margin: 0,
  });
  slide.addText("FMEA（事前）→ 5Why（事中）→ 8D（事后）", {
    x: 0.6, y: 4.88, w: 9, h: 0.42,
    fontSize: 14, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", margin: 0,
  });
})();

// ============================================================
// Slide 4: FMEA 节标题
// ============================================================
(function buildFmeaTitle() {
  const slide = pres.addSlide();
  slide.background = { color: C.fmea };

  // 左侧深色块
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 3.6, h: 5.625,
    fill: { color: C.fmeaDk }, line: { color: C.fmeaDk },
  });

  // 装饰圆形
  slide.addShape(pres.shapes.OVAL, {
    x: 1.0, y: 3.2, w: 2.4, h: 2.4,
    fill: { color: C.fmeaDk }, line: { color: C.fmeaDk },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 0.2, y: 0.3, w: 0.9, h: 0.9,
    fill: { color: C.fmea }, line: { color: C.fmea },
  });

  // 大号序号
  slide.addText("02", {
    x: 0.3, y: 1.0, w: 3.0, h: 1.5,
    fontSize: 100, bold: true, color: C.white,
    fontFace: "Arial Black", align: "center", margin: 0,
  });

  // 工具名
  slide.addText("FMEA", {
    x: 3.9, y: 0.9, w: 5.8, h: 1.0,
    fontSize: 64, bold: true, color: C.white,
    fontFace: "Arial Black", align: "left", margin: 0,
  });
  slide.addText("失效模式与影响分析", {
    x: 3.9, y: 1.95, w: 5.8, h: 0.6,
    fontSize: 20, color: C.fmeaLt,
    fontFace: "Microsoft YaHei", align: "left", margin: 0,
  });

  // 分隔线
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 3.9, y: 2.7, w: 4.0, h: 0.06,
    fill: { color: C.white }, line: { color: C.white },
  });

  // 关键词标签
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 3.9, y: 2.95, w: 2.8, h: 0.52,
    fill: { color: C.fmeaDk }, line: { color: C.fmeaDk },
  });
  slide.addText("事前预防 · 扼杀风险于爆发前", {
    x: 3.9, y: 2.95, w: 2.8, h: 0.52,
    fontSize: 11, bold: true, color: C.white,
    fontFace: "Microsoft YaHei",
    align: "center", valign: "middle", margin: 0,
  });

  // 右侧图标示意：齿轮
  slide.addShape(pres.shapes.OVAL, {
    x: 7.2, y: 3.0, w: 2.0, h: 2.0,
    fill: { color: C.fmeaDk }, line: { color: C.fmeaDk },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 7.55, y: 3.35, w: 1.3, h: 1.3,
    fill: { color: C.fmea }, line: { color: C.fmea },
  });
  slide.addText("防", {
    x: 7.2, y: 3.0, w: 2.0, h: 2.0,
    fontSize: 40, bold: true, color: C.white,
    fontFace: "Microsoft YaHei",
    align: "center", valign: "middle", margin: 0,
  });
})();

// ============================================================
// Slide 5: FMEA 核心定义 + 场景
// ============================================================
(function buildFmeaDef() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  // 页眉
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.8,
    fill: { color: C.dark }, line: { color: C.dark },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.1, h: 0.8,
    fill: { color: C.fmea }, line: { color: C.fmea },
  });
  slide.addText("FMEA — 核心定义与适用场景", {
    x: 0.3, y: 0, w: 9.4, h: 0.8,
    fontSize: 18, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0,
  });

  // 定义区 - 扁平色块
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 0.92, w: 9.4, h: 1.1,
    fill: { color: C.fmeaLt }, line: { color: C.fmea, pt: 2 },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 0.92, w: 0.1, h: 1.1,
    fill: { color: C.fmea }, line: { color: C.fmea },
  });
  slide.addText("核心定义", {
    x: 0.55, y: 0.92, w: 1.8, h: 0.38,
    fontSize: 12, bold: true, color: C.fmeaDk,
    fontFace: "Microsoft YaHei", align: "left", margin: 0,
  });
  slide.addText("事前预防类工具，通过提前分析产品/流程中潜在的失效模式、评估风险等级、制定预防管控措施，从源头消除质量隐患，属于「未雨绸缪」的管控手段。", {
    x: 0.55, y: 1.32, w: 8.9, h: 0.62,
    fontSize: 12.5, color: C.dark,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0,
  });

  // 适用场景标题
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 2.18, w: 0.08, h: 0.4,
    fill: { color: C.fmea }, line: { color: C.fmea },
  });
  slide.addText("核心适用场景", {
    x: 0.5, y: 2.18, w: 3, h: 0.4,
    fontSize: 14, bold: true, color: C.dark,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0,
  });

  // 4个场景 - 扁平2x2网格
  const scenes = [
    { icon: "📐", text: "新产品研发、设计方案评审、新工艺导入" },
    { icon: "🏭", text: "新供应商准入、新材料试用、生产线改造" },
    { icon: "🔄", text: "客户要求升级、产品迭代、合规标准更新" },
    { icon: "⚠️", text: "高频重复发生的制程不良、批量隐患预判" },
  ];

  scenes.forEach((s, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.3 + col * 4.85;
    const y = 2.68 + row * 0.9;

    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.65, h: 0.78,
      fill: { color: C.white }, line: { color: C.grayLt, pt: 1 },
    });
    // 左侧色块
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.65, h: 0.78,
      fill: { color: C.fmea }, line: { color: C.fmea },
    });
    slide.addText(s.icon, {
      x, y, w: 0.65, h: 0.78,
      fontSize: 18,
      align: "center", valign: "middle", margin: 0,
    });
    slide.addText(s.text, {
      x: x + 0.75, y, w: 3.8, h: 0.78,
      fontSize: 12, color: C.dark,
      fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0,
    });
  });

  // 底部工具定位
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 4.72, w: 9.4, h: 0.7,
    fill: { color: C.fmeaDk }, line: { color: C.fmeaDk },
  });
  slide.addText("🛡️ FMEA 定位：事前风控第一道防线 — 新产品 / 新工艺 / 新供应商", {
    x: 0.5, y: 4.72, w: 9, h: 0.7,
    fontSize: 13, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0,
  });
})();

// ============================================================
// Slide 6: FMEA 实操5步骤 + 避坑
// ============================================================
(function buildFmeaOps() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.8,
    fill: { color: C.dark }, line: { color: C.dark },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.1, h: 0.8,
    fill: { color: C.fmea }, line: { color: C.fmea },
  });
  slide.addText("FMEA — 实战实操5步骤", {
    x: 0.3, y: 0, w: 9.4, h: 0.8,
    fontSize: 18, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0,
  });

  const ops = [
    { num: "①", title: "组建跨部门小组", desc: "研发 + 生产 + 质量 + 工艺联合" },
    { num: "②", title: "拆解流程，识别失效点", desc: "逐节点分析潜在失效模式" },
    { num: "③", title: "三维度打分（S/O/D）", desc: "严重度 · 发生度 · 探测度" },
    { num: "④", title: "制定预防管控措施", desc: "明确责任人，设定完成期限" },
    { num: "⑤", title: "同步更新控制计划", desc: "全程跟踪，确保措施落地" },
  ];

  ops.forEach((op, i) => {
    const y = 0.95 + i * 0.7;
    // 步骤编号圆
    flatCircle(slide, 0.3, y + 0.05, 0.55, C.fmea);
    slide.addText(op.num, {
      x: 0.3, y: y + 0.05, w: 0.55, h: 0.55,
      fontSize: 16, bold: true, color: C.white,
      fontFace: "Arial Black",
      align: "center", valign: "middle", margin: 0,
    });
    // 内容卡
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 1.0, y, w: 8.7, h: 0.62,
      fill: { color: C.white }, line: { color: C.grayLt, pt: 1 },
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 1.0, y, w: 0.08, h: 0.62,
      fill: { color: C.fmea }, line: { color: C.fmea },
    });
    slide.addText(op.title, {
      x: 1.2, y: y + 0.04, w: 4.5, h: 0.32,
      fontSize: 13, bold: true, color: C.dark,
      fontFace: "Microsoft YaHei", align: "left", margin: 0,
    });
    slide.addText(op.desc, {
      x: 1.2, y: y + 0.32, w: 8.3, h: 0.28,
      fontSize: 11, color: C.gray,
      fontFace: "Microsoft YaHei", align: "left", margin: 0,
    });
  });

  // 避坑
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 4.55, w: 9.4, h: 0.85,
    fill: { color: C.whyLt }, line: { color: C.why, pt: 2 },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 4.55, w: 0.1, h: 0.85,
    fill: { color: C.why }, line: { color: C.why },
  });
  slide.addText("⚠️ 避坑", {
    x: 0.55, y: 4.58, w: 1.2, h: 0.35,
    fontSize: 12, bold: true, color: C.whyDk,
    fontFace: "Microsoft YaHei", align: "left", margin: 0,
  });
  slide.addText("禁止质量部独自完成  |  禁止流于形式  |  禁止只做不落地  |  避免FMEA文件与实际生产脱节", {
    x: 0.55, y: 4.9, w: 8.9, h: 0.4,
    fontSize: 12, color: C.whyDk,
    fontFace: "Microsoft YaHei", align: "left", margin: 0,
  });
})();

// ============================================================
// Slide 7: 5Why 节标题
// ============================================================
(function build5WhyTitle() {
  const slide = pres.addSlide();
  slide.background = { color: C.why };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 3.6, h: 5.625,
    fill: { color: C.whyDk }, line: { color: C.whyDk },
  });

  slide.addShape(pres.shapes.OVAL, {
    x: 1.0, y: 3.2, w: 2.4, h: 2.4,
    fill: { color: C.whyDk }, line: { color: C.whyDk },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 0.2, y: 0.3, w: 0.9, h: 0.9,
    fill: { color: C.why }, line: { color: C.why },
  });

  slide.addText("03", {
    x: 0.3, y: 1.0, w: 3.0, h: 1.5,
    fontSize: 100, bold: true, color: C.white,
    fontFace: "Arial Black", align: "center", margin: 0,
  });

  slide.addText("5 Why", {
    x: 3.9, y: 0.9, w: 5.8, h: 1.0,
    fontSize: 64, bold: true, color: C.white,
    fontFace: "Arial Black", align: "left", margin: 0,
  });
  slide.addText("五个为什么", {
    x: 3.9, y: 1.95, w: 5.8, h: 0.6,
    fontSize: 20, color: C.whyLt,
    fontFace: "Microsoft YaHei", align: "left", margin: 0,
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 3.9, y: 2.7, w: 4.0, h: 0.06,
    fill: { color: C.white }, line: { color: C.white },
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 3.9, y: 2.95, w: 2.5, h: 0.52,
    fill: { color: C.whyDk }, line: { color: C.whyDk },
  });
  slide.addText("根源分析  ·  拒绝表面整改", {
    x: 3.9, y: 2.95, w: 2.5, h: 0.52,
    fontSize: 11, bold: true, color: C.white,
    fontFace: "Microsoft YaHei",
    align: "center", valign: "middle", margin: 0,
  });

  // 右侧图标：问号金字塔
  slide.addShape(pres.shapes.OVAL, {
    x: 7.2, y: 3.0, w: 2.0, h: 2.0,
    fill: { color: C.whyDk }, line: { color: C.whyDk },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 7.55, y: 3.35, w: 1.3, h: 1.3,
    fill: { color: C.why }, line: { color: C.why },
  });
  slide.addText("溯", {
    x: 7.2, y: 3.0, w: 2.0, h: 2.0,
    fontSize: 40, bold: true, color: C.white,
    fontFace: "Microsoft YaHei",
    align: "center", valign: "middle", margin: 0,
  });
})();

// ============================================================
// Slide 8: 5Why 核心定义 + 场景
// ============================================================
(function build5WhyDef() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.8,
    fill: { color: C.dark }, line: { color: C.dark },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.1, h: 0.8,
    fill: { color: C.why }, line: { color: C.why },
  });
  slide.addText("5Why — 核心定义与适用场景", {
    x: 0.3, y: 0, w: 9.4, h: 0.8,
    fontSize: 18, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0,
  });

  // 定义
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 0.92, w: 9.4, h: 1.1,
    fill: { color: C.whyLt }, line: { color: C.why, pt: 2 },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 0.92, w: 0.1, h: 1.1,
    fill: { color: C.why }, line: { color: C.why },
  });
  slide.addText("核心定义", {
    x: 0.55, y: 0.92, w: 1.8, h: 0.38,
    fontSize: 12, bold: true, color: C.whyDk,
    fontFace: "Microsoft YaHei", align: "left", margin: 0,
  });
  slide.addText("根源分析类工具，通过连续追问「为什么」，穿透问题表象，找到根本原因，而非针对表面现象做临时整改，彻底解决问题反复的痛点。", {
    x: 0.55, y: 1.32, w: 8.9, h: 0.62,
    fontSize: 12.5, color: C.dark,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0,
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 2.18, w: 0.08, h: 0.4,
    fill: { color: C.why }, line: { color: C.why },
  });
  slide.addText("核心适用场景", {
    x: 0.5, y: 2.18, w: 3, h: 0.4,
    fontSize: 14, bold: true, color: C.dark,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0,
  });

  const scenes = [
    { icon: "🔩", text: "制程单点不良、局部异常、小型质量事故" },
    { icon: "⚙️", text: "设备故障、操作失误、物料异常快速分析" },
    { icon: "📋", text: "8D报告中根源分析环节（核心配套工具）" },
    { icon: "🔎", text: "日常巡检问题、小范围客户抱怨深度分析" },
  ];

  scenes.forEach((s, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.3 + col * 4.85;
    const y = 2.68 + row * 0.9;

    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.65, h: 0.78,
      fill: { color: C.white }, line: { color: C.grayLt, pt: 1 },
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.65, h: 0.78,
      fill: { color: C.why }, line: { color: C.why },
    });
    slide.addText(s.icon, {
      x, y, w: 0.65, h: 0.78,
      fontSize: 18,
      align: "center", valign: "middle", margin: 0,
    });
    slide.addText(s.text, {
      x: x + 0.75, y, w: 3.8, h: 0.78,
      fontSize: 12, color: C.dark,
      fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0,
    });
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 4.72, w: 9.4, h: 0.7,
    fill: { color: C.whyDk }, line: { color: C.whyDk },
  });
  slide.addText("🔍 5Why 定位：事中分析利器 — 快速穿透表象，找到可管控的根本原因", {
    x: 0.5, y: 4.72, w: 9, h: 0.7,
    fontSize: 13, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0,
  });
})();

// ============================================================
// Slide 9: 5Why 实操链路 + 避坑
// ============================================================
(function build5WhyOps() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.8,
    fill: { color: C.dark }, line: { color: C.dark },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.1, h: 0.8,
    fill: { color: C.why }, line: { color: C.why },
  });
  slide.addText("5Why — 追问链路与实操要点", {
    x: 0.3, y: 0, w: 9.4, h: 0.8,
    fontSize: 18, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0,
  });

  // 链路图 - 扁平递进条
  slide.addText("追问链路", {
    x: 0.3, y: 0.9, w: 2, h: 0.38,
    fontSize: 13, bold: true, color: C.dark,
    fontFace: "Microsoft YaHei", align: "left", margin: 0,
  });

  const whys = [
    { label: "问题现象", color: C.gray },
    { label: "Why 1", color: C.gray },
    { label: "Why 2", color: C.why },
    { label: "Why 3", color: C.why },
    { label: "Why 4", color: C.why },
    { label: "Why 5 ✅", color: C.fmea },
  ];

  whys.forEach((w, i) => {
    const x = 0.3 + i * 1.57;
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.3, w: 1.45, h: 0.58,
      fill: { color: w.color }, line: { color: w.color },
    });
    slide.addText(w.label, {
      x, y: 1.3, w: 1.45, h: 0.58,
      fontSize: 10, bold: i === 5, color: C.white,
      fontFace: "Microsoft YaHei",
      align: "center", valign: "middle", margin: 0,
    });
    if (i < 5) {
      slide.addText("→", {
        x: x + 1.35, y: 1.3, w: 0.3, h: 0.58,
        fontSize: 14, bold: true, color: C.gray,
        align: "center", valign: "middle", margin: 0,
      });
    }
  });

  // 实操要点
  slide.addText("实操要点", {
    x: 0.3, y: 2.05, w: 2, h: 0.38,
    fontSize: 13, bold: true, color: C.dark,
    fontFace: "Microsoft YaHei", align: "left", margin: 0,
  });

  const ops = [
    "遵循「事实导向」原则，每步追问均基于现场、现物、现实",
    "不主观猜测、不随意甩锅，避免将问题推给「人为因素」",
    "不一定严格追问5次，找到「可管控、可整改」的根本原因即可",
    "找到根本原因后，针对性制定整改措施并跟踪落实",
  ];

  ops.forEach((op, i) => {
    const y = 2.5 + i * 0.5;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.3, y: y + 0.08, w: 0.28, h: 0.28,
      fill: { color: C.why }, line: { color: C.why },
    });
    slide.addText(String(i + 1), {
      x: 0.3, y: y + 0.08, w: 0.28, h: 0.28,
      fontSize: 11, bold: true, color: C.white,
      fontFace: "Arial Black",
      align: "center", valign: "middle", margin: 0,
    });
    slide.addText(op, {
      x: 0.7, y, w: 9, h: 0.5,
      fontSize: 12.5, color: C.dark,
      fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0,
    });
  });

  // 避坑
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 4.6, w: 9.4, h: 0.82,
    fill: { color: C.whyLt }, line: { color: C.why, pt: 2 },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 4.6, w: 0.1, h: 0.82,
    fill: { color: C.why }, line: { color: C.why },
  });
  slide.addText("⚠️ 避坑", {
    x: 0.55, y: 4.62, w: 1.2, h: 0.32,
    fontSize: 12, bold: true, color: C.whyDk,
    fontFace: "Microsoft YaHei", align: "left", margin: 0,
  });
  slide.addText("禁止追问流于形式  |  禁止将原因归咎于「员工不认真」  |  找到根源后必须有对应整改动作", {
    x: 0.55, y: 4.93, w: 8.9, h: 0.38,
    fontSize: 12, color: C.whyDk,
    fontFace: "Microsoft YaHei", align: "left", margin: 0,
  });
})();

// ============================================================
// Slide 10: 8D 节标题
// ============================================================
(function build8DTitle() {
  const slide = pres.addSlide();
  slide.background = { color: C.ed };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 3.6, h: 5.625,
    fill: { color: C.edDk }, line: { color: C.edDk },
  });

  slide.addShape(pres.shapes.OVAL, {
    x: 1.0, y: 3.2, w: 2.4, h: 2.4,
    fill: { color: C.edDk }, line: { color: C.edDk },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 0.2, y: 0.3, w: 0.9, h: 0.9,
    fill: { color: C.ed }, line: { color: C.ed },
  });

  slide.addText("04", {
    x: 0.3, y: 1.0, w: 3.0, h: 1.5,
    fontSize: 100, bold: true, color: C.white,
    fontFace: "Arial Black", align: "center", margin: 0,
  });

  slide.addText("8D", {
    x: 3.9, y: 0.9, w: 5.8, h: 1.0,
    fontSize: 72, bold: true, color: C.white,
    fontFace: "Arial Black", align: "left", margin: 0,
  });
  slide.addText("八个解决步骤", {
    x: 3.9, y: 1.95, w: 5.8, h: 0.6,
    fontSize: 20, color: C.edLt,
    fontFace: "Microsoft YaHei", align: "left", margin: 0,
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 3.9, y: 2.7, w: 4.0, h: 0.06,
    fill: { color: C.white }, line: { color: C.white },
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 3.9, y: 2.95, w: 3.2, h: 0.52,
    fill: { color: C.edDk }, line: { color: C.edDk },
  });
  slide.addText("问题闭环  ·  客诉 / 批量不良首选", {
    x: 3.9, y: 2.95, w: 3.2, h: 0.52,
    fontSize: 11, bold: true, color: C.white,
    fontFace: "Microsoft YaHei",
    align: "center", valign: "middle", margin: 0,
  });

  // 右侧图标：8个节点环
  slide.addShape(pres.shapes.OVAL, {
    x: 7.2, y: 3.0, w: 2.0, h: 2.0,
    fill: { color: C.edDk }, line: { color: C.edDk },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 7.55, y: 3.35, w: 1.3, h: 1.3,
    fill: { color: C.ed }, line: { color: C.ed },
  });
  slide.addText("闭环", {
    x: 7.2, y: 3.0, w: 2.0, h: 2.0,
    fontSize: 32, bold: true, color: C.white,
    fontFace: "Microsoft YaHei",
    align: "center", valign: "middle", margin: 0,
  });
})();

// ============================================================
// Slide 11: 8D 核心定义 + 场景
// ============================================================
(function build8DDef() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.8,
    fill: { color: C.dark }, line: { color: C.dark },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.1, h: 0.8,
    fill: { color: C.ed }, line: { color: C.ed },
  });
  slide.addText("8D — 核心定义与适用场景", {
    x: 0.3, y: 0, w: 9.4, h: 0.8,
    fontSize: 18, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0,
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 0.92, w: 9.4, h: 1.1,
    fill: { color: C.edLt }, line: { color: C.ed, pt: 2 },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 0.92, w: 0.1, h: 1.1,
    fill: { color: C.ed }, line: { color: C.ed },
  });
  slide.addText("核心定义", {
    x: 0.55, y: 0.92, w: 1.8, h: 0.38,
    fontSize: 12, bold: true, color: C.edDk,
    fontFace: "Microsoft YaHei", align: "left", margin: 0,
  });
  slide.addText("问题闭环类工具，一套标准化、流程化的问题处理体系，适用于重大、批量、客户投诉类质量问题，全程留痕、跨部门协同、整改闭环，满足客户审核、体系审核要求。", {
    x: 0.55, y: 1.32, w: 8.9, h: 0.62,
    fontSize: 12.5, color: C.dark,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0,
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 2.18, w: 0.08, h: 0.4,
    fill: { color: C.ed }, line: { color: C.ed },
  });
  slide.addText("核心适用场景", {
    x: 0.5, y: 2.18, w: 3, h: 0.4,
    fontSize: 14, bold: true, color: C.dark,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0,
  });

  const scenes = [
    { icon: "💥", text: "批量产品不良、重大制程质量事故" },
    { icon: "📞", text: "客户正式投诉、退货、索赔、审核不符合" },
    { icon: "🔁", text: "重复发生、长期未解决的顽固性质量问题" },
    { icon: "📝", text: "体系审核重大不符合项整改、专项质量改进" },
  ];

  scenes.forEach((s, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.3 + col * 4.85;
    const y = 2.68 + row * 0.9;

    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.65, h: 0.78,
      fill: { color: C.white }, line: { color: C.grayLt, pt: 1 },
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.65, h: 0.78,
      fill: { color: C.ed }, line: { color: C.ed },
    });
    slide.addText(s.icon, {
      x, y, w: 0.65, h: 0.78,
      fontSize: 18,
      align: "center", valign: "middle", margin: 0,
    });
    slide.addText(s.text, {
      x: x + 0.75, y, w: 3.8, h: 0.78,
      fontSize: 12, color: C.dark,
      fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0,
    });
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 4.72, w: 9.4, h: 0.7,
    fill: { color: C.edDk }, line: { color: C.edDk },
  });
  slide.addText("🔁 8D 定位：事后闭环最终保障 — 客诉 / 批量 / 体系审核不符合", {
    x: 0.5, y: 4.72, w: 9, h: 0.7,
    fontSize: 13, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0,
  });
})();

// ============================================================
// Slide 12: 8D 八步拆解
// ============================================================
(function build8DSteps() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.75,
    fill: { color: C.dark }, line: { color: C.dark },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.1, h: 0.75,
    fill: { color: C.ed }, line: { color: C.ed },
  });
  slide.addText("8D — 八大步骤核心拆解", {
    x: 0.3, y: 0, w: 9.4, h: 0.75,
    fontSize: 18, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0,
  });

  const steps = [
    { d: "D1", title: "建立跨部门解决小组", desc: "确定成员、分工、职责" },
    { d: "D2", title: "问题描述", desc: "精准量化、明确细节（时间/地点/数量）" },
    { d: "D3", title: "临时遏制措施", desc: "快速止损，防止问题扩散", key: true },
    { d: "D4", title: "根本原因分析", desc: "搭配 5Why 使用，找到真正根源", key: true },
    { d: "D5", title: "制定永久纠正措施", desc: "针对根本原因，系统性解决" },
    { d: "D6", title: "措施落地执行与验证", desc: "执行确认、效果验证" },
    { d: "D7", title: "预防再发", desc: "更新流程 / FMEA / 控制计划", key: true },
    { d: "D8", title: "小组祝贺、闭环结案", desc: "总结经验、正式关闭问题" },
  ];

  steps.forEach((s, i) => {
    const col = i < 4 ? 0 : 1;
    const row = i % 4;
    const x = 0.25 + col * 4.88;
    const y = 0.82 + row * 1.16;
    const accent = s.key ? C.why : C.ed;

    // 主卡片
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.65, h: 1.02,
      fill: { color: s.key ? C.whyLt : C.white },
      line: { color: s.key ? C.why : C.grayLt, pt: s.key ? 1.5 : 1 },
    });
    // 左侧色条
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.65, h: 1.02,
      fill: { color: accent }, line: { color: accent },
    });
    slide.addText(s.d, {
      x, y, w: 0.65, h: 1.02,
      fontSize: 16, bold: true, color: C.white,
      fontFace: "Arial Black",
      align: "center", valign: "middle", margin: 0,
    });
    slide.addText(s.title, {
      x: x + 0.75, y: y + 0.1, w: 3.7, h: 0.42,
      fontSize: 13, bold: true, color: C.dark,
      fontFace: "Microsoft YaHei", align: "left", margin: 0,
    });
    slide.addText(s.desc, {
      x: x + 0.75, y: y + 0.52, w: 3.7, h: 0.42,
      fontSize: 11, color: C.gray,
      fontFace: "Microsoft YaHei", align: "left", margin: 0,
    });
    if (s.key) {
      slide.addShape(pres.shapes.OVAL, {
        x: x + 4.3, y: y + 0.2, w: 0.28, h: 0.28,
        fill: { color: C.why }, line: { color: C.why },
      });
      slide.addText("★", {
        x: x + 4.3, y: y + 0.2, w: 0.28, h: 0.28,
        fontSize: 10, color: C.white,
        align: "center", valign: "middle", margin: 0,
      });
    }
  });
})();

// ============================================================
// Slide 13: 8D 避坑详解
// ============================================================
(function build8DPitfalls() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.8,
    fill: { color: C.dark }, line: { color: C.dark },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.1, h: 0.8,
    fill: { color: C.ed }, line: { color: C.ed },
  });
  slide.addText("8D — 四大避坑详解", {
    x: 0.3, y: 0, w: 9.4, h: 0.8,
    fontSize: 18, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0,
  });

  const pitfalls = [
    { num: "①", title: "禁止跳过临时遏制（D3）", desc: "问题爆发第一时间必须止损，否则损失持续扩大。许多工程师习惯直接跳到根因分析，这是大忌。", color: C.ed },
    { num: "②", title: "禁止根因分析敷衍（D4）", desc: "D4 是整个 8D 的灵魂，若根因分析不深入，后续所有纠正措施都是无效的。建议与 5Why 配套使用。", color: C.why },
    { num: "③", title: "禁止无预防再发措施（D7）", desc: "仅解决当前问题不够，必须更新流程文件、FMEA、控制计划，防止同类问题在其他产品/工序复发。", color: C.fmea },
    { num: "④", title: "避免 8D 沦为形式文件", desc: "最常见的失效就是应付客户——报告写得漂亮，实际整改根本没落地。写 8D 的人要全程负责到底。", color: C.gray },
  ];

  pitfalls.forEach((p, i) => {
    const y = 0.9 + i * 1.1;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.3, y, w: 9.4, h: 0.98,
      fill: { color: C.white }, line: { color: C.grayLt, pt: 1 },
    });
    // 左侧色块
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.3, y, w: 0.65, h: 0.98,
      fill: { color: p.color }, line: { color: p.color },
    });
    slide.addText(p.num, {
      x: 0.3, y, w: 0.65, h: 0.98,
      fontSize: 18, bold: true, color: C.white,
      fontFace: "Arial Black",
      align: "center", valign: "middle", margin: 0,
    });
    slide.addText(p.title, {
      x: 1.1, y: y + 0.1, w: 8.4, h: 0.38,
      fontSize: 13, bold: true, color: p.color,
      fontFace: "Microsoft YaHei", align: "left", margin: 0,
    });
    slide.addText(p.desc, {
      x: 1.1, y: y + 0.5, w: 8.4, h: 0.4,
      fontSize: 11.5, color: C.gray,
      fontFace: "Microsoft YaHei", align: "left", margin: 0,
    });
  });
})();

// ============================================================
// Slide 14: 三大工具联动 节标题
// ============================================================
(function buildLinkageTitle() {
  const slide = pres.addSlide();
  slide.background = { color: C.link };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.1,
    fill: { color: C.dark }, line: { color: C.dark },
  });

  slide.addText("05", {
    x: 0.5, y: 0.5, w: 2.2, h: 1.3,
    fontSize: 90, bold: true, color: C.dark,
    fontFace: "Arial Black", align: "left", margin: 0,
  });

  slide.addText("三大工具联动使用", {
    x: 0.5, y: 2.0, w: 9, h: 0.8,
    fontSize: 38, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", margin: 0,
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 2.95, w: 6.0, h: 0.06,
    fill: { color: C.white }, line: { color: C.white },
  });

  slide.addText("质量管控全流程闭环  ·  防控线 + 放大镜 + 闭环器", {
    x: 0.5, y: 3.2, w: 9, h: 0.5,
    fontSize: 16, color: C.linkLt,
    fontFace: "Microsoft YaHei", align: "left", margin: 0,
  });

  // 三个工具圆标签
  [C.fmea, C.why, C.ed].forEach((color, i) => {
    slide.addShape(pres.shapes.OVAL, {
      x: 0.5 + i * 1.4, y: 3.9, w: 1.1, h: 1.1,
      fill: { color: C.dark }, line: { color: C.dark },
    });
    slide.addShape(pres.shapes.OVAL, {
      x: 0.58 + i * 1.4, y: 3.98, w: 0.94, h: 0.94,
      fill: { color }, line: { color },
    });
  });
  slide.addText("防", { x: 0.5, y: 3.9, w: 1.1, h: 1.1, fontSize: 20, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });
  slide.addText("溯", { x: 1.9, y: 3.9, w: 1.1, h: 1.1, fontSize: 20, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });
  slide.addText("闭", { x: 3.3, y: 3.9, w: 1.1, h: 1.1, fontSize: 20, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });
})();

// ============================================================
// Slide 15: 三大工具联动逻辑
// ============================================================
(function buildLinkage() {
  const slide = pres.addSlide();
  slide.background = { color: C.light };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.8,
    fill: { color: C.dark }, line: { color: C.dark },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.1, h: 0.8,
    fill: { color: C.link }, line: { color: C.link },
  });
  slide.addText("三大工具联动逻辑 — 质量管控全流程闭环", {
    x: 0.3, y: 0, w: 9.4, h: 0.8,
    fontSize: 18, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0,
  });

  // 时间线背景条
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 1.0, w: 9.4, h: 0.4,
    fill: { color: C.grayLt }, line: { color: C.grayLt },
  });
  ["事前预防", "事中分析", "事后闭环"].forEach((label, i) => {
    slide.addText(label, {
      x: 0.3 + i * 3.2, y: 1.0, w: 3.0, h: 0.4,
      fontSize: 12, bold: true, color: C.dark,
      fontFace: "Microsoft YaHei",
      align: "center", valign: "middle", margin: 0,
    });
  });

  const tools = [
    {
      color: C.fmea, phase: "事前", tool: "FMEA",
      role: "防控线", desc: "风险预防，提前规避潜在问题，减少异常发生",
      tag: "失效模式与影响分析", x: 0.3, icon: "防"
    },
    {
      color: C.why, phase: "事中", tool: "5Why",
      role: "放大镜", desc: "根源分析，快速定位问题本质，精准制定整改方案",
      tag: "五个为什么", x: 3.5, icon: "溯"
    },
    {
      color: C.ed, phase: "事后", tool: "8D",
      role: "闭环器", desc: "闭环管控，重大问题标准化处理，彻底杜绝问题复发",
      tag: "八个解决步骤", x: 6.7, icon: "闭"
    },
  ];

  tools.forEach((t) => {
    // 主卡片
    slide.addShape(pres.shapes.RECTANGLE, {
      x: t.x, y: 1.52, w: 3.05, h: 3.8,
      fill: { color: C.white }, line: { color: C.grayLt, pt: 1 },
    });
    // 顶部色块
    slide.addShape(pres.shapes.RECTANGLE, {
      x: t.x, y: 1.52, w: 3.05, h: 1.15,
      fill: { color: t.color }, line: { color: t.color },
    });
    // 图标圆
    slide.addShape(pres.shapes.OVAL, {
      x: t.x + 0.12, y: 1.62, w: 0.9, h: 0.9,
      fill: { color: C.white, transparency: 20 }, line: { color: C.white, transparency: 20 },
    });
    slide.addText(t.icon, {
      x: t.x + 0.12, y: 1.62, w: 0.9, h: 0.9,
      fontSize: 28, bold: true, color: C.white,
      fontFace: "Microsoft YaHei",
      align: "center", valign: "middle", margin: 0,
    });
    // 阶段标签
    slide.addShape(pres.shapes.RECTANGLE, {
      x: t.x + 1.15, y: 1.68, w: 0.85, h: 0.38,
      fill: { color: C.dark }, line: { color: C.dark },
    });
    slide.addText(t.phase, {
      x: t.x + 1.15, y: 1.68, w: 0.85, h: 0.38,
      fontSize: 11, bold: true, color: C.white,
      fontFace: "Microsoft YaHei",
      align: "center", valign: "middle", margin: 0,
    });
    // 工具名
    slide.addText(t.tool, {
      x: t.x + 1.15, y: 2.12, w: 1.8, h: 0.48,
      fontSize: 26, bold: true, color: C.white,
      fontFace: "Arial Black", align: "left", margin: 0,
    });
    // 角色
    slide.addText(t.role, {
      x: t.x + 0.12, y: 2.78, w: 2.8, h: 0.48,
      fontSize: 18, bold: true, color: t.color,
      fontFace: "Microsoft YaHei", align: "left", margin: 0,
    });
    // 标签
    slide.addText(t.tag, {
      x: t.x + 0.12, y: 3.28, w: 2.8, h: 0.35,
      fontSize: 11, color: C.gray,
      fontFace: "Microsoft YaHei", align: "left", margin: 0,
    });
    // 描述
    slide.addShape(pres.shapes.RECTANGLE, {
      x: t.x + 0.12, y: 3.72, w: 2.8, h: 1.45,
      fill: { color: C.light }, line: { color: C.light },
    });
    slide.addText(t.desc, {
      x: t.x + 0.22, y: 3.8, w: 2.6, h: 1.3,
      fontSize: 12, color: C.dark,
      fontFace: "Microsoft YaHei", align: "left", valign: "top", margin: 0,
    });
    // 箭头（只在前面两个）
    if (t.x < 6) {
      slide.addText("→", {
        x: t.x + 2.95, y: 2.2, w: 0.55, h: 0.8,
        fontSize: 28, bold: true, color: C.gray,
        align: "center", valign: "middle", margin: 0,
      });
    }
  });
})();

// ============================================================
// Slide 16: 核心总结
// ============================================================
(function buildSummary() {
  const slide = pres.addSlide();
  slide.background = { color: C.dark };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.1,
    fill: { color: C.link }, line: { color: C.link },
  });

  slide.addText("核心总结", {
    x: 0.5, y: 0.25, w: 9, h: 0.6,
    fontSize: 28, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", margin: 0,
  });

  slide.addText("质量工具的核心价值，从来不是会背流程、会写报告，而是真正解决实际问题、降低不良损失、提升管控效率。", {
    x: 0.5, y: 0.95, w: 9, h: 0.55,
    fontSize: 12.5, color: C.gray,
    fontFace: "Microsoft YaHei", align: "left", margin: 0,
  });

  const summaries = [
    { tool: "FMEA", icon: "防", role: "防控线", desc: "守住源头风险，把问题扼杀在爆发前。适用于新产品研发、工艺改造、供应商准入等事前场景。", color: C.fmea },
    { tool: "5Why", icon: "溯", role: "放大镜", desc: "找准问题根源，拒绝表面整改，配合8D使用效果最佳。适用于日常异常、单点不良快速分析。", color: C.why },
    { tool: "8D", icon: "闭", role: "闭环器", desc: "保障整改落地，重大问题的标准化处理体系。适用于客诉、批量不良、体系审核不符合。", color: C.ed },
  ];

  summaries.forEach((s, i) => {
    const y = 1.65 + i * 1.22;
    // 主卡
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 9, h: 1.08,
      fill: { color: C.mid }, line: { color: C.mid },
    });
    // 左侧色块
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 1.1, h: 1.08,
      fill: { color: s.color }, line: { color: s.color },
    });
    slide.addText(s.icon, {
      x: 0.5, y, w: 1.1, h: 1.08,
      fontSize: 32, bold: true, color: C.white,
      fontFace: "Microsoft YaHei",
      align: "center", valign: "middle", margin: 0,
    });
    slide.addText(`${s.tool}  —  ${s.role}`, {
      x: 1.75, y: y + 0.12, w: 7.5, h: 0.4,
      fontSize: 15, bold: true, color: s.color,
      fontFace: "Microsoft YaHei", align: "left", margin: 0,
    });
    slide.addText(s.desc, {
      x: 1.75, y: y + 0.55, w: 7.5, h: 0.45,
      fontSize: 12, color: C.white,
      fontFace: "Microsoft YaHei", align: "left", margin: 0,
    });
  });

  slide.addText("分清场景、联动使用 → 职场升职加薪的核心竞争力 🏆", {
    x: 0.5, y: 5.1, w: 9, h: 0.4,
    fontSize: 13, bold: true, color: C.link,
    fontFace: "Microsoft YaHei", align: "center", margin: 0,
  });
})();

// ============================================================
// Slide 17: 结尾页
// ============================================================
(function buildEnd() {
  const slide = pres.addSlide();
  slide.background = { color: C.dark };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.1,
    fill: { color: C.link }, line: { color: C.link },
  });

  // 中央装饰
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 2.5, y: 0, w: 5, h: 5.625,
    fill: { color: "162030" }, line: { color: "162030" },
  });

  slide.addText("THANK YOU", {
    x: 0.5, y: 1.3, w: 9, h: 1.0,
    fontSize: 56, bold: true, color: C.white,
    fontFace: "Arial Black", align: "center", margin: 0,
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 3.5, y: 2.5, w: 3, h: 0.06,
    fill: { color: C.link }, line: { color: C.link },
  });

  slide.addText("三大质量工具  ·  用透用实", {
    x: 0.5, y: 2.75, w: 9, h: 0.5,
    fontSize: 18, color: C.linkLt,
    fontFace: "Microsoft YaHei", align: "center", margin: 0,
  });

  // 三色圆标签
  [C.fmea, C.why, C.ed].forEach((c, i) => {
    slide.addShape(pres.shapes.OVAL, {
      x: 4.05 + i * 0.65, y: 3.5, w: 0.5, h: 0.5,
      fill: { color: c }, line: { color: c },
    });
  });

  slide.addText("来源：质谨致远公众号  作者：Mak Mak  2026.04", {
    x: 0.5, y: 4.9, w: 9, h: 0.4,
    fontSize: 11, color: C.gray,
    fontFace: "Microsoft YaHei", align: "center", margin: 0,
  });
})();

// ============================================================
// 输出文件
// ============================================================
pres.writeFile({ fileName: "c:/Users/Administrator/WorkBuddy/Claw/8D_5Why_FMEA_质量工具实战_扁平版.pptx" })
  .then(() => console.log("✅ 扁平版PPT生成成功：8D_5Why_FMEA_质量工具实战_扁平版.pptx"))
  .catch(err => console.error("❌ 生成失败：", err));
