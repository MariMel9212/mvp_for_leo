"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { InstitutionArt, ProgramArt } from "@/components/banner-art";
import { CenterPhoto, type CenterSlide } from "@/components/center-photo";

type Kind = "rehab" | "detox";
type Dependency = "alco" | "narco" | "game";

type Center = {
  title: string;
  course: string;
  price?: string;
  slides: CenterSlide[];
  kind: Kind;
  dependencies: Dependency[];
  teen: boolean;
  aftercare: boolean;
  titleLines?: string[];
  badge?: { label: string; className: string };
  href?: string;
  place?: string;
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
    title: "Реабилитационно-образовательный центр в Троицке",
    course: "Подростки от 14 до 17 лет",
    price: "200 000 ₽ / мес",
    slides: [
      { src: "/centers/troitsk/house.webp", className: "cover" },
      { src: "/centers/troitsk/attic.webp", className: "cover" },
      { src: "/centers/troitsk/room.webp", className: "cover" },
      { src: "/centers/troitsk/living.webp", className: "cover" },
    ],
    kind: "rehab",
    dependencies: [],
    teen: true,
    aftercare: false,
    titleLines: ["Реабилитационно-образовательный", "центр в Троицке"],
    badge: { label: "Подходит для подростков", className: "w-[188px] bg-[#e1f300]" },
    href: "/uchrezhdeniya/troitsk",
  },
  {
    title: "Реабилитационный центр в Троицке",
    course: "Загородный стационар • от 1 месяца",
    price: "от 120 000 ₽ / месяц",
    slides: [
      { src: "/centers/klyuchi/group.webp", className: "cover" },
      { src: "/centers/klyuchi/single.webp", className: "cover" },
      { src: "/centers/klyuchi/pool.webp", className: "cover" },
      { src: "/centers/klyuchi/dining.webp", className: "cover" },
    ],
    kind: "rehab",
    dependencies: ["alco", "narco"],
    teen: false,
    aftercare: true,
    badge: { label: "Без постановки на учёт", className: "w-fit bg-[#deeaff]" },
    href: "/uchrezhdeniya/klyuchi",
  },
];


type Filters = {
  kind: Kind | "";
  dependency: Dependency | "";
  aftercare: boolean;
  teen: boolean;
};

const emptyFilters: Filters = { kind: "", dependency: "", aftercare: false, teen: false };

function filtersActive(filters: Filters) {
  return Boolean(filters.kind || filters.dependency || filters.aftercare || filters.teen);
}

function matches(center: Center, filters: Filters) {
  if (filters.kind && center.kind !== filters.kind) return false;
  if (filters.dependency && !center.dependencies.includes(filters.dependency)) return false;
  if (filters.aftercare && !center.aftercare) return false;
  if (filters.teen && !center.teen) return false;
  return true;
}

function CenterCard({ center }: { center: Center }) {
  const className =
    "relative block h-[566px] w-[384px] overflow-hidden rounded-[14px] drop-shadow-[0_0_5px_rgba(91,90,90,0.08)]";
  const card = (
    <>
      <div className="h-[400px] overflow-hidden rounded-t-[14px] bg-white">
        <CenterPhoto slides={center.slides} frameClassName="h-[396px]" />
      </div>
      <div className="absolute top-[372px] left-0 z-20 w-[384px]">
        <div className="relative h-[28px] w-[320px]">
          {center.badge ? (
            <span
              className={`absolute top-0 left-[4px] flex h-[28px] items-start rounded-tr-[14px] pt-[6px] pr-[10px] pb-[2px] pl-[12px] text-13 text-[#0a0d14] ${center.badge.className}`}
            >
              {center.badge.label}
            </span>
          ) : null}
        </div>
        <div className="flex min-h-[166px] flex-col gap-[8px] rounded-b-[14px] bg-white px-[12px] pt-[8px] pb-[14px]">
          <h2 className={`${center.titleLines ? "w-full" : "w-[283px]"} text-[22px] leading-[28px] font-medium text-[#0a0d14]`}>
            {center.titleLines ? (
              <>
                <span className="block text-[19px] leading-[28px] whitespace-nowrap">{center.titleLines[0]}</span>
                <span className="block whitespace-nowrap">{center.titleLines[1]}</span>
              </>
            ) : (
              center.title
            )}
          </h2>
          <div className="w-full text-16 text-[#0a0d14]">
            <p>{center.place ?? "Московская область"}</p>
            <p className="opacity-50">{center.course}</p>
          </div>
          {center.price ? <p className="text-16 text-black">{center.price}</p> : null}
        </div>
      </div>
    </>
  );

  if (!center.href) return <article className={className}>{card}</article>;
  return (
    <Link href={center.href} className={className}>
      {card}
    </Link>
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
        <span className={`min-w-0 truncate text-13 text-[#27292d] ${value ? "" : "opacity-60"}`}>{value || label}</span>
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
                className="flex w-full px-[12px] py-[8px] text-left text-13 text-[#27292d] hover:bg-[rgba(36,74,127,0.04)]"
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

export function FilterCheckbox({ checked }: { checked: boolean }) {
  if (checked) {
    return (
      <span className="relative size-[18.406px] shrink-0">
        <span className="absolute top-[1.534px] left-[1.534px] size-[15.338px] rounded-[3.068px] bg-[#e1f300]" />
        <svg
          viewBox="0 0 6.902085304260254 5.368288993835449"
          fill="none"
          aria-hidden
          className="absolute top-[4.985px] left-[4.218px] h-[5.368px] w-[6.902px] overflow-visible"
        >
          <path
            d="M0 3.2209732500270025 L2.1911382440694576 5.368288993835449 L6.902085304260254 0"
            stroke="#626262"
            strokeWidth="1.534"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  return (
    <svg viewBox="0 0 18.4056 18.4056" fill="none" aria-hidden className="size-[18.406px] shrink-0">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.571 3.8345V14.5711H3.83447V3.8345H14.571V3.8345ZM14.5711 2.3007H3.83449C2.9909 2.3007 2.3007 2.9909 2.3007 3.83449V14.5711C2.3007 15.4147 2.9909 16.1049 3.83449 16.1049H14.5711C15.4147 16.1049 16.1049 15.4147 16.1049 14.5711V3.83449C16.1049 2.9909 15.4147 2.3007 14.5711 2.3007Z"
        className="filter-check"
      />
    </svg>
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
      className="group flex h-[44px] min-w-0 flex-1 items-center justify-between rounded-[10px] bg-[rgba(36,74,127,0.04)] px-[12px] text-left"
    >
      <span className="text-13 whitespace-nowrap text-[#27292d] opacity-60">{label}</span>
      <FilterCheckbox checked={checked} />
    </button>
  );
}

function CallBanner() {
  return (
    <section className="relative -mx-[22px] mt-[50px] w-[1244px] overflow-hidden rounded-[34px] bg-gradient-to-b from-[rgba(222,234,255,0.45)] to-[rgba(210,222,243,0.45)] px-[22px] pt-[32px] pb-[26px]">
      <div className="mx-auto flex w-[611px] flex-col items-center gap-[15px] text-center text-[#27292d]">
        <h2 className="text-40 font-medium">Запланируйте звонок, чтобы&nbsp;не&nbsp;ошибиться с&nbsp;выбором</h2>
        <p className="text-16 opacity-60">
          На бесплатной и анонимной консультации погрузимся в&nbsp;Вашу проблему и&nbsp;подберем подходящее учереждение
        </p>
      </div>
      <div className="mt-[48px] flex items-center justify-between">
        <Link
          href="/#zayavka"
          className="relative h-[213px] w-[588px] overflow-hidden rounded-[20px] border border-[rgba(0,0,0,0.04)] bg-[rgba(255,255,255,0.8)]"
        >
          <span className="flex items-center justify-between px-[20px] py-[19px]">
            <span className="text-24 font-medium">Подобрать учереждение</span>
            <span className="flex size-[24px] items-center justify-center">
              <img alt="" src="/icons/angle-right.svg" width={7.286} height={13.414} />
            </span>
          </span>
          <InstitutionArt />
        </Link>
        <Link
          href="/#zayavka"
          className="relative h-[213px] w-[588px] overflow-hidden rounded-[20px] border border-[rgba(0,0,0,0.04)] bg-[rgba(255,255,255,0.8)]"
        >
          <span className="flex items-center justify-between px-[20px] py-[19px]">
            <span className="text-24 font-medium">Подбрать программу</span>
            <span className="flex size-[24px] items-center justify-center">
              <img alt="" src="/icons/angle-right.svg" width={7.286} height={13.414} />
            </span>
          </span>
          <ProgramArt />
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
  const canFilter = filtersActive(draft) || filtersActive(applied);
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
            disabled={!canFilter}
            onClick={() => {
              setDraft(emptyFilters);
              setApplied(emptyFilters);
              setOpenMenu(null);
            }}
            className="flex items-center gap-[4px] rounded-[12px] px-[12px] py-[9px] text-16 text-[#27292d] disabled:opacity-40"
          >
            <img alt="" src="/icons/filter.svg" width={20} height={20} />
            Очистить фильтр
          </button>
          <button
            type="submit"
            disabled={!canFilter}
            className="lime-control flex h-[42px] w-[142px] items-center justify-center rounded-[8px] px-[20px] text-16"
          >
            Применить
          </button>
        </div>
      </form>

      {firstRows.length === 0 ? (
        <p className="mt-[46px] text-16 text-[#27292d] opacity-60">Нет учереждений по этим условиям</p>
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
