#!/usr/bin/env python3

"""
Stop Hook: 检测本轮对话中是否执行了 git commit/push，
若是则阻止 Agent 停止，要求其询问用户是否执行增量安全扫描。

检测策略：
  1. 优先读取 PostToolUse Hook 写入的会话级状态文件（精确、不受对话长度限制）
  2. 状态文件不存在时 fallback 到 transcript 扫描（向后兼容）

触发方式: hooks/hooks.json > Stop Hook
输入: stdin JSON (包含 session_id, transcript_path, stop_hook_active 等)
输出: stdout JSON (控制 Agent 是否继续)

退出码:
  0 - 允许 Agent 正常停止
  2 - 阻止停止，reason 传递给 Agent
"""
from __future__ import annotations
import collections
import json
import os
import re

import sys
import time
from pathlib import Path

# 共享解析模块
sys.path.insert(0, str(Path(__file__).resolve().parent))
from _git_parse import extract_git_op, COMMIT_HASH_RE

# ---------------------------------------------------------------------------
# 日志 (写入 stderr，不影响 stdout JSON 输出)
# ---------------------------------------------------------------------------
_PREFIX = "git-detector"


def _log(msg: str) -> None:
    print(f"[{_PREFIX}] {msg}", file=sys.stderr)


# ---------------------------------------------------------------------------
# 配置
# ---------------------------------------------------------------------------
_STATE_DIR = Path(os.environ.get("TMPDIR", "/tmp"))

# transcript 中向前扫描的最大行数（fallback 路径使用）
MAX_SCAN_LINES = 200


# ---------------------------------------------------------------------------
# 状态文件读取（主路径）
# ---------------------------------------------------------------------------
def _state_file_path(session_id: str) -> Path:
    """获取会话级状态文件路径。"""
    safe_id = re.sub(r"[^a-zA-Z0-9_-]", "_", session_id)
    return _STATE_DIR / f"security-scan-git-ops-{safe_id}.jsonl"


# 状态文件最大有效时间（秒），超过此窗口的记录视为残留数据
_STATE_MAX_AGE_SEC = 600  # 10 分钟


def _consume_state_file(session_id: str) -> list[dict]:
    """原子消费状态文件：先 rename 再解析，防止 TOCTOU 竞态丢失记录。

    通过 os.rename 将状态文件原子移动到临时路径后再读取和删除，
    确保 recorder (PostToolUse Hook) 在读取期间追加的新记录不会丢失——
    rename 之后 recorder 会创建新文件继续写入。

    自动过滤掉超过 _STATE_MAX_AGE_SEC 的过期记录，
    防止 Agent 异常退出后残留的状态文件导致误触发。

    Returns:
        list[dict]: 消费到的有效记录列表。
    """
    path = _state_file_path(session_id)
    consuming_path = path.with_suffix(".consuming")

    # 原子移动：rename 之后 recorder 会创建新文件
    try:
        os.rename(str(path), str(consuming_path))
    except FileNotFoundError:
        return []
    except Exception as e:
        _log(f"rename 状态文件失败: {e}")
        return []

    now = time.time()
    records = []
    try:
        with open(consuming_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    record = json.loads(line)
                except json.JSONDecodeError:
                    continue
                # 时间窗口过滤：丢弃过期记录
                ts = record.get("timestamp", 0)
                if isinstance(ts, (int, float)) and (now - ts) > _STATE_MAX_AGE_SEC:
                    _log(f"丢弃过期记录: op={record.get('op')}, age={now - ts:.0f}s")
                    continue
                records.append(record)
    except Exception as e:
        _log(f"读取状态文件失败: {e}")
    finally:
        # 清理临时文件
        try:
            consuming_path.unlink(missing_ok=True)
        except Exception as e:
            _log(f"清理临时状态文件失败: {e}")

    return records


def _determine_diff_args(records: list[dict]) -> str:
    """根据记录的 git 操作，计算最优的 diff 参数。

    优先级：
      1. push range（最精确，覆盖整段推送范围）
      2. 多个 commit hash（覆盖连续 commit 范围）
      3. 单个 commit hash
      4. 兜底 HEAD
    """
    # 优先用 push range
    push_records = [r for r in records if r.get("op") == "push" and r.get("push_range")]
    if push_records:
        last_push = push_records[-1]
        base, head = last_push["push_range"]
        return f"--commit {base}..{head}"

    # 收集所有 commit hash
    commit_hashes = [
        r["commit_hash"]
        for r in records
        if r.get("op") == "commit" and r.get("commit_hash")
    ]
    if len(commit_hashes) > 1:
        # 使用 first_hash^ 而非 ~1，对 merge commit 也能正确指向第一个 parent
        return f"--commit {commit_hashes[0]}^..{commit_hashes[-1]}"
    elif len(commit_hashes) == 1:
        return f"--commit {commit_hashes[0]}"

    return "--commit HEAD"


def _detect_from_state_file(session_id: str) -> tuple[bool, str, str]:
    """从状态文件检测 git 操作（原子消费：检测即消费，无需单独删除）。

    Returns:
        (found, last_op, diff_args)
    """
    records = _consume_state_file(session_id)
    if not records:
        return False, "", ""

    last_op = records[-1].get("op", "commit")
    diff_args = _determine_diff_args(records)
    return True, last_op, diff_args


# ---------------------------------------------------------------------------
# Transcript 扫描（fallback 路径）
# ---------------------------------------------------------------------------
def _iter_tool_blocks(entry: dict):
    """从 transcript entry 中提取 tool_use / tool_result block。"""
    if entry.get("type") in {"tool_use", "tool_result"}:
        yield entry

    content = entry.get("content")
    if isinstance(content, list):
        for block in content:
            if isinstance(block, dict) and block.get("type") in {"tool_use", "tool_result"}:
                yield block


def _tool_result_succeeded(block: dict) -> bool:
    """判断 Bash 工具结果是否成功。"""
    if block.get("is_error") is True:
        return False

    metadata = block.get("metadata")
    if isinstance(metadata, dict) and metadata.get("exit_code") is not None:
        return metadata.get("exit_code") == 0

    if block.get("exit_code") is not None:
        return block.get("exit_code") == 0

    return True


def _scan_transcript(transcript_path: str) -> tuple[bool, str, str]:
    """扫描 transcript 文件（fallback 路径）。

    Returns:
        (found, op_type, diff_args)
    """
    path = Path(transcript_path)
    if ".." in transcript_path:
        _log(f"拒绝可疑路径: {transcript_path}")
        return False, "", ""
    if not path.is_file():
        _log(f"transcript 文件不存在: {transcript_path}")
        return False, "", ""

    try:
        with open(path, "r", encoding="utf-8") as f:
            tail = list(collections.deque(f, maxlen=MAX_SCAN_LINES))
    except Exception as e:
        _log(f"读取 transcript 失败: {e}")
        return False, "", ""

    entries: list[dict] = []
    for line in tail:
        line = line.strip()
        if not line:
            continue
        try:
            entries.append(json.loads(line))
        except json.JSONDecodeError:
            continue

    start_index = 0
    for index in range(len(entries) - 1, -1, -1):
        if entries[index].get("role") == "user":
            start_index = index + 1
            break

    pending_git_ops: dict[str, str] = {}  # tool_use_id -> git_op
    last_successful_git_op = ""
    collected_commit_hashes: list[str] = []

    for entry in entries[start_index:]:
        for block in _iter_tool_blocks(entry):
            if block.get("type") == "tool_use" and block.get("name") == "Bash":
                tool_use_id = block.get("id") or block.get("tool_use_id")
                command = block.get("input", {}).get("command", "")
                git_op = extract_git_op(command)
                if git_op and tool_use_id:
                    pending_git_ops[tool_use_id] = git_op
            elif block.get("type") == "tool_result":
                tool_use_id = block.get("tool_use_id")
                if tool_use_id and tool_use_id in pending_git_ops:
                    git_op = pending_git_ops.pop(tool_use_id)
                    if _tool_result_succeeded(block):
                        last_successful_git_op = git_op
                        # 尝试从 tool_result 中提取 commit hash
                        if git_op == "commit":
                            result_text = ""
                            content = block.get("content")
                            if isinstance(content, str):
                                result_text = content
                            elif isinstance(content, list):
                                parts = []
                                for b in content:
                                    if isinstance(b, dict):
                                        parts.append(b.get("text", ""))
                                    elif isinstance(b, str):
                                        parts.append(b)
                                result_text = "\n".join(parts)
                            m = COMMIT_HASH_RE.search(result_text)
                            if m:
                                collected_commit_hashes.append(m.group(1))

    if not last_successful_git_op:
        return False, "", ""

    # 构建 diff_args
    diff_args = "--commit HEAD"
    if collected_commit_hashes:
        if len(collected_commit_hashes) > 1:
            diff_args = f"--commit {collected_commit_hashes[0]}^..{collected_commit_hashes[-1]}"
        else:
            diff_args = f"--commit {collected_commit_hashes[0]}"

    return True, last_successful_git_op, diff_args


# ---------------------------------------------------------------------------
# 配置读取
# ---------------------------------------------------------------------------


def _load_auto_scan_config(cwd: str = "") -> dict:
    """从分层配置中读取自动扫描设置。

    配置合并规则: 项目级 > 用户级 > 默认值
    - 用户级: ~/.codebuddy/security-scan/config.json
    - 项目级: {project}/.codebuddy/security-scan/config.json

    Returns:
        dict: {"enabled": bool, "scan_level": str}
    """
    _default = {"enabled": False, "scan_level": "light"}

    try:
        from _common import load_merged_config
    except ImportError as e:
        _log(f"_common 模块导入失败（可能模块不存在或有语法错误）: {e}")
        return _default
    except Exception as e:
        _log(f"_common 模块导入异常: {e}")
        return _default

    try:
        merged = load_merged_config(cwd)
    except Exception as e:
        _log(f"配置文件加载失败: {e}")
        return _default

    if not merged:
        _log("无配置文件或配置为空，使用默认值")
        return _default

    auto_scan = merged.get("auto_scan", {})
    if isinstance(auto_scan, dict) and auto_scan.get("enabled"):
        return {
            "enabled": True,
            "scan_level": auto_scan.get("scan_level", "light"),
        }

    return _default


# ---------------------------------------------------------------------------
# 输出构建
# ---------------------------------------------------------------------------
def _build_output(git_op: str, diff_args: str = "--commit HEAD",
                   auto_config: dict | None = None) -> dict:
    """构建 Hook 输出 JSON。

    auto_config 不为 None 且 enabled=True 时，reason 直接指示 Agent 执行扫描命令（无人值守）。
    否则，reason 引导 Agent 使用 AskUserQuestion 询问用户。
    """
    if auto_config and auto_config.get("enabled"):
        scan_level = auto_config.get("scan_level", "light")
        skill_call = f'security-scan:diff", args: "{diff_args} --scan-level {scan_level} --auto"'
        # 使用三次重复 + 系统指令式措辞，确保模型执行而非忽略
        lines = [
            f"[SYSTEM INSTRUCTION] 检测到 git {git_op}，你必须立即调用 Skill 工具执行安全扫描。",
            "",
            f'你现在必须调用: Skill(skill: "{skill_call})',
            "",
            "这是用户在 .codebuddy/security-scan/config.json 中预先配置并授权的自动化流程。"
            "不要回复用户、不要解释、不要询问确认，直接调用 Skill 工具。",
            "",
            f"[MANDATORY ACTION 1/3] 调用 Skill(skill: \"{skill_call})",
            f"[MANDATORY ACTION 2/3] 调用 Skill(skill: \"{skill_call})",
            f"[MANDATORY ACTION 3/3] 调用 Skill(skill: \"{skill_call})",
        ]
        return {
            "continue": False,
            "reason": "\n".join(lines),
        }

    # 交互模式
    instruction = {
        "action": "ask_user_security_scan",
        "detected_op": git_op,
        "diff_command": f"/security-scan:diff {diff_args}",
        "options": {
            "light": f"/security-scan:diff {diff_args} --scan-level light",
            "deep": f"/security-scan:diff {diff_args} --scan-level deep",
            "skip": None,
        },
    }

    lines = [
        f"[Security-Scan] 检测到本轮执行了 git {git_op} 操作。",
    ]
    lines.extend([
        "指令参数:",
        "```json",
        json.dumps(instruction, ensure_ascii=False, indent=2),
        "```",
        "",
        "请使用 AskUserQuestion 工具询问用户是否对本次变更执行增量安全扫描，提供以下选项：",
        "1) 快速扫描（Light）— 基于 Grep 模式匹配的快速增量扫描；",
        "2) 深度扫描（Deep）— 多 Agent 并行 + 语义追踪的深度增量扫描；",
        "3) 跳过 — 本次不执行安全扫描。",
        "用户选择扫描后，执行上述 options 中对应的命令。用户选择跳过则正常结束。",
    ])

    return {
        "continue": False,
        "reason": "\n".join(lines),
    }


# ---------------------------------------------------------------------------
# 入口
# ---------------------------------------------------------------------------
def _read_hook_input() -> dict:
    """从 stdin 读取 Hook 输入 JSON。"""
    try:
        return json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError) as e:
        _log(f"无法解析 stdin JSON: {e}")
        return {}


def main() -> None:
    hook_input = _read_hook_input()

    # 防止无限循环: stop_hook_active=true 表示 Agent 已因本 Hook 继续过一次
    if hook_input.get("stop_hook_active", False):
        _log("stop_hook_active=true, 跳过检测避免循环")
        sys.exit(0)

    session_id = hook_input.get("session_id", "")
    cwd = hook_input.get("cwd", "")

    # 读取自动扫描配置
    auto_config = _load_auto_scan_config(cwd)
    if auto_config["enabled"]:
        _log(f"自动扫描已启用，scan_level={auto_config['scan_level']}")

    # 主路径：从状态文件检测
    if session_id:
        found, git_op, diff_args = _detect_from_state_file(session_id)
        if found:
            _log(f"[状态文件] 检测到 git {git_op}，diff 参数: {diff_args}")
            # 仅 commit 触发扫描，push 不触发
            if git_op == "push":
                _log("push 操作不触发扫描，跳过")
                sys.exit(0)
            output = _build_output(git_op, diff_args, auto_config)
            json.dump(output, sys.stdout, ensure_ascii=False)
            sys.exit(2)
        _log("[状态文件] 无记录")

    # Fallback：扫描 transcript
    transcript_path = hook_input.get("transcript_path", "")
    if not transcript_path:
        _log("无 transcript_path，跳过")
        sys.exit(0)

    found, git_op, diff_args = _scan_transcript(transcript_path)
    if not found:
        sys.exit(0)

    _log(f"[transcript] 检测到 git {git_op}，diff 参数: {diff_args}，触发扫描提示")
    # 仅 commit 触发扫描，push 不触发
    if git_op == "push":
        _log("push 操作不触发扫描，跳过")
        sys.exit(0)
    output = _build_output(git_op, diff_args=diff_args, auto_config=auto_config)
    json.dump(output, sys.stdout, ensure_ascii=False)
    sys.exit(2)


if __name__ == "__main__":
    main()
