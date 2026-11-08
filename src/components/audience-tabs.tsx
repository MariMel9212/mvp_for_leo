"use client";

import { useState } from "react";
import { tie } from "@/lib/tie";

const audiences = ["Для близкого", "Для себя", "Для подростка"] as const;

type Audience = (typeof audiences)[number];

export function AudienceTabs() {
  const [active, setActive] = useState<Audience>("Для близкого");

  return (
    <div className="@container w-full max-w-[377px]">
      <div className="flex flex-col items-center gap-[4px]">
        <div
          role="tablist"
          aria-label="Кому нужна помощь"
          className="flex h-[46px] max-w-full items-stretch gap-[4px] rounded-[10px] bg-[#f6f8fa] p-[4px]"
        >
          {audiences.map((label) => (
            <Tab key={label} label={label} selected={active === label} onSelect={() => setActive(label)} />
          ))}
        </div>
        <p className="w-full text-center text-13 text-[#27292d] opacity-50">
          {tie("Бесплатная и анонимная консультация")}
        </p>
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
