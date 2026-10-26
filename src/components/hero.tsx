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
    <section id="podbor" className="bg-[#f8f8f8]">
      <div className="mx-auto w-full max-w-[940px] px-4 py-12 min-[768px]:pt-[77px] min-[768px]:pb-[146px]">
        <div className="flex flex-col items-start gap-8 min-[768px]:gap-[34px]">
          <h1 className="max-w-[592px] text-[28px] leading-[1.1] font-medium text-black min-[768px]:text-[40px]">
            Проверенные ребцентра для&nbsp;лечения и&nbsp;восстановления
            при&nbsp;зависимостях
          </h1>

          <div className="flex w-full max-w-[320px] flex-col items-center gap-[6px]">
            <div
              role="tablist"
              aria-label="Кому нужна помощь"
              className="flex w-full gap-1 rounded-[10px] bg-[#f6f8fa] p-[2px]"
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
                      "flex flex-1 items-center justify-center rounded-[8px] px-2 py-1.5 text-[14px] leading-5 font-medium tracking-[-0.084px] whitespace-nowrap transition-colors",
                      selected
                        ? "bg-white text-[#0a0d14]"
                        : "text-[#868c98] hover:text-[#0a0d14]",
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            <p className="text-center text-[14px] leading-normal font-normal tracking-[-0.084px] text-[#0a0d14] opacity-40">
              Бесплатная и анонимная консультация
            </p>
          </div>

          <Button variant="brand" size="hero" type="button">
            Подобрать центр
          </Button>
        </div>
      </div>
    </section>
  );
}
