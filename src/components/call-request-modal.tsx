"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  MessengerField,
  TelegramMark,
  WhatsAppMark,
  PhoneField,
  countries,
  formatNational,
  isNickname,
  phoneReady,
  telegramReady,
} from "@/components/consult-form";
import { ThanksFigure, thanksLeaf } from "@/components/thanks-art";
import { tie } from "@/lib/tie";

type Path = "soon" | "plan";
type Step = "format" | "schedule" | "contact" | "done";
type Channel = "call" | "messenger";

const months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const monthsGenitive = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const slotGroups: { id: string; label: string; range: string; slots: string[] }[] = [
  { id: "morning", label: "Утро", range: "С 10 до 12", slots: ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30"] },
  { id: "day", label: "День", range: "С 12 до 18", slots: ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"] },
  { id: "evening", label: "Вечер", range: "С 18 до 22", slots: ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"] },
];

const zones = [
  { id: "Europe/Kaliningrad", label: "(GMT+02:00) Калининград" },
  { id: "Europe/Moscow", label: "(GMT+03:00) Москва" },
  { id: "Europe/Samara", label: "(GMT+04:00) Самара" },
  { id: "Asia/Yekaterinburg", label: "(GMT+05:00) Екатеринбург" },
  { id: "Asia/Omsk", label: "(GMT+06:00) Омск" },
  { id: "Asia/Krasnoyarsk", label: "(GMT+07:00) Красноярск" },
  { id: "Asia/Irkutsk", label: "(GMT+08:00) Иркутск" },
  { id: "Asia/Yakutsk", label: "(GMT+09:00) Якутск" },
  { id: "Asia/Vladivostok", label: "(GMT+10:00) Владивосток" },
];

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfWeek(date: Date) {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  copy.setDate(copy.getDate() - ((copy.getDay() + 6) % 7));
  return copy;
}

function shiftWeek(start: Date, weeks: number) {
  const copy = new Date(start);
  copy.setDate(copy.getDate() + weeks * 7);
  return copy;
}

function weekTitle(start: Date) {
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (sameMonth) return `${start.getDate()}–${end.getDate()} ${monthsGenitive[start.getMonth()]} ${start.getFullYear()}`;
  if (start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()} ${monthsGenitive[start.getMonth()]} – ${end.getDate()} ${monthsGenitive[end.getMonth()]} ${end.getFullYear()}`;
  }
  return `${start.getDate()} ${monthsGenitive[start.getMonth()]} ${start.getFullYear()} – ${end.getDate()} ${monthsGenitive[end.getMonth()]} ${end.getFullYear()}`;
}

function monthCells(year: number, month: number) {
  const start = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const previous = new Date(year, month, 0).getDate();
  const cells: { date: Date; outside: boolean }[] = [];
  for (let index = 0; index < start; index += 1) {
    const day = previous - start + 1 + index;
    cells.push({ date: new Date(year, month - 1, day), outside: true });
  }
  for (let day = 1; day <= days; day += 1) cells.push({ date: new Date(year, month, day), outside: false });
  let next = 1;
  while (cells.length % 7 !== 0 || cells.length < 42) {
    cells.push({ date: new Date(year, month + 1, next), outside: true });
    next += 1;
  }
  return cells;
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M7 7L17 17M17 7L7 17" stroke="#27292D" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function Chevron({ direction }: { direction: "left" | "right" | "down" | "up" }) {
  const rotation = direction === "left" ? "rotate-180" : direction === "down" ? "rotate-90" : direction === "up" ? "-rotate-90" : "";
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className={rotation}>
      <path d="M7.5 4.5L12.5 10L7.5 15.5" stroke="#27292D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DayButton({
  date,
  outside = false,
  selected,
  current,
  onSelect,
}: {
  date: Date;
  outside?: boolean;
  selected: boolean;
  current: boolean;
  onSelect: (date: Date) => void;
}) {
  return (
    <button
      type="button"
      disabled={outside}
      aria-current={current ? "date" : undefined}
      aria-pressed={selected}
      onClick={() => onSelect(date)}
      className={`flex h-[40px] items-center justify-center rounded-[8px] text-[14px] leading-[20px] tracking-[-0.084px] ${
        selected
          ? "bg-[#e1f300] font-medium"
          : `${current ? "bg-[#f6f8fa]" : "hover:bg-[#f6f8fa]"} ${outside ? "text-[#cdd0d5]" : ""}`
      }`}
    >
      {date.getDate()}
    </button>
  );
}

function Steps({ count, current }: { count: number; current: number }) {
  return (
    <div className="flex items-center gap-[6px]" aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={`h-[10px] rounded-full bg-[#e1f300] ${index === current ? "w-[26px]" : "w-[10px] opacity-40"}`}
        />
      ))}
    </div>
  );
}

export function CallRequestModal({ topic, onClose }: { topic: string; onClose: () => void }) {
  const titleId = useId();
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const zoneButtonRef = useRef<HTMLButtonElement>(null);
  const zoneOpenRef = useRef(false);
  const [step, setStep] = useState<Step>("format");
  const [path, setPath] = useState<Path | null>(null);
  const [cursor, setCursor] = useState(() => {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  });
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [openGroups, setOpenGroups] = useState<string[]>(["morning"]);
  const [period, setPeriod] = useState<string | null>(null);
  const [zone, setZone] = useState(zones[1].id);
  const [zoneOpen, setZoneOpen] = useState(false);
  const [zoneMenuMax, setZoneMenuMax] = useState(160);
  zoneOpenRef.current = zoneOpen;
  const [name, setName] = useState("");
  const [channel, setChannel] = useState<Channel>("call");
  const [countryId, setCountryId] = useState("ru");
  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [telegram, setTelegram] = useState("");
  const [telegramCode, setTelegramCode] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const stepCount = path === "plan" ? 3 : step === "contact" ? 2 : 1;
  const stepIndex = step === "format" ? 0 : step === "schedule" ? 1 : path === "plan" ? 2 : 1;
  const country = countries.find((item) => item.id === countryId) ?? countries[0];
  const contactReady =
    channel === "call"
      ? phoneReady(country.dial, phone)
      : telegramReady(telegram) || phoneReady(phoneCode, phone);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const scrollY = window.scrollY;
    const { body } = document;
    const html = document.documentElement;
    const previousBody = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    };
    const previousHtmlOverflow = html.style.overflow;
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    html.style.overflow = "hidden";
    const inerted: Element[] = [];
    let node: HTMLElement | null = dialogRef.current?.parentElement ?? null;
    while (node) {
      const parent = node.parentElement;
      if (!parent) break;
      for (const sibling of parent.children) {
        if (sibling === node || sibling.hasAttribute("inert")) continue;
        sibling.setAttribute("inert", "");
        inerted.push(sibling);
      }
      if (parent === document.body) break;
      node = parent;
    }
    dialogRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (zoneOpenRef.current) {
        setZoneOpen(false);
        return;
      }
      if (document.querySelector("[role=listbox]")) return;
      onClose();
    }
    document.addEventListener("keydown", onKey);
    const overlay = overlayRef.current;
    const viewport = window.visualViewport;
    const phone = window.matchMedia("(max-width: 767px)");
    const pin = () => {
      if (!overlay || !viewport) return;
      if (!phone.matches) {
        overlay.style.top = "";
        overlay.style.right = "";
        overlay.style.bottom = "";
        overlay.style.left = "";
        overlay.style.width = "";
        overlay.style.height = "";
        return;
      }
      overlay.style.left = "0";
      overlay.style.right = "0";
      overlay.style.bottom = "auto";
      overlay.style.width = "100%";
      overlay.style.top = `${viewport.offsetTop}px`;
      overlay.style.height = `${viewport.height}px`;
    };
    pin();
    viewport?.addEventListener("resize", pin);
    viewport?.addEventListener("scroll", pin);
    phone.addEventListener("change", pin);
    return () => {
      for (const element of inerted) element.removeAttribute("inert");
      body.style.overflow = previousBody.overflow;
      body.style.position = previousBody.position;
      body.style.top = previousBody.top;
      body.style.left = previousBody.left;
      body.style.right = previousBody.right;
      body.style.width = previousBody.width;
      html.style.overflow = previousHtmlOverflow;
      window.scrollTo(0, scrollY);
      document.removeEventListener("keydown", onKey);
      viewport?.removeEventListener("resize", pin);
      viewport?.removeEventListener("scroll", pin);
      phone.removeEventListener("change", pin);
      if (overlay) {
        overlay.style.top = "";
        overlay.style.right = "";
        overlay.style.bottom = "";
        overlay.style.left = "";
        overlay.style.width = "";
        overlay.style.height = "";
      }
      previous?.focus();
    };
  }, [onClose]);

  function choosePeriod(id: string) {
    const next = period === id ? null : id;
    setPeriod(next);
    setOpenGroups((current) => current.filter((item) => item !== id));
    setTime((slot) => {
      if (!slot) return slot;
      const owner = slotGroups.find((item) => item.slots.includes(slot));
      if (!owner || next == null || owner.id !== next) return null;
      return slot;
    });
  }

  function toggleZone() {
    setZoneOpen((current) => {
      const next = !current;
      if (next) {
        const field = zoneButtonRef.current?.getBoundingClientRect();
        const dialog = dialogRef.current?.getBoundingClientRect();
        if (field && dialog) {
          setZoneMenuMax(Math.max(40, Math.floor(dialog.bottom - field.bottom - 12)));
        }
      }
      return next;
    });
  }

  function choose(next: Path) {
    setPath(next);
    setError("");
    setStep(next === "soon" ? "contact" : "schedule");
  }

  function back() {
    setError("");
    setZoneOpen(false);
    if (step === "contact" && path === "plan") setStep("schedule");
    else setStep("format");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!contactReady) {
      setError(channel === "call" ? "Укажите телефон" : "Укажите хотя бы один вариант");
      return;
    }
    setError("");
    setSent(true);
    setStep("done");
  }

  const cells = monthCells(cursor.year, cursor.month);
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + index);
    return day;
  });
  const today = new Date();
  const zoneLabel = zones.find((item) => item.id === zone)?.label ?? zones[1].label;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-end justify-center overscroll-none bg-[rgba(39,41,45,0.45)] max-md:flex-col max-md:justify-end max-md:pt-3 md:items-center md:p-[24px]">
      <button type="button" aria-label="Закрыть" className="absolute inset-0 cursor-default" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="mobile-sheet relative flex w-full max-w-[1100px] flex-col overflow-y-auto rounded-t-[21px] bg-white pb-[max(16px,env(safe-area-inset-bottom))] outline-none max-md:min-h-0 max-md:flex-1 md:max-h-[calc(100dvh-32px)] md:rounded-[21px] md:pb-0 min-[1100px]:h-[650px] min-[1100px]:overflow-hidden"
      >
        <div className="flex h-[44px] items-center justify-between px-4 pt-[20px] min-[1100px]:px-[26px]">
          {step === "format" || step === "done" ? (
            <span className="size-[24px]" />
          ) : (
            <button type="button" aria-label="Назад" onClick={back} className="flex size-[24px] items-center justify-center opacity-70">
              <Chevron direction="left" />
            </button>
          )}
          <Steps count={step === "done" ? 1 : stepCount} current={step === "done" ? 0 : stepIndex} />
          <button type="button" aria-label="Закрыть" onClick={onClose} className="opacity-70">
            <CloseIcon />
          </button>
        </div>

        {step === "format" ? (
          <div className="flex flex-col items-center gap-8 px-4 pt-8 min-[1100px]:gap-[56px] min-[1100px]:px-0 min-[1100px]:pt-[36px]">
            <h2 id={titleId} className="w-full max-w-[406px] text-center text-28 font-medium">
              Выберите удобный формат для консультации
            </h2>
            <div className="flex w-full flex-col items-stretch gap-3 min-[1100px]:flex-row min-[1100px]:justify-center min-[1100px]:gap-[24px]">
              <FormatCard
                icon={<CallIcon />}
                title="Связаться как можно скорее"
                text="Свяжемся с Вами как можно скорее, чтоб обсудить вашу ситуацию"
                onClick={() => choose("soon")}
              />
              <FormatCard
                icon={<CalendarIcon />}
                title="Запланировать консультацию"
                text="Выберите удобное для Вас время, чтобы обсудить Вашу ситуацию"
                onClick={() => choose("plan")}
              />
            </div>
          </div>
        ) : null}

        {step === "schedule" ? (
          <div className="flex flex-col gap-6 px-4 pt-6 pb-6 min-[1100px]:flex-row min-[1100px]:gap-[81px] min-[1100px]:px-[34px] min-[1100px]:pt-[24px] min-[1100px]:pb-0">
            <div className="flex w-full flex-col gap-[10px] min-[1100px]:w-[366px]">
              <h2 id={titleId} className="w-[270px] text-28 font-medium">
                Выберите удобную дату и время
              </h2>
              <p className="text-13 leading-[20px] text-[#737577]">
                Запланируйте консультацию на удобное для вас время. Специалист свяжется с вами в выбранное время, чтобы обсудить ситуацию и возможные варианты помощи
              </p>
            </div>
            <div className="flex w-full flex-col items-stretch gap-4 min-[1100px]:w-[585px] min-[1100px]:flex-row min-[1100px]:items-start min-[1100px]:gap-[16px]">
              <div className="flex w-full flex-col gap-[12px] min-[1100px]:w-[348px]">
                <div className="flex w-full flex-col gap-[8px] rounded-[16px] bg-white pb-[20px] min-[1100px]:w-[348px]">
                  <div className="flex h-[36px] w-full items-center gap-[6px] rounded-[8px] bg-[#f6f8fa] p-[6px] min-[1100px]:hidden">
                    <button
                      type="button"
                      aria-label="Предыдущая неделя"
                      onClick={() => setWeekStart((current) => shiftWeek(current, -1))}
                      className="flex items-center justify-center rounded-[6px] bg-white p-[2px] shadow-[0_2px_4px_rgba(27,28,29,0.04)]"
                    >
                      <Chevron direction="left" />
                    </button>
                    <span className="flex-1 truncate text-center text-[14px] leading-[20px] font-medium tracking-[-0.084px]">
                      {weekTitle(weekStart)}
                    </span>
                    <button
                      type="button"
                      aria-label="Следующая неделя"
                      onClick={() => setWeekStart((current) => shiftWeek(current, 1))}
                      className="flex items-center justify-center rounded-[6px] bg-white p-[2px] shadow-[0_2px_4px_rgba(27,28,29,0.04)]"
                    >
                      <Chevron direction="right" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-x-[8px] gap-y-[8px] min-[1100px]:hidden">
                    {weekdays.map((label) => (
                      <span key={label} className="flex h-[40px] items-center justify-center text-[14px] leading-[20px] font-medium tracking-[-0.084px] text-[#868c98]">
                        {label}
                      </span>
                    ))}
                    {weekDays.map((day) => (
                      <DayButton
                        key={day.toISOString()}
                        date={day}
                        selected={date ? sameDay(date, day) : false}
                        current={sameDay(today, day)}
                        onSelect={setDate}
                      />
                    ))}
                  </div>
                  <div className="hidden h-[36px] w-full items-center gap-[6px] rounded-[8px] bg-[#f6f8fa] p-[6px] min-[1100px]:flex">
                    <button
                      type="button"
                      aria-label="Предыдущий месяц"
                      onClick={() =>
                        setCursor((current) =>
                          current.month === 0
                            ? { year: current.year - 1, month: 11 }
                            : { year: current.year, month: current.month - 1 },
                        )
                      }
                      className="flex items-center justify-center rounded-[6px] bg-white p-[2px] shadow-[0_2px_4px_rgba(27,28,29,0.04)]"
                    >
                      <Chevron direction="left" />
                    </button>
                    <span className="flex-1 text-center text-[14px] leading-[20px] font-medium tracking-[-0.084px]">
                      {months[cursor.month]}, {cursor.year}
                    </span>
                    <button
                      type="button"
                      aria-label="Следующий месяц"
                      onClick={() =>
                        setCursor((current) =>
                          current.month === 11
                            ? { year: current.year + 1, month: 0 }
                            : { year: current.year, month: current.month + 1 },
                        )
                      }
                      className="flex items-center justify-center rounded-[6px] bg-white p-[2px] shadow-[0_2px_4px_rgba(27,28,29,0.04)]"
                    >
                      <Chevron direction="right" />
                    </button>
                  </div>
                  <div className="hidden grid-cols-7 gap-x-[8px] gap-y-[8px] min-[1100px]:grid">
                    {weekdays.map((label) => (
                      <span key={`month-${label}`} className="flex h-[40px] items-center justify-center text-[14px] leading-[20px] font-medium tracking-[-0.084px] text-[#868c98]">
                        {label}
                      </span>
                    ))}
                    {cells.map((cell) => (
                      <DayButton
                        key={cell.date.toISOString()}
                        date={cell.date}
                        outside={cell.outside}
                        selected={date ? sameDay(date, cell.date) : false}
                        current={sameDay(today, cell.date)}
                        onSelect={setDate}
                      />
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <span className="text-16">Часовой пояс</span>
                  <button
                    ref={zoneButtonRef}
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={zoneOpen}
                    onClick={toggleZone}
                    className="mt-[10px] flex h-[40px] w-full items-center justify-between rounded-[3px] border border-solid border-[#c7c7c7] bg-white px-[14px] text-left text-16"
                  >
                    <span className="truncate">{zoneLabel}</span>
                    <Chevron direction={zoneOpen ? "up" : "down"} />
                  </button>
                  {zoneOpen ? (
                    <ul
                      role="listbox"
                      aria-label="Часовой пояс"
                      style={{ maxHeight: zoneMenuMax }}
                      className="absolute top-[calc(100%+4px)] z-20 w-full overflow-y-auto overscroll-contain rounded-[8px] border border-solid border-[#dedede] bg-white py-[4px] shadow-[0_8px_24px_rgba(39,41,45,0.12)]"
                    >
                      {zones.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={item.id === zone}
                            onClick={() => {
                              setZone(item.id);
                              setZoneOpen(false);
                            }}
                            className={`flex h-[36px] w-full items-center px-[14px] text-left text-16 ${item.id === zone ? "bg-[#f6f8fa]" : "hover:bg-[#f6f8fa]"}`}
                          >
                            {item.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
              <div className="flex h-auto w-full flex-col min-[1100px]:h-[546px] min-[1100px]:w-[221px]">
                <div className="flex w-full flex-col gap-[14px]">
                  {slotGroups.map((group) => {
                    const open = openGroups.includes(group.id);
                    return (
                      <div
                        key={group.id}
                        className={`flex flex-col border-b border-solid border-[rgba(0,0,0,0.04)] ${open ? "gap-[12px] pb-[10px]" : "pb-[2px]"}`}
                      >
                        <div className="flex w-full items-center justify-between">
                          <button
                            type="button"
                            aria-pressed={period === group.id}
                            onClick={() => choosePeriod(group.id)}
                            className="group flex items-center gap-[6px] text-16 leading-[24px]"
                          >
                            <PeriodCheckbox checked={period === group.id} />
                            {group.label}
                          </button>
                          <button
                            type="button"
                            aria-expanded={open}
                            aria-label={open ? group.label : `Развернуть ${group.label}`}
                            onClick={() => setOpenGroups([group.id])}
                          >
                            <SlotChevron open={open} />
                          </button>
                        </div>
                        {open ? (
                          <div className="grid grid-cols-2 gap-[6px]">
                            {group.slots.map((slot) => {
                              const selected = time === slot;
                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  onClick={() => {
                                    setTime(slot);
                                    setPeriod(group.id);
                                  }}
                                  className={`flex h-[32px] items-center justify-center rounded-[4px] text-[14px] leading-[20px] text-[#27292d] ${
                                    selected ? "bg-[#e1f300]" : "bg-[rgba(231,231,231,0.4)]"
                                  }`}
                                >
                                  {slot}
                                </button>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
                <button
                  type="button"
                  disabled={!date || (!time && !period)}
                  onClick={() => setStep("contact")}
                  className="lime-control mt-4 h-[38px] self-end rounded-[8px] px-[20px] text-16 min-[1100px]:mt-auto"
                >
                  Продолжить
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {step === "done" ? (
          <div className="mx-auto flex w-full max-w-[420px] flex-col items-center gap-5 px-4 pt-3 min-[1100px]:gap-[48px] min-[1100px]:px-0 min-[1100px]:pt-[38px]">
            <h2 id={titleId} className="w-full text-center text-28 font-medium">
              Спасибо за доверие
            </h2>
            <ThanksPicture />
            {path === "plan" ? (
              <div className="flex w-full flex-col items-center gap-[4px] text-center">
                <p className="text-18">Звонок со специалистом запланирован</p>
                <div className="flex items-center gap-[6px] text-[20px] leading-[28px] font-medium">
                  <span>{date ? scheduledDate(date) : ""}</span>
                  <span aria-hidden className="size-[3px] rounded-full bg-[#27292d]" />
                  <span>{time ?? slotGroups.find((group) => group.id === period)?.range}</span>
                </div>
              </div>
            ) : (
              <p className="w-full text-center text-18">
                Специалист свяжется с вами в ближайшее время, чтобы ответить на ваши вопросы
              </p>
            )}
          </div>
        ) : null}

        {step === "contact" ? (
          <form onSubmit={submit} noValidate className="mx-auto flex w-full max-w-[415px] flex-col items-center gap-[21px] px-4 pt-8 min-[1100px]:px-0 min-[1100px]:pt-[38px]">
            <h2 id={titleId} className="w-full max-w-[351px] text-center text-28 font-medium">
              {tie("Оставьте контакты")}
            </h2>
            <div className="flex w-full flex-col gap-[18px] rounded-[23px] bg-white py-[18px] min-[1100px]:px-[18px]">
              <label className="flex flex-col gap-[8px]">
                <span className="text-16">Имя</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Укажите как к вам можно обращаться"
                  autoComplete="name"
                  className="h-[44px] rounded-[12px] border border-solid border-[#dedede] bg-white px-[24px] text-16 text-[#27292d] outline-none placeholder:text-[#27292d] placeholder:opacity-40"
                />
              </label>
              <div className="flex flex-col gap-[12px]">
                <span className="text-16" id={`${titleId}-channel`}>
                  Способ связи
                </span>
                <div className="flex flex-col gap-[10px]">
                <div role="tablist" aria-labelledby={`${titleId}-channel`} className="flex h-[36px] gap-[4px] rounded-[10px] bg-[#f6f8fa] p-[2px]">
                  {(
                    [
                      ["call", "Звонок"],
                      ["messenger", "Мессенджер"],
                    ] as const
                  ).map(([value, label]) => {
                    const active = channel === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => {
                          setChannel(value);
                          setError("");
                        }}
                        className={`flex h-[32px] flex-1 items-center justify-center rounded-[8px] px-[14px] text-16 ${active ? "bg-white text-[#27292d]" : "text-[#6e7072]"}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                {channel === "messenger" ? (
                  <div className="flex flex-col gap-[6px]">
                    <MessengerField
                      compact
                      icon={<TelegramMark />}
                      value={telegram}
                      onChange={(value) => setTelegram(isNickname(value) ? value : formatNational(value, telegramCode))}
                      placeholder="Укажите ник или номер"
                      label="Ник или номер в Телеграме"
                      plusMode="digit"
                      codeLabel="Код страны в Телеграме"
                      dialCode={telegramCode}
                      onCodeChange={(value) => {
                        setTelegramCode(value);
                        setTelegram((current) => (isNickname(current) ? current : formatNational(current, value)));
                      }}
                      invalid={error !== "" && !telegramReady(telegram) && !phoneReady(phoneCode, phone)}
                    />
                    <div className="flex h-[24px] items-center gap-[8px]">
                      <span aria-hidden className="h-px min-w-0 flex-1 bg-black/10" />
                      <span className="text-16 text-[#737577]">Или</span>
                      <span aria-hidden className="h-px min-w-0 flex-1 bg-black/10" />
                    </div>
                    <MessengerField
                      compact
                      icon={<WhatsAppMark />}
                      value={phone}
                      onChange={(value) => setPhone(formatNational(value, phoneCode))}
                      placeholder="Укажите номер"
                      label="Номер WhatsApp"
                      phone
                      plusMode="focus"
                      codeLabel="Код страны WhatsApp"
                      dialCode={phoneCode}
                      onCodeChange={(value) => {
                        setPhoneCode(value);
                        setPhone((current) => formatNational(current, value));
                      }}
                      invalid={error !== "" && !telegramReady(telegram) && !phoneReady(phoneCode, phone)}
                    />
                  </div>
                ) : (
                  <PhoneField
                    compact
                    value={phone}
                    onChange={setPhone}
                    countryId={countryId}
                    onCountry={(id) => {
                      const next = countries.find((item) => item.id === id) ?? countries[0];
                      setCountryId(id);
                      setPhone((current) => formatNational(current, next.dial));
                    }}
                    invalid={error !== "" && !phoneReady(country.dial, phone)}
                  />
                )}
                {error ? <p className="text-16 text-[#27292d]">{error}</p> : null}
                </div>
              </div>
              <button type="submit" disabled={sent} className="lime-control h-[46px] rounded-[12px] text-16 font-medium">
                {sent ? "Заявка отправлена" : "Отправить заявку"}
              </button>
              {sent ? (
                <p className="text-center text-16 text-[#737577]">
                  Мы свяжемся с вами по заявке «{topic}»
                </p>
              ) : null}
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
}

const weekdayNames = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
const monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

function scheduledDate(date: Date) {
  return `${weekdayNames[date.getDay()]}, ${date.getDate()} ${monthNames[date.getMonth()]}`;
}

function ThanksPicture() {
  return (
    <div className="relative size-[136px] shrink-0 min-[1100px]:size-[184px]" aria-hidden>
      <div className="absolute top-0 left-0 size-[184px] origin-top-left scale-[0.74] min-[1100px]:scale-100">
      <div className="absolute top-[62.67px] left-[calc(50%+11.78px)] flex h-[114.752px] w-[151.699px] -translate-x-1/2 items-center justify-center">
        <div className="relative h-[114.439px] w-[151.463px] rotate-[0.12deg] overflow-hidden">
          <div
            className="absolute flex items-center justify-center"
            style={{ inset: "-17.43% -0.83% -13.33% -1.26%", containerType: "size" }}
          >
            <div
              className="relative rotate-[17.71deg]"
              style={{ height: "hypot(-23.056cqw, 74.6071cqh)", width: "hypot(76.944cqw, 25.3929cqh)" }}
            >
              <img
                alt=""
                src={thanksLeaf}
                width={122.571}
                height={109.394}
                className="absolute max-w-none"
                style={{ top: "6.66%", right: "1.87%", width: "122.571px", height: "109.394px" }}
              />
            </div>
          </div>
        </div>
      </div>
      <ThanksFigure className="absolute top-[7.85px] left-[4.49px]" />
      </div>
    </div>
  );
}

function PeriodCheckbox({ checked }: { checked: boolean }) {
  if (checked) {
    return (
      <span className="inline-flex shrink-0 items-start p-[1.534px]">
        <svg width="15.338" height="15.338" viewBox="0 0 15.338 15.338" fill="none" aria-hidden>
          <rect width="15.338" height="15.338" rx="3.06759" fill="#E1F300" />
          <path
            d="M4.21794 8.20581L6.40908 10.3531L11.12 4.98484"
            stroke="#626262"
            strokeWidth="1.5338"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  return (
    <svg width="18.4056" height="18.4056" viewBox="0 0 18.4056 18.4056" fill="none" aria-hidden className="shrink-0">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.571 3.8345V14.5711H3.83447V3.8345H14.571V3.8345ZM14.5711 2.3007H3.83449C2.9909 2.3007 2.3007 2.9909 2.3007 3.83449V14.5711C2.3007 15.4147 2.9909 16.1049 3.83449 16.1049H14.5711C15.4147 16.1049 16.1049 15.4147 16.1049 14.5711V3.83449C16.1049 2.9909 15.4147 2.3007 14.5711 2.3007Z"
        fill="#001024"
        className="opacity-[0.36] group-hover:opacity-[0.46] group-active:opacity-[0.56]"
      />
    </svg>
  );
}

function SlotChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden
      className={`shrink-0 ${open ? "-rotate-90" : "rotate-90"}`}
      style={{ opacity: 0.9 }}
    >
      <path
        fill="#001024"
        fillOpacity="0.36"
        d="M13.172 12.001 8.222 7.051l1.414-1.414 6.364 6.364-6.364 6.364-1.414-1.414 4.95-4.95Z"
      />
    </svg>
  );
}

function CallIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden>
      <path
        d="M13.1417 6.01662L10.7667 3.95829C10.1953 3.48584 9.4623 3.25465 8.72326 3.31377C7.98422 3.37289 7.29732 3.71768 6.80832 4.27495L4.59165 6.96662C3.48332 8.23329 3.32499 10.1333 3.95832 11.7166C7.91665 21.5333 13.4583 27.075 23.275 31.0333C24.8583 31.6666 26.7583 31.5083 28.025 30.4L30.7167 28.1833C31.2739 27.6943 31.6187 27.0074 31.6778 26.2683C31.737 25.5293 31.5058 24.7963 31.0333 24.225L28.975 22.1666C28.6033 21.7091 28.0837 21.3956 27.5057 21.28C26.9276 21.1644 26.3274 21.254 25.8083 21.5333L22.4833 23.275C18.527 21.1361 15.2805 17.8896 13.1417 13.9333L14.8833 10.6083C15.1627 10.0892 15.2522 9.48897 15.1366 8.91096C15.021 8.33294 14.7075 7.81333 14.25 7.44162L13.1417 6.01662Z"
        stroke="#82ACF8"
        strokeWidth="2.375"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.1667 4.75C25.1061 4.75 27.9252 5.9177 30.0038 7.99623C32.0823 10.0748 33.25 12.8939 33.25 15.8333M22.1667 10.2917C23.6364 10.2917 25.046 10.8755 26.0852 11.9148C27.1245 12.954 27.7083 14.3636 27.7083 15.8333"
        stroke="#82ACF8"
        strokeWidth="2.375"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden>
      <path
        d="M7.91667 7.91667H30.0833C31.8322 7.91667 33.25 9.33443 33.25 11.0833V30.0833C33.25 31.8322 31.8322 33.25 30.0833 33.25H7.91667C6.16776 33.25 4.75 31.8322 4.75 30.0833V11.0833C4.75 9.33443 6.16776 7.91667 7.91667 7.91667Z"
        stroke="#82ACF8"
        strokeWidth="2.77083"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.0833 4.75V11.0833M26.9167 4.75V11.0833M4.75 15.8333H33.25M11.875 22.1667H15.0417M22.9583 22.1667H26.125M11.875 27.7083H15.0417"
        stroke="#82ACF8"
        strokeWidth="2.77083"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FormatCard({
  icon,
  title,
  text,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full min-w-0 flex-row items-center gap-4 rounded-[12px] border border-solid border-[rgba(69,114,230,0.06)] px-4 py-4 text-left hover:border-[rgba(69,114,230,0.18)] min-[1100px]:max-w-[300px] min-[1100px]:flex-1 min-[1100px]:flex-col min-[1100px]:items-start min-[1100px]:gap-[16px] min-[1100px]:px-[20px] min-[1100px]:py-[22px]"
      style={{
        backgroundImage:
          "linear-gradient(122.62deg, rgba(223, 235, 255, 0.24) 3.1%, rgba(240, 245, 255, 0.24) 99.38%)",
      }}
    >
      <span className="flex shrink-0 items-center">{icon}</span>
      <span className="flex min-w-0 flex-1 flex-col items-start gap-[8px]">
        <span className="text-18 leading-[28px] font-medium">{tie(title)}</span>
        <span className="w-full text-13 leading-[20px] opacity-70">{tie(text)}</span>
      </span>
    </button>
  );
}

export function CallRequestButton({
  label,
  topic,
  className = "lime-control flex h-[44px] items-center justify-center rounded-[8px] px-[20px] text-16 shadow-[0_4px_4px_rgba(173,173,173,20%)]",
}: {
  label: string;
  topic: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
      </button>
      {open ? <CallRequestModal topic={topic} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
