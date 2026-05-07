/**
 * SPC 正态分布数据生成 + Excel 输出
 * - 生成 25 组（每组 5 个样本，共 125 个数据）
 * - 均值 CL = 2.0000，标准差 σ = 0.003
 * - 输出：数据表 + 直方图（带 USL/LSL/CL/UCL/LCL 标注）
 */

const XLSX = require('xlsx');
const fs = require('fs');

// ── 参数 ──────────────────────────────────────
const NUM_GROUPS  = 25;       // 25 组
const SUBGROUP_SIZE = 5;        // 每组 5 个样本
const MEAN        = 2.0000;    // 过程均值
const SIGMA       = 0.003;     // 过程标准差
const USL         = 2.005;     // 规格上限
const LSL         = 1.995;     // 规格下限
// 控制限（±3σ）
const UCL         = MEAN + 3 * SIGMA;  // 2.009
const LCL         = MEAN - 3 * SIGMA;  // 1.991

// ── Box-Muller 正态分布随机数 ─────────────────
function randn_bm() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function normal(mean, sigma) {
    return mean + sigma * randn_bm();
}

// ── 生成数据 ──────────────────────────────────
const subgroups = [];
const allData   = [];

for (let i = 0; i < NUM_GROUPS; i++) {
    const group = [];
    let sum = 0;
    for (let j = 0; j < SUBGROUP_SIZE; j++) {
        const val = normal(MEAN, SIGMA);
        group.push(parseFloat(val.toFixed(4)));
        allData.push(val);
        sum += val;
    }
    const avg = sum / SUBGROUP_SIZE;
    const range = Math.max(...group) - Math.min(...group);
    subgroups.push({
        groupNo: i + 1,
        samples: group,
        avg: parseFloat(avg.toFixed(4)),
        range: parseFloat(range.toFixed(4)),
    });
}

// 计算总均值和平均极差
const totalAvg = allData.reduce((a, b) => a + b, 0) / allData.length;
const avgRange = subgroups.reduce((a, g) => a + g.range, 0) / NUM_GROUPS;

console.log(`生成完成：${NUM_GROUPS} 组 × ${SUBGROUP_SIZE} = ${allData.length} 个数据`);
console.log(`总均值 X̄ = ${totalAvg.toFixed(4)}`);
console.log(`平均极差 R̄ = ${avgRange.toFixed(4)}`);
console.log(`UCL = ${UCL.toFixed(4)}, CL = ${MEAN}, LCL = ${LCL.toFixed(4)}`);
console.log(`USL = ${USL}, LSL = ${LSL}`);

// ── 构建 Excel 工作簿 ─────────────────────────
const wb = XLSX.utils.book_new();

// ── 工作表1：原始数据 ────────────────────────
const dataRows = [];
dataRows.push(['组号', '样本1', '样本2', '样本3', '样本4', '样本5', '组均值', '组极差']);
subgroups.forEach(g => {
    dataRows.push([
        g.groupNo,
        g.samples[0], g.samples[1], g.samples[2], g.samples[3], g.samples[4],
        g.avg, g.range
    ]);
});
// 汇总行
dataRows.push(['汇总', null, null, null, null, null, 
    parseFloat(totalAvg.toFixed(4)),
    parseFloat(avgRange.toFixed(4))
]);

const ws1 = XLSX.utils.aoa_to_sheet(dataRows);

// 设置列宽
ws1['!cols'] = [
    { wch: 6 },  // 组号
    { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
    { wch: 10 }, // 组均值
    { wch: 10 }, // 组极差
];

XLSX.utils.book_append_sheet(wb, ws1, '原始数据');

// ── 工作表2：直方图数据 + 标注线 ─────────────
// 将所有数据展开，计算直方图区间
const min = Math.min(...allData);
const max = Math.max(...allData);
const binCount = 15;
const binWidth = (max - min) / binCount;

const bins = [];
for (let i = 0; i < binCount; i++) {
    const lower = min + i * binWidth;
    const upper = lower + binWidth;
    bins.push({ lower, upper, count: 0 });
}
// 最后一个区间包含上限
allData.forEach(v => {
    for (let i = 0; i < binCount; i++) {
        if (i === binCount - 1) {
            if (v >= bins[i].lower && v <= bins[i].upper + 1e-9) {
                bins[i].count++;
            }
        } else {
            if (v >= bins[i].lower && v < bins[i].upper) {
                bins[i].count++;
                break;
            }
        }
    }
});

const histRows = [];
histRows.push(['区间下限', '区间上限', '频数', '标注说明']);
bins.forEach(b => {
    const notes = [];
    if (b.lower <= USL && b.upper >= USL) notes.push('USL');
    if (b.lower <= LSL && b.upper >= LSL) notes.push('LSL');
    if (b.lower <= UCL && b.upper >= UCL) notes.push('UCL');
    if (b.lower <= LCL && b.upper >= LCL) notes.push('LCL');
    if (b.lower <= MEAN && b.upper >= MEAN) notes.push('CL');
    histRows.push([
        parseFloat(b.lower.toFixed(5)),
        parseFloat(b.upper.toFixed(5)),
        b.count,
        notes.join(', ')
    ]);
});

// 添加标注线说明区
histRows.push([]);
histRows.push(['标注线', '数值', '说明']);
histRows.push(['USL（规格上限）', USL, '客户要求的尺寸上限']);
histRows.push(['LSL（规格下限）', LSL, '客户要求的尺寸下限']);
histRows.push(['UCL（控制上限）', parseFloat(UCL.toFixed(5)), 'X̄ + 3σ']);
histRows.push(['LCL（控制下限）', parseFloat(LCL.toFixed(5)), 'X̄ - 3σ']);
histRows.push(['CL（中心线）', MEAN, '过程总均值']);

const ws2 = XLSX.utils.aoa_to_sheet(histRows);
ws2['!cols'] = [
    { wch: 12 }, { wch: 12 }, { wch: 8 }, { wch: 20 }
];
XLSX.utils.book_append_sheet(wb, ws2, '直方图数据');

// ── 工作表3：SPC 控制限说明 ───────────────
const noteRows = [];
noteRows.push(['SPC 关键参数', '数值', '计算公式', '说明']);
noteRows.push(['过程均值 CL', MEAN, '—', '目标值 / 总均值']);
noteRows.push(['标准差 σ', SIGMA, '—', '过程固有变异']);
noteRows.push(['UCL（上控制限）', parseFloat(UCL.toFixed(5)), 'CL + 3σ', '超出说明过程异常']);
noteRows.push(['LCL（下控制限）', parseFloat(LCL.toFixed(5)), 'CL - 3σ', '超出说明过程异常']);
noteRows.push(['USL（规格上限）', USL, '—', '客户允许的最大值']);
noteRows.push(['LSL（规格下限）', LSL, '—', '客户允许的最小值']);
noteRows.push([]);
noteRows.push(['判断规则', '', '说明']);
noteRows.push(['控制限 vs 规格限', '', '控制限是过程能力，规格限是客户要求，两者不同！']);
noteRows.push(['超出控制限', '', '说明过程异常，需查因']);
noteRows.push(['超出规格限', '', '说明产品不合格，需处置']);

const ws3 = XLSX.utils.aoa_to_sheet(noteRows);
ws3['!cols'] = [{ wch: 20 }, { wch: 18 }, { wch: 18 }, { wch: 35 }];
XLSX.utils.book_append_sheet(wb, ws3, 'SPC参数说明');

// ── 输出文件 ──────────────────────────────────
const outPath = process.env.USERPROFILE + '\\Downloads\\SPC正态分布数据_25组.xlsx';
XLSX.writeFile(wb, outPath);
console.log(`\n✅ Excel 已保存：${outPath}`);
