"""
SPC 正态分布数据 + Excel 柱状图（含 USL/LSL/CL/UCL/LCL 标注线）
使用 xlsxwriter 库（图表功能最强）
"""

import xlsxwriter
import math, random, os

# ── 参数 ─────────────────────────────────────
NUM_GROUPS   = 25
SUBGROUP_SZ = 5
MEAN        = 2.0000
SIGMA       = 0.003
USL         = 2.005
LSL         = 1.995
UCL         = MEAN + 3 * SIGMA   # 2.009
LCL         = MEAN - 3 * SIGMA   # 1.991

# ── Box-Muller 正态分布 ───────────────────────
def randn():
    u = random.random()
    v = random.random()
    while u == 0: u = random.random()
    while v == 0: v = random.random()
    return math.sqrt(-2.0 * math.log(u)) * math.cos(2.0 * math.pi * v)

def normal(mean, sigma):
    return mean + sigma * randn()

# ── 生成数据 ──────────────────────────────────
subgroups = []
all_data   = []
for i in range(NUM_GROUPS):
    samples = [round(normal(MEAN, SIGMA), 4) for _ in range(SUBGROUP_SZ)]
    all_data.extend(samples)
    avg_val  = round(sum(samples) / len(samples), 4)
    rng_val  = round(max(samples) - min(samples), 4)
    subgroups.append((i+1, samples, avg_val, rng_val))

total_avg  = round(sum(all_data) / len(all_data), 4)
avg_range = round(sum(r[3] for r in subgroups) / NUM_GROUPS, 4)

print(f"生成完成：{NUM_GROUPS} 组 × {SUBGROUP_SZ} = {len(all_data)} 个数据")
print(f"总均值 = {total_avg}, 平均极差 = {avg_range}")
print(f"UCL={UCL:.4f}, CL={MEAN}, LCL={LCL:.4f}")
print(f"USL={USL}, LSL={LSL}")

# ── 创建 Excel 文件 ──────────────────────────
out_path = r"C:\Users\Administrator\Downloads\SPC正态分布数据_25组.xlsx"
wb = xlsxwriter.Workbook(out_path)

# ── 格式定义 ────────────────────────────────
fmt_header    = wb.add_format({'bold': True, 'bg_color': '#0EA5E9', 'font_color': 'white', 'align': 'center', 'valign': 'vcenter', 'border': 1})
fmt_number    = wb.add_format({'num_format': '0.0000', 'align': 'center'})
fmt_center    = wb.add_format({'align': 'center'})
fmt_usl       = wb.add_format({'font_color': '#EF4444', 'bold': True})   # 红色
fmt_lsl       = wb.add_format({'font_color': '#EF4444', 'bold': True})
fmt_ucl       = wb.add_format({'font_color': '#F59E0B', 'bold': True})   # 黄色/橙色
fmt_lcl       = wb.add_format({'font_color': '#F59E0B', 'bold': True})
fmt_cl        = wb.add_format({'font_color': '#10B981', 'bold': True})    # 绿色

# ── 工作表1：原始数据 ───────────────────────
ws1 = wb.add_worksheet('原始数据')
headers = ['组号', '样本1', '样本2', '样本3', '样本4', '样本5', '组均值', '组极差']
for col, h in enumerate(headers):
    ws1.write(0, col, h, fmt_header)
for row_idx, (no, samples, avg_val, rng_val) in enumerate(subgroups, 1):
    ws1.write(row_idx, 0, no, fmt_center)
    for j, v in enumerate(samples):
        ws1.write(row_idx, 1+j, v, fmt_number)
    ws1.write(row_idx, 6, avg_val, fmt_number)
    ws1.write(row_idx, 7, rng_val, fmt_number)
# 汇总行
ws1.write(NUM_GROUPS+1, 0, '汇总', fmt_center)
ws1.write(NUM_GROUPS+1, 6, total_avg, fmt_number)
ws1.write(NUM_GROUPS+1, 7, avg_range, fmt_number)
ws1.set_column(0, 0, 6)
ws1.set_column(1, 7, 10)

# ── 工作表2：直方图数据 + 图表 ─────────────
ws2 = wb.add_worksheet('SPC直方图')

# 计算直方图区间（20个区间）
min_v = min(all_data)
max_v = max(all_data)
bin_count = 20
bin_width = (max_v - min_v) / bin_count
bins = []
for i in range(bin_count):
    lo = min_v + i * bin_width
    hi = lo + bin_width
    bins.append([round(lo, 5), round(hi, 5), 0])  # lo, hi, count

for v in all_data:
    for i, b in enumerate(bins):
        if i == bin_count - 1:
            if b[0] <= v <= b[1] + 1e-9:
                b[2] += 1
                break
        else:
            if b[0] <= v < b[1]:
                b[2] += 1
                break

# 写入直方图数据（含标注线列）
ws2.write(0, 0, '区间中点', fmt_header)
ws2.write(0, 1, '频数',     fmt_header)
ws2.write(0, 2, 'USL标注',   fmt_header)
ws2.write(0, 3, 'LSL标注',   fmt_header)
ws2.write(0, 4, 'CL标注',    fmt_header)
ws2.write(0, 5, 'UCL标注',   fmt_header)
ws2.write(0, 6, 'LCL标注',   fmt_header)

for i, b in enumerate(bins):
    mid = round((b[0] + b[1]) / 2, 5)
    row = i + 1
    ws2.write(row, 0, mid, fmt_number)
    ws2.write(row, 1, b[2], fmt_center)
    # 标注线：每行的标注列都填入对应值（用于画直线）
    ws2.write(row, 2, USL)
    ws2.write(row, 3, LSL)
    ws2.write(row, 4, MEAN)
    ws2.write(row, 5, round(UCL, 5))
    ws2.write(row, 6, round(LCL, 5))

ws2.set_column(0, 0, 12)
ws2.set_column(1, 1, 8)
ws2.set_column(2, 6, 10)

# ── 创建柱状图 + 标注线 ────────────────────
# 主图：柱状图（频数）
chart = wb.add_chart({'type': 'column'})
chart.add_series({
    'name':       '频数',
    'categories': ['SPC直方图', 1, 0, bin_count, 0],   # 区间中点
    'values':     ['SPC直方图', 1, 1, bin_count, 1],   # 频数
    'fill':       {'color': '#0EA5E9'},
})
chart.set_title({'name': 'SPC 正态分布直方图（25组数据）'})
chart.set_x_axis({'name': '尺寸区间（mm）', 'num_format': '0.0000'})
chart.set_y_axis({'name': '频数（出现次数）'})

# 添加标注线：用折线图叠加（combo chart）
# USL 线（红色）
chart.add_series({
    'name':       'USL(规格上限)',
    'categories': ['SPC直方图', 1, 0, bin_count, 0],
    'values':     ['SPC直方图', 1, 2, bin_count, 2],
    'type':       'line',
    'line':       {'color': '#EF4444', 'width': 2, 'dash_type': 'solid'},
    'marker':     {'type': 'none'},
    'smooth':     False,
})
# LSL 线（红色虚线）
chart.add_series({
    'name':       'LSL(规格下限)',
    'categories': ['SPC直方图', 1, 0, bin_count, 0],
    'values':     ['SPC直方图', 1, 3, bin_count, 3],
    'type':       'line',
    'line':       {'color': '#EF4444', 'width': 2, 'dash_type': 'dash'},
    'marker':     {'type': 'none'},
})
# CL 线（绿色）
chart.add_series({
    'name':       'CL(中心线)',
    'categories': ['SPC直方图', 1, 0, bin_count, 0],
    'values':     ['SPC直方图', 1, 4, bin_count, 4],
    'type':       'line',
    'line':       {'color': '#10B981', 'width': 2},
    'marker':     {'type': 'none'},
})
# UCL 线（橙色）
chart.add_series({
    'name':       'UCL(上控制限)',
    'categories': ['SPC直方图', 1, 0, bin_count, 0],
    'values':     ['SPC直方图', 1, 5, bin_count, 5],
    'type':       'line',
    'line':       {'color': '#F59E0B', 'width': 2, 'dash_type': 'dash'},
    'marker':     {'type': 'none'},
})
# LCL 线（橙色虚线）
chart.add_series({
    'name':       'LCL(下控制限)',
    'categories': ['SPC直方图', 1, 0, bin_count, 0],
    'values':     ['SPC直方图', 1, 6, bin_count, 6],
    'type':       'line',
    'line':       {'color': '#F59E0B', 'width': 2, 'dash_type': 'long_dash'},
    'marker':     {'type': 'none'},
})

chart.set_size({'width': 900, 'height': 500})
chart.set_legend({'position': 'bottom'})

# 插入图表
ws2.insert_chart('J2', chart)
print("✅ 柱状图 + 标注线已添加到「SPC直方图」工作表")

# ── 工作表3：SPC 参数说明 ─────────────────
ws3 = wb.add_worksheet('SPC参数说明')
ws3.write(0, 0, 'SPC 关键参数', fmt_header)
ws3.write(0, 1, '数值',         fmt_header)
ws3.write(0, 2, '计算公式',     fmt_header)
ws3.write(0, 3, '说明',         fmt_header)

params = [
    ['过程均值 CL',  MEAN,     '—',        '目标值 / 总均值'],
    ['标准差 σ',    SIGMA,    '—',        '过程固有变异'],
    ['UCL(上控制限)', round(UCL, 5), 'CL + 3σ', '超出说明过程异常'],
    ['LCL(下控制限)', round(LCL, 5), 'CL - 3σ', '超出说明过程异常'],
    ['USL(规格上限)', USL,      '—',        '客户允许的最大值'],
    ['LSL(规格下限)', LSL,      '—',        '客户允许的最小值'],
]
for i, row in enumerate(params, 1):
    ws3.write(i, 0, row[0])
    ws3.write(i, 1, row[1], fmt_number)
    ws3.write(i, 2, row[2])
    ws3.write(i, 3, row[3])

ws3.write(8, 0, '判断规则', fmt_header)
ws3.write(8, 1, '说明',     fmt_header)
rules = [
    ['控制限 vs 规格限', '控制限是过程能力，规格限是客户要求，两者不同！'],
    ['超出控制限',       '说明过程异常，需查因'],
    ['超出规格限',       '说明产品不合格，需处置'],
]
for i, row in enumerate(rules, 9):
    ws3.write(i, 0, row[0])
    ws3.write(i, 1, row[1])

ws3.set_column(0, 0, 20)
ws3.set_column(1, 1, 18)
ws3.set_column(2, 2, 18)
ws3.set_column(3, 3, 35)

# ── 保存文件 ──────────────────────────────────
wb.close()
print(f"\n✅ Excel 已保存：{out_path}")
print(f"   含 3 个工作表：原始数据 / SPC直方图 / SPC参数说明")
print(f"   图表中已标注：USL(红实线) / LSL(红虚线) / CL(绿实线) / UCL(橙虚线) / LCL(橙长虚线)")
