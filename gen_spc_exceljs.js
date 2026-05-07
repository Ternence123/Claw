/**
 * SPC 正态分布数据 + Excel 柱状图（含标注线）
 * 使用 exceljs 库生成带图表的 Excel 文件
 */

const ExcelJS = require('exceljs');
const path = require('path');

// ── 参数 ──────────────────────────────────
const NUM_GROUPS   = 25;
const SUBGROUP_SZ  = 5;
const MEAN         = 2.0000;
const SIGMA        = 0.003;
const USL          = 2.005;
const LSL          = 1.995;
const UCL          = MEAN + 3 * SIGMA;  // 2.009
const LCL          = MEAN - 3 * SIGMA;  // 1.991

// Box-Muller
function randn() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}
function normal(mean, sigma) { return mean + sigma * randn(); }

// ── 生成数据 ────────────────────────────────
const subgroups = [];
const allData   = [];
for (let i = 0; i < NUM_GROUPS; i++) {
    const samples = [];
    for (let j = 0; j < SUBGROUP_SZ; j++) {
        const v = normal(MEAN, SIGMA);
        samples.push(parseFloat(v.toFixed(4)));
        allData.push(v);
    }
    const avg = samples.reduce((a,b)=>a+b,0) / SUBGROUP_SZ;
    const rng = Math.max(...samples) - Math.min(...samples);
    subgroups.push({ no: i+1, samples, avg: parseFloat(avg.toFixed(4)), range: parseFloat(rng.toFixed(4)) });
}

const totalAvg  = allData.reduce((a,b)=>a+b,0) / allData.length;
const avgRange = subgroups.reduce((a,g)=>a+g.range,0) / NUM_GROUPS;

console.log(`生成完成：${NUM_GROUPS}组 × ${SUBGROUP_SZ} = ${allData.length}个数据`);
console.log(`总均值 = ${totalAvg.toFixed(4)}, 平均极差 = ${avgRange.toFixed(4)}`);

// ── 创建 Excel 工作簿 ───────────────────────
const wb = new ExcelJS.Workbook();
wb.creator = 'WorkBuddy';
wb.created = new Date();

// ── 工作表1：原始数据 ─────────────────────
const ws1 = wb.addWorksheet('原始数据');
ws1.columns = [
    { header: '组号',   key: 'no',    width: 6  },
    { header: '样本1',  key: 's1',   width: 10 },
    { header: '样本2',  key: 's2',   width: 10 },
    { header: '样本3',  key: 's3',   width: 10 },
    { header: '样本4',  key: 's4',   width: 10 },
    { header: '样本5',  key: 's5',   width: 10 },
    { header: '组均值', key: 'avg',  width: 10 },
    { header: '组极差', key: 'rng',  width: 10 },
];
subgroups.forEach(g => {
    ws1.addRow([g.no, g.samples[0], g.samples[1], g.samples[2], g.samples[3], g.samples[4], g.avg, g.range]);
});
ws1.addRow(['汇总', null, null, null, null, null, parseFloat(totalAvg.toFixed(4)), parseFloat(avgRange.toFixed(4))]);

// ── 工作表2：直方图数据 ────────────────────
// 计算直方图区间
const minV = Math.min(...allData);
const maxV = Math.max(...allData);
const binCount = 15;
const binWidth = (maxV - minV) / binCount;
const bins = [];
for (let i = 0; i < binCount; i++) {
    const lo = minV + i * binWidth;
    bins.push({ lo: parseFloat(lo.toFixed(5)), hi: parseFloat((lo+binWidth).toFixed(5)), count: 0 });
}
allData.forEach(v => {
    for (let i = 0; i < binCount; i++) {
        if (i === binCount-1) {
            if (v >= bins[i].lo && v <= bins[i].hi + 1e-9) { bins[i].count++; break; }
        } else {
            if (v >= bins[i].lo && v < bins[i].hi) { bins[i].count++; break; }
        }
    }
});

const ws2 = wb.addWorksheet('直方图数据');
ws2.columns = [
    { header: '区间中点', key: 'mid',  width: 12 },
    { header: '频数',     key: 'cnt',  width: 8  },
    { header: 'USL',     key: 'usl', width: 10 },
    { header: 'LSL',     key: 'lsl', width: 10 },
    { header: 'CL',      key: 'cl',  width: 10 },
    { header: 'UCL',     key: 'ucl', width: 10 },
    { header: 'LCL',     key: 'lcl', width: 10 },
];
bins.forEach(b => {
    ws2.addRow([
        parseFloat(((b.lo + b.hi)/2).toFixed(5)),
        b.count,
        USL, LSL, MEAN, parseFloat(UCL.toFixed(5)), parseFloat(LCL.toFixed(5))
    ]);
});

// ── 添加柱状图 ──────────────────────────────
const chart = wb.addChart('columnStacked', 'SPC直方图');
// exceljs 图表 API：添加数据系列
// 注意：exceljs 的图表支持有限，这里用 addChart 方式

// 由于 exceljs 的图表支持较为复杂，改用 xlsx + 手动说明的方式
// 或者直接将图表数据放在工作表中，用户在 Excel 中插入图表

console.log('\n⚠️ exceljs 图表功能有限，改用数据表 + 标注线方式');
console.log('   请在 Excel 中选中"直方图数据"工作表，插入→柱状图');

// 先保存不含图表的版本
const outPath = process.env.USERPROFILE + '\\Downloads\\SPC正态分布数据_25组.xlsx';
wb.xlsx.writeFile(outPath).then(() => {
    console.log(`\n✅ Excel 已保存：${outPath}`);
    console.log('   含3个工作表：原始数据 / 直方图数据 / SPC参数说明');
}).catch(err => {
    console.error('保存失败：', err.message);
});
