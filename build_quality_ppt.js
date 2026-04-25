// 8D、5Why、FMEA 三大质量工具 PPT 生成脚本
const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "8D、5Why、FMEA 三大质量工具实战应用";

// ===== 配色方案：深蓝主色 + 青色强调 + 白底内容 =====
const C = {
  darkBg:   "1A2E4A",  // 深海蓝 - 封面/节标题背景
  midBg:    "1E4070",  // 中蓝 - 次级背景
  accentA:  "0DB4A0",  // 薄荷绿 - FMEA
  accentB:  "F5A623",  // 金黄 - 5Why
  accentC:  "E84855",  // 红 - 8D
  accentD:  "4E9AF1",  // 天蓝 - 联动/通用
  white:    "FFFFFF",
  lightGray:"F5F7FA",
  gray:     "94A3B8",
  darkText: "1E293B",
  subText:  "475569",
};

const makeShadow = () => ({ type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.12 });

// ============================================================
// 封面幻灯片
// ============================================================
(function buildCover() {
  const slide = pres.addSlide();
  slide.background = { color: C.darkBg };

  // 顶部装饰条
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accentD }, line: { color: C.accentD } });

  // 左侧竖色块
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.06, w: 0.35, h: 5.565, fill: { color: C.midBg }, line: { color: C.midBg } });

  // 三色块横排标识
  const colors = [C.accentA, C.accentB, C.accentC];
  colors.forEach((c, i) => {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.55 + i * 0.55, y: 1.0, w: 0.4, h: 0.4,
      fill: { color: c }, line: { color: c }, shadow: makeShadow()
    });
  });

  // 标题
  slide.addText("8D · 5Why · FMEA", {
    x: 0.55, y: 1.65, w: 8.9, h: 0.85,
    fontSize: 44, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", margin: 0
  });

  // 副标题
  slide.addText("三大质量工具实战应用场景详解", {
    x: 0.55, y: 2.55, w: 8.9, h: 0.55,
    fontSize: 22, bold: false, color: C.accentD,
    fontFace: "Microsoft YaHei", align: "left", margin: 0
  });

  // 说明文字
  slide.addText("事前预防  ·  根源分析  ·  闭环管控  —— 质量人闭眼套用", {
    x: 0.55, y: 3.2, w: 8.9, h: 0.4,
    fontSize: 13, color: C.gray, fontFace: "Microsoft YaHei",
    align: "left", margin: 0
  });

  // 底部信息栏
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.1, w: 10, h: 0.525, fill: { color: C.midBg }, line: { color: C.midBg } });
  slide.addText("来源：质谨致远公众号   作者：Mak Mak   2026.04", {
    x: 0.55, y: 5.1, w: 9, h: 0.525,
    fontSize: 11, color: C.gray, fontFace: "Microsoft YaHei",
    align: "left", valign: "middle", margin: 0
  });
})();

// ============================================================
// 目录幻灯片
// ============================================================
(function buildToc() {
  const slide = pres.addSlide();
  slide.background = { color: C.lightGray };

  // 顶部深色块
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.1, fill: { color: C.darkBg }, line: { color: C.darkBg } });
  slide.addText("目录 CONTENTS", {
    x: 0.5, y: 0, w: 9, h: 1.1,
    fontSize: 26, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0
  });

  const items = [
    { num: "01", title: "为什么需要三大质量工具", sub: "问题与背景", color: C.accentD },
    { num: "02", title: "FMEA — 事前风险防控", sub: "定义 · 场景 · 实操 · 避坑", color: C.accentA },
    { num: "03", title: "5Why — 深挖问题根源", sub: "定义 · 场景 · 实操 · 避坑", color: C.accentB },
    { num: "04", title: "8D — 闭环解决重大问题", sub: "定义 · 场景 · 八步拆解 · 避坑", color: C.accentC },
    { num: "05", title: "三大工具联动使用", sub: "全流程闭环逻辑 · 核心总结", color: C.accentD },
  ];

  items.forEach((item, i) => {
    const y = 1.3 + i * 0.83;
    // 背景卡
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 9, h: 0.72,
      fill: { color: C.white }, line: { color: "E2E8F0", pt: 1 }, shadow: makeShadow()
    });
    // 序号色块
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 0.55, h: 0.72,
      fill: { color: item.color }, line: { color: item.color }
    });
    slide.addText(item.num, {
      x: 0.5, y, w: 0.55, h: 0.72,
      fontSize: 16, bold: true, color: C.white,
      fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0
    });
    // 标题
    slide.addText(item.title, {
      x: 1.2, y: y + 0.08, w: 5.5, h: 0.35,
      fontSize: 15, bold: true, color: C.darkText,
      fontFace: "Microsoft YaHei", align: "left", margin: 0
    });
    slide.addText(item.sub, {
      x: 1.2, y: y + 0.38, w: 5.5, h: 0.25,
      fontSize: 11, color: C.gray,
      fontFace: "Microsoft YaHei", align: "left", margin: 0
    });
  });
})();

// ============================================================
// 引言幻灯片
// ============================================================
(function buildIntro() {
  const slide = pres.addSlide();
  slide.background = { color: C.darkBg };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accentD }, line: { color: C.accentD } });

  slide.addText("01  为什么需要三大质量工具", {
    x: 0.5, y: 0.25, w: 9, h: 0.6,
    fontSize: 24, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", margin: 0
  });

  // 痛点描述
  slide.addText("质量人的困境", {
    x: 0.5, y: 1.0, w: 9, h: 0.4,
    fontSize: 17, bold: true, color: C.accentD,
    fontFace: "Microsoft YaHei", align: "left", margin: 0
  });

  const pains = [
    "背熟了工具流程，却分不清什么时候用、怎么用才落地",
    "把工具用成纸面流程，解决问题浮于表面",
    "问题反复爆发、内审外审频频扣分、跨部门推进寸步难行",
  ];
  const painColors = [C.accentC, C.accentB, C.accentC];
  pains.forEach((p, i) => {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 1.55 + i * 0.72, w: 9, h: 0.58,
      fill: { color: "1E3A5C" }, line: { color: "2A4F78", pt: 1 }
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 1.55 + i * 0.72, w: 0.06, h: 0.58,
      fill: { color: painColors[i] }, line: { color: painColors[i] }
    });
    slide.addText(p, {
      x: 0.7, y: 1.55 + i * 0.72, w: 8.6, h: 0.58,
      fontSize: 13, color: C.white,
      fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0
    });
  });

  // 解决方案说明
  slide.addText("8D、5Why、FMEA 覆盖「事前预防 → 事中分析 → 事后闭环」全流程，三者搭配使用，实现从「被动救火」到「主动管控」的质量升级。", {
    x: 0.5, y: 4.0, w: 9, h: 0.8,
    fontSize: 13, color: C.gray,
    fontFace: "Microsoft YaHei", align: "left", valign: "top", margin: 0
  });
})();

// ============================================================
// FMEA 节标题
// ============================================================
(function buildFmeaTitle() {
  const slide = pres.addSlide();
  slide.background = { color: C.accentA };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 3.5, h: 5.625, fill: { color: "0A9688" }, line: { color: "0A9688" } });

  slide.addText("02", {
    x: 0.3, y: 0.8, w: 2.8, h: 1.2,
    fontSize: 90, bold: true, color: C.white,
    fontFace: "Arial Black", align: "center", valign: "middle", margin: 0
  });

  slide.addText("FMEA", {
    x: 3.8, y: 1.2, w: 5.8, h: 0.9,
    fontSize: 52, bold: true, color: C.white,
    fontFace: "Arial Black", align: "left", margin: 0
  });
  slide.addText("失效模式与影响分析", {
    x: 3.8, y: 2.2, w: 5.8, h: 0.6,
    fontSize: 20, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", margin: 0
  });
  slide.addText("事前预防  ·  扼杀风险于爆发前", {
    x: 3.8, y: 2.95, w: 5.8, h: 0.4,
    fontSize: 14, color: "C8F0EC",
    fontFace: "Microsoft YaHei", align: "left", margin: 0
  });
})();

// ============================================================
// FMEA 核心定义
// ============================================================
(function buildFmeaDef() {
  const slide = pres.addSlide();
  slide.background = { color: C.lightGray };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: C.darkBg }, line: { color: C.darkBg } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.8, w: 0.12, h: 4.825, fill: { color: C.accentA }, line: { color: C.accentA } });
  slide.addText("FMEA — 核心定义与适用场景", {
    x: 0.3, y: 0, w: 9.4, h: 0.8,
    fontSize: 18, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0
  });

  // 定义卡片
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 0.95, w: 9.4, h: 1.05,
    fill: { color: "E6FAF7" }, line: { color: C.accentA, pt: 1.5 }, shadow: makeShadow()
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.95, w: 0.1, h: 1.05, fill: { color: C.accentA }, line: { color: C.accentA } });
  slide.addText("核心定义", {
    x: 0.55, y: 0.95, w: 2, h: 0.4,
    fontSize: 13, bold: true, color: C.accentA,
    fontFace: "Microsoft YaHei", align: "left", margin: 0
  });
  slide.addText("事前预防类工具，通过提前分析产品/流程中潜在的失效模式、评估风险等级、制定预防管控措施，从源头消除质量隐患，属于「未雨绸缪」的管控手段。", {
    x: 0.55, y: 1.35, w: 8.9, h: 0.55,
    fontSize: 12.5, color: C.darkText,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0
  });

  // 适用场景
  slide.addText("✅ 核心适用场景", {
    x: 0.3, y: 2.15, w: 4, h: 0.38,
    fontSize: 14, bold: true, color: C.darkText,
    fontFace: "Microsoft YaHei", align: "left", margin: 0
  });

  const scenes = [
    "新产品研发、设计方案评审、新工艺导入",
    "新供应商准入、新材料试用、生产线改造",
    "客户要求升级、产品迭代、合规标准更新",
    "高频重复发生的制程不良、批量隐患预判",
  ];
  scenes.forEach((s, i) => {
    const col = i < 2 ? 0 : 1;
    const row = i % 2;
    const x = 0.3 + col * 4.85;
    const y = 2.62 + row * 0.72;
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.65, h: 0.62,
      fill: { color: C.white }, line: { color: "CBD5E1", pt: 1 }, shadow: makeShadow()
    });
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.06, h: 0.62, fill: { color: C.accentA }, line: { color: C.accentA } });
    slide.addText(s, {
      x: x + 0.15, y, w: 4.4, h: 0.62,
      fontSize: 12, color: C.darkText,
      fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0
    });
  });
})();

// ============================================================
// FMEA 实操 + 避坑
// ============================================================
(function buildFmeaOps() {
  const slide = pres.addSlide();
  slide.background = { color: C.lightGray };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: C.darkBg }, line: { color: C.darkBg } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.8, w: 0.12, h: 4.825, fill: { color: C.accentA }, line: { color: C.accentA } });
  slide.addText("FMEA — 实战实操要点与避坑提醒", {
    x: 0.3, y: 0, w: 9.4, h: 0.8,
    fontSize: 18, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0
  });

  // 实操要点
  slide.addText("📋 实战实操要点", {
    x: 0.3, y: 0.9, w: 4, h: 0.38,
    fontSize: 14, bold: true, color: C.darkText,
    fontFace: "Microsoft YaHei", align: "left", margin: 0
  });

  const ops = [
    { step: "①", text: "组建跨部门小组（研发、生产、质量、工艺）" },
    { step: "②", text: "拆解产品/流程节点，逐一识别失效点" },
    { step: "③", text: "从严重度、发生度、探测度三维度打分" },
    { step: "④", text: "针对高风险项制定管控措施、明确责任人" },
    { step: "⑤", text: "同步更新控制计划，全程跟踪落地执行" },
  ];
  ops.forEach((op, i) => {
    const y = 1.38 + i * 0.54;
    slide.addShape(pres.shapes.OVAL, {
      x: 0.3, y: y + 0.08, w: 0.38, h: 0.38,
      fill: { color: C.accentA }, line: { color: C.accentA }
    });
    slide.addText(op.step, {
      x: 0.3, y: y + 0.08, w: 0.38, h: 0.38,
      fontSize: 11, bold: true, color: C.white,
      fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0
    });
    slide.addText(op.text, {
      x: 0.78, y, w: 8.8, h: 0.54,
      fontSize: 12.5, color: C.darkText,
      fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0
    });
  });

  // 避坑
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 4.15, w: 9.4, h: 0.9,
    fill: { color: "FFF3CD" }, line: { color: C.accentB, pt: 1 }, shadow: makeShadow()
  });
  slide.addText("⚠️  避坑提醒：", {
    x: 0.5, y: 4.15, w: 2, h: 0.4,
    fontSize: 13, bold: true, color: "B45309",
    fontFace: "Microsoft YaHei", align: "left", margin: 0
  });
  slide.addText("禁止质量部独自完成  |  禁止流于形式  |  禁止只做不落地  |  避免FMEA文件与实际生产脱节", {
    x: 0.5, y: 4.5, w: 9, h: 0.45,
    fontSize: 12, color: "92400E",
    fontFace: "Microsoft YaHei", align: "left", margin: 0
  });
})();

// ============================================================
// 5Why 节标题
// ============================================================
(function build5WhyTitle() {
  const slide = pres.addSlide();
  slide.background = { color: C.accentB };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 3.5, h: 5.625, fill: { color: "C88A0F" }, line: { color: "C88A0F" } });

  slide.addText("03", {
    x: 0.3, y: 0.8, w: 2.8, h: 1.2,
    fontSize: 90, bold: true, color: C.white,
    fontFace: "Arial Black", align: "center", valign: "middle", margin: 0
  });

  slide.addText("5 Why", {
    x: 3.8, y: 1.2, w: 5.8, h: 0.9,
    fontSize: 52, bold: true, color: C.white,
    fontFace: "Arial Black", align: "left", margin: 0
  });
  slide.addText("五个为什么", {
    x: 3.8, y: 2.2, w: 5.8, h: 0.6,
    fontSize: 20, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", margin: 0
  });
  slide.addText("根源分析  ·  拒绝表面整改", {
    x: 3.8, y: 2.95, w: 5.8, h: 0.4,
    fontSize: 14, color: "FDE68A",
    fontFace: "Microsoft YaHei", align: "left", margin: 0
  });
})();

// ============================================================
// 5Why 定义 + 场景
// ============================================================
(function build5WhyDef() {
  const slide = pres.addSlide();
  slide.background = { color: C.lightGray };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: C.darkBg }, line: { color: C.darkBg } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.8, w: 0.12, h: 4.825, fill: { color: C.accentB }, line: { color: C.accentB } });
  slide.addText("5Why — 核心定义与适用场景", {
    x: 0.3, y: 0, w: 9.4, h: 0.8,
    fontSize: 18, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0
  });

  // 定义卡片
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 0.95, w: 9.4, h: 1.05,
    fill: { color: "FFFBEB" }, line: { color: C.accentB, pt: 1.5 }, shadow: makeShadow()
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.95, w: 0.1, h: 1.05, fill: { color: C.accentB }, line: { color: C.accentB } });
  slide.addText("核心定义", {
    x: 0.55, y: 0.95, w: 2, h: 0.4,
    fontSize: 13, bold: true, color: C.accentB,
    fontFace: "Microsoft YaHei", align: "left", margin: 0
  });
  slide.addText("根源分析类工具，通过连续追问「为什么」，穿透问题表象，找到根本原因，而非针对表面现象做临时整改，彻底解决问题反复的痛点。", {
    x: 0.55, y: 1.35, w: 8.9, h: 0.55,
    fontSize: 12.5, color: C.darkText,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0
  });

  // 适用场景
  slide.addText("✅ 核心适用场景", {
    x: 0.3, y: 2.15, w: 4, h: 0.38,
    fontSize: 14, bold: true, color: C.darkText,
    fontFace: "Microsoft YaHei", align: "left", margin: 0
  });

  const scenes = [
    "制程单点不良、局部异常、小型质量事故",
    "设备故障、操作失误、物料异常快速分析",
    "8D报告中根源分析环节（核心配套工具）",
    "日常巡检问题、小范围客户抱怨深度分析",
  ];
  scenes.forEach((s, i) => {
    const col = i < 2 ? 0 : 1;
    const row = i % 2;
    const x = 0.3 + col * 4.85;
    const y = 2.62 + row * 0.72;
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.65, h: 0.62,
      fill: { color: C.white }, line: { color: "CBD5E1", pt: 1 }, shadow: makeShadow()
    });
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.06, h: 0.62, fill: { color: C.accentB }, line: { color: C.accentB } });
    slide.addText(s, {
      x: x + 0.15, y, w: 4.4, h: 0.62,
      fontSize: 12, color: C.darkText,
      fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0
    });
  });
})();

// ============================================================
// 5Why 实操 + 避坑
// ============================================================
(function build5WhyOps() {
  const slide = pres.addSlide();
  slide.background = { color: C.lightGray };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: C.darkBg }, line: { color: C.darkBg } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.8, w: 0.12, h: 4.825, fill: { color: C.accentB }, line: { color: C.accentB } });
  slide.addText("5Why — 实战实操要点与避坑提醒", {
    x: 0.3, y: 0, w: 9.4, h: 0.8,
    fontSize: 18, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0
  });

  // 5Why 链式图示
  slide.addText("📋 追问链路示意", {
    x: 0.3, y: 0.9, w: 4, h: 0.38,
    fontSize: 14, bold: true, color: C.darkText,
    fontFace: "Microsoft YaHei", align: "left", margin: 0
  });

  const whys = ["问题现象", "Why 1 表层原因", "Why 2 中间原因", "Why 3 深层原因", "Why 4 系统原因", "Why 5 根本原因 ✅"];
  const barColors = ["94A3B8", C.accentB, C.accentB, C.accentB, C.accentB, C.accentA];
  whys.forEach((w, i) => {
    const x = 0.3 + i * 1.57;
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.35, w: 1.45, h: 0.58,
      fill: { color: barColors[i] }, line: { color: barColors[i] }
    });
    slide.addText(w, {
      x, y: 1.35, w: 1.45, h: 0.58,
      fontSize: 10, bold: i === 5, color: C.white,
      fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0
    });
    if (i < 5) {
      slide.addShape(pres.shapes.LINE, {
        x: x + 1.45, y: 1.64, w: 0.12, h: 0,
        line: { color: C.gray, width: 1.5 }
      });
    }
  });

  // 实操要点
  slide.addText("📋 实战实操要点", {
    x: 0.3, y: 2.1, w: 4, h: 0.38,
    fontSize: 14, bold: true, color: C.darkText,
    fontFace: "Microsoft YaHei", align: "left", margin: 0
  });

  const ops = [
    "遵循「事实导向」原则，每步追问均基于现场、现物、现实",
    "不主观猜测、不随意甩锅，避免将问题推给「人为因素」",
    "不一定严格追问5次，直到找到「可管控、可整改」的根本原因即可",
    "找到根本原因后，针对性制定整改措施并跟踪落实",
  ];
  ops.forEach((op, i) => {
    const y = 2.58 + i * 0.47;
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: y + 0.1, w: 0.22, h: 0.22, fill: { color: C.accentB }, line: { color: C.accentB } });
    slide.addText(op, {
      x: 0.65, y, w: 9.05, h: 0.47,
      fontSize: 12.5, color: C.darkText,
      fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0
    });
  });

  // 避坑
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 4.55, w: 9.4, h: 0.75,
    fill: { color: "FFF3CD" }, line: { color: C.accentB, pt: 1 }, shadow: makeShadow()
  });
  slide.addText("⚠️  避坑：追问禁止流于形式  |  禁止将原因归咎于「员工不认真」  |  找到根源后必须有对应整改动作", {
    x: 0.5, y: 4.55, w: 9, h: 0.75,
    fontSize: 12, color: "92400E",
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0
  });
})();

// ============================================================
// 8D 节标题
// ============================================================
(function build8DTitle() {
  const slide = pres.addSlide();
  slide.background = { color: C.accentC };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 3.5, h: 5.625, fill: { color: "B8202C" }, line: { color: "B8202C" } });

  slide.addText("04", {
    x: 0.3, y: 0.8, w: 2.8, h: 1.2,
    fontSize: 90, bold: true, color: C.white,
    fontFace: "Arial Black", align: "center", valign: "middle", margin: 0
  });

  slide.addText("8D", {
    x: 3.8, y: 1.2, w: 5.8, h: 0.9,
    fontSize: 64, bold: true, color: C.white,
    fontFace: "Arial Black", align: "left", margin: 0
  });
  slide.addText("八个解决步骤", {
    x: 3.8, y: 2.2, w: 5.8, h: 0.6,
    fontSize: 20, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", margin: 0
  });
  slide.addText("问题闭环  ·  客户投诉 / 批量不良首选", {
    x: 3.8, y: 2.95, w: 5.8, h: 0.4,
    fontSize: 14, color: "FECACA",
    fontFace: "Microsoft YaHei", align: "left", margin: 0
  });
})();

// ============================================================
// 8D 定义 + 场景
// ============================================================
(function build8DDef() {
  const slide = pres.addSlide();
  slide.background = { color: C.lightGray };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: C.darkBg }, line: { color: C.darkBg } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.8, w: 0.12, h: 4.825, fill: { color: C.accentC }, line: { color: C.accentC } });
  slide.addText("8D — 核心定义与适用场景", {
    x: 0.3, y: 0, w: 9.4, h: 0.8,
    fontSize: 18, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 0.95, w: 9.4, h: 1.05,
    fill: { color: "FFF1F2" }, line: { color: C.accentC, pt: 1.5 }, shadow: makeShadow()
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 0.95, w: 0.1, h: 1.05, fill: { color: C.accentC }, line: { color: C.accentC } });
  slide.addText("核心定义", {
    x: 0.55, y: 0.95, w: 2, h: 0.4,
    fontSize: 13, bold: true, color: C.accentC,
    fontFace: "Microsoft YaHei", align: "left", margin: 0
  });
  slide.addText("问题闭环类工具，一套标准化、流程化的问题处理体系，适用于重大、批量、客户投诉类质量问题，全程留痕、跨部门协同、整改闭环，满足客户审核、体系审核要求。", {
    x: 0.55, y: 1.35, w: 8.9, h: 0.55,
    fontSize: 12.5, color: C.darkText,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0
  });

  slide.addText("✅ 核心适用场景", {
    x: 0.3, y: 2.15, w: 4, h: 0.38,
    fontSize: 14, bold: true, color: C.darkText,
    fontFace: "Microsoft YaHei", align: "left", margin: 0
  });

  const scenes = [
    "批量产品不良、重大制程质量事故",
    "客户正式投诉、退货、索赔、审核不符合",
    "重复发生、长期未解决的顽固性质量问题",
    "体系审核重大不符合项整改、专项质量改进",
  ];
  scenes.forEach((s, i) => {
    const col = i < 2 ? 0 : 1;
    const row = i % 2;
    const x = 0.3 + col * 4.85;
    const y = 2.62 + row * 0.72;
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.65, h: 0.62,
      fill: { color: C.white }, line: { color: "CBD5E1", pt: 1 }, shadow: makeShadow()
    });
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.06, h: 0.62, fill: { color: C.accentC }, line: { color: C.accentC } });
    slide.addText(s, {
      x: x + 0.15, y, w: 4.4, h: 0.62,
      fontSize: 12, color: C.darkText,
      fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0
    });
  });
})();

// ============================================================
// 8D 八步拆解
// ============================================================
(function build8DSteps() {
  const slide = pres.addSlide();
  slide.background = { color: C.lightGray };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.75, fill: { color: C.darkBg }, line: { color: C.darkBg } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.75, w: 0.12, h: 4.875, fill: { color: C.accentC }, line: { color: C.accentC } });
  slide.addText("8D — 八大步骤核心拆解", {
    x: 0.3, y: 0, w: 9.4, h: 0.75,
    fontSize: 18, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0
  });

  const steps = [
    { d: "D1", title: "建立跨部门解决小组", desc: "确定成员、分工、职责" },
    { d: "D2", title: "问题描述", desc: "精准量化、明确细节（时间/地点/数量）" },
    { d: "D3", title: "临时遏制措施", desc: "快速止损，防止问题扩散" },
    { d: "D4", title: "根本原因分析", desc: "搭配 5Why 使用，找到真正根源" },
    { d: "D5", title: "制定永久纠正措施", desc: "针对根本原因，系统性解决" },
    { d: "D6", title: "措施落地执行与验证", desc: "执行确认、效果验证" },
    { d: "D7", title: "预防再发", desc: "更新流程 / FMEA / 控制计划" },
    { d: "D8", title: "小组祝贺、闭环结案", desc: "总结经验、正式关闭问题" },
  ];

  steps.forEach((s, i) => {
    const col = i < 4 ? 0 : 1;
    const row = i % 4;
    const x = 0.25 + col * 4.88;
    const y = 0.82 + row * 1.17;
    const isKey = i === 3 || i === 6; // D4/D7 特殊标记

    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.65, h: 1.0,
      fill: { color: isKey ? "FFF8F0" : C.white },
      line: { color: isKey ? C.accentB : "CBD5E1", pt: isKey ? 1.5 : 1 },
      shadow: makeShadow()
    });
    // D标签
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.65, h: 1.0,
      fill: { color: C.accentC }, line: { color: C.accentC }
    });
    slide.addText(s.d, {
      x, y, w: 0.65, h: 1.0,
      fontSize: 15, bold: true, color: C.white,
      fontFace: "Arial Black", align: "center", valign: "middle", margin: 0
    });
    slide.addText(s.title, {
      x: x + 0.75, y: y + 0.08, w: 3.75, h: 0.42,
      fontSize: 13, bold: true, color: C.darkText,
      fontFace: "Microsoft YaHei", align: "left", margin: 0
    });
    slide.addText(s.desc, {
      x: x + 0.75, y: y + 0.5, w: 3.75, h: 0.42,
      fontSize: 11, color: C.subText,
      fontFace: "Microsoft YaHei", align: "left", margin: 0
    });
    if (isKey) {
      slide.addShape(pres.shapes.RECTANGLE, {
        x: x + 4.3, y: y + 0.15, w: 0.28, h: 0.28,
        fill: { color: C.accentB }, line: { color: C.accentB }
      });
      slide.addText("★", {
        x: x + 4.3, y: y + 0.15, w: 0.28, h: 0.28,
        fontSize: 11, color: C.white,
        align: "center", valign: "middle", margin: 0
      });
    }
  });
})();

// ============================================================
// 8D 避坑
// ============================================================
(function build8DPitfalls() {
  const slide = pres.addSlide();
  slide.background = { color: C.lightGray };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: C.darkBg }, line: { color: C.darkBg } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.8, w: 0.12, h: 4.825, fill: { color: C.accentC }, line: { color: C.accentC } });
  slide.addText("8D — 避坑提醒与常见误区", {
    x: 0.3, y: 0, w: 9.4, h: 0.8,
    fontSize: 18, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0
  });

  const pitfalls = [
    { icon: "①", title: "禁止跳过临时遏制（D3）", desc: "问题爆发第一时间必须止损，否则损失持续扩大。许多工程师习惯直接跳到根因分析，这是大忌。" },
    { icon: "②", title: "禁止根因分析敷衍（D4）", desc: "D4 是整个 8D 的灵魂，若根因分析不深入，后续所有纠正措施都是无效的。建议与 5Why 配套使用。" },
    { icon: "③", title: "禁止无预防再发措施（D7）", desc: "仅解决当前问题不够，必须更新流程文件、FMEA、控制计划，防止同类问题在其他产品/工序复发。" },
    { icon: "④", title: "避免 8D 报告沦为形式文件", desc: "8D 最常见的失效就是应付客户——报告写得漂亮，实际整改根本没落地。写 8D 的人要全程负责到底。" },
  ];

  pitfalls.forEach((p, i) => {
    const y = 0.95 + i * 1.1;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.3, y, w: 9.4, h: 0.95,
      fill: { color: C.white }, line: { color: "CBD5E1", pt: 1 }, shadow: makeShadow()
    });
    slide.addShape(pres.shapes.OVAL, {
      x: 0.3, y: y + 0.15, w: 0.65, h: 0.65,
      fill: { color: C.accentC }, line: { color: C.accentC }
    });
    slide.addText(p.icon, {
      x: 0.3, y: y + 0.15, w: 0.65, h: 0.65,
      fontSize: 14, bold: true, color: C.white,
      fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0
    });
    slide.addText(p.title, {
      x: 1.1, y: y + 0.07, w: 8.4, h: 0.38,
      fontSize: 13, bold: true, color: C.accentC,
      fontFace: "Microsoft YaHei", align: "left", margin: 0
    });
    slide.addText(p.desc, {
      x: 1.1, y: y + 0.46, w: 8.4, h: 0.42,
      fontSize: 11.5, color: C.subText,
      fontFace: "Microsoft YaHei", align: "left", margin: 0
    });
  });
})();

// ============================================================
// 三大工具联动 节标题
// ============================================================
(function buildLinkageTitle() {
  const slide = pres.addSlide();
  slide.background = { color: C.darkBg };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accentD }, line: { color: C.accentD } });

  slide.addText("05", {
    x: 0.5, y: 0.6, w: 2, h: 1.2,
    fontSize: 90, bold: true, color: C.midBg,
    fontFace: "Arial Black", align: "left", margin: 0
  });
  slide.addText("三大工具联动使用", {
    x: 0.5, y: 1.9, w: 9, h: 0.75,
    fontSize: 34, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", margin: 0
  });
  slide.addText("质量管控全流程闭环  ·  防控线 + 放大镜 + 闭环器", {
    x: 0.5, y: 2.75, w: 9, h: 0.45,
    fontSize: 15, color: C.accentD,
    fontFace: "Microsoft YaHei", align: "left", margin: 0
  });
})();

// ============================================================
// 三大工具联动逻辑图表
// ============================================================
(function buildLinkage() {
  const slide = pres.addSlide();
  slide.background = { color: C.lightGray };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: C.darkBg }, line: { color: C.darkBg } });
  slide.addText("三大工具联动逻辑 — 质量管控全流程闭环", {
    x: 0.3, y: 0, w: 9.4, h: 0.8,
    fontSize: 18, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0
  });

  const tools = [
    {
      color: C.accentA, phase: "事前", tool: "FMEA",
      role: "防控线", desc: "风险预防，提前规避潜在问题，减少异常发生",
      tag: "失效模式与影响分析", x: 0.3
    },
    {
      color: C.accentB, phase: "事中", tool: "5Why",
      role: "放大镜", desc: "根源分析，快速定位问题本质，精准制定整改方案",
      tag: "五个为什么", x: 3.48
    },
    {
      color: C.accentC, phase: "事后", tool: "8D",
      role: "闭环器", desc: "闭环管控，重大问题标准化处理，彻底杜绝问题复发",
      tag: "八个解决步骤", x: 6.65
    },
  ];

  tools.forEach((t) => {
    // 卡片
    slide.addShape(pres.shapes.RECTANGLE, {
      x: t.x, y: 0.88, w: 3.05, h: 4.38,
      fill: { color: C.white }, line: { color: "CBD5E1", pt: 1 }, shadow: makeShadow()
    });
    // 顶部色块
    slide.addShape(pres.shapes.RECTANGLE, {
      x: t.x, y: 0.88, w: 3.05, h: 1.1,
      fill: { color: t.color }, line: { color: t.color }
    });
    // 阶段标签背景
    slide.addShape(pres.shapes.RECTANGLE, {
      x: t.x + 0.12, y: 0.9, w: 0.7, h: 0.4,
      fill: { color: "1A2E4A" }, line: { color: "1A2E4A" }
    });
    // 阶段标签
    slide.addText(t.phase, {
      x: t.x + 0.12, y: 0.9, w: 0.7, h: 0.4,
      fontSize: 11, bold: true, color: C.white,
      fontFace: "Microsoft YaHei",
      align: "center", valign: "middle", margin: 0
    });
    // 工具名
    slide.addText(t.tool, {
      x: t.x + 0.12, y: 1.2, w: 2.8, h: 0.6,
      fontSize: 30, bold: true, color: C.white,
      fontFace: "Arial Black", align: "left", margin: 0
    });
    // 角色
    slide.addText(t.role, {
      x: t.x + 0.12, y: 2.08, w: 2.8, h: 0.45,
      fontSize: 18, bold: true, color: t.color,
      fontFace: "Microsoft YaHei", align: "left", margin: 0
    });
    // 标签
    slide.addText(t.tag, {
      x: t.x + 0.12, y: 2.55, w: 2.8, h: 0.36,
      fontSize: 11, color: C.gray,
      fontFace: "Microsoft YaHei", align: "left", margin: 0
    });
    // 描述
    slide.addText(t.desc, {
      x: t.x + 0.12, y: 2.95, w: 2.82, h: 1.05,
      fontSize: 12, color: C.subText,
      fontFace: "Microsoft YaHei", align: "left", valign: "top", margin: 0
    });
    // 箭头连线（中间两个之间）
    if (t.x < 6) {
      slide.addShape(pres.shapes.LINE, {
        x: t.x + 3.05, y: 1.43, w: 0.43, h: 0,
        line: { color: C.gray, width: 1.5 }
      });
    }
  });
})();

// ============================================================
// 核心总结
// ============================================================
(function buildSummary() {
  const slide = pres.addSlide();
  slide.background = { color: C.darkBg };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accentD }, line: { color: C.accentD } });

  slide.addText("核心总结", {
    x: 0.5, y: 0.2, w: 9, h: 0.6,
    fontSize: 28, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "left", margin: 0
  });

  slide.addText("质量工具的核心价值，从来不是会背流程、会写报告，而是真正解决实际问题、降低不良损失、提升管控效率。", {
    x: 0.5, y: 0.92, w: 9, h: 0.55,
    fontSize: 13, color: C.gray,
    fontFace: "Microsoft YaHei", align: "left", margin: 0
  });

  const summaries = [
    { tool: "FMEA", icon: "🛡️", role: "防控线", desc: "守住源头风险，把问题扼杀在爆发前。适用于新产品研发、工艺改造、供应商准入等事前场景。", color: C.accentA },
    { tool: "5Why", icon: "🔍", role: "放大镜", desc: "找准问题根源，拒绝表面整改，配合8D使用效果最佳。适用于日常异常、单点不良快速分析。", color: C.accentB },
    { tool: "8D", icon: "🔁", role: "闭环器", desc: "保障整改落地，重大问题的标准化处理体系。适用于客诉、批量不良、体系审核不符合。", color: C.accentC },
  ];

  summaries.forEach((s, i) => {
    const y = 1.6 + i * 1.22;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 9, h: 1.08,
      fill: { color: "1E3A5C" }, line: { color: "2A4F78", pt: 1 }, shadow: makeShadow()
    });
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 0.08, h: 1.08, fill: { color: s.color }, line: { color: s.color } });
    slide.addText(`${s.icon} ${s.tool}`, {
      x: 0.72, y: y + 0.1, w: 1.5, h: 0.42,
      fontSize: 16, bold: true, color: s.color,
      fontFace: "Microsoft YaHei", align: "left", margin: 0
    });
    slide.addText(`—— ${s.role}`, {
      x: 0.72, y: y + 0.56, w: 1.5, h: 0.35,
      fontSize: 11, color: C.gray,
      fontFace: "Microsoft YaHei", align: "left", margin: 0
    });
    slide.addText(s.desc, {
      x: 2.4, y: y + 0.12, w: 6.9, h: 0.85,
      fontSize: 12.5, color: C.white,
      fontFace: "Microsoft YaHei", align: "left", valign: "middle", margin: 0
    });
  });

  slide.addText("分清场景、联动使用 → 职场升职加薪的核心竞争力 🏆", {
    x: 0.5, y: 5.05, w: 9, h: 0.4,
    fontSize: 13, bold: true, color: C.accentD,
    fontFace: "Microsoft YaHei", align: "center", margin: 0
  });
})();

// ============================================================
// 结尾页
// ============================================================
(function buildEnd() {
  const slide = pres.addSlide();
  slide.background = { color: C.darkBg };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accentD }, line: { color: C.accentD } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 3.5, y: 0, w: 3, h: 5.625, fill: { color: "162030" }, line: { color: "162030" } });

  slide.addText("THANK YOU", {
    x: 0.5, y: 1.5, w: 9, h: 1.0,
    fontSize: 52, bold: true, color: C.white,
    fontFace: "Arial Black", align: "center", margin: 0
  });

  slide.addText("三大质量工具  ·  用透用实", {
    x: 0.5, y: 2.65, w: 9, h: 0.5,
    fontSize: 18, color: C.accentD,
    fontFace: "Microsoft YaHei", align: "center", margin: 0
  });

  slide.addText("来源：质谨致远公众号  作者：Mak Mak  2026.04", {
    x: 0.5, y: 4.8, w: 9, h: 0.4,
    fontSize: 11, color: C.gray,
    fontFace: "Microsoft YaHei", align: "center", margin: 0
  });

  // 三色装饰点
  [C.accentA, C.accentB, C.accentC].forEach((c, i) => {
    slide.addShape(pres.shapes.OVAL, {
      x: 4.42 + i * 0.45, y: 3.5, w: 0.3, h: 0.3,
      fill: { color: c }, line: { color: c }
    });
  });
})();

// 输出文件
pres.writeFile({ fileName: "c:/Users/Administrator/WorkBuddy/Claw/8D_5Why_FMEA_质量工具实战.pptx" })
  .then(() => console.log("✅ PPT 生成成功：8D_5Why_FMEA_质量工具实战.pptx"))
  .catch(err => console.error("❌ 生成失败：", err));
