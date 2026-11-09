# Interface Microcopy Specification: Cloud Database Orchestrator

This document demonstrates production-grade BigTech interface copy structured across the 3-Tier Delivery Spectrum (Terse, Conversational, Instructive).

---

## 1. Authentication & Workspace Setup

### Value Proposition
- **Tier 1 (Terse)**: Подключить базу данных
- **Tier 2 (Conversational)**: Подключите базу данных, чтобы следить за&nbsp;нагрузкой и&nbsp;кластерами
- **Tier 3 (Instructive)**: Подключите рабочую базу данных: сервис настроит мониторинг запросов и&nbsp;поможет распределить нагрузку

### Form Inputs & Buttons
- Persistent Label: Адрес рабочей почты
- Format Placeholder: `<ADMIN_EMAIL:EMAIL>`
- Action (Tier 1): [Войти]
- Action (Tier 2): [Войти в&nbsp;аккаунт]
- Secondary Action: [Отмена]

---

## 2. Empty State: Automated Cluster Backups

### Status Header
- **Tier 1**: Бэкапы выключены
- **Tier 2**: Автобэкапы не&nbsp;настроены
- **Tier 3**: Расписание резервных копий пока не&nbsp;создано

### Value Proposition
- **Tier 1**: Регулярные копии кластера
- **Tier 2**: Включите автобэкапы, чтобы не&nbsp;потерять данные при&nbsp;сбое
- **Tier 3**: Настройте ежедневные снимки кластера: они защитят рабочие таблицы при&nbsp;аварии

### Primary CTA
- **Tier 1**: [Включить бэкапы]
- **Tier 2**: [Настроить автобэкапы]
- **Tier 3**: [Создать расписание бэкапов]

---

## 3. Error Recovery Dialogs

### Network Interruption
- **Title**: Нет связи с&nbsp;сервером
- **Tier 1**: Схема не&nbsp;сохранилась: пропал интернет. [Повторить]
- **Tier 2**: Схема не&nbsp;сохранилась: пропал интернет. Проверьте сеть и&nbsp;нажмите [Повторить]
- **Tier 3**: Изменения схемы не&nbsp;сохранились: сервер не&nbsp;отвечает. Проверьте подключение к&nbsp;сети и&nbsp;повторите попытку или&nbsp;сохраните черновик

### Quota Exceeded
- **Title**: Закончились ядра процессора
- **Tier 1**: Лимит исчерпан: перейдите в&nbsp;тарифы. [Открыть тарифы]
- **Tier 2**: Не&nbsp;хватает ядер процессора: перейдите в&nbsp;биллинг и&nbsp;увеличьте лимит ресурсов
- **Tier 3**: Достигнут лимит доступных ядер на&nbsp;текущем тарифе. Перейдите в&nbsp;раздел биллинга, чтобы повысить квоту, или&nbsp;освободите неиспользуемые узлы

---

## 4. Destructive Confirmation Modal

### Title
Точно удалить кластер «<CLUSTER_ID:STRING>»?

### Consequence Description
Все <TABLE_COUNT:INT> таблиц, индексы и&nbsp;активные сессии подключения удалятся навсегда. Восстановить их не&nbsp;получится.

### Dialog Actions
- Primary Action: [Да, удалить]
- Secondary Action: [Отмена]

---

## 5. Ephemeral Feedback & Status Toasts

- Undo Toast: Кластер архивирован. [Отменить]
- Completed Task: Настройки сохранены
- Billing Success: Оплачено <AMOUNT:CURRENCY>&nbsp;₽

---

## 6. Search & Filter Zero-Results State

### Status Header
- **Tier 1**: Ничего не&nbsp;нашлось
- **Tier 2**: По&nbsp;запросу «<SEARCH_QUERY:STRING>» ничего не&nbsp;нашлось
- **Tier 3**: По&nbsp;запросу «<SEARCH_QUERY:STRING>» с&nbsp;выбранными фильтрами кластеры не&nbsp;найдены

### Recovery Guidance & Action
- **Helper**: Проверьте, нет&nbsp;ли опечаток в&nbsp;названии, или&nbsp;сбросьте параметры фильтрации
- **Primary Action**: [Сбросить фильтры]

---

## 7. B2B Data Grid: Cluster Billing Ledger (Контур.Гайды Standard)

| Кластер | Тариф | Период | Нагрузка, % | Сумма, ₽ | Статус |
| :--- | :--- | :--- | ---: | ---: | :--- |
| prod-eu-01 | Pro 16 ядер | 1–30 ноября | 64–78% | 14 900 | Оплачен |
| staging-ru-02 | Базовый | 1–30 ноября | 12–18% | — | Тестовый доступ |
| analytics-03 | Enterprise | 15–30 ноября | 85–92% | 42 500 | Ожидает оплаты |

---

## 8. Subscription Paywall & FinTech Checkout (Zero Dark Patterns)

### Headline & Transparent Trial Timeline
- **Header**: Тариф Pro для&nbsp;рабочих кластеров
- **Timeline**: <TRIAL_DAYS:INT>&nbsp;дней бесплатно, затем&nbsp;— <PRICE:CURRENCY>&nbsp;₽ в&nbsp;месяц. Первое списание&nbsp;— 15&nbsp;ноября 2026&nbsp;года. Отключить подписку можно в&nbsp;любой момент в&nbsp;профиле

### Actions
- **Primary Action (Trial)**: [Попробовать 7 дней бесплатно]
- **Primary Action (Direct Pay)**: [Оплатить <PRICE:CURRENCY>&nbsp;₽]
- **Secondary Action (Neutral Opt-Out)**: [Оставить базовый тариф]
