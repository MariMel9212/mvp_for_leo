"""
Unit and integration tests for audit_copy.py (2026 BigTech Edition).
Verifies PASS (0), FAIL (1), and CLI execution across banned stubs,
concise 1-word action exceptions, AI slop, error messages, prepositional knots,
redundant adverbs, and typography.
Compatible with standard unittest runner and direct execution.
"""

import subprocess
import sys
import os
import tempfile
import unittest

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

SCRIPTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "scripts"))
if SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, SCRIPTS_DIR)

from audit_copy import check_copy_file

SCRIPT_PATH = os.path.join(SCRIPTS_DIR, "audit_copy.py")

def run_linter(target: str, extra_args: list[str] | None = None) -> subprocess.CompletedProcess:
    cmd = [sys.executable, SCRIPT_PATH, target]
    if extra_args:
        cmd.extend(extra_args)
    return subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        encoding="utf-8"
    )

def lint_snippet(content: str) -> list[str]:
    with tempfile.NamedTemporaryFile("w", suffix=".md", delete=False, encoding="utf-8") as f:
        f.write(content)
        f_path = f.name
    try:
        return check_copy_file(f_path)
    finally:
        if os.path.exists(f_path):
            os.remove(f_path)


class TestAuditCopy(unittest.TestCase):

    def test_banned_stubs(self):
        banned_samples = [
            "[Далее]",
            "[Подтвердить]",
            "[Ок]",
            "[OK]",
            "[Купить]",
            "[Submit]",
            "[Next]",
            "[Click here]",
            "[Кликните сюда]",
            "[Нажмите здесь]",
            "<button>Далее</button>",
            "<button>Submit</button>",
            "<button>Купить</button>",
            "<button>Next</button>",
            "«Далее»",
            "«Подтвердить»",
            "«Ок»",
            "«Купить»",
            "«Submit»",
            "«Next»",
            "Кнопка «Далее» ведет на следующий экран",
            "[Далее] [Подтвердить]",
            "<div>Подтвердить</div>",
            "Primary button: Далее",
            "Action: Подтвердить",
            "CTA: Submit",
            "* «Далее»",
            "- [Подтвердить]",
            "| Action | Submit |",
            "| Кнопка | Далее |",
            "* Далее",
            "- Подтвердить",
            "1. Ок",
            "“Submit”",
            "‘Next’",
            "„Купить“",
        ]
        for stub in banned_samples:
            violations = lint_snippet(f"# Component Card\n\nPlease interact with this button:\n{stub}\n")
            self.assertTrue(len(violations) > 0, f"Expected {stub} to FAIL audit, but got no violations.")
            self.assertTrue(any("Banned vague CTA" in v for v in violations), f"Expected CTA message for {stub}, got: {violations}")

    def test_allowed_concise_actions(self):
        allowed_samples = [
            "[Сохранить]",
            "[Отмена]",
            "[Войти]",
            "[Закрыть]",
            "[Назад]",
            "[Удалить]",
            "[Продолжить]",
            "[Save]",
            "[Cancel]",
            "[Close]",
            "[Back]",
            "[Delete]",
            "[Continue]",
            "<button>Сохранить</button>",
            "<button>Отмена</button>",
            "<button>Save</button>",
            "<button>Cancel</button>",
            "<button>Continue</button>",
            "<button>Продолжить</button>",
            "«Сохранить»",
            "«Отмена»",
            "«Войти»",
            "«Закрыть»",
            "«Назад»",
            "«Удалить»",
            "«Продолжить»",
            "“Save”",
            "| Save | Cancel |",
            "| Сохранить | Отмена |",
        ]
        for action in allowed_samples:
            violations = lint_snippet(f"# Settings Dialog\n\nDialog action button:\n{action}\n")
            self.assertEqual(len(violations), 0, f"Expected concise action {action} to PASS audit, got: {violations}")

    def test_standard_two_word_ctas(self):
        compliant_samples = [
            "[Оплатить 4 990 ₽]",
            "[Экспортировать CSV (1.4 МБ)]",
            "[Создать проект]",
            "[Удалить проект]",
            "[Отправить приглашение]",
            "[Save changes]",
            "[Pay $49.00]",
            "[Export report]",
            "[Discard draft]",
            "[Купить 3 билета]",
            "[Submit payment]",
            "«Оплатить 4 990 ₽»",
            "When users submit their answers, the form validates them.",
            "In the next section, we describe the architecture.",
            "Пользователь может купить подписку в&nbsp;любой момент.",
            "Нажмите кнопку, чтобы подтвердить адрес электронной почты.",
        ]
        for cta in compliant_samples:
            violations = lint_snippet(f"# Checkout Screen\n\nAction trigger:\n{cta}\n")
            self.assertEqual(len(violations), 0, f"Expected compliant CTA {cta} to PASS audit, got: {violations}")

    def test_ai_slop_detection(self):
        slop_samples = [
            "Our revolutionary platform supercharges your workflow.",
            "Мы создали инновационный сервис для вашего бизнеса.",
            "Experience the magical and seamless integration.",
        ]
        for slop in slop_samples:
            violations = lint_snippet(f"# Feature Overview\n\n{slop}\n")
            self.assertTrue(len(violations) > 0, f"Expected AI slop '{slop}' to FAIL, but passed.")

    def test_error_message_recovery(self):
        bad_err = lint_snippet("# Profile Editor\n\nSomething went wrong during update.\n")
        self.assertTrue(len(bad_err) > 0, "Expected incomplete error to FAIL.")

        good_err = lint_snippet("# Profile Editor\n\nFailed to save profile changes. Server connection timed out. Check connection and retry.\n")
        self.assertEqual(len(good_err), 0, f"Expected compliant 3-part error to PASS, got: {good_err}")

        colon_good = lint_snippet("# Profile Editor\n\nНе удалось сохранить изменения: пропал интернет. Проверьте сеть и&nbsp;нажмите «Повторить».\n")
        self.assertEqual(len(colon_good), 0, f"Expected colon-linked error to PASS, got: {colon_good}")

    def test_button_period_checks(self):
        bad_btn = lint_snippet("# Settings\n\n[Save changes.]\n")
        self.assertTrue(len(bad_btn) > 0, "Expected button with trailing period to FAIL.")

        good_btn = lint_snippet("# Settings\n\n[Save changes]\n")
        self.assertEqual(len(good_btn), 0, f"Expected button without trailing period to PASS, got: {good_btn}")

    def test_bureaucratic_nominalization(self):
        bad_samples = [
            "# Настройки системы\n\nПроизвести оплату заказа можно в&nbsp;личном кабинете.\n",
            "# Биллинг\n\nПроизвести расчет стоимости подписки.\n",
            "# Аккаунт\n\nОсуществить вход по номеру телефона.\n",
            "# Заказ\n\nСовершить операцию перевода баллов.\n",
            "# Описание\n\nДанный функционал доступен на тарифе Pro.\n",
            "# Загрузка\n\nПожалуйста, подождите завершения операции.\n",
        ]
        for bad in bad_samples:
            violations = lint_snippet(bad)
            self.assertTrue(len(violations) > 0, f"Expected bureaucratic phrasing in '{bad.strip()}' to FAIL.")
            self.assertTrue(any("Bureaucratic verbal noun" in v for v in violations))

    def test_prepositional_knots(self):
        bad_samples = [
            "# Бэкапы\n\nНастройте расписание для предотвращения потери данных.\n",
            "# Профиль\n\nПерейдите по ссылке для подтверждения почты.\n",
            "# Акция\n\nИспользуйте промокод для получения скидки.\n",
            "# Корзина\n\nНажмите кнопку для оформления заказа.\n",
            "# Настройки\n\nОткройте раздел для изменения пароля.\n",
            "# Репозиторий\n\nСоздайте проект для синхронизации репозиториев.\n",
            "# Документ\n\nОткройте карточку для редактирования параметров.\n",
        ]
        for bad in bad_samples:
            violations = lint_snippet(bad)
            self.assertTrue(len(violations) > 0, f"Expected prepositional knot in '{bad.strip()}' to FAIL.")
            self.assertTrue(any("prepositional knot" in v for v in violations))

        good_sample = "# Бэкапы\n\nНастройте расписание, чтобы не потерять данные.\n"
        self.assertEqual(len(lint_snippet(good_sample)), 0, "Expected 'чтобы не потерять' to PASS.")

    def test_redundant_adverb_uspeshno(self):
        bad_samples = [
            "# Платеж\n\nПлатеж успешно оплачен в&nbsp;банке.\n",
            "# Буфер\n\nТекст успешно скопирован в&nbsp;буфер обмена.\n",
            "# Корзина\n\nТовар успешно добавлен в&nbsp;список покупок.\n",
            "# Промокод\n\nКупон успешно применен к&nbsp;заказу.\n",
            "# Доступ\n\nТариф успешно активирован в&nbsp;профиле.\n",
        ]
        for bad in bad_samples:
            violations = lint_snippet(bad)
            self.assertTrue(len(violations) > 0, f"Expected redundant 'успешно' in '{bad.strip()}' to FAIL.")
            self.assertTrue(any("успешно" in v for v in violations))

        good_sample = "# Платеж\n\nПлатеж отправлен в&nbsp;банк.\n"
        self.assertEqual(len(lint_snippet(good_sample)), 0, "Expected clean state to PASS.")

    def test_cardinal_number_suffixes(self):
        bad_sample = "# Сроки\n\nДоставка займет в&nbsp;течение 2-х дней с&nbsp;момента заказа.\n"
        violations = lint_snippet(bad_sample)
        self.assertTrue(len(violations) > 0, "Expected '2-х дней' to FAIL.")

        good_sample = "# Сроки\n\nДоставка займет 2 дня с&nbsp;момента заказа.\n"
        self.assertEqual(len(lint_snippet(good_sample)), 0, "Expected '2 дня' to PASS.")

    def test_ai_tells_and_cliches(self):
        ai_tells_samples = [
            "# Обзор\n\nВ современном мире цифровых технологий все меняется слишком быстро.\n",
            "# Обзор\n\nНе секрет, что дизайн играет ключевую роль в&nbsp;успехе любого продукта.\n",
            "# Обзор\n\nЭто не просто плагин, а экосистема для работы с&nbsp;токенами.\n",
            "# Case Study\n\nLet us delve into the rich tapestry of modern software architecture.\n",
            "# Выводы\n\nТаким образом, данный проект стал важным шагом вперед.\n",
        ]
        for sample in ai_tells_samples:
            violations = lint_snippet(sample)
            self.assertTrue(len(violations) > 0, f"Expected AI tell to FAIL audit, got: {violations}")

    def test_emoji_bullet_slop(self):
        bad_bullets = "# Features\n\n- 🚀 Быстрая скорость обработки\n- 💡 Умные подсказки\n- 🎯 Точный результат\n"
        violations = lint_snippet(bad_bullets)
        self.assertTrue(len(violations) > 0, "Expected emoji bullets to FAIL audit.")
        self.assertTrue(any("decorative emoji" in v for v in violations))

    def test_sentence_rhythm_burstiness(self):
        monotone_text = (
            "# Архитектура\n\n"
            "Мы разработали новую архитектуру для управления всеми пользовательскими данными внутри нашего сервиса доставки.\n\n"
            "Все модули системы взаимодействуют между собой через надежные очереди сообщений с гарантированной доставкой пакетов.\n\n"
            "Каждый отдельный компонент интерфейса проходит автоматическое тестирование перед каждым развертыванием новой версии системы.\n\n"
            "Команда инженеров регулярно проводит совместное ревью кода для поддержания единых стандартов качества реализации.\n\n"
            "Пользователи сервиса получают мгновенные уведомления о статусе выполнения своих заказов прямо на экран смартфона.\n"
        )
        bad_rhythm = lint_snippet(monotone_text)
        self.assertTrue(len(bad_rhythm) > 0, "Expected monotone text to FAIL rhythm check.")

        dynamic_text = (
            "# Архитектура чекаута\n\n"
            "Конверсия внезапно встала.\n\n"
            "Мы переписали весь флоу оформления заказа, объединили четыре запутанных шага в&nbsp;один компактный экран и&nbsp;вынесли расчет доставки в&nbsp;фоновый процесс.\n\n"
            "На тестах шесть из восьми пользователей завершили оплату быстрее минуты.\n\n"
            "Это сработало.\n\n"
            "Отказы на шаге оплаты упали с&nbsp;18.4% до 11.2% уже в&nbsp;первую неделю после релиза.\n"
        )
        good_rhythm = lint_snippet(dynamic_text)
        self.assertEqual(len(good_rhythm), 0, f"Expected dynamic burstiness text to PASS, got: {good_rhythm}")

    def test_reference_doc_guard(self):
        ref_content = "> **Skill guard** — internal reference documentation for ux-editorial-copywriting.\n\n# Reference Spec\n\n[Купить]\n[Submit]\nrevolutionary\n"
        with tempfile.NamedTemporaryFile("w", suffix=".md", delete=False, encoding="utf-8") as f:
            f.write(ref_content)
            ref_file = f.name
        try:
            # Default Token-Sanitized JSON mode
            res_json = run_linter(ref_file)
            self.assertEqual(res_json.returncode, 0, f"Expected reference doc to be SKIPPED (code 0). Output:\n{res_json.stdout}")
            self.assertTrue('"status":"ok"' in res_json.stdout or '"skipped":1' in res_json.stdout)

            # Explicit human text mode
            res_text = run_linter(ref_file, extra_args=["--format", "text"])
            self.assertEqual(res_text.returncode, 0)
            self.assertTrue("SKIP" in res_text.stdout)
        finally:
            if os.path.exists(ref_file):
                os.remove(ref_file)

    def test_real_spec_with_title_is_audited(self):
        spec_content = "# UX Editorial & Copywriting Specification: Mobile Checkout\n\nOur revolutionary platform elevates your experience.\n"
        with tempfile.NamedTemporaryFile("w", suffix=".md", delete=False, encoding="utf-8") as f:
            f.write(spec_content)
            spec_file = f.name
        try:
            res = run_linter(spec_file)
            self.assertEqual(res.returncode, 1, f"Expected real spec with slop to FAIL, got {res.returncode}.")
            self.assertTrue('"status":"error"' in res.stdout)
        finally:
            if os.path.exists(spec_file):
                os.remove(spec_file)

    def test_decorative_emojis(self):
        bad_samples = [
            "## ✨ Ключевые результаты\n",
            "<button>✨ Сгенерировать отчет</button>\n",
            "[🚀 Запустить проект]\n",
            "Наш сервис работает со скоростью ⚡ молнии.\n",
            "### 💡 Подсказка для пользователя\n",
        ]
        for bad in bad_samples:
            violations = lint_snippet(f"# Feature Card\n\n{bad}\n")
            self.assertTrue(len(violations) > 0, f"Expected decorative emoji in '{bad.strip()}' to FAIL.")

        clean_sample = "# Результаты внедрения\n\n[Запустить проект]\n\nНастройки применились.\n"
        clean_violations = lint_snippet(clean_sample)
        self.assertEqual(len(clean_violations), 0, f"Expected clean copy to PASS, got: {clean_violations}")

    def test_bilingual_parenthetical_echoes(self):
        bad_bracket_samples = [
            "Конверсия (Conversion Rate) выросла на&nbsp;12%.\n",
            "Мы переработали весь пользовательский путь (User Journey).\n",
            "Отток пользователей (Churn Rate) упал до&nbsp;минимума.\n",
            "Кликабельность (CTR) баннера составила 4.2%.\n",
            "Time to Resolution (время решения) сократилось вдвое.\n",
            "Тестирование (A/B testing) показало рост целевых действий.\n",
            "Синхронизация в&nbsp;реальном времени (Real-time) предотвращает конфликты.\n",
            "Время решения (TTR / Resolution Time) упало на&nbsp;40%.\n",
            "Конверсия («Conversion Rate») превысила прогноз.\n",
            "Конверсия (англ. Conversion Rate) составила 5.4%.\n",
            "Выручка (сокр. MRR) увеличилась вдвое.\n",
            "Исследования (R&D) завершились в&nbsp;срок.\n",
            "User Journey (пользовательский путь) был переработан.\n",
            "Conversion Rate (конверсия) выросла.\n",
            "A/B testing (тестирование) завершилось успешно.\n",
        ]
        for bad in bad_bracket_samples:
            violations = lint_snippet(f"# Аналитика\n\n{bad}\n")
            self.assertTrue(len(violations) > 0, f"Expected parenthetical echo in '{bad.strip()}' to FAIL.")

        clean_bracket_samples = [
            "# Аналитика чекаута\n\nКонверсия выросла на&nbsp;12% после релиза.\n",
            "# Экспорт\n\nЭкспорт данных в&nbsp;формате CSV (1.4 МБ).\n",
            "# Скрипт\n\nВызов функции `pluralize(count)` возвращает строку.\n",
            "# Изображение\n\nРазмер файла 10 MB (PNG) подходит для загрузки.\n",
            "# Планирование\n\nПлан на&nbsp;неделю включает 3 задачи (без задержек).\n",
            "# Технические аббревиатуры\n\nОзнакомьтесь с&nbsp;разделом (FAQ) перед началом работы.\n",
            "# Форматы\n\nЭкспортируйте отчет (PDF) или таблицу (CSV).\n",
        ]
        for clean in clean_bracket_samples:
            violations = lint_snippet(clean)
            self.assertEqual(len(violations), 0, f"Expected clean sample to PASS, got: {violations}")

    def test_scaffolding_leakage_and_ciphers(self):
        bad_scaffold_samples = [
            "## Ключевые результаты по формуле Google X-Y-Z\n\nПоказатели улучшились.\n",
            "Формула Google X-Y-Z использовалась для упаковки метрик.\n",
            "Работа выполнена строго по методологии UX STAR в&nbsp;четыре этапа.\n",
            "Артефакт 1 решает проблемы R1–R7 в&nbsp;пользовательском сценарии.\n",
            "Артефакт 2 устраняет баги B-01–B-04 в&nbsp;чекауте.\n",
            "Команда проверила рабочие гипотезы H1–H3 на&nbsp;тестах.\n",
            "Выявили скрытые факторы F1–F4 при качественном анализе.\n",
            "Задачи T1–T5 закрыты в&nbsp;текущем релизе.\n",
            "Сегменты S1–S3 отреагировали положительно.\n",
            "Эпики E1–E4 сформированы для бэклога.\n",
            "Устранен критический баг B-04 в&nbsp;основном сценарии оплаты.\n",
            "### ЗОНА СРЕДЫ 2\n\nОбзор коммерческого коридора.\n",
            "В отчете собрано 6 фотосвидетельств нарушений.\n",
        ]
        for bad in bad_scaffold_samples:
            violations = lint_snippet(bad)
            self.assertTrue(len(violations) > 0, f"Expected scaffolding leakage in '{bad.strip()}' to FAIL.")

        clean_scaffold_sample = (
            "## Ключевые результаты\n\n"
            "Новый бланк устранил семь распространенных ошибок ручного ввода данных.\n\n"
            "### Входная группа и&nbsp;коммерческий коридор\n\n"
            "Фотографии уличной зоны отделения подтверждают устранение барьеров.\n"
        )
        violations = lint_snippet(clean_scaffold_sample)
        self.assertEqual(len(violations), 0, f"Expected clean case copy to PASS, got: {violations}")

    def test_code_block_isolation(self):
        code_block_sample = """# Technical Documentation

```tsx
// В целях обеспечения безопасности проверяем токен
import { seamless } from 'lib';
const isSeamless = true;
<button>Submit</button>
```

Нажмите [Сохранить изменения], чтобы применить параметры.
"""
        violations = lint_snippet(code_block_sample)
        self.assertEqual(len(violations), 0, f"Expected code blocks to be ignored by editorial linter, got: {violations}")

    def test_expanded_slop_and_rhetorical_water(self):
        bad_slop_samples = [
            "# Обзор\n\nМы разработали интуитивный интерфейс для управления заказами.\n",
            "# Обзор\n\nНаша цифровая экосистема объединяет ключевые сервисы компании.\n",
            "# Обзор\n\nПоможем раскрыть потенциал каждого сотрудника в&nbsp;команде.\n",
            "# Обзор\n\nКак известно, данный функционал необходим каждому клиенту.\n",
            "# Features\n\nOur cutting-edge platform delivers high reliability.\n",
        ]
        for bad in bad_slop_samples:
            violations = lint_snippet(bad)
            self.assertTrue(len(violations) > 0, f"Expected expanded slop in '{bad.strip()}' to FAIL.")

    def test_peer_persona_capital_vy(self):
        bad = lint_snippet("# Экран\n\nВы должны подтвердить действие.\n")
        self.assertTrue(len(bad) > 0, "Expected capital Вы to FAIL.")
        good = lint_snippet("# Экран\n\nМожете продолжить: вы не&nbsp;потеряете данные.\n")
        self.assertEqual(len(good), 0, f"Expected lowercase вы to PASS, got: {good}")

    def test_json_and_tsx_syntax_quotes_allowed(self):
        with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as f:
            f.write('{"save_btn": "Сохранить в облаке", "status": "Оплачено 4 990 ₽"}\n')
            json_path = f.name
        with tempfile.NamedTemporaryFile("w", suffix=".tsx", delete=False, encoding="utf-8") as f:
            f.write('<Button label="Сохранить в облаке" placeholder="0000" />\n')
            tsx_path = f.name
        try:
            self.assertEqual(len(check_copy_file(json_path)), 0, "Expected valid JSON localization strings to PASS.")
            self.assertEqual(len(check_copy_file(tsx_path)), 0, "Expected valid TSX attributes to PASS.")
        finally:
            if os.path.exists(json_path):
                os.remove(json_path)
            if os.path.exists(tsx_path):
                os.remove(tsx_path)

    def test_gendered_forms_and_generic_links(self):
        bad_gender = lint_snippet("# Заявка\n\nНажимая кнопку, подал/подала заявку.\n")
        self.assertTrue(len(bad_gender) > 0, "Expected подал/подала to FAIL.")
        bad_link = lint_snippet("# Док\n\nЧитайте [тут](https://x.ru) для деталей.\n")
        self.assertTrue(any("Generic link anchor" in v for v in bad_link), f"Expected generic link FAIL, got: {bad_link}")
        good_link = lint_snippet("# Док\n\nЧитайте [Условия подписки](https://x.ru) для деталей.\n")
        self.assertEqual(len(good_link), 0, f"Expected semantic link to PASS, got: {good_link}")

    def test_glued_currency_flagged(self):
        bad = lint_snippet("# Тариф\n\nЦена 1000₽ за месяц.\n")
        self.assertTrue(any("glued without space" in v for v in bad), f"Expected glued currency FAIL, got: {bad}")

    def test_orphan_russian_prepositions(self):
        bad_prepositions = [
            "# Настройки\n\nПерейдите в личный кабинет.\n",
            "# Оплата\n\nОплата с карты любого банка.\n",
            "# Помощь\n\nОбратитесь к оператору чата.\n",
            "# Документы\n\nИнструкция и памятка для клиента.\n",
        ]
        for bad in bad_prepositions:
            violations = lint_snippet(bad)
            self.assertTrue(len(violations) > 0, f"Expected orphan preposition in '{bad.strip()}' to FAIL.")
            self.assertTrue(any("Orphan Russian preposition" in v for v in violations))

        good_preposition = "# Настройки\n\nПерейдите в&nbsp;личный кабинет.\n"
        self.assertEqual(len(lint_snippet(good_preposition)), 0, "Expected bound preposition to PASS.")

    def test_straight_quotes_around_cyrillic(self):
        bad_quotes = [
            "# Настройки\n\nНажмите \"Сохранить\" для подтверждения.\n",
            "# Профиль\n\nСтатус \"Активен\" обновлен.\n",
        ]
        for bad in bad_quotes:
            violations = lint_snippet(bad)
            self.assertTrue(len(violations) > 0, f"Expected straight quotes in '{bad.strip()}' to FAIL.")
            self.assertTrue(any("Straight quotes" in v for v in violations))

        good_quotes = "# Настройки\n\nНажмите «Сохранить», чтобы применить параметры.\n"
        self.assertEqual(len(lint_snippet(good_quotes)), 0, "Expected French guillemets to PASS.")

    def test_inline_code_backtick_isolation(self):
        code_in_line = (
            "# API Reference\n\n"
            "Используйте флаг `seamless` для переключения режимов.\n\n"
            "Параметр `next` указывает следующий адрес перенаправления.\n\n"
            "Функция `osushchestvlenie()` устарела в&nbsp;новой версии библиотеки.\n\n"
            "Стоимость по умолчанию `1000₽` хранится в&nbsp;базе данных.\n\n"
            "Кнопка вызывает `submit()` при отправке формы.\n"
        )
        violations = lint_snippet(code_in_line)
        self.assertEqual(len(violations), 0, f"Expected inline backtick code to be ignored by linters, got: {violations}")

    def test_glued_currency_on_line_with_nbsp(self):
        bad = lint_snippet("# Оплата\n\nВ&nbsp;банке тариф стоит 1000₽ за месяц.\n")
        self.assertTrue(any("glued without space" in v for v in bad), "Expected glued currency to FAIL even when line contains &nbsp;.")

    def test_markdown_image_alt_text_not_flagged_as_overlong_link(self):
        sample = "# Документация\n\n![Схема распределенной архитектуры очереди сообщений для брокера данных](diagram.png)\n"
        violations = lint_snippet(sample)
        self.assertEqual(len(violations), 0, f"Expected image alt text to NOT be flagged as link, got: {violations}")

    def test_button_period_in_table_cell(self):
        bad_table = "# Таблица действий\n\n| Действие | Статус |\n| :--- | :--- |\n| [Сохранить.] | Черновик |\n"
        violations = lint_snippet(bad_table)
        self.assertTrue(any("Button labels must not have a full stop" in v for v in violations), "Expected button in table cell with trailing dot to FAIL.")

    def test_workspace_cli_and_token_sanitized_json(self):
        res = subprocess.run(
            [sys.executable, SCRIPT_PATH, "--workspace", SCRIPTS_DIR],
            capture_output=True,
            text=True,
            encoding="utf-8"
        )
        self.assertEqual(res.returncode, 0)
        import json
        data = json.loads(res.stdout.strip())
        self.assertEqual(data.get("status"), "ok")
        self.assertLessEqual(len(res.stdout.strip()), 250)

    def test_10_case_intent_matrix_evaluation(self):
        positive_cases = [
            ("P1", "Напиши текст для кнопки оплаты и модального окна подтверждения заказа"),
            ("P2", "Перепиши сообщение об ошибке таймаута базы данных по стандартам Т-Банка"),
            ("P3", "Сформулируй тексты для пустого состояния раздела автобэкапов"),
            ("P4", "Проведи аудит интерфейсных текстов формы входа на канцелярит и успешно"),
            ("P5", "Составь 3 яруса копирайтинга (Terse, Conversational, Instructive) для пуш-уведомления"),
        ]
        negative_cases = [
            ("N1", "Сделай автолейаут карточки товара и настрой отступы 16px в Figma"),
            ("N2", "Настрой физику пружины для выпадающего меню в React"),
            ("N3", "Спроектируй схему базы данных PostgreSQL для хранения заказов"),
            ("N4", "Напиши юнит-тесты на Jest для функции расчета скидки"),
            ("N5", "Настрой Dockerfile и Kubernetes манифесты для сервиса"),
        ]

        copy_triggers = {"текст", "копирайтинг", "микрокопи", "кнопк", "ошибк", "пусто", "аудит", "канцелярит", "успешно", "инфостил"}
        negative_domains = {"figma", "автолейаут", "отступ", "пружин", "react", "postgresql", "спроектируй", "jest", "юнит-тест", "docker", "kubernetes"}

        tp, fn = 0, 0
        for cid, prompt in positive_cases:
            p_lower = prompt.lower()
            activated = any(t in p_lower for t in copy_triggers) and not any(nd in p_lower for nd in negative_domains)
            if activated:
                tp += 1
            else:
                fn += 1

        tn, fp = 0, 0
        for cid, prompt in negative_cases:
            p_lower = prompt.lower()
            is_foreign = any(nd in p_lower for nd in negative_domains)
            if is_foreign:
                tn += 1
            else:
                fp += 1

        recall = tp / (tp + fn)
        precision = tn / (tn + fp)
        balanced_accuracy = (recall + precision) / 2.0

        self.assertEqual(recall, 1.0, f"Expected 100% Recall, got {recall}")
        self.assertEqual(precision, 1.0, f"Expected 100% Precision, got {precision}")
        self.assertEqual(balanced_accuracy, 1.0, f"Expected 100% Balanced Accuracy, got {balanced_accuracy}")

    def test_nonbreaking_hyphen_acronyms(self):
        bad_qr = lint_snippet("# Экран\n\nОтсканируйте QR-код, чтобы войти в&nbsp;приложение.\n")
        self.assertTrue(any("ASCII hyphen" in v for v in bad_qr), f"Expected QR-код to FAIL, got: {bad_qr}")
        good_qr = lint_snippet("# Экран\n\nОтсканируйте QR‑код, чтобы войти в&nbsp;приложение.\n")
        self.assertEqual(len(good_qr), 0, f"Expected QR‑код (with \\u2011) to PASS, got: {good_qr}")

    def test_ascii_minus_vs_math_minus(self):
        bad_minus = lint_snippet("# Баланс\n\nСкидка -15% на тариф.\n")
        self.assertTrue(any("ASCII hyphen '-' used as minus" in v for v in bad_minus), f"Expected -15% to FAIL, got: {bad_minus}")
        bad_temp = lint_snippet("# Погода\n\nЗимой температура падает до -15 °C.\n")
        self.assertTrue(any("ASCII hyphen '-' used as minus" in v for v in bad_temp), f"Expected -15 °C to FAIL, got: {bad_temp}")
        good_minus = lint_snippet("# Баланс\n\nСкидка −15% на тариф при −15 °C.\n")
        self.assertEqual(len(good_minus), 0, f"Expected −15% and −15 °C (with \\u2212) to PASS, got: {good_minus}")

    def test_percent_symbol_spacing(self):
        bad_pct = lint_snippet("# Скидка\n\nКэшбэк 15 % на все покупки.\n")
        self.assertTrue(any("Space before percent" in v for v in bad_pct), f"Expected '15 %' to FAIL, got: {bad_pct}")
        good_pct = lint_snippet("# Скидка\n\nКэшбэк 15% на все покупки.\n")
        self.assertEqual(len(good_pct), 0, f"Expected '15%' to PASS, got: {good_pct}")

    def test_first_person_and_continuous_ctas(self):
        bad_cta1 = lint_snippet("# Модалка\n\n[Хочу удалить]\n")
        self.assertTrue(any("Banned first-person" in v for v in bad_cta1), f"Expected 'Хочу удалить' to FAIL, got: {bad_cta1}")
        bad_cta2 = lint_snippet("# Модалка\n\n[Сохраняю]\n")
        self.assertTrue(any("Banned first-person" in v for v in bad_cta2), f"Expected 'Сохраняю' to FAIL, got: {bad_cta2}")
        good_cta = lint_snippet("# Модалка\n\n[Удалить]\n")
        self.assertEqual(len(good_cta), 0, f"Expected 'Удалить' to PASS, got: {good_cta}")

    def test_instructional_input_labels(self):
        bad_label = lint_snippet('# Форма\n\n<Input label="Введите номер телефона" />\n')
        self.assertTrue(any("Banned instructional command" in v for v in bad_label), f"Expected 'Введите номер' to FAIL, got: {bad_label}")
        good_label = lint_snippet('# Форма\n\n<Input label="Номер телефона" />\n')
        self.assertEqual(len(good_label), 0, f"Expected 'Номер телефона' to PASS, got: {good_label}")

    def test_two_sentence_trailing_period_rule(self):
        bad_toast = lint_snippet("# Оповещение\n\n<Toast>Не удалось загрузить данные. Попробуйте снова.</Toast>\n")
        self.assertTrue(any("Trailing period in 2-sentence" in v for v in bad_toast), f"Expected 2-sentence toast to FAIL with trailing period, got: {bad_toast}")
        good_toast = lint_snippet("# Оповещение\n\n<Toast>Не удалось загрузить данные. Попробуйте снова</Toast>\n")
        self.assertEqual(len(good_toast), 0, f"Expected 2-sentence toast without trailing period to PASS, got: {good_toast}")

    def test_abbreviation_dots_and_negative_toggles(self):
        bad_abbr = lint_snippet("# Тариф\n\nОбработка займет 5 мин. и&nbsp;потребует 10 МБ. памяти.\n")
        self.assertTrue(any("Trailing period after interface abbreviation" in v for v in bad_abbr), f"Expected '5 мин.' to FAIL, got: {bad_abbr}")
        good_abbr = lint_snippet("# Тариф\n\nОбработка займет 5 мин и&nbsp;потребует 10 МБ памяти.\n")
        self.assertEqual(len(good_abbr), 0, f"Expected '5 мин' without dot to PASS, got: {good_abbr}")

        bad_toggle = lint_snippet('# Настройки\n\n<Switch>Не показывать баланс</Switch>\n')
        self.assertTrue(any("Negative toggle/switch label" in v for v in bad_toggle), f"Expected negative toggle to FAIL, got: {bad_toggle}")
        good_toggle = lint_snippet('# Настройки\n\n<Switch>Показывать баланс</Switch>\n')
        self.assertEqual(len(good_toggle), 0, f"Expected affirmative toggle to PASS, got: {good_toggle}")

    def test_dual_path_resolution_with_workspace_and_target(self):
        skill_root = os.path.abspath(os.path.join(SCRIPTS_DIR, ".."))
        res = subprocess.run(
            [sys.executable, SCRIPT_PATH, "--workspace", skill_root, "--target", "examples/sample-interface-copy.md"],
            capture_output=True,
            text=True,
            encoding="utf-8",
            cwd=tempfile.gettempdir(),
        )
        self.assertEqual(res.returncode, 0, f"Expected sample-interface-copy.md to PASS via --workspace/--target, got: {res.stdout} {res.stderr}")

    def test_illiterate_ordinals_and_date_suffixes(self):
        bad_ordinals = [
            "# Шаги\n\nПерейдите на&nbsp;1-ый шаг настройки.\n",
            "# Уровень\n\nДоступен 2-ой уровень защиты и&nbsp;5-ого разряда.\n",
            "# Даты\n\nОтчет за&nbsp;итоги 2026-го года будет доступен до&nbsp;25-го сентября.\n",
            "# Год\n\nТарифы обновились в&nbsp;2026-м году.\n",
        ]
        for bad in bad_ordinals:
            violations = lint_snippet(bad)
            self.assertTrue(len(violations) > 0, f"Expected ordinal illiteracy in '{bad.strip()}' to FAIL.")

        good_ordinals = (
            "# Шаги\n\n"
            "Перейдите на&nbsp;1-й шаг настройки и&nbsp;проверьте 2-го участника до&nbsp;25 сентября 2026 года.\n"
        )
        self.assertEqual(len(lint_snippet(good_ordinals)), 0, f"Expected grammatical ordinals to PASS, got: {lint_snippet(good_ordinals)}")

    def test_numeric_range_en_dash_and_hybrid_preposition(self):
        bad_ranges = [
            "# Доставка\n\nКурьер приедет с&nbsp;10:00–19:00.\n",
            "# Сроки\n\nПроверка займет 10 – 15 мин.\n",
        ]
        for bad in bad_ranges:
            violations = lint_snippet(bad)
            self.assertTrue(any("Invalid numeric range" in v for v in violations), f"Expected range violation in '{bad.strip()}', got: {violations}")

        good_ranges = "# Доставка\n\nКурьер приедет в&nbsp;интервале 10:00–19:00 или&nbsp;с&nbsp;10:00 до&nbsp;19:00 за&nbsp;10–15 минут.\n"
        self.assertEqual(len(lint_snippet(good_ranges)), 0, f"Expected unspaced numeric en-dash to PASS, got: {lint_snippet(good_ranges)}")

    def test_english_calques_passive_and_possessive_bloat(self):
        bad_calques = [
            "# Бэкапы\n\nСнимки создаются на&nbsp;ежедневной основе.\n",
            "# Обзор\n\nМы обновили пользовательский опыт в&nbsp;приложении.\n",
            "# Введение\n\nДавайте разберемся, как настроить лимиты.\n",
            "# Тариф\n\nЭто не&nbsp;только быстро, но&nbsp;и выгодно для&nbsp;команды.\n",
            "# Уведомление\n\nНовый пароль был отправлен на&nbsp;почту.\n",
            "# Вход\n\nВведите ваш пароль и&nbsp;укажите ваш телефон.\n",
        ]
        for bad in bad_calques:
            violations = lint_snippet(bad)
            self.assertTrue(len(violations) > 0, f"Expected calque/passive/possessive in '{bad.strip()}' to FAIL, got: {violations}")

        good_russian = (
            "# Вход\n\n"
            "Снимки создаются каждый день. Отправили новый пароль на&nbsp;почту. Введите пароль и&nbsp;укажите номер телефона.\n"
        )
        self.assertEqual(len(lint_snippet(good_russian)), 0, f"Expected natural Russian to PASS, got: {lint_snippet(good_russian)}")

if __name__ == "__main__":
    unittest.main()
