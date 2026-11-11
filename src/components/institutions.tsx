"use client";

import Link from "next/link";
import { Fragment, useEffect, useId, useState } from "react";
import { InstitutionArt, ProgramArt } from "@/components/banner-art";
import { CenterCard, catalogCenters, type CatalogCenter, type CenterDependency, type CenterKind } from "@/components/center-card";
import { asset } from "@/lib/base-path";

type Kind = CenterKind;
type Dependency = CenterDependency;
type Center = CatalogCenter;

const kindOptions: { value: Kind; label: string }[] = [
  { value: "rehab", label: "Реабилитационный центр" },
  { value: "detox", label: "Детокс клиника" },
];

const dependencyOptions: { value: Dependency; label: string }[] = [
  { value: "alco", label: "Алкоголизм" },
  { value: "narco", label: "Наркомания" },
  { value: "game", label: "Игромания" },
];

const centers = catalogCenters;

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
          src={asset("/icons/chevron-filter.svg")}
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
      <span className="text-13 text-[#27292d] opacity-60 min-[1100px]:whitespace-nowrap">{label}</span>
      <FilterCheckbox checked={checked} />
    </button>
  );
}

function CallBanner({ compact = false }: { compact?: boolean }) {
  const linkClass = compact
    ? "relative h-[96px] w-full overflow-hidden rounded-[16px] border border-[rgba(0,0,0,0.04)] bg-[rgba(255,255,255,0.8)] [&>div]:right-[52px] [&>div]:bottom-[-4px] [&>div]:origin-bottom-right [&>div]:scale-[0.4]"
    : "relative h-[136px] w-full overflow-hidden rounded-[20px] border border-[rgba(0,0,0,0.04)] bg-[rgba(255,255,255,0.8)] md:h-[213px] min-[1440px]:w-[588px]";

  return (
    <section
      className={
        compact
          ? "relative overflow-hidden rounded-[24px] bg-gradient-to-b from-[rgba(222,234,255,0.45)] to-[rgba(210,222,243,0.45)] px-4 pt-5 pb-4"
          : "relative mt-[50px] overflow-hidden rounded-[34px] bg-gradient-to-b from-[rgba(222,234,255,0.45)] to-[rgba(210,222,243,0.45)] px-4 pt-[32px] pb-[26px] min-[1440px]:-mx-[22px] min-[1440px]:w-[1244px] min-[1440px]:px-[22px]"
      }
    >
      <div className={`mx-auto flex w-full flex-col items-center text-center text-[#27292d] ${compact ? "gap-2" : "max-w-[611px] gap-[15px]"}`}>
        <h2
          className={
            compact
              ? "text-[22px] leading-[28px] font-medium"
              : "text-40 font-medium max-md:text-28 md:max-[1439px]:text-[32px] md:max-[1439px]:leading-[40px]"
          }
        >
          Запланируйте звонок, чтобы&nbsp;не&nbsp;ошибиться с&nbsp;выбором
        </h2>
        <p className={compact ? "text-[14px] leading-[20px] opacity-60" : "text-16 opacity-60"}>
          На бесплатной и анонимной консультации погрузимся в&nbsp;Вашу проблему и&nbsp;подберем подходящее учреждение
        </p>
      </div>
      <div
        className={
          compact
            ? "mt-4 flex flex-col items-stretch gap-3"
            : "mt-[48px] flex flex-col items-stretch gap-4 min-[1440px]:flex-row min-[1440px]:items-center min-[1440px]:justify-between"
        }
      >
        <Link href="/#zayavka" className={linkClass}>
          <span className={`relative z-10 flex items-center justify-between ${compact ? "px-4 py-3" : "px-[20px] py-[19px]"}`}>
            <span className={compact ? "max-w-[150px] text-[18px] leading-[24px] font-medium" : "max-w-[146px] text-24 font-medium md:max-w-none"}>
              Подобрать учреждение
            </span>
            <span className="flex size-[24px] items-center justify-center">
              <img alt="" src={asset("/icons/angle-right.svg")} width={7.286} height={13.414} />
            </span>
          </span>
          <InstitutionArt />
        </Link>
        <Link href="/#zayavka" className={linkClass}>
          <span className={`relative z-10 flex items-center justify-between ${compact ? "px-4 py-3" : "px-[20px] py-[19px]"}`}>
            <span className={compact ? "max-w-[150px] text-[18px] leading-[24px] font-medium" : "max-w-[146px] text-24 font-medium md:max-w-none"}>
              Подбрать программу
            </span>
            <span className="flex size-[24px] items-center justify-center">
              <img alt="" src={asset("/icons/angle-right.svg")} width={7.286} height={13.414} />
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
    <div className="mt-6 px-[120px] max-[1439px]:px-4">
      <h1 className="text-40 font-medium max-md:text-28 md:max-[1439px]:text-[32px] md:max-[1439px]:leading-[40px]">Все учреждения</h1>
      <form
        className="relative z-20 mt-8 hidden w-full flex-col gap-[20px] rounded-[13px] bg-white px-4 py-[23px] min-[1440px]:px-[21px]"
        onSubmit={(event) => {
          event.preventDefault();
          setApplied(draft);
          setOpenMenu(null);
        }}
      >
        <div className="flex flex-col gap-3 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:gap-[12px]">
          <div data-filter-menu className="min-w-0 flex-1">
            <FilterMenu
              label="Тип учреждения"
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
            <img alt="" src={asset("/icons/filter.svg")} width={20} height={20} />
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
        <p className="mt-8 text-16 text-[#27292d] opacity-60">Нет учреждений по этим условиям</p>
      ) : (
        <div className="mt-8 grid w-full grid-cols-3 gap-6 max-[1199px]:grid-cols-2 max-[639px]:grid-cols-1">
          {firstRows.map((center, index) => (
            <Fragment key={`${center.title}-${index}`}>
              {index === 2 ? (
                <div className="min-[640px]:hidden">
                  <CallBanner compact />
                </div>
              ) : null}
              <CenterCard center={center} />
            </Fragment>
          ))}
          {firstRows.length < 3 ? (
            <div className="min-[640px]:hidden">
              <CallBanner compact />
            </div>
          ) : null}
        </div>
      )}
      {firstRows.length === 0 ? (
        <div className="mt-8 min-[640px]:hidden">
          <CallBanner compact />
        </div>
      ) : null}
      <div className="max-[639px]:hidden">
        <CallBanner />
      </div>
      {rest.length > 0 ? (
        <div className="mt-[50px] grid w-full grid-cols-3 gap-6 max-[1199px]:grid-cols-2 max-[639px]:grid-cols-1">
          {rest.map((center, index) => (
            <CenterCard key={`${center.title}-rest-${index}`} center={center} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
