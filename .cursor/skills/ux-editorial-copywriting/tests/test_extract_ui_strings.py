#!/usr/bin/env python3
"""
Unit tests for extract_ui_strings.py (Google Antigravity 2.0).
"""

import json
import os
from pathlib import Path
import sys
import tempfile
import unittest

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

SCRIPTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "scripts"))
if SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, SCRIPTS_DIR)

from extract_ui_strings import (
    extract_file,
    guess_component,
    format_md,
    is_ignored,
)


class TestExtractUiStrings(unittest.TestCase):
    def test_guess_component(self):
        self.assertEqual(guess_component("auth.submit_button"), "button")
        self.assertEqual(guess_component("billing.cta_action"), "button")
        self.assertEqual(guess_component("network.timeout_error"), "error")
        self.assertEqual(guess_component("form.email_placeholder"), "placeholder")
        self.assertEqual(guess_component("form.name_fieldlabel"), "label")
        self.assertEqual(guess_component("notification.toast_alert"), "alert")
        self.assertEqual(guess_component("footer.privacy_policy"), "legal")
        self.assertEqual(guess_component("header.main_title"), "heading")
        self.assertEqual(guess_component("nav.docs_link"), "link")
        self.assertEqual(guess_component("search.noitems_found"), "empty_state")
        self.assertEqual(guess_component("app.spinner_loader"), "loading_state")
        self.assertEqual(guess_component("some_random_key"), "unknown_ui_string")

    def test_is_ignored(self):
        self.assertTrue(is_ignored(Path("node_modules/pkg/index.js")))
        self.assertTrue(is_ignored(Path("dist/bundle.js")))
        self.assertTrue(is_ignored(Path(".next/static/app.js")))
        self.assertTrue(is_ignored(Path("package-lock.json")))
        self.assertTrue(is_ignored(Path("yarn.lock")))
        self.assertFalse(is_ignored(Path("src/components/Button.tsx")))
        self.assertFalse(is_ignored(Path("locales/ru.json")))

    def test_extract_json(self):
        with tempfile.NamedTemporaryFile("w", suffix=".json", encoding="utf-8", delete=False) as f:
            data = {
                "common": {
                    "save_btn": "Сохранить",
                    "cancel_btn": "Отмена"
                },
                "errors": {
                    "not_found": "Страница не найдена"
                },
                "english_only": "English text without cyrillic"
            }
            json.dump(data, f, ensure_ascii=False)
            tmp_path = Path(f.name)

        try:
            items = extract_file(tmp_path)
            self.assertEqual(len(items), 3)
            keys = {item["key"] for item in items}
            self.assertEqual(keys, {"common.save_btn", "common.cancel_btn", "errors.not_found"})
            components = {item["key"]: item["component_guess"] for item in items}
            self.assertEqual(components["common.save_btn"], "button")
            self.assertEqual(components["errors.not_found"], "error")
        finally:
            tmp_path.unlink(missing_ok=True)

    def test_extract_yaml(self):
        content = """
auth:
  login_button: Войти
  signup_title: Создать аккаунт
english_key: Hello World
"""
        with tempfile.NamedTemporaryFile("w", suffix=".yml", encoding="utf-8", delete=False) as f:
            f.write(content)
            tmp_path = Path(f.name)

        try:
            items = extract_file(tmp_path)
            self.assertEqual(len(items), 2)
            values = {item["value"] for item in items}
            self.assertIn("Войти", values)
            self.assertIn("Создать аккаунт", values)
        finally:
            tmp_path.unlink(missing_ok=True)

    def test_extract_tsx(self):
        content = """
export function Header() {
    return (
        <div>
            <h1>Личный кабинет</h1>
            <button onClick={() => alert('ok')}>Выйти</button>
        </div>
    );
}
"""
        with tempfile.NamedTemporaryFile("w", suffix=".tsx", encoding="utf-8", delete=False) as f:
            f.write(content)
            tmp_path = Path(f.name)

        try:
            items = extract_file(tmp_path)
            self.assertEqual(len(items), 2)
            values = [item["value"] for item in items]
            self.assertIn("Личный кабинет", values)
            self.assertIn("Выйти", values)
        finally:
            tmp_path.unlink(missing_ok=True)

    def test_extract_tsx_with_unicode_escapes(self):
        content = """
export function PaymentCard() {
    const label = "Оплатить\\u00A04 990 ₽";
    const qr = "Отсканируйте QR\\u2011код\\nдля входа";
    return <button title={label}>{qr}</button>;
}
"""
        with tempfile.NamedTemporaryFile("w", suffix=".tsx", encoding="utf-8", delete=False) as f:
            f.write(content)
            tmp_path = Path(f.name)

        try:
            items = extract_file(tmp_path)
            self.assertEqual(len(items), 2)
            values = [item["value"] for item in items]
            self.assertIn("Оплатить\u00A04 990 ₽", values)
            self.assertIn("Отсканируйте QR\u2011код\nдля входа", values)
        finally:
            tmp_path.unlink(missing_ok=True)

    def test_format_md(self):
        items = [
            {
                "file": "src/App.tsx",
                "line": 12,
                "key": "inline_1",
                "component_guess": "button",
                "value": "Сохранить",
            }
        ]
        md = format_md(items)
        self.assertIn("| File | Line | Key | Component | Value |", md)
        self.assertIn("| src/App.tsx | 12 | inline_1 | button | Сохранить |", md)

    def test_extract_jsx_props_and_html(self):
        content = """
export function LoginForm() {
    return (
        <form>
            <Input
                label="Номер телефона"
                placeholder="+7 999 000-00-00"
                helperText="Пришлем код в СМС"
                errorText="Неверный код подтверждения"
                aria-label="Поле ввода телефона"
            />
            <img src="/logo.svg" alt="Логотип компании" />
        </form>
    );
}
"""
        with tempfile.NamedTemporaryFile("w", suffix=".tsx", encoding="utf-8", delete=False) as f:
            f.write(content)
            tmp_path = Path(f.name)

        try:
            items = extract_file(tmp_path)
            by_val = {item["value"]: item["component_guess"] for item in items}
            self.assertEqual(by_val.get("Номер телефона"), "label")
            self.assertEqual(by_val.get("Пришлем код в СМС"), "hint")
            self.assertEqual(by_val.get("Неверный код подтверждения"), "error")
            self.assertEqual(by_val.get("Поле ввода телефона"), "label")
            self.assertEqual(by_val.get("Логотип компании"), "image_alt")
        finally:
            tmp_path.unlink(missing_ok=True)


if __name__ == "__main__":
    unittest.main()
