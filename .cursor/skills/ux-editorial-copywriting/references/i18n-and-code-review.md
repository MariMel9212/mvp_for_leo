# Safe i18n & Interface Code Review Specification

> **Skill guard** — This document is a reference for the ux-editorial-copywriting skill.
> It contains intentional standard values and examples that the linter MUST skip.

---

## 1. Ground Rules for Editing UI Strings in Codebases

When editing interface strings directly in software repositories (React, Vue, Next.js, Flutter, iOS, Android), UI text is tightly coupled to application logic, unit tests, analytics trackers, and internationalization (i18n) pipelines. A careless change can break builds, disrupt pluralization logic, or invalidate analytics telemetry.

---

## 2. Safe vs Risky Code Mutations

### 2.1 Safe Mutations (Autonomous Execution Permitted)
The following modifications are safe to perform directly during copywriting passes:
1. **Rewriting String Values**: Editing the user-facing text value inside dictionary entries or JSX elements without changing keys or component structure.
2. **Typography & Punctuation Normalization**:
   - Binding short prepositions with `\u00A0` (in JSON/TSX) or `&nbsp;` (in Markdown/HTML).
   - Replacing ASCII hyphens in `QR‑код`, `ПИН‑код`, `СМС‑код` with non-breaking hyphen (`\u2011`).
   - Replacing ASCII minus `-` with true mathematical minus `−` (`\u2212`) before numbers and currency (`−15%`, `−1 000 ₽`).
   - Removing trailing periods in 1–2 sentence toasts, alerts, and button labels.
3. **Escaping & Quote Style**: Preserving surrounding quotes (`"..."` vs `'...'`) and necessary string escape sequences (`\"`, `\'`, `\n`).

### 2.2 Risky Mutations (Requires Explicit Confirmation or Flagging)
Do NOT perform the following mutations autonomously:
1. **Localization Keys Mutation**: Never rename dictionary keys (e.g. `auth.login_cta` $\to$ `auth.sign_in_action`) unless the key itself is broken and the user explicitly requests renaming. Keys are referenced across multiple client platforms and backend schemas.
2. **Interpolation Token Tampering**: Never translate, alter, or remove interpolation tokens:
   - `{name}`, `{user_id}`, `%{count}`, `${amount}`, `{{item}}`.
3. **ICU Plural & Select Logic**: Russian ICU plural strings require strict retention of three forms (`one`, `few`, `many` or `other`):
   ```json
   "items_count": "{count, plural, one{# товар} few{# товара} many{# товаров} other{# товаров}}"
   ```
   Do not simplify or alter the plural syntax into a single generic phrase.
4. **Legal & Compliance Copy**: Disclaimers, license agreements, and data transfer notices must not be rewritten purely for brevity. When suggesting revisions, mark variants with `needs legal review`.
5. **Component Restructuring**: Do not alter component hierarchies, CSS class names, or data attributes (`data-testid`, `aria-label`) unless specifically instructed.

---

## 3. Extraction & Audit Runbook

To review and sanitize UI copy across an unfamiliar codebase:

1. **Extract Candidate Strings**:
   Run the deterministic extractor via PowerShell to catalog all Russian strings (including JSX props `label`, `placeholder`, `aria-label`, `helperText`, `errorText`, `title`, `alt`) across frontend source files and localization bundles:
   ```powershell
   python "<SKILL_DIR>/scripts/extract_ui_strings.py" --workspace . --target "src" --format md
   ```
   For compact JSON output to feed into an automated workflow:
   ```powershell
   python "<SKILL_DIR>/scripts/extract_ui_strings.py" --workspace . --target "locales/ru.json" --format json --compact
   ```

2. **Execute Editorial Audit**:
   Verify the extracted or edited files against all 35 deterministic editorial invariants:
   ```powershell
   python "<SKILL_DIR>/scripts/audit_copy.py" --workspace . --target "<PATH_TO_FILE_OR_DIR>"
   ```

3. **Format Surgical Diffs**:
   - Update only the intended UI copy strings.
   - Maintain the original key order in JSON/YAML dictionaries.
   - Run project test suites (`npm test`, `pytest`) to verify that snapshot tests or assertions are intact.
