const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "SPC统计过程控制与3σ原理培训";
pres.author = "WorkBuddy";

// ========== 配色方案 ==========
const C = {
  navy: "1E3A5F",      // 深蓝主色
  blue: "2563EB",       // 蓝色
  teal: "0891B2",       // 青色
  mint: "10B981",        // 薄荷绿
  orange: "F59E0B",      // 橙色
  red: "EF4444",         // 红色
  white: "FFFFFF",
  lightBg: "F1F5F9",    // 浅灰背景
  dark: "1E293B",       // 深色文字
  gray: "64748B",       // 灰色文字
  grayLt: "CBD5E1",     // 浅灰边框
};

// ========== 工具函数 ==========
function makeShadow() {
  return { type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.12 };
}

// ========== Slide 1: 封面 ==========
{
  let slide = pres.addSlide();
  slide.background = { color: C.navy };

  // 顶部装饰条
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.teal } });

  // 主标题
  slide.addText("SPC统计过程控制", {
    x: 0.5, y: 1.6, w: 9, h: 0.9,
    fontSize: 44, bold: true, color: C.white,
    fontFace: "Microsoft YaHei", align: "center", margin: 0
  });
  slide.addText("与 3σ 原理培训", {
    x: 0.5, y: 2.5, w: 9, h: 0.7,
    fontSize: 36, bold: true, color: C.teal,
    fontFace: "Microsoft YaHei", align: "center", margin: 0
  });

  // 分隔线
  slide.addShape(pres.shapes.RECTANGLE, { x: 3.5, y: 3.4, w: 3, h: 0.04, fill: { color: C.teal } });

  // 副标题
  slide.addText("MIM行业质量管理体系", {
    x: 0.5, y: 3.6, w: 9, h: 0.5,
    fontSize: 20, color: "94A3B8", fontFace: "Microsoft YaHei", align: "center", margin: 0
  });

  // 底部标签
  slide.addShape(pres.shapes.RECTANGLE, { x: 3.2, y: 4.6, w: 3.6, h: 0.45, fill: { color: C.teal, transparency: 20 }, line: { color: C.teal } });
  slide.addText("适用对象：生产 / 质量 / 工程部门", {
    x: 3.2, y: 4.6, w: 3.6, h: 0.45,
    fontSize: 12, color: C.teal, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0
  });
}

// ========== Slide 2: 目录 ==========
{
  let slide = pres.addSlide();
  slide.background = { color: C.white };

  // 左侧色块
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: C.navy } });

  // 标题
  slide.addText("培训内容", {
    x: 0.5, y: 0.35, w: 4, h: 0.6,
    fontSize: 28, bold: true, color: C.navy, fontFace: "Microsoft YaHei", margin: 0
  });
  slide.addText("CONTENTS", {
    x: 0.5, y: 0.85, w: 4, h: 0.35,
    fontSize: 12, color: C.gray, fontFace: "Arial", charSpacing: 4, margin: 0
  });

  // 目录项
  const tocItems = [
    { num: "01", title: "正态分布与3σ原理", sub: "68-95-99.7法则、σ直观理解" },
    { num: "02", title: "标准差σ的计算", sub: "公式推导、极差法、手算示例" },
    { num: "03", title: "控制限UCL/LCL的由来", sub: "公式、常数表、实例演练" },
    { num: "04", title: "SPC与6σ的关系", sub: "DMAIC流程、两者的分工" },
    { num: "05", title: "MIM实战案例", sub: "内孔径控制、过程能力分析" },
    { num: "06", title: "要点速记卡", sub: "核心公式、关键数字速记" },
  ];

  tocItems.forEach((item, i) => {
    const col = i < 3 ? 0 : 1;
    const row = i % 3;
    const x = 0.5 + col * 4.8;
    const y = 1.5 + row * 1.3;

    // 编号圆
    slide.addShape(pres.shapes.OVAL, { x, y, w: 0.55, h: 0.55, fill: { color: C.teal }, line: { color: C.teal } });
    slide.addText(item.num, { x, y, w: 0.55, h: 0.55, fontSize: 14, bold: true, color: C.white, fontFace: "Arial", align: "center", valign: "middle", margin: 0 });

    // 标题和副标题
    slide.addText(item.title, { x: x + 0.7, y, w: 3.8, h: 0.35, fontSize: 15, bold: true, color: C.dark, fontFace: "Microsoft YaHei", margin: 0 });
    slide.addText(item.sub, { x: x + 0.7, y: y + 0.35, w: 3.8, h: 0.3, fontSize: 11, color: C.gray, fontFace: "Microsoft YaHei", margin: 0 });
  });

  // 底部说明
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 5.1, w: 9, h: 0.01, fill: { color: C.grayLt } });
  slide.addText("培训时长约 60 分钟  |  前置知识：基础数学（均值、平方根概念）", {
    x: 0.5, y: 5.15, w: 9, h: 0.35, fontSize: 11, color: C.gray, fontFace: "Microsoft YaHei", align: "center", margin: 0
  });
}

// ========== Slide 3: 正态分布与3σ原理 ==========
{
  let slide = pres.addSlide();
  slide.background = { color: C.lightBg };

  // 顶部标题栏
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.navy } });
  slide.addText("01  正态分布与3σ原理", {
    x: 0.5, y: 0.15, w: 9, h: 0.6,
    fontSize: 22, bold: true, color: C.white, fontFace: "Microsoft YaHei", valign: "middle", margin: 0
  });

  // 正态分布曲线区域
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 1.1, w: 5.3, h: 3.6, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 }, shadow: makeShadow() });

  // 曲线标题
  slide.addText("正态分布（钟形曲线）示意", {
    x: 0.6, y: 1.2, w: 5, h: 0.35, fontSize: 12, bold: true, color: C.navy, fontFace: "Microsoft YaHei", margin: 0
  });

  // 手绘正态分布曲线（用多个形状模拟）
  // 中间峰值
  slide.addShape(pres.shapes.OVAL, { x: 2.6, y: 1.7, w: 0.5, h: 0.5, fill: { color: C.teal } });
  slide.addText("μ", { x: 2.6, y: 1.7, w: 0.5, h: 0.5, fontSize: 14, bold: true, color: C.white, fontFace: "Arial", align: "center", valign: "middle", margin: 0 });

  // 3σ标签
  slide.addText("μ-3σ", { x: 0.85, y: 4.1, w: 0.7, h: 0.25, fontSize: 10, color: C.red, fontFace: "Arial", align: "center", margin: 0 });
  slide.addText("μ-2σ", { x: 1.65, y: 4.1, w: 0.7, h: 0.25, fontSize: 10, color: C.orange, fontFace: "Arial", align: "center", margin: 0 });
  slide.addText("μ-1σ", { x: 2.45, y: 4.1, w: 0.7, h: 0.25, fontSize: 10, color: C.mint, fontFace: "Arial", align: "center", margin: 0 });
  slide.addText("μ", { x: 3.25, y: 4.1, w: 0.7, h: 0.25, fontSize: 10, color: C.teal, fontFace: "Arial", align: "center", margin: 0 });
  slide.addText("μ+1σ", { x: 4.05, y: 4.1, w: 0.7, h: 0.25, fontSize: 10, color: C.mint, fontFace: "Arial", align: "center", margin: 0 });
  slide.addText("μ+2σ", { x: 4.85, y: 4.1, w: 0.7, h: 0.25, fontSize: 10, color: C.orange, fontFace: "Arial", align: "center", margin: 0 });
  slide.addText("μ+3σ", { x: 5.6, y: 4.1, w: 0.7, h: 0.25, fontSize: 10, color: C.red, fontFace: "Arial", align: "center", margin: 0 });

  // 3σ说明文字
  slide.addText("σ = 标准差，反映数据的离散程度", {
    x: 0.6, y: 4.4, w: 5, h: 0.25, fontSize: 10, color: C.gray, fontFace: "Microsoft YaHei", margin: 0
  });

  // 右侧68-95-99.7法则
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.9, y: 1.1, w: 3.7, h: 3.6, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 }, shadow: makeShadow() });

  slide.addText("68 - 95 - 99.7 法则", {
    x: 6.1, y: 1.2, w: 3.3, h: 0.4, fontSize: 14, bold: true, color: C.navy, fontFace: "Microsoft YaHei", align: "center", margin: 0
  });

  // 三个数据块
  const rules = [
    { sigma: "±1σ", pct: "68.27%", color: C.mint, prob: "31.73%" },
    { sigma: "±2σ", pct: "95.45%", color: C.orange, prob: "4.55%" },
    { sigma: "±3σ", pct: "99.73%", color: C.teal, prob: "0.27%" },
  ];

  rules.forEach((r, i) => {
    const y = 1.75 + i * 1.0;
    slide.addShape(pres.shapes.RECTANGLE, { x: 6.1, y, w: 3.3, h: 0.85, fill: { color: r.color, transparency: 12 }, line: { color: r.color, pt: 1 } });
    slide.addShape(pres.shapes.RECTANGLE, { x: 6.1, y, w: 0.08, h: 0.85, fill: { color: r.color } });
    slide.addText(r.sigma, { x: 6.3, y: y + 0.08, w: 1.2, h: 0.35, fontSize: 18, bold: true, color: r.color, fontFace: "Arial", margin: 0 });
    slide.addText("包含比例", { x: 7.6, y: y + 0.1, w: 1.6, h: 0.25, fontSize: 10, color: C.gray, fontFace: "Microsoft YaHei", margin: 0 });
    slide.addText(r.pct, { x: 7.6, y: y + 0.35, w: 1.6, h: 0.4, fontSize: 22, bold: true, color: C.dark, fontFace: "Arial Black", margin: 0 });
    slide.addText("区间外: " + r.prob, { x: 6.3, y: y + 0.5, w: 2, h: 0.25, fontSize: 10, color: C.gray, fontFace: "Microsoft YaHei", margin: 0 });
  });

  // 底部结论
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 4.85, w: 9.2, h: 0.5, fill: { color: C.navy } });
  slide.addText("几乎所有正常产品都落在 μ ± 3σ 范围内，超出即为异常", {
    x: 0.5, y: 4.85, w: 9, h: 0.5, fontSize: 13, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0
  });
}

// ========== Slide 4: σ的直观理解 ==========
{
  let slide = pres.addSlide();
  slide.background = { color: C.lightBg };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.navy } });
  slide.addText("01  σ（标准差）的直观理解", {
    x: 0.5, y: 0.15, w: 9, h: 0.6,
    fontSize: 22, bold: true, color: C.white, fontFace: "Microsoft YaHei", valign: "middle", margin: 0
  });

  // σ值与质量等级对应表
  const sigmaLevels = [
    { sigma: "0.001mm", desc: "尺寸波动极小，精度极高", level: "专业测量仪器水平", color: C.mint },
    { sigma: "0.005mm", desc: "波动较小，精密制造", level: "MIM优质工艺水平", color: C.teal },
    { sigma: "0.015mm", desc: "波动较大，需关注", level: "接近规格公差边缘", color: C.orange },
    { sigma: "0.025mm", desc: "波动过大，过程失控", level: "大量超差风险", color: C.red },
  ];

  sigmaLevels.forEach((item, i) => {
    const x = 0.4 + i * 2.4;
    const y = 1.2;

    // 卡片
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.2, h: 2.8, fill: { color: C.white }, line: { color: item.color, pt: 2 }, shadow: makeShadow() });

    // 顶部色块
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.2, h: 0.7, fill: { color: item.color } });
    slide.addText("σ =", { x, y: y + 0.05, w: 2.2, h: 0.3, fontSize: 13, color: C.white, fontFace: "Arial", align: "center", margin: 0 });
    slide.addText(item.sigma, { x, y: y + 0.3, w: 2.2, h: 0.4, fontSize: 16, bold: true, color: C.white, fontFace: "Arial Black", align: "center", margin: 0 });

    // 描述
    slide.addText(item.desc, { x: x + 0.1, y: y + 0.85, w: 2.0, h: 0.9, fontSize: 12, color: C.dark, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });

    // 等级标签
    slide.addShape(pres.shapes.RECTANGLE, { x: x + 0.2, y: y + 1.9, w: 1.8, h: 0.45, fill: { color: item.color, transparency: 15 }, line: { color: item.color, pt: 1 } });
    slide.addText(item.level, { x: x + 0.2, y: y + 1.9, w: 1.8, h: 0.45, fontSize: 10, bold: true, color: item.color, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });

    // 序号
    slide.addText(String(i + 1), { x: x + 0.85, y: y + 2.45, w: 0.5, h: 0.5, fontSize: 28, bold: true, color: C.grayLt, fontFace: "Arial Black", align: "center", margin: 0 });
  });

  // 为什么选3σ
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 4.15, w: 9.2, h: 1.2, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 }, shadow: makeShadow() });
  slide.addText("为什么选 3σ 而不是 2σ 或 4σ？", {
    x: 0.6, y: 4.25, w: 8.8, h: 0.4, fontSize: 14, bold: true, color: C.navy, fontFace: "Microsoft YaHei", margin: 0
  });

  const reasons = [
    { limit: "±2σ", warn: "4.55%（太高）", action: "频繁误报警，效率低", bg: C.red, transparency: 15 },
    { limit: "±3σ", warn: "0.27%（适中）", action: "业界黄金标准", bg: C.mint, transparency: 15 },
    { limit: "±4σ", warn: "0.006%", action: "漏报风险大", bg: C.orange, transparency: 15 },
  ];

  reasons.forEach((r, i) => {
    const x = 0.6 + i * 3.0;
    slide.addShape(pres.shapes.RECTANGLE, { x, y: 4.7, w: 2.8, h: 0.55, fill: { color: r.bg, transparency: r.transparency }, line: { color: r.bg, pt: 1 } });
    slide.addText(r.limit + "  误报率" + r.warn + "  →  " + r.action, {
      x, y: 4.7, w: 2.8, h: 0.55, fontSize: 10, color: C.dark, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0
    });
  });
}

// ========== Slide 5: 标准差σ的计算 ==========
{
  let slide = pres.addSlide();
  slide.background = { color: C.lightBg };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.navy } });
  slide.addText("02  标准差 σ 的计算", {
    x: 0.5, y: 0.15, w: 9, h: 0.6,
    fontSize: 22, bold: true, color: C.white, fontFace: "Microsoft YaHei", valign: "middle", margin: 0
  });

  // 公式卡片
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 1.1, w: 9.2, h: 1.1, fill: { color: C.white }, line: { color: C.teal, pt: 2 }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 1.1, w: 0.1, h: 1.1, fill: { color: C.teal } });
  slide.addText("计算公式", { x: 0.7, y: 1.15, w: 2, h: 0.35, fontSize: 13, bold: true, color: C.teal, fontFace: "Microsoft YaHei", margin: 0 });
  slide.addText("σ = √[ Σ(xᵢ - x̄)² / (n-1) ]", {
    x: 0.7, y: 1.5, w: 4.5, h: 0.55, fontSize: 20, bold: true, color: C.dark, fontFace: "Arial Black", margin: 0
  });

  // 参数说明
  const params = [
    { sym: "xᵢ", mean: "第i个测量值" },
    { sym: "x̄", mean: "样本均值" },
    { sym: "n", mean: "样本数量（≥25组）" },
    { sym: "n-1", mean: "贝塞尔校正（无偏估计）" },
  ];
  params.forEach((p, i) => {
    const x = 5.5 + i * 1.1;
    slide.addShape(pres.shapes.OVAL, { x, y: 1.25, w: 0.45, h: 0.45, fill: { color: C.teal } });
    slide.addText(p.sym, { x, y: 1.25, w: 0.45, h: 0.45, fontSize: 12, bold: true, color: C.white, fontFace: "Arial", align: "center", valign: "middle", margin: 0 });
    slide.addText(p.mean, { x: x - 0.25, y: 1.72, w: 0.95, h: 0.4, fontSize: 8, color: C.gray, fontFace: "Microsoft YaHei", align: "center", margin: 0 });
  });

  // 计算步骤
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 2.4, w: 5.5, h: 2.95, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 }, shadow: makeShadow() });
  slide.addText("手算步骤（以MIM内孔径为例）", {
    x: 0.6, y: 2.5, w: 5, h: 0.4, fontSize: 13, bold: true, color: C.navy, fontFace: "Microsoft YaHei", margin: 0
  });

  const steps = [
    { step: "1", title: "收集数据", content: "连续采集25组×5件=125个测量值" },
    { step: "2", title: "计算均值 x̄", content: "例：x̄ = (2.001+1.999+2.002+1.998+2.000)/5 = 2.000" },
    { step: "3", title: "计算偏差平方", content: "(2.001-2.000)²=0.000001 等" },
    { step: "4", title: "求 σ", content: "σ = √(偏差平方和 / (n-1)) ≈ 0.0016mm" },
  ];

  steps.forEach((s, i) => {
    const y = 2.95 + i * 0.58;
    slide.addShape(pres.shapes.OVAL, { x: 0.6, y, w: 0.38, h: 0.38, fill: { color: C.blue } });
    slide.addText(s.step, { x: 0.6, y, w: 0.38, h: 0.38, fontSize: 13, bold: true, color: C.white, fontFace: "Arial", align: "center", valign: "middle", margin: 0 });
    slide.addText(s.title, { x: 1.1, y, w: 1.5, h: 0.38, fontSize: 12, bold: true, color: C.dark, fontFace: "Microsoft YaHei", valign: "middle", margin: 0 });
    slide.addText(s.content, { x: 2.6, y, w: 3.1, h: 0.38, fontSize: 10, color: C.gray, fontFace: "Microsoft YaHei", valign: "middle", margin: 0 });
  });

  // 两种估算方法
  slide.addShape(pres.shapes.RECTANGLE, { x: 6.1, y: 2.4, w: 3.5, h: 2.95, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 }, shadow: makeShadow() });
  slide.addText("两种σ估算方法", {
    x: 6.3, y: 2.5, w: 3.1, h: 0.4, fontSize: 13, bold: true, color: C.navy, fontFace: "Microsoft YaHei", margin: 0
  });

  // 极差法
  slide.addShape(pres.shapes.RECTANGLE, { x: 6.3, y: 3.0, w: 3.1, h: 1.1, fill: { color: C.teal, transparency: 10 }, line: { color: C.teal, pt: 1 } });
  slide.addText("极差法", { x: 6.4, y: 3.05, w: 1, h: 0.3, fontSize: 11, bold: true, color: C.teal, fontFace: "Microsoft YaHei", margin: 0 });
  slide.addText("σ̂ = R̄ / d₂", { x: 6.4, y: 3.35, w: 2.9, h: 0.35, fontSize: 16, bold: true, color: C.dark, fontFace: "Arial Black", margin: 0 });
  slide.addText("简单快速，适合日常", { x: 6.4, y: 3.72, w: 2.9, h: 0.3, fontSize: 10, color: C.gray, fontFace: "Microsoft YaHei", margin: 0 });

  // 标准差法
  slide.addShape(pres.shapes.RECTANGLE, { x: 6.3, y: 4.2, w: 3.1, h: 1.05, fill: { color: C.blue, transparency: 10 }, line: { color: C.blue, pt: 1 } });
  slide.addText("标准差法", { x: 6.4, y: 4.25, w: 1.2, h: 0.3, fontSize: 11, bold: true, color: C.blue, fontFace: "Microsoft YaHei", margin: 0 });
  slide.addText("σ̂ = S̄ / c₄", { x: 6.4, y: 4.55, w: 2.9, h: 0.35, fontSize: 16, bold: true, color: C.dark, fontFace: "Arial Black", margin: 0 });
  slide.addText("更精确，适合大批量数据", { x: 6.4, y: 4.92, w: 2.9, h: 0.3, fontSize: 10, color: C.gray, fontFace: "Microsoft YaHei", margin: 0 });
}

// ========== Slide 6: 常数表 ==========
{
  let slide = pres.addSlide();
  slide.background = { color: C.lightBg };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.navy } });
  slide.addText("02  控制图常数表", {
    x: 0.5, y: 0.15, w: 9, h: 0.6,
    fontSize: 22, bold: true, color: C.white, fontFace: "Microsoft YaHei", valign: "middle", margin: 0
  });

  // 表格数据
  const tableData = [
    [
      { text: "n", options: { bold: true, fill: { color: C.navy }, color: C.white } },
      { text: "A₂", options: { bold: true, fill: { color: C.navy }, color: C.white } },
      { text: "D₃", options: { bold: true, fill: { color: C.navy }, color: C.white } },
      { text: "D₄", options: { bold: true, fill: { color: C.navy }, color: C.white } },
      { text: "d₂", options: { bold: true, fill: { color: C.navy }, color: C.white } },
      { text: "c₄", options: { bold: true, fill: { color: C.navy }, color: C.white } },
    ],
    [{ text: "2", options: { align: "center" } }, { text: "1.880", options: { align: "center" } }, { text: "0", options: { align: "center" } }, { text: "3.267", options: { align: "center" } }, { text: "1.128", options: { align: "center" } }, { text: "0.7979", options: { align: "center" } }],
    [{ text: "3", options: { align: "center" } }, { text: "1.023", options: { align: "center" } }, { text: "0", options: { align: "center" } }, { text: "2.574", options: { align: "center" } }, { text: "1.693", options: { align: "center" } }, { text: "0.8862", options: { align: "center" } }],
    [{ text: "4", options: { align: "center" } }, { text: "0.729", options: { align: "center" } }, { text: "0", options: { align: "center" } }, { text: "2.282", options: { align: "center" } }, { text: "2.059", options: { align: "center" } }, { text: "0.9213", options: { align: "center" } }],
    [
      { text: "5", options: { bold: true, fill: { color: C.teal, transparency: 30 }, align: "center" } },
      { text: "0.577", options: { bold: true, fill: { color: C.teal, transparency: 30 }, color: C.dark, align: "center" } },
      { text: "0", options: { bold: true, fill: { color: C.teal, transparency: 30 }, align: "center" } },
      { text: "2.114", options: { bold: true, fill: { color: C.teal, transparency: 30 }, color: C.dark, align: "center" } },
      { text: "2.326", options: { bold: true, fill: { color: C.teal, transparency: 30 }, color: C.dark, align: "center" } },
      { text: "0.9400", options: { bold: true, fill: { color: C.teal, transparency: 30 }, color: C.dark, align: "center" } },
    ],
    [{ text: "6", options: { align: "center" } }, { text: "0.483", options: { align: "center" } }, { text: "0", options: { align: "center" } }, { text: "2.004", options: { align: "center" } }, { text: "2.534", options: { align: "center" } }, { text: "0.9515", options: { align: "center" } }],
    [{ text: "8", options: { align: "center" } }, { text: "0.373", options: { align: "center" } }, { text: "0.136", options: { align: "center" } }, { text: "1.864", options: { align: "center" } }, { text: "2.847", options: { align: "center" } }, { text: "0.9650", options: { align: "center" } }],
    [{ text: "10", options: { align: "center" } }, { text: "0.308", options: { align: "center" } }, { text: "0.223", options: { align: "center" } }, { text: "1.777", options: { align: "center" } }, { text: "3.078", options: { align: "center" } }, { text: "0.9727", options: { align: "center" } }],
  ];

  slide.addTable(tableData, {
    x: 0.5, y: 1.2, w: 9, h: 2.8,
    fontFace: "Arial",
    fontSize: 13,
    color: C.dark,
    border: { pt: 0.5, color: C.grayLt },
    colW: [0.8, 1.5, 1.3, 1.5, 1.8, 2.1],
    rowH: 0.4,
    fill: { color: C.white },
    valign: "middle",
  });

  // 公式区
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.2, w: 4.2, h: 1.2, fill: { color: C.teal, transparency: 10 }, line: { color: C.teal, pt: 1 }, shadow: makeShadow() });
  slide.addText("X̄ 图（均值图）", { x: 0.65, y: 4.3, w: 3.9, h: 0.35, fontSize: 13, bold: true, color: C.teal, fontFace: "Microsoft YaHei", margin: 0 });
  slide.addText("UCL = X̄̄ + A₂ × R̄    LCL = X̄̄ - A₂ × R̄", {
    x: 0.65, y: 4.65, w: 3.9, h: 0.6, fontSize: 14, bold: true, color: C.dark, fontFace: "Arial Black", margin: 0
  });

  slide.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 4.2, w: 4.5, h: 1.2, fill: { color: C.blue, transparency: 10 }, line: { color: C.blue, pt: 1 }, shadow: makeShadow() });
  slide.addText("R 图（极差图）", { x: 5.15, y: 4.3, w: 4.2, h: 0.35, fontSize: 13, bold: true, color: C.blue, fontFace: "Microsoft YaHei", margin: 0 });
  slide.addText("UCL = D₄ × R̄    CL = R̄    LCL = D₃ × R̄", {
    x: 5.15, y: 4.65, w: 4.2, h: 0.6, fontSize: 14, bold: true, color: C.dark, fontFace: "Arial Black", margin: 0
  });
}

// ========== Slide 7: UCL/LCL由来 ==========
{
  let slide = pres.addSlide();
  slide.background = { color: C.lightBg };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.navy } });
  slide.addText("03  控制限 UCL / LCL 如何得来", {
    x: 0.5, y: 0.15, w: 9, h: 0.6,
    fontSize: 22, bold: true, color: C.white, fontFace: "Microsoft YaHei", valign: "middle", margin: 0
  });

  // 本质来源
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 1.1, w: 9.2, h: 0.65, fill: { color: C.red, transparency: 10 }, line: { color: C.red, pt: 1 } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 1.1, w: 0.08, h: 0.65, fill: { color: C.red } });
  slide.addText("⚠ UCL/LCL 来自过程自身历史数据统计计算 ≠ 规格公差 ≠ 人为设定", {
    x: 0.65, y: 1.1, w: 8.8, h: 0.65, fontSize: 14, bold: true, color: C.red, fontFace: "Microsoft YaHei", valign: "middle", margin: 0
  });

  // 数值示例
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 1.95, w: 9.2, h: 2.4, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 }, shadow: makeShadow() });
  slide.addText("实例演算（n=5，X̄̄=2.000mm，R̄=0.005mm）", {
    x: 0.6, y: 2.05, w: 8.8, h: 0.4, fontSize: 14, bold: true, color: C.navy, fontFace: "Microsoft YaHei", margin: 0
  });

  // X̄图结果
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 2.5, w: 4.2, h: 0.7, fill: { color: C.teal, transparency: 10 }, line: { color: C.teal, pt: 1 } });
  slide.addText("X̄ 图结果", { x: 0.75, y: 2.55, w: 1.5, h: 0.3, fontSize: 11, bold: true, color: C.teal, fontFace: "Microsoft YaHei", margin: 0 });
  slide.addText("UCL = 2.003  |  CL = 2.000  |  LCL = 1.997", {
    x: 0.75, y: 2.85, w: 3.9, h: 0.3, fontSize: 13, bold: true, color: C.dark, fontFace: "Arial Black", margin: 0
  });

  // R图结果
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 2.5, w: 4.4, h: 0.7, fill: { color: C.blue, transparency: 10 }, line: { color: C.blue, pt: 1 } });
  slide.addText("R 图结果", { x: 5.15, y: 2.55, w: 1.5, h: 0.3, fontSize: 11, bold: true, color: C.blue, fontFace: "Microsoft YaHei", margin: 0 });
  slide.addText("UCL = 0.0106  |  CL = 0.005  |  LCL = 0", {
    x: 5.15, y: 2.85, w: 4.1, h: 0.3, fontSize: 13, bold: true, color: C.dark, fontFace: "Arial Black", margin: 0
  });

  // 推算过程
  slide.addText("X̄图推算：UCL = 2.000 + 0.577×0.005 = 2.003mm    LCL = 2.000 - 0.577×0.005 = 1.997mm", {
    x: 0.75, y: 3.3, w: 8.7, h: 0.35, fontSize: 11, color: C.gray, fontFace: "Arial", margin: 0
  });
  slide.addText("R图推算：UCL = 2.114×0.005 = 0.0106mm    （n=5，D₃=0，故LCL=0）", {
    x: 0.75, y: 3.65, w: 8.7, h: 0.35, fontSize: 11, color: C.gray, fontFace: "Arial", margin: 0
  });

  // 控制限vs规格公差图示
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 4.55, w: 9.2, h: 0.85, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 }, shadow: makeShadow() });

  const lines = [
    { label: "USL", desc: "规格上限（客户）", x: 7.5, color: C.red },
    { label: "UCL", desc: "控制上限（过程）", x: 6.0, color: C.orange },
    { label: "CL", desc: "中心线", x: 4.5, color: C.teal },
    { label: "LCL", desc: "控制下限（过程）", x: 3.0, color: C.orange },
    { label: "LSL", desc: "规格下限（客户）", x: 1.5, color: C.red },
  ];

  // 基线
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 5.0, w: 8.8, h: 0.02, fill: { color: C.grayLt } });

  lines.forEach((l) => {
    slide.addShape(pres.shapes.RECTANGLE, { x: l.x, y: 4.65, w: 0.03, h: 0.7, fill: { color: l.color } });
    slide.addText(l.label, { x: l.x - 0.25, y: 4.7, w: 0.6, h: 0.28, fontSize: 10, bold: true, color: l.color, fontFace: "Arial", align: "center", margin: 0 });
    slide.addText(l.desc, { x: l.x - 0.5, y: 4.95, w: 1.1, h: 0.35, fontSize: 8, color: C.gray, fontFace: "Microsoft YaHei", align: "center", margin: 0 });
  });

  // 控制限宽于规格？
  slide.addText("控制限 通常窄于规格限（反映过程真实能力，而非客户要求）", {
    x: 0.6, y: 5.1, w: 8.8, h: 0.25, fontSize: 10, color: C.gray, fontFace: "Microsoft YaHei", align: "center", margin: 0
  });
}

// ========== Slide 8: 控制限vs规格公差 ==========
{
  let slide = pres.addSlide();
  slide.background = { color: C.lightBg };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.navy } });
  slide.addText("03  控制限 vs 规格公差", {
    x: 0.5, y: 0.15, w: 9, h: 0.6,
    fontSize: 22, bold: true, color: C.white, fontFace: "Microsoft YaHei", valign: "middle", margin: 0
  });

  // 对比表
  const compareData = [
    [
      { text: "对比项", options: { bold: true, fill: { color: C.navy }, color: C.white } },
      { text: "UCL/LCL（控制限）", options: { bold: true, fill: { color: C.navy }, color: C.white } },
      { text: "USL/LSL（规格限）", options: { bold: true, fill: { color: C.navy }, color: C.white } },
    ],
    [
      { text: "来源", options: { bold: true } },
      { text: "过程历史数据计算得出", options: { color: C.teal } },
      { text: "客户/图纸要求", options: { color: C.orange } },
    ],
    [
      { text: "含义", options: { bold: true } },
      { text: "过程是否稳定", options: {} },
      { text: "产品是否合格", options: {} },
    ],
    [
      { text: "用途", options: { bold: true } },
      { text: "SPC预警、查找原因", options: {} },
      { text: "判定报废/放行", options: {} },
    ],
    [
      { text: "宽窄关系", options: { bold: true } },
      { text: "通常窄于规格", options: { color: C.mint } },
      { text: "通常宽于控制限", options: {} },
    ],
  ];

  slide.addTable(compareData, {
    x: 0.5, y: 1.2, w: 9, h: 2.2,
    fontFace: "Microsoft YaHei",
    fontSize: 13,
    color: C.dark,
    border: { pt: 0.5, color: C.grayLt },
    colW: [2.0, 3.5, 3.5],
    rowH: 0.44,
    fill: { color: C.white },
    valign: "middle",
    align: "center",
  });

  // 两句核心话
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.6, w: 9, h: 1.7, fill: { color: C.white }, line: { color: C.teal, pt: 2 }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.6, w: 0.1, h: 1.7, fill: { color: C.teal } });

  slide.addText("两句核心话", { x: 0.8, y: 3.7, w: 2, h: 0.35, fontSize: 13, bold: true, color: C.teal, fontFace: "Microsoft YaHei", margin: 0 });

  // 第一句
  slide.addShape(pres.shapes.OVAL, { x: 0.8, y: 4.15, w: 0.38, h: 0.38, fill: { color: C.navy } });
  slide.addText("1", { x: 0.8, y: 4.15, w: 0.38, h: 0.38, fontSize: 14, bold: true, color: C.white, fontFace: "Arial", align: "center", valign: "middle", margin: 0 });
  slide.addText("UCL/LCL = 过程告诉你的    USL/LSL = 客户告诉你的", {
    x: 1.3, y: 4.1, w: 7.8, h: 0.5, fontSize: 14, bold: true, color: C.dark, fontFace: "Microsoft YaHei", valign: "middle", margin: 0
  });

  // 第二句
  slide.addShape(pres.shapes.OVAL, { x: 0.8, y: 4.7, w: 0.38, h: 0.38, fill: { color: C.navy } });
  slide.addText("2", { x: 0.8, y: 4.7, w: 0.38, h: 0.38, fontSize: 14, bold: true, color: C.white, fontFace: "Arial", align: "center", valign: "middle", margin: 0 });
  slide.addText("超出控制限 → 过程异常，查原因    超出规格限 → 产品不合格，做处置", {
    x: 1.3, y: 4.65, w: 7.8, h: 0.5, fontSize: 14, bold: true, color: C.dark, fontFace: "Microsoft YaHei", valign: "middle", margin: 0
  });
}

// ========== Slide 9: SPC与6σ的关系 ==========
{
  let slide = pres.addSlide();
  slide.background = { color: C.lightBg };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.navy } });
  slide.addText("04  SPC 与 6σ 的关系", {
    x: 0.5, y: 0.15, w: 9, h: 0.6,
    fontSize: 22, bold: true, color: C.white, fontFace: "Microsoft YaHei", valign: "middle", margin: 0
  });

  // 一句话对比
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 1.1, w: 9.2, h: 0.65, fill: { color: C.navy } });
  slide.addText("SPC = 监控工具（仪表盘）    vs    6σ = 优化方法论（工程体系）", {
    x: 0.5, y: 1.1, w: 9, h: 0.65, fontSize: 16, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0
  });

  // 数据对比
  const compareItems = [
    { label: "控制范围", spc: "±3σ", sigma: "±6σ", color: C.navy },
    { label: "缺陷率", spc: "2,700 PPM", sigma: "3.4 PPM", color: C.red },
    { label: "良品率", spc: "99.73%", sigma: "99.99966%", color: C.mint },
    { label: "思维方式", spc: "被动检测", sigma: "主动优化", color: C.orange },
    { label: "执行角色", spc: "QC/工程师", sigma: "BB/GB黑带", color: C.blue },
  ];

  compareItems.forEach((item, i) => {
    const y = 1.95 + i * 0.55;
    const bgColor = i % 2 === 0 ? C.white : C.lightBg;

    slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y, w: 9.2, h: 0.5, fill: { color: bgColor }, line: { color: C.grayLt, pt: 0.5 } });
    slide.addText(item.label, { x: 0.6, y, w: 2.2, h: 0.5, fontSize: 13, bold: true, color: C.dark, fontFace: "Microsoft YaHei", valign: "middle", margin: 0 });

    // SPC值
    slide.addShape(pres.shapes.RECTANGLE, { x: 2.8, y: y + 0.05, w: 2.8, h: 0.4, fill: { color: C.teal, transparency: 20 }, line: { color: C.teal, pt: 1 } });
    slide.addText("SPC " + item.spc, { x: 2.8, y, w: 2.8, h: 0.5, fontSize: 13, bold: true, color: C.teal, fontFace: "Arial", align: "center", valign: "middle", margin: 0 });

    // 6σ值
    slide.addShape(pres.shapes.RECTANGLE, { x: 5.8, y: y + 0.05, w: 3.6, h: 0.4, fill: { color: item.color, transparency: 15 }, line: { color: item.color, pt: 1 } });
    slide.addText("6σ " + item.sigma, { x: 5.8, y, w: 3.6, h: 0.5, fontSize: 13, bold: true, color: item.color, fontFace: "Arial", align: "center", valign: "middle", margin: 0 });
  });

  // DMAIC流程
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 4.75, w: 9.2, h: 0.65, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 } });
  const dmaic = ["D界定", "M测量", "A分析", "I改进", "C控制"];
  const dmaicDesc = ["客户CTQ", "SPC基线", "σ来源", "降σ", "新控制限"];
  const dmaicColors = [C.red, C.orange, C.mint, C.blue, C.teal];

  dmaic.forEach((d, i) => {
    const x = 0.6 + i * 1.85;
    slide.addShape(pres.shapes.RECTANGLE, { x, y: 4.8, w: 1.6, h: 0.55, fill: { color: dmaicColors[i] }, line: { color: dmaicColors[i] } });
    slide.addText(d, { x, y: 4.78, w: 1.6, h: 0.3, fontSize: 12, bold: true, color: C.white, fontFace: "Arial", align: "center", margin: 0 });
    slide.addText(dmaicDesc[i], { x, y: 5.03, w: 1.6, h: 0.25, fontSize: 9, color: C.white, fontFace: "Microsoft YaHei", align: "center", margin: 0 });
    if (i < 4) {
      slide.addText("→", { x: x + 1.6, y: 4.8, w: 0.25, h: 0.55, fontSize: 16, bold: true, color: C.gray, fontFace: "Arial", align: "center", valign: "middle", margin: 0 });
    }
  });
}

// ========== Slide 10: MIM实战案例 ==========
{
  let slide = pres.addSlide();
  slide.background = { color: C.lightBg };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.navy } });
  slide.addText("05  MIM实战案例：内孔径控制", {
    x: 0.5, y: 0.15, w: 9, h: 0.6,
    fontSize: 22, bold: true, color: C.white, fontFace: "Microsoft YaHei", valign: "middle", margin: 0
  });

  // 场景描述
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 1.1, w: 4.4, h: 1.3, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 1.1, w: 0.08, h: 1.3, fill: { color: C.teal } });
  slide.addText("场景参数", { x: 0.65, y: 1.15, w: 3.9, h: 0.35, fontSize: 13, bold: true, color: C.teal, fontFace: "Microsoft YaHei", margin: 0 });

  const sceneParams = [
    "产品：MIM不锈钢零件内孔径",
    "规格：2.000 ± 0.010 mm（USL=2.010, LSL=1.990）",
    "子组：每小时抽取5件，共25组",
  ];
  slide.addText(sceneParams.map((p, i) => ({ text: p, options: { bullet: true, breakLine: i < sceneParams.length - 1 } })), {
    x: 0.65, y: 1.55, w: 4.0, h: 0.75, fontSize: 11, color: C.dark, fontFace: "Microsoft YaHei", margin: 0
  });

  // 数据计算结果
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 1.1, w: 4.6, h: 1.3, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 1.1, w: 0.08, h: 1.3, fill: { color: C.blue } });
  slide.addText("计算结果", { x: 5.25, y: 1.15, w: 4.2, h: 0.35, fontSize: 13, bold: true, color: C.blue, fontFace: "Microsoft YaHei", margin: 0 });

  const calcResults = [
    "总均值 X̄̄ = 2.0002 mm",
    "平均极差 R̄ = 0.0050 mm",
    "σ̂ = 0.005 / 2.326 = 0.00215 mm",
  ];
  slide.addText(calcResults.map((c, i) => ({ text: c, options: { bullet: true, breakLine: i < calcResults.length - 1 } })), {
    x: 5.25, y: 1.55, w: 4.2, h: 0.75, fontSize: 11, color: C.dark, fontFace: "Microsoft YaHei", margin: 0
  });

  // 控制限与能力
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 2.6, w: 4.4, h: 1.3, fill: { color: C.teal, transparency: 10 }, line: { color: C.teal, pt: 1 }, shadow: makeShadow() });
  slide.addText("X̄ 控制图控制限", { x: 0.6, y: 2.68, w: 4, h: 0.35, fontSize: 13, bold: true, color: C.teal, fontFace: "Microsoft YaHei", margin: 0 });
  slide.addText("UCL = 2.003 mm    CL = 2.000 mm    LCL = 1.997 mm", {
    x: 0.6, y: 3.1, w: 4.0, h: 0.65, fontSize: 14, bold: true, color: C.dark, fontFace: "Arial Black", margin: 0
  });

  // Cpk计算
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 2.6, w: 4.6, h: 1.3, fill: { color: C.mint, transparency: 10 }, line: { color: C.mint, pt: 1 }, shadow: makeShadow() });
  slide.addText("过程能力分析", { x: 5.2, y: 2.68, w: 4.2, h: 0.35, fontSize: 13, bold: true, color: C.mint, fontFace: "Microsoft YaHei", margin: 0 });
  slide.addText("Cpk = 0.0098 / 0.00645 ≈ 1.52", {
    x: 5.2, y: 3.05, w: 4.2, h: 0.35, fontSize: 14, bold: true, color: C.dark, fontFace: "Arial Black", margin: 0
  });
  slide.addText("Cpk ≥ 1.33 → 过程能力良好，维持监控", {
    x: 5.2, y: 3.42, w: 4.2, h: 0.35, fontSize: 11, color: C.mint, fontFace: "Microsoft YaHei", margin: 0
  });

  // Cpk等级表
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 4.1, w: 9.2, h: 1.3, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 }, shadow: makeShadow() });
  slide.addText("Cpk 能力等级参照", { x: 0.6, y: 4.18, w: 3, h: 0.35, fontSize: 13, bold: true, color: C.navy, fontFace: "Microsoft YaHei", margin: 0 });

  const cpkLevels = [
    { range: "< 1.0", level: "能力不足", action: "立即改进，列入FMEA高风险", color: C.red },
    { range: "1.0~1.33", level: "勉强合格", action: "改进，提升Cp/Cpk", color: C.orange },
    { range: "1.33~1.67", level: "良好", action: "维持监控", color: C.mint },
    { range: "≥ 1.67", level: "优秀", action: "追求更高效率", color: C.teal },
  ];

  cpkLevels.forEach((cpk, i) => {
    const x = 0.5 + i * 2.3;
    const y = 4.55;
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.1, h: 0.75, fill: { color: cpk.color, transparency: 15 }, line: { color: cpk.color, pt: 1 } });
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.1, h: 0.3, fill: { color: cpk.color } });
    slide.addText(cpk.range, { x, y, w: 2.1, h: 0.3, fontSize: 11, bold: true, color: C.white, fontFace: "Arial", align: "center", valign: "middle", margin: 0 });
    slide.addText(cpk.level, { x, y: y + 0.3, w: 2.1, h: 0.2, fontSize: 10, bold: true, color: cpk.color, fontFace: "Microsoft YaHei", align: "center", margin: 0 });
    slide.addText(cpk.action, { x, y: y + 0.5, w: 2.1, h: 0.2, fontSize: 8, color: C.gray, fontFace: "Microsoft YaHei", align: "center", margin: 0 });
  });
}

// ========== Slide 11: 要点速记卡 ==========
{
  let slide = pres.addSlide();
  slide.background = { color: C.lightBg };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.navy } });
  slide.addText("06  要点速记卡", {
    x: 0.5, y: 0.15, w: 9, h: 0.6,
    fontSize: 22, bold: true, color: C.white, fontFace: "Microsoft YaHei", valign: "middle", margin: 0
  });

  // 核心公式
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 1.1, w: 4.4, h: 2.6, fill: { color: C.white }, line: { color: C.teal, pt: 2 }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 1.1, w: 0.1, h: 2.6, fill: { color: C.teal } });
  slide.addText("核心公式", { x: 0.65, y: 1.18, w: 3.9, h: 0.4, fontSize: 15, bold: true, color: C.teal, fontFace: "Microsoft YaHei", margin: 0 });

  const formulas = [
    { f: "σ = √[Σ(xᵢ-x̄)²/(n-1)]", d: "计算标准差" },
    { f: "σ̂ = R̄ / d₂", d: "极差法估算σ" },
    { f: "UCL = X̄̄ + A₂×R̄", d: "均值图控制限" },
    { f: "UCL = D₄×R̄", d: "极差图控制限" },
    { f: "Cpk = min(USL-x̄,x̄-LSL)/3σ", d: "过程能力指数" },
  ];

  formulas.forEach((f, i) => {
    const y = 1.65 + i * 0.42;
    slide.addShape(pres.shapes.OVAL, { x: 0.65, y: y + 0.05, w: 0.25, h: 0.25, fill: { color: C.teal } });
    slide.addText(String(i + 1), { x: 0.65, y: y + 0.05, w: 0.25, h: 0.25, fontSize: 10, bold: true, color: C.white, fontFace: "Arial", align: "center", valign: "middle", margin: 0 });
    slide.addText(f.f, { x: 1.0, y, w: 2.3, h: 0.35, fontSize: 11, bold: true, color: C.dark, fontFace: "Arial", margin: 0 });
    slide.addText(f.d, { x: 3.3, y, w: 1.3, h: 0.35, fontSize: 10, color: C.gray, fontFace: "Microsoft YaHei", valign: "middle", margin: 0 });
  });

  // 关键数字
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 1.1, w: 4.6, h: 2.6, fill: { color: C.white }, line: { color: C.orange, pt: 2 }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 1.1, w: 0.1, h: 2.6, fill: { color: C.orange } });
  slide.addText("关键数字", { x: 5.25, y: 1.18, w: 4.2, h: 0.4, fontSize: 15, bold: true, color: C.orange, fontFace: "Microsoft YaHei", margin: 0 });

  const keyNums = [
    { num: "68.27%", d: "μ±1σ 范围内" },
    { num: "95.45%", d: "μ±2σ 范围内" },
    { num: "99.73%", d: "μ±3σ 范围内" },
    { num: "2,700 PPM", d: "3σ时缺陷率" },
    { num: "3.4 PPM", d: "6σ时缺陷率" },
    { num: "25组", d: "计算σ最少数据量" },
    { num: "Cpk ≥ 1.33", d: "过程能力合格" },
  ];

  keyNums.forEach((k, i) => {
    const col = i < 4 ? 0 : 1;
    const row = i < 4 ? i : i - 4;
    const x = 5.25 + col * 2.1;
    const y = 1.65 + row * 0.48;
    slide.addText(k.num, { x, y, w: 1.0, h: 0.35, fontSize: 13, bold: true, color: C.orange, fontFace: "Arial Black", margin: 0 });
    slide.addText(k.d, { x: x + 1.0, y, w: 0.95, h: 0.35, fontSize: 10, color: C.gray, fontFace: "Microsoft YaHei", valign: "middle", margin: 0 });
  });

  // 三句核心话
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 3.9, w: 9.2, h: 1.5, fill: { color: C.navy } });
  slide.addText("三句核心话", { x: 0.6, y: 3.98, w: 2, h: 0.35, fontSize: 14, bold: true, color: C.teal, fontFace: "Microsoft YaHei", margin: 0 });

  const coreLines = [
    "σ是过程\"告诉\"你的，不是你设定的",
    "UCL/LCL是过程告诉你的，USL/LSL是客户告诉你的，两者不能混淆",
    "SPC告诉你哪里出问题，6σ告诉你如何系统解决",
  ];

  coreLines.forEach((line, i) => {
    const y = 4.4 + i * 0.35;
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: y + 0.05, w: 0.25, h: 0.25, fill: { color: C.teal } });
    slide.addText(String(i + 1), { x: 0.6, y: y + 0.05, w: 0.25, h: 0.25, fontSize: 10, bold: true, color: C.white, fontFace: "Arial", align: "center", valign: "middle", margin: 0 });
    slide.addText(line, { x: 1.0, y, w: 8.4, h: 0.35, fontSize: 13, bold: true, color: C.white, fontFace: "Microsoft YaHei", valign: "middle", margin: 0 });
  });
}

// ========== Slide 12: 结束页 ==========
{
  let slide = pres.addSlide();
  slide.background = { color: C.navy };

  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.teal } });

  slide.addText("掌握 SPC 与 3σ", {
    x: 0.5, y: 1.8, w: 9, h: 0.8,
    fontSize: 40, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", margin: 0
  });
  slide.addText("让质量管控从\"凭经验\"走向\"用数据说话\"", {
    x: 0.5, y: 2.65, w: 9, h: 0.6,
    fontSize: 22, color: C.teal, fontFace: "Microsoft YaHei", align: "center", margin: 0
  });

  slide.addShape(pres.shapes.RECTANGLE, { x: 3.5, y: 3.5, w: 3, h: 0.04, fill: { color: C.teal } });

  slide.addText("Thank You", {
    x: 0.5, y: 3.7, w: 9, h: 0.6,
    fontSize: 28, color: "94A3B8", fontFace: "Georgia", align: "center", margin: 0
  });

  slide.addText("MIM行业质量管理体系培训", {
    x: 0.5, y: 4.4, w: 9, h: 0.4,
    fontSize: 14, color: "64748B", fontFace: "Microsoft YaHei", align: "center", margin: 0
  });
}

// ========== 输出文件 ==========
pres.writeFile({ fileName: "SPC_3σ原理培训.pptx" })
  .then(() => console.log("PPT 生成成功: SPC_3σ原理培训.pptx"))
  .catch(err => console.error("生成失败:", err));
