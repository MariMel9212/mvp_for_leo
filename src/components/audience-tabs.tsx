"use client";

import { useState } from "react";

const audiences = ["Для близкого", "Для себя", "Для подростка"] as const;

type Audience = (typeof audiences)[number];

export function AudienceTabs() {
  const [active, setActive] = useState<Audience>("Для близкого");

  return (
    <div className="flex w-[377px] flex-col items-center gap-[4px]">
      <div
        role="tablist"
        aria-label="Кому нужна помощь"
        className="flex w-full items-center gap-[4px] rounded-[10px] bg-[#f6f8fa] p-[4px]"
      >
        <Tab
          label={audiences[0]}
          selected={active === audiences[0]}
          onSelect={() => setActive(audiences[0])}
        />
        <div className="flex h-[32px] items-center">
          {audiences.slice(1).map((label) => (
            <Tab
              key={label}
              label={label}
              selected={active === label}
              onSelect={() => setActive(label)}
            />
          ))}
        </div>
      </div>
      <p className="w-full text-center text-13 text-[#27292d] opacity-50">
        Бесплатная и анонимная консультация
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
      className={
        selected
          ? "flex h-[32px] items-center justify-center rounded-[8px] bg-white px-[14px] text-16 text-[#27292d]"
          : "flex h-[32px] items-center justify-center rounded-[6px] px-[14px] text-16 text-[#27292d] opacity-50"
      }
    >
      {label}
    </button>
  );
}
