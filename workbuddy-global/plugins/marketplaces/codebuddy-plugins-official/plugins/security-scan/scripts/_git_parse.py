"""
共享 Git 命令解析模块。

从 shell 命令字符串中识别 git commit / push 子命令。
供 git_op_recorder.py (PostToolUse) 和 git_commit_detector.py (Stop) 复用。
"""
from __future__ import annotations

import re
import shlex

# ---------------------------------------------------------------------------
# 共享正则
# ---------------------------------------------------------------------------
# git commit 输出中的 commit hash 模式: [main abc1234] commit message
# 收紧匹配：要求方括号在行首或紧跟空白，hash 后跟 ] 前无其他 hex 字符
COMMIT_HASH_RE = re.compile(
    r"(?:^|\n)\s*\[[\w./-]+\s+([0-9a-f]{7,40})\]",
    re.MULTILINE,
)


# ---------------------------------------------------------------------------
# 常量
# ---------------------------------------------------------------------------
GIT_OPS = {"commit", "push"}
SHELL_SEPARATORS = {"&&", "||", ";", "|", "&"}
SHELL_WRAPPERS = {"bash", "sh", "zsh"}
ENV_PREFIX_RE = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*=.*$")
GIT_OPTIONS_WITH_VALUE = {
    "-C",
    "-c",
    "--exec-path",
    "--git-dir",
    "--work-tree",
    "--namespace",
    "--config-env",
}
GIT_FLAG_OPTIONS = {
    "-p",
    "-P",
    "--paginate",
    "--no-pager",
    "--no-optional-locks",
    "--literal-pathspecs",
    "--no-literal-pathspecs",
}
GIT_OPTIONS_WITH_INLINE_VALUE_PREFIXES = (
    "--exec-path=",
    "--git-dir=",
    "--work-tree=",
    "--namespace=",
    "--config-env=",
)


# ---------------------------------------------------------------------------
# 解析函数
# ---------------------------------------------------------------------------
def split_segments(tokens: list[str]) -> list[list[str]]:
    """按 shell 分隔符（&&, ||, ;, |, &）将 token 列表拆分为多个命令片段。"""
    segments: list[list[str]] = []
    current: list[str] = []

    for token in tokens:
        if token in SHELL_SEPARATORS:
            if current:
                segments.append(current)
                current = []
            continue
        current.append(token)

    if current:
        segments.append(current)

    return segments


def extract_git_op_from_segment(tokens: list[str]) -> str:
    """从单个 shell 命令片段中提取 git 子命令（commit 或 push）。"""
    if not tokens:
        return ""

    head = tokens[0]
    if head in SHELL_WRAPPERS:
        for idx, token in enumerate(tokens[1:], start=1):
            if token in {"-c", "-lc"} and idx + 1 < len(tokens):
                return extract_git_op(tokens[idx + 1])
        return ""

    if head in {"env", "command"}:
        return extract_git_op_from_segment(tokens[1:])

    index = 0
    while index < len(tokens) and ENV_PREFIX_RE.match(tokens[index]):
        index += 1

    if index >= len(tokens) or tokens[index] != "git":
        return ""

    scan_index = index + 1
    while scan_index < len(tokens):
        token = tokens[scan_index]
        if token in GIT_OPS:
            return token
        if token == "--":
            return ""
        if token in GIT_FLAG_OPTIONS:
            scan_index += 1
            continue
        if token in GIT_OPTIONS_WITH_VALUE:
            scan_index += 2
            continue
        if token.startswith("-C") and token != "-C":
            scan_index += 1
            continue
        if token.startswith("-c") and token != "-c":
            scan_index += 1
            continue
        if token.startswith(GIT_OPTIONS_WITH_INLINE_VALUE_PREFIXES):
            scan_index += 1
            continue
        return ""

    return ""


def extract_git_op(command: str) -> str:
    """从 Bash command 字符串中识别 git commit/push 子命令。

    支持链式命令（&&, ||, ;）、shell 包装（bash -c）、环境变量前缀。
    返回 "commit"、"push" 或 ""。
    """
    try:
        tokens = shlex.split(command, posix=True)
    except ValueError:
        return ""

    for segment in split_segments(tokens):
        git_op = extract_git_op_from_segment(segment)
        if git_op:
            return git_op

    return ""
