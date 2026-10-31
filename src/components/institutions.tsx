"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { ChartArt, MagnifierArt } from "@/components/catalog-art";
import { CenterPhoto, type CenterSlide } from "@/components/center-photo";

type Kind = "rehab" | "detox";
type Dependency = "alco" | "narco" | "game";

type Center = {
  title: string;
  course: string;
  price: string;
  slides: CenterSlide[];
  kind: Kind;
  dependencies: Dependency[];
  teen: boolean;
  aftercare: boolean;
  typeLabel: string;
  typeClassName: string;
  badge?: { label: string; className: string };
};

const kindOptions: { value: Kind; label: string }[] = [
  { value: "rehab", label: "Реабилитационный центр" },
  { value: "detox", label: "Детокс клиника" },
];

const dependencyOptions: { value: Dependency; label: string }[] = [
  { value: "alco", label: "Алкоголизм" },
  { value: "narco", label: "Наркомания" },
  { value: "game", label: "Игромания" },
];

const centers: Center[] = [
  {
    title: "Реабилитационный центр в Химках",
    course: "Курс от 3 до 12 месяцев • группа до 20 человек",
    price: "от 80 000 ₽ / месяц",
    slides: [
      { src: "/centers/himki.png", className: "top-[-8px] left-[-149px] h-[507px] w-[719px]" },
      { src: "/centers/himki.png", className: "top-[-8px] left-[-16px] h-[507px] w-[719px]" },
      { src: "/centers/himki.png", className: "top-[-8px] left-[-300px] h-[507px] w-[719px]" },
      { src: "/centers/himki.png", className: "top-[-90px] left-[-160px] h-[507px] w-[719px]" },
    ],
    kind: "rehab",
    dependencies: ["alco", "narco", "game"],
    teen: true,
    aftercare: false,
    typeLabel: "Алко / Нарко / Игро",
    typeClassName: "w-[141px]",
    badge: { label: "Подходит для подростков", className: "left-[128px] w-[188px] bg-[#e1f300]" },
  },
  {
    title: "Реабилитационный центр в Серпухово",
    course: "Курс от 3 до 12 месяцев • группа до 20 человек",
    price: "от 70 000 ₽ / месяц",
    slides: [
      { src: "/centers/serpuhov.png", className: "top-[-40px] left-[-109px] h-[507px] w-[594px]" },
      { src: "/centers/serpuhov.png", className: "top-[-8px] left-[-8px] h-[507px] w-[594px]" },
      { src: "/centers/serpuhov.png", className: "top-[-40px] left-[-210px] h-[507px] w-[594px]" },
      { src: "/centers/serpuhov.png", className: "top-[-100px] left-[-80px] h-[507px] w-[594px]" },
    ],
    kind: "rehab",
    dependencies: ["alco", "narco"],
    teen: false,
    aftercare: false,
    typeLabel: "Алко / Нарко",
    typeClassName: "w-[100px]",
  },
  {
    title: "Детокс клиника в\u00a0Зеленограде",
    course: "Курс от 4 до 14 дней • 3 типа палат",
    price: "от 8 000 ₽ / день",
    slides: [
      { src: "/centers/zelenograd.png", className: "top-[-40px] left-[-69px] h-[514px] w-[514px]" },
      { src: "/centers/zelenograd.png", className: "top-[-8px] left-0 h-[514px] w-[514px]" },
      { src: "/centers/zelenograd.png", className: "top-[-40px] left-[-130px] h-[514px] w-[514px]" },
      { src: "/centers/zelenograd.png", className: "top-[-110px] left-[-40px] h-[514px] w-[514px]" },
    ],
    kind: "detox",
    dependencies: ["alco", "narco"],
    teen: false,
    aftercare: false,
    typeLabel: "Алко / Нарко",
    typeClassName: "w-[100px]",
    badge: { label: "Медицинское наблюдение", className: "left-[87px] w-[192px] bg-[#deeaff]" },
  },
  {
    title: "Детокс клиника в\u00a0Зеленограде",
    course: "Курс от 4 до 14 дней • 3 типа палат",
    price: "от 8 000 ₽ / день",
    slides: [
      { src: "/centers/zelenograd.png", className: "top-[-40px] left-[-69px] h-[514px] w-[514px]" },
      { src: "/centers/zelenograd.png", className: "top-[-8px] left-0 h-[514px] w-[514px]" },
      { src: "/centers/zelenograd.png", className: "top-[-40px] left-[-130px] h-[514px] w-[514px]" },
      { src: "/centers/zelenograd.png", className: "top-[-110px] left-[-40px] h-[514px] w-[514px]" },
    ],
    kind: "detox",
    dependencies: ["alco", "narco"],
    teen: false,
    aftercare: false,
    typeLabel: "Алко / Нарко",
    typeClassName: "w-[100px]",
    badge: { label: "Медицинское наблюдение", className: "left-[87px] w-[192px] bg-[#deeaff]" },
  },
  {
    title: "Реабилитационный центр в Химках",
    course: "Курс от 3 до 12 месяцев • группа до 20 человек",
    price: "от 80 000 ₽ / месяц",
    slides: [
      { src: "/centers/himki.png", className: "top-[-8px] left-[-149px] h-[507px] w-[719px]" },
      { src: "/centers/himki.png", className: "top-[-8px] left-[-16px] h-[507px] w-[719px]" },
      { src: "/centers/himki.png", className: "top-[-8px] left-[-300px] h-[507px] w-[719px]" },
      { src: "/centers/himki.png", className: "top-[-90px] left-[-160px] h-[507px] w-[719px]" },
    ],
    kind: "rehab",
    dependencies: ["alco", "narco", "game"],
    teen: true,
    aftercare: false,
    typeLabel: "Алко / Нарко / Игро",
    typeClassName: "w-[141px]",
    badge: { label: "Подходит для подростков", className: "left-[128px] w-[188px] bg-[#e1f300]" },
  },
  {
    title: "Реабилитационный центр в Серпухово",
    course: "Курс от 3 до 12 месяцев • группа до 20 человек",
    price: "от 70 000 ₽ / месяц",
    slides: [
      { src: "/centers/serpuhov.png", className: "top-[-40px] left-[-109px] h-[507px] w-[594px]" },
      { src: "/centers/serpuhov.png", className: "top-[-8px] left-[-8px] h-[507px] w-[594px]" },
      { src: "/centers/serpuhov.png", className: "top-[-40px] left-[-210px] h-[507px] w-[594px]" },
      { src: "/centers/serpuhov.png", className: "top-[-100px] left-[-80px] h-[507px] w-[594px]" },
    ],
    kind: "rehab",
    dependencies: ["alco", "narco"],
    teen: false,
    aftercare: false,
    typeLabel: "Алко / Нарко",
    typeClassName: "w-[100px]",
  },
  {
    title: "Детокс клиника в\u00a0Зеленограде",
    course: "Курс от 4 до 14 дней • 3 типа палат",
    price: "от 8 000 ₽ / день",
    slides: [
      { src: "/centers/zelenograd.png", className: "top-[-40px] left-[-69px] h-[514px] w-[514px]" },
      { src: "/centers/zelenograd.png", className: "top-[-8px] left-0 h-[514px] w-[514px]" },
      { src: "/centers/zelenograd.png", className: "top-[-40px] left-[-130px] h-[514px] w-[514px]" },
      { src: "/centers/zelenograd.png", className: "top-[-110px] left-[-40px] h-[514px] w-[514px]" },
    ],
    kind: "detox",
    dependencies: ["alco", "narco"],
    teen: false,
    aftercare: false,
    typeLabel: "Алко / Нарко",
    typeClassName: "w-[100px]",
    badge: { label: "Медицинское наблюдение", className: "left-[87px] w-[192px] bg-[#deeaff]" },
  },
];

type Filters = {
  kind: Kind | "";
  dependency: Dependency | "";
  aftercare: boolean;
  teen: boolean;
};

const emptyFilters: Filters = { kind: "", dependency: "", aftercare: false, teen: false };

function matches(center: Center, filters: Filters) {
  if (filters.kind && center.kind !== filters.kind) return false;
  if (filters.dependency && !center.dependencies.includes(filters.dependency)) return false;
  if (filters.aftercare && !center.aftercare) return false;
  if (filters.teen && !center.teen) return false;
  return true;
}

function CenterCard({ center }: { center: Center }) {
  return (
    <article className="relative h-[566px] w-[384px] overflow-hidden rounded-[14px] drop-shadow-[0_0_5px_rgba(91,90,90,0.08)]">
      <div className="h-[400px] overflow-hidden rounded-t-[14px] bg-white">
        <CenterPhoto slides={center.slides} frameClassName="h-[396px]" />
      </div>
      <div className="absolute top-[372px] left-0 w-[384px]">
        <div className="relative h-[28px] w-[320px]">
          {center.badge ? (
            <span
              className={`absolute top-0 flex h-[28px] items-start rounded-tr-[14px] pt-[6px] pr-[10px] pb-[2px] pl-[18px] text-13 text-[#0a0d14] ${center.badge.className}`}
            >
              {center.badge.label}
            </span>
          ) : null}
          <span
            className={`absolute top-0 left-0 z-10 flex h-[28px] items-start rounded-tr-[14px] bg-white pt-[6px] pr-[10px] pb-[2px] pl-[12px] text-13 text-[#0a0d14] ${center.typeClassName}`}
          >
            {center.typeLabel}
          </span>
        </div>
        <div className="flex flex-col gap-[8px] rounded-b-[14px] bg-white px-[12px] pt-[8px] pb-[14px]">
          <h2 className="w-[283px] text-[22px] leading-[28px] font-medium text-[#0a0d14]">{center.title}</h2>
          <div className="w-full text-16 text-[#0a0d14]">
            <p>Московская область</p>
            <p className="opacity-50">{center.course}</p>
          </div>
          <p className="text-16 text-black">{center.price}</p>
        </div>
      </div>
    </article>
  );
}

function FilterMenu({
  label,
  value,
  options,
  open,
  onToggle,
  onSelect,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  open: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
}) {
  const listId = useId();
  return (
    <div className="relative w-full">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={onToggle}
        className="flex h-[48px] w-full items-center justify-between rounded-[10px] bg-[rgba(36,74,127,0.04)] px-[12px] text-left"
      >
        <span className={`min-w-0 truncate text-13 text-black ${value ? "" : "opacity-60"}`}>{value || label}</span>
        <img
          alt=""
          src="/icons/chevron-filter.svg"
          width={16}
          height={16}
          className={`shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open ? (
        <ul id={listId} role="listbox" className="absolute top-[calc(100%+4px)] z-20 w-full rounded-[10px] bg-white py-[4px] shadow-[0_8px_24px_rgba(36,74,127,0.12)]">
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={value === option.label}
                onClick={() => onSelect(option.value)}
                className="flex w-full px-[12px] py-[8px] text-left text-13 text-black hover:bg-[rgba(36,74,127,0.04)]"
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function CheckFilter({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onChange}
      className="flex h-[44px] min-w-0 flex-1 items-center justify-between rounded-[10px] bg-[rgba(36,74,127,0.04)] px-[12px] text-left"
    >
      <span className="text-13 whitespace-nowrap text-black opacity-60">{label}</span>
      <span className="relative size-[18.406px] shrink-0">
        <img alt="" src="/icons/checkbox.svg" width={18.406} height={18.406} />
        {checked ? (
          <svg viewBox="0 0 18.4 18.4" className="absolute inset-0 size-[18.406px]" aria-hidden>
            <path
              d="M5.1 9.3 7.7 11.9 13.4 6.2"
              fill="none"
              stroke="#001024"
              strokeOpacity="0.72"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>
    </button>
  );
}

function CallBanner() {
  return (
    <section className="relative -mx-[22px] mt-[50px] w-[1244px] overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,rgba(238,242,249,0.87)_0%,rgba(158,187,230,0.87)_100%)] px-[22px] pt-[32px] pb-[26px]">
      <div className="mx-auto flex w-[611px] flex-col items-center gap-[15px] text-center text-black">
        <h2 className="text-40 font-medium">Запланируйте звонок, чтобы&nbsp;не&nbsp;ошибиться с&nbsp;выбором</h2>
        <p className="text-16 opacity-60">
          На бесплатной и анонимной консультации погрузимся в&nbsp;Вашу проблему и&nbsp;подберем подходящее учереждение
        </p>
      </div>
      <div className="mt-[48px] flex gap-[24px]">
        <Link href="/#zayavka" className="relative h-[213px] w-[588px] overflow-hidden rounded-[20px] bg-[rgba(255,255,255,0.7)]">
          <span className="flex items-center justify-between px-[20px] py-[19px]">
            <span className="text-24 font-medium">Подобрать учереждение</span>
            <span className="flex size-[24px] items-center justify-center">
              <img alt="" src="/icons/angle-right.svg" width={7.286} height={13.414} />
            </span>
          </span>
          <MagnifierArt className="pointer-events-none absolute top-px left-[250.18px]" />
        </Link>
        <Link href="/#zayavka" className="relative h-[213px] w-[588px] overflow-hidden rounded-[20px] bg-[rgba(255,255,255,0.7)]">
          <span className="flex items-center justify-between px-[20px] py-[19px]">
            <span className="text-24 font-medium">Подбрать программу</span>
            <span className="flex size-[24px] items-center justify-center">
              <img alt="" src="/icons/angle-right.svg" width={7.286} height={13.414} />
            </span>
          </span>
          <ChartArt className="pointer-events-none absolute top-[48px] left-[201px] h-[216.993px] w-[389px]" />
        </Link>
      </div>
    </section>
  );
}

export function Institutions() {
  const [draft, setDraft] = useState<Filters>(emptyFilters);
  const [applied, setApplied] = useState<Filters>(emptyFilters);
  const [openMenu, setOpenMenu] = useState<"kind" | "dependency" | null>(null);
  const visible = centers.filter((center) => matches(center, applied));
  const firstRows = visible.slice(0, 6);
  const rest = visible.slice(6);

  useEffect(() => {
    if (!openMenu) return;
    function close(event: MouseEvent) {
      const target = event.target;
      if (target instanceof Element && target.closest("[data-filter-menu]")) return;
      setOpenMenu(null);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [openMenu]);

  return (
    <div className="mt-[58px] px-[120px]">
      <h1 className="text-40 font-medium">Все учереждения</h1>
      <form
        className="relative z-20 mt-[46px] flex w-[1200px] flex-col gap-[20px] rounded-[13px] bg-white px-[21px] py-[23px]"
        onSubmit={(event) => {
          event.preventDefault();
          setApplied(draft);
          setOpenMenu(null);
        }}
      >
        <div className="flex items-center gap-[12px]">
          <div data-filter-menu className="min-w-0 flex-1">
            <FilterMenu
              label="Тип учереждения"
              value={kindOptions.find((option) => option.value === draft.kind)?.label ?? ""}
              options={kindOptions}
              open={openMenu === "kind"}
              onToggle={() => setOpenMenu((menu) => (menu === "kind" ? null : "kind"))}
              onSelect={(value) => {
                setDraft((current) => ({ ...current, kind: value as Kind }));
                setOpenMenu(null);
              }}
            />
          </div>
          <div data-filter-menu className="min-w-0 flex-1">
            <FilterMenu
              label="Тип зависимости"
              value={dependencyOptions.find((option) => option.value === draft.dependency)?.label ?? ""}
              options={dependencyOptions}
              open={openMenu === "dependency"}
              onToggle={() => setOpenMenu((menu) => (menu === "dependency" ? null : "dependency"))}
              onSelect={(value) => {
                setDraft((current) => ({ ...current, dependency: value as Dependency }));
                setOpenMenu(null);
              }}
            />
          </div>
          <CheckFilter
            label="Постлечебная программа"
            checked={draft.aftercare}
            onChange={() => setDraft((current) => ({ ...current, aftercare: !current.aftercare }))}
          />
          <CheckFilter
            label="Подходит для подростков"
            checked={draft.teen}
            onChange={() => setDraft((current) => ({ ...current, teen: !current.teen }))}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setDraft(emptyFilters);
              setApplied(emptyFilters);
              setOpenMenu(null);
            }}
            className="flex items-center gap-[4px] rounded-[12px] bg-[#f6ffc8] px-[12px] py-[9px] text-16 text-black opacity-40"
          >
            <img alt="" src="/icons/filter.svg" width={20} height={20} />
            Очистить фильтр
          </button>
          <button
            type="submit"
            className="flex h-[42px] w-[142px] items-center justify-center rounded-[8px] bg-[#e1f300] px-[20px] text-16 text-black"
          >
            Применить
          </button>
        </div>
      </form>

      {firstRows.length === 0 ? (
        <p className="mt-[46px] text-16 text-black opacity-60">Нет учереждений по этим условиям</p>
      ) : (
        <div className="mt-[46px] flex w-[1200px] flex-wrap gap-x-[24px] gap-y-[24px]">
          {firstRows.map((center, index) => (
            <CenterCard key={`${center.title}-${index}`} center={center} />
          ))}
        </div>
      )}
      <CallBanner />
      {rest.length > 0 ? (
        <div className="mt-[50px] flex w-[1200px] flex-wrap gap-x-[24px] gap-y-[24px]">
          {rest.map((center, index) => (
            <CenterCard key={`${center.title}-rest-${index}`} center={center} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
