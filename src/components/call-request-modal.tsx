"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  MessengerField,
  PhoneField,
  countries,
  formatNational,
  isNickname,
  phoneReady,
  telegramReady,
} from "@/components/consult-form";

type Path = "soon" | "plan";
type Step = "format" | "schedule" | "contact";
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

const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const slotGroups: { id: string; label: string; slots: string[] }[] = [
  { id: "morning", label: "Утро", slots: ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30"] },
  { id: "day", label: "День", slots: ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"] },
  { id: "evening", label: "Вечер", slots: ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"] },
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

function Steps({ count, current }: { count: number; current: number }) {
  return (
    <div className="flex items-center gap-[6px]" aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <span key={index} className={`h-[10px] rounded-full bg-[#e1f300] ${index === current ? "w-[26px]" : "w-[10px]"}`} />
      ))}
    </div>
  );
}

function CallRequestModal({ topic, onClose }: { topic: string; onClose: () => void }) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const zoneOpenRef = useRef(false);
  const [step, setStep] = useState<Step>("format");
  const [path, setPath] = useState<Path | null>(null);
  const [cursor, setCursor] = useState(() => {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  });
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [openGroups, setOpenGroups] = useState<string[]>(["morning"]);
  const [zone, setZone] = useState(zones[1].id);
  const [zoneOpen, setZoneOpen] = useState(false);
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
  const canSend = contactReady && !sent;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
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
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [onClose]);

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
      setError(channel === "call" ? "Укажите телефон" : "Укажите ник или номер");
      return;
    }
    setError("");
    setSent(true);
  }

  const cells = monthCells(cursor.year, cursor.month);
  const zoneLabel = zones.find((item) => item.id === zone)?.label ?? zones[1].label;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(39,41,45,0.45)] p-[24px]">
      <button type="button" aria-label="Закрыть" className="absolute inset-0 cursor-default" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative flex w-[1100px] flex-col rounded-[21px] bg-[#fdfdfd] outline-none ${step === "contact" ? "" : "h-[612px] overflow-hidden"}`}
      >
        <div className="flex h-[44px] items-center justify-between px-[26px] pt-[20px]">
          {step === "format" ? (
            <span className="size-[24px]" />
          ) : (
            <button type="button" aria-label="Назад" onClick={back} className="flex size-[24px] items-center justify-center opacity-70">
              <Chevron direction="left" />
            </button>
          )}
          <Steps count={stepCount} current={stepIndex} />
          <button type="button" aria-label="Закрыть" onClick={onClose} className="opacity-70">
            <CloseIcon />
          </button>
        </div>

        {step === "format" ? (
          <div className="flex flex-col items-center gap-[56px] pt-[52.5px]">
            <h2 id={titleId} className="w-[326px] text-center text-24 font-medium">
              Выберите удобный формат для консультации
            </h2>
            <div className="flex items-start gap-[46px]">
              <FormatCard
                gap={23}
                title="Связаться как можно скорее"
                text="Свяжемся с Вами как можно скорее, чтоб обсудить вашу ситуацию"
                onClick={() => choose("soon")}
              />
              <FormatCard
                gap={20}
                title="Запланировать консультацию"
                text="Выберите удобное для Вас время, чтобы обсудить Вашу ситуацию"
                onClick={() => choose("plan")}
              />
            </div>
          </div>
        ) : null}

        {step === "schedule" ? (
          <div className="flex min-h-0 flex-1 gap-[61px] overflow-hidden px-[34px] pt-[24px] pb-[46px]">
            <div className="flex w-[366px] flex-col gap-[10px] pt-[0px]">
              <h2 id={titleId} className="w-[232px] text-24 font-medium">
                Выберите удобную дату и время
              </h2>
              <p className="text-16 opacity-60">
                Запланируйте консультацию на удобное для вас время. Специалист свяжется с вами в выбранное время, чтобы обсудить ситуацию и возможные варианты помощи
              </p>
            </div>
            <div className="flex w-[605px] items-start gap-[16px]">
              <div className="flex w-[368px] flex-col gap-[12px]">
                <div className="rounded-[16px] bg-white px-[20px] pt-[20px] pb-[16px]">
                  <div className="flex h-[36px] items-center justify-between rounded-[8px] bg-[#f6f8fa] px-[6px]">
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
                      className="flex size-[24px] items-center justify-center rounded-[6px] bg-white"
                    >
                      <Chevron direction="left" />
                    </button>
                    <span className="text-[14px] leading-[20px] font-medium">
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
                      className="flex size-[24px] items-center justify-center rounded-[6px] bg-white"
                    >
                      <Chevron direction="right" />
                    </button>
                  </div>
                  <div className="mt-[8px] grid grid-cols-7 gap-x-[8px]">
                    {weekdays.map((label) => (
                      <span key={label} className="flex h-[40px] items-center justify-center text-[14px] leading-[20px] opacity-40">
                        {label}
                      </span>
                    ))}
                    {cells.map((cell) => {
                      const selected = date ? sameDay(date, cell.date) : false;
                      return (
                        <button
                          key={cell.date.toISOString()}
                          type="button"
                          disabled={cell.outside}
                          onClick={() => setDate(cell.date)}
                          className={`flex size-[40px] items-center justify-center rounded-[8px] text-[14px] leading-[20px] ${
                            selected ? "bg-[#e1f300]" : cell.outside ? "text-[#cdd0d5]" : "hover:bg-[#f6f8fa]"
                          }`}
                        >
                          {cell.date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="relative">
                  <span className="text-16">Часовой пояс</span>
                  <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={zoneOpen}
                    onClick={() => setZoneOpen((current) => !current)}
                    className="mt-[10px] flex h-[40px] w-full items-center justify-between rounded-[3px] border border-solid border-[#c7c7c7] bg-white px-[14px] text-left text-16"
                  >
                    <span className="truncate">{zoneLabel}</span>
                    <Chevron direction="down" />
                  </button>
                  {zoneOpen ? (
                    <ul
                      role="listbox"
                      aria-label="Часовой пояс"
                      className="absolute top-[78px] z-10 max-h-[220px] w-full overflow-auto rounded-[8px] border border-solid border-[#dedede] bg-white py-[4px] shadow-[0_8px_24px_rgba(39,41,45,0.12)]"
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
              <div className="flex min-h-[498px] w-[221px] flex-col">
                <div className="flex w-full flex-col gap-[12px]">
                  {slotGroups.map((group) => {
                    const open = openGroups.includes(group.id);
                    return (
                      <div key={group.id} className={`flex flex-col gap-[12px] ${open ? "pb-[10px]" : ""}`}>
                        <button
                          type="button"
                          aria-expanded={open}
                          onClick={() =>
                            setOpenGroups((current) =>
                              current.includes(group.id) ? current.filter((id) => id !== group.id) : [...current, group.id],
                            )
                          }
                          className="flex h-[27px] w-full items-center justify-between pb-[2px]"
                        >
                          <span className="flex items-center gap-[6px] text-[14px] leading-[24px] font-medium">
                            <PeriodMark />
                            {group.label}
                          </span>
                          <SlotChevron open={open} />
                        </button>
                        {open ? (
                          <div className="grid grid-cols-2 gap-[6px]">
                            {group.slots.map((slot) => {
                              const selected = time === slot;
                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  onClick={() => setTime(slot)}
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
                  disabled={!date || !time}
                  onClick={() => setStep("contact")}
                  className="lime-control mt-auto h-[38px] self-end rounded-[8px] px-[20px] text-16"
                >
                  Продолжить
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {step === "contact" ? (
          <form onSubmit={submit} noValidate className="mx-auto flex w-[415px] flex-col items-center gap-[21px] pt-[38px] pb-[46px]">
            <h2 id={titleId} className="w-[378px] text-center text-24 font-medium">
              Заполните контактную информацию
            </h2>
            <div className="flex w-full flex-col gap-[18px] rounded-[20px] bg-white px-[18px] py-[18px]">
              <label className="flex flex-col gap-[8px]">
                <span className="text-18">Имя</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Укажите как к вам можно обращаться"
                  autoComplete="name"
                  aria-invalid={error !== "" && !name.trim()}
                  className="h-[44px] rounded-[12px] border border-solid border-[#dedede] bg-white px-[24px] text-16 text-[#27292d] outline-none placeholder:text-[#27292d] placeholder:opacity-40"
                />
              </label>
              <div className="flex flex-col gap-[12px]">
                <span className="text-18" id={`${titleId}-channel`}>
                  Способ связи
                </span>
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
                        className={`flex h-[32px] flex-1 items-center justify-center rounded-[8px] px-[14px] text-16 ${active ? "bg-white" : "opacity-50"}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                <div className="grid">
                  <div
                    className={`col-start-1 row-start-1 flex flex-col gap-[8px] ${channel === "messenger" ? "" : "invisible"}`}
                    aria-hidden={channel !== "messenger"}
                    inert={channel !== "messenger"}
                  >
                    <MessengerField
                      icon="/consult/telegram.svg"
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
                    <div className="flex h-[28px] items-center gap-[8px]">
                      <span aria-hidden className="h-px min-w-0 flex-1 bg-black/10" />
                      <span className="text-18 opacity-40">Или</span>
                      <span aria-hidden className="h-px min-w-0 flex-1 bg-black/10" />
                    </div>
                    <MessengerField
                      icon="/consult/whatsapp.svg"
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
                  {channel === "call" ? (
                    <div className="col-start-1 row-start-1">
                      <PhoneField
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
                    </div>
                  ) : null}
                </div>
              </div>
              <button type="submit" disabled={!canSend} className="lime-control h-[46px] rounded-[12px] text-16">
                {sent ? "Заявка отправлена" : "Отправить заявку"}
              </button>
              {error ? <p className="text-center text-16 opacity-60">{error}</p> : null}
              {sent ? (
                <p className="text-center text-16 opacity-60">
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

function PeriodMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className="shrink-0">
      <path
        fill="#001024"
        fillOpacity="0.32"
        fillRule="evenodd"
        d="M3.333 2h9.334c.736 0 1.333.597 1.333 1.333v9.334c0 .736-.597 1.333-1.333 1.333H3.333A1.333 1.333 0 0 1 2 12.667V3.333C2 2.597 2.597 2 3.333 2ZM3.333 3.333h9.334v9.334H3.333V3.333Z"
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

function FormatCard({
  title,
  text,
  gap,
  onClick,
}: {
  title: string;
  text: string;
  gap: 20 | 23;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-[300px] flex-col rounded-[12px] border border-solid border-[rgba(0,0,0,0.04)] bg-white px-[20px] py-[22px] text-left hover:bg-[#f6f8fa] ${gap === 23 ? "gap-[23px]" : "gap-[20px]"}`}
    >
      <span className="w-fit border-b border-solid border-[rgba(0,0,0,0.04)] pb-[4px] text-18 leading-[28px] font-medium">
        {title}
      </span>
      <span className="flex h-[40px] w-full items-center justify-between">
        <span className="w-[226px] text-13 leading-[20px] opacity-70">{text}</span>
        <span className="flex size-[32px] shrink-0 items-center justify-center opacity-40">
          <Chevron direction="right" />
        </span>
      </span>
    </button>
  );
}

export function CallRequestButton({ label, topic }: { label: string; topic: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lime-control flex h-[44px] items-center justify-center rounded-[8px] px-[20px] text-16 shadow-[0_4px_4px_rgba(173,173,173,20%)]"
      >
        {label}
      </button>
      {open ? <CallRequestModal topic={topic} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
