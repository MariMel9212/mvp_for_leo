# UX Editorial Copywriting & Interface Semantics (v2.2.0 — 2026 BigTech Standard)

Production-grade agent skill and deterministic interface content linter enforcing human-first, dialogic UX copywriting grounded in Russian BigTech editorial standards (**T-Bank**, **SKB Kontur**, **Dodo Brands**, **Yandex**, **Avito**, **Ozon**) and **Gramota.ru** typographic norms.

Designed for AI coding assistants and agentic IDEs (**Google Antigravity**, **Claude Code**, **Cursor**, **Windsurf**, **Claude Projects**, **OpenAI GPTs**).

---

## Overview

Interface text is not decorative prose or a bureaucratic manual — it is an **ergonomic dialogue in the user's world between a person and a helpful software service**.

This skill enforces 10 core invariants and **35 deterministic linter checks** (`scripts/audit_copy.py`) across UI microcopy, button labels, colon-linked error recovery dialogs, the 3 empty-state archetypes, B2B data grids, transparent FinTech paywalls, input fields, and dynamic Russian plurals — eliminating bureaucratic slop (*«успешно»*, *«осуществление»*), English syntactic calques (*«на ежедневной основе»*, *«пользовательский опыт»*, passive *«был отправлен»*, possessive bloat *«введите ваш пароль»*), and typographic illiteracy.

### 10 Core Editorial Invariants

1. **Dialogic Buttons & Confirmations**: Buttons speak in the **user's voice** (`[Action Verb]` or `[Verb] + [Direct Object]`, e.g., «Сохранить», «Войти», «Оплатить 4 990 ₽»); headings speak in the **service's voice**. Acknowledgment uses «Понятно» or «Хорошо» (never «ОК», «Подтвердить», «Далее», «Хочу удалить», «Сохраняю», «Я понял»). Destructive modals pair *«Точно удалить X?»* with *«Да, удалить»* and non-action *«Отмена»*.
2. **Verb Aggression Calibration (Birman)**: Reserve imperative/infinitive verbs strictly for **mandatory flow steps** (*«Введите код из СМС»*). Frame optional features via possibility syntax (*«Здесь можно изучить расходы»* — never bossy *«Изучайте расходы!»*).
3. **8-Word Economy, Тема → Рема & Anti-Calque Syntax**: Keep UI sentences averaging **`<= 8 words`**. Order Russian clauses from **Тема (known context)** to **Рема (target action/control at the end)** (*«Когда заполните анкету, нажмите „Продолжить“»*). Replace verbal nouns (*«для предотвращения потери»* → *«чтобы не потерять»*), passive calques (*«Код был отправлен»* → *«Отправили код»*), possessive bloat (*«Введите ваш пароль»* → *«Введите пароль»*), and redundant *«успешно»*.
4. **User's World, 3 Empty-State Archetypes & Error Routing**: Translate backend failures into the **user's world** (*«Сессия закончилась: войдите снова»* instead of *«Ошибка валидации токена 401»*). Link error cause and recovery via a colon or dash. Distinguish **Initial Empty State** (onboarding), **Search Zero-Results** (*«По запросу ничего не нашлось»* + `[Сбросить фильтры]`), and **Inbox-Zero** (*«Все счета оплачены»*). Formulate toggles/checkboxes strictly in the **affirmative** (*«Показывать баланс»*, never *«Не показывать баланс»*).
5. **Peer Persona, Lowercase «вы» & Gender Neutrality**: Address the user with lowercase **«вы»** (start sentences with verbs so «Вы» never appears capitalized), speak as an accountable team (**«мы поможем»**, **«пришлем»**), and use gender-neutral phrasing (*«Карта потерялась»*, never *«подал/подала»* or *«согласен(на)»*).
6. **Complete Screen Typography, Ranges & Ordinals**: Omit trailing periods on headings, buttons, badges, inputs, and 1–2 sentence alerts/toasts. Write UI units without dots (`тыс`, `млн`, `мин`, `сек`, `ч`, `МБ`, `ГБ`, `шт`, `руб`). Use French guillemets «...» (inner „...“), non-breaking hyphen `\u2011` (`QR‑код`, `ПИН‑код`, `СМС‑код`), mathematical minus `\u2212` (`−15%`, `−15 °C`), attached percent (`15%`), **unspaced en-dash `–`** in numeric/time ranges (`10–15 мин`, `19:00–20:00`, never `с 10:00–19:00`), grammatical ordinal suffixes (`1-й`, `2-го`, never `1-ый`, `5-ого`, `2026-го года`), and non-breaking spaces (`&nbsp;` / `\u00A0`).
7. **Dual-Mode Delivery Spectrum**: Deliver a **single optimal string (Mode A)** when editing code/Figma directly, or a **3-Tier Editorial Matrix (Mode B: Terse / Conversational / Instructive)** when authoring UX copy specs.
8. **Dynamic Counters (`1 / Few / Many`)**: Enforce Russian 3-form morphology (`1 товар`, `2–4 товара`, `5–20 товаров`) and predicate agreement (`Выбран 1 товар` / `Выбрано 2 товара`).
9. **Platform Ergonomics, B2B Tables & Honest Paywalls**: Enforce iOS Nav Bar `1-word` action limit, Push `<= 40/120` chars, OTP SMS `<= 70` chars. Keep form labels persistent above fields naming data (*«Номер телефона»*) and placeholders as format specimens (`+7 999 000-00-00`). In B2B tables (Kontur standard), move units to column headers (`Сумма, ₽`), use `—` for empty cells, and verb-free status badges. In paywalls, state exact trial days, first charge date, price CTA (*«Оплатить 399 ₽»*), and neutral opt-out (*«Пока пропустить»*).
10. **Safe Code & i18n Integrity**: Extract candidate strings via `scripts/extract_ui_strings.py` (preserving JSX prop context `label`, `placeholder`, `helperText`, `errorText`, `aria-label`, `alt`) and protect localization keys, interpolation tokens, and ICU plural blocks.

---

## Repository Structure

```text
ux-editorial-copywriting/
├── SKILL.md                                  # Agent skill definition (v2.2.0, YAML frontmatter + 10 core invariants)
├── README.md                                 # Repository documentation & setup guide
├── references/                               # Modular technical specifications (Progressive Disclosure)
│   ├── infostyle-and-voice.md                # Dialogic model, User's vs System's World, typography, dates, ordinals
│   ├── microcopy-and-components.md           # Buttons, errors, 3 empty-state archetypes, B2B tables, paywalls, toggles
│   ├── counters-forms-and-platforms.md       # Plurals (one/few/many), 5-layer form anatomy, Push/SMS limits, Chesterton Gate
│   ├── i18n-and-code-review.md               # Safe string extraction, ICU plural & translation key retention
│   ├── banned-copy-slop.md                   # Blacklist of bureaucratic nouns, English calques, passive/possessive bloat
│   ├── human-storytelling-and-anti-ai.md     # 8-word cadence, Тема → Рема word order, Nora Gal glagolization
│   └── bigtech-tone-of-voice-matrix.md       # Comparative matrix (T-Bank, SKB Kontur, Dodo, Yandex, Avito, Ozon)
├── examples/
│   └── sample-interface-copy.md              # Golden-master 3-Tier copy specs (Auth, Empty, Zero-Results, Table, Paywall)
├── scripts/
│   ├── audit_copy.py                         # Deterministic 35-check CLI linter for UI copy & anti-slop
│   └── extract_ui_strings.py                 # JSX/TSX/JSON/YAML/HTML Russian UI string extractor
└── tests/
    ├── test_audit_copy.py                    # Unit tests for all 35 checks in audit_copy.py
    └── test_extract_ui_strings.py            # Unit tests for extract_ui_strings.py (including JSX prop attribution)
```

---

## Installation & Setup (2026 Agent Skills Standard)

### Quick Install via `skills` CLI (Claude Code, Cursor, Windsurf, Copilot, Codex)
The fastest way to install this skill into any compatible coding agent is via the open Agent Skills CLI (`skills.sh`):

```bash
# Install into the current project (auto-detects your agent/IDE)
npx skills add ivanshtylev-designer/ux-editorial-copywriting

# Install globally across all projects on your machine
npx skills add ivanshtylev-designer/ux-editorial-copywriting -g

# Target a specific agent explicitly (e.g., claude-code, cursor, windsurf)
npx skills add ivanshtylev-designer/ux-editorial-copywriting --agent claude-code -g
```

---

### 1. Google Antigravity
Clone directly into your global skills directory (available across all projects) or into a project workspace:

**Global (`~/.gemini/config/skills/`):**
```bash
# macOS / Linux / Git Bash
git clone https://github.com/ivanshtylev-designer/ux-editorial-copywriting.git ~/.gemini/config/skills/ux-editorial-copywriting

# Windows (PowerShell)
git clone https://github.com/ivanshtylev-designer/ux-editorial-copywriting.git "$HOME\.gemini\config\skills\ux-editorial-copywriting"
```

**Project Workspace (`.agents/skills/`):**
```bash
git clone https://github.com/ivanshtylev-designer/ux-editorial-copywriting.git .agents/skills/ux-editorial-copywriting
```
*Invocation:* Antigravity loads the skill automatically when your task involves UI copywriting, or you can invoke it explicitly via `/ux-editorial-copywriting`.

---

### 2. Claude Code (Native `SKILL.md` Support)
Claude Code natively discovers `SKILL.md` files from `~/.claude/skills/` (global) and `.claude/skills/` (project) without bloating `CLAUDE.md`:

**Global (`~/.claude/skills/`):**
```bash
# macOS / Linux / Git Bash
git clone https://github.com/ivanshtylev-designer/ux-editorial-copywriting.git ~/.claude/skills/ux-editorial-copywriting

# Windows (PowerShell)
git clone https://github.com/ivanshtylev-designer/ux-editorial-copywriting.git "$HOME\.claude\skills\ux-editorial-copywriting"
```

**Project Workspace (`.claude/skills/`):**
```bash
git clone https://github.com/ivanshtylev-designer/ux-editorial-copywriting.git .claude/skills/ux-editorial-copywriting
```
*Invocation:* Claude Code activates the skill automatically based on YAML frontmatter or via the `/ux-editorial-copywriting` slash command in the terminal.

---

### 3. Cursor (Native Agent Skills `.cursor/skills/` & `.cursor/rules/`)
Cursor 2026 natively supports on-demand Agent Skills (`SKILL.md`) alongside persistent `.cursor/rules/*.mdc` files:

**Option A — Native Cursor Skill (Recommended, zero context bloat):**
```bash
# Global (all projects — macOS / Linux)
git clone https://github.com/ivanshtylev-designer/ux-editorial-copywriting.git ~/.cursor/skills/ux-editorial-copywriting

# Global (all projects — Windows PowerShell)
git clone https://github.com/ivanshtylev-designer/ux-editorial-copywriting.git "$HOME\.cursor\skills\ux-editorial-copywriting"

# Project-scoped (.cursor/skills/)
git clone https://github.com/ivanshtylev-designer/ux-editorial-copywriting.git .cursor/skills/ux-editorial-copywriting
```

**Option B — Glob-Triggered Cursor Rule (`.cursor/rules/copywriting.mdc`):**
If you also want a lightweight persistent rule attached to frontend file globs, create `.cursor/rules/copywriting.mdc`:
```markdown
---
description: UX editorial copywriting & interface semantics (2026 BigTech Standard)
globs: "**/*.{tsx,jsx,vue,svelte,json,md}"
alwaysApply: false
---
When generating UI components, button labels, error toasts, tables, paywalls, or form fields, enforce `.cursor/skills/ux-editorial-copywriting/SKILL.md`:
- Buttons are the user's voice: active verbs (`[Действие]` / `[Действие] + [Объект]`), acknowledgment «Понятно» / «Хорошо» (no sterile «ОК», «Далее», «Подтвердить»).
- Word order: Тема (known context) → Рема (target action at the end). Translate backend states into the user's world.
- Errors: `Событие: причина. Действие выхода` (colon-linked cause + immediate recovery step).
- Eliminate bureaucratic adverbs («успешно»), passive calques («был отправлен»), and possessive bloat («введите ваш пароль»).
- Address users with lowercase «вы» / «вам». Use unspaced en-dash `–` in numeric ranges (`10–15 мин`) and non-breaking hyphen `\u2011` in `QR‑код`.
```

---

### 4. Windsurf
Clone into Windsurf's native skill directories:
```bash
# Global (macOS / Linux)
git clone https://github.com/ivanshtylev-designer/ux-editorial-copywriting.git ~/.codeium/windsurf/skills/ux-editorial-copywriting

# Project Workspace
git clone https://github.com/ivanshtylev-designer/ux-editorial-copywriting.git .windsurf/skills/ux-editorial-copywriting
```

---

### 5. Claude Projects (`claude.ai`) & OpenAI Custom GPTs
1. Download the latest release archive (`Source code (zip)`) from the **[Releases](https://github.com/ivanshtylev-designer/ux-editorial-copywriting/releases)** section on the right sidebar of GitHub.
2. Upload `SKILL.md`, all files from `references/`, and `examples/sample-interface-copy.md` into **Project Knowledge** (or GPT **Knowledge**).
3. Add to **Instructions**:
   > *«При проектировании и редактуре интерфейсных текстов строго руководствуйся документами из базы знаний, соблюдая 10 инвариантов из SKILL.md (модель диалога, Тема → Рема, мир пользователя, 3 архетипа пустых состояний, таблицы по Контур.Гайдам, честные пейволлы, экранная типографика) и стоп-лист banned-copy-slop.md.»*

---

## CLI Utilities

Both utilities require **Python >= 3.10** with **zero external dependencies** (standard library only):

### 1. `audit_copy.py` (35-Check Linter & Anti-Slop Verifier)
Scans Markdown, HTML, JSON, and JSX/TSX files for UX editorial and typographic violations:
```powershell
# Default mode (emits compact single-line JSON <= 50 tokens for AI agents; Exit Code 0 on pass)
python scripts/audit_copy.py --workspace . --target examples/sample-interface-copy.md

# Human-readable diagnostic output with exact line numbers and replacement hints
python scripts/audit_copy.py --workspace . --target path/to/screen-copy.md --format text

# Run full automated test suite (51 unit tests)
python -m unittest discover -s tests -p "test_*.py" -v
```

### 2. `extract_ui_strings.py` (Context-Aware UI String Extractor)
Extracts Russian interface strings from frontend source files (`.tsx`, `.jsx`, `.vue`, `.html`, `.ts`, `.js`) and locale dictionaries (`.json`, `.yaml`, `.yml`), automatically classifying components from JSX prop names (`label`, `placeholder`, `helperText`, `errorText`, `aria-label`, `alt`, `title`):
```powershell
# Extract strings into a GitHub Flavored Markdown table for editorial review
python scripts/extract_ui_strings.py --workspace . --target src/components --include "*.tsx" --format md

# Extract strings as compact JSON
python scripts/extract_ui_strings.py --workspace . --target src/locales/ru.json --format json --compact
```

---

## License

MIT
