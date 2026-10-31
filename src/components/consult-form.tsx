"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type Channel = "call" | "messenger";

function nationalDigits(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.length > 10 && (digits.startsWith("7") || digits.startsWith("8"))) digits = digits.slice(1);
  return digits.slice(0, 10);
}

function formatPhone(value: string) {
  const digits = nationalDigits(value);
  const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)];
  if (digits.length === 0) return "";
  let result = `(${parts[0]}`;
  if (digits.length < 3) return result;
  result += ")";
  if (parts[1]) result += ` ${parts[1]}`;
  if (parts[2]) result += `-${parts[2]}`;
  if (parts[3]) result += `-${parts[3]}`;
  return result;
}

function isNickname(value: string) {
  return /[a-zа-яё@._]/i.test(value);
}

function formatCode(value: string) {
  return value.replace(/\D/g, "").slice(0, 3);
}

function formatNational(value: string, code: string) {
  if (code === "" || code === "7") return formatPhone(value);
  return value.replace(/\D/g, "").slice(0, 15);
}

function phoneReady(code: string, value: string) {
  if (!/^\d{1,3}$/.test(code)) return false;
  const count = value.replace(/\D/g, "").length;
  if (code === "7") return count >= 10;
  return count >= 6;
}

function telegramReady(value: string) {
  const trimmed = value.trim();
  if (!trimmed || !isNickname(trimmed)) return false;
  return trimmed.replace(/^@/, "").length >= 2;
}

const countries: { id: string; name: string; dial: string; stripes: { color: string; className: string }[] }[] = [
  {
    id: "ru",
    name: "Россия",
    dial: "7",
    stripes: [
      { color: "#ffffff", className: "h-[6px]" },
      { color: "#0039a6", className: "h-[6px]" },
      { color: "#d52b1e", className: "h-[6px]" },
    ],
  },
  {
    id: "az",
    name: "Азербайджан",
    dial: "994",
    stripes: [
      { color: "#00b5e2", className: "h-[6px]" },
      { color: "#ef3340", className: "h-[6px]" },
      { color: "#509e2f", className: "h-[6px]" },
    ],
  },
  {
    id: "am",
    name: "Армения",
    dial: "374",
    stripes: [
      { color: "#d90012", className: "h-[6px]" },
      { color: "#0033a0", className: "h-[6px]" },
      { color: "#f2a800", className: "h-[6px]" },
    ],
  },
  {
    id: "by",
    name: "Беларусь",
    dial: "375",
    stripes: [
      { color: "#c8313e", className: "h-[12px]" },
      { color: "#4aa657", className: "h-[6px]" },
    ],
  },
  { id: "ge", name: "Грузия", dial: "995", stripes: [] },
  { id: "kz", name: "Казахстан", dial: "7", stripes: [{ color: "#00afca", className: "h-[18px]" }] },
  { id: "kg", name: "Кыргызстан", dial: "996", stripes: [{ color: "#e8112d", className: "h-[18px]" }] },
  {
    id: "md",
    name: "Молдова",
    dial: "373",
    stripes: [
      { color: "#003da5", className: "h-[6px]" },
      { color: "#ffd100", className: "h-[6px]" },
      { color: "#c8102e", className: "h-[6px]" },
    ],
  },
  {
    id: "tj",
    name: "Таджикистан",
    dial: "992",
    stripes: [
      { color: "#cc0000", className: "h-[6px]" },
      { color: "#ffffff", className: "h-[6px]" },
      { color: "#006600", className: "h-[6px]" },
    ],
  },
  {
    id: "uz",
    name: "Узбекистан",
    dial: "998",
    stripes: [
      { color: "#0099b5", className: "h-[6px]" },
      { color: "#ffffff", className: "h-[6px]" },
      { color: "#1eb53a", className: "h-[6px]" },
    ],
  },
  {
    id: "ua",
    name: "Украина",
    dial: "380",
    stripes: [
      { color: "#005bbb", className: "h-[9px]" },
      { color: "#ffd500", className: "h-[9px]" },
    ],
  },
];

function Flag({ id }: { id: string }) {
  if (id === "ge") {
    return (
      <span className="relative h-[18px] w-[24px] shrink-0 overflow-hidden rounded-[2px] border-[0.5px] border-solid border-[#dedede] bg-white">
        <span className="absolute top-0 left-[10px] h-full w-[4px] bg-[#ff0000]" />
        <span className="absolute top-[7px] left-0 h-[4px] w-full bg-[#ff0000]" />
      </span>
    );
  }
  const country = countries.find((item) => item.id === id) ?? countries[0];
  return (
    <span className="flex h-[18px] w-[24px] shrink-0 flex-col overflow-hidden rounded-[2px] border-[0.5px] border-solid border-[#dedede]">
      {country.stripes.map((stripe) => (
        <span key={`${id}-${stripe.color}-${stripe.className}`} className={stripe.className} style={{ backgroundColor: stripe.color }} />
      ))}
    </span>
  );
}

function MessengerField({
  icon,
  value,
  onChange,
  placeholder,
  label,
  invalid,
  phone,
  showCode,
  dialCode,
  onCodeChange,
  codeLabel,
}: {
  icon: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  invalid: boolean;
  phone?: boolean;
  showCode?: boolean;
  dialCode?: string;
  onCodeChange?: (value: string) => void;
  codeLabel?: string;
}) {
  return (
    <label className="flex h-[48px] w-full items-center gap-[16px] rounded-[16px] border border-solid border-[#dedede] bg-white pr-[14px] pl-[24px]">
      <img alt="" className="shrink-0" src={icon} width={42} height={42} />
      <span className="h-[24px] w-px shrink-0 bg-[#dedede]" />
      <span className="flex min-w-0 flex-1 items-center gap-[4px]">
        {showCode ? (
          <span className="flex shrink-0 items-center text-18">
            <span>+</span>
            <input
              value={dialCode}
              onChange={(event) => onCodeChange?.(formatCode(event.target.value))}
              inputMode="numeric"
              autoComplete="tel-country-code"
              placeholder="7"
              aria-label={codeLabel ?? "Код страны"}
              maxLength={3}
              style={{ width: `${Math.max(dialCode?.length ?? 0, 1)}ch` }}
              className="bg-transparent text-18 text-black outline-none placeholder:text-black placeholder:opacity-40"
            />
          </span>
        ) : null}
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          inputMode={phone ? "tel" : "text"}
          placeholder={placeholder}
          aria-label={label}
          aria-invalid={invalid}
          className="min-w-0 flex-1 bg-transparent text-18 text-black outline-none placeholder:text-black placeholder:opacity-40"
        />
      </span>
    </label>
  );
}

function PhoneField({
  value,
  onChange,
  invalid,
  countryId,
  onCountry,
}: {
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
  countryId: string;
  onCountry: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLLabelElement>(null);
  const country = countries.find((item) => item.id === countryId) ?? countries[0];

  useEffect(() => {
    if (!open) return;
    function onPointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <label
      ref={rootRef}
      className="relative flex h-[48px] items-center gap-[16px] rounded-[16px] border border-solid border-[#dedede] bg-white pr-[14px] pl-[24px]"
    >
      <button
        type="button"
        aria-label="Код страны"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex shrink-0 items-center gap-[8px] bg-transparent p-0 text-black"
      >
        <Flag id={country.id} />
        <span className="text-18">+{country.dial}</span>
        <img
          alt=""
          src="/consult/chevron-down.svg"
          width={24}
          height={24}
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <span className="h-[24px] w-px bg-[#dedede]" />
      <input
        value={value}
        onChange={(event) => onChange(formatNational(event.target.value, country.dial))}
        inputMode="tel"
        autoComplete="tel"
        placeholder={country.dial === "7" ? "(999) 123-45-67" : "Номер телефона"}
        aria-label="Телефон"
        aria-invalid={invalid}
        className="min-w-0 flex-1 bg-transparent text-18 text-black outline-none placeholder:text-black placeholder:opacity-40"
      />
      {open ? (
        <ul
          role="listbox"
          aria-label="Код страны"
          className="absolute top-[56px] left-[-1px] z-30 max-h-[240px] w-[375px] overflow-auto rounded-[16px] border border-solid border-[#dedede] bg-white py-[8px] shadow-[0_8px_24px_rgba(91,90,90,0.12)]"
        >
          {countries.map((item) => {
            const selected = item.id === country.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onCountry(item.id);
                    setOpen(false);
                  }}
                  className={`flex h-[40px] w-full items-center gap-[12px] px-[16px] text-left text-16 text-black ${selected ? "bg-[#f6f8fa]" : "hover:bg-[#f6f8fa]"}`}
                >
                  <Flag id={item.id} />
                  <span className="min-w-0 flex-1">{item.name}</span>
                  <span className="opacity-50">+{item.dial}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </label>
  );
}

export function ConsultForm() {
  const [name, setName] = useState("");
  const [channel, setChannel] = useState<Channel>("call");
  const [countryId, setCountryId] = useState("ru");
  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [telegram, setTelegram] = useState("");
  const [telegramCode, setTelegramCode] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setError("Укажите имя");
      return;
    }
    const country = countries.find((item) => item.id === countryId) ?? countries[0];
    if (channel === "call" && !phoneReady(country.dial, phone)) {
      setError("Укажите телефон");
      return;
    }
    const telegramOk = isNickname(telegram) ? telegramReady(telegram) : phoneReady(telegramCode, telegram);
    const whatsappOk = phoneReady(phoneCode, phone);
    if (channel === "messenger" && !telegramOk && !whatsappOk) {
      const telegramPhone = !isNickname(telegram) && telegram.replace(/\D/g, "").length > 0;
      const whatsappPhone = phone.replace(/\D/g, "").length > 0;
      const missingCode = (telegramPhone && telegramCode === "") || (whatsappPhone && phoneCode === "");
      if (missingCode) setError("Укажите код");
      else if (telegramPhone || whatsappPhone || telegramCode !== "" || phoneCode !== "") setError("Укажите номер");
      else setError("Укажите ник или номер");
      return;
    }
    setError("");
    setSent(true);
  }

  return (
    <section id="zayavka" className="relative mt-[120px] h-[740px] w-[1440px] overflow-hidden rounded-[29px] bg-gradient-to-b from-[rgba(229,246,255,0.45)] to-[rgba(209,239,255,0.45)]">
      <div className="absolute top-[52px] left-[120px] flex w-[604px] flex-col gap-[24px] text-black">
        <h2 className="text-40 font-medium">
          Расскажите о своей проблеме, и мы подберем профильное учереждение
        </h2>
        <p className="text-16">Консультация бесплатна и анонимна</p>
      </div>

      <div className="pointer-events-none absolute top-[-23px] left-[1236px] flex h-[243.212px] w-[271.782px] items-center justify-center">
        <div className="-scale-y-100 rotate-[-21.54deg]">
          <img alt="" src="/consult/leaf-top.svg" width={223.858} height={173.671} />
        </div>
      </div>
      <div className="pointer-events-none absolute top-[466px] left-[-121px] flex h-[367.399px] w-[516.307px] items-center justify-center">
        <div className="rotate-[2.26deg]">
          <img alt="" src="/consult/sheets.svg" width={503} height={347.863} />
        </div>
      </div>
      <div className="pointer-events-none absolute top-[591.53px] left-[778.24px] flex h-[214.097px] w-[223.769px] items-center justify-center">
        <div className="rotate-[169.57deg]">
          <img alt="" src="/consult/leaf-bottom.svg" width={194.039} height={181.987} />
        </div>
      </div>

      <form
        onSubmit={submit}
        className="absolute top-[52px] left-[905px] flex w-[415px] flex-col gap-[30px] rounded-[23px] bg-white px-[20px] py-[24px]"
        noValidate
      >
        <div className="flex w-full flex-col gap-[22px]">
          <h3 className="mx-auto w-[367px] text-center text-24 font-medium">
            Бесплатная консультация по&nbsp;подбору учереждения
          </h3>

          <label className="flex w-full flex-col gap-[10px]">
            <span className="text-18">Имя</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Укажите как к вам можно обращаться"
              autoComplete="name"
              aria-invalid={error !== "" && !name.trim()}
              className="h-[48px] rounded-[16px] border border-solid border-[#dedede] bg-white pr-[14px] pl-[24px] text-18 text-black outline-none placeholder:text-black placeholder:opacity-40"
            />
          </label>
        </div>

        <div className="flex w-full flex-col gap-[16px]">
          <div className="flex w-full flex-col gap-[10px]">
            <span className="text-18" id="contact-channel">
              Способ связи
            </span>
            <div role="tablist" aria-labelledby="contact-channel" className="flex h-[40px] gap-[4px] rounded-[10px] bg-[#f6f8fa] p-[4px]">
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
                    className={`flex h-[32px] flex-1 items-center justify-center rounded-[8px] px-[14px] text-16 text-black ${active ? "bg-white" : "opacity-50"}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {channel === "call" ? (
            <PhoneField
              value={phone}
              onChange={setPhone}
              countryId={countryId}
              onCountry={(id) => {
                const next = countries.find((item) => item.id === id) ?? countries[0];
                setCountryId(id);
                setPhone((current) => formatNational(current, next.dial));
              }}
              invalid={error !== "" && !phoneReady((countries.find((item) => item.id === countryId) ?? countries[0]).dial, phone)}
            />
          ) : (
            <div className="flex w-full flex-col gap-[8px]">
              <MessengerField
                icon="/consult/telegram.svg"
                value={telegram}
                onChange={(value) => setTelegram(isNickname(value) ? value : formatNational(value, telegramCode))}
                placeholder="Укажите ник или номер"
                label="Ник или номер в Телеграме"
                showCode={!isNickname(telegram)}
                codeLabel="Код страны в Телеграме"
                dialCode={telegramCode}
                onCodeChange={(value) => {
                  setTelegramCode(value);
                  setTelegram((current) => (isNickname(current) ? current : formatNational(current, value)));
                }}
                invalid={error !== "" && !telegramReady(telegram) && !phoneReady(phoneCode, phone)}
              />
              <p className="w-full text-center text-18 text-black opacity-40">Или</p>
              <MessengerField
                icon="/consult/whatsapp.svg"
                value={phone}
                onChange={(value) => setPhone(formatNational(value, phoneCode))}
                placeholder="(999) 123-45-67"
                label="Номер WhatsApp"
                phone
                showCode
                codeLabel="Код страны WhatsApp"
                dialCode={phoneCode}
                onCodeChange={(value) => {
                  setPhoneCode(value);
                  setPhone((current) => formatNational(current, value));
                }}
                invalid={error !== "" && !telegramReady(telegram) && !phoneReady(phoneCode, phone)}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={sent}
          className="flex h-[52px] w-full items-center justify-center rounded-[12px] bg-[#e1f300] px-[20px] text-18 leading-[24px] font-medium text-black disabled:opacity-80"
        >
          {sent ? "Заявка отправлена" : "Отправить заявку"}
        </button>
        {error ? <p className="-mt-[28px] w-full text-center text-16 text-black opacity-60">{error}</p> : null}
      </form>
    </section>
  );
}
