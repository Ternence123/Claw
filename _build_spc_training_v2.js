const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "SPC统计过程控制与3σ原理培训";
pres.author = "WorkBuddy";

// ========== 配色方案 ==========
const C = {
  navy: "1E3A5F",
  blue: "2563EB",
  teal: "0891B2",
  mint: "10B981",
  orange: "F59E0B",
  red: "EF4444",
  purple: "7C3AED",
  white: "FFFFFF",
  lightBg: "F1F5F9",
  dark: "1E293B",
  gray: "64748B",
  grayLt: "CBD5E1",
  chartBg: "F8FAFC",
};

function makeShadow() {
  return { type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.1 };
}
function makeCard(x, y, w, h, accentColor) {
  return [
    { shape: pres.shapes.RECTANGLE, opts: { x, y, w, h, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 }, shadow: makeShadow() } },
    { shape: pres.shapes.RECTANGLE, opts: { x, y, w: 0.08, h, fill: { color: accentColor } } },
  ];
}

// ========== Slide 1: 封面 ==========
{
  let slide = pres.addSlide();
  slide.background = { color: C.navy };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.1, fill: { color: C.teal } });
  slide.addText("SPC 统计过程控制", { x: 0.5, y: 1.5, w: 9, h: 0.85, fontSize: 42, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", margin: 0 });
  slide.addText("与 3σ 原理", { x: 0.5, y: 2.35, w: 9, h: 0.65, fontSize: 36, bold: true, color: C.teal, fontFace: "Microsoft YaHei", align: "center", margin: 0 });
  slide.addShape(pres.shapes.RECTANGLE, { x: 3.5, y: 3.2, w: 3, h: 0.04, fill: { color: C.teal } });
  slide.addText("MIM行业质量管理体系 · 内部培训教材", { x: 0.5, y: 3.4, w: 9, h: 0.45, fontSize: 18, color: "94A3B8", fontFace: "Microsoft YaHei", align: "center", margin: 0 });
  // 底部三个标签
  const tags = ["生产部门", "质量部门", "工程部门"];
  tags.forEach((tag, i) => {
    const tx = 2.5 + i * 1.8;
    slide.addShape(pres.shapes.RECTANGLE, { x: tx, y: 4.5, w: 1.5, h: 0.4, fill: { color: C.teal, transparency: 80 }, line: { color: C.teal, pt: 1 } });
    slide.addText(tag, { x: tx, y: 4.5, w: 1.5, h: 0.4, fontSize: 11, color: C.teal, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });
  });
}

// ========== Slide 2: 目录 ==========
{
  let slide = pres.addSlide();
  slide.background = { color: C.white };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: C.navy } });
  slide.addText("培训内容", { x: 0.5, y: 0.35, w: 4, h: 0.55, fontSize: 26, bold: true, color: C.navy, fontFace: "Microsoft YaHei", margin: 0 });
  slide.addText("CONTENTS", { x: 0.5, y: 0.85, w: 4, h: 0.3, fontSize: 11, color: C.gray, fontFace: "Arial", charSpacing: 4, margin: 0 });

  const tocItems = [
    { num: "01", title: "正态分布与3σ原理", sub: "68-95-99.7法则、σ概念、直观理解" },
    { num: "02", title: "标准差σ的计算", sub: "公式推导、极差法/标准差法、常数表" },
    { num: "03", title: "UCL/LCL控制限由来", sub: "公式、常数表、控制限vs规格限" },
    { num: "04", title: "SPC与6σ的关系", sub: "DMAIC流程、两者的分工与协作" },
    { num: "05", title: "MIM实战案例", sub: "内孔径控制、过程能力Cpk分析" },
    { num: "06", title: "要点速记卡", sub: "核心公式、关键数字速记、实战口诀" },
  ];

  tocItems.forEach((item, i) => {
    const col = i < 3 ? 0 : 1;
    const row = i % 3;
    const x = 0.5 + col * 4.8;
    const y = 1.4 + row * 1.3;
    slide.addShape(pres.shapes.OVAL, { x, y, w: 0.5, h: 0.5, fill: { color: C.teal } });
    slide.addText(item.num, { x, y, w: 0.5, h: 0.5, fontSize: 13, bold: true, color: C.white, fontFace: "Arial", align: "center", valign: "middle", margin: 0 });
    slide.addText(item.title, { x: x + 0.65, y, w: 3.8, h: 0.35, fontSize: 14, bold: true, color: C.dark, fontFace: "Microsoft YaHei", margin: 0 });
    slide.addText(item.sub, { x: x + 0.65, y: y + 0.35, w: 3.8, h: 0.3, fontSize: 10, color: C.gray, fontFace: "Microsoft YaHei", margin: 0 });
  });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 5.1, w: 9, h: 0.01, fill: { color: C.grayLt } });
  slide.addText("培训时长约 60 分钟  |  前置知识：基础数学（均值、平方根概念）", {
    x: 0.5, y: 5.15, w: 9, h: 0.35, fontSize: 11, color: C.gray, fontFace: "Microsoft YaHei", align: "center", margin: 0
  });
}

// ========== Slide 3: 正态分布与3σ原理（纯柱状图+五线标注） ==========
{
  let slide = pres.addSlide();
  slide.background = { color: C.lightBg };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.navy } });
  slide.addText("01  正态分布与3σ原理", {
    x: 0.5, y: 0.15, w: 9, h: 0.6, fontSize: 22, bold: true, color: C.white, fontFace: "Microsoft YaHei", valign: "middle", margin: 0
  });

  // ===== 左侧：正态分布柱状图 + 五线 =====
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.05, w: 4.9, h: 3.85, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 }, shadow: makeShadow() });
  slide.addText("正态分布柱状图与五线关系", { x: 0.5, y: 1.12, w: 4.5, h: 0.32, fontSize: 11, bold: true, color: C.navy, fontFace: "Microsoft YaHei", margin: 0 });

  // 图表区域
  const gLeft = 0.55;
  const gTop = 1.55;
  const gRight = 4.95;
  const gBottom = 3.85;
  const gW = gRight - gLeft;   // 4.4
  const gH = gBottom - gTop;   // 2.3

  // 13个柱的正态分布数据（对称钟形）
  const barHeights = [0.05, 0.12, 0.25, 0.45, 0.68, 0.85, 1.00, 0.85, 0.68, 0.45, 0.25, 0.12, 0.05];
  const nBars = barHeights.length;
  const barW = 0.28;
  const barGap = 0.04;
  const totalBarUnit = barW + barGap;
  const totalBarsWidth = nBars * totalBarUnit - barGap;
  const startX = gLeft + (gW - totalBarsWidth) / 2;
  const maxBarH = 1.0;

  // 颜色
  const C_MU   = '0D2137';  // 中心线 - 近黑
  const C_UCL  = '27AE60';  // 控制限 - 绿
  const C_USL  = '8E44AD';  // 规格限 - 紫
  const C_BAR1 = '2E86AB';  // ±1σ柱 - 青
  const C_BAR2 = 'E07B39';  // ±2σ柱 - 橙
  const C_BAR3 = 'C0392B';  // ±3σ柱 - 红

  // 柱体区域判定
  const barZone = (i) => {
    const dist = Math.abs(i - 6); // 中心是第6柱
    if (dist <= 2) return 'one';    // ±1σ (柱4~8)
    if (dist <= 4) return 'two';    // ±2σ (柱2~10)
    return 'three';                  // ±3σ (柱0~12)
  };

  // 绘制柱体
  barHeights.forEach((h, i) => {
    const bx = startX + i * totalBarUnit;
    const bh = (h / maxBarH) * gH * 0.88;
    const by = gBottom - bh;
    const z = barZone(i);
    let col = C_BAR1;
    if (z === 'two') col = C_BAR2;
    if (z === 'three') col = C_BAR3;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: bx, y: by, w: barW, h: bh,
      fill: { color: col },
      line: { color: col, pt: 0.5 }
    });
  });

  // ===== 五条垂直线 =====
  // 柱索引: 0  1  2  3  4  5  6  7  8  9  10 11 12
  //          LSL   LCL     μ     UCL   USL
  const lineX = (idx) => startX + idx * totalBarUnit + barW / 2;

  const fiveLines = [
    { idx: 0,  name: "LSL", sub: "规格下限", color: C_USL, top: false },
    { idx: 2,  name: "LCL", sub: "μ-3σ",    color: C_UCL, top: false },
    { idx: 6,  name: "μ",   sub: "中心线",  color: C_MU,  top: true  },
    { idx: 10, name: "UCL", sub: "μ+3σ",    color: C_UCL, top: false },
    { idx: 12, name: "USL", sub: "规格上限", color: C_USL, top: false },
  ];

  fiveLines.forEach((ln) => {
    const lx = lineX(ln.idx);

    // 垂直线（从图表顶部到底部）
    slide.addShape(pres.shapes.RECTANGLE, {
      x: lx - 0.015, y: gTop, w: 0.03, h: gBottom - gTop,
      fill: { color: ln.color }
    });

    if (ln.top) {
      // μ：顶部圆形 + 文字
      slide.addShape(pres.shapes.OVAL, { x: lx - 0.18, y: gTop - 0.1, w: 0.36, h: 0.36, fill: { color: ln.color } });
      slide.addText("μ", { x: lx - 0.18, y: gTop - 0.1, w: 0.36, h: 0.36, fontSize: 16, bold: true, color: C.white, fontFace: "Arial", align: "center", valign: "middle", margin: 0 });
      slide.addText("中心线", { x: lx - 0.4, y: gTop + 0.28, w: 0.8, h: 0.2, fontSize: 9, color: ln.color, fontFace: "Microsoft YaHei", bold: true, align: "center", margin: 0 });
    } else {
      // 其他：底部标签
      const lblY = gBottom + 0.06;
      slide.addText(ln.name, {
        x: lx - 0.35, y: lblY, w: 0.7, h: 0.22,
        fontSize: 10, color: ln.color, fontFace: "Arial", bold: true, align: "center", margin: 0
      });
      slide.addText(ln.sub, {
        x: lx - 0.35, y: lblY + 0.2, w: 0.7, h: 0.2,
        fontSize: 8, color: C.gray, fontFace: "Microsoft YaHei", align: "center", margin: 0
      });
    }
  });

  // X轴基线
  slide.addShape(pres.shapes.RECTANGLE, { x: gLeft, y: gBottom, w: gW, h: 0.025, fill: { color: C.gray } });

  // 图例（卡片内底部）
  const legendData = [
    { label: "±1σ  68%", color: C_BAR1 },
    { label: "±2σ  95%", color: C_BAR2 },
    { label: "±3σ  99.7%", color: C_BAR3 },
  ];
  legendData.forEach((item, i) => {
    const lx = 0.6 + i * 1.4;
    const ly = 4.38;
    slide.addShape(pres.shapes.RECTANGLE, { x: lx, y: ly, w: 0.2, h: 0.16, fill: { color: item.color } });
    slide.addText(item.label, { x: lx + 0.24, y: ly - 0.01, w: 1.2, h: 0.2, fontSize: 9, color: C.dark, fontFace: "Microsoft YaHei", margin: 0 });
  });

  // 五线图例
  const lineLegend = [
    { label: "μ 中心线", color: C_MU },
    { label: "UCL/LCL 控制限", color: C_UCL },
    { label: "USL/LSL 规格限", color: C_USL },
  ];
  lineLegend.forEach((item, i) => {
    const lx = 0.6 + i * 1.5;
    const ly = 4.65;
    slide.addShape(pres.shapes.RECTANGLE, { x: lx, y: ly, w: 0.2, h: 0.04, fill: { color: item.color } });
    slide.addText(item.label, { x: lx + 0.24, y: ly - 0.04, w: 1.4, h: 0.18, fontSize: 8, color: C.gray, fontFace: "Microsoft YaHei", margin: 0 });
  });

  // ===== 右侧：68-95-99.7法则 =====
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.4, y: 1.05, w: 4.3, h: 3.1, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 }, shadow: makeShadow() });
  slide.addText("68 - 95 - 99.7 法则", { x: 5.6, y: 1.1, w: 3.9, h: 0.35, fontSize: 14, bold: true, color: C.navy, fontFace: "Microsoft YaHei", align: "center", margin: 0 });

  const rules = [
    { sigma: "±1σ", pct: "68.27%", prob: "31.73%", color: C.mint, barW: 0.68 },
    { sigma: "±2σ", pct: "95.45%", prob: "4.55%", color: C.orange, barW: 0.95 },
    { sigma: "±3σ", pct: "99.73%", prob: "0.27%", color: C.teal, barW: 1.0 },
  ];

  rules.forEach((r, i) => {
    const y = 1.6 + i * 0.85;
    // 进度条背景
    slide.addShape(pres.shapes.RECTANGLE, { x: 5.6, y, w: 3.9, h: 0.7, fill: { color: C.lightBg }, line: { color: C.grayLt, pt: 0.5 } });
    // 填充
    slide.addShape(pres.shapes.RECTANGLE, { x: 5.6, y, w: 3.9 * r.barW, h: 0.7, fill: { color: r.color, transparency: 20 }, line: { color: r.color, pt: 1 } });
    // 左侧标签
    slide.addShape(pres.shapes.RECTANGLE, { x: 5.6, y, w: 0.65, h: 0.7, fill: { color: r.color } });
    slide.addText(r.sigma, { x: 5.6, y, w: 0.65, h: 0.7, fontSize: 12, bold: true, color: C.white, fontFace: "Arial", align: "center", valign: "middle", margin: 0 });
    // 百分比
    slide.addText(r.pct, { x: 6.4, y: y + 0.05, w: 1.8, h: 0.35, fontSize: 18, bold: true, color: r.color, fontFace: "Arial Black", margin: 0 });
    slide.addText("区间内", { x: 6.4, y: y + 0.38, w: 1.5, h: 0.25, fontSize: 9, color: C.gray, fontFace: "Microsoft YaHei", margin: 0 });
    // 区间外概率
    slide.addText("区间外: " + r.prob, { x: 8.1, y: y + 0.15, w: 1.5, h: 0.4, fontSize: 11, color: C.dark, fontFace: "Microsoft YaHei", valign: "middle", margin: 0 });
  });

  // 底部结论
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 4.25, w: 9.4, h: 0.55, fill: { color: C.navy } });
  slide.addText("几乎所有正常产品（99.73%）都落在 μ ± 3σ 范围内，超出即视为异常波动", {
    x: 0.4, y: 4.25, w: 9.2, h: 0.55, fontSize: 13, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0
  });

  // 底部注解
  slide.addText("注：正态分布数据在自然界和工业生产中极为常见，如零件尺寸、温度、重量等", {
    x: 0.3, y: 4.88, w: 9.4, h: 0.25, fontSize: 10, color: C.gray, fontFace: "Microsoft YaHei", align: "center", margin: 0
  });
}

// ========== Slide 4: σ的直观理解与为什么选3σ ==========
{
  let slide = pres.addSlide();
  slide.background = { color: C.lightBg };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.navy } });
  slide.addText("01  σ 的直观理解", {
    x: 0.5, y: 0.15, w: 9, h: 0.6, fontSize: 22, bold: true, color: C.white, fontFace: "Microsoft YaHei", valign: "middle", margin: 0
  });

  // ===== 左侧：σ等级4卡片 =====
  const sigmaLevels = [
    { sigma: "0.001mm", desc: "尺寸波动极小\n精度极高", level: "专业测量仪器", color: C.mint, icon: "★" },
    { sigma: "0.005mm", desc: "波动较小\n精密制造", level: "MIM优质工艺", color: C.teal, icon: "◆" },
    { sigma: "0.015mm", desc: "波动较大\n接近公差边缘", level: "需关注改善", color: C.orange, icon: "●" },
    { sigma: "0.025mm", desc: "波动过大\n过程失控", level: "大量超差风险", color: C.red, icon: "✖" },
  ];

  sigmaLevels.forEach((item, i) => {
    const x = 0.35 + i * 2.35;
    const y = 1.1;
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.2, h: 2.5, fill: { color: C.white }, line: { color: item.color, pt: 2 }, shadow: makeShadow() });
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.2, h: 0.7, fill: { color: item.color } });
    slide.addText("σ = " + item.sigma, { x, y: y + 0.1, w: 2.2, h: 0.55, fontSize: 12, bold: true, color: C.white, fontFace: "Arial Black", align: "center", valign: "middle", margin: 0 });
    slide.addText(item.icon, { x, y: y + 0.75, w: 2.2, h: 0.35, fontSize: 20, color: item.color, fontFace: "Arial", align: "center", margin: 0 });
    slide.addText(item.desc, { x: x + 0.1, y: y + 1.15, w: 2.0, h: 0.65, fontSize: 11, color: C.dark, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });
    slide.addShape(pres.shapes.RECTANGLE, { x: x + 0.2, y: y + 1.9, w: 1.8, h: 0.38, fill: { color: item.color, transparency: 15 }, line: { color: item.color, pt: 1 } });
    slide.addText(item.level, { x: x + 0.2, y: y + 1.9, w: 1.8, h: 0.38, fontSize: 10, bold: true, color: item.color, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });
  });

  // ===== 右侧：为什么选3σ =====
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 3.75, w: 9.3, h: 1.7, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 }, shadow: makeShadow() });
  slide.addText("为什么控制限选 3σ？", {
    x: 0.55, y: 3.82, w: 8.9, h: 0.38, fontSize: 14, bold: true, color: C.navy, fontFace: "Microsoft YaHei", margin: 0
  });

  const reasons = [
    { limit: "±2σ", warn: "4.55%", result: "频繁误报警\n生产效率低", color: C.red, bg: C.red, trans: 15 },
    { limit: "±3σ", warn: "0.27%", result: "误报少、检出强\n业界黄金标准", color: C.mint, bg: C.mint, trans: 15 },
    { limit: "±4σ", warn: "0.006%", result: "对异常不敏感\n漏报风险大", color: C.orange, bg: C.orange, trans: 15 },
  ];

  reasons.forEach((r, i) => {
    const x = 0.55 + i * 3.1;
    slide.addShape(pres.shapes.RECTANGLE, { x, y: 4.28, w: 2.9, h: 1.0, fill: { color: r.bg, transparency: r.trans }, line: { color: r.color, pt: 1 } });
    slide.addShape(pres.shapes.RECTANGLE, { x, y: 4.28, w: 0.7, h: 1.0, fill: { color: r.color } });
    slide.addText(r.limit, { x, y: 4.28, w: 0.7, h: 1.0, fontSize: 14, bold: true, color: C.white, fontFace: "Arial Black", align: "center", valign: "middle", margin: 0 });
    slide.addText("误报率 " + r.warn, { x: x + 0.75, y: 4.32, w: 2.0, h: 0.35, fontSize: 12, bold: true, color: r.color, fontFace: "Microsoft YaHei", margin: 0 });
    slide.addText(r.result, { x: x + 0.75, y: 4.65, w: 2.0, h: 0.55, fontSize: 10, color: C.dark, fontFace: "Microsoft YaHei", margin: 0 });
  });

  // 推荐标签
  slide.addShape(pres.shapes.RECTANGLE, { x: 3.65, y: 4.15, w: 0.9, h: 0.28, fill: { color: C.mint }, line: { color: C.mint } });
  slide.addText("推荐", { x: 3.65, y: 4.15, w: 0.9, h: 0.28, fontSize: 10, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });
}

// ========== Slide 5: 标准差σ的计算 ==========
{
  let slide = pres.addSlide();
  slide.background = { color: C.lightBg };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.navy } });
  slide.addText("02  标准差 σ 的计算", {
    x: 0.5, y: 0.15, w: 9, h: 0.6, fontSize: 22, bold: true, color: C.white, fontFace: "Microsoft YaHei", valign: "middle", margin: 0
  });

  // 公式卡片
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 1.05, w: 9.3, h: 0.85, fill: { color: C.white }, line: { color: C.teal, pt: 2 }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 1.05, w: 0.1, h: 0.85, fill: { color: C.teal } });
  slide.addText("计算公式：  σ = √[ Σ(xᵢ - x̄)² / (n-1) ]", {
    x: 0.6, y: 1.05, w: 5.5, h: 0.85, fontSize: 18, bold: true, color: C.dark, fontFace: "Arial Black", valign: "middle", margin: 0
  });

  // 参数卡片组
  const params = [
    { sym: "xᵢ", mean: "第i个测量值" },
    { sym: "x̄", mean: "样本均值" },
    { sym: "n", mean: "样本数量 ≥ 25组" },
    { sym: "n-1", mean: "贝塞尔校正" },
  ];
  params.forEach((p, i) => {
    const x = 6.3 + i * 0.85;
    slide.addShape(pres.shapes.OVAL, { x, y: 1.2, w: 0.4, h: 0.4, fill: { color: C.teal } });
    slide.addText(p.sym, { x, y: 1.2, w: 0.4, h: 0.4, fontSize: 12, bold: true, color: C.white, fontFace: "Arial", align: "center", valign: "middle", margin: 0 });
    slide.addText(p.mean, { x: x - 0.15, y: 1.62, w: 0.7, h: 0.28, fontSize: 8, color: C.gray, fontFace: "Microsoft YaHei", align: "center", margin: 0 });
  });

  // ===== 左侧：手算步骤 =====
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 2.05, w: 5.2, h: 3.35, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 2.05, w: 0.1, h: 3.35, fill: { color: C.blue } });
  slide.addText("手算步骤（MIM内孔径示例：n=5, 25组）", {
    x: 0.6, y: 2.12, w: 4.8, h: 0.38, fontSize: 13, bold: true, color: C.navy, fontFace: "Microsoft YaHei", margin: 0
  });

  const steps = [
    { num: "1", title: "收集数据", content: "连续采集25组×5件=125个测量值" },
    { num: "2", title: "计算均值 x̄", content: "x̄ = (2.001+1.999+2.002+1.998+2.000)/5\n    = 2.000 mm" },
    { num: "3", title: "计算偏差平方", content: "(2.001-2.000)² = 0.000001\n(1.999-2.000)² = 0.000001 等" },
    { num: "4", title: "求 σ", content: "σ = √(偏差平方和/(n-1))\n  ≈ 0.0016 mm" },
  ];

  steps.forEach((s, i) => {
    const y = 2.55 + i * 0.72;
    slide.addShape(pres.shapes.OVAL, { x: 0.6, y, w: 0.36, h: 0.36, fill: { color: C.blue } });
    slide.addText(s.num, { x: 0.6, y, w: 0.36, h: 0.36, fontSize: 12, bold: true, color: C.white, fontFace: "Arial", align: "center", valign: "middle", margin: 0 });
    slide.addText(s.title, { x: 1.1, y, w: 1.5, h: 0.36, fontSize: 12, bold: true, color: C.dark, fontFace: "Microsoft YaHei", valign: "middle", margin: 0 });
    slide.addText(s.content, { x: 2.6, y, w: 2.7, h: 0.65, fontSize: 10, color: C.gray, fontFace: "Microsoft YaHei", margin: 0 });
  });

  // ===== 右侧：两种估算方法 =====
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.75, y: 2.05, w: 3.9, h: 3.35, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.75, y: 2.05, w: 0.1, h: 3.35, fill: { color: C.purple } });
  slide.addText("两种σ估算方法", {
    x: 6.0, y: 2.12, w: 3.5, h: 0.38, fontSize: 13, bold: true, color: C.navy, fontFace: "Microsoft YaHei", margin: 0
  });

  // 极差法
  slide.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 2.6, w: 3.5, h: 1.25, fill: { color: C.teal, transparency: 10 }, line: { color: C.teal, pt: 1 } });
  slide.addText("极差法（推荐日常使用）", { x: 6.15, y: 2.65, w: 3.2, h: 0.3, fontSize: 11, bold: true, color: C.teal, fontFace: "Microsoft YaHei", margin: 0 });
  slide.addText("σ̂ = R̄ / d₂", { x: 6.15, y: 2.95, w: 3.2, h: 0.45, fontSize: 20, bold: true, color: C.dark, fontFace: "Arial Black", margin: 0 });
  slide.addText("简单快速，用组内极差估算σ", { x: 6.15, y: 3.45, w: 3.2, h: 0.3, fontSize: 10, color: C.gray, fontFace: "Microsoft YaHei", margin: 0 });

  // 标准差法
  slide.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 3.95, w: 3.5, h: 1.25, fill: { color: C.blue, transparency: 10 }, line: { color: C.blue, pt: 1 } });
  slide.addText("标准差法（适合大批量数据）", { x: 6.15, y: 4.0, w: 3.2, h: 0.3, fontSize: 11, bold: true, color: C.blue, fontFace: "Microsoft YaHei", margin: 0 });
  slide.addText("σ̂ = S̄ / c₄", { x: 6.15, y: 4.3, w: 3.2, h: 0.45, fontSize: 20, bold: true, color: C.dark, fontFace: "Arial Black", margin: 0 });
  slide.addText("更精确，使用样本标准差", { x: 6.15, y: 4.8, w: 3.2, h: 0.3, fontSize: 10, color: C.gray, fontFace: "Microsoft YaHei", margin: 0 });

  // d₂/c₄说明
  slide.addText("d₂、c₄ 为常数表系数（见下页）", { x: 6.0, y: 5.22, w: 3.5, h: 0.2, fontSize: 9, color: C.gray, fontFace: "Microsoft YaHei", align: "center", margin: 0 });
}

// ========== Slide 6: 常数表 ==========
{
  let slide = pres.addSlide();
  slide.background = { color: C.lightBg };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.navy } });
  slide.addText("02  控制图常数表（n=2~10）", {
    x: 0.5, y: 0.15, w: 9, h: 0.6, fontSize: 22, bold: true, color: C.white, fontFace: "Microsoft YaHei", valign: "middle", margin: 0
  });

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
      { text: "5 ★", options: { bold: true, fill: { color: C.teal, transparency: 30 }, align: "center" } },
      { text: "0.577", options: { bold: true, fill: { color: C.teal, transparency: 30 }, color: C.dark, align: "center" } },
      { text: "0", options: { bold: true, fill: { color: C.teal, transparency: 30 }, align: "center" } },
      { text: "2.114", options: { bold: true, fill: { color: C.teal, transparency: 30 }, color: C.dark, align: "center" } },
      { text: "2.326", options: { bold: true, fill: { color: C.teal, transparency: 30 }, color: C.dark, align: "center" } },
      { text: "0.9400", options: { bold: true, fill: { color: C.teal, transparency: 30 }, color: C.dark, align: "center" } },
    ],
    [{ text: "6", options: { align: "center" } }, { text: "0.483", options: { align: "center" } }, { text: "0", options: { align: "center" } }, { text: "2.004", options: { align: "center" } }, { text: "2.534", options: { align: "center" } }, { text: "0.9515", options: { align: "center" } }],
    [{ text: "7", options: { align: "center" } }, { text: "0.419", options: { align: "center" } }, { text: "0.076", options: { align: "center" } }, { text: "1.924", options: { align: "center" } }, { text: "2.704", options: { align: "center" } }, { text: "0.9594", options: { align: "center" } }],
    [{ text: "8", options: { align: "center" } }, { text: "0.373", options: { align: "center" } }, { text: "0.136", options: { align: "center" } }, { text: "1.864", options: { align: "center" } }, { text: "2.847", options: { align: "center" } }, { text: "0.9650", options: { align: "center" } }],
    [{ text: "9", options: { align: "center" } }, { text: "0.337", options: { align: "center" } }, { text: "0.184", options: { align: "center" } }, { text: "1.816", options: { align: "center" } }, { text: "2.970", options: { align: "center" } }, { text: "0.9693", options: { align: "center" } }],
    [{ text: "10", options: { align: "center" } }, { text: "0.308", options: { align: "center" } }, { text: "0.223", options: { align: "center" } }, { text: "1.777", options: { align: "center" } }, { text: "3.078", options: { align: "center" } }, { text: "0.9727", options: { align: "center" } }],
  ];

  slide.addTable(tableData, {
    x: 0.5, y: 1.1, w: 9, h: 3.6,
    fontFace: "Arial",
    fontSize: 12,
    color: C.dark,
    border: { pt: 0.5, color: C.grayLt },
    colW: [0.8, 1.5, 1.3, 1.5, 1.8, 2.1],
    rowH: 0.36,
    fill: { color: C.white },
    valign: "middle",
  });

  // 公式说明区
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.85, w: 4.2, h: 0.65, fill: { color: C.teal, transparency: 10 }, line: { color: C.teal, pt: 1 } });
  slide.addText("X̄图：UCL = X̄̄ + A₂×R̄    LCL = X̄̄ - A₂×R̄", {
    x: 0.65, y: 4.85, w: 3.9, h: 0.65, fontSize: 12, bold: true, color: C.dark, fontFace: "Arial Black", valign: "middle", margin: 0
  });

  slide.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 4.85, w: 4.5, h: 0.65, fill: { color: C.blue, transparency: 10 }, line: { color: C.blue, pt: 1 } });
  slide.addText("R图：UCL = D₄×R̄    CL = R̄    LCL = D₃×R̄", {
    x: 5.15, y: 4.85, w: 4.2, h: 0.65, fontSize: 12, bold: true, color: C.dark, fontFace: "Arial Black", valign: "middle", margin: 0
  });
}

// ========== Slide 7: UCL/LCL如何得来（增强图示） ==========
{
  let slide = pres.addSlide();
  slide.background = { color: C.lightBg };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.navy } });
  slide.addText("03  控制限 UCL / LCL 如何得来", {
    x: 0.5, y: 0.15, w: 9, h: 0.6, fontSize: 22, bold: true, color: C.white, fontFace: "Microsoft YaHei", valign: "middle", margin: 0
  });

  // 警告
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 1.05, w: 9.3, h: 0.55, fill: { color: C.red, transparency: 10 }, line: { color: C.red, pt: 1 } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 1.05, w: 0.08, h: 0.55, fill: { color: C.red } });
  slide.addText("⚠ UCL/LCL 来自过程自身历史数据统计计算  ≠  规格公差（客户给的）  ≠  人为设定", {
    x: 0.6, y: 1.05, w: 8.9, h: 0.55, fontSize: 12, bold: true, color: C.red, fontFace: "Microsoft YaHei", valign: "middle", margin: 0
  });

  // ===== 左侧：控制限五线图示 =====
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 1.75, w: 5.5, h: 3.65, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 }, shadow: makeShadow() });
  slide.addText("控制限五线位置关系图", { x: 0.55, y: 1.8, w: 5.1, h: 0.35, fontSize: 13, bold: true, color: C.navy, fontFace: "Microsoft YaHei", margin: 0 });

  // 绘制五线图
  const chartX = 0.8;
  const chartY = 2.3;
  const chartW = 4.8;
  const chartH = 2.8;

  // 基线（均值线）
  slide.addShape(pres.shapes.RECTANGLE, { x: chartX, y: chartY + chartH * 0.5, w: chartW, h: 0.025, fill: { color: C.teal } });
  slide.addText("CL  中心线（均值）", { x: chartX + 0.1, y: chartY + chartH * 0.5 + 0.03, w: 2.2, h: 0.25, fontSize: 9, color: C.teal, fontFace: "Microsoft YaHei", margin: 0 });

  // UCL线
  const uclY = chartY + chartH * 0.2;
  slide.addShape(pres.shapes.RECTANGLE, { x: chartX, y: uclY, w: chartW, h: 0.025, fill: { color: C.orange } });
  slide.addShape(pres.shapes.RECTANGLE, { x: chartX + chartW * 0.5, y: uclY - 0.3, w: 0.03, h: 0.35, fill: { color: C.orange } });
  slide.addText("UCL = X̄̄ + A₂×R̄", { x: chartX + chartW * 0.5 + 0.1, y: uclY - 0.32, w: 2.2, h: 0.25, fontSize: 10, bold: true, color: C.orange, fontFace: "Arial", margin: 0 });

  // LCL线
  const lclY = chartY + chartH * 0.8;
  slide.addShape(pres.shapes.RECTANGLE, { x: chartX, y: lclY, w: chartW, h: 0.025, fill: { color: C.orange } });
  slide.addShape(pres.shapes.RECTANGLE, { x: chartX + chartW * 0.5, y: lclY - 0.05, w: 0.03, h: 0.35, fill: { color: C.orange } });
  slide.addText("LCL = X̄̄ - A₂×R̄", { x: chartX + chartW * 0.5 + 0.1, y: lclY - 0.05, w: 2.2, h: 0.25, fontSize: 10, bold: true, color: C.orange, fontFace: "Arial", margin: 0 });

  // USL线（规格上限）
  const uslY = chartY + chartH * 0.05;
  slide.addShape(pres.shapes.RECTANGLE, { x: chartX, y: uslY, w: chartW, h: 0.025, fill: { color: C.red } });
  slide.addShape(pres.shapes.RECTANGLE, { x: chartX + chartW * 0.5, y: uslY - 0.3, w: 0.03, h: 0.35, fill: { color: C.red } });
  slide.addText("USL 规格上限（客户）", { x: chartX + chartW * 0.5 + 0.1, y: uslY - 0.32, w: 2.2, h: 0.25, fontSize: 9, color: C.red, fontFace: "Microsoft YaHei", margin: 0 });

  // LSL线（规格下限）
  const lslY = chartY + chartH * 0.95;
  slide.addShape(pres.shapes.RECTANGLE, { x: chartX, y: lslY, w: chartW, h: 0.025, fill: { color: C.red } });
  slide.addShape(pres.shapes.RECTANGLE, { x: chartX + chartW * 0.5, y: lslY - 0.05, w: 0.03, h: 0.35, fill: { color: C.red } });
  slide.addText("LSL 规格下限（客户）", { x: chartX + chartW * 0.5 + 0.1, y: lslY - 0.05, w: 2.2, h: 0.25, fontSize: 9, color: C.red, fontFace: "Microsoft YaHei", margin: 0 });

  // 区域标签
  slide.addText("正常区", { x: chartX + chartW * 0.15, y: chartY + chartH * 0.3, w: 0.8, h: 0.25, fontSize: 9, color: C.mint, fontFace: "Microsoft YaHei", align: "center", margin: 0 });
  slide.addText("异常", { x: chartX + chartW * 0.05, y: chartY + chartH * 0.08, w: 0.6, h: 0.2, fontSize: 8, color: C.red, fontFace: "Microsoft YaHei", align: "center", margin: 0 });

  // ===== 右侧：数值示例 ======
  slide.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.75, w: 3.65, h: 1.7, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 }, shadow: makeShadow() });
  slide.addText("实例演算", { x: 6.15, y: 1.8, w: 3.3, h: 0.32, fontSize: 12, bold: true, color: C.navy, fontFace: "Microsoft YaHei", margin: 0 });
  slide.addText("条件：n=5, X̄̄=2.000mm, R̄=0.005mm", { x: 6.15, y: 2.1, w: 3.3, h: 0.25, fontSize: 10, color: C.gray, fontFace: "Microsoft YaHei", margin: 0 });

  // X̄图结果
  slide.addShape(pres.shapes.RECTANGLE, { x: 6.15, y: 2.4, w: 3.35, h: 0.42, fill: { color: C.teal, transparency: 15 }, line: { color: C.teal, pt: 1 } });
  slide.addText("X̄图: UCL=2.003  LCL=1.997", { x: 6.2, y: 2.4, w: 3.25, h: 0.42, fontSize: 11, bold: true, color: C.teal, fontFace: "Arial", valign: "middle", margin: 0 });

  // R图结果
  slide.addShape(pres.shapes.RECTANGLE, { x: 6.15, y: 2.88, w: 3.35, h: 0.42, fill: { color: C.blue, transparency: 15 }, line: { color: C.blue, pt: 1 } });
  slide.addText("R图: UCL=0.0106  LCL=0", { x: 6.2, y: 2.88, w: 3.25, h: 0.42, fontSize: 11, bold: true, color: C.blue, fontFace: "Arial", valign: "middle", margin: 0 });

  // ===== 右侧下方：控制限vs规格限表格 =====
  slide.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 3.55, w: 3.65, h: 1.85, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 }, shadow: makeShadow() });
  slide.addText("控制限 vs 规格公差", { x: 6.15, y: 3.6, w: 3.3, h: 0.32, fontSize: 12, bold: true, color: C.navy, fontFace: "Microsoft YaHei", margin: 0 });

  const rows = [
    ["", "控制限", "规格限"],
    ["来源", "过程数据", "客户要求"],
    ["含义", "过程稳定？", "产品合格？"],
    ["行动", "查原因", "处置产品"],
  ];

  rows.forEach((row, ri) => {
    row.forEach((cell, ci) => {
      const isHeader = ri === 0;
      const cx = 6.15 + ci * 1.1;
      const cy = 3.95 + ri * 0.36;
      const bgColor = isHeader ? C.navy : (ri % 2 === 0 ? C.lightBg : C.white);
      const txtColor = isHeader ? C.white : (ci === 1 ? C.teal : (ci === 2 ? C.orange : C.dark));
      slide.addText(cell, { x: cx, y: cy, w: 1.05, h: 0.34, fontSize: 9, bold: isHeader, color: txtColor, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });
    });
  });
}

// ========== Slide 8: 控制限vs规格公差 ==========
{
  let slide = pres.addSlide();
  slide.background = { color: C.lightBg };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.navy } });
  slide.addText("03  控制限 vs 规格公差（必须分清）", {
    x: 0.5, y: 0.15, w: 9, h: 0.6, fontSize: 22, bold: true, color: C.white, fontFace: "Microsoft YaHei", valign: "middle", margin: 0
  });

  // ===== 左侧：示意图 =====
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 1.1, w: 4.5, h: 3.4, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 }, shadow: makeShadow() });
  slide.addText("位置关系示意图", { x: 0.55, y: 1.15, w: 4.1, h: 0.32, fontSize: 13, bold: true, color: C.navy, fontFace: "Microsoft YaHei", margin: 0 });

  // 绘制堆叠区间图
  const ix = 0.7, iy = 1.6, iw = 3.9, ih = 2.6;
  // USL-USL区域（规格允许区）
  slide.addShape(pres.shapes.RECTANGLE, { x: ix, y: iy, w: iw, h: ih, fill: { color: C.red, transparency: 85 }, line: { color: C.red, pt: 1 } });
  slide.addText("USL 规格上限", { x: ix + iw - 1.2, y: iy + 0.05, w: 1.1, h: 0.22, fontSize: 9, color: C.red, fontFace: "Microsoft YaHei", margin: 0 });
  slide.addText("LSL 规格下限", { x: ix + iw - 1.2, y: iy + ih - 0.28, w: 1.1, h: 0.22, fontSize: 9, color: C.red, fontFace: "Microsoft YaHei", margin: 0 });

  // UCL-LCL区域（控制区）
  slide.addShape(pres.shapes.RECTANGLE, { x: ix + 0.3, y: iy + 0.35, w: iw - 0.6, h: ih - 0.7, fill: { color: C.orange, transparency: 85 }, line: { color: C.orange, pt: 1 } });
  slide.addText("UCL", { x: ix + iw - 0.55, y: iy + 0.38, w: 0.45, h: 0.22, fontSize: 9, bold: true, color: C.orange, fontFace: "Arial", margin: 0 });
  slide.addText("LCL", { x: ix + iw - 0.55, y: iy + ih - 0.62, w: 0.45, h: 0.22, fontSize: 9, bold: true, color: C.orange, fontFace: "Arial", margin: 0 });

  // 中心线区域
  slide.addShape(pres.shapes.RECTANGLE, { x: ix + 0.6, y: iy + 0.75, w: iw - 1.2, h: ih - 1.5, fill: { color: C.mint, transparency: 60 }, line: { color: C.mint, pt: 1 } });
  slide.addShape(pres.shapes.RECTANGLE, { x: ix + iw / 2 - 0.01, y: iy + 0.6, w: 0.02, h: ih - 1.2, fill: { color: C.teal } });
  slide.addText("CL  μ", { x: ix + iw / 2 - 0.25, y: iy + 0.4, w: 0.5, h: 0.22, fontSize: 9, bold: true, color: C.teal, fontFace: "Arial", margin: 0 });

  // 区域说明
  slide.addShape(pres.shapes.RECTANGLE, { x: ix, y: iy + ih + 0.08, w: 1.3, h: 0.22, fill: { color: C.red, transparency: 60 }, line: { color: C.red, pt: 0.5 } });
  slide.addText("规格允许区", { x: ix, y: iy + ih + 0.08, w: 1.3, h: 0.22, fontSize: 8, color: C.red, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });
  slide.addShape(pres.shapes.RECTANGLE, { x: ix + 1.4, y: iy + ih + 0.08, w: 1.3, h: 0.22, fill: { color: C.orange, transparency: 60 }, line: { color: C.orange, pt: 0.5 } });
  slide.addText("控制区", { x: ix + 1.4, y: iy + ih + 0.08, w: 1.3, h: 0.22, fontSize: 8, color: C.orange, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });
  slide.addShape(pres.shapes.RECTANGLE, { x: ix + 2.8, y: iy + ih + 0.08, w: 1.3, h: 0.22, fill: { color: C.mint, transparency: 60 }, line: { color: C.mint, pt: 0.5 } });
  slide.addText("稳定区", { x: ix + 2.8, y: iy + ih + 0.08, w: 1.3, h: 0.22, fontSize: 8, color: C.mint, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });

  // ===== 右侧：两句核心话 =====
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 1.1, w: 4.65, h: 3.4, fill: { color: C.white }, line: { color: C.teal, pt: 2 }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 1.1, w: 0.1, h: 3.4, fill: { color: C.teal } });
  slide.addText("两句核心话", { x: 5.25, y: 1.18, w: 4.2, h: 0.4, fontSize: 15, bold: true, color: C.teal, fontFace: "Microsoft YaHei", margin: 0 });

  // 第一句
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.25, y: 1.7, w: 4.2, h: 1.3, fill: { color: C.navy } });
  slide.addShape(pres.shapes.OVAL, { x: 5.4, y: 1.82, w: 0.4, h: 0.4, fill: { color: C.teal } });
  slide.addText("1", { x: 5.4, y: 1.82, w: 0.4, h: 0.4, fontSize: 16, bold: true, color: C.white, fontFace: "Arial", align: "center", valign: "middle", margin: 0 });
  slide.addText("UCL/LCL = 过程告诉你的\nUSL/LSL = 客户告诉你的", {
    x: 5.9, y: 1.8, w: 3.4, h: 0.9, fontSize: 14, bold: true, color: C.white, fontFace: "Microsoft YaHei", valign: "middle", margin: 0
  });
  slide.addText("两者来源不同、含义不同、用途不同！", { x: 5.9, y: 2.65, w: 3.4, h: 0.3, fontSize: 10, color: "94A3B8", fontFace: "Microsoft YaHei", margin: 0 });

  // 第二句
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.25, y: 3.1, w: 4.2, h: 1.3, fill: { color: C.dark } });
  slide.addShape(pres.shapes.OVAL, { x: 5.4, y: 3.22, w: 0.4, h: 0.4, fill: { color: C.teal } });
  slide.addText("2", { x: 5.4, y: 3.22, w: 0.4, h: 0.4, fontSize: 16, bold: true, color: C.white, fontFace: "Arial", align: "center", valign: "middle", margin: 0 });
  slide.addText("超出控制限 → 过程异常，查原因\n超出规格限 → 产品不合格，做处置", {
    x: 5.9, y: 3.18, w: 3.4, h: 0.9, fontSize: 13, bold: true, color: C.white, fontFace: "Microsoft YaHei", valign: "middle", margin: 0
  });
  slide.addText("控制限是预警，规格限是判定", { x: 5.9, y: 4.05, w: 3.4, h: 0.3, fontSize: 10, color: "94A3B8", fontFace: "Microsoft YaHei", margin: 0 });

  // 底部：四维度对比表
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 4.65, w: 9.3, h: 0.8, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 }, shadow: makeShadow() });

  const compareLabels = ["对比项", "控制限 UCL/LCL", "规格限 USL/LSL"];
  const compareWidths = [1.8, 3.75, 3.75];
  let tx = 0.35;
  compareLabels.forEach((label, i) => {
    const bg = i === 0 ? C.navy : (i === 1 ? C.teal : C.orange);
    slide.addShape(pres.shapes.RECTANGLE, { x: tx, y: 4.65, w: compareWidths[i], h: 0.8, fill: { color: bg } });
    slide.addText(label, { x: tx, y: 4.65, w: compareWidths[i], h: 0.8, fontSize: 12, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });
    tx += compareWidths[i];
  });
}

// ========== Slide 9: SPC与6σ的关系 ==========
{
  let slide = pres.addSlide();
  slide.background = { color: C.lightBg };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.navy } });
  slide.addText("04  SPC 与 6σ 的关系", {
    x: 0.5, y: 0.15, w: 9, h: 0.6, fontSize: 22, bold: true, color: C.white, fontFace: "Microsoft YaHei", valign: "middle", margin: 0
  });

  // 一句话
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 1.05, w: 9.3, h: 0.6, fill: { color: C.navy } });
  slide.addText("SPC = 监控工具（仪表盘）    vs    6σ = 优化方法论（工程体系）", {
    x: 0.45, y: 1.05, w: 9.1, h: 0.6, fontSize: 15, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0
  });

  // ===== 左侧：数据对比 =====
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 1.8, w: 5.2, h: 3.65, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 }, shadow: makeShadow() });
  slide.addText("核心数据对比", { x: 0.55, y: 1.85, w: 4.8, h: 0.38, fontSize: 14, bold: true, color: C.navy, fontFace: "Microsoft YaHei", margin: 0 });

  const compData = [
    { label: "控制范围", spc: "±3σ", sigma: "±6σ", bar1: 0.5, bar2: 1.0, color: C.navy },
    { label: "缺陷率", spc: "2,700 PPM", sigma: "3.4 PPM", bar1: 0.9, bar2: 1.0, color: C.red },
    { label: "良品率", spc: "99.73%", sigma: "99.99966%", bar1: 0.95, bar2: 1.0, color: C.mint },
    { label: "思维方式", spc: "被动检测", sigma: "主动优化", bar1: 0.5, bar2: 1.0, color: C.orange },
    { label: "执行角色", spc: "QC/工程师", sigma: "BB/GB黑带", bar1: 0.5, bar2: 1.0, color: C.blue },
  ];

  compData.forEach((item, i) => {
    const y = 2.3 + i * 0.6;
    slide.addText(item.label, { x: 0.55, y, w: 1.3, h: 0.5, fontSize: 11, bold: true, color: C.dark, fontFace: "Microsoft YaHei", valign: "middle", margin: 0 });

    // SPC条
    slide.addShape(pres.shapes.RECTANGLE, { x: 2.0, y: y + 0.08, w: 2.4 * item.bar1, h: 0.32, fill: { color: C.teal, transparency: 30 }, line: { color: C.teal, pt: 1 } });
    slide.addText("SPC " + item.spc, { x: 2.1, y: y + 0.08, w: 2.2, h: 0.32, fontSize: 10, bold: true, color: C.teal, fontFace: "Arial", valign: "middle", margin: 0 });

    // 6σ条
    slide.addShape(pres.shapes.RECTANGLE, { x: 2.0, y: y + 0.42, w: 2.4 * item.bar2, h: 0.32, fill: { color: item.color, transparency: 20 }, line: { color: item.color, pt: 1 } });
    slide.addText("6σ " + item.sigma, { x: 2.1, y: y + 0.42, w: 2.2, h: 0.32, fontSize: 10, bold: true, color: item.color, fontFace: "Arial", valign: "middle", margin: 0 });
  });

  // ===== 右侧：DMAIC流程图 =====
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.7, y: 1.8, w: 3.95, h: 3.65, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 }, shadow: makeShadow() });
  slide.addText("DMAIC 流程（6σ改进）", { x: 5.9, y: 1.85, w: 3.55, h: 0.38, fontSize: 14, bold: true, color: C.navy, fontFace: "Microsoft YaHei", margin: 0 });

  const dmaic = [
    { letter: "D", name: "Define", cn: "界定", desc: "界定问题\n确定客户CTQ", color: C.red },
    { letter: "M", name: "Measure", cn: "测量", desc: "SPC测量\n收集基线数据", color: C.orange },
    { letter: "A", name: "Analyze", cn: "分析", desc: "分析SPC\n找出σ偏大原因", color: C.mint },
    { letter: "I", name: "Improve", cn: "改进", desc: "改进过程\n降低σ波动", color: C.blue },
    { letter: "C", name: "Control", cn: "控制", desc: "新设SPC\n巩固成果", color: C.teal },
  ];

  dmaic.forEach((d, i) => {
    const x = 5.9 + (i % 3) * 1.25;
    const y = 2.35 + Math.floor(i / 3) * 1.3;

    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 1.1, h: 1.05, fill: { color: d.color }, line: { color: d.color } });
    slide.addText(d.letter, { x, y: y + 0.02, w: 1.1, h: 0.45, fontSize: 22, bold: true, color: C.white, fontFace: "Arial Black", align: "center", margin: 0 });
    slide.addText(d.cn, { x, y: y + 0.45, w: 1.1, h: 0.28, fontSize: 11, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", margin: 0 });
    slide.addText(d.name, { x, y: y + 0.72, w: 1.1, h: 0.22, fontSize: 8, color: C.white, fontFace: "Arial", align: "center", margin: 0 });

    // 连接箭头（D→M→A→I→C）
    if (i < 2) {
      slide.addText("→", { x: x + 1.05, y: y + 0.3, w: 0.25, h: 0.4, fontSize: 16, bold: true, color: C.gray, fontFace: "Arial", align: "center", valign: "middle", margin: 0 });
    }
    if (i === 2) {
      slide.addText("↓", { x: x + 0.4, y: y + 1.02, w: 0.3, h: 0.25, fontSize: 14, bold: true, color: C.gray, fontFace: "Arial", align: "center", margin: 0 });
    }

    // 描述
    slide.addText(d.desc, { x, y: y + 1.1, w: 1.1, h: 0.35, fontSize: 8, color: C.gray, fontFace: "Microsoft YaHei", align: "center", margin: 0 });
  });

  // SPC是基础
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.9, y: 4.95, w: 3.55, h: 0.38, fill: { color: C.navy, transparency: 15 }, line: { color: C.navy, pt: 1 } });
  slide.addText("SPC 是 6σ 的基础测量工具", { x: 5.9, y: 4.95, w: 3.55, h: 0.38, fontSize: 10, bold: true, color: C.navy, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });
}

// ========== Slide 10: MIM实战案例 ==========
{
  let slide = pres.addSlide();
  slide.background = { color: C.lightBg };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.navy } });
  slide.addText("05  MIM实战案例：内孔径控制", {
    x: 0.5, y: 0.15, w: 9, h: 0.6, fontSize: 22, bold: true, color: C.white, fontFace: "Microsoft YaHei", valign: "middle", margin: 0
  });

  // ===== 场景参数 =====
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 1.05, w: 4.5, h: 1.3, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 1.05, w: 0.08, h: 1.3, fill: { color: C.teal } });
  slide.addText("场景参数", { x: 0.58, y: 1.1, w: 4.1, h: 0.32, fontSize: 12, bold: true, color: C.teal, fontFace: "Microsoft YaHei", margin: 0 });
  const scene = ["产品：MIM不锈钢零件内孔径", "规格：2.000 ± 0.010 mm（USL=2.010, LSL=1.990）", "子组：每小时抽取5件，共25组"];
  slide.addText(scene.map((s, i) => ({ text: s, options: { bullet: true, breakLine: i < scene.length - 1 } })), {
    x: 0.58, y: 1.45, w: 4.1, h: 0.8, fontSize: 11, color: C.dark, fontFace: "Microsoft YaHei", margin: 0
  });

  // ===== 数据结果 =====
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 1.05, w: 4.65, h: 1.3, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 1.05, w: 0.08, h: 1.3, fill: { color: C.blue } });
  slide.addText("基线数据计算", { x: 5.23, y: 1.1, w: 4.3, h: 0.32, fontSize: 12, bold: true, color: C.blue, fontFace: "Microsoft YaHei", margin: 0 });
  const calcs = ["总均值 X̄̄ = 2.0002 mm", "平均极差 R̄ = 0.0050 mm", "σ̂ = 0.005 / 2.326 = 0.00215 mm"];
  slide.addText(calcs.map((c, i) => ({ text: c, options: { bullet: true, breakLine: i < calcs.length - 1 } })), {
    x: 5.23, y: 1.45, w: 4.3, h: 0.8, fontSize: 11, color: C.dark, fontFace: "Microsoft YaHei", margin: 0
  });

  // ===== 控制限结果 =====
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 2.5, w: 4.5, h: 0.9, fill: { color: C.teal, transparency: 10 }, line: { color: C.teal, pt: 1 }, shadow: makeShadow() });
  slide.addText("X̄ 控制图控制限", { x: 0.55, y: 2.55, w: 4.1, h: 0.32, fontSize: 12, bold: true, color: C.teal, fontFace: "Microsoft YaHei", margin: 0 });
  slide.addText("UCL = 2.003 mm    CL = 2.000 mm    LCL = 1.997 mm", { x: 0.55, y: 2.9, w: 4.1, h: 0.4, fontSize: 13, bold: true, color: C.dark, fontFace: "Arial Black", margin: 0 });

  // ===== Cpk结果 =====
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 2.5, w: 4.65, h: 0.9, fill: { color: C.mint, transparency: 10 }, line: { color: C.mint, pt: 1 }, shadow: makeShadow() });
  slide.addText("过程能力分析", { x: 5.2, y: 2.55, w: 4.3, h: 0.32, fontSize: 12, bold: true, color: C.mint, fontFace: "Microsoft YaHei", margin: 0 });
  slide.addText("Cpk = 0.0098 / 0.00645 ≈ 1.52  →  能力良好", { x: 5.2, y: 2.9, w: 4.3, h: 0.4, fontSize: 12, bold: true, color: C.dark, fontFace: "Arial Black", margin: 0 });

  // ===== Cpk等级参照表 =====
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 3.55, w: 9.3, h: 1.85, fill: { color: C.white }, line: { color: C.grayLt, pt: 1 }, shadow: makeShadow() });
  slide.addText("Cpk 过程能力等级参照", { x: 0.55, y: 3.6, w: 8.9, h: 0.38, fontSize: 14, bold: true, color: C.navy, fontFace: "Microsoft YaHei", margin: 0 });

  const cpkLevels = [
    { range: "< 1.0", level: "能力不足", action: "立即改进\n列入FMEA高风险", color: C.red, bg: C.red, trans: 15 },
    { range: "1.0~1.33", level: "勉强合格", action: "需改进\n提升Cp/Cpk", color: C.orange, bg: C.orange, trans: 15 },
    { range: "1.33~1.67", level: "良好", action: "维持监控\n保持当前水平", color: C.mint, bg: C.mint, trans: 15 },
    { range: "≥ 1.67", level: "优秀", action: "追求更高效率\n可持续改进", color: C.teal, bg: C.teal, trans: 15 },
  ];

  cpkLevels.forEach((cpk, i) => {
    const x = 0.5 + i * 2.3;
    const y = 4.05;
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.15, h: 1.2, fill: { color: cpk.bg, transparency: cpk.trans }, line: { color: cpk.color, pt: 1 } });
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.15, h: 0.35, fill: { color: cpk.color } });
    slide.addText(cpk.range, { x, y, w: 2.15, h: 0.35, fontSize: 13, bold: true, color: C.white, fontFace: "Arial Black", align: "center", valign: "middle", margin: 0 });
    slide.addText(cpk.level, { x, y: y + 0.38, w: 2.15, h: 0.28, fontSize: 11, bold: true, color: cpk.color, fontFace: "Microsoft YaHei", align: "center", margin: 0 });
    slide.addText(cpk.action, { x, y: y + 0.68, w: 2.15, h: 0.48, fontSize: 9, color: C.dark, fontFace: "Microsoft YaHei", align: "center", margin: 0 });
  });

  // 推荐标签
  slide.addShape(pres.shapes.RECTANGLE, { x: 2.8, y: 3.9, w: 0.7, h: 0.25, fill: { color: C.mint }, line: { color: C.mint } });
  slide.addText("当前", { x: 2.8, y: 3.9, w: 0.7, h: 0.25, fontSize: 9, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", valign: "middle", margin: 0 });
}

// ========== Slide 11: 要点速记卡 ==========
{
  let slide = pres.addSlide();
  slide.background = { color: C.lightBg };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.navy } });
  slide.addText("06  要点速记卡", {
    x: 0.5, y: 0.15, w: 9, h: 0.6, fontSize: 22, bold: true, color: C.white, fontFace: "Microsoft YaHei", valign: "middle", margin: 0
  });

  // ===== 左侧：核心公式 =====
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 1.05, w: 4.5, h: 2.8, fill: { color: C.white }, line: { color: C.teal, pt: 2 }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 1.05, w: 0.1, h: 2.8, fill: { color: C.teal } });
  slide.addText("核心公式", { x: 0.6, y: 1.12, w: 4.1, h: 0.38, fontSize: 15, bold: true, color: C.teal, fontFace: "Microsoft YaHei", margin: 0 });

  const formulas = [
    { f: "σ = √[Σ(xᵢ-x̄)²/(n-1)]", d: "计算标准差" },
    { f: "σ̂ = R̄ / d₂", d: "极差法估算σ" },
    { f: "UCL = X̄̄ + A₂×R̄", d: "均值图控制限" },
    { f: "UCL = D₄×R̄", d: "极差图控制限" },
    { f: "Cpk = min(USL-x̄,x̄-LSL)/3σ", d: "过程能力指数" },
  ];

  formulas.forEach((f, i) => {
    const y = 1.58 + i * 0.45;
    slide.addShape(pres.shapes.OVAL, { x: 0.6, y: y + 0.05, w: 0.28, h: 0.28, fill: { color: C.teal } });
    slide.addText(String(i + 1), { x: 0.6, y: y + 0.05, w: 0.28, h: 0.28, fontSize: 10, bold: true, color: C.white, fontFace: "Arial", align: "center", valign: "middle", margin: 0 });
    slide.addText(f.f, { x: 1.0, y, w: 2.35, h: 0.38, fontSize: 11, bold: true, color: C.dark, fontFace: "Arial", margin: 0 });
    slide.addText(f.d, { x: 3.4, y, w: 1.3, h: 0.38, fontSize: 10, color: C.gray, fontFace: "Microsoft YaHei", valign: "middle", margin: 0 });
  });

  // ===== 右侧：关键数字 =====
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 1.05, w: 4.65, h: 2.8, fill: { color: C.white }, line: { color: C.orange, pt: 2 }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 1.05, w: 0.1, h: 2.8, fill: { color: C.orange } });
  slide.addText("关键数字", { x: 5.25, y: 1.12, w: 4.3, h: 0.38, fontSize: 15, bold: true, color: C.orange, fontFace: "Microsoft YaHei", margin: 0 });

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
    const y = 1.58 + row * 0.52;
    slide.addText(k.num, { x, y, w: 1.1, h: 0.4, fontSize: 14, bold: true, color: C.orange, fontFace: "Arial Black", margin: 0 });
    slide.addText(k.d, { x: x + 1.1, y, w: 0.9, h: 0.4, fontSize: 10, color: C.gray, fontFace: "Microsoft YaHei", valign: "middle", margin: 0 });
  });

  // ===== 底部：三句核心话 =====
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 4.0, w: 9.3, h: 1.45, fill: { color: C.navy } });
  slide.addText("三句核心话", { x: 0.55, y: 4.08, w: 2, h: 0.35, fontSize: 14, bold: true, color: C.teal, fontFace: "Microsoft YaHei", margin: 0 });

  const coreLines = [
    { num: "1", text: "σ是过程\"告诉\"你的，不是你设定的" },
    { num: "2", text: "UCL/LCL是过程告诉你的，USL/LSL是客户告诉你的，两者不能混淆" },
    { num: "3", text: "SPC告诉你哪里出问题，6σ告诉你如何系统解决" },
  ];

  coreLines.forEach((line, i) => {
    const y = 4.5 + i * 0.32;
    slide.addShape(pres.shapes.OVAL, { x: 0.55, y: y + 0.03, w: 0.26, h: 0.26, fill: { color: C.teal } });
    slide.addText(line.num, { x: 0.55, y: y + 0.03, w: 0.26, h: 0.26, fontSize: 10, bold: true, color: C.white, fontFace: "Arial", align: "center", valign: "middle", margin: 0 });
    slide.addText(line.text, { x: 0.92, y, w: 8.5, h: 0.32, fontSize: 12, bold: true, color: C.white, fontFace: "Microsoft YaHei", valign: "middle", margin: 0 });
  });
}

// ========== Slide 12: 结束页 ==========
{
  let slide = pres.addSlide();
  slide.background = { color: C.navy };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.1, fill: { color: C.teal } });
  slide.addText("掌握 SPC 与 3σ", { x: 0.5, y: 1.7, w: 9, h: 0.8, fontSize: 40, bold: true, color: C.white, fontFace: "Microsoft YaHei", align: "center", margin: 0 });
  slide.addText('让质量管控从"凭经验"走向"用数据说话"', { x: 0.5, y: 2.55, w: 9, h: 0.6, fontSize: 22, color: C.teal, fontFace: "Microsoft YaHei", align: "center", margin: 0 });
  slide.addShape(pres.shapes.RECTANGLE, { x: 3.5, y: 3.35, w: 3, h: 0.04, fill: { color: C.teal } });
  slide.addText("Thank You", { x: 0.5, y: 3.55, w: 9, h: 0.6, fontSize: 28, color: "94A3B8", fontFace: "Georgia", align: "center", margin: 0 });
  slide.addText("MIM行业质量管理体系 · 内部培训", { x: 0.5, y: 4.25, w: 9, h: 0.4, fontSize: 14, color: "64748B", fontFace: "Microsoft YaHei", align: "center", margin: 0 });
  slide.addText("问题咨询：质量部  |  教材版本：v2.0  |  更新日期：2026-04-25", { x: 0.5, y: 4.7, w: 9, h: 0.35, fontSize: 11, color: "64748B", fontFace: "Microsoft YaHei", align: "center", margin: 0 });
}

// ========== 输出文件 ==========
pres.writeFile({ fileName: "SPC_3σ原理培训_v2.pptx" })
  .then(() => console.log("PPT 生成成功: SPC_3σ原理培训_v2.pptx"))
  .catch(err => console.error("生成失败:", err));
