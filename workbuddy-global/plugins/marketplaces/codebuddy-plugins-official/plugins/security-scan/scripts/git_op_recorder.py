#!/usr/bin/env python3
"""
PostToolUse Hook: 每次 Bash 执行后检测是否为成功的 git commit/push，
将操作记录追加到会话级状态文件，供 Stop Hook 读取。

触发方式: hooks/hooks.json > PostToolUse > matcher: Bash
输入: stdin JSON (包含 tool_input, tool_response 等)
输出: 无 stdout (PostToolUse 不阻塞)

退出码:
  0 - 始终正常退出，不阻塞工具执行
"""
from __future__ import annotations

import json
import os
import re
import sys
import time
from pathlib import Path

try:
    import fcntl
except ImportError:
    fcntl = None  # Windows: 无文件锁，仍可正常写入

# 共享解析模块
sys.path.insert(0, str(Path(__file__).resolve().parent))
from _git_parse import extract_git_op, COMMIT_HASH_RE

# ---------------------------------------------------------------------------
# 日志
# ---------------------------------------------------------------------------
_PREFIX = "git-recorder"


def _log(msg: str) -> None:
    print(f"[{_PREFIX}] {msg}", file=sys.stderr)


# ---------------------------------------------------------------------------
# 状态文件路径
# ---------------------------------------------------------------------------
_STATE_DIR = Path(os.environ.get("TMPDIR", "/tmp"))

# git push 输出中的 push range 模式: abc1234..def5678
_PUSH_RANGE_RE = re.compile(r"([0-9a-f]{7,40})\.\.([0-9a-f]{7,40})")


def _state_file_path(session_id: str) -> Path:
    """获取会话级状态文件路径。"""
    safe_id = re.sub(r"[^a-zA-Z0-9_-]", "_", session_id)
    return _STATE_DIR / f"security-scan-git-ops-{safe_id}.jsonl"


# ---------------------------------------------------------------------------
# 解析 tool_response
# ---------------------------------------------------------------------------
def _extract_response_text(tool_response: object) -> str:
    """从 tool_response 中提取文本内容。"""
    if isinstance(tool_response, str):
        return tool_response
    if isinstance(tool_response, dict):
        parts = []

        def _append_text(value: object) -> None:
            if isinstance(value, str) and value and value not in parts:
                parts.append(value)

        # 优先处理 content
        content = tool_response.get("content")
        if isinstance(content, str):
            _append_text(content)
        elif isinstance(content, list):
            content_parts = []
            for block in content:
                if isinstance(block, dict):
                    text = block.get("text", "")
                    if text:
                        content_parts.append(text)
                elif isinstance(block, str):
                    content_parts.append(block)
            _append_text("\n".join(content_parts))

        # 其他常见字段，包含 git push 常见的 stderr 输出
        for key in ("output", "stdout", "stderr", "result"):
            _append_text(tool_response.get(key))

        return "\n".join(parts)
    return ""


# git commit 成功输出特征: [branch hash] message
_COMMIT_SUCCESS_RE = re.compile(r"\[\S+\s+[0-9a-f]{7,40}\]")
# git push 成功输出特征: hash..hash 或 "-> branch"
_PUSH_SUCCESS_RE = re.compile(
    r"[0-9a-f]{7,40}\.\.[0-9a-f]{7,40}|->\s+\S+"
)


def _response_succeeded(tool_response: object, git_op: str = "") -> bool:
    """判断 tool_response 是否表示命令执行成功。

    对 dict 类型：优先检查 is_error / exit_code / success 等结构化字段。
    对 str 类型：通过 git 输出特征判断（平台可能直接返回 stdout 文本）。
    """
    if isinstance(tool_response, str):
        # 平台直接返回 stdout 文本的情况，通过输出特征判断
        if git_op == "commit":
            return bool(_COMMIT_SUCCESS_RE.search(tool_response))
        if git_op == "push":
            return bool(_PUSH_SUCCESS_RE.search(tool_response))
        # 未知 op 或无特征，保守认为失败
        return False
    if not isinstance(tool_response, dict):
        return False
    if tool_response.get("is_error") is True:
        return False
    # 检查 exit_code
    exit_code = tool_response.get("exit_code")
    if exit_code is not None:
        return exit_code == 0
    metadata = tool_response.get("metadata")
    if isinstance(metadata, dict):
        ec = metadata.get("exit_code")
        if ec is not None:
            return ec == 0
    # 检查 success 字段
    success = tool_response.get("success")
    if success is not None:
        return bool(success)
    # 无结构化状态字段时，回退到文本特征判断
    response_text = _extract_response_text(tool_response)
    if response_text and git_op:
        if git_op == "commit":
            return bool(_COMMIT_SUCCESS_RE.search(response_text))
        if git_op == "push":
            return bool(_PUSH_SUCCESS_RE.search(response_text))
    # dict 但无任何状态字段时，保守认为成功（平台通常会提供 exit_code）
    return True


def _extract_commit_hash(response_text: str) -> str:
    """从 git commit 输出中提取 commit hash。"""
    match = COMMIT_HASH_RE.search(response_text)
    return match.group(1) if match else ""


def _extract_push_range(response_text: str) -> list[str]:
    """从 git push 输出中提取 push range [base, head]。"""
    match = _PUSH_RANGE_RE.search(response_text)
    if match:
        return [match.group(1), match.group(2)]
    return []


# ---------------------------------------------------------------------------
# 状态文件写入
# ---------------------------------------------------------------------------
def _append_record(state_path: Path, record: dict) -> None:
    """追加一条记录到状态文件（带文件锁）。"""
    try:
        state_path.parent.mkdir(parents=True, exist_ok=True)
        with open(state_path, "a", encoding="utf-8") as f:
            if fcntl is not None:
                fcntl.flock(f.fileno(), fcntl.LOCK_EX)
            try:
                f.write(json.dumps(record, ensure_ascii=False) + "\n")
            finally:
                if fcntl is not None:
                    fcntl.flock(f.fileno(), fcntl.LOCK_UN)
    except Exception as e:
        _log(f"写入状态文件失败: {e}")


# ---------------------------------------------------------------------------
# 主逻辑
# ---------------------------------------------------------------------------
def process_hook_input(hook_input: dict) -> None:
    """处理 PostToolUse Hook 输入，检测并记录 git 操作。"""
    session_id = hook_input.get("session_id", "")
    if not session_id:
        _log("无 session_id，跳过")
        return

    # 提取命令
    tool_input = hook_input.get("tool_input", {})
    command = ""
    if isinstance(tool_input, dict):
        command = tool_input.get("command", "")
    if not command:
        return

    # 检测 git 操作（仅记录 commit，push 不触发扫描）
    git_op = extract_git_op(command)
    if not git_op or git_op == "push":
        return

    # 检查是否成功
    tool_response = hook_input.get("tool_response", {})
    if not _response_succeeded(tool_response, git_op):
        _log(f"git {git_op} 执行失败，跳过记录")
        return

    # 构建记录
    response_text = _extract_response_text(tool_response)
    record: dict = {
        "op": git_op,
        "timestamp": time.time(),
    }

    if git_op == "commit":
        commit_hash = _extract_commit_hash(response_text)
        if commit_hash:
            record["commit_hash"] = commit_hash
    elif git_op == "push":
        push_range = _extract_push_range(response_text)
        if push_range:
            record["push_range"] = push_range

    # 写入状态文件
    state_path = _state_file_path(session_id)
    _append_record(state_path, record)
    _log(f"记录 git {git_op}: {record}")


def main() -> None:
    try:
        hook_input = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError) as e:
        _log(f"无法解析 stdin JSON: {e}")
        sys.exit(0)

    process_hook_input(hook_input)
    sys.exit(0)


if __name__ == "__main__":
    main()
