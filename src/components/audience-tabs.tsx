"use client";

import { useState } from "react";
import { tie } from "@/lib/tie";

const audiences = ["Для близкого", "Для себя", "Для подростка"] as const;

type Audience = (typeof audiences)[number];

export function AudienceTabs() {
  const [active, setActive] = useState<Audience>("Для близкого");

  return (
    <div className="flex w-full max-w-[377px] flex-col items-center gap-[4px]">
      <div
        role="tablist"
        aria-label="Кому нужна помощь"
        className="grid h-[58px] w-full grid-cols-3 gap-[4px] rounded-[12px] bg-[#f6f8fa] p-[4px] min-[1440px]:h-[46px] min-[1440px]:rounded-[10px]"
      >
        {audiences.map((label) => (
          <Tab key={label} label={label} selected={active === label} onSelect={() => setActive(label)} />
        ))}
      </div>
      <p className="w-full text-center text-13 text-[#27292d] opacity-50">
        {tie("Бесплатная и анонимная консультация")}
      </p>
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
      className={`flex h-full min-w-0 items-center justify-center rounded-[8px] px-1.5 text-[15px] leading-none whitespace-nowrap text-[#27292d] min-[1440px]:px-[14px] min-[1440px]:text-16 ${selected ? "bg-white" : "opacity-50"}`}
    >
      {label}
    </button>
  );
}
