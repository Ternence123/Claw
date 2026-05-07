const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'MIM行业质量管理体系';
pres.title = '11个高效思维工具培训教材';

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
slide1.addText("11个高效思维工具", {
  x: 0.5, y: 1.2, w: 9, h: 0.8,
  fontSize: 44, bold: true, color: COLOR.white,
  fontFace: "Microsoft YaHei",
  align: "center", margin: 0
});

// 副标题
slide1.addText("培训教材", {
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
slide1.addText("SCQA · DESC · CAR · 黄金三点法 · 结论先行法 · 剥洋葱法 · 利益分析法 · 331法则 · 旁观者视角三步法 · 5年倒推法", {
  x: 0.5, y: 3.0, w: 9, h: 0.4,
  fontSize: 14, color: COLOR.light,
  fontFace: "Microsoft YaHei",
  align: "center", margin: 0
});

// ========== 第2页：目录 ==========
let slide2 = pres.addSlide();
slide2.background = { color: COLOR.bgLight };
addTitleBar(slide2, "培训内容", "CONTENTS");

// 目录项
const contents = [
  { num: "01", title: "SCQA分析法", desc: "情境-冲突-问题-答案" },
  { num: "02", title: "DESC沟通法", desc: "描述-表达-指定-结果" },
  { num: "03", title: "CAR模型", desc: "情境-行动-结果" },
  { num: "04", title: "黄金三点法", desc: "结构化表达技巧" },
  { num: "05", title: "结论先行法", desc: "金字塔原理核心" },
  { num: "06", title: "剥洋葱法", desc: "层层递进深度分析" },
  { num: "07", title: "利益分析法", desc: "利益相关者分析" },
  { num: "08", title: "331法则", desc: "高效沟通与决策" },
  { num: "09", title: "旁观者视角三步法", desc: "第三方客观分析" },
  { num: "10", title: "5年倒推法", desc: "长期规划与逆向思维" },
  { num: "11", title: "综合实战演练", desc: "工具组合应用" }
];

contents.forEach((item, idx) => {
  const y = 1.2 + idx * 0.38;
  
  // 编号圆圈
  slide2.addShape(pres.shapes.OVAL, {
    x: 0.5, y: y, w: 0.35, h: 0.35,
    fill: { color: COLOR.primary },
    line: { type: "none" }
  });
  
  slide2.addText(item.num, {
    x: 0.5, y: y, w: 0.35, h: 0.35,
    fontSize: 10, bold: true, color: COLOR.white,
    align: "center", valign: "middle", margin: 0
  });
  
  // 标题
  slide2.addText(item.title, {
    x: 1.0, y: y, w: 3, h: 0.25,
    fontSize: 13, bold: true, color: COLOR.text,
    fontFace: "Microsoft YaHei",
    margin: 0
  });
  
  // 描述
  slide2.addText(item.desc, {
    x: 4.5, y: y, w: 4.5, h: 0.25,
    fontSize: 11, color: COLOR.textLight,
    fontFace: "Microsoft YaHei",
    margin: 0
  });
});

// ========== 第3页：SCQA分析法 ==========
let slide3 = pres.addSlide();
slide3.background = { color: COLOR.bgLight };
addTitleBar(slide3, "01  SCQA分析法", "Situation-Complication-Question-Answer");

// SCQA四个部分
const scqa = [
  { 
    letter: "S", fullName: "Situation（情境）", 
    desc: "描述当前背景和现状", 
    example: "我们的产品目前在市场上占有20%份额",
    color: "3B82F6"
  },
  { 
    letter: "C", fullName: "Complication（冲突）", 
    desc: "指出存在的问题或挑战", 
    example: "但竞争对手推出了类似产品，份额在下降",
    color: "EF4444"
  },
  { 
    letter: "Q", fullName: "Question（问题）", 
    desc: "提出核心问题", 
    example: "我们如何挽回市场份额？",
    color: "F59E0B"
  },
  { 
    letter: "A", fullName: "Answer（答案）", 
    desc: "给出解决方案", 
    example: "推出升级版产品+营销策略",
    color: "10B981"
  }
];

scqa.forEach((item, idx) => {
  const x = 0.5 + idx * 2.4;
  
  // 卡片
  slide3.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 1.2, w: 2.1, h: 1.8,
    fill: { color: item.color, transparency: 85 },
    line: { color: item.color, width: 2 }
  });
  
  // 字母
  slide3.addText(item.letter, {
    x: x + 0.1, y: 1.3, w: 0.5, h: 0.5,
    fontSize: 32, bold: true, color: item.color,
    fontFace: "Arial Black", margin: 0
  });
  
  // 全称
  slide3.addText(item.fullName, {
    x: x + 0.1, y: 1.9, w: 1.9, h: 0.4,
    fontSize: 11, bold: true, color: COLOR.text,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  // 说明
  slide3.addText(item.desc, {
    x: x + 0.1, y: 2.35, w: 1.9, h: 0.3,
    fontSize: 10, color: COLOR.textLight,
    fontFace: "Microsoft YaHei", margin: 0
  });
});

// 应用示例
slide3.addText("应用示例", {
  x: 0.5, y: 3.3, w: 9, h: 0.3,
  fontSize: 14, bold: true, color: COLOR.primary,
  fontFace: "Microsoft YaHei", margin: 0
});

slide3.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 3.7, w: 9, h: 1.5,
  fill: { color: COLOR.light, transparency: 60 },
  line: { color: COLOR.secondary, width: 1 }
});

scqa.forEach((item, idx) => {
  const y = 3.8 + idx * 0.35;
  slide3.addText(`【${item.letter}】${item.example}`, {
    x: 0.7, y: y, w: 8.6, h: 0.25,
    fontSize: 11, color: COLOR.text,
    fontFace: "Microsoft YaHei", margin: 0
  });
});

// ========== 第4页：DESC沟通法 ==========
let slide4 = pres.addSlide();
slide4.background = { color: COLOR.bgLight };
addTitleBar(slide4, "02  DESC沟通法", "Describe-Express-Specify-Consequence");

// DESC四个步骤
const desc = [
  { 
    letter: "D", fullName: "Describe（描述）", 
    desc: "客观描述行为或事实，不评价", 
    example: "我注意到你这周迟到了3次",
    color: "3B82F6"
  },
  { 
    letter: "E", fullName: "Express（表达）", 
    desc: "表达你的感受或看法", 
    example: "这让我担心项目进度会受影响",
    color: "8B5CF6"
  },
  { 
    letter: "S", fullName: "Specify（指定）", 
    desc: "明确指出期望的行为", 
    example: "希望你明天开始能准时到岗",
    color: "F59E0B"
  },
  { 
    letter: "C", fullName: "Consequence（结果）", 
    desc: "说明正面或负面结果", 
    example: "这样我们能按时完成项目，你也能获得好评",
    color: "10B981"
  }
];

desc.forEach((item, idx) => {
  const y = 1.2 + idx * 1.0;
  
  // 卡片
  slide4.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: y, w: 9, h: 0.8,
    fill: { color: "FFFFFF" },
    line: { color: item.color, width: 3 }
  });
  
  // 字母圆圈
  slide4.addShape(pres.shapes.OVAL, {
    x: 0.7, y: y + 0.15, w: 0.5, h: 0.5,
    fill: { color: item.color },
    line: { type: "none" }
  });
  
  slide4.addText(item.letter, {
    x: 0.7, y: y + 0.15, w: 0.5, h: 0.5,
    fontSize: 20, bold: true, color: COLOR.white,
    align: "center", valign: "middle", margin: 0
  });
  
  // 全称
  slide4.addText(item.fullName, {
    x: 1.4, y: y + 0.1, w: 3, h: 0.3,
    fontSize: 14, bold: true, color: item.color,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  // 说明
  slide4.addText(item.desc, {
    x: 1.4, y: y + 0.45, w: 3.5, h: 0.25,
    fontSize: 11, color: COLOR.textLight,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  // 示例
  slide4.addText(`💡 ${item.example}`, {
    x: 5.0, y: y + 0.15, w: 4, h: 0.5,
    fontSize: 11, color: COLOR.text,
    fontFace: "Microsoft YaHei", margin: 0
  });
});

// ========== 第5页：CAR模型 ==========
let slide5 = pres.addSlide();
slide5.background = { color: COLOR.bgLight };
addTitleBar(slide5, "03  CAR模型", "Context-Action-Result（行为面试法）");

// CAR三个部分
const car = [
  { 
    letter: "C", fullName: "Context（情境）", 
    desc: "当时的背景和面临的挑战", 
    tips: "说明时间、地点、任务、困难",
    color: "3B82F6"
  },
  { 
    letter: "A", fullName: "Action（行动）", 
    desc: "你采取的具体行动和方法", 
    tips: "重点！用\"我\"而不是\"我们\"",
    color: "F59E0B"
  },
  { 
    letter: "R", fullName: "Result（结果）", 
    desc: "取得的成果和可量化数据", 
    tips: "用数字说话，说明影响力",
    color: "10B981"
  }
];

car.forEach((item, idx) => {
  const x = 0.5 + idx * 3.2;
  
  // 卡片
  slide5.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 1.2, w: 2.8, h: 2.5,
    fill: { color: item.color, transparency: 90 },
    line: { color: item.color, width: 2 },
    shadow: { type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.1 }
  });
  
  // 字母
  slide5.addText(item.letter, {
    x: x + 0.2, y: 1.4, w: 0.8, h: 0.8,
    fontSize: 48, bold: true, color: item.color,
    fontFace: "Arial Black", margin: 0
  });
  
  // 全称
  slide5.addText(item.fullName, {
    x: x + 0.2, y: 2.3, w: 2.4, h: 0.4,
    fontSize: 13, bold: true, color: COLOR.text,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  // 说明
  slide5.addText(item.desc, {
    x: x + 0.2, y: 2.75, w: 2.4, h: 0.4,
    fontSize: 11, color: COLOR.text,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  // 提示
  slide5.addText(`💡 ${item.tips}`, {
    x: x + 0.2, y: 3.2, w: 2.4, h: 0.4,
    fontSize: 10, color: COLOR.textLight,
    fontFace: "Microsoft YaHei", margin: 0
  });
});

// 应用技巧
slide5.addText("✅ 使用技巧", {
  x: 0.5, y: 4.0, w: 9, h: 0.3,
  fontSize: 14, bold: true, color: COLOR.primary,
  fontFace: "Microsoft YaHei", margin: 0
});

const carTips = [
  "用于面试回答：准备3-5个CAR故事",
  "用于工作汇报：突出你的行动和成果",
  "用于项目复盘：客观分析成功与失败"
];

carTips.forEach((tip, idx) => {
  slide5.addText(`• ${tip}`, {
    x: 0.7, y: 4.4 + idx * 0.25, w: 8.6, h: 0.2,
    fontSize: 11, color: COLOR.text,
    fontFace: "Microsoft YaHei", margin: 0
  });
});

// ========== 第6页：黄金三点法 ==========
let slide6 = pres.addSlide();
slide6.background = { color: COLOR.bgLight };
addTitleBar(slide6, "04  黄金三点法", "结构化表达的核心技巧");

// 核心概念
slide6.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 1.0, w: 9, h: 0.6,
  fill: { color: COLOR.primary, transparency: 10 },
  line: { color: COLOR.primary, width: 1 }
});

slide6.addText("💡 核心原理：人脑短期记忆最多记住3-5个点，三点结构最易理解和记忆", {
  x: 0.7, y: 1.1, w: 8.6, h: 0.4,
  fontSize: 13, bold: true, color: COLOR.primary,
  fontFace: "Microsoft YaHei", margin: 0
});

// 三个点
const threePoints = [
  { 
    point: "第一点", 
    content: "提出核心观点或论据", 
    method: "是什么（What）",
    color: "3B82F6"
  },
  { 
    point: "第二点", 
    content: "展开说明或举例", 
    method: "为什么（Why）",
    color: "F59E0B"
  },
  { 
    point: "第三点", 
    content: "总结或行动建议", 
    method: "怎么做（How）",
    color: "10B981"
  }
];

threePoints.forEach((item, idx) => {
  const y = 2.0 + idx * 1.1;
  
  // 大圆圈
  slide6.addShape(pres.shapes.OVAL, {
    x: 0.8, y: y, w: 0.8, h: 0.8,
    fill: { color: item.color },
    line: { type: "none" }
  });
  
  slide6.addText(item.point, {
    x: 0.8, y: y, w: 0.8, h: 0.8,
    fontSize: 14, bold: true, color: COLOR.white,
    align: "center", valign: "middle", margin: 0
  });
  
  // 连接线
  slide6.addShape(pres.shapes.LINE, {
    x: 1.7, y: y + 0.4, w: 0.5, h: 0,
    line: { color: item.color, width: 2 }
  });
  
  // 内容卡片
  slide6.addShape(pres.shapes.RECTANGLE, {
    x: 2.3, y: y, w: 7, h: 0.8,
    fill: { color: item.color, transparency: 85 },
    line: { color: item.color, width: 2 }
  });
  
  slide6.addText(item.content, {
    x: 2.5, y: y + 0.1, w: 3, h: 0.3,
    fontSize: 14, bold: true, color: COLOR.text,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  slide6.addText(`（${item.method}）`, {
    x: 2.5, y: y + 0.45, w: 3, h: 0.25,
    fontSize: 11, color: COLOR.textLight,
    fontFace: "Microsoft YaHei", margin: 0
  });
});

// ========== 第7页：结论先行法 ==========
let slide7 = pres.addSlide();
slide7.background = { color: COLOR.bgLight };
addTitleBar(slide7, "05  结论先行法", "金字塔原理的核心原则");

// 核心概念
slide7.addText("金字塔原理：先说结论，再说论据", {
  x: 0.5, y: 1.0, w: 9, h: 0.4,
  fontSize: 18, bold: true, color: COLOR.primary,
  fontFace: "Microsoft YaHei", align: "center", margin: 0
});

// 金字塔图示（用矩形模拟）
const pyramidLevels = [
  { text: "结论/核心观点", width: 6, x: 2, color: COLOR.primary },
  { text: "主要论据1", width: 4.5, x: 2.75, color: COLOR.secondary },
  { text: "论据2", width: 3, x: 3.5, color: "F59E0B" },
  { text: "论据3", width: 3, x: 3.5, color: "10B981" }
];

pyramidLevels.forEach((level, idx) => {
  const y = 1.8 + idx * 0.7;
  
  slide7.addShape(pres.shapes.RECTANGLE, {
    x: level.x, y: y, w: level.width, h: 0.5,
    fill: { color: level.color, transparency: 70 },
    line: { color: level.color, width: 2 }
  });
  
  slide7.addText(level.text, {
    x: level.x, y: y, w: level.width, h: 0.5,
    fontSize: 14, bold: true, color: COLOR.white,
    align: "center", valign: "middle", margin: 0
  });
});

// 应用场景
slide7.addText("📌 应用场景", {
  x: 0.5, y: 4.5, w: 9, h: 0.3,
  fontSize: 14, bold: true, color: COLOR.primary,
  fontFace: "Microsoft YaHei", margin: 0
});

const scenarios = [
  "工作汇报：先说结果，再讲过程",
  "邮件沟通：主题行直接写明结论",
  "会议发言：开头用一句话概括观点"
];

scenarios.forEach((scenario, idx) => {
  slide7.addText(`• ${scenario}`, {
    x: 0.7, y: 4.85 + idx * 0.2, w: 8.6, h: 0.18,
    fontSize: 11, color: COLOR.text,
    fontFace: "Microsoft YaHei", margin: 0
  });
});

// ========== 第8页：剥洋葱法 ==========
let slide8 = pres.addSlide();
slide8.background = { color: COLOR.bgLight };
addTitleBar(slide8, "06  剥洋葱法", "层层递进深度分析法");

// 核心概念
slide8.addText("从表面现象深入到根本原因，像剥洋葱一样一层层分析", {
  x: 0.5, y: 1.0, w: 9, h: 0.3,
  fontSize: 14, bold: true, color: COLOR.primary,
  fontFace: "Microsoft YaHei", align: "center", margin: 0
});

// 洋葱层次（用圆形模拟）
const onionLayers = [
  { layer: "第1层", name: "表面现象", desc: "看到的问题表象", color: "FEE2E2" },
  { layer: "第2层", name: "直接原因", desc: "导致现象的直接因素", color: "FED7AA" },
  { layer: "第3层", name: "根本原因", desc: "问题的根源所在", color: "FCA5D4" },
  { layer: "第4层", name: "系统因素", desc: "制度、文化、结构问题", color: "C4B5FD" }
];

onionLayers.forEach((layer, idx) => {
  const y = 1.8 + idx * 0.9;
  const circleSize = 1.8 - idx * 0.3;
  const x = 5 - circleSize / 2;
  
  // 洋葱层（圆形）
  slide8.addShape(pres.shapes.OVAL, {
    x: x, y: y, w: circleSize, h: circleSize,
    fill: { color: layer.color.replace("#", "") },
    line: { color: COLOR.secondary, width: 2 }
  });
  
  // 层名
  slide8.addText(layer.layer, {
    x: x + 0.1, y: y + 0.2, w: circleSize - 0.2, h: 0.3,
    fontSize: 12, bold: true, color: COLOR.text,
    align: "center", fontFace: "Microsoft YaHei", margin: 0
  });
  
  // 说明（右侧）
  slide8.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: y + 0.3, w: 3.5, h: 0.5,
    fill: { color: layer.color.replace("#", ""), transparency: 70 },
    line: { color: COLOR.secondary, width: 1 }
  });
  
  slide8.addText(layer.name, {
    x: 0.7, y: y + 0.35, w: 1.5, h: 0.2,
    fontSize: 12, bold: true, color: COLOR.text,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  slide8.addText(layer.desc, {
    x: 0.7, y: y + 0.55, w: 3.1, h: 0.2,
    fontSize: 10, color: COLOR.textLight,
    fontFace: "Microsoft YaHei", margin: 0
  });
});

// ========== 第9页：利益分析法 ==========
let slide9 = pres.addSlide();
slide9.background = { color: COLOR.bgLight };
addTitleBar(slide9, "07  利益分析法", "Stakeholder Benefit Analysis");

// 核心概念
slide9.addText("识别所有利益相关者，分析他们的诉求和影响力", {
  x: 0.5, y: 1.0, w: 9, h: 0.3,
  fontSize: 14, bold: true, color: COLOR.primary,
  fontFace: "Microsoft YaHei", align: "center", margin: 0
});

// 利益相关者矩阵
const stakeholders = [
  { name: "高层领导", power: "高", interest: "高", strategy: "重点管理", color: COLOR.error },
  { name: "直接用户", power: "中", interest: "高", strategy: "保持满意", color: COLOR.warning },
  { name: "项目团队", power: "中", interest: "高", strategy: "保持告知", color: COLOR.secondary },
  { name: "支持部门", power: "低", interest: "中", strategy: "监督关注", color: COLOR.success },
  { name: "反对者", power: "中", interest: "低", strategy: "争取转化", color: "8B5CF6" }
];

stakeholders.forEach((sh, idx) => {
  const x = 0.5 + (idx % 3) * 3.2;
  const y = 1.8 + Math.floor(idx / 3) * 1.3;
  
  // 卡片
  slide9.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: 2.8, h: 1.0,
    fill: { color: sh.color, transparency: 85 },
    line: { color: sh.color, width: 2 }
  });
  
  // 名称
  slide9.addText(sh.name, {
    x: x + 0.2, y: y + 0.1, w: 2.4, h: 0.3,
    fontSize: 14, bold: true, color: sh.color,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  // 权力/利益
  slide9.addText(`权力：${sh.power}  |  利益：${sh.interest}`, {
    x: x + 0.2, y: y + 0.45, w: 2.4, h: 0.2,
    fontSize: 10, color: COLOR.text,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  // 策略
  slide9.addText(`📍 ${sh.strategy}`, {
    x: x + 0.2, y: y + 0.7, w: 2.4, h: 0.2,
    fontSize: 10, bold: true, color: COLOR.text,
    fontFace: "Microsoft YaHei", margin: 0
  });
});

// ========== 第10页：331法则 ==========
let slide10 = pres.addSlide();
slide10.background = { color: COLOR.bgLight };
addTitleBar(slide10, "08  331法则", "高效沟通与决策法则");

// 331法则解释
slide10.addText("3分钟讲清楚，3个要点，1个行动", {
  x: 0.5, y: 1.0, w: 9, h: 0.4,
  fontSize: 18, bold: true, color: COLOR.primary,
  fontFace: "Microsoft YaHei", align: "center", margin: 0
});

// 三个3
const threeOne = [
  { 
    num: "3", name: "3分钟原则", 
    desc: "任何汇报/沟通控制在3分钟内", 
    tips: "超时=不尊重对方时间",
    color: "3B82F6"
  },
  { 
    num: "3", name: "3个要点", 
    desc: "一次只说3个核心要点", 
    tips: "超过3个=对方记不住",
    color: "F59E0B"
  },
  { 
    num: "1", name: "1个行动", 
    desc: "每次沟通明确1个行动项", 
    tips: "无行动=沟通无效",
    color: "10B981"
  }
];

threeOne.forEach((item, idx) => {
  const y = 1.8 + idx * 1.2;
  
  // 大数字
  slide10.addShape(pres.shapes.OVAL, {
    x: 0.8, y: y, w: 0.8, h: 0.8,
    fill: { color: item.color },
    line: { type: "none" }
  });
  
  slide10.addText(item.num, {
    x: 0.8, y: y, w: 0.8, h: 0.8,
    fontSize: 36, bold: true, color: COLOR.white,
    align: "center", valign: "middle", 
    fontFace: "Arial Black", margin: 0
  });
  
  // 名称
  slide10.addText(item.name, {
    x: 1.8, y: y + 0.05, w: 3, h: 0.3,
    fontSize: 16, bold: true, color: item.color,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  // 说明
  slide10.addText(item.desc, {
    x: 1.8, y: y + 0.4, w: 3.5, h: 0.2,
    fontSize: 12, color: COLOR.text,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  // 提示
  slide10.addText(`💡 ${item.tips}`, {
    x: 1.8, y: y + 0.65, w: 3.5, h: 0.2,
    fontSize: 10, color: COLOR.textLight,
    fontFace: "Microsoft YaHei", margin: 0
  });
});

// ========== 第11页：旁观者视角三步法 ==========
let slide11 = pres.addSlide();
slide11.background = { color: COLOR.bgLight };
addTitleBar(slide11, "09  旁观者视角三步法", "第三方客观分析法");

// 核心概念
slide11.addText("跳出当局者迷，用旁观者视角客观分析问题", {
  x: 0.5, y: 1.0, w: 9, h: 0.3,
  fontSize: 14, bold: true, color: COLOR.primary,
  fontFace: "Microsoft YaHei", align: "center", margin: 0
});

// 三步法
const bystander = [
  { 
    step: "第一步", name: "抽离", 
    desc: "想象自己是完全无关的第三方", 
    method: "问：如果这是别人的问题，我会怎么看？",
    color: "3B82F6"
  },
  { 
    step: "第二步", name: "观察", 
    desc: "客观记录事实和各方行为", 
    method: "问：事实是什么？情绪是什么？",
    color: "F59E0B"
  },
  { 
    step: "第三步", name: "建议", 
    desc: "给出中立的建设性建议", 
    method: "问：作为旁观者，我会建议怎么做？",
    color: "10B981"
  }
];

bystander.forEach((item, idx) => {
  const y = 1.8 + idx * 1.2;
  
  // 步骤编号
  slide11.addShape(pres.shapes.OVAL, {
    x: 0.8, y: y + 0.1, w: 0.6, h: 0.6,
    fill: { color: item.color },
    line: { type: "none" }
  });
  
  slide11.addText((idx + 1).toString(), {
    x: 0.8, y: y + 0.1, w: 0.6, h: 0.6,
    fontSize: 24, bold: true, color: COLOR.white,
    align: "center", valign: "middle", margin: 0
  });
  
  // 卡片
  slide11.addShape(pres.shapes.RECTANGLE, {
    x: 1.6, y: y, w: 7.9, h: 1.0,
    fill: { color: item.color, transparency: 85 },
    line: { color: item.color, width: 2 }
  });
  
  // 步骤名
  slide11.addText(`${item.step}：${item.name}`, {
    x: 1.8, y: y + 0.1, w: 7.5, h: 0.3,
    fontSize: 14, bold: true, color: item.color,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  // 说明
  slide11.addText(item.desc, {
    x: 1.8, y: y + 0.45, w: 7.5, h: 0.2,
    fontSize: 12, color: COLOR.text,
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  // 方法
  slide11.addText(`💡 ${item.method}`, {
    x: 1.8, y: y + 0.7, w: 7.5, h: 0.2,
    fontSize: 10, color: COLOR.textLight,
    fontFace: "Microsoft YaHei", margin: 0
  });
});

// ========== 第12页：5年倒推法 ==========
let slide12 = pres.addSlide();
slide12.background = { color: COLOR.bgLight };
addTitleBar(slide12, "10  5年倒推法", "长期规划与逆向思维法");

// 核心概念
slide12.addText("从5年后的终极目标倒推，制定长期规划", {
  x: 0.5, y: 1.0, w: 9, h: 0.3,
  fontSize: 14, bold: true, color: COLOR.primary,
  fontFace: "Microsoft YaHei", align: "center", margin: 0
});

// 时间轴（倒序）
const years = [
  { year: "5年后", goal: "终极目标/愿景", color: COLOR.primary },
  { year: "3年后", goal: "关键里程碑", color: COLOR.secondary },
  { year: "1年后", goal: "中期目标", color: "F59E0B" },
  { year: "3个月后", goal: "短期目标", color: "10B981" },
  { year: "今天", goal: "立即行动", color: COLOR.error }
];

years.forEach((item, idx) => {
  const y = 1.8 + idx * 0.6;
  
  // 时间节点
  slide12.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: y, w: 1.5, h: 0.4,
    fill: { color: item.color },
    line: { type: "none" }
  });
  
  slide12.addText(item.year, {
    x: 0.5, y: y, w: 1.5, h: 0.4,
    fontSize: 12, bold: true, color: COLOR.white,
    align: "center", valign: "middle", 
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  // 目标
  slide12.addShape(pres.shapes.RECTANGLE, {
    x: 2.2, y: y, w: 7.3, h: 0.4,
    fill: { color: item.color, transparency: 85 },
    line: { color: item.color, width: 1 }
  });
  
  slide12.addText(item.goal, {
    x: 2.4, y: y, w: 7.1, h: 0.4,
    fontSize: 12, color: COLOR.text,
    align: "center", valign: "middle",
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  // 箭头（除了最后一个）
  if (idx < years.length - 1) {
    slide12.addShape(pres.shapes.LINE, {
      x: 1.25, y: y + 0.4, w: 0, h: 0.2,
      line: { color: item.color, width: 2 }
    });
  }
});

// ========== 第13页：综合实战演练 ==========
let slide13 = pres.addSlide();
slide13.background = { color: COLOR.bgLight };
addTitleBar(slide13, "11  综合实战演练", "工具组合应用");

// 场景
slide13.addText("场景：向领导汇报一个项目延期问题", {
  x: 0.5, y: 1.0, w: 9, h: 0.4,
  fontSize: 16, bold: true, color: COLOR.primary,
  fontFace: "Microsoft YaHei", align: "center", margin: 0
});

// 工具组合应用
const integrated = [
  { 
    tool: "结论先行法", 
    application: "开头直接说：项目将延期2周",
    color: COLOR.primary
  },
  { 
    tool: "SCQA法", 
    application: "S：项目原计划本月上线 → C：关键人员离职 → Q：如何补救？→ A：申请外包支持",
    color: COLOR.secondary
  },
  { 
    tool: "DESC法", 
    application: "D：当前进度落后20% → E：我担心无法按时交付 → S：建议增加2名开发人员 → C：可按时完成",
    color: "F59E0B"
  },
  { 
    tool: "黄金三点法", 
    application: "1. 问题原因  2. 补救方案  3. 需要的支持",
    color: "10B981"
  },
  { 
    tool: "331法则", 
    application: "3分钟内讲完，3个要点，1个行动：批准外包预算",
    color: "8B5CF6"
  }
];

integrated.forEach((item, idx) => {
  const y = 1.8 + idx * 0.7;
  
  // 工具名
  slide13.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: y, w: 2, h: 0.5,
    fill: { color: item.color },
    line: { type: "none" }
  });
  
  slide13.addText(item.tool, {
    x: 0.5, y: y, w: 2, h: 0.5,
    fontSize: 11, bold: true, color: COLOR.white,
    align: "center", valign: "middle",
    fontFace: "Microsoft YaHei", margin: 0
  });
  
  // 应用
  slide13.addShape(pres.shapes.RECTANGLE, {
    x: 2.6, y: y, w: 7, h: 0.5,
    fill: { color: item.color, transparency: 85 },
    line: { color: item.color, width: 1 }
  });
  
  slide13.addText(item.application, {
    x: 2.8, y: y + 0.05, w: 6.6, h: 0.4,
    fontSize: 10, color: COLOR.text,
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

slide14.addText("掌握11个思维工具", {
  x: 0.5, y: 1.5, w: 9, h: 0.6,
  fontSize: 36, bold: true, color: COLOR.white,
  fontFace: "Microsoft YaHei", align: "center", margin: 0
});

slide14.addText("让思考更系统，表达更清晰，决策更精准", {
  x: 0.5, y: 2.3, w: 9, h: 0.5,
  fontSize: 20, color: COLOR.light,
  fontFace: "Microsoft YaHei", align: "center", margin: 0
});

slide14.addText("Thank You", {
  x: 0.5, y: 3.5, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLOR.white,
  fontFace: "Microsoft YaHei", align: "center", margin: 0
});

slide14.addText("MIM行业质量管理体系 · 思维工具培训", {
  x: 0.5, y: 4.5, w: 9, h: 0.3,
  fontSize: 14, color: COLOR.light,
  fontFace: "Microsoft YaHei", align: "center", margin: 0
});

// 保存文件
pres.writeFile({ fileName: "11个高效思维工具培训教材.pptx" });
console.log("✅ PPT生成成功：11个高效思维工具培训教材.pptx");
console.log("📊 共14页，包含11个思维工具的详细讲解");
