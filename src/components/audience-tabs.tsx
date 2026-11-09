"use client";

import { useState } from "react";
import { tie } from "@/lib/tie";

const audiences = [
  { label: "Для близкого", note: "Поможем разобраться, как помочь близкому" },
  { label: "Для себя", note: "Бесплатная и анонимная консультация" },
  { label: "Для подростка", note: "Поможем подобрать программу для подростка" },
] as const;

type Audience = (typeof audiences)[number]["label"];

export function AudienceTabs() {
  const [active, setActive] = useState<Audience>("Для близкого");
  const note = audiences.find((item) => item.label === active)?.note ?? audiences[0].note;

  return (
    <div className="@container w-full max-w-[377px]">
      <div className="flex flex-col items-center gap-[4px] min-[1440px]:gap-[10px]">
        <div
          role="tablist"
          aria-label="Кому нужна помощь"
          className="flex h-[46px] max-w-full items-stretch gap-[4px] rounded-[10px] bg-[#f6f8fa] p-[4px]"
        >
          {audiences.map((item) => (
            <Tab key={item.label} label={item.label} selected={active === item.label} onSelect={() => setActive(item.label)} />
          ))}
        </div>
        <p className="w-full text-center text-13 text-[#27292d] opacity-50 min-[1440px]:text-[15px] min-[1440px]:leading-[22px]">{tie(note)}</p>
      </div>
    </div>
  );
}

function Tab({
  label,
  selected,
  onSelect,
}: {
  label: Audience;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onSelect}
      className={`flex h-full items-center justify-center px-[14px] py-[4px] text-16 leading-none font-normal whitespace-nowrap text-[#27292d] @max-[360px]:px-[10px] @max-[360px]:text-[15px] ${selected ? "rounded-[8px] bg-white" : "rounded-[6px] opacity-50"}`}
    >
      {label}
    </button>
  );
}
