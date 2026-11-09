---
name: ux-editorial-copywriting
description: >-
  Architects professional UX interface microcopy, action-first CTAs, error recovery
  messaging, empty states, B2B tables, paywalls, form labels, and living Russian syntax.
  Enforces 2026 BigTech dialogic interface semantics (T-Bank, Kontur, Dodo, Yandex, Avito, Ozon),
  Theme-Rheme word order, verb aggression calibration (Birman), 8-word economy, and screen typography.
  Use ONLY when authoring, editing, or auditing user interface microcopy, button labels,
  error recovery dialogs, empty states, tables, paywalls, form labels, voice and tone guides,
  or localization dictionaries.
  Do NOT use for native iOS spatial layout or safe areas (route to apple-hig-architect),
  mobile typography scales or Auto Layout gap math (route to mobile-typography-architect),
  live Figma canvas mutations (route to figma-edit-architect),
  or cross-screen product strategy and CJM flows (route to product-logic-architect).
compatibility: Requires python >= 3.10 (cross-platform Windows/macOS/Linux)
metadata:
  version: "2.2.0"
---

# UX Editorial Copywriting & Interface Semantics (2026 BigTech Standard)

> [!IMPORTANT]
> **Lane 1 Fast Track (Zero-Overread Invariant):** Interface text is an ergonomic dialogue in the **user's world** between a person and a helpful software service (T-Bank, SKB Kontur, Dodo Brands, Yandex, Avito, Ozon — 2026 standards). For standard button labels, alerts, form fields, and microcopy audits, execute directly using Sections 1–4 and [`scripts/audit_copy.py`](./scripts/audit_copy.py) with **zero preliminary `references/` reads**. Consult `references/*.md` via `read_file` strictly when deep subsystem rules are required.

---

## 1. Core Editorial Invariants (Primacy Zone)

| # | Invariant | Mandatory Positive Action Contract | Verification Gate |
| :- | :--- | :--- | :--- |
| **1** | **Dialogic Buttons & Confirmations** | Write buttons in the **user's voice** (`[Action Verb]` or `[Verb] + [Direct Object]`, e.g., «Сохранить», «Оплатить 4 990 ₽») and headings in the **service's voice**. Use natural acknowledgment («Понятно», «Хорошо» — never «ОК», «Подтвердить», «Далее», «Хочу удалить», «Сохраняю», «Я понял»). Pair destructive headers (*«Точно удалить X?»*) with matching *«Да, удалить»* and non-action *«Отмена»*. | `audit_copy.py` Checks 2, 25 |
| **2** | **Verb Aggression Calibration (Birman)** | Reserve imperative/infinitive verbs strictly for **mandatory flow steps** (*«Введите код из СМС»*). Frame **optional or exploratory features** using possibility syntax (*«Здесь можно изучить расходы»* — never bossy imperatives like *«Изучайте расходы»*). | Editorial & tone review |
| **3** | **8-Word Economy, Тема → Рема & Anti-Calque Syntax** | Keep UI sentences averaging **`<= 8 words`**. Order Russian clauses from **Тема (known context)** to **Рема (target action/control at the end)** (*«Когда заполните анкету, нажмите „Продолжить“»*). Replace verbal nouns (*«осуществление настройки»* $\to$ *«настроить»*), prepositional knots (*«для [сущ]»* $\to$ *«чтобы [глагол]»*), passive calques (*«Код был отправлен»* $\to$ *«Отправили код»*), possessive bloat (*«Введите ваш пароль»* $\to$ *«Введите пароль»*), and English idioms (*«на ежедневной основе»* $\to$ *«каждый день»*). Purge *«успешно»*. | `audit_copy.py` Checks 1, 4–6, 10–15, 33–35 |
| **4** | **User's World, 3 Empty-State Archetypes & Error Routing** | Translate backend states into the **user's world** (*«Сессия закончилась: войдите снова»* instead of *«Ошибка валидации токена 401»*). Link error event and cause via a colon or dash with a concrete exit action. Distinguish **Initial Empty State** (*«Заказов пока нет»* + value + create CTA), **Search Zero-Results** (*«По запросу ничего не нашлось»* + `[Сбросить фильтры]`), and **Inbox-Zero** (*«Все счета оплачены»*). Formulate toggles/checkboxes strictly in the **affirmative** (*«Показывать баланс»*, never *«Не показывать баланс»*). | `audit_copy.py` Checks 3, 29 |
| **5** | **Peer Persona, Lowercase «вы» & Neutrality** | Address the user with lowercase **«вы»** (lead with the verb at sentence start so «Вы» never appears capitalized). Speak as an accountable team in first-person plural (**«мы поможем»**, **«пришлем»**). Use gender-neutral formulations (*«Карта потерялась»*, never *«подал/подала»* or *«согласен(на)»*). | `audit_copy.py` Checks 16, 17 |
| **6** | **Complete Screen Typography, Ranges & Ordinals** | Omit trailing periods on headings, buttons, badges, inputs, and at the end of 1–2 sentence UI blocks (`<Toast>`, `<Alert>`). Write interface units **without dots** (`тыс`, `млн`, `мин`, `сек`, `ч`, `МБ`, `ГБ`, `шт`, `руб`). Use French guillemets «...» (inner „...“), non-breaking hyphen `\u2011` (`QR‑код`, `ПИН‑код`, `СМС‑код`), mathematical minus `\u2212` (`−15%`), attached percent (`15%`), **unspaced en-dash `–`** in numeric/time ranges (`10–15 мин`, `19:00–20:00`, never `с 10:00–19:00`), grammatical ordinal suffixes (`1-й`, `2-го`, never `1-ый`, `5-ого`, `2026-го года`), and non-breaking spaces (`&nbsp;` in MD/HTML; `\u00A0` in TSX/JSON/Figma). | `audit_copy.py` Checks 7–9, 20–24, 27–28, 30–32 |
| **7** | **Dual-Mode Delivery Spectrum** | **Mode A (Direct Production Copy):** Deliver the single optimal string when mutating `.tsx`/`.json`/Figma nodes or answering isolated label queries. **Mode B (3-Tier Editorial Matrix):** Deliver across `Tier 1 (Terse 1–3 words)` \| `Tier 2 (Conversational)` \| `Tier 3 (Instructive)` for copy specs and flow redesigns. | Output Contract check |
| **8** | **Dynamic Counters (`1 / Few / Many`)** | Enforce Russian 3-form morphology (`1 товар`, `2–4 товара`, `5–20 товаров`) and predicate gender agreement (`Выбран 1 товар` / `Выбрано 2 товара`). Prefer qualitative empty states (`Корзина пуста` over `0 товаров`). | Pluralization check |
| **9** | **Platform Ergonomics, B2B Tables & Honest Paywalls** | Enforce iOS Nav Bar `1-word` action limit, Push `<= 40/120` chars, OTP SMS `<= 70` chars. Keep form labels persistent above fields naming data (*«Номер телефона»*) and placeholders as format examples (`+7 999 000-00-00`, never *«Введите...»*). In B2B tables, put units in headers (`Сумма, ₽`), use `—` for empty cells, and verb-free status badges. In paywalls, state exact trial days, first charge date, price CTA (*«Оплатить 399 ₽»*), and neutral opt-out (*«Пока пропустить»*). | `audit_copy.py` Check 26 |
| **10** | **Safe Code & i18n Integrity** | Extract candidate copy via `scripts/extract_ui_strings.py` before bulk rewrites. Preserve localization keys, interpolation tokens (`{name}`, `%{count}`, `${val}`), and ICU plural blocks (`{count, plural, one{#} few{#} many{#}}`). | `extract_ui_strings.py` |

---

## 2. Progressive Disclosure Index & Reference Manuals

| Reference / Recipe Document | Scope & Focus Domain | Activation Trigger (When to Read via `read_file`) |
| :--- | :--- | :--- |
| **[`infostyle-and-voice.md`](./references/infostyle-and-voice.md)** | Dialogic model, User's World vs System's World, verb aggression scale, lowercase 'вы', team 'мы', screen typography, dates, ranges, and ordinals. | Read when calibrating brand voice, translating backend states, or checking typographic/date/ordinal rules. |
| **[`microcopy-and-components.md`](./references/microcopy-and-components.md)** | User-voice buttons, colon-linked error routing, 3 empty-state archetypes, B2B tables (Kontur), FinTech paywalls, and affirmative toggles. | Read when authoring modals, empty states, zero-results, data grids, paywalls, or multi-step forms. |
| **[`counters-forms-and-platforms.md`](./references/counters-forms-and-platforms.md)** | Russian pluralization matrix (`one/few/many`), predicate agreement, 5-layer form anatomy, Push/SMS limits, Chesterton Gate. | Read when designing dynamic counters, push/SMS notifications, or redesigning forms. |
| **[`i18n-and-code-review.md`](./references/i18n-and-code-review.md)** | Safe vs risky code mutations, string extraction runbook, ICU plural protection, and placeholder interpolation integrity. | Read when refactoring frontend `.tsx`/`.json`/`.yaml` localization bundles. |
| **[`banned-copy-slop.md`](./references/banned-copy-slop.md)** | Exhaustive blacklist of bureaucratic nouns, "успешно", English calques, passive participles, possessive bloat, and ordinal illiteracy. | Read when diagnosing failed linter checks or sanitizing legacy/AI-generated copy. |
| **[`human-storytelling-and-anti-ai.md`](./references/human-storytelling-and-anti-ai.md)** | 8-word cadence, Theme-Rheme (Актуальное членение) word order, Colleague Aloud Test, Nora Gal glagolization, and spoken rhythm. | Read when rewriting long-form onboarding, tooltips, release notes, or eliminating synthetic AI syntax. |
| **[`bigtech-tone-of-voice-matrix.md`](./references/bigtech-tone-of-voice-matrix.md)** | Comparative matrix of T-Bank, SKB Kontur, Dodo Brands, Yandex, Avito, and Ozon. | Read when aligning copy to a specific corporate brand archetype. |
| **[`examples/sample-interface-copy.md`](./examples/sample-interface-copy.md)** | Production-grade 3-Tier copy specimens covering Auth, Empty States, Zero-Results, Errors, Modals, Data Grids, and Paywalls. | Read as a golden-master template when authoring UX copy specifications. |

---

## 3. Step-by-Step Execution Runbook

### Phase 1: Baseline Inspection & String Extraction
1. Resolve `<SKILL_DIR>` from the directory containing this `SKILL.md`.
2. When auditing an unfamiliar frontend directory or locale bundle, extract Russian UI strings via `run_command`:
   ```powershell
   python "<SKILL_DIR>/scripts/extract_ui_strings.py" --workspace . --target "<PATH_TO_SRC_OR_FILE>" --format md
   ```
3. Read target files in full (`<= 800` lines) via `read_file` before any `edit_file` or `write_file` call.
4. Classify the surface (`iOS_Nav_Bar`, `Bottom_Sheet`, `Form_Input`, `Modal_Alert`, `Push_Notification`, `Toast`), situational tone, and delivery mode (**Mode A** single string vs **Mode B** 3-Tier Matrix).

### Phase 2: Microcopy Authoring & Surgical Mutation
1. Apply the 10 Core Editorial Invariants from Section 1 (`[Verb] + [Object]` user-voice buttons, colon-linked error cause + recovery, affirmative switches, lowercase `вы`, non-breaking `\u2011` / `\u2212` / `&nbsp;` or `\u00A0`).
2. Contrastive Calibration Specimen:
   ```markdown
   <!-- [BAD]: Bureaucratic, bossy, disconnected error, vague button -->
   Настройте расписание регулярных снимков кластера для предотвращения потери рабочих данных.
   Не удалось сохранить изменения схемы базы данных. Прервалось соединение с сервером. Проверьте сеть.
   <button>Подтвердить</button>

   <!-- [GOOD]: Spoken syntax, 3-Tier Spectrum, colon-linked error, user-voice CTA -->
   Tier 1 (Terse):          Включить бэкапы
   Tier 2 (Conversational): Включите автобэкапы, чтобы не&nbsp;потерять данные при сбое
   Tier 3 (Instructive):    Настройте ежедневные снимки кластера: они защитят рабочие таблицы при сбое
   Ошибка: Схема не&nbsp;сохранилась: пропала связь с&nbsp;сервером. Проверьте сеть и&nbsp;нажмите «Повторить»
   Кнопка: [Да, удалить] / [Понятно] / [Сохранить]
   ```
3. Apply surgical edits via `edit_file` while preserving all localization keys and interpolation tokens.

---

## 4. Closed-Loop Verification & 3-State Circuit Breaker (Recency Zone)

### 4.1 Deterministic Linter Gate (`audit_copy.py`)
Every authored or modified copy file (`.md`, `.tsx`, `.jsx`, `.json`, `.html`, `.txt`) MUST be verified via `run_command`:

```powershell
# 1. Deterministic audit (emits single-line JSON <= 50 tokens, Exit Code == 0 on pass):
python "<SKILL_DIR>/scripts/audit_copy.py" --workspace . --target "<PATH_TO_FILE_OR_DIR>"

# 2. Human-readable diagnostic mode (when inspecting specific line violations):
python "<SKILL_DIR>/scripts/audit_copy.py" --workspace . --target "<PATH_TO_FILE_OR_DIR>" --format text

# 3. Full unit test suite (when modifying scripts):
python -m unittest discover -s "<SKILL_DIR>/tests" -p "test_*.py"
```

### 4.2 3-State Circuit Breaker
- **CLOSED (Normal Pass):** `audit_copy.py` exits with `Exit Code == 0` (`{"status":"ok",...}`). Deliver the copy specification or diff.
- **HALF-OPEN (Self-Healing — Attempts 1–2):** If `Exit Code != 0`, inspect the reported line numbers and rule violations (e.g., orphan preposition without `&nbsp;`, ASCII hyphen in `QR-код` instead of `QR\u2011код`, trailing dot on button/toast, or vague CTA), apply surgical fixes via `edit_file`, and re-run `audit_copy.py`.
- **OPEN (Circuit Tripped — After 2 Consecutive Failed Attempts):** Immediately STOP calling mutation tools and output: (1) the exact JSON error payload from `audit_copy.py`, (2) the root-cause conflict, and (3) two concrete phrasing options for user decision.

---

## 5. Mandatory Output Contract (Recency Zone)

Deliver UX copy specifications and audits adhering strictly to this schema with typed placeholders (`<...:TYPE>`):

```markdown
### UX Editorial Specification: <COMPONENT_OR_SCREEN_NAME:STRING>
- **Target Surface:** `<iOS_Nav_Bar | Bottom_Sheet | Form_Input | Modal_Alert | Push_Notification | Toast>`
- **Situational Tone:** `<Onboarding | Routine | Form_Validation | System_Outage | Destructive>`
- **Delivery Mode:** `<Mode A (Single Optimal) | Mode B (3-Tier Spectrum)>`

#### Editorial Copy Delivery
| Component / Element | Tier 1 (Terse) | Tier 2 (Conversational) | Tier 3 (Instructive) |
| :--- | :--- | :--- | :--- |
| **Headline / Prompt** | `<TERSE_HEADLINE:STRING>` | `<CONVERSATIONAL_HEADLINE:STRING>` | `<INSTRUCTIVE_HEADLINE:STRING>` |
| **Body / Error Recovery** | `<TERSE_BODY:STRING>` | `<COLON_LINKED_CAUSE_AND_EXIT:STRING>` | `<DETAILED_RECOVERY_STEP:STRING>` |
| **Primary Action (CTA)** | `[<USER_VERB:STRING>]` | `[<USER_VERB_AND_OBJECT:STRING>]` | `[<USER_VERB_OBJECT_CONTEXT:STRING>]` |
| **Secondary Action** | `[<NON_ACTION_NOUN:STRING>]` | `[<NON_ACTION_NOUN:STRING>]` | `[<NON_ACTION_NOUN:STRING>]` |

- **Verification Evidence:** `python "<SKILL_DIR>/scripts/audit_copy.py" --workspace . --target "<TARGET_PATH>"` (`Exit Code: 0`, `"status": "ok"`)
```
