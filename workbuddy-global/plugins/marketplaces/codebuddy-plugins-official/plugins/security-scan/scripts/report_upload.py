#!/usr/bin/env python3
"""
审计报告与修复结果上报脚本
独立运行，直接从审计结果目录读取数据并上报

支持两种上报类型：
  --type audit  上报审计结果（默认）
  --type fix    上报修复结果（需先生成 fix-report.json）

上报地址和 Token 硬编码在脚本中，无需额外环境变量配置。
"""
import argparse
import base64
import json
import os
import re
import subprocess
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

from _common import (
    Colors, print_colored, BEIJING_TZ, LOCAL_TZ, TIME_FORMAT,
    _parse_datetime, format_beijing_time,
    get_git_branch, get_git_project_name,
    get_risk_level_normalized,
)

_UUID_RE = re.compile(
    r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
    re.IGNORECASE,
)


UPLOAD_TIMEOUT_SECONDS = 8
UPLOAD_MAX_RETRIES = 2
UPLOAD_RETRY_BACKOFF_SECONDS = 1.0


def _decode_jwt_username(token):
    """Decode JWT token and extract preferred_username from payload."""
    if not token or not isinstance(token, str):
        return None
    parts = token.split(".")
    if len(parts) != 3:
        return None
    try:
        payload_b64 = parts[1]
        padding = 4 - len(payload_b64) % 4
        if padding != 4:
            payload_b64 += "=" * padding
        payload_b64 = payload_b64.replace("-", "+").replace("_", "/")
        payload_json = base64.b64decode(payload_b64).decode("utf-8")
        payload = json.loads(payload_json)
        if "preferred_username" in payload and payload["preferred_username"]:
            return str(payload["preferred_username"])
    except Exception:
        pass
    return None


REPORT_URL = "http://21.159.6.47:8080/api/v1/reports/upload"
REPORT_TOKEN = "ty8YwQyOwFJKfTCbx65JSA"


def _load_user_storage():
    """加载用户存储信息"""
    home = Path.home()
    candidates = [
        home / "Library/Application Support/CodeBuddy CN/User/globalStorage/storage.json",
        home / "AppData/Roaming/CodeBuddy CN/User/globalStorage/storage.json",
        home / "AppData/Local/CodeBuddy CN/User/globalStorage/storage.json",
        home / ".config/CodeBuddy CN/User/globalStorage/storage.json",
    ]
    for path in candidates:
        if path.exists():
            try:
                with path.open("r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                return {}
    return {}


def _extract_user_id(storage):
    """提取用户 ID
    
    如果存储的是 JWT token，尝试从中提取 preferred_username 或 sub
    """
    if not isinstance(storage, dict):
        return ""
    
    raw_id = None
    for key in ("genie.userId", "genie.userld", "userId", "user_id"):
        if key in storage and storage[key]:
            raw_id = str(storage[key])
            break
    
    if not raw_id:
        genie = storage.get("genie")
        if isinstance(genie, dict):
            for key in ("userId", "userld"):
                value = genie.get(key)
                if value:
                    raw_id = str(value)
                    break
    
    if not raw_id:
        return ""
    
    # 如果是 JWT token，尝试解码提取用户名
    if raw_id.startswith("eyJ") and raw_id.count(".") == 2:
        decoded = _decode_jwt_username(raw_id)
        if decoded:
            return decoded
        # 尝试提取 sub 字段
        try:
            parts = raw_id.split(".")
            payload_b64 = parts[1]
            padding = 4 - len(payload_b64) % 4
            if padding != 4:
                payload_b64 += "=" * padding
            payload_b64 = payload_b64.replace("-", "+").replace("_", "/")
            payload_json = base64.b64decode(payload_b64).decode("utf-8")
            payload = json.loads(payload_json)
            if "sub" in payload:
                return str(payload["sub"])
        except Exception:
            pass
        # JWT 解码失败，返回空而不是原始 token（太长）
        return ""
    
    return raw_id


def _extract_user_name(storage, fallback):
    """提取用户名"""
    if not isinstance(storage, dict):
        return fallback
    result = None
    for key in ("genie.userName", "genie.username", "userName", "username"):
        if key in storage and storage[key]:
            result = str(storage[key])
            break
    if not result:
        genie = storage.get("genie")
        if isinstance(genie, dict):
            for key in ("userName", "username", "nickName", "nickname"):
                value = genie.get(key)
                if value:
                    result = str(value)
                    break
    if not result:
        result = fallback
    if result:
        decoded = _decode_jwt_username(result)
        if decoded:
            return decoded
    return result


def load_audit_results(input_path, audit_batch_id=None):
    """从审计结果目录加载数据"""
    results = []
    summary = None

    if audit_batch_id and not input_path:
        possible_paths = [
            os.path.join(os.getcwd(), "security-scan-output", audit_batch_id),
            os.path.join("/tmp", "security-scan-output", audit_batch_id),
        ]
        for path in possible_paths:
            if os.path.exists(path):
                input_path = path
                break

    if not input_path:
        raise ValueError("未指定输入路径，请使用 --input 或 --audit-batch-id")

    input_path = Path(input_path)

    if input_path.is_file():
        with open(input_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            results.append(data)
            if 'summary' in data:
                summary = {
                    'auditBatchId': data.get('metadata', {}).get('auditBatchId', audit_batch_id or 'unknown'),
                    'riskFiles': 1 if data['summary'].get('totalIssues', 0) > 0 else 0,
                    'totalIssues': data['summary'].get('totalIssues', 0),
                    'criticalRisk': data['summary'].get('criticalRisk', 0),
                    'highRisk': data['summary'].get('highRisk', 0),
                    'mediumRisk': data['summary'].get('mediumRisk', 0),
                    'lowRisk': data['summary'].get('lowRisk', 0),
                }

    elif input_path.is_dir():
        summary_file = input_path / "summary.json"
        if summary_file.exists():
            with open(summary_file, 'r', encoding='utf-8') as f:
                summary = json.load(f)
            summary_id = summary.get('auditBatchId') if isinstance(summary, dict) else None
            if audit_batch_id and (not summary_id or summary_id == 'unknown'):
                summary['auditBatchId'] = audit_batch_id
            elif not summary_id or summary_id == 'unknown':
                summary['auditBatchId'] = input_path.name

        for file_path in sorted(input_path.glob("result-*.json")):
            with open(file_path, 'r', encoding='utf-8') as f:
                results.append(json.load(f))

        # Light 模式产出 merged-scan.json（含 findings 数组），无 result-*.json
        if not results:
            merged_scan_file = input_path / "merged-scan.json"
            if merged_scan_file.exists():
                with open(merged_scan_file, 'r', encoding='utf-8') as f:
                    merged_data = json.load(f)
                if 'findings' in merged_data and isinstance(merged_data['findings'], list):
                    # 将 findings 转换为 result-*.json 等价结构
                    by_risk_type = {}
                    for finding in merged_data['findings']:
                        rt = finding.get('riskType', 'unknown')
                        slug = rt.lower().replace(' ', '-').replace('_', '-')
                        by_risk_type.setdefault(slug, []).append(finding)

                    for slug, group_findings in by_risk_type.items():
                        issues = []
                        for gf in group_findings:
                            issues.append({
                                'RiskLevel': get_risk_level_normalized(
                                    gf.get('severity', gf.get('riskLevel', 'medium'))
                                ),
                                'FilePath': gf.get('filePath', ''),
                                'RiskType': gf.get('riskType', ''),
                                'LineNumber': gf.get('lineNumber', 0),
                                'RiskCode': gf.get('codeSnippet', ''),
                                'RiskDetail': gf.get('description', ''),
                                'Suggestions': gf.get('recommendation', ''),
                                'FixedCode': gf.get('fixedCode', ''),
                                'RiskConfidence': gf.get('confidence', 0),
                            })
                        results.append({
                            'summary': {
                                'totalIssues': len(group_findings),
                            },
                            'issues': issues,
                        })

                    # 从 merged-scan.json 补充/构建 summary
                    if results:
                        total = merged_data.get('totalFindings', len(merged_data['findings']))
                        by_sev = merged_data.get('bySeverity', {})
                        merged_summary = {
                            'auditBatchId': audit_batch_id or input_path.name or 'unknown',
                            'riskFiles': len(by_risk_type),
                            'totalIssues': total,
                            'criticalRisk': by_sev.get('critical', 0),
                            'highRisk': by_sev.get('high', 0),
                            'mediumRisk': by_sev.get('medium', 0),
                            'lowRisk': by_sev.get('low', 0),
                        }
                        if summary and isinstance(summary, dict):
                            # 补充已有 summary 中缺失的字段
                            for k, v in merged_summary.items():
                                if k not in summary or summary[k] in (None, 0, ''):
                                    summary[k] = v
                        else:
                            summary = merged_summary

        if not summary and results:
            total_issues = 0
            critical_risk = 0
            high_risk = 0
            medium_risk = 0
            low_risk = 0

            for r in results:
                s = r.get('summary', {})
                total_issues += s.get('totalIssues', 0)
                critical_risk += s.get('criticalRisk', 0)
                high_risk += s.get('highRisk', 0)
                medium_risk += s.get('mediumRisk', 0)
                low_risk += s.get('lowRisk', 0)

            summary = {
                'auditBatchId': audit_batch_id or input_path.name or 'unknown',
                'riskFiles': sum(1 for r in results if r.get('summary', {}).get('totalIssues', 0) > 0),
                'totalIssues': total_issues,
                'criticalRisk': critical_risk,
                'highRisk': high_risk,
                'mediumRisk': medium_risk,
                'lowRisk': low_risk,
            }
    else:
        raise ValueError(f"输入路径不存在: {input_path}")

    if summary and isinstance(summary, dict):
        summary_id = summary.get('auditBatchId')
        if audit_batch_id and (not summary_id or summary_id == 'unknown'):
            summary['auditBatchId'] = audit_batch_id
        elif not summary_id or summary_id == 'unknown':
            if input_path.is_dir():
                summary['auditBatchId'] = input_path.name

    # 根据 files 列表动态计算 riskFiles（兼容旧数据中无此字段的情况）
    if summary and isinstance(summary, dict) and 'riskFiles' not in summary:
        files_list = summary.get('files', [])
        if files_list:
            summary['riskFiles'] = sum(1 for f in files_list if f.get('issues', 0) > 0)
        else:
            summary['riskFiles'] = len(results)

    return results, summary


def load_fix_report(batch_dir):
    """从批次目录加载修复报告

    Args:
        batch_dir: 批次目录路径 (Path)

    Returns:
        dict: 修复报告数据，如果文件不存在或解析失败返回 None
    """
    fix_report_path = batch_dir / "fix-report.json"
    if not fix_report_path.exists():
        return None
    try:
        with fix_report_path.open("r", encoding="utf-8") as f:
            data = json.load(f)
        if not isinstance(data, dict):
            return None
        return data
    except Exception:
        return None


def _load_gate_result(batch_dir):
    """读取门禁评估结果。

    Args:
        batch_dir: 批次目录路径 (Path)

    Returns:
        dict: gate-result.json 数据，不存在或解析失败返回 None
    """
    if not batch_dir:
        return None
    gate_path = batch_dir / "gate-result.json"
    if not gate_path.exists():
        return None
    try:
        with gate_path.open("r", encoding="utf-8") as f:
            data = json.load(f)
        if isinstance(data, dict) and "gateStatus" in data:
            return data
    except Exception:
        pass
    return None


def _read_audit_timing(batch_dir):
    """读取审计耗时信息

    从批次目录中读取 .audit_start_time 和 .audit_end_time 文件，
    解析 ISO 8601 时间戳并计算审计耗时。

    Args:
        batch_dir: 批次目录路径 (Path)

    Returns:
        dict: 包含 audit_start_time, audit_end_time, audit_duration_seconds，
              缺失的字段不包含在返回值中。返回空 dict 表示无任何时间信息。
    """
    timing = {}
    start_path = batch_dir / ".audit_start_time"
    end_path = batch_dir / ".audit_end_time"

    start_dt = None
    end_dt = None

    if start_path.exists():
        try:
            raw = start_path.read_text(encoding="utf-8").strip()
            start_dt = _parse_datetime(raw)
            if start_dt:
                timing["audit_start_time"] = start_dt.isoformat()
        except Exception:
            pass

    if end_path.exists():
        try:
            raw = end_path.read_text(encoding="utf-8").strip()
            end_dt = _parse_datetime(raw)
            if end_dt:
                timing["audit_end_time"] = end_dt.isoformat()
        except Exception:
            pass

    if start_dt and end_dt:
        delta = (end_dt - start_dt).total_seconds()
        if delta >= 0:
            timing["audit_duration_seconds"] = int(delta)

    return timing


def build_upload_payload(results, summary, batch_dir, code_branch=None, project_name=None):
    """构建上报 payload（精简版，仅包含顶层字段）"""
    # 获取用户信息
    storage = _load_user_storage()
    user_id = _extract_user_id(storage)
    env_user = os.environ.get("USER") or os.environ.get("USERNAME") or ""
    # userId 为 UUID 时优先使用系统 $USER 作为用户名
    if user_id and _UUID_RE.match(user_id) and env_user:
        fallback = env_user
    else:
        fallback = user_id or env_user
    user_name = _extract_user_name(storage, fallback)

    # 统计风险数量
    total_issues = 0
    critical_count = 0
    high_count = 0
    medium_count = 0
    low_count = 0
    fixed_count = 0

    for result in results:
        issues = result.get('RiskList', result.get('issues', []))
        for issue in issues:
            total_issues += 1
            risk_level = issue.get('RiskLevel', issue.get('severity', ''))
            level_normalized = get_risk_level_normalized(risk_level)
            if level_normalized == 'critical':
                critical_count += 1
            elif level_normalized == 'high':
                high_count += 1
            elif level_normalized == 'medium':
                medium_count += 1
            else:
                low_count += 1
            
            if issue.get('FixedCode') or issue.get('fixedCode'):
                fixed_count += 1

    audit_batch_id = summary.get('auditBatchId') or summary.get('batchId') or (batch_dir.name if batch_dir else 'unknown')

    # 读取审计耗时信息
    timing = _read_audit_timing(batch_dir) if batch_dir else {}

    # scan_time 优先使用审计开始时间，否则使用当前时间
    scan_time = timing.get("audit_start_time", datetime.now(timezone.utc).isoformat())

    # 构建 extra_info，合并耗时信息
    extra_info = {"report_type": "audit"}
    if project_name:
        extra_info["project_name"] = project_name
    extra_info.update(timing)

    # 读取门禁评估结果
    gate_result = _load_gate_result(batch_dir)
    if gate_result:
        extra_info["gate_status"] = gate_result.get("gateStatus", "unknown")
        extra_info["gate_violations_count"] = len(gate_result.get("violations", []))
        extra_info["gate_evaluated_at"] = gate_result.get("evaluatedAt", "")

    # 精简 payload，仅包含服务端 ReportCreate schema 定义的字段
    payload = {
        "batch_id": audit_batch_id,
        "username": user_name,
        "total_risks": summary.get("totalIssues") or summary.get("totalFindings") or total_issues,
        "critical_risks": summary.get("criticalRisk", critical_count),
        "high_risks": summary.get("highRisk", high_count),
        "medium_risks": summary.get("mediumRisk", medium_count),
        "low_risks": summary.get("lowRisk", low_count),
        "risk_list": [],  # 空数组，不上传详细内容
        "auto_fixed_list": [],  # 空数组，不上传详细内容
        "auto_fixed_high_count": fixed_count,
        "scan_time": scan_time,
        "extra_info": extra_info,
    }

    return payload


def build_fix_upload_payload(fix_report, batch_dir):
    """构建修复结果上报 payload（兼容服务端 ReportCreate schema）

    服务端只有一个 ReportCreate 入口模型，修复上报需要复用该结构：
    - batch_id 添加 "-fix" 后缀，避免与审计上报的去重冲突（409）
    - scan_time 必填，使用 fix_time 填充
    - fixed_risks 转换为 auto_fixed_list 格式
    - 原始修复详情保存到 extra_info 以保留完整数据

    Args:
        fix_report: fix-report.json 中加载的数据
        batch_dir: 批次目录路径 (Path)

    Returns:
        dict: 修复上报 payload
    """
    # 获取用户信息
    storage = _load_user_storage()
    user_id = _extract_user_id(storage)
    env_user = os.environ.get("USER") or os.environ.get("USERNAME") or ""
    # userId 为 UUID 时优先使用系统 $USER 作为用户名
    if user_id and _UUID_RE.match(user_id) and env_user:
        fallback = env_user
    else:
        fallback = user_id or env_user
    user_name = _extract_user_name(storage, fallback)

    # 原始 batch_id 加 -fix 后缀，避免与审计上报的 Redis 去重冲突
    raw_batch_id = fix_report.get("batch_id", batch_dir.name)
    fix_batch_id = f"{raw_batch_id}-fix"

    fix_time = fix_report.get("fix_time", datetime.now(timezone.utc).isoformat())

    # 将 fixed_risks 转换为服务端 auto_fixed_list 格式
    auto_fixed_list = []
    fixed_risk_ids = []
    for risk in fix_report.get("fixed_risks", []):
        risk_id = str(risk.get("risk_id", "") or "").strip()
        if risk_id:
            fixed_risk_ids.append(risk_id)
        auto_fixed_list.append({
            "file_path": risk.get("file_path", ""),
            # 优先放 RiskId，便于服务端与审计结果精确关联
            "rule_id": risk_id or risk.get("risk_type", ""),
            "rule_name": risk.get("risk_type", ""),
            "severity": risk.get("risk_level", "high"),
            "line_number": risk.get("line_number"),
            "risk_confidence": risk.get("risk_confidence"),
            "description": risk.get("fix_method", ""),
        })

    fixed_high = fix_report.get("fixed_high", 0)
    fixed_medium = fix_report.get("fixed_medium", 0)
    fixed_low = fix_report.get("fixed_low", 0)
    fixed_total = fix_report.get("fixed_total", 0)

    payload = {
        "batch_id": fix_batch_id,
        "username": user_name,
        "scan_time": fix_time,
        "total_risks": fixed_total,
        "high_risks": fixed_high,
        "medium_risks": fixed_medium,
        "low_risks": fixed_low,
        "risk_list": [],
        "auto_fixed_list": auto_fixed_list,
        "auto_fixed_high_count": fixed_high,
        "extra_info": {
            "report_type": "fix",
            "original_batch_id": raw_batch_id,
            "fixed_total": fixed_total,
            "fixed_high": fixed_high,
            "fixed_medium": fixed_medium,
            "fixed_low": fixed_low,
            "fixed_risk_ids": fixed_risk_ids,
        },
    }

    return payload


def _write_payload(payload, output_dir):
    """保存 payload 到本地"""
    try:
        output_dir.mkdir(parents=True, exist_ok=True)
        payload_path = output_dir / "report-payload.json"
        with payload_path.open("w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)
    except Exception:
        return


def _should_retry_status(status_code):
    """判断 HTTP 状态码是否适合重试"""
    return status_code == 429 or 500 <= status_code < 600


def _retry_sleep_seconds(attempt):
    """按指数退避计算等待时间（秒）"""
    return UPLOAD_RETRY_BACKOFF_SECONDS * (2 ** max(0, attempt - 1))


def _trim_response_text(value, max_len=200):
    """裁剪响应文本，避免错误日志过长"""
    text = str(value or "").strip()
    if len(text) <= max_len:
        return text
    return text[:max_len] + "..."


def _send_payload(payload):
    """发送 payload 到上报服务（硬编码直连）

    Returns:
        tuple: (success: bool, error: str or None)
    """
    data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    headers = {
        "Content-Type": "application/json",
        "X-API-Token": REPORT_TOKEN,
    }
    return _try_send(REPORT_URL, data, headers, max_retries=UPLOAD_MAX_RETRIES)


def _try_send(url, data, headers, max_retries=UPLOAD_MAX_RETRIES):
    """单通道发送，含重试逻辑

    Returns:
        tuple: (success: bool, error: str or None)
    """
    import urllib.error
    import urllib.request

    last_error = None
    for attempt in range(1, max_retries + 1):
        try:
            req = urllib.request.Request(url, data=data, headers=headers, method="POST")
            with urllib.request.urlopen(req, timeout=UPLOAD_TIMEOUT_SECONDS) as resp:
                resp.read()
            return True, None
        except urllib.error.HTTPError as e:
            status_code = int(getattr(e, "code", 0) or 0)
            response_body = ""
            try:
                response_body = _trim_response_text(e.read().decode("utf-8", errors="ignore"))
            except Exception:
                response_body = ""

            # 服务端去重冲突：视为已成功上报
            if status_code == 409:
                return True, "服务端已存在相同批次（HTTP 409），按成功处理"

            last_error = f"HTTP {status_code}"
            if response_body:
                last_error += f": {response_body}"

            if attempt < max_retries and _should_retry_status(status_code):
                time.sleep(_retry_sleep_seconds(attempt))
                continue
            return False, last_error
        except urllib.error.URLError as e:
            last_error = f"网络错误: {e.reason}"
            if attempt < max_retries:
                time.sleep(_retry_sleep_seconds(attempt))
                continue
            return False, last_error
        except TimeoutError:
            last_error = "请求超时"
            if attempt < max_retries:
                time.sleep(_retry_sleep_seconds(attempt))
                continue
            return False, last_error
        except Exception as e:
            return False, str(e)

    return False, last_error or "上报失败"


def _report_sent_path(batch_dir):
    """获取上报标记文件路径"""
    return batch_dir / "report-sent.json"


def _mark_report_sent(batch_dir, sent, url, error=None):
    """标记上报状态
    
    Args:
        batch_dir: 批次目录
        sent: 是否上报成功
        url: 上报 URL
        error: 失败原因（可选）
    """
    try:
        payload = {
            "sent": bool(sent),
            "url": url or "",
            "timestamp": datetime.now(BEIJING_TZ).strftime(TIME_FORMAT),
        }
        if error:
            payload["error"] = error
        with _report_sent_path(batch_dir).open("w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)
    except Exception:
        return


def _read_report_sent(batch_dir):
    """读取上报状态"""
    path = _report_sent_path(batch_dir)
    if not path.exists():
        return None
    try:
        with path.open("r", encoding="utf-8") as f:
            payload = json.load(f)
        if isinstance(payload, dict) and "sent" in payload:
            return bool(payload.get("sent"))
    except Exception:
        return None
    return None


def _write_fix_payload(payload, output_dir):
    """保存修复 payload 到本地"""
    try:
        output_dir.mkdir(parents=True, exist_ok=True)
        payload_path = output_dir / "fix-report-payload.json"
        with payload_path.open("w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)
    except Exception:
        return


def _fix_report_sent_path(batch_dir):
    """获取修复上报标记文件路径"""
    return batch_dir / "fix-report-sent.json"


def _mark_fix_report_sent(batch_dir, sent, url, error=None):
    """标记修复上报状态"""
    try:
        payload = {
            "sent": bool(sent),
            "url": url or "",
            "timestamp": datetime.now(BEIJING_TZ).strftime(TIME_FORMAT),
        }
        if error:
            payload["error"] = error
        with _fix_report_sent_path(batch_dir).open("w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)
    except Exception:
        return


def _read_fix_report_sent(batch_dir):
    """读取修复上报状态"""
    path = _fix_report_sent_path(batch_dir)
    if not path.exists():
        return None
    try:
        with path.open("r", encoding="utf-8") as f:
            payload = json.load(f)
        if isinstance(payload, dict) and "sent" in payload:
            return bool(payload.get("sent"))
    except Exception:
        return None
    return None


def resolve_input_path(input_path, audit_batch_id=None, cwd=None):
    """
    解析输入路径

    查找顺序：
    1. 直接使用 input_path（如果指定）
    2. 在 cwd/security-scan-output/ 下查找
    3. 在当前工作目录/security-scan-output/ 下查找
    4. 在 /tmp/security-scan-output/ 下查找
    """
    # 如果直接指定了路径
    if input_path:
        path = Path(input_path)
        if path.exists():
            return path
        # 如果路径不存在但看起来像批次 ID，尝试作为批次 ID 查找
        if not path.is_absolute() and audit_batch_id is None:
            audit_batch_id = str(input_path)

    # 构建 security-scan-output 目录列表（用于自动查找）
    security_scan_output_dirs = []

    # 使用指定的工作目录
    if cwd:
        security_scan_output_dirs.append(os.path.join(cwd, "security-scan-output"))

    # 当前工作目录
    security_scan_output_dirs.append(os.path.join(os.getcwd(), "security-scan-output"))

    # /tmp 目录
    security_scan_output_dirs.append("/tmp/security-scan-output")

    # 如果没有 audit_batch_id，尝试查找最新的批次目录
    if not audit_batch_id:
        for security_scan_dir in security_scan_output_dirs:
            security_scan_path = Path(security_scan_dir)
            if security_scan_path.exists() and security_scan_path.is_dir():
                # 查找最新的批次目录
                batch_dirs = sorted(
                    [d for d in security_scan_path.iterdir() if d.is_dir() and d.name.startswith(("project-deep-", "project-light-", "diff-deep-", "diff-light-"))],
                    key=lambda x: x.stat().st_mtime,
                    reverse=True
                )
                if batch_dirs:
                    return batch_dirs[0]
    else:
        # 有 audit_batch_id，直接查找
        for security_scan_dir in security_scan_output_dirs:
            full_path = os.path.join(security_scan_dir, audit_batch_id)
            if os.path.exists(full_path):
                return Path(full_path)

    return None


def upload_report(input_path=None, audit_batch_id=None, cwd=None, quiet=False):
    """
    上报审计报告（主函数）

    Args:
        input_path: 审计结果目录路径
        audit_batch_id: 审计批次 ID
        cwd: 工作目录（用于查找 security-scan-output）
        quiet: 是否静默模式

    Returns:
        bool: 上报是否成功
    """
    # 解析输入路径
    batch_dir = resolve_input_path(input_path, audit_batch_id, cwd)
    if batch_dir is None:
        if not quiet:
            print_colored("[FAIL] 未找到审计结果目录", Colors.FAIL)
            print_colored("", Colors.ENDC)
            print_colored("已搜索以下位置：", Colors.WARNING)
            search_locations = []
            if cwd:
                search_locations.append(f"  - {cwd}/security-scan-output/{audit_batch_id or '<batch-id>'}")
            search_locations.append(f"  - {os.getcwd()}/security-scan-output/{audit_batch_id or '<batch-id>'}")
            search_locations.append(f"  - /tmp/security-scan-output/{audit_batch_id or '<batch-id>'}")
            for loc in search_locations:
                print_colored(loc, Colors.ENDC)
            print_colored("", Colors.ENDC)
            print_colored("请确保：", Colors.WARNING)
            print_colored("  1. 已执行安全审计并生成了 result-*.json 文件", Colors.ENDC)
            print_colored("  2. 使用 --input 指定正确的审计结果目录路径", Colors.ENDC)
            print_colored("  3. 或使用 --cwd 指定包含 security-scan-output 的工作目录", Colors.ENDC)
        return False

    # 检查是否已上报
    if _report_sent_path(batch_dir).exists():
        sent = _read_report_sent(batch_dir)
        if sent is True:
            if not quiet:
                print_colored("[SKIP] 报告已上报，跳过", Colors.WARNING)
            return True
        if sent is False:
            if not quiet:
                print_colored("🔄 上次上报失败，将重试", Colors.WARNING)
        elif not quiet:
            print_colored("[WARN] report-sent.json 无效，将重试", Colors.WARNING)

    # 加载审计结果
    try:
        results, summary = load_audit_results(str(batch_dir), audit_batch_id)
    except Exception as e:
        if not quiet:
            print_colored(f"[FAIL] 加载审计结果失败: {e}", Colors.FAIL)
        return False

    if not results and not summary:
        if not quiet:
            print_colored("[WARN] 未找到审计结果", Colors.WARNING)
        return False

    # 没有 finding-*.json / result-*.json 但有 summary（0 漏洞场景），仍需构建 summary 并上报
    if not summary:
        summary = {
            'auditBatchId': audit_batch_id or batch_dir.name or 'unknown',
            'riskFiles': 0,
            'totalIssues': 0,
            'highRisk': 0,
            'mediumRisk': 0,
            'lowRisk': 0,
        }

    if not quiet:
        issue_count = summary.get('totalIssues', 0)
        file_count = len(results) if results else summary.get('riskFiles', 0)
        print_colored(f"[OK] 加载了 {file_count} 个审计结果，共 {issue_count} 个风险", Colors.GREEN)

    # 获取 Git 分支和项目名称
    git_base = batch_dir.parent.parent
    code_branch = get_git_branch(git_base) or "未知"
    project_name = get_git_project_name(git_base) or "未知"

    # 构建上报 payload
    payload = build_upload_payload(results, summary, batch_dir, code_branch, project_name=project_name)

    # 保存 payload 到本地
    _write_payload(payload, batch_dir)

    # 上报
    if not quiet:
        print_colored(f"📤 正在上报到: {REPORT_URL}", Colors.CYAN)
    
    sent, error = _send_payload(payload)
    if sent:
        _mark_report_sent(batch_dir, True, REPORT_URL)
        if not quiet:
            print_colored(f"[OK] 报告已上报: {REPORT_URL}", Colors.GREEN)
            if error:
                print_colored(f"   说明: {error}", Colors.WARNING)
    else:
        _mark_report_sent(batch_dir, False, REPORT_URL, error)
        if not quiet:
            print_colored(f"[FAIL] 报告上报失败: {REPORT_URL}", Colors.FAIL)
            if error:
                print_colored(f"   原因: {error}", Colors.FAIL)

    return sent


def upload_fix_report(input_path=None, audit_batch_id=None, cwd=None, quiet=False):
    """
    上报修复结果（主函数）

    Args:
        input_path: 审计结果目录路径
        audit_batch_id: 审计批次 ID
        cwd: 工作目录
        quiet: 是否静默模式

    Returns:
        bool: 上报是否成功
    """
    # 解析输入路径（复用已有的 resolve_input_path）
    batch_dir = resolve_input_path(input_path, audit_batch_id, cwd)
    if batch_dir is None:
        if not quiet:
            print_colored("[FAIL] 未找到审计结果目录", Colors.FAIL)
        return False

    # 检查是否已上报修复结果
    if _fix_report_sent_path(batch_dir).exists():
        sent = _read_fix_report_sent(batch_dir)
        if sent is True:
            if not quiet:
                print_colored("[SKIP] 修复结果已上报，跳过", Colors.WARNING)
            return True
        if sent is False:
            if not quiet:
                print_colored("🔄 上次修复上报失败，将重试", Colors.WARNING)
        elif not quiet:
            print_colored("[WARN] fix-report-sent.json 无效，将重试", Colors.WARNING)

    # 加载 fix-report.json
    fix_report = load_fix_report(batch_dir)
    if fix_report is None:
        if not quiet:
            print_colored(f"[FAIL] 未找到 fix-report.json: {batch_dir / 'fix-report.json'}", Colors.FAIL)
            print_colored("   请确保修复完成后已生成 fix-report.json 文件", Colors.ENDC)
        return False

    if not quiet:
        fixed_total = fix_report.get("fixed_total", 0)
        print_colored(f"[OK] 加载修复报告：共修复 {fixed_total} 个漏洞", Colors.GREEN)

    # 构建修复上报 payload
    payload = build_fix_upload_payload(fix_report, batch_dir)

    # 保存 payload 到本地
    _write_fix_payload(payload, batch_dir)

    # 上报
    if not quiet:
        print_colored(f"📤 正在上报修复结果到: {REPORT_URL}", Colors.CYAN)

    sent, error = _send_payload(payload)
    if sent:
        _mark_fix_report_sent(batch_dir, True, REPORT_URL)
        if not quiet:
            print_colored(f"[OK] 修复结果已上报: {REPORT_URL}", Colors.GREEN)
            if error:
                print_colored(f"   说明: {error}", Colors.WARNING)
    else:
        _mark_fix_report_sent(batch_dir, False, REPORT_URL, error)
        if not quiet:
            print_colored(f"[FAIL] 修复结果上报失败: {REPORT_URL}", Colors.FAIL)
            if error:
                print_colored(f"   原因: {error}", Colors.FAIL)

    return sent


def main():
    parser = argparse.ArgumentParser(
        description="上报审计/修复结果到服务器",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例用法:
  # 从审计目录上报审计结果（推荐）
  %(prog)s --input security-scan-output/project-deep-20250103120000

  # 使用审计批次 ID 自动查找目录
  %(prog)s --audit-batch-id project-deep-20250103120000

  # 指定工作目录（当 security-scan-output 不在当前目录时）
  %(prog)s --audit-batch-id project-deep-20250103120000 --cwd /path/to/project

  # 自动查找最新的审计批次（不指定 batch-id）
  %(prog)s --cwd /path/to/project

  # 上报修复结果
  %(prog)s --input security-scan-output/project-deep-20250103120000 --type fix

  # 静默模式
  %(prog)s --input security-scan-output/project-deep-20250103120000 --quiet

上报地址和 Token 硬编码在脚本中，无需额外环境变量。
        """
    )

    parser.add_argument('--input', help='输入路径（审计结果目录的完整路径）')
    parser.add_argument('--audit-batch-id', help='审计批次 ID（用于自动定位目录）')
    parser.add_argument('--cwd', help='工作目录（用于查找 security-scan-output 目录）')
    parser.add_argument('--quiet', action='store_true', help='静默模式（不输出日志）')
    parser.add_argument('--type', choices=['audit', 'fix'], default='audit',
                        help='上报类型：audit（审计结果，默认）或 fix（修复结果）')

    args = parser.parse_args()

    if args.quiet:
        Colors.HEADER = Colors.BLUE = Colors.CYAN = Colors.GREEN = ''
        Colors.WARNING = Colors.FAIL = Colors.ENDC = Colors.BOLD = ''

    # 如果没有指定任何参数，但有 --cwd，则自动查找最新批次
    if not args.input and not args.audit_batch_id and not args.cwd:
        print_colored("[FAIL] 请指定 --input、--audit-batch-id 或 --cwd", Colors.FAIL)
        print_colored("", Colors.ENDC)
        print_colored("示例：", Colors.WARNING)
        print_colored("  report_upload.py --input security-scan-output/project-deep-20250103120000", Colors.ENDC)
        print_colored("  report_upload.py --audit-batch-id project-deep-20250103120000", Colors.ENDC)
        print_colored("  report_upload.py --cwd /path/to/project  # 自动查找最新批次", Colors.ENDC)
        sys.exit(1)

    if args.type == 'fix':
        success = upload_fix_report(
            input_path=args.input,
            audit_batch_id=args.audit_batch_id,
            cwd=args.cwd,
            quiet=args.quiet
        )
    else:
        success = upload_report(
            input_path=args.input,
            audit_batch_id=args.audit_batch_id,
            cwd=args.cwd,
            quiet=args.quiet
        )

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print_colored("\n\n[WARN] 用户中断操作", Colors.WARNING)
        sys.exit(130)
    except Exception as e:
        print_colored(f"\n[FAIL] 未预期的错误: {e}", Colors.FAIL)
        import traceback
        traceback.print_exc()
        sys.exit(1)
