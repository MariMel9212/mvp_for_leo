"use client";

import { useEffect, useId, useRef, useState, type FocusEvent, type FormEvent, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { asset } from "@/lib/base-path";
import { tie } from "@/lib/tie";

type Channel = "call" | "messenger";

function nationalDigits(value: string, code = "7") {
  let digits = value.replace(/\D/g, "");
  if ((code === "" || code === "7") && digits.length > 10 && (digits.startsWith("7") || digits.startsWith("8"))) {
    digits = digits.slice(1);
  }
  return digits.slice(0, 10);
}

function formatPhone(value: string, code = "7") {
  const digits = nationalDigits(value, code);
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

export function isNickname(value: string) {
  return /[a-zа-яё@._]/i.test(value);
}

function formatCode(value: string) {
  return value.replace(/\D/g, "").slice(0, 3);
}

export function formatNational(value: string, code: string) {
  return formatPhone(value, code);
}

function caretAfterDigits(formatted: string, count: number) {
  if (count <= 0) return 0;
  let seen = 0;
  for (let index = 0; index < formatted.length; index += 1) {
    if (/\d/.test(formatted[index])) {
      seen += 1;
      if (seen === count) return index + 1;
    }
  }
  return formatted.length;
}

/** Backspace/Delete on a mask character drops the neighbouring digit instead of restoring the mask. */
function editMaskedPhone(value: string, start: number, end: number, key: string, code: string) {
  if (key !== "Backspace" && key !== "Delete") return null;
  if (isNickname(value)) return null;
  const digits = nationalDigits(value, code);
  if (!digits) return null;
  if (start === end) {
    const index = key === "Backspace" ? start - 1 : start;
    if (index < 0 || index >= value.length || /\d/.test(value[index])) return null;
  } else if (/\d/.test(value.slice(start, end))) {
    return null;
  }
  const boundary = key === "Backspace" ? (start === end ? start - 1 : start) : start;
  const before = value.slice(0, Math.max(boundary, 0)).replace(/\D/g, "").length;
  let drop = key === "Backspace" ? before - 1 : before;
  if (drop < 0) drop = 0;
  if (drop >= digits.length) drop = digits.length - 1;
  const next = formatPhone(digits.slice(0, drop) + digits.slice(drop + 1), code);
  return { value: next, caret: caretAfterDigits(next, drop) };
}

export function phoneReady(code: string, value: string) {
  if (!/^\d{1,3}$/.test(code)) return false;
  const count = value.replace(/\D/g, "").length;
  if (code === "7") return count >= 10;
  return count >= 6;
}

export function telegramReady(value: string) {
  const trimmed = value.trim();
  if (!trimmed || !isNickname(trimmed)) return false;
  return trimmed.replace(/^@/, "").length >= 2;
}

export const countries: { id: string; name: string; dial: string; stripes: { color: string; className: string }[] }[] = [
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

export function TelegramMark() {
  const id = `tg-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 32 32" aria-hidden className="h-full w-full">
      <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" fill={`url(#${id})`} />
      <path d="M12.1223 16.8773L13.546 20.8179C13.546 20.8179 13.724 21.1866 13.9146 21.1866C14.1052 21.1866 16.9401 18.2374 16.9401 18.2374L20.0926 12.1484L12.1731 15.8601L12.1223 16.8773Z" fill="#C8DAEA" />
      <path d="M14.0109 17.8879L13.7376 20.7925C13.7376 20.7925 13.6232 21.6825 14.513 20.7925C15.4028 19.9025 16.2545 19.2162 16.2545 19.2162" fill="#A9C6D8" />
      <path d="M12.1492 17.0179L9.2206 16.0637C9.2206 16.0637 8.8706 15.9217 8.9833 15.5997C9.0065 15.5333 9.0533 15.4768 9.1933 15.3797C9.8422 14.9274 21.2039 10.8437 21.2039 10.8437C21.2039 10.8437 21.5247 10.7356 21.7139 10.8075C21.7607 10.822 21.8028 10.8486 21.8359 10.8847C21.8691 10.9209 21.892 10.9651 21.9024 11.013C21.9228 11.0976 21.9314 11.1846 21.9278 11.2715C21.9269 11.3467 21.9178 11.4164 21.9109 11.5257C21.8417 12.6422 19.7709 20.975 19.7709 20.975C19.7709 20.975 19.647 21.4626 19.2031 21.4793C19.094 21.4828 18.9853 21.4643 18.8835 21.425C18.7817 21.3856 18.6889 21.3261 18.6106 21.2501C17.7395 20.5008 14.7287 18.4774 14.0634 18.0324C14.0484 18.0222 14.0358 18.0088 14.0263 17.9933C14.0169 17.9778 14.0109 17.9604 14.0088 17.9424C13.9995 17.8955 14.0505 17.8374 14.0505 17.8374C14.0505 17.8374 19.2931 13.1774 19.4326 12.6882C19.4434 12.6503 19.4026 12.6316 19.3478 12.6482C18.9996 12.7763 12.9634 16.5882 12.2972 17.0089C12.2492 17.0234 12.1986 17.0265 12.1492 17.0179V17.0179Z" fill="white" />
      <defs>
        <linearGradient id={id} x1="16" y1="28" x2="16" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1D93D2" />
          <stop offset="1" stopColor="#38B0E3" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function WhatsAppMark() {
  const raw = useId().replace(/:/g, "");
  const shadow = `wa-shadow-${raw}`;
  const inset = `wa-inset-${raw}`;
  const fill = `wa-fill-${raw}`;
  return (
    <svg viewBox="0 0 32 32" aria-hidden className="h-full w-full">
      <g filter={`url(#${shadow})`}>
        <path d="M24.5029 7.48948C22.2454 5.24037 19.2428 4.00119 16.0477 4C9.46004 4 4.09832 9.33664 4.09533 15.897C4.09473 17.9019 4.60304 19.8777 5.56702 21.6266L4.02118 27.2473C3.96496 27.4528 4.02237 27.6719 4.17307 27.8231C4.28669 27.9375 4.44038 28 4.59825 28C4.64908 28 4.69991 27.9934 4.75014 27.9803L10.543 26.4678C12.2342 27.342 14.1299 27.8035 16.0429 27.8041C22.6353 27.8041 27.997 22.4669 28 15.9065C28.0012 12.7273 26.7591 9.73799 24.5029 7.48948Z" fill="white" />
      </g>
      <g filter={`url(#${inset})`}>
        <path d="M22.7217 9.25847C20.9396 7.48277 18.5709 6.50441 16.0497 6.50381C10.8447 6.50381 6.61139 10.7174 6.60899 15.8968C6.6084 17.6719 7.10713 19.4 8.05198 20.8964L8.27683 21.2519L7.32301 24.7182L10.8949 23.7857L11.2399 23.9893C12.6883 24.8456 14.3496 25.2982 16.0431 25.2988H16.0467C21.2482 25.2988 25.4814 21.0846 25.4832 15.9046C25.4838 13.3946 24.5037 11.0342 22.7217 9.25847Z" fill={`url(#${fill})`} />
      </g>
      <path d="M13.2537 11.0452C13.0414 10.5747 12.8177 10.5652 12.615 10.5569C12.4493 10.5497 12.2604 10.5503 12.0714 10.5503C11.8824 10.5503 11.5751 10.6212 11.3149 10.904C11.0548 11.1869 10.3216 11.8699 10.3216 13.2597C10.3216 14.6496 11.3383 15.993 11.48 16.1811C11.6217 16.3693 13.4426 19.3127 16.3262 20.4453C18.7224 21.3862 19.2104 21.1992 19.7307 21.1521C20.2509 21.1051 21.4093 20.4691 21.6455 19.8093C21.8817 19.1496 21.8817 18.5845 21.8111 18.4666C21.74 18.3486 21.551 18.2784 21.2675 18.1367C20.9841 17.9949 19.5889 17.3119 19.3288 17.2178C19.0687 17.1238 18.8797 17.0767 18.6901 17.3596C18.5012 17.6418 17.9576 18.2784 17.7919 18.4666C17.6263 18.6553 17.4606 18.6791 17.1772 18.5374C16.8937 18.3957 15.98 18.098 14.8958 17.1357C14.0526 16.3872 13.4833 15.4624 13.3177 15.1795C13.152 14.8973 13.2997 14.7442 13.442 14.6031C13.5694 14.4763 13.7255 14.2732 13.8678 14.1083C14.0095 13.9433 14.0568 13.8254 14.1513 13.6373C14.2458 13.4485 14.1985 13.2835 14.1274 13.1424C14.0574 13.0007 13.506 11.6037 13.2537 11.0452Z" fill="white" fillRule="evenodd" clipRule="evenodd" />
      <defs>
        <filter id={shadow} x="2.13" y="3.47" width="27.74" height="27.74" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="1.33" />
          <feGaussianBlur stdDeviation="0.93" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.562353 0 0 0 0 0.609412 0 0 0 0 0.717647 0 0 0 0.24 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
        <filter id={inset} x="6.61" y="6.5" width="18.88" height="19.07" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="0.27" />
          <feGaussianBlur stdDeviation="0.13" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.263875 0 0 0 0 0.604167 0 0 0 0 0.206424 0 0 0 0.3 0" />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
        </filter>
        <linearGradient id={fill} x1="16.05" y1="6.5" x2="16.05" y2="25.3" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7FCE76" />
          <stop offset="1" stopColor="#58B04E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function MessengerField({
  icon,
  value,
  onChange,
  placeholder,
  label,
  invalid,
  phone,
  plusMode,
  dialCode,
  onCodeChange,
  codeLabel,
  compact,
}: {
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  invalid: boolean;
  phone?: boolean;
  plusMode: "focus" | "digit";
  dialCode?: string;
  onCodeChange?: (value: string) => void;
  codeLabel?: string;
  compact?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const rootRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const caretRef = useRef<number | null>(null);
  const code = dialCode ?? "";

  useEffect(() => {
    const input = inputRef.current;
    if (caretRef.current == null || !input) return;
    const caret = caretRef.current;
    caretRef.current = null;
    input.setSelectionRange(caret, caret);
  }, [value]);
  const typedPhone = value.length > 0 && !isNickname(value);
  const showPlus = plusMode === "focus" ? focused || typedPhone || code.length > 0 : typedPhone || code.length > 0;

  function trackFocus(event: FocusEvent<HTMLLabelElement>) {
    if (!rootRef.current?.contains(event.target)) return;
    setFocused(true);
  }

  function trackBlur(event: FocusEvent<HTMLLabelElement>) {
    if (rootRef.current?.contains(event.relatedTarget as Node)) return;
    setFocused(false);
  }

  function onPhoneChange(raw: string) {
    if (isNickname(raw)) {
      onChange(raw);
      return;
    }
    const digits = raw.replace(/\D/g, "");
    if (code.length === 0 && digits.length > 0) {
      onCodeChange?.(digits.slice(0, 1));
      onChange(digits.slice(1));
      return;
    }
    onChange(raw);
  }

  function onPhoneKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && value === "" && code.length > 0) {
      event.preventDefault();
      onCodeChange?.(code.slice(0, -1));
      return;
    }
    const edited = editMaskedPhone(
      value,
      event.currentTarget.selectionStart ?? 0,
      event.currentTarget.selectionEnd ?? 0,
      event.key,
      code || "7",
    );
    if (!edited) return;
    event.preventDefault();
    caretRef.current = edited.caret;
    onChange(edited.value);
  }

  return (
    <label
      ref={rootRef}
      onFocus={trackFocus}
      onBlur={trackBlur}
      className={`flex w-full items-center gap-[16px] rounded-[16px] border border-solid border-[#dedede] bg-white pr-[14px] pl-[24px] max-[1439px]:gap-3 max-[1439px]:pl-3 ${compact ? "h-[44px]" : "h-[48px] max-[1439px]:h-[44px]"}`}
    >
      <span className={`flex shrink-0 items-center justify-center ${compact ? "size-8" : "size-[42px]"}`}>{icon}</span>
      <span className="h-[24px] w-px shrink-0 bg-[#dedede]" />
      <span className="flex min-w-0 flex-1 items-center gap-[4px]">
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => onPhoneChange(event.target.value)}
          onKeyDown={onPhoneKeyDown}
          inputMode={phone ? "tel" : "text"}
          placeholder={showPlus ? "" : placeholder}
          aria-label={label}
          aria-invalid={invalid}
          className={`order-2 min-w-0 flex-1 bg-transparent text-[#27292d] outline-none placeholder:text-[#27292d] placeholder:opacity-40 ${compact ? "text-16" : "text-18 max-[1439px]:text-16"}`}
        />
        {showPlus ? (
          <span className={`order-1 flex shrink-0 items-center text-[#27292d] ${compact ? "text-16" : "text-18 max-[1439px]:text-16"}`}>
            <span>+</span>
            <input
              value={code}
              onChange={(event) => onCodeChange?.(formatCode(event.target.value))}
              inputMode="numeric"
              autoComplete="tel-country-code"
              aria-label={codeLabel ?? "Код страны"}
              maxLength={3}
              size={Math.max(code.length, 1)}
              style={{ width: code.length > 0 ? `${code.length}ch` : 0 }}
              className={`m-0 min-w-0 border-0 bg-transparent p-0 text-[#27292d] outline-none ${compact ? "text-16" : "text-18 max-[1439px]:text-16"}`}
            />
          </span>
        ) : null}
      </span>
    </label>
  );
}

export function PhoneField({
  value,
  onChange,
  invalid,
  countryId,
  onCountry,
  compact,
}: {
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
  countryId: string;
  onCountry: (id: string) => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [menuBox, setMenuBox] = useState<{ top: number; left: number; width: number; maxHeight: number } | null>(null);
  const rootRef = useRef<HTMLLabelElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const pickedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const caretRef = useRef<number | null>(null);
  const country = countries.find((item) => item.id === countryId) ?? countries[0];

  function placeMenu() {
    const field = rootRef.current?.getBoundingClientRect();
    if (!field) return;
    const gap = 8;
    const spaceBelow = window.innerHeight - field.bottom - gap;
    const spaceAbove = field.top - gap;
    const upward = spaceBelow < 200 && spaceAbove > spaceBelow;
    const maxHeight = Math.max(80, Math.min(240, upward ? spaceAbove : spaceBelow));
    setMenuBox({
      top: upward ? Math.max(gap, field.top - gap - maxHeight) : field.bottom + gap,
      left: field.left,
      width: field.width,
      maxHeight,
    });
  }

  useEffect(() => {
    const input = inputRef.current;
    if (caretRef.current == null || !input) return;
    const caret = caretRef.current;
    caretRef.current = null;
    input.setSelectionRange(caret, caret);
  }, [value]);

  useEffect(() => {
    if (!open) return;
    placeMenu();
    function onPointer(event: PointerEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", placeMenu);
    window.addEventListener("scroll", placeMenu, true);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", placeMenu);
      window.removeEventListener("scroll", placeMenu, true);
    };
  }, [open]);

  return (
    <label
      ref={rootRef}
      className="relative flex h-[48px] items-center gap-[16px] rounded-[16px] border border-solid border-[#dedede] bg-white pr-[14px] pl-[24px] max-[1439px]:h-[44px] max-[1439px]:gap-3 max-[1439px]:pl-3"
    >
      <button
        type="button"
        aria-label="Код страны"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          if (pickedRef.current) {
            pickedRef.current = false;
            setOpen(false);
            return;
          }
          if (!open) placeMenu();
          setOpen((current) => !current);
        }}
        className="flex shrink-0 items-center gap-[8px] bg-transparent p-0 text-[#27292d]"
      >
        <Flag id={country.id} />
        <span className={compact ? "text-16" : "text-18 max-[1439px]:text-16"}>+{country.dial}</span>
        <img
          alt=""
          src={asset("/consult/chevron-down.svg")}
          width={24}
          height={24}
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <span className="h-[24px] w-px bg-[#dedede]" />
      <input
        ref={inputRef}
        value={value}
        onChange={(event) => onChange(formatNational(event.target.value, country.dial))}
        onKeyDown={(event) => {
          const edited = editMaskedPhone(
            value,
            event.currentTarget.selectionStart ?? 0,
            event.currentTarget.selectionEnd ?? 0,
            event.key,
            country.dial,
          );
          if (!edited) return;
          event.preventDefault();
          caretRef.current = edited.caret;
          onChange(edited.value);
        }}
        inputMode="tel"
        autoComplete="tel"
        placeholder={country.dial === "7" ? "(999) 123-45-67" : "Номер телефона"}
        aria-label="Телефон"
        aria-invalid={invalid}
        className={`min-w-0 flex-1 bg-transparent text-[#27292d] outline-none placeholder:text-[#27292d] placeholder:opacity-40 ${compact ? "text-16" : "text-18 max-[1439px]:text-16"}`}
      />
      {open && menuBox
        ? createPortal(
            <ul
              ref={menuRef}
              role="listbox"
              aria-label="Код страны"
              style={{ top: menuBox.top, left: menuBox.left, width: menuBox.width, maxHeight: menuBox.maxHeight }}
              className="fixed z-[60] overflow-auto rounded-[16px] border border-solid border-[#dedede] bg-white py-[8px] shadow-[0_8px_24px_rgba(91,90,90,0.12)]"
            >
              {countries.map((item) => {
                const selected = item.id === country.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onPointerDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        pickedRef.current = true;
                        onCountry(item.id);
                        setOpen(false);
                        window.setTimeout(() => {
                          pickedRef.current = false;
                        }, 0);
                      }}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      className={`flex h-[40px] w-full items-center gap-[12px] px-[16px] text-left text-16 text-[#27292d] ${selected ? "bg-[#f6f8fa]" : "hover:bg-[#f6f8fa]"}`}
                    >
                      <Flag id={item.id} />
                      <span className="min-w-0 flex-1">{item.name}</span>
                      <span className="opacity-50">+{item.dial}</span>
                    </button>
                  </li>
                );
              })}
            </ul>,
            document.body,
          )
        : null}
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
      else setError("Укажите хотя бы один вариант");
      return;
    }
    setError("");
    setSent(true);
  }

  return (
    <section id="zayavka" className="relative mt-20 w-full overflow-hidden rounded-[29px] bg-gradient-to-b from-[rgba(229,246,255,0.45)] to-[rgba(209,239,255,0.45)] px-0 py-0 max-[1439px]:px-5 max-[1439px]:py-8 md:max-[1439px]:mt-20 min-[1440px]:mt-[120px] min-[1440px]:h-[740px]">
      <div className="flex w-full max-w-[604px] flex-col gap-3 text-[#27292d] min-[1440px]:absolute min-[1440px]:top-[52px] min-[1440px]:left-[120px] min-[1440px]:w-[604px] min-[1440px]:gap-[24px]">
        <h2 className="text-40 font-medium max-md:text-28 md:max-[1439px]:text-[32px] md:max-[1439px]:leading-[40px]">
          {tie("Расскажите о своей проблеме, и мы подберем профильное учреждение")}
        </h2>
        <p className="text-16 text-[#737577]">{tie("Консультация бесплатна и анонимна")}</p>
      </div>

      <div className="pointer-events-none absolute top-[-23px] left-[1236px] hidden h-[243.212px] w-[271.782px] items-center justify-center min-[1440px]:flex">
        <div className="-scale-y-100 rotate-[-21.54deg]">
          <img alt="" src={asset("/consult/leaf-top.svg")} width={223.858} height={173.671} />
        </div>
      </div>
      <div className="pointer-events-none absolute top-[404px] left-[-121px] hidden h-[367.399px] w-[516.307px] items-center justify-center min-[1440px]:flex">
        <div className="rotate-[2.26deg]">
          <img alt="" src={asset("/consult/sheets.svg")} width={503} height={347.863} />
        </div>
      </div>
      <div className="pointer-events-none absolute top-[529.53px] left-[778.24px] hidden h-[214.097px] w-[223.769px] items-center justify-center min-[1440px]:flex">
        <div className="rotate-[169.57deg]">
          <img alt="" src={asset("/consult/leaf-bottom.svg")} width={194.039} height={181.987} />
        </div>
      </div>

      <form
        onSubmit={submit}
        className="relative mt-8 flex w-full max-w-[415px] flex-col gap-[30px] rounded-[23px] bg-white px-[20px] py-[24px] max-[1439px]:mt-14 max-[1439px]:gap-8 max-[1439px]:px-5 max-[1439px]:py-8 min-[1440px]:absolute min-[1440px]:top-[52px] min-[1440px]:left-[905px] min-[1440px]:mt-0 min-[1440px]:w-[415px]"
        noValidate
      >
        <div className="flex w-full flex-col gap-[22px] max-[1439px]:gap-7">
          <h3 className="mx-auto w-full max-w-[367px] text-center text-24 font-medium max-[1439px]:text-[22px] max-[1439px]:leading-[28px]">
            {tie("Бесплатная консультация по подбору учреждения")}
          </h3>

          <label className="flex w-full flex-col gap-[10px]">
            <span className="text-18 max-[1439px]:text-16">Имя</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Укажите как к вам можно обращаться"
              autoComplete="name"
              aria-invalid={error !== "" && !name.trim()}
              className="h-[48px] rounded-[16px] border border-solid border-[#dedede] bg-white pr-[14px] pl-[24px] text-18 text-[#27292d] outline-none placeholder:text-[#27292d] placeholder:opacity-40 max-[1439px]:h-[44px] max-[1439px]:pl-3 max-[1439px]:text-16"
            />
          </label>
        </div>

        <div className="flex w-full flex-col gap-[16px]">
          <div className="flex w-full flex-col gap-[10px]">
            <span className="text-18 max-[1439px]:text-16" id="contact-channel">
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
                    className={`flex h-[32px] flex-1 items-center justify-center rounded-[8px] px-[14px] text-16 max-[1439px]:px-2 max-[1439px]:text-[15px] ${active ? "bg-white text-[#27292d]" : "text-[#6e7072]"}`}
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
              <div className="flex h-[28px] w-full items-center gap-[8px]">
                <span aria-hidden className="h-px min-w-0 flex-1 bg-black/10" />
                <span className="text-18 text-[#737577]">Или</span>
                <span aria-hidden className="h-px min-w-0 flex-1 bg-black/10" />
              </div>
              <MessengerField
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
          )}
        </div>

        <button
          type="submit"
          disabled={sent}
          className="lime-control flex h-[52px] w-full items-center justify-center rounded-[12px] px-[20px] text-18 leading-[24px] font-medium max-[1439px]:h-[44px] max-[1439px]:text-16"
        >
          {sent ? "Заявка отправлена" : "Отправить заявку"}
        </button>
        {error ? <p className="-mt-[28px] w-full text-center text-16 text-[#27292d]">{error}</p> : null}
      </form>
    </section>
  );
}
