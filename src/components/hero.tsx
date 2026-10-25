"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const audiences = [
  { id: "relative", label: "Для близкого" },
  { id: "self", label: "Для себя" },
  { id: "teen", label: "Для подростка" },
] as const;

type AudienceId = (typeof audiences)[number]["id"];

export function Hero() {
  const [audience, setAudience] = useState<AudienceId>("relative");

  return (
    <section
      id="podbor"
      className="flex flex-col items-start justify-center gap-10 bg-[#f4f4f4] px-4 py-14 min-[1280px]:h-[560px] min-[1280px]:gap-[48px] min-[1280px]:px-[190px] min-[1280px]:py-0"
    >
      <h1 className="w-full max-w-[622px] text-[32px] leading-[1.1] font-medium text-[rgba(17,17,17,0.9)] min-[720px]:text-[40px] min-[1280px]:w-[622px] min-[1280px]:text-[44px]">
        <span className="text-[rgba(6,150,59,0.9)]">Проверенные ребцентра</span>
        <br className="max-[1279px]:hidden" />
        <span className="min-[1280px]:hidden"> </span>
        для лечения и восстановления
        <br className="max-[1279px]:hidden" />
        <span className="min-[1280px]:hidden"> </span>
        при зависимостях
      </h1>

      <div className="flex w-full max-w-[339px] flex-col items-start gap-8 min-[1280px]:gap-[36px]">
        <div className="flex w-full flex-col items-center gap-[10px]">
          <div
            role="tablist"
            aria-label="Кому нужна помощь"
            className="flex w-full gap-[2px] rounded-[8px] border border-[rgba(0,0,0,0.1)] bg-[#f7f7f7]"
          >
            {audiences.map((item) => {
              const selected = audience === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setAudience(item.id)}
                  className={cn(
                    "rounded-[8px] px-2.5 py-3 text-[13px] leading-[1.1] font-medium tracking-[-0.5px] whitespace-nowrap text-[rgba(17,17,17,0.9)] min-[400px]:px-[14px] min-[400px]:text-[14px]",
                    selected ? "bg-white" : "opacity-40",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <p className="w-full text-center text-[14px] leading-[1.1] font-normal tracking-[-0.5px] text-[rgba(17,17,17,0.9)] opacity-40">
            Бесплатная и анонимная консультация
          </p>
        </div>

        <Button variant="brand" size="hero" type="button">
          Подобрать ребцентр
        </Button>
      </div>
    </section>
  );
}
