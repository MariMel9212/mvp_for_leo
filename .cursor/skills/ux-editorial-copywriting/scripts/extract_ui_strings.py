#!/usr/bin/env python3
"""
Extract Russian UI strings from locale files and frontend source code.

Part of ux-editorial-copywriting (Google Antigravity 2.0).
Zero external dependencies: uses Python 3 standard library exclusively.
"""

from __future__ import annotations

import argparse
import fnmatch
import json
import os
from pathlib import Path
import re
import sys
from typing import Any, Dict, Iterable, List, Optional

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

SUPPORTED_EXTS = {".json", ".yml", ".yaml", ".ts", ".tsx", ".js", ".jsx", ".vue", ".html"}
IGNORED_DIRS = {"node_modules", "dist", "build", "coverage", ".next", ".nuxt", ".git", ".turbo", ".agents", "__pycache__"}
IGNORED_FILES = {"package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb", "bun.lock"}
MAX_FILE_BYTES = 1_000_000
RUSSIAN_RE = re.compile(r"[А-Яа-яЁё]")
QUOTED_RE = re.compile(
    r"""(?P<quote>["'`])(?P<value>(?:\\.|(?!\1).)*?[А-Яа-яЁё].*?)(?P=quote)""",
    re.DOTALL,
)
JSX_BODY_RE = re.compile(
    r""">\s*(?P<value>[^<>{}\n\r]*?[А-Яа-яЁё][^<>{}\n\r]*?)\s*<"""
)
PROP_PREFIX_RE = re.compile(
    r"(?P<prop>[A-Za-z_][A-Za-z0-9_-]*)\s*(?:=|:)\s*(?:\{\s*)?$"
)


def is_ignored(path: Path) -> bool:
    """Check if file or any ancestor directory is in the ignore list."""
    return path.name in IGNORED_FILES or any(part in IGNORED_DIRS for part in path.parts)


def iter_files(paths: Iterable[Path], include: Optional[str]) -> Iterable[Path]:
    """Iterate over all supported files in paths, matching optional glob filter."""
    for path in paths:
        if is_ignored(path):
            continue
        if path.is_file():
            if path.suffix.lower() in SUPPORTED_EXTS and (include is None or fnmatch.fnmatch(path.name, include)):
                yield path
            continue
        if path.is_dir():
            for root, dirs, files in os.walk(path):
                root_path = Path(root)
                dirs[:] = [d for d in dirs if d not in IGNORED_DIRS]
                for name in files:
                    file_path = root_path / name
                    if is_ignored(file_path):
                        continue
                    if file_path.suffix.lower() not in SUPPORTED_EXTS:
                        continue
                    if include and not fnmatch.fnmatch(name, include):
                        continue
                    yield file_path


def line_number(text: str, offset: int) -> int:
    """Calculate 1-based line number for character offset in text."""
    return text.count("\n", 0, offset) + 1


def guess_component(key: str) -> str:
    """Heuristically deduce UI component role from translation key, JSX prop, or variable name."""
    lower = key.lower()
    checks = [
        ("button", ("button", "btn", "cta", "action")),
        ("error", ("error", "errortext", "fail", "failure", "exception")),
        ("placeholder", ("placeholder", "hinttext")),
        ("label", ("fieldlabel", "aria-label", "aria_label", "label")),
        ("tooltip", ("tooltip",)),
        ("hint", ("hint", "helper", "helpertext", "description")),
        ("alert", ("alert", "banner", "notification", "toast", "snackbar")),
        ("legal", ("legal", "agreement", "consent", "terms", "policy")),
        ("heading", ("title", "heading", "header", "h1", "h2", "h3", "h4", "h5", "h6")),
        ("link", ("link", "url", "href")),
        ("empty_state", ("empty", "notfound", "noitems", "zero_results")),
        ("loading_state", ("loading", "loader", "progress")),
        ("image_alt", ("alt",)),
        ("badge", ("badge", "status", "tag", "chip")),
    ]
    for component, markers in checks:
        if any(marker in lower for marker in markers):
            return component
    return "unknown_ui_string"


def add_item(
    items: List[Dict[str, Any]],
    path: Path,
    key: str,
    value: str,
    line: int,
    source_type: str,
) -> None:
    """Register extracted UI text item if it contains Russian characters."""
    cleaned = value.strip()
    if not cleaned or not RUSSIAN_RE.search(cleaned):
        return
    items.append(
        {
            "file": str(path),
            "key": key,
            "value": cleaned,
            "line": line,
            "component_guess": guess_component(key),
            "source_type": source_type,
        }
    )


def extract_json(path: Path, text: str) -> List[Dict[str, Any]]:
    """Extract nested Russian strings from a parsed JSON dictionary."""
    items: List[Dict[str, Any]] = []
    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        return extract_regex(path, text, "json")

    def walk(value: Any, key_path: List[str]) -> None:
        if isinstance(value, dict):
            for key, child in value.items():
                walk(child, key_path + [str(key)])
        elif isinstance(value, list):
            for index, child in enumerate(value):
                walk(child, key_path + [str(index)])
        elif isinstance(value, str):
            key = ".".join(key_path)
            encoded = json.dumps(value, ensure_ascii=False)
            offset = text.find(encoded)
            add_item(items, path, key, value, line_number(text, max(offset, 0)), "json")

    walk(data, [])
    return items


def extract_yaml_like(path: Path, text: str) -> List[Dict[str, Any]]:
    """Extract nested Russian strings from YAML/YML files via indentation stack."""
    items: List[Dict[str, Any]] = []
    pattern = re.compile(r"^(?P<indent>\s*)(?P<key>[\w.-]+)\s*:\s*(?P<value>.+?)\s*$")
    stack: List[tuple[int, str]] = []
    for idx, line in enumerate(text.splitlines(), start=1):
        match = pattern.match(line)
        if not match:
            continue
        indent = len(match.group("indent"))
        key = match.group("key")
        value = match.group("value").strip().strip("\"'")
        while stack and stack[-1][0] >= indent:
            stack.pop()
        full_key = ".".join([part for _, part in stack] + [key])
        if value and value not in {"|", ">"}:
            add_item(items, path, full_key, value, idx, "yaml")
        else:
            stack.append((indent, key))
    return items


_JS_UNICODE_ESCAPE_RE = re.compile(r"\\u([0-9a-fA-F]{4})|\\x([0-9a-fA-F]{2})|\\([nrtbfv\\'\"0])")
_JS_SIMPLE_ESCAPES = {
    "n": "\n",
    "r": "\r",
    "t": "\t",
    "b": "\b",
    "f": "\f",
    "v": "\v",
    "\\": "\\",
    "'": "'",
    '"': '"',
    "0": "\0",
}


def decode_js_string(value: str) -> str:
    """Safely decode escape sequences in JavaScript/TypeScript strings without corrupting non-ASCII UTF-8."""
    if "\\" not in value:
        return value

    def _repl(match: re.Match[str]) -> str:
        u_hex, x_hex, simple = match.group(1), match.group(2), match.group(3)
        if u_hex is not None:
            return chr(int(u_hex, 16))
        if x_hex is not None:
            return chr(int(x_hex, 16))
        return _JS_SIMPLE_ESCAPES.get(simple, simple)

    return _JS_UNICODE_ESCAPE_RE.sub(_repl, value)


def extract_regex(path: Path, text: str, source_type: str) -> List[Dict[str, Any]]:
    """Extract quoted string literals and JSX body text containing Cyrillic characters."""
    items: List[Dict[str, Any]] = []
    seen_spans = set()

    # 1. Quoted literals (preserving preceding JSX prop / object key / variable identifier when present)
    for index, match in enumerate(QUOTED_RE.finditer(text), start=1):
        span = match.span()
        seen_spans.add(span)
        value = decode_js_string(match.group("value"))
        prefix = text[max(0, match.start() - 80):match.start()]
        prop_match = PROP_PREFIX_RE.search(prefix)
        key_name = f"{prop_match.group('prop')}_{index}" if prop_match else f"inline_{index}"
        add_item(
            items,
            path,
            key_name,
            value,
            line_number(text, match.start()),
            source_type,
        )

    # 2. JSX / HTML tag bodies for frontend files
    if source_type in {"tsx", "jsx", "vue", "html", "js", "ts"}:
        jsx_count = 0
        for match in JSX_BODY_RE.finditer(text):
            val_start = match.start("value")
            val_end = match.end("value")
            # Skip if inside an already seen quoted span
            if any(s <= val_start and val_end <= e for s, e in seen_spans):
                continue
            jsx_count += 1
            value = match.group("value").strip()
            # Try to look behind for tag name, e.g. <button ...>
            prefix = text[max(0, match.start() - 100):match.start() + 1]
            tag_match = re.search(r"<([A-Za-z0-9_]+)[^>]*>$", prefix)
            key_name = f"jsx_{tag_match.group(1).lower()}_{jsx_count}" if tag_match else f"jsx_{jsx_count}"
            add_item(
                items,
                path,
                key_name,
                value,
                line_number(text, val_start),
                source_type,
            )

    return items


def extract_file(path: Path) -> List[Dict[str, Any]]:
    """Extract UI strings from a single file based on extension."""
    try:
        if path.stat().st_size > MAX_FILE_BYTES:
            return []
        text = path.read_text(encoding="utf-8-sig")
    except UnicodeDecodeError:
        text = path.read_text(encoding="utf-8-sig", errors="replace")

    suffix = path.suffix.lower()
    if suffix == ".json":
        return extract_json(path, text)
    if suffix in {".yml", ".yaml"}:
        return extract_yaml_like(path, text)
    return extract_regex(path, text, suffix.lstrip("."))


def format_md(items: List[Dict[str, Any]]) -> str:
    """Format extracted items as a GitHub Flavored Markdown table."""
    lines = ["| File | Line | Key | Component | Value |", "|---|---:|---|---|---|"]
    for item in items:
        value = str(item["value"]).replace("|", "\\|").replace("\n", " ")
        lines.append(f"| {item['file']} | {item['line']} | {item['key']} | {item['component_guess']} | {value} |")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", nargs="*", type=Path, help="Paths to files or directories to scan")
    parser.add_argument("--target", type=Path, default=None, help="Named target file or directory to scan")
    parser.add_argument("--workspace", type=Path, default=None, help="Workspace root directory for resolving relative paths")
    parser.add_argument("--include", help="Filename glob filter, e.g. '*.tsx'")
    parser.add_argument(
        "--format",
        choices=("text", "json", "md", "summary"),
        default="json",
        help="Output format: json (default), summary (<= 50 tokens JSON), md (markdown table), or text",
    )
    parser.add_argument("--compact", action="store_true", help="Emit single-line compact JSON")
    args = parser.parse_args()

    workspace_dir = args.workspace.resolve() if args.workspace else Path.cwd().resolve()
    raw_paths: List[Path] = list(args.paths or [])
    if args.target is not None:
        raw_paths.append(args.target)
    if not raw_paths:
        raw_paths = [workspace_dir]

    resolved_paths: List[Path] = []
    for p in raw_paths:
        if p.is_absolute():
            resolved_paths.append(p.resolve())
        elif (workspace_dir / p).exists():
            resolved_paths.append((workspace_dir / p).resolve())
        else:
            resolved_paths.append(p.resolve())

    items: List[Dict[str, Any]] = []
    for file_path in iter_files(resolved_paths, args.include):
        items.extend(extract_file(file_path))

    if args.format == "summary":
        summary = {"status": "ok", "extracted_count": len(items), "files": len({i["file"] for i in items})}
        print(json.dumps(summary, separators=(",", ":"), ensure_ascii=False))
    elif args.format == "json":
        if args.compact:
            print(json.dumps(items, separators=(",", ":"), ensure_ascii=False))
        else:
            print(json.dumps(items, ensure_ascii=False, indent=2))
    elif args.format == "md":
        print(format_md(items))
    else:
        for item in items:
            print(f"{item['file']}:{item['line']} {item['key']} [{item['component_guess']}] {item['value']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
