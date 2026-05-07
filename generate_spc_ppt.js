const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'MIM行业质量管理体系';
pres.title = 'SPC统计过程控制与3σ原理';

// 配色方案 - Ocean Gradient (专业、冷静)
const COLOR = {
  primary: "065A82",      // 深蓝
  secondary: "1C7293",    // 青蓝
  accent: "21295C",        // 深夜蓝
  light: "CADCFC",         // 冰蓝
  white: "FFFFFF",
  text: "1E293B",
  textLight: "64748B",
  success: "10B981",
  warning: "F59E0B",
  error: "EF4444",
  bgLight: "F8FAFC"
};

// 辅助函数：添加标题栏
function addTitleBar(slide, title, subtitle = "") {
  // 背景矩形
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.8,
    fill: { color: COLOR.primary },
    line: { type: "none" }
  });
  
  // 标题文字
  slide.addText(title, {
    x: 0.5, y: 0.15, w: 9, h: 0.5,
    fontSize: 24, bold: true, color: COLOR.white,
    fontFace: "Microsoft YaHei",
    margin: 0
  });
  
  // 副标题（可选）
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.5, y: 0.55, w: 9, h: 0.2,
      fontSize: 12, color: COLOR.light,
      fontFace: "Microsoft YaHei",
      margin: 0
    });
  }
}

// ========== 第1页：封面 ==========
let slide1 = pres.addSlide();
slide1.background = { color: COLOR.primary };

// 装饰性矩形
slide1.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 3.5, w: 10, h: 2.125,
  fill: { color: COLOR.accent, transparency: 30 },
  line: { type: "none" }
});

slide1.addShape(pres.shapes.RECTANGLE, {
  x: 8, y: 0, w: 2, h: 5.625,
  fill: { color: COLOR.secondary, transparency: 20 },
  line: { type: "none" }
});

// 主标题
slide1.addText("SPC 统计过程控制", {
  x: 0.5, y: 1.2, w: 9, h: 0.8,
  fontSize: 44, bold: true, color: COLOR.white,
  fontFace: "Microsoft YaHei",
  align: "center", margin: 0
});

// 副标题
slide1.addText("与 3σ 原理", {
  x: 0.5, y: 2.1, w: 9, h: 0.6,
  fontSize: 32, color: COLOR.light,
  fontFace: "Microsoft YaHei",
  align: "center", margin: 0
});

// 分隔线
slide1.addShape(pres.shapes.LINE, {
  x: 2, y: 2.8, w: 6, h: 0,
  line: { color: COLOR.light, width: 2 }
});

// 说明文字
slide1.addText("MIM行业质量管理体系 · 内部培训教材", {
  x: 0.5, y: 3.0, w: 9, h: 0.4,
  fontSize: 16, color: COLOR.light,
  fontFace: "Microsoft YaHei",
  align: "center", margin: 0
});

// 适用部门
slide1.addText([
  { text: "生产部门  |  ", options: { color: COLOR.light } },
  { text: "质量部门  |  ", options: { color: COLOR.light } },
  { text: "工程部门", options: { color: COLOR.light } }
], {
  x: 0.5, y: 3.5, w: 9, h: 0.3,
  fontSize: 14,
  fontFace: "Microsoft YaHei",
  align: "center", margin: 0
});

// ========== 第2页：培训内容目录 ==========
let slide2 = pres.addSlide();
slide2.background = { color: COLOR.bgLight };
addTitleBar(slide2, "培训内容", "CONTENTS");

// 目录项
const contents = [
  { num: "01", title: "正态分布与3σ原理", desc: "68-95-99.7法则、σ概念、直观理解" },
  { num: "02", title: "标准差σ的计算", desc: "公式推导、极差法/标准差法、常数表" },
  { num: "03", title: "UCL/LCL控制限由来", desc: "公式、常数表、控制限vs规格限" },
  { num: "04", title: "SPC与6σ的关系", desc: "DMAIC流程、两者的分工与协作" },
  { num: "05", title: "MIM实战案例", desc: "内孔径控制、过程能力Cpk分析" },
  { num: "06", title: "要点速记卡", desc: "核心公式、关键数字速记、实战口诀" }
];

contents.forEach((item, idx) => {
  const y = 1.2 + idx * 0.7;
  
  // 编号圆圈
  slide2.addShape(pres.shapes.OVAL, {
    x: 0.5, y: y, w: 0.5, h: 0.5,
    fill: { color: COLOR.primary },
    line: { type: "none" }
  });
  
  slide2.addText(item.num, {
    x: 0.5, y: y, w: 0.5, h: 0.5,
    fontSize: 14, bold: true, color: COLOR.white,
    align: "center", valign: "middle", margin: 0
  });
  
  // 标题
  slide2.addText(item.title, {
    x: 1.2, y: y, w: 4, h: 0.3,
    fontSize: 16, bold: true, color: COLOR.text,
    fontFace: "Microsoft YaHei",
    margin: 0
  });
  
  // 描述
  slide2.addText(item.desc, {
    x: 1.2, y: y + 0.25, w: 4, h: 0.2,
    fontSize: 11, color: COLOR.textLight,
    fontFace: "Microsoft YaHei",
    margin: 0
  });
});

// 底部说明
slide2.addText("培训时长约 60 分钟  |  前置知识：基础数学（均值、平方根概念）", {
  x: 0.5, y: 5.2, w: 9, h: 0.3,
  fontSize: 12, color: COLOR.textLight,
  fontFace: "Microsoft YaHei",
  align: "center", margin: 0
});

// ========== 第3页：正态分布与3σ原理 ==========
let slide3 = pres.addSlide();
slide3.background = { color: COLOR.bgLight };
addTitleBar(slide3, "01  正态分布与3σ原理", "正态分布柱状图与五线关系");

// 左：说明文字
slide3.addText([
  { text: "μ 中心线", options: { bullet: true, breakLine: true, fontSize: 14, color: COLOR.text } },
  { text: "UCL/LCL 控制限", options: { bullet: true, breakLine: true, fontSize: 14, color: COLOR.text } },
  { text: "USL/LSL 规格限", options: { bullet: true, breakLine: true, fontSize: 14, color: COLOR.text } }
], {
  x: 0.5, y: 1.0, w: 4, h: 1.2,
  fontFace: "Microsoft YaHei",
  color: COLOR.text
});

// 68-95-99.7法则
const rules = [
  { range: "±1σ", pct: "68.27%", outside: "31.73%", color: COLOR.secondary },
  { range: "±2σ", pct: "95.45%", outside: "4.55%", color: COLOR.warning },
  { range: "±3σ", pct: "99.73%", outside: "0.27%", color: COLOR.success }
];

rules.forEach((rule, idx) => {
  const y = 2.5 + idx * 0.9;
  
  // 背景卡片
  slide3.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: y, w: 4, h: 0.7,
    fill: { color: rule.color, transparency: 85 },
    line: { color: rule.color, width: 1 }
  });
  
  slide3.addText(rule.range, {
    x: 0.7, y: y + 0.05, w: 1, h: 0.3,
    fontSize: 16, bold: true, color: rule.color,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  slide3.addText(`区间内: ${rule.pct}`, {
    x: 0.7, y: y + 0.35, w: 1.8, h: 0.25,
    fontSize: 11, color: COLOR.text,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  slide3.addText(`区间外: ${rule.outside}`, {
    x: 2.5, y: y + 0.35, w: 1.8, h: 0.25,
    fontSize: 11, color: COLOR.error,
    fontFace: "Microsoft YaHei", margin: 0
  });
});

// 关键结论
slide3.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 5.0, w: 9, h: 0.5,
  fill: { color: COLOR.success, transparency: 90 },
  line: { color: COLOR.success, width: 1 }
});

slide3.addText("💡 几乎所有正常产品（99.73%）都落在 μ ± 3σ 范围内，超出即视为异常波动", {
  x: 0.7, y: 5.05, w: 8.6, h: 0.4,
  fontSize: 12, color: COLOR.text,
  fontFace: "Microsoft YaHei", margin: 0
});

// ========== 第4页：σ的直观理解 ==========
let slide4 = pres.addSlide();
slide4.background = { color: COLOR.bgLight };
addTitleBar(slide4, "01  σ 的直观理解", "为什么控制限选 3σ？");

// σ值示例
const sigmaExamples = [
  { sigma: "0.001mm", icon: "★", label: "尺寸波动极小\n精度极高", desc: "专业测量仪器", color: COLOR.success },
  { sigma: "0.005mm", icon: "◆", label: "波动较小\n精密制造", desc: "MIM优质工艺", color: COLOR.secondary },
  { sigma: "0.015mm", icon: "●", label: "波动较大\n接近公差边缘", desc: "需关注改善", color: COLOR.warning },
  { sigma: "0.025mm", icon: "✖", label: "波动过大\n过程失控", desc: "大量超差风险", color: COLOR.error }
];

sigmaExamples.forEach((ex, idx) => {
  const x = 0.5 + idx * 2.4;
  
  // 卡片
  slide4.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 1.2, w: 2.1, h: 1.8,
    fill: { color: "FFFFFF" },
    line: { color: ex.color, width: 2 },
    shadow: { type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.1 }
  });
  
  // σ值
  slide4.addText(ex.sigma, {
    x: x + 0.1, y: 1.3, w: 1.9, h: 0.3,
    fontSize: 18, bold: true, color: ex.color,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  // 图标
  slide4.addText(ex.icon, {
    x: x + 0.1, y: 1.6, w: 0.5, h: 0.4,
    fontSize: 24, color: ex.color, margin: 0
  });
  
  // 标签
  slide4.addText(ex.label, {
    x: x + 0.1, y: 2.0, w: 1.9, h: 0.6,
    fontSize: 12, color: COLOR.text,
    fontFace: "Microsoft YaHei", margin: 0
  });
});

// 控制限选择理由
slide4.addText("为什么控制限选 3σ？", {
  x: 0.5, y: 3.5, w: 9, h: 0.4,
  fontSize: 18, bold: true, color: COLOR.primary,
  fontFace: "Microsoft YaHei", margin: 0
});

const reasons = [
  { sigma: "±2σ", rate: "误报率 4.55%", desc: "频繁误报警\n生产效率低", color: COLOR.warning },
  { sigma: "±3σ", rate: "误报率 0.27%", desc: "误报少、检出强\n业界黄金标准", color: COLOR.success, recommended: true },
  { sigma: "±4σ", rate: "误报率 0.006%", desc: "对异常不敏感\n漏报风险大", color: COLOR.error }
];

reasons.forEach((r, idx) => {
  const x = 0.5 + idx * 3.1;
  
  slide4.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 4.0, w: 2.8, h: 1.3,
    fill: { color: r.color, transparency: 90 },
    line: { color: r.color, width: 2 }
  });
  
  slide4.addText(r.sigma, {
    x: x + 0.2, y: 4.1, w: 1, h: 0.3,
    fontSize: 16, bold: true, color: r.color,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  slide4.addText(r.rate, {
    x: x + 1.2, y: 4.1, w: 1.5, h: 0.3,
    fontSize: 12, color: COLOR.text,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  slide4.addText(r.desc, {
    x: x + 0.2, y: 4.5, w: 2.4, h: 0.6,
    fontSize: 11, color: COLOR.text,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  if (r.recommended) {
    slide4.addText("✓ 推荐", {
      x: x + 2.0, y: 4.1, w: 0.6, h: 0.3,
      fontSize: 12, bold: true, color: COLOR.success,
      fontFace: "Microsoft YaHei", margin: 0
    });
  }
});

// ========== 第5页：标准差σ的计算 ==========
let slide5 = pres.addSlide();
slide5.background = { color: COLOR.bgLight };
addTitleBar(slide5, "02  标准差 σ 的计算", "公式推导与手算步骤");

// 公式
slide5.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 1.0, w: 9, h: 0.6,
  fill: { color: COLOR.primary, transparency: 10 },
  line: { color: COLOR.primary, width: 1 }
});

slide5.addText("计算公式：  σ = √[ Σ(xᵢ - x̄)² / (n-1) ]", {
  x: 0.7, y: 1.1, w: 8.6, h: 0.4,
  fontSize: 18, bold: true, color: COLOR.primary,
  fontFace: "Microsoft YaHei", margin: 0
});

// 参数说明
const params = [
  { symbol: "xᵢ", desc: "第i个测量值" },
  { symbol: "x̄", desc: "样本均值" },
  { symbol: "n", desc: "样本数量 ≥ 25组" },
  { symbol: "n-1", desc: "贝塞尔校正" }
];

params.forEach((p, idx) => {
  const x = 0.5 + idx * 2.4;
  
  slide5.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 1.8, w: 2.1, h: 0.6,
    fill: { color: COLOR.light, transparency: 50 },
    line: { color: COLOR.secondary, width: 1 }
  });
  
  slide5.addText(p.symbol, {
    x: x + 0.1, y: 1.9, w: 0.5, h: 0.3,
    fontSize: 16, bold: true, color: COLOR.primary,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  slide5.addText(p.desc, {
    x: x + 0.7, y: 1.95, w: 1.3, h: 0.25,
    fontSize: 11, color: COLOR.text,
    fontFace: "Microsoft YaHei", margin: 0
  });
});

// 手算步骤
slide5.addText("手算步骤（MIM内孔径示例：n=5, 25组）", {
  x: 0.5, y: 2.8, w: 9, h: 0.3,
  fontSize: 14, bold: true, color: COLOR.primary,
  fontFace: "Microsoft YaHei", margin: 0
});

const steps = [
  { num: "1", title: "收集数据", content: "连续采集25组×5件=125个测量值" },
  { num: "2", title: "计算均值 x̄", content: "x̄ = (2.001+1.999+2.002+1.998+2.000)/5 = 2.000 mm" },
  { num: "3", title: "计算偏差平方", content: "(2.001-2.000)² = 0.000001 等" },
  { num: "4", title: "求 σ", content: "σ = √(偏差平方和/(n-1)) ≈ 0.0016 mm" }
];

steps.forEach((step, idx) => {
  const y = 3.3 + idx * 0.5;
  
  // 步骤编号
  slide5.addShape(pres.shapes.OVAL, {
    x: 0.5, y: y, w: 0.3, h: 0.3,
    fill: { color: COLOR.secondary },
    line: { type: "none" }
  });
  
  slide5.addText(step.num, {
    x: 0.5, y: y, w: 0.3, h: 0.3,
    fontSize: 12, bold: true, color: COLOR.white,
    align: "center", valign: "middle", margin: 0
  });
  
  // 步骤标题
  slide5.addText(step.title + "：", {
    x: 0.9, y: y, w: 1.5, h: 0.3,
    fontSize: 12, bold: true, color: COLOR.text,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  // 步骤内容
  slide5.addText(step.content, {
    x: 2.5, y: y, w: 7, h: 0.3,
    fontSize: 11, color: COLOR.textLight,
    fontFace: "Consolas", margin: 0
  });
});

// ========== 第6页：两种σ估算方法 ==========
let slide6 = pres.addSlide();
slide6.background = { color: COLOR.bgLight };
addTitleBar(slide6, "02  两种 σ 估算方法", "极差法 vs 标准差法");

// 方法对比
const methods = [
  {
    title: "极差法（推荐日常使用）",
    formula: "σ̂ = R̄ / d₂",
    desc: "简单快速，用组内极差估算σ",
    pros: "计算简单，适合车间日常使用",
    color: COLOR.success
  },
  {
    title: "标准差法（适合大批量数据）",
    formula: "σ̂ = S̄ / c₄",
    desc: "更精确，使用样本标准差",
    pros: "精度高，适合实验室分析",
    color: COLOR.secondary
  }
];

methods.forEach((method, idx) => {
  const y = 1.2 + idx * 2.0;
  
  // 卡片
  slide6.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: y, w: 9, h: 1.7,
    fill: { color: "FFFFFF" },
    line: { color: method.color, width: 2 },
    shadow: { type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.1 }
  });
  
  // 标题
  slide6.addText(method.title, {
    x: 0.7, y: y + 0.15, w: 8.6, h: 0.3,
    fontSize: 16, bold: true, color: method.color,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  // 公式
  slide6.addText(method.formula, {
    x: 0.7, y: y + 0.5, w: 8.6, h: 0.3,
    fontSize: 18, bold: true, color: COLOR.primary,
    fontFace: "Consolas", margin: 0
  });
  
  // 描述
  slide6.addText(method.desc, {
    x: 0.7, y: y + 0.85, w: 8.6, h: 0.3,
    fontSize: 12, color: COLOR.text,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  // 优点
  slide6.addText("✓ " + method.pros, {
    x: 0.7, y: y + 1.2, w: 8.6, h: 0.3,
    fontSize: 11, color: COLOR.textLight,
    fontFace: "Microsoft YaHei", margin: 0
  });
});

// 底部说明
slide6.addText("注：d₂、c₄ 为常数表系数（见下页）", {
  x: 0.5, y: 5.2, w: 9, h: 0.3,
  fontSize: 12, color: COLOR.textLight,
  fontFace: "Microsoft YaHei",
  align: "center", margin: 0
});

// ========== 第7页：控制图常数表 ==========
let slide7 = pres.addSlide();
slide7.background = { color: COLOR.bgLight };
addTitleBar(slide7, "02  控制图常数表（n=2~10）", "");

// 常数表
const tableData = [
  [
    { text: "子组大小 n", options: { fill: { color: COLOR.primary }, color: COLOR.white, bold: true, align: "center" } },
    { text: "A₂", options: { fill: { color: COLOR.primary }, color: COLOR.white, bold: true, align: "center" } },
    { text: "d₂", options: { fill: { color: COLOR.primary }, color: COLOR.white, bold: true, align: "center" } },
    { text: "c₄", options: { fill: { color: COLOR.primary }, color: COLOR.white, bold: true, align: "center" } },
    { text: "D₃", options: { fill: { color: COLOR.primary }, color: COLOR.white, bold: true, align: "center" } },
    { text: "D₄", options: { fill: { color: COLOR.primary }, color: COLOR.white, bold: true, align: "center" } }
  ],
  ["2", "1.880", "1.128", "0.7979", "0", "3.267"],
  ["3", "1.023", "1.693", "0.8862", "0", "2.575"],
  ["4", "0.729", "2.059", "0.9213", "0", "2.282"],
  ["5", "0.577", "2.326", "0.9400", "0", "2.115"],
  ["6", "0.483", "2.534", "0.9515", "0", "2.004"],
  ["7", "0.419", "2.704", "0.9594", "0.076", "1.924"],
  ["8", "0.373", "2.847", "0.9650", "0.136", "1.864"],
  ["9", "0.337", "2.970", "0.9693", "0.184", "1.816"],
  ["10", "0.308", "3.078", "0.9727", "0.223", "1.777"]
];

slide7.addTable(tableData, {
  x: 0.5, y: 1.0, w: 9, h: 3.5,
  colW: [1.5, 1.5, 1.5, 1.5, 1.5, 1.5],
  border: { pt: 1, color: COLOR.light },
  fontSize: 12,
  fontFace: "Microsoft YaHei"
});

// 公式说明
slide7.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 4.7, w: 9, h: 0.6,
  fill: { color: COLOR.light, transparency: 50 },
  line: { color: COLOR.secondary, width: 1 }
});

slide7.addText([
  { text: "X̄图：", options: { bold: true, color: COLOR.primary } },
  { text: "UCL = X̄̄ + A₂×R̄    LCL = X̄̄ - A₂×R̄", options: { breakLine: true } },
  { text: "R图：", options: { bold: true, color: COLOR.primary } },
  { text: "UCL = D₄×R̄    CL = R̄    LCL = D₃×R̄", options: {} }
], {
  x: 0.7, y: 4.75, w: 8.6, h: 0.5,
  fontSize: 12, fontFace: "Consolas", color: COLOR.text
});

// ========== 第8页：控制限UCL/LCL如何得来 ==========
let slide8 = pres.addSlide();
slide8.background = { color: COLOR.bgLight };
addTitleBar(slide8, "03  控制限 UCL / LCL 如何得来", "⚠ UCL/LCL 来自过程数据 ≠ 规格公差 ≠ 人为设定");

// 警告框
slide8.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 1.0, w: 9, h: 0.5,
  fill: { color: COLOR.warning, transparency: 80 },
  line: { color: COLOR.warning, width: 2 }
});

slide8.addText("⚠  UCL/LCL 来自过程自身历史数据统计计算  ≠  规格公差（客户给的）  ≠  人为设定", {
  x: 0.7, y: 1.05, w: 8.6, h: 0.4,
  fontSize: 12, bold: true, color: COLOR.text,
  fontFace: "Microsoft YaHei", margin: 0
});

// 控制限计算公式
slide8.addText("控制限计算公式", {
  x: 0.5, y: 1.7, w: 9, h: 0.3,
  fontSize: 14, bold: true, color: COLOR.primary,
  fontFace: "Microsoft YaHei", margin: 0
});

slide8.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 2.1, w: 9, h: 0.8,
  fill: { color: COLOR.secondary, transparency: 90 },
  line: { color: COLOR.secondary, width: 1 }
});

slide8.addText([
  { text: "X̄图：", options: { bold: true, color: COLOR.primary, breakLine: true } },
  { text: "  UCL = X̄̄ + A₂×R̄    LCL = X̄̄ - A₂×R̄", options: { fontFace: "Consolas", fontSize: 13 } },
  { text: "\nR图：", options: { bold: true, color: COLOR.primary, breakLine: true } },
  { text: "  UCL = D₄×R̄    CL = R̄    LCL = D₃×R̄", options: { fontFace: "Consolas", fontSize: 13 } }
], {
  x: 0.7, y: 2.15, w: 8.6, h: 0.7,
  color: COLOR.text, fontFace: "Microsoft YaHei"
});

// 实例演算
slide8.addText("实例演算（n=5, X̄̄=2.000mm, R̄=0.005mm）", {
  x: 0.5, y: 3.1, w: 9, h: 0.3,
  fontSize: 14, bold: true, color: COLOR.primary,
  fontFace: "Microsoft YaHei", margin: 0
});

const calculations = [
  { name: "X̄图", ucl: "UCL = 2.003 mm", lcl: "LCL = 1.997 mm", color: COLOR.success },
  { name: "R图", ucl: "UCL = 0.0106 mm", lcl: "LCL = 0", color: COLOR.secondary }
];

calculations.forEach((calc, idx) => {
  const x = 0.5 + idx * 4.5;
  
  slide8.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 3.6, w: 4, h: 0.8,
    fill: { color: calc.color, transparency: 90 },
    line: { color: calc.color, width: 2 }
  });
  
  slide8.addText(calc.name + ":", {
    x: x + 0.2, y: 3.7, w: 0.8, h: 0.25,
    fontSize: 13, bold: true, color: calc.color,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  slide8.addText(calc.ucl, {
    x: x + 0.2, y: 3.95, w: 3.6, h: 0.2,
    fontSize: 11, color: COLOR.text,
    fontFace: "Consolas", margin: 0
  });
  
  slide8.addText(calc.lcl, {
    x: x + 0.2, y: 4.15, w: 3.6, h: 0.2,
    fontSize: 11, color: COLOR.text,
    fontFace: "Consolas", margin: 0
  });
});

// ========== 第9页：控制限vs规格公差 ==========
let slide9 = pres.addSlide();
slide9.background = { color: COLOR.bgLight };
addTitleBar(slide9, "03  控制限 vs 规格公差（必须分清）", "两者来源不同、含义不同、用途不同！");

// 对比表格
const comparisonData = [
  [
    { text: "对比项", options: { fill: { color: COLOR.primary }, color: COLOR.white, bold: true, align: "center" } },
    { text: "控制限 UCL/LCL", options: { fill: { color: COLOR.secondary }, color: COLOR.white, bold: true, align: "center" } },
    { text: "规格限 USL/LSL", options: { fill: { color: COLOR.accent }, color: COLOR.white, bold: true, align: "center" } }
  ],
  ["来源", "过程数据", "客户要求"],
  ["含义", "过程稳定？", "产品合格？"],
  ["行动", "查原因", "处置产品"]
];

slide9.addTable(comparisonData, {
  x: 0.5, y: 1.2, w: 9, h: 1.5,
  colW: [2, 3.5, 3.5],
  border: { pt: 1, color: COLOR.light },
  fontSize: 13,
  fontFace: "Microsoft YaHei",
  align: "center"
});

// 核心话
slide9.addText("两句核心话", {
  x: 0.5, y: 3.0, w: 9, h: 0.3,
  fontSize: 16, bold: true, color: COLOR.primary,
  fontFace: "Microsoft YaHei", margin: 0
});

const coreMessages = [
  { num: "1", msg: "UCL/LCL = 过程告诉你的  |  USL/LSL = 客户告诉你的" },
  { num: "2", msg: "超出控制限 → 过程异常，查原因  |  超出规格限 → 产品不合格，做处置" }
];

coreMessages.forEach((cm, idx) => {
  const y = 3.5 + idx * 0.7;
  
  slide9.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: y, w: 9, h: 0.5,
    fill: { color: COLOR.success, transparency: 90 },
    line: { color: COLOR.success, width: 1 }
  });
  
  slide9.addText(cm.num, {
    x: 0.7, y: y + 0.1, w: 0.3, h: 0.3,
    fontSize: 16, bold: true, color: COLOR.primary,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  slide9.addText(cm.msg, {
    x: 1.2, y: y + 0.1, w: 8, h: 0.3,
    fontSize: 12, color: COLOR.text,
    fontFace: "Microsoft YaHei", margin: 0
  });
});

// ========== 第10页：SPC与6σ的关系 ==========
let slide10 = pres.addSlide();
slide10.background = { color: COLOR.bgLight };
addTitleBar(slide10, "04  SPC 与 6σ 的关系", "SPC = 监控工具（仪表盘）vs  6σ = 优化方法论（工程体系）");

// 核心数据对比
const spcVs6sigma = [
  { item: "控制范围", spc: "±3σ", sigma6: "±6σ", color: COLOR.secondary },
  { item: "缺陷率", spc: "2,700 PPM", sigma6: "3.4 PPM", color: COLOR.warning },
  { item: "良品率", spc: "99.73%", sigma6: "99.99966%", color: COLOR.success },
  { item: "思维方式", spc: "被动检测", sigma6: "主动优化", color: COLOR.accent },
  { item: "执行角色", spc: "QC/工程师", sigma6: "BB/GB黑带", color: COLOR.primary }
];

slide10.addTable([
  [
    { text: "对比项", options: { fill: { color: COLOR.primary }, color: COLOR.white, bold: true, align: "center" } },
    { text: "SPC", options: { fill: { color: COLOR.secondary }, color: COLOR.white, bold: true, align: "center" } },
    { text: "6σ", options: { fill: { color: COLOR.accent }, color: COLOR.white, bold: true, align: "center" } }
  ].concat(spcVs6sigma.map(row => [row.item, row.spc, row.sigma6]))
], {
  x: 0.5, y: 1.2, w: 9, h: 2.0,
  colW: [2.5, 3.25, 3.25],
  border: { pt: 1, color: COLOR.light },
  fontSize: 12,
  fontFace: "Microsoft YaHei",
  align: "center"
});

// DMAIC流程
slide10.addText("DMAIC 流程（6σ改进）", {
  x: 0.5, y: 3.4, w: 9, h: 0.3,
  fontSize: 14, bold: true, color: COLOR.primary,
  fontFace: "Microsoft YaHei", margin: 0
});

const dmaic = [
  { letter: "D", name: "界定 Define", desc: "界定问题\n确定客户CTQ", color: "E74C3C" },
  { letter: "M", name: "测量 Measure", desc: "SPC测量\n收集基线数据", color: "F39C12" },
  { letter: "A", name: "分析 Analyze", desc: "分析SPC\n找出σ偏大原因", color: "F1C40F" },
  { letter: "I", name: "改进 Improve", desc: "改进过程\n降低σ波动", color: "2ECC71" },
  { letter: "C", name: "控制 Control", desc: "新设SPC\n巩固成果", color: "3498DB" }
];

dmaic.forEach((step, idx) => {
  const x = 0.5 + idx * 1.85;
  
  slide10.addShape(pres.shapes.OVAL, {
    x: x + 0.55, y: 3.9, w: 0.6, h: 0.6,
    fill: { color: step.color },
    line: { type: "none" }
  });
  
  slide10.addText(step.letter, {
    x: x + 0.55, y: 3.9, w: 0.6, h: 0.6,
    fontSize: 20, bold: true, color: COLOR.white,
    align: "center", valign: "middle", margin: 0
  });
  
  slide10.addText(step.name, {
    x: x, y: 4.6, w: 1.6, h: 0.3,
    fontSize: 10, bold: true, color: COLOR.text,
    fontFace: "Microsoft YaHei", align: "center", margin: 0
  });
});

slide10.addText("💡 SPC 是 6σ 的基础测量工具", {
  x: 0.5, y: 5.1, w: 9, h: 0.3,
  fontSize: 13, bold: true, color: COLOR.primary,
  fontFace: "Microsoft YaHei", align: "center", margin: 0
});

// ========== 第11页：MIM实战案例 ==========
let slide11 = pres.addSlide();
slide11.background = { color: COLOR.bgLight };
addTitleBar(slide11, "05  MIM实战案例：内孔径控制", "场景：MIM不锈钢零件内孔径");

// 场景参数
slide11.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 1.0, w: 9, h: 0.8,
  fill: { color: COLOR.light, transparency: 50 },
  line: { color: COLOR.secondary, width: 1 }
});

slide11.addText([
  { text: "产品：", options: { bold: true, color: COLOR.primary } },
  { text: "MIM不锈钢零件内孔径\n", options: { breakLine: true } },
  { text: "规格：", options: { bold: true, color: COLOR.primary } },
  { text: "2.000 ± 0.010 mm（USL=2.010, LSL=1.990）\n", options: { breakLine: true } },
  { text: "子组：", options: { bold: true, color: COLOR.primary } },
  { text: "每小时抽取5件，共25组", options: {} }
], {
  x: 0.7, y: 1.05, w: 8.6, h: 0.7,
  fontSize: 12, color: COLOR.text, fontFace: "Microsoft YaHei"
});

// 基线数据
slide11.addText("基线数据计算", {
  x: 0.5, y: 2.0, w: 4, h: 0.3,
  fontSize: 14, bold: true, color: COLOR.primary,
  fontFace: "Microsoft YaHei", margin: 0
});

const baselineData = [
  "总均值 X̄̄ = 2.0002 mm",
  "平均极差 R̄ = 0.0050 mm",
  "σ̂ = 0.005 / 2.326 = 0.00215 mm"
];

baselineData.forEach((data, idx) => {
  slide11.addText("• " + data, {
    x: 0.7, y: 2.4 + idx * 0.3, w: 4, h: 0.25,
    fontSize: 11, color: COLOR.text,
    fontFace: "Consolas", margin: 0
  });
});

// 控制限
slide11.addText("X̄ 控制图控制限", {
  x: 5.5, y: 2.0, w: 4, h: 0.3,
  fontSize: 14, bold: true, color: COLOR.primary,
  fontFace: "Microsoft YaHei", margin: 0
});

slide11.addShape(pres.shapes.RECTANGLE, {
  x: 5.5, y: 2.4, w: 4, h: 0.6,
  fill: { color: COLOR.success, transparency: 90 },
  line: { color: COLOR.success, width: 2 }
});

slide11.addText([
  { text: "UCL = 2.003 mm    ", options: { fontSize: 14, bold: true, color: COLOR.success } },
  { text: "CL = 2.000 mm    ", options: { fontSize: 14, bold: true, color: COLOR.secondary } },
  { text: "LCL = 1.997 mm", options: { fontSize: 14, bold: true, color: COLOR.error } }
], {
  x: 5.6, y: 2.45, w: 3.8, h: 0.5,
  fontFace: "Consolas"
});

// Cpk分析
slide11.addText("过程能力分析", {
  x: 0.5, y: 3.5, w: 9, h: 0.3,
  fontSize: 14, bold: true, color: COLOR.primary,
  fontFace: "Microsoft YaHei", margin: 0
});

slide11.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 3.9, w: 9, h: 0.5,
  fill: { color: COLOR.success, transparency: 80 },
  line: { color: COLOR.success, width: 2 }
});

slide11.addText("Cpk = 0.0098 / 0.00645 ≈ 1.52  →  能力良好", {
  x: 0.7, y: 3.95, w: 8.6, h: 0.4,
  fontSize: 16, bold: true, color: COLOR.success,
  fontFace: "Consolas", margin: 0
});

// Cpk等级
const cpkLevels = [
  { range: "< 1.0", level: "能力不足", action: "立即改进", color: COLOR.error },
  { range: "1.0~1.33", level: "勉强合格", action: "需改进", color: COLOR.warning },
  { range: "1.33~1.67", level: "良好", action: "维持监控", color: COLOR.success, current: true },
  { range: "≥ 1.67", level: "优秀", action: "追求更高", color: COLOR.secondary }
];

cpkLevels.forEach((level, idx) => {
  const x = 0.5 + idx * 2.3;
  
  slide11.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 4.6, w: 2, h: 0.6,
    fill: { color: level.color, transparency: level.current ? 0 : 80 },
    line: { color: level.color, width: 2 }
  });
  
  const textColor = level.current ? COLOR.white : level.color;
  
  slide11.addText(level.range, {
    x: x + 0.1, y: 4.65, w: 1.8, h: 0.2,
    fontSize: 11, bold: true, color: textColor,
    fontFace: "Microsoft YaHei", align: "center", margin: 0
  });
  
  slide11.addText(level.level, {
    x: x + 0.1, y: 4.85, w: 1.8, h: 0.2,
    fontSize: 10, color: textColor,
    fontFace: "Microsoft YaHei", align: "center", margin: 0
  });
});

// ========== 第12页：要点速记卡 ==========
let slide12 = pres.addSlide();
slide12.background = { color: COLOR.bgLight };
addTitleBar(slide12, "06  要点速记卡", "核心公式、关键数字速记、实战口诀");

// 核心公式
slide12.addText("核心公式", {
  x: 0.5, y: 1.0, w: 4, h: 0.3,
  fontSize: 16, bold: true, color: COLOR.primary,
  fontFace: "Microsoft YaHei", margin: 0
});

const formulas = [
  { num: "1", formula: "σ = √[Σ(xᵢ-x̄)²/(n-1)]", desc: "计算标准差" },
  { num: "2", formula: "σ̂ = R̄ / d₂", desc: "极差法估算σ" },
  { num: "3", formula: "UCL = X̄̄ + A₂×R̄", desc: "均值图控制限" },
  { num: "4", formula: "UCL = D₄×R̄", desc: "极差图控制限" },
  { num: "5", formula: "Cpk = min(USL-x̄,x̄-LSL)/3σ", desc: "过程能力指数" }
];

formulas.forEach((f, idx) => {
  const y = 1.4 + idx * 0.6;
  
  slide12.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: y, w: 4, h: 0.5,
    fill: { color: COLOR.light, transparency: 60 },
    line: { color: COLOR.secondary, width: 1 }
  });
  
  slide12.addText(f.num, {
    x: 0.6, y: y + 0.05, w: 0.3, h: 0.2,
    fontSize: 12, bold: true, color: COLOR.primary,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  slide12.addText(f.formula, {
    x: 1.0, y: y + 0.05, w: 2.2, h: 0.2,
    fontSize: 11, bold: true, color: COLOR.text,
    fontFace: "Consolas", margin: 0
  });
  
  slide12.addText(f.desc, {
    x: 3.3, y: y + 0.1, w: 1.1, h: 0.2,
    fontSize: 10, color: COLOR.textLight,
    fontFace: "Microsoft YaHei", margin: 0
  });
});

// 关键数字
slide12.addText("关键数字", {
  x: 5.0, y: 1.0, w: 4, h: 0.3,
  fontSize: 16, bold: true, color: COLOR.primary,
  fontFace: "Microsoft YaHei", margin: 0
});

const keyNumbers = [
  { num: "68.27%", desc: "μ±1σ 范围内" },
  { num: "95.45%", desc: "μ±2σ 范围内" },
  { num: "99.73%", desc: "μ±3σ 范围内" },
  { num: "2,700 PPM", desc: "3σ时缺陷率" },
  { num: "3.4 PPM", desc: "6σ时缺陷率" },
  { num: "25组", desc: "计算σ最少数据量" },
  { num: "Cpk ≥ 1.33", desc: "过程能力合格" }
];

keyNumbers.forEach((kn, idx) => {
  const y = 1.4 + idx * 0.5;
  
  slide12.addShape(pres.shapes.RECTANGLE, {
    x: 5.0, y: y, w: 4, h: 0.4,
    fill: { color: COLOR.success, transparency: 90 },
    line: { type: "none" }
  });
  
  slide12.addText(kn.num, {
    x: 5.1, y: y + 0.05, w: 1.5, h: 0.2,
    fontSize: 12, bold: true, color: COLOR.primary,
    fontFace: "Consolas", margin: 0
  });
  
  slide12.addText(kn.desc, {
    x: 6.7, y: y + 0.08, w: 2.2, h: 0.2,
    fontSize: 10, color: COLOR.text,
    fontFace: "Microsoft YaHei", margin: 0
  });
});

// ========== 第13页：三句核心话 ==========
let slide13 = pres.addSlide();
slide13.background = { color: COLOR.bgLight };
addTitleBar(slide13, "06  三句核心话", "记住这三句话，SPC就掌握了一半");

const coreQuotes = [
  { num: "1", quote: "σ是过程\"告诉\"你的，不是你设定的" },
  { num: "2", quote: "UCL/LCL是过程告诉你的，USL/LSL是客户告诉你的，两者不能混淆" },
  { num: "3", quote: "SPC告诉你哪里出问题，6σ告诉你如何系统解决" }
];

coreQuotes.forEach((cq, idx) => {
  const y = 1.5 + idx * 1.2;
  
  slide13.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: y, w: 9, h: 0.8,
    fill: { color: COLOR.primary, transparency: 90 },
    line: { color: COLOR.primary, width: 2 }
  });
  
  slide13.addText(cq.num, {
    x: 0.7, y: y + 0.1, w: 0.5, h: 0.5,
    fontSize: 28, bold: true, color: COLOR.primary,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  slide13.addText(cq.quote, {
    x: 1.5, y: y + 0.15, w: 7.8, h: 0.5,
    fontSize: 14, color: COLOR.text,
    fontFace: "Microsoft YaHei", margin: 0
  });
});

// ========== 第14页：结束页 ==========
let slide14 = pres.addSlide();
slide14.background = { color: COLOR.primary };

slide14.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 2, w: 10, h: 3.625,
  fill: { color: COLOR.accent, transparency: 40 },
  line: { type: "none" }
});

slide14.addText("掌握 SPC 与 3σ", {
  x: 0.5, y: 1.5, w: 9, h: 0.6,
  fontSize: 36, bold: true, color: COLOR.white,
  fontFace: "Microsoft YaHei", align: "center", margin: 0
});

slide14.addText("让质量管控从\"凭经验\"走向\"用数据说话\"", {
  x: 0.5, y: 2.3, w: 9, h: 0.5,
  fontSize: 20, color: COLOR.light,
  fontFace: "Microsoft YaHei", align: "center", margin: 0
});

slide14.addText("Thank You", {
  x: 0.5, y: 3.5, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLOR.white,
  fontFace: "Microsoft YaHei", align: "center", margin: 0
});

slide14.addText("MIM行业质量管理体系 · 内部培训", {
  x: 0.5, y: 4.5, w: 9, h: 0.3,
  fontSize: 14, color: COLOR.light,
  fontFace: "Microsoft YaHei", align: "center", margin: 0
});

slide14.addText("问题咨询：质量部  |  教材版本：v3.0  |  更新日期：2026-05-07", {
  x: 0.5, y: 5.2, w: 9, h: 0.3,
  fontSize: 11, color: COLOR.light,
  fontFace: "Microsoft YaHei", align: "center", margin: 0
});

// 保存文件
pres.writeFile({ fileName: "SPC培训教材_完整版.pptx" });
console.log("✅ PPT生成成功：SPC培训教材_完整版.pptx");
console.log("📊 共14页，包含完整的SPC培训内容");
