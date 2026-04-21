#!/usr/bin/env python3
"""
公共工具模块：供 merge_findings / generate_report / report_upload / checkpoint_verify / verifier 复用

包含：
  - Colors          终端颜色常量
  - 日志工具        log_info / log_ok / log_warn / log_error（带可配置 prefix）
  - 时间工具        _parse_datetime / format_beijing_time / BEIJING_TZ / LOCAL_TZ / TIME_FORMAT
  - Git 工具        get_git_branch / get_git_project_name / get_git_project_root / resolve_project_root
  - JSON 工具       load_json_file / write_json_file(原子) / incremental_write_findings / init_agent_output / stdout_json
  - 风险等级工具     SEVERITY_ORDER / severity_rank / get_risk_level_normalized
  - 配置工具        load_merged_config / _user_config_path / _project_config_path
"""
import json
import os
import subprocess
import sys
import tempfile
from datetime import datetime, timedelta, timezone
from pathlib import Path


# ---------------------------------------------------------------------------
# 终端颜色
# ---------------------------------------------------------------------------

class Colors:
    """终端颜色输出"""
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'


# ---------------------------------------------------------------------------
# 日志工具
# ---------------------------------------------------------------------------

def make_logger(prefix):
    """创建带有指定前缀的日志函数组。

    Returns:
        tuple: (log_info, log_ok, log_warn, log_error)
    """
    def log_info(msg):
        print(f"{Colors.CYAN}[{prefix}] {msg}{Colors.ENDC}", file=sys.stderr)

    def log_ok(msg):
        print(f"{Colors.GREEN}[{prefix}] ✓ {msg}{Colors.ENDC}", file=sys.stderr)

    def log_warn(msg):
        print(f"{Colors.WARNING}[{prefix}] [WARN] {msg}{Colors.ENDC}", file=sys.stderr)

    def log_error(msg):
        print(f"{Colors.FAIL}[{prefix}] ✗ {msg}{Colors.ENDC}", file=sys.stderr)

    return log_info, log_ok, log_warn, log_error


def print_colored(message, color=Colors.ENDC):
    """彩色打印到 stderr"""
    print(f"{color}{message}{Colors.ENDC}", file=sys.stderr)


def stdout_json(data):
    """将 JSON 数据输出到 stdout 供编排器解析"""
    print(json.dumps(data, ensure_ascii=False))


# ---------------------------------------------------------------------------
# 时间工具
# ---------------------------------------------------------------------------

BEIJING_TZ = timezone(timedelta(hours=8))
LOCAL_TZ = datetime.now().astimezone().tzinfo or timezone.utc
TIME_FORMAT = "%Y-%m-%d %H:%M:%S"


def _parse_datetime(value):
    """解析多种格式的日期时间值，返回 aware datetime 或 None"""
    if value is None:
        return None
    if isinstance(value, datetime):
        if value.tzinfo is None:
            return value.replace(tzinfo=LOCAL_TZ)
        return value
    if isinstance(value, (int, float)):
        timestamp = float(value)
        if timestamp > 1e12:
            timestamp /= 1000.0
        return datetime.fromtimestamp(timestamp, tz=timezone.utc)

    text = str(value).strip()
    if not text:
        return None
    if text.isdigit():
        try:
            timestamp = int(text)
            if len(text) >= 13:
                timestamp /= 1000.0
            return datetime.fromtimestamp(timestamp, tz=timezone.utc)
        except (ValueError, OSError):
            return None

    normalized = text.replace("Z", "+00:00")
    try:
        dt = datetime.fromisoformat(normalized)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=LOCAL_TZ)
        return dt
    except ValueError:
        pass

    for fmt in (
        "%Y-%m-%d %H:%M:%S",
        "%Y/%m/%d %H:%M:%S",
        "%Y-%m-%d %H:%M",
        "%Y/%m/%d %H:%M",
        "%Y-%m-%d",
        "%Y/%m/%d",
    ):
        try:
            dt = datetime.strptime(text, fmt)
            return dt.replace(tzinfo=LOCAL_TZ)
        except ValueError:
            continue

    return None


def format_beijing_time(value):
    """格式化为北京时间字符串"""
    dt = _parse_datetime(value)
    if not dt:
        return ""
    return dt.astimezone(BEIJING_TZ).strftime(TIME_FORMAT)


# ---------------------------------------------------------------------------
# Git 工具
# ---------------------------------------------------------------------------

def get_git_branch(base_path=None):
    """获取 Git 分支名"""
    base = Path(base_path) if base_path else Path.cwd()
    try:
        result = subprocess.run(
            ["git", "-C", str(base), "rev-parse", "--abbrev-ref", "HEAD"],
            check=True,
            capture_output=True,
            text=True,
        )
    except (OSError, subprocess.CalledProcessError):
        return ""
    branch = result.stdout.strip()
    if not branch or branch == "HEAD":
        return ""
    return branch


def get_git_project_name(base_path=None):
    """从 git remote URL 或目录名推断项目名称"""
    base = Path(base_path) if base_path else Path.cwd()
    try:
        result = subprocess.run(
            ["git", "-C", str(base), "remote", "get-url", "origin"],
            check=True,
            capture_output=True,
            text=True,
        )
        url = result.stdout.strip()
        if url:
            name = url.rstrip("/").rsplit("/", 1)[-1]
            if ":" in name:
                name = name.rsplit(":", 1)[-1]
            return name.removesuffix(".git") or ""
    except (OSError, subprocess.CalledProcessError):
        pass
    try:
        result = subprocess.run(
            ["git", "-C", str(base), "rev-parse", "--show-toplevel"],
            check=True,
            capture_output=True,
            text=True,
        )
        top = result.stdout.strip()
        if top:
            return Path(top).name
    except (OSError, subprocess.CalledProcessError):
        pass
    return ""


def get_git_project_root(base_path=None):
    """获取 Git 仓库根目录，失败返回空字符串。"""
    base = Path(base_path) if base_path else Path.cwd()
    try:
        result = subprocess.run(
            ["git", "-C", str(base), "rev-parse", "--show-toplevel"],
            check=True,
            capture_output=True,
            text=True,
        )
    except (OSError, subprocess.CalledProcessError):
        return ""

    return result.stdout.strip()


def resolve_project_root(project_root: str = "") -> Path:
    """解析项目根目录。

    优先返回给定路径所在 Git 仓库的 top-level；不在 Git 仓库中时回退到原路径。
    """
    base = Path(project_root) if project_root else Path.cwd()
    git_root = get_git_project_root(base)
    if git_root:
        return Path(git_root)
    return base


# ---------------------------------------------------------------------------
# JSON 工具
# ---------------------------------------------------------------------------

def load_json_file(path):
    """安全加载 JSON 文件，失败返回 None"""
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return None
    except json.JSONDecodeError:
        return None
    except Exception:
        return None


def write_json_file(path, data):
    """原子写入 JSON 文件（temp + rename 模式）。

    使用临时文件写入后原子重命名，确保：
    - 写入过程中崩溃不会损坏已有文件
    - 并发读取者始终看到完整有效的 JSON
    """
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_path = tempfile.mkstemp(
        dir=str(path.parent), suffix='.tmp', prefix='.write_'
    )
    try:
        with os.fdopen(fd, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        os.replace(tmp_path, str(path))  # POSIX 原子操作
    except BaseException:
        # 清理临时文件，避免泄漏
        try:
            os.unlink(tmp_path)
        except OSError:
            pass
        raise


def incremental_write_findings(path, new_findings, agent_name, checkpoint='',
                               status='partial'):
    """增量追加 findings 并原子写入。

    Agent 每完成一个 finding 后调用此函数：
    1. 读取现有输出文件（如存在）
    2. 合并新 findings
    3. 更新元数据（writeCount, lastCheckpoint, _integrity）
    4. 原子写入

    Args:
        path: 输出文件路径（如 agents/vuln-scan.json）
        new_findings: 新增的 finding 列表
        agent_name: Agent 名称
        checkpoint: 当前检查点标识（如 'sink-3' 或 'endpoint-7'）
        status: 当前状态 ('partial' | 'completed')

    Returns:
        更新后的完整数据 dict
    """
    existing = load_json_file(path) or {}
    findings = existing.get('findings', [])
    write_count = existing.get('writeCount', 0)

    # 合并新 findings
    findings.extend(new_findings if isinstance(new_findings, list) else [new_findings])
    write_count += 1

    data = {
        'agent': agent_name,
        'status': status,
        'findings': findings,
        'writeCount': write_count,
        'lastCheckpoint': checkpoint,
        '_integrity': {
            'expectedFindingsCount': len(findings),
            'actualFindingsCount': len(findings),
            'allPhasesCompleted': status == 'completed',
            'lastWriteTimestamp': datetime.now(timezone.utc).isoformat(),
        },
    }
    write_json_file(path, data)
    return data


def init_agent_output(path, agent_name):
    """Agent 启动时初始化输出文件（空 findings）。

    如果文件已存在且 status != 'completed'，返回现有数据供续扫。
    如果不存在，创建初始文件。

    Args:
        path: 输出文件路径
        agent_name: Agent 名称

    Returns:
        tuple: (existing_data_or_None, resume_checkpoint)
            - 如果是续扫：(existing_data, lastCheckpoint)
            - 如果是新扫描：(None, '')
    """
    existing = load_json_file(path)
    if existing and existing.get('status') not in ('completed', None):
        # 续扫：返回现有数据
        return existing, existing.get('lastCheckpoint', '')

    # 新扫描：写入初始文件
    data = {
        'agent': agent_name,
        'status': 'partial',
        'findings': [],
        'writeCount': 1,
        'lastCheckpoint': '',
        '_integrity': {
            'expectedFindingsCount': 0,
            'actualFindingsCount': 0,
            'allPhasesCompleted': False,
            'lastWriteTimestamp': datetime.now(timezone.utc).isoformat(),
        },
    }
    write_json_file(path, data)
    return None, ''


# ---------------------------------------------------------------------------
# 风险等级标准化（4 级制）
# ---------------------------------------------------------------------------

SEVERITY_ORDER = {"critical": 4, "high": 3, "medium": 2, "low": 1}


def severity_rank(level):
    """将风险等级映射为数值（用于排序/比较）"""
    return SEVERITY_ORDER.get(str(level).lower(), 0)


def get_risk_level_normalized(level):
    """标准化风险等级（4 级制：critical / high / medium / low）"""
    level_lower = str(level).lower()
    if level_lower in ('critical', '严重'):
        return 'critical'
    elif level_lower in ('high', '高'):
        return 'high'
    elif level_lower in ('medium', '中', 'moderate', '中等'):
        return 'medium'
    else:
        return 'low'


# ---------------------------------------------------------------------------
# 字段归一化：统一内部流转字段名 (camelCase)
# ---------------------------------------------------------------------------
#
# 设计原则：
#   - Agent 输出字段名存在 PascalCase / camelCase / snake_case / 嵌套对象 等多种变体
#   - 本模块在数据进入 pipeline 的第一个入口做一次性归一化
#   - 归一化后所有下游脚本统一使用 camelCase 内部字段名，无需再做兼容
#   - 最终报告层 (finding-*.json) 使用 PascalCase，由 to_report_format() 转换
#
# 统一字段名映射表（概念 → 内部统一名）：
#   文件路径   → filePath
#   行号       → lineNumber
#   风险类型   → riskType
#   严重级别   → severity      (归一化为 critical/high/medium/low)
#   置信度     → confidence    (整数 0-100)
#   代码片段   → codeSnippet
#   风险详情   → description
#   修复建议   → recommendation
#   修复代码   → fixedCode
#   发现ID     → findingId
#   来源Agent  → sourceAgent
#   攻击链     → attackChain
#   追踪方式   → traceMethod
# ---------------------------------------------------------------------------


def _coalesce(*values):
    """返回第一个非空/非None值"""
    for v in values:
        if v is not None and v != '' and v != 0:
            return v
    return values[-1] if values else None


def normalize_finding(raw, source_agent=''):
    """将 agent 输出的 finding 归一化为统一内部字段名。

    接受任意格式的 finding dict，输出统一 camelCase 字段名的 dict。
    保留所有原始字段（不丢失数据），仅新增/覆盖统一字段名。

    Args:
        raw: agent 输出的原始 finding dict
        source_agent: 来源 agent 名称（如未在 raw 中指定）

    Returns:
        归一化后的 finding dict
    """
    if not isinstance(raw, dict):
        return raw

    f = dict(raw)  # 浅拷贝，保留所有原始字段

    # --- 解析 location 嵌套对象（防御性兼容：Agent 应直接使用扁平字段）---
    loc = f.get('location') if isinstance(f.get('location'), dict) else {}

    # --- 从 evidence[] 数组提取位置信息（防御性兼容）---
    first_ev = {}
    if isinstance(f.get('evidence'), list) and f['evidence']:
        first_ev = f['evidence'][0] if isinstance(f['evidence'][0], dict) else {}

    # ---- filePath ----
    # 规范字段: FilePath（PascalCase）或 filePath（camelCase）
    f['filePath'] = str(_coalesce(
        f.get('filePath'), f.get('FilePath'),
        f.get('file'), f.get('file_path'),
        loc.get('file'), loc.get('filePath'),
        first_ev.get('file'), first_ev.get('filePath'),
    ) or '')

    # ---- lineNumber ----
    # 规范字段: LineNumber（PascalCase）或 lineNumber（camelCase），整数，非嵌套
    raw_line = _coalesce(
        f.get('LineNumber'), f.get('lineNumber'),
        f.get('line'), f.get('line_number'),
        loc.get('line'), loc.get('lineNumber'),
        loc.get('startLine'), loc.get('start_line'),
        first_ev.get('line'), first_ev.get('lineNumber'),
        first_ev.get('startLine'),
    )
    if not raw_line or raw_line == 0:
        raw_line = _coalesce(
            loc.get('endLine'), loc.get('end_line'),
            first_ev.get('endLine'),
        )
    f['lineNumber'] = int(raw_line) if raw_line else 0

    # ---- riskType ----
    f['riskType'] = str(_coalesce(
        f.get('riskType'), f.get('RiskType'), f.get('type'), f.get('category'),
    ) or '')

    # ---- severity ----
    raw_severity = _coalesce(
        f.get('severity'), f.get('RiskLevel'), f.get('riskLevel'), f.get('risk_level'), f.get('level'),
    ) or ''
    f['severity'] = get_risk_level_normalized(raw_severity)

    # ---- confidence ----
    raw_conf = _coalesce(
        f.get('confidence'), f.get('RiskConfidence'), f.get('riskConfidence'),
        f.get('Confidence'), f.get('risk_confidence'),
    )
    if isinstance(raw_conf, dict):
        # 嵌套格式：confidence.RiskConfidence
        raw_conf = raw_conf.get('RiskConfidence', raw_conf.get('riskConfidence', 0))
    f['confidence'] = int(raw_conf) if raw_conf else 0

    # ---- codeSnippet ----
    f['codeSnippet'] = str(_coalesce(
        f.get('codeSnippet'), f.get('CodeSnippet'), f.get('RiskCode'), f.get('riskCode'),
        f.get('code'), f.get('code_snippet'), f.get('snippet'), f.get('originalCode'),
    ) or '')

    # ---- description ----
    f['description'] = str(_coalesce(
        f.get('description'), f.get('RiskDetail'), f.get('riskDetail'), f.get('detail'),
    ) or '')

    # ---- recommendation ----
    f['recommendation'] = str(_coalesce(
        f.get('recommendation'), f.get('Suggestions'), f.get('suggestions'),
        f.get('suggestion'), f.get('remediation'), f.get('fix'),
    ) or '')

    # ---- fixedCode ----
    f['fixedCode'] = str(_coalesce(
        f.get('fixedCode'), f.get('FixedCode'), f.get('fixed_code'),
    ) or '')

    # ---- findingId ----
    f['findingId'] = str(_coalesce(
        f.get('findingId'), f.get('FindingId'), f.get('mergedId'), f.get('finding_id'), f.get('id'),
    ) or '')

    # ---- sourceAgent ----
    f['sourceAgent'] = str(_coalesce(
        f.get('sourceAgent'), f.get('source_agent'),
    ) or source_agent or '')

    # ---- attackChain ----
    chain = f.get('attackChain') or f.get('attackChains')
    if isinstance(chain, list) and chain:
        chain = chain[0] if isinstance(chain[0], (dict, str)) else None
    if isinstance(chain, (dict, str)):
        f['attackChain'] = chain

    # ---- traceMethod ----
    trace = f.get('traceMethod') or f.get('trace_method')
    if not trace and isinstance(f.get('attackChain'), dict):
        trace = f['attackChain'].get('traceMethod')
    if trace:
        f['traceMethod'] = str(trace)

    # ---- pocMethod / pocRequestType ----
    # POC 验证方式描述和请求类型，由 poc_generator.py 生成并注入到 finding 中
    poc_method = f.get('pocMethod') or f.get('poc_method')
    if poc_method:
        f['pocMethod'] = str(poc_method)
    poc_request_type = f.get('pocRequestType') or f.get('poc_request_type')
    if poc_request_type:
        f['pocRequestType'] = str(poc_request_type)

    return f


def to_report_format(f):
    """将内部统一格式的 finding 转换为最终报告层 PascalCase 格式。

    用于 merge_findings.py stage3 生成 finding-{slug}.json 时。

    Args:
        f: 已归一化的 finding dict（来自 normalize_finding）

    Returns:
        PascalCase 格式的 risk_item dict
    """
    risk_item = {
        "FilePath": f.get('filePath', ''),
        "RiskType": f.get('riskType', ''),
        "RiskLevel": f.get('severity', 'medium'),
        "LineNumber": f.get('lineNumber', 0),
        "RiskCode": f.get('codeSnippet', ''),
        "RiskConfidence": f.get('confidence', 50),
        "RiskDetail": f.get('description', ''),
        "Suggestions": f.get('recommendation', ''),
        "FixedCode": f.get('fixedCode', ''),
        "verificationStatus": f.get('verificationStatus', 'unverified'),
        "challengeVerdict": f.get('challengeVerdict', ''),
        "findingId": f.get('findingId', ''),
        "sourceAgent": f.get('sourceAgent', ''),
    }
    # 保留可选字段
    for extra_key in (
        'component', 'currentVersion', 'fixedVersion', 'cve', 'source', 'reasoning',
        'dependencyFile', 'manifestFile',
    ):
        if f.get(extra_key) not in (None, ''):
            risk_item[extra_key] = f[extra_key]
    if f.get('attackChain'):
        risk_item['attackChain'] = f['attackChain']
    if f.get('traceMethod'):
        risk_item['traceMethod'] = f['traceMethod']
    if f.get('confidenceBreakdown'):
        risk_item['confidenceBreakdown'] = f['confidenceBreakdown']
    if f.get('confidenceCeiling') is not None:
        risk_item['confidenceCeiling'] = f['confidenceCeiling']
    if f.get('confidenceCeilingReason'):
        risk_item['confidenceCeilingReason'] = f['confidenceCeilingReason']
    if f.get('auditedBy'):
        risk_item['auditedBy'] = f['auditedBy']
    if f.get('defenses'):
        risk_item['defenses'] = f['defenses']
    if f.get('attackPayload'):
        risk_item['attackPayload'] = f['attackPayload']
    if f.get('callChain'):
        risk_item['callChain'] = f['callChain']
    return risk_item


# ---------------------------------------------------------------------------
# 分层配置加载
# ---------------------------------------------------------------------------
#
# 配置分为两级：
#   用户级: ~/.codebuddy/security-scan/config.json （Webhook URL 等个人配置）
#   项目级: {project}/.codebuddy/security-scan/config.json （门禁策略、auto_scan 等项目配置）
#
# 合并规则: 项目级 > 用户级 > 内置默认值（浅合并，顶层 key 覆盖）
# ---------------------------------------------------------------------------

_SCAN_CONFIG_DIR = "security-scan"
_SCAN_CONFIG_FILENAME = "config.json"


def _user_config_path() -> Path:
    """获取用户级配置文件路径: ~/.codebuddy/security-scan/config.json"""
    return Path.home() / ".codebuddy" / _SCAN_CONFIG_DIR / _SCAN_CONFIG_FILENAME


def _project_config_path(project_root: str = "") -> Path:
    """获取项目级配置文件路径: {project}/.codebuddy/security-scan/config.json"""
    base = resolve_project_root(project_root)
    return base / ".codebuddy" / _SCAN_CONFIG_DIR / _SCAN_CONFIG_FILENAME


def load_merged_config(project_root: str = "") -> dict:
    """加载合并后的配置（项目级 > 用户级）。

    合并策略：浅合并（shallow merge），顶层 key 项目级覆盖用户级。
    对于嵌套对象（如 notification, auto_scan），项目级整体覆盖用户级的同名 key。

    Args:
        project_root: 项目根目录路径。为空时使用 cwd。

    Returns:
        dict: 合并后的配置。无配置文件时返回空 dict。
    """
    merged = {}

    # 1. 加载用户级（基础层）
    user_path = _user_config_path()
    user_config = load_json_file(str(user_path))
    if user_config and isinstance(user_config, dict):
        merged.update(user_config)

    # 2. 加载项目级（覆盖层）
    project_path = _project_config_path(project_root)
    project_config = load_json_file(str(project_path))
    if project_config and isinstance(project_config, dict):
        merged.update(project_config)

    return merged
