#!/usr/bin/env python3
"""
UX Editorial & Copywriting Automated Linter (audit_copy.py - 2026 BigTech Edition).
Scans Markdown, HTML, JSON, and UI component files for AI copy slop,
vague calls-to-action, incomplete error messages, bureaucratic prepositional chains,
redundant adverbs, and screen typographical defects.

Standard: Google Antigravity 2.0 / agentskills.io (2026)
Zero external dependencies: uses standard library (re, sys, os, json, argparse, pathlib) exclusively.

Exit code 0: All editorial invariants satisfied.
Exit code 1: Editorial violations detected.
Exit code 2: Usage / configuration error.

Output: Token-sanitized single-line JSON (<= 50 tokens) by default; human text via --format text.
"""

import argparse
import json
import os
from pathlib import Path
import re
import sys

# Configure stdout and stderr for utf-8 on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# ---------------------------------------------------------------------------
# Compiled Verification Patterns (Ordered 1 to 35)
# ---------------------------------------------------------------------------

SKILL_REFERENCE_GUARD_PATTERN = re.compile(
    r'(?:^\s*>\s*\*\*Skill guard\*\*.*(?:ux-editorial-copywriting|skill|reference)|'
    r'^\s*---\s*\nname:\s*ux-editorial-copywriting)',
    re.IGNORECASE | re.MULTILINE,
)

# 1. AI Slop & Buzzword Blacklist (Bilingual English / Russian)
EN_SLOP_PATTERN = re.compile(
    r'\b(revolutionary|seamlessly|seamless|delighted|unleash|supercharge|elevate your|'
    r'game-changing|paradigm shift|groundbreaking|effortlessly|magical|state-of-the-art|'
    r'cutting-edge|streamline your workflow)\b',
    re.IGNORECASE,
)

RU_SLOP_PATTERN = re.compile(
    r'\b(инновационн\w*|революционн\w*|уникальн\w*|потрясающ\w*|невероятн\w*|бесшовн\w*|'
    r'суперсил\w*|горящие глаза|магическ\w*|волшебн\w*|раскр\w+\s+потенциал|наш удобный сервис|'
    r'дизайн со смыслом|интуитивн\w*|экосистем\w*|смарт|умный\s+сервис|умная\s+система)\b',
    re.IGNORECASE,
)

# 2. Vague Button CTAs (uninformative single-word placeholder verbs lacking direct object)
VAGUE_CTA_PATTERN = re.compile(
    r'(?:["\'`>\[\(«“‘„|]|^|(?<=:\s)|(?<=^[-*+]\s)|(?<=\d\.\s))\s*'
    r'(далее|ок|кликните сюда|кликнуть сюда|нажмите здесь|нажать сюда|подтвердить|купить|click here|submit|next|ok)'
    r'\s*(?:["\'`<\]\)»”’“|]|(?=[;,\.]?\s*$))',
    re.IGNORECASE | re.MULTILINE,
)

# 3. Incomplete Error Messages (vague complaining without recovery route)
VAGUE_ERROR_TRIGGER = re.compile(
    r'\b(oops|something went wrong|an error occurred|failed to process|failed to load|'
    r'failed to save|error 500|internal server error|что-то пошло не так|'
    r'произошла ошибка|не удалось загрузить|не удалось сохранить)\b',
    re.IGNORECASE,
)
ERROR_RECOVERY_KEYWORD = re.compile(
    r'\b(retry|try again|check|reload|contact|refresh|save as draft|'
    r'обновите|попробуйте|проверьте|свяжитесь|сохраните|повторите|нажмите)\b',
    re.IGNORECASE,
)

# 4. Bureaucratic Nominalization (Russian verbal nouns & Ilyakhov stop-words)
BUREAUCRACY_PATTERN = re.compile(
    r'\b(осуществление|предоставление доступа|произведение|выполнение настройки|'
    r'в целях обеспечения|произвести\s+(?:оплату|расчет|списание|выборку|удаление|отправку|настройку)|'
    r'осуществить\s+(?:вход|платеж|перевод|настройку|подключение|списание|выгрузку)|'
    r'совершить\s+(?:вход|покупку|платеж|действие|операцию|перевод)|'
    r'в настоящий момент|в настоящее время|носит обязательный характер|'
    r'является\s+(?:обязательным|необходимым)|данный\s+(?:функционал|раздел|модуль)|функционал|'
    r'пожалуйста,\s+подождите)\b',
    re.IGNORECASE,
)

# 5. Prepositional Knots (для [отглагольное сущ]) -> must use 'чтобы [глагол]'
PREPOSITION_CHAIN_PATTERN = re.compile(
    r'\bдля\s+(?:предотвращения|завершения|осуществления|обеспечения|проведения|выполнения|'
    r'получения|оформления|создания|входа|подтверждения|изменения|настройки|отправки|проверки|'
    r'подключения|активации|использования|выбора|синхронизации|редактирования|удаления|'
    r'сохранения|управления|просмотра|фильтрации|авторизации|регистрации|оплаты|'
    r'перевода|скачивания|выгрузки|обновления|восстановления)\b',
    re.IGNORECASE,
)

# 6. Redundant Adverbs (успешно [глагол]) -> actions cannot finish un-successfully
REDUNDANT_ADVERB_PATTERN = re.compile(
    r'\b(успешно\s+(?:оплачен\w*|сохранен\w*|выполнен\w*|создан\w*|обновлен\w*|удален\w*|'
    r'отправлен\w*|загружен\w*|скопирован\w*|добавлен\w*|применен\w*|активирован\w*|'
    r'зарегистрирован\w*|оформлен\w*|скачан\w*|завершен\w*|подключен\w*|изменен\w*))\b',
    re.IGNORECASE,
)

# 7. Orphan Russian Single-Letter Prepositions / Conjunctions without &nbsp; or \u00A0
ORPHAN_PREPOSITION_PATTERN = re.compile(
    r'(?:^|[\s«"\'\(\[\—\–])([вВсСиИкКуУоОаА])\x20(?=[а-яА-ЯёЁ0-9])'
)

# 8. Trailing Period in Standalone Headings & Buttons (including inside table cells)
TRAILING_TAG_PATTERN = re.compile(
    r'<([A-Za-z0-9_]*(?:Button|Heading|Title|Label)|h[1-6]|button)[^>]*>\s*([a-zA-Zа-яА-Я0-9][^<]*?\.)\s*<\/\1>',
    re.IGNORECASE,
)
MARKDOWN_BTN_PERIOD_PATTERN = re.compile(
    r'(?<!\!)\[([a-zA-Zа-яА-Я0-9][^\]\n]*?\.)\](?:\([^)]*\)|\[[^\]]*\])?'
)

# 9. Case suffix illiteracy on cardinal numbers (e.g. '2-х дней' -> '2 дня', '5-ти минут' -> '5 минут')
CARDINAL_SUFFIX_PATTERN = re.compile(
    r'\b\d+-(?:х|ух|ох|ёх|ти|ми|мя|хся)\s+[а-яА-ЯёЁ]{2,}\b',
    re.IGNORECASE,
)

# 10. Tier-1 AI Detection Triggers & Slop Vocabulary
TIER1_AI_TELLS_EN = re.compile(
    r'\b(delve(?:\s+into)?|tapestry|testament\s+to|beacon\s+of|pivotal\s+role|'
    r'crucial\s+aspect|vibrant\s+community|unravel\s+the|furthermore|moreover|'
    r'in\s+conclusion|to\s+sum\s+up|in\s+essence)\b',
    re.IGNORECASE,
)

TIER1_AI_TELLS_RU = re.compile(
    r'\b(в\s+современном\s+мире|в\s+век\s+(?:цифровых\s+)?технологий|в\s+эпоху\s+(?:стремительных\s+)?изменений|'
    r'не\s+секрет,\s+что|стоит\s+отметить(?:,\s+что)?|важно\s+подчеркнуть|нельзя\s+не\s+упомянуть|'
    r'играет\s+(?:ключевую|решающую)\s+роль|является\s+неотъемлемой\s+частью|открывает\s+новые\s+горизонты|'
    r'погрузитесь\s+в\s+(?:мир)?|гармоничное\s+сочетание|таким\s+образом(?:,\s*|\s*—\s*)|подводя\s+итог|'
    r'как\s+известно|ни\s+для\s+кого\s+не\s+секрет|очевидно,\s+что|следует\s+подчеркнуть|необходимо\s+отметить|'
    r'в\s+рамках\s+данной\s+задачи|с\s+целью\s+повышения|от\s+новичков\s+до\s+профессионалов)\b',
    re.IGNORECASE,
)

# 11. False-Depth Parallel Negation Cliché ("Not just X, but Y")
PARALLEL_NEGATION_RU = re.compile(
    r'\bне\s+просто\s+[а-яА-ЯёЁa-zA-Z0-9_-]+,\s+а\s+[а-яА-ЯёЁa-zA-Z0-9_-]+\b',
    re.IGNORECASE,
)
PARALLEL_NEGATION_EN = re.compile(
    r'\bnot\s+just\s+(?:a|an|the)?\s*[a-zA-Z0-9_-]+,\s+but\s+(?:a|an|the)?\s*[a-zA-Z0-9_-]+\b',
    re.IGNORECASE,
)

# 12. Decorative Emojis (Headings, Buttons, Badges, Bullets, Copy)
DECORATIVE_EMOJI_PATTERN = re.compile(
    r'[\u2728\u26A1\U0001F680\U0001F4A1\U0001F3AF\U0001F525\U0001F4CC\U0001F31F\U0001F9E0\U0001F4CA\U0001F4C8\U0001F916\U0001F389\U0001F50D\U0001F6E0\U0001F4A5\U0001F44D\U0001F44E]',
    re.UNICODE,
)

# 13. Bilingual Parenthetical Echoes
BRACKET_DUPLICATION_RU_EN = re.compile(
    r'\b([а-яА-ЯёЁ]{3,})\s*\(\s*[\'"«“]?(?:(?:англ\.|пер\.|сокр\.|перевод|orig\.?)\s*)?([A-Za-z0-9\s/&—–\-\'\"«»“”]+)\s*[\'"»”]?\)',
    re.UNICODE | re.IGNORECASE,
)
BRACKET_DUPLICATION_EN_RU = re.compile(
    r'\b([a-zA-Z]{2,})\s*\(\s*[\'"«“]?(?:(?:рус\.|пер\.|сокр\.|перевод)\s*)?([а-яА-ЯёЁ0-9\s/&—–\-\'\"«»“”]+)\s*[\'"»”]?\)',
    re.UNICODE | re.IGNORECASE,
)

ALLOWED_TECHNICAL_BRACKET_ACRONYMS = {
    'csv', 'faq', 'png', 'svg', 'pdf', 'jpg', 'jpeg', 'webp', 'gif',
    'api', 'json', 'yaml', 'yml', 'html', 'css', 'sql', 'xml',
    'id', 'uuid', 'url', 'uri', 'http', 'https', 'rpc', 'grpc', 'rest',
    'sdk', 'cli', 'gui', 'ui', 'ux', 'db', 'dal', 'orm', 'jwt', 'sso', 'oidc',
    'ram', 'cpu', 'gpu', 'io', 'os', 'mb', 'gb', 'kb', 'tb', 'ms', 'fps',
    'pr', 'ci', 'cd', 'mcp'
}

# 14. Scaffolding Leakage & Opaque Cipher Dumps
SCAFFOLDING_LEAKAGE_PATTERN = re.compile(
    r'(?:'
    r'\bпо\s+формуле\s+(?:Google\s+)?X-?Y-?Z\b|'
    r'\bформул[аеы]\s+(?:Google\s+)?X-?Y-?Z\b|'
    r'\bпо\s+методологии\s+(?:UX\s+)?STAR\b|'
    r'\bпо\s+фреймворку\s+[A-Za-zА-Яа-я0-9_-]+\b|'
    r'\bGoogle\s+X-?Y-?Z(?:\s+метрики|\s+telemetry)?\b|'
    r'\b(?:проблем\w*|гипотез\w*|требован\w*|баг\w*|задач\w*|ошиб\w*|фактор\w*|сегмент\w*|эпик\w*|сценари\w*|кейс\w*)\s+[A-Za-zА-Яа-я]-?\d+(?:[-–—][A-Za-zА-Яа-я]?-?\d+)?\b|'
    r'\bартефакт\s+\d+\s+(?:решает|закрывает|устраняет)\b|'
    r'\bзона\s+среды\s+\d+\b|'
    r'\b\d+\s+фотосвидетельств\w*\b'
    r')',
    re.IGNORECASE,
)

# 15. Gary Provost Sentence Rhythm (implemented via check_sentence_rhythm() function below)

# 16. Formal Capital Вы (bureaucratic distance) — must be lowercase «вы»
CAPITAL_VY_PATTERN = re.compile(
    r'\b(Вы|Вам|Вас|Ваш|Ваша|Ваше|Ваши|Вашего|Вашей|Вашему|Вашим|Вашими|Ваших)\b'
)

# 17. Gendered Slash/Paren Forms — must use gender-free structures
GENDERED_FORM_PATTERN = re.compile(
    r'\b(?:подал/подала|согласен\(на\)|согласен/согласна|уважаемый/уважаемая|'
    r'пользовател[ья](?:/\w+)?\s*\(?(?:а|я)\)|заявител[ья]\s*\(?(?:а|я)\))',
    re.IGNORECASE,
)

# 18-19. Generic & overlong link anchors [anchor](url) — negative lookbehind excludes ![alt](url)
MARKDOWN_LINK_ANCHOR_PATTERN = re.compile(
    r'(?<!\!)\[([^\]]+)\]\([^)]+\)'
)
GENERIC_LINK_ANCHORS = frozenset({
    'тут', 'здесь', 'подробнее', 'далее', 'сюда',
    'here', 'click here', 'more', 'read more', 'learn more',
})

# 20. Currency glued without any space: digit + ₽ (must be «1 000&nbsp;₽» or «1 000\u00A0₽»)
CURRENCY_GLUED_PATTERN = re.compile(r'\d\u20bd')

# 21. Straight double quotes around Cyrillic (must be «...» / „...“)
STRAIGHT_QUOTES_RU_PATTERN = re.compile(r'"[^"\n]*[а-яА-ЯёЁ][^"\n]*"')

# 22. Non-breaking hyphen in short acronyms (QR-код -> QR‑код with \u2011)
NONBREAKING_HYPHEN_PATTERN = re.compile(r'\b(QR|ПИН|СМС|SMS|CVV|CVC)-(код\w*)\b', re.IGNORECASE)

# 23. ASCII hyphen instead of mathematical minus before numbers/percentages/temperatures (-5% -> −5% with \u2212)
ASCII_MINUS_PATTERN = re.compile(r'(?:^|[\s«"\'\(\[])-(?=\d+(?:[\s\u00A0]\d+)*(?:[,.]\d+)?(?:\s*(?:%|₽|\$|€|°C|°)))')

# 24. Space before percent symbol (15 % -> 15%)
PERCENT_SPACE_PATTERN = re.compile(r'\b\d+\s+%')

# 25. Banned first-person or system continuous CTA («Хочу удалить», «Сохраняю», «Я понял»)
FIRST_PERSON_CTA_PATTERN = re.compile(
    r'(?:["\'`>\[\(«“„|]|^|(?<=:\s)|(?<=^[-*+]\s)|(?<=\d\.\s))\s*'
    r'(хочу\s+(?:удалить|закрыть|оформить|купить|подключить|отменить|выйти|сохранить)|сохраняю|я\s+(?:понял|согласен|прочитал))'
    r'\s*(?:["\'`<\]\)»”’“|]|(?=[;,\.]?\s*$))',
    re.IGNORECASE | re.MULTILINE,
)

# 26. Banned instructional commands in form field labels & placeholders
INSTRUCTIONAL_INPUT_PATTERN = re.compile(
    r'(?:placeholder|label|плейсхолдер|лейбл)\s*[:=]\s*["\'«]?\s*'
    r'(?:введите\s+(?:ваш\w*\s+|сво[йеюи]\w*\s+)?(?:номер|телефон|email|почту|пароль|логин|имя|фамилию|сумму|город|код|адрес|дату|инн|название|запрос|текст|данные|значение)|'
    r'напишите\s+(?:комментарий|отзыв|сообщение|текст)|начните\s+(?:писать|вводить))\b',
    re.IGNORECASE,
)

# 27. Trailing period in 1-2 sentence UI copy blocks (<Alert>, <Toast>, etc.)
TWO_SENTENCE_TAG_PATTERN = re.compile(
    r'<([A-Za-z0-9_]*(?:Alert|Toast|Snackbar|Notification|Modal|Card|Banner))[^>]*>\s*([^<]+?\.)\s*<\/\1>',
    re.IGNORECASE,
)

# 28. Trailing dot after Russian interface abbreviations (тыс., млн., мин., сек., ч., МБ., ГБ., шт., руб., гр.)
ABBREVIATION_DOT_PATTERN = re.compile(
    r'(?:(?:(?<=\d\s)|(?<=\d\u00A0)|(?<=&nbsp;))(тыс|млн|млрд|мин|сек|ч|МБ|ГБ|КБ|ТБ|шт|руб|гр)|\b(тыс|млн|млрд|мин|сек|МБ|ГБ|КБ|ТБ|шт|руб))\.(?!\s*[А-ЯЁA-Z])',
    re.UNICODE,
)

# 29. Double-negative toggle / switch / checkbox labels («Не показывать баланс», «Не отправлять уведомления»)
NEGATIVE_TOGGLE_PATTERN = re.compile(
    r'(?:<(?P<tag>[A-Za-z0-9_]*(?:Switch|Toggle|Checkbox))[A-Za-z0-9_\s="\':-]*>\s*(?P<inner>Не\s+[а-яА-ЯёЁ]+\b[^<]*)|'
    r'(?:Switch|Toggle|Checkbox|Тумблер|Переключатель|Чекбокс)[^\n]*?[:=]\s*["\'«]?(?P<label>Не\s+(?:показывать|отправлять|уведомлять|сохранять|отображать|включать|использовать|присылать|запрашивать)\b[^"\'\n»]*))',
    re.IGNORECASE,
)

# 30. Illiterate ordinal number suffixes (1-ый, 2-ой, 3-ий, 5-ого, 2-ому, 3-им -> must be 1-й, 2-й, 3-й, 5-го, 2-му)
ILLITERATE_ORDINAL_PATTERN = re.compile(
    r'\b\d+-(?:ый|ой|ий|ого|его|ому|ему|ым|им|ая|яя|ое|ее|ые|ие|ых|их|ую|юю)\b',
    re.IGNORECASE,
)

# 31. Redundant ordinal suffixes on calendar dates and years (25-го сентября, 2026-го года, в 2026-м году)
DATE_ORDINAL_SUFFIX_PATTERN = re.compile(
    r'\b(?:\d{4}-(?:го|м|й|ому)\s+год\w*|\d{1,2}-(?:го|е|я|м)\s+(?:января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря))\b',
    re.IGNORECASE,
)

# 32. Spaced en-dash in numeric ranges or hybrid preposition-dash (10 – 15 мин, с 10:00–19:00)
NUMERIC_RANGE_DASH_PATTERN = re.compile(
    r'(?:\b\d+(?:[.,:]\d+)?\s+–\s+\d+(?:[.,:]\d+)?\b|\b(?:с|от)\s+\d+(?:[.,:]\d+)?\s*[–—-]\s*\d+(?:[.,:]\d+)?\b)',
    re.IGNORECASE,
)

# 33. English calques & neural rhetorical slop (на ежедневной основе, пользовательский опыт, не только X, но и Y, давайте разберемся, будь то)
ENGLISH_CALQUE_PATTERN = re.compile(
    r'\b(?:на\s+(?:ежедневной|регулярной|постоянной|еженедельной|ежемесячной)\s+основе|'
    r'давайте\s+(?:разберемся|посмотрим|разберем|рассмотрим)|'
    r'будь\s+то\s+[а-яА-ЯёЁa-zA-Z0-9_-]+\s+или|'
    r'не\s+только\s+[^,.!\n]{2,40},\s*но\s+и|'
    r'пользовательск(?:ий|ого|ому|им|ом|ие|их)\s+опыт\w*)\b',
    re.IGNORECASE,
)

# 34. Passive auxiliary calques (был отправлен, была создана, было выполнено, были сохранены)
PASSIVE_CALQUE_PATTERN = re.compile(
    r'\b(?:был|была|было|были)\s+(?:успешно\s+)?(?:отправлен\w*|создан\w*|сохранен\w*|выполнен\w*|'
    r'удален\w*|обновлен\w*|загружен\w*|добавлен\w*|оплачен\w*|применен\w*|завершен\w*|изменен\w*|'
    r'сформирован\w*|отклонен\w*|заблокирован\w*)\b',
    re.IGNORECASE,
)

# 35. Possessive pronoun bloat on routine inputs (Введите ваш пароль, Укажите ваш номер телефона)
POSSESSIVE_BLOAT_PATTERN = re.compile(
    r'\b(?:введите|укажите|проверьте|подтвердите)\s+(?:ваш\w*|сво[йеюи]\w*)\s+'
    r'(?:пароль|код|телефон|номер|почту|email|логин|адрес|пин|инн)\b',
    re.IGNORECASE,
)

MAX_FILE_BYTES = 1_000_000


# ---------------------------------------------------------------------------
# Sentence Rhythm Check (Gary Provost Law)
# ---------------------------------------------------------------------------

def check_sentence_rhythm(content: str) -> list[str]:
    violations = []
    paragraphs = []
    current_p = []
    in_code = False

    for line in content.splitlines():
        s = line.strip()
        if s.startswith('```'):
            in_code = not in_code
            continue
        if in_code or s.startswith(('#', '-', '*', '+', '|', '>', 'import ', 'export ')):
            if current_p:
                paragraphs.append(" ".join(current_p))
                current_p = []
            continue
        if len(s) == 0:
            if current_p:
                paragraphs.append(" ".join(current_p))
                current_p = []
        else:
            current_p.append(s)

    if current_p:
        paragraphs.append(" ".join(current_p))

    sentences = []
    for p in paragraphs:
        raw = re.split(r'(?<=[.!?])\s+', p)
        sentences.extend([s.strip() for s in raw if len(s.strip().split()) >= 3])

    if len(sentences) >= 5:
        lengths = [len(s.split()) for s in sentences]
        for i in range(len(lengths) - 2):
            l1, l2, l3 = lengths[i], lengths[i+1], lengths[i+2]
            if max(l1, l2, l3) - min(l1, l2, l3) <= 1 and l1 >= 10:
                snippet = f'"{sentences[i][:45]}..."'
                violations.append(
                    f"Monotone sentence rhythm (AI tell): 3 consecutive sentences with identical word counts "
                    f"({l1}, {l2}, {l3} words) near {snippet}. "
                    f"Apply Gary Provost law: alternate short punchy phrases (1-5 words) with standard (8-14) and complex (20-30) periods."
                )
                break
    return violations


# ---------------------------------------------------------------------------
# Core File Audit Function
# ---------------------------------------------------------------------------

def check_copy_file(filepath: str) -> list[str]:
    violations = []
    p = Path(filepath).resolve()

    norm_path = p.as_posix().lower()
    if norm_path.endswith('/skill.md') or norm_path.endswith('skill.md') or norm_path.endswith('skill.md.disabled'):
        return []

    try:
        if p.stat().st_size > MAX_FILE_BYTES:
            return [f"File exceeds maximum allowable size ({MAX_FILE_BYTES} bytes)"]
        with open(filepath, 'r', encoding='utf-8-sig', errors='replace') as f:
            lines = f.readlines()
    except Exception as e:
        return [f"Unable to read file: {e}"]

    content = "".join(lines)

    if SKILL_REFERENCE_GUARD_PATTERN.search(content):
        return []

    # Pre-compute line indices inside fenced code blocks (``` ... ```)
    in_code = False
    code_line_indices = set()
    for idx, raw_line in enumerate(lines, start=1):
        s_line = raw_line.strip()
        if s_line.startswith('```'):
            in_code = not in_code
            code_line_indices.add(idx)
            continue
        if in_code:
            code_line_indices.add(idx)

    # Pre-compute non-code line contexts with inline backtick code stripped
    # raw_no_code preserves literal &nbsp; for Check 7 (orphan prepositions);
    # clean_line normalizes &nbsp; to space so lexical/grammar regexes cannot be bypassed by &nbsp;
    raw_valid_lines = [
        (idx, raw_line, re.sub(r'`[^`]*`', '', raw_line))
        for idx, raw_line in enumerate(lines, start=1)
        if idx not in code_line_indices
    ]
    valid_lines = [
        (idx, raw_line, no_code.replace('&nbsp;', ' '))
        for idx, raw_line, no_code in raw_valid_lines
    ]

    # Check 1: AI Slop Blacklist
    for idx, line, clean_line in valid_lines:
        en_match = EN_SLOP_PATTERN.search(clean_line)
        if en_match:
            violations.append(
                f"Line {idx}: Banned English AI-slop term '{en_match.group(0)}'. "
                f"Replace with factual functional specification."
            )
        ru_match = RU_SLOP_PATTERN.search(clean_line)
        if ru_match:
            violations.append(
                f"Line {idx}: Banned Russian AI-slop term '{ru_match.group(0)}'. "
                f"Replace with factual specification or active verb."
            )

    # Check 2: Vague Button CTAs
    for idx, line, clean_line in valid_lines:
        s_line = clean_line.strip()
        if s_line.startswith(('import ', 'export ', 'from ')):
            continue
        vague_cta_matches = VAGUE_CTA_PATTERN.finditer(s_line)
        for m in vague_cta_matches:
            term = m.group(1)
            violations.append(
                f"Line {idx}: Banned vague CTA '{term}'. Uninformative single-word placeholders "
                f"('Далее', 'Подтвердить', 'Ок', 'Купить', 'Submit', 'Next') are prohibited. "
                f"Use '[Strong Verb] + [Direct Object]' or an approved concise action (e.g. 'Save changes' or 'Сохранить')."
            )

    # Check 3: Incomplete Error Messages
    for idx, line, clean_line in valid_lines:
        if VAGUE_ERROR_TRIGGER.search(clean_line):
            block_lines = [clean_line]
            for forward_idx in range(idx, min(len(lines), idx + 3)):
                f_line = lines[forward_idx]
                if not f_line.strip() or f_line.strip().startswith('#'):
                    break
                block_lines.append(re.sub(r'`[^`]*`', '', f_line))
            error_block = " ".join(block_lines)
            if not ERROR_RECOVERY_KEYWORD.search(error_block):
                violations.append(
                    f"Line {idx}: Incomplete error message. Error copy must provide an actionable "
                    f"exit route (e.g. 'check connection and retry'). MUST follow event + reason + exit route."
                )

    # Check 4: Bureaucratic Nominalization
    for idx, line, clean_line in valid_lines:
        b_match = BUREAUCRACY_PATTERN.search(clean_line)
        if b_match:
            violations.append(
                f"Line {idx}: Bureaucratic verbal noun '{b_match.group(0)}'. "
                f"Replace with direct active verb (e.g. 'настроить' instead of 'выполнение настройки')."
            )

    # Check 5: Prepositional Knots (для [отглагольное сущ])
    for idx, line, clean_line in valid_lines:
        pk_match = PREPOSITION_CHAIN_PATTERN.search(clean_line)
        if pk_match:
            violations.append(
                f"Line {idx}: Bureaucratic prepositional knot '{pk_match.group(0)}'. "
                f"Replace 'для [сущ]' with 'чтобы [глагол]' (e.g. 'чтобы не потерять' instead of 'для предотвращения потери')."
            )

    # Check 6: Redundant Adverbs (успешно [глагол])
    for idx, line, clean_line in valid_lines:
        ra_match = REDUNDANT_ADVERB_PATTERN.search(clean_line)
        if ra_match:
            violations.append(
                f"Line {idx}: Redundant adverb '{ra_match.group(0)}'. "
                f"Actions cannot finish 'un-successfully'. Use plain participle or verb (e.g. 'Оплачено', 'Сохранено')."
            )

    is_code_or_dict_file = norm_path.endswith(('.json', '.tsx', '.jsx'))

    # Check 7: Orphan Russian Prepositions (in Markdown/HTML/TXT specs; skip JSON/TSX where raw &nbsp; is invalid)
    if not is_code_or_dict_file:
        for idx, line, raw_no_code in raw_valid_lines:
            if raw_no_code.strip().startswith(('http://', 'https://', '---')):
                continue
            orphan_matches = ORPHAN_PREPOSITION_PATTERN.findall(raw_no_code)
            if orphan_matches:
                violations.append(
                    f"Line {idx}: Orphan Russian preposition(s) '{', '.join(orphan_matches)}' "
                    f"separated by regular space. Bind with '&nbsp;' (or '\\u00A0') to prevent line-break splitting."
                )

    # Check 8: Trailing Period in Standalone Headings & Buttons (including in tables & lists)
    for idx, line, clean_line in valid_lines:
        s_line = clean_line.strip()
        if s_line.startswith('#'):
            if re.search(r'^#{1,6}\s+.*[a-zA-Zа-яА-Я0-9]\.\s*$', s_line) and not s_line.endswith('...'):
                violations.append(
                    f"Line {idx}: Standalone heading '{s_line}' ends with a trailing period. "
                    f"Headings must not end with a full stop."
                )
        tag_match = TRAILING_TAG_PATTERN.search(clean_line)
        if tag_match:
            tag_name = tag_match.group(1)
            inner_str = tag_match.group(2).strip()
            if not inner_str.endswith('...') and not inner_str.endswith('etc.'):
                violations.append(
                    f"Line {idx}: Standalone <{tag_name}> '{inner_str}' ends with a trailing period. "
                    f"Headings and button labels must not have a full stop."
                )
        for btn_match in MARKDOWN_BTN_PERIOD_PATTERN.finditer(clean_line):
            btn_label = btn_match.group(1).strip()
            if not btn_label.endswith('...') and not btn_label.endswith('etc.'):
                violations.append(
                    f"Line {idx}: Standalone button link '[{btn_label}]' ends with a trailing period. "
                    f"Button labels must not have a full stop."
                )

    # Check 9: Cardinal Number Suffixes (2-х дней -> 2 дня)
    for idx, line, clean_line in valid_lines:
        cs_match = CARDINAL_SUFFIX_PATTERN.search(clean_line)
        if cs_match:
            violations.append(
                f"Line {idx}: Banned case suffix on cardinal number '{cs_match.group(0)}'. "
                f"Write clean numbers: '2 дня', '5 карт' instead of '2-х дней'."
            )

    # Check 10: Tier-1 AI Detection Triggers & Structural Clichés
    for idx, line, clean_line in valid_lines:
        if clean_line.strip().startswith(('http://', 'https://', '---')):
            continue
        t1_en = TIER1_AI_TELLS_EN.search(clean_line)
        if t1_en:
            violations.append(
                f"Line {idx}: High-perplexity AI detection trigger '{t1_en.group(0)}'. "
                f"Replace with direct empirical phrasing or human verb."
            )
        t1_ru = TIER1_AI_TELLS_RU.search(clean_line)
        if t1_ru:
            violations.append(
                f"Line {idx}: High-perplexity AI detection trigger '{t1_ru.group(0)}'. "
                f"Replace with concrete action or eliminate rhetorical filler."
            )

    # Check 11: False-Depth Parallel Negations ("Not just X, but Y")
    for idx, line, clean_line in valid_lines:
        neg_ru = PARALLEL_NEGATION_RU.search(clean_line)
        if neg_ru:
            violations.append(
                f"Line {idx}: AI false-depth cliché '{neg_ru.group(0)}' (Not just X, but Y). "
                f"State directly what the feature does without artificial drama."
            )
        neg_en = PARALLEL_NEGATION_EN.search(clean_line)
        if neg_en:
            violations.append(
                f"Line {idx}: AI false-depth cliché '{neg_en.group(0)}' (Not just X, but Y). "
                f"State directly what the feature does."
            )

    # Check 12: Decorative Emojis
    for idx, line, clean_line in valid_lines:
        if clean_line.strip().startswith(('http://', 'https://', '---')):
            continue
        emoji_match = DECORATIVE_EMOJI_PATTERN.search(clean_line)
        if emoji_match:
            violations.append(
                f"Line {idx}: AI emoji bullet slop or decorative emoji '{emoji_match.group(0)}'. "
                f"Eliminate decorative emojis from headings, buttons, bullet points, and copy."
            )

    # Check 13: Bilingual Parenthetical Echoes
    for idx, line, clean_line in valid_lines:
        if clean_line.strip().startswith(('http://', 'https://', '---')):
            continue
        for m in BRACKET_DUPLICATION_RU_EN.finditer(clean_line):
            g2 = m.group(2).strip()
            if g2.lower() in ALLOWED_TECHNICAL_BRACKET_ACRONYMS:
                continue
            if len(re.findall(r'[A-Za-z]', g2)) >= 2 and not re.search(r'[а-яА-ЯёЁ]', g2):
                violations.append(
                    f"Line {idx}: Schoolchild bilingual parenthetical echo '{m.group(0)}'. "
                    f"Choose ONE language: use the accepted Russian term or the English term without parenthetical translation."
                )
        for m in BRACKET_DUPLICATION_EN_RU.finditer(clean_line):
            g2 = m.group(2).strip()
            if len(re.findall(r'[а-яА-ЯёЁ]', g2)) >= 2 and not re.search(r'[A-Za-z]', g2):
                violations.append(
                    f"Line {idx}: Schoolchild bilingual parenthetical echo '{m.group(0)}'. "
                    f"Choose ONE language without parenthetical translation."
                )

    # Check 14: Prompt Scaffolding Leakage & Cipher Dumps
    for idx, line, clean_line in valid_lines:
        if clean_line.strip().startswith(('http://', 'https://', '---')):
            continue
        scaffold_match = SCAFFOLDING_LEAKAGE_PATTERN.search(clean_line)
        if scaffold_match:
            violations.append(
                f"Line {idx}: Prompt scaffolding leakage or internal cipher dump '{scaffold_match.group(0)}'. "
                f"Internal methodology formulas ('Google X-Y-Z', 'STAR'), Jira/PRD ciphers ('R1-R7', 'H1-H3'), and protocol tags MUST NOT leak into user-facing copy."
            )

    # Check 15: Gary Provost Sentence Rhythm
    rhythm_violations = check_sentence_rhythm(content)
    violations.extend(rhythm_violations)

    # Check 16: Formal Capital Вы (peer persona requires lowercase вы)
    for idx, line, clean_line in valid_lines:
        if clean_line.strip().startswith(('http://', 'https://', '---')):
            continue
        vy_match = CAPITAL_VY_PATTERN.search(clean_line)
        if vy_match:
            violations.append(
                f"Line {idx}: Formal capital '{vy_match.group(0)}' creates bureaucratic distance. "
                f"Use lowercase «вы/вам/вас/ваш» (peer-to-peer BigTech standard)."
            )

    # Check 17: Gendered Slash/Paren Forms (подал/подала, согласен(на))
    for idx, line, clean_line in valid_lines:
        if clean_line.strip().startswith(('http://', 'https://', '---')):
            continue
        g_match = GENDERED_FORM_PATTERN.search(clean_line)
        if g_match:
            violations.append(
                f"Line {idx}: Gendered slash/paren form '{g_match.group(0)}'. "
                f"Use gender-free structures («Карта потерялась», participial clauses)."
            )

    # Check 18-19: Link Anchors — generic words & overlong anchors (>5 words)
    for idx, line, clean_line in valid_lines:
        for m in MARKDOWN_LINK_ANCHOR_PATTERN.finditer(clean_line):
            anchor = m.group(1).strip()
            anchor_words = [w for w in re.split(r'\s+', anchor) if w]
            if anchor.lower().strip('«»""\'\'„“.,!?') in GENERIC_LINK_ANCHORS:
                violations.append(
                    f"Line {idx}: Generic link anchor '[{anchor}]'. "
                    f"State the destination entity («Условия подписки», «Тарифы на эквайринг»)."
                )
            elif len(anchor_words) > 5:
                violations.append(
                    f"Line {idx}: Overlong link anchor '[{anchor}]' ({len(anchor_words)} words). "
                    f"Keep link anchors ≤ 5 words."
                )

    # Check 20: Currency Glued Without Space (1000₽ -> requires non-breaking space «1 000&nbsp;₽»)
    for idx, line, clean_line in valid_lines:
        if clean_line.strip().startswith(('http://', 'https://', '---')):
            continue
        cur_match = CURRENCY_GLUED_PATTERN.search(clean_line)
        if cur_match:
            violations.append(
                f"Line {idx}: Currency glued without space '{cur_match.group(0)}'. "
                f"Separate number and ₽ with a non-breaking space («1 000&nbsp;₽»)."
            )

    # Check 21: Straight Double Quotes Around Cyrillic (must be «...» in prose; ignore JSON & HTML/JSX syntax attributes)
    if not norm_path.endswith('.json'):
        for idx, line, clean_line in valid_lines:
            if clean_line.strip().startswith(('http://', 'https://', '---')):
                continue
            line_for_quotes = re.sub(r'\b[a-zA-Z0-9_:-]+\s*=\s*"[^"]*"', '', clean_line)
            q_match = STRAIGHT_QUOTES_RU_PATTERN.search(line_for_quotes)
            if q_match:
                violations.append(
                    f"Line {idx}: Straight quotes {q_match.group(0)} around Cyrillic. "
                    f"Use French guillemets «...» (inner „...“)."
                )

    # Check 22: Non-breaking hyphen in short acronyms (QR-код -> QR‑код with \u2011)
    for idx, line, clean_line in valid_lines:
        if clean_line.strip().startswith(('http://', 'https://', '---')):
            continue
        for m in NONBREAKING_HYPHEN_PATTERN.finditer(clean_line):
            violations.append(
                f"Line {idx}: ASCII hyphen in '{m.group(0)}'. "
                f"Use non-breaking hyphen '‑' (\\u2011) to prevent splitting: '{m.group(1)}\\u2011{m.group(2)}'."
            )

    # Check 23: Mathematical minus sign instead of ASCII hyphen (-5% -> −5% with \u2212)
    for idx, line, clean_line in valid_lines:
        if clean_line.strip().startswith(('http://', 'https://', '---')):
            continue
        for m in ASCII_MINUS_PATTERN.finditer(clean_line):
            violations.append(
                f"Line {idx}: ASCII hyphen '-' used as minus in '{m.group(0).strip()}'. "
                f"Use mathematical minus sign '−' (\\u2212) before negative numbers and percentages (e.g. '−5%', '−1 000 ₽')."
            )

    # Check 24: Space before percent symbol (15 % -> 15%)
    for idx, line, clean_line in valid_lines:
        if clean_line.strip().startswith(('http://', 'https://', '---')):
            continue
        for m in PERCENT_SPACE_PATTERN.finditer(clean_line):
            violations.append(
                f"Line {idx}: Space before percent symbol in '{m.group(0)}'. "
                f"Write percent symbol attached directly to number without space: e.g. '15%' instead of '15 %'."
            )

    # Check 25: First-person or system continuous CTA («Хочу удалить», «Сохраняю», «Я понял»)
    for idx, line, clean_line in valid_lines:
        s_line = clean_line.strip()
        if s_line.startswith(('import ', 'export ', 'from ')):
            continue
        for m in FIRST_PERSON_CTA_PATTERN.finditer(s_line):
            term = m.group(1)
            violations.append(
                f"Line {idx}: Banned first-person or continuous CTA '{term}'. "
                f"Button labels must be direct infinitives/imperatives ('Сохранить', 'Удалить') or natural agreements ('Понятно')."
            )

    # Check 26: Instructional commands in form field labels and placeholders
    for idx, line, clean_line in valid_lines:
        if clean_line.strip().startswith(('http://', 'https://', '---')):
            continue
        for m in INSTRUCTIONAL_INPUT_PATTERN.finditer(clean_line):
            violations.append(
                f"Line {idx}: Banned instructional command in form label/placeholder '{m.group(0)}'. "
                f"Labels name data ('Номер телефона'), placeholders demonstrate format ('+7 999 000-00-00')."
            )

    # Check 27: Trailing dot in 1-2 sentence UI copy blocks (<Alert>, <Toast>, etc.)
    for idx, line, clean_line in valid_lines:
        for tag_m in TWO_SENTENCE_TAG_PATTERN.finditer(clean_line):
            tag_name = tag_m.group(1)
            body = tag_m.group(2).strip()
            boundaries = re.findall(r'[.!?…]+[»”’"\'\)\]]*\s+(?=[А-ЯA-Z])', body)
            sent_count = len(boundaries) + 1
            if sent_count in (1, 2) and body.endswith('.') and not body.endswith('...'):
                violations.append(
                    f"Line {idx}: Trailing period in {sent_count}-sentence <{tag_name}> '{body}'. "
                    f"In 1-2 sentence UI microcopy, remove the final period (preserve sentence-dividing periods)."
                )

    # Check 28: Trailing dot after interface abbreviations (тыс., мин., сек., ч., МБ., руб., гр.)
    for idx, line, clean_line in valid_lines:
        if clean_line.strip().startswith(('http://', 'https://', '---')):
            continue
        for m in ABBREVIATION_DOT_PATTERN.finditer(clean_line):
            abbr = m.group(1) or m.group(2)
            violations.append(
                f"Line {idx}: Trailing period after interface abbreviation '{abbr}.'. "
                f"Write interface units without dots: '{abbr}' (e.g. '10 тыс', '5 мин', '1,5 МБ', '500 ₽')."
            )

    # Check 29: Negative toggle/switch/checkbox labels
    for idx, line, clean_line in valid_lines:
        for m in NEGATIVE_TOGGLE_PATTERN.finditer(clean_line):
            bad_toggle = (m.group("inner") or m.group("label") or m.group(0)).strip()
            violations.append(
                f"Line {idx}: Negative toggle/switch label '{bad_toggle}'. "
                f"Formulate switches and checkboxes strictly in the affirmative (e.g. 'Показывать баланс' instead of 'Не показывать баланс')."
            )

    # Check 30: Illiterate ordinal suffixes (1-ый, 2-ой, 3-ий, 5-ого)
    for idx, line, clean_line in valid_lines:
        for m in ILLITERATE_ORDINAL_PATTERN.finditer(clean_line):
            violations.append(
                f"Line {idx}: Illiterate ordinal suffix '{m.group(0)}'. "
                f"Use 1- or 2-letter Russian orthography suffixes: '1-й', '2-й', '3-й', '5-го', '2-му' (Gramota.ru standard)."
            )

    # Check 31: Redundant ordinal suffixes on dates and years (25-го сентября, 2026-го года, в 2026-м году)
    for idx, line, clean_line in valid_lines:
        for m in DATE_ORDINAL_SUFFIX_PATTERN.finditer(clean_line):
            violations.append(
                f"Line {idx}: Redundant ordinal suffix on calendar date or year '{m.group(0)}'. "
                f"Write dates and years without suffixes: '25 сентября', '2026 года', 'в 2026 году'."
            )

    # Check 32: Spaced en-dash in numeric ranges or hybrid preposition-dash (10 – 15 мин, с 10:00–19:00)
    for idx, line, clean_line in valid_lines:
        for m in NUMERIC_RANGE_DASH_PATTERN.finditer(clean_line):
            violations.append(
                f"Line {idx}: Invalid numeric range formatting '{m.group(0)}'. "
                f"Use unspaced en-dash '–' between digits ('10–15 мин', '19:00–20:00') or full prepositions ('с 10:00 до 19:00')."
            )

    # Check 33: English calques & neural rhetorical slop
    for idx, line, clean_line in valid_lines:
        if clean_line.strip().startswith(('http://', 'https://', '---')):
            continue
        for m in ENGLISH_CALQUE_PATTERN.finditer(clean_line):
            violations.append(
                f"Line {idx}: English calque or neural rhetorical cliché '{m.group(0)}'. "
                f"Replace with natural Russian ('каждый день', 'удобство работы', 'X и Y', or direct statement)."
            )

    # Check 34: Passive auxiliary calques (был отправлен, была создана)
    for idx, line, clean_line in valid_lines:
        for m in PASSIVE_CALQUE_PATTERN.finditer(clean_line):
            violations.append(
                f"Line {idx}: Passive auxiliary calque '{m.group(0)}'. "
                f"Use active team voice ('Отправили код') or concise result state without 'был' ('Заявка создана')."
            )

    # Check 35: Possessive pronoun bloat on routine inputs (Введите ваш пароль)
    for idx, line, clean_line in valid_lines:
        for m in POSSESSIVE_BLOAT_PATTERN.finditer(clean_line):
            violations.append(
                f"Line {idx}: Redundant possessive pronoun in '{m.group(0)}'. "
                f"Omit calqued 'ваш/свой' in routine actions: write 'Введите пароль', 'Укажите номер телефона'."
            )

    return violations


# ---------------------------------------------------------------------------
# Path Resolution & CLI Execution
# ---------------------------------------------------------------------------

def resolve_target_files(target_path: Path, skill_root: Path) -> tuple[list[Path], list[Path]]:
    """
    Discovers files to check and applies Skill Reference Guards.
    Guarantees that files in skill references are safely skipped while user project files are scanned.
    """
    to_check = []
    skipped = []

    ignored_dirs = {
        'node_modules', '.git', '.github', 'dist', 'build', '.next', '.astro',
        '.svelte-kit', 'out', '__pycache__', '.old-skills', '.knowledge', '.agents'
    }
    ignored_files = {
        'package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'package.json',
        'tsconfig.json', 'components.json'
    }

    if target_path.is_file():
        candidates = [target_path]
    elif target_path.is_dir():
        candidates = []
        for root, dirs, files in os.walk(target_path):
            dirs[:] = [d for d in dirs if d not in ignored_dirs]
            for f in files:
                if f in ignored_files:
                    continue
                if f.endswith(('.md', '.markdown', '.txt', '.html', '.json', '.tsx', '.jsx')):
                    candidates.append(Path(root) / f)
    else:
        return [], []

    skill_refs_dir = (skill_root / 'references').resolve()
    skill_main_doc = (skill_root / 'SKILL.md').resolve()
    skill_readme_doc = (skill_root / 'README.md').resolve()

    for cand in candidates:
        cand_res = cand.resolve()
        # Direct check for skill internal references & repo README
        if cand_res in (skill_main_doc, skill_readme_doc):
            skipped.append(cand)
            continue
        try:
            if cand_res.is_relative_to(skill_refs_dir):
                skipped.append(cand)
                continue
        except (ValueError, RuntimeError, AttributeError):
            if str(skill_refs_dir).lower() in str(cand_res).lower():
                skipped.append(cand)
                continue

        # In-content check for Skill Guard header
        try:
            with open(cand, 'r', encoding='utf-8', errors='ignore') as fp:
                head = fp.read(512)
            if SKILL_REFERENCE_GUARD_PATTERN.search(head):
                skipped.append(cand)
                continue
        except Exception:
            pass

        to_check.append(cand)

    return to_check, skipped


def main() -> int:
    parser = argparse.ArgumentParser(description="UX Editorial & Copywriting Automated Linter (2026)")
    parser.add_argument("pos_target", nargs="?", default=None, help="Positional target file or directory to scan")
    parser.add_argument("--target", dest="opt_target", type=str, default=None, help="Named target file or directory to scan")
    parser.add_argument("--workspace", type=str, default=None, help="Path to workspace root directory")
    parser.add_argument("--format", choices=["json", "text"], default="json", help="Output format: json (default) or text")
    args = parser.parse_args()

    script_dir = Path(__file__).resolve().parent
    skill_root = script_dir.parent
    workspace_dir = Path(args.workspace).resolve() if args.workspace else Path.cwd().resolve()

    raw_target = args.opt_target or args.pos_target
    if not raw_target:
        target_path = workspace_dir
        target_str = str(workspace_dir)
    else:
        target_str = raw_target
        cand = Path(raw_target)
        if cand.is_absolute():
            target_path = cand.resolve()
        elif (workspace_dir / cand).exists():
            target_path = (workspace_dir / cand).resolve()
        elif (Path.cwd() / cand).exists():
            target_path = (Path.cwd() / cand).resolve()
        elif (skill_root / cand).exists():
            target_path = (skill_root / cand).resolve()
        else:
            target_path = (workspace_dir / cand).resolve()

    if not target_path.exists():
        err_payload = {"status": "error", "code": "TARGET_NOT_FOUND", "path": str(target_str)[:50]}
        if args.format == "text":
            print(f"Error: Target '{target_str}' does not exist.")
        else:
            sys.stdout.write(json.dumps(err_payload, separators=(',', ':')) + "\n")
        return 2

    files_to_check, skipped_files = resolve_target_files(target_path, skill_root)

    total_violations = 0
    all_violations_summary = []
    file_results = []

    for fpath in files_to_check:
        v = check_copy_file(str(fpath))
        if v:
            total_violations += len(v)
            rel_name = fpath.name
            for item in v[:3]:
                all_violations_summary.append(f"{rel_name}: {item[:60]}")
            file_results.append((fpath, v))
        else:
            file_results.append((fpath, []))

    if args.format == "text":
        print(f"Scanning {len(files_to_check)} document(s) for UX Editorial invariants...\n")
        for s in skipped_files:
            print(f"SKIP  {s}  (skill reference doc — not authored copy)")
        for fpath, v in file_results:
            if v:
                print(f"FAIL  {fpath}:")
                for item in v:
                    print(f"  - {item}")
            else:
                print(f"PASS  {fpath}")
        print()
        print(f"Checked: {len(files_to_check)} document(s) | Skipped: {len(skipped_files)}")
        if total_violations == 0:
            print("PASS: All interface copy satisfies UX Editorial invariants.")
            return 0
        else:
            print(f"FAILED: {total_violations} editorial violation(s) found.")
            return 1

    # Token-Sanitized JSON Output Contract (<= 50 tokens)
    if total_violations == 0:
        result = {
            "status": "ok",
            "checked": len(files_to_check),
            "skipped": len(skipped_files),
        }
    else:
        result = {
            "status": "error",
            "checked": len(files_to_check),
            "violations_count": total_violations,
            "violations": all_violations_summary[:3],
        }

    sys.stdout.write(json.dumps(result, separators=(',', ':')) + "\n")
    sys.stdout.flush()
    return 1 if total_violations > 0 else 0


if __name__ == '__main__':
    sys.exit(main())
