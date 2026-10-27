"use client";

import { useState } from "react";
import { HeroGrass } from "@/components/hero-grass";
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
    <section id="podbor" className="relative overflow-hidden bg-[#eee]">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[150px] min-[768px]:h-[180px] min-[1440px]:h-[210px]">
        <HeroGrass />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-[940px] px-4 pt-12 pb-44 min-[768px]:pt-[77px] min-[768px]:pb-[200px] min-[1440px]:max-w-[1180px] min-[1440px]:pt-[120px] min-[1440px]:pb-[250px]">
        <div className="flex flex-col items-center gap-8 text-center min-[768px]:gap-[34px] min-[1440px]:gap-12">
          <h1 className="max-w-[592px] text-[26px] leading-[1.1] font-medium text-black min-[768px]:text-[38px] min-[1440px]:max-w-[960px] min-[1440px]:text-[61px]">
            Проверенные ребцентра для&nbsp;лечения и&nbsp;восстановления
            при&nbsp;зависимостях
          </h1>

          <div className="flex w-full max-w-[320px] flex-col items-center gap-[6px] min-[1440px]:max-w-[440px] min-[1440px]:gap-2">
            <div
              role="tablist"
              aria-label="Кому нужна помощь"
              className="flex h-[44px] w-full gap-1 rounded-[10px] bg-[#f6f8fa] p-[2px] min-[1440px]:h-[52px]"
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
                      "flex h-full flex-1 items-center justify-center rounded-[8px] px-2 text-[14px] leading-5 font-medium tracking-[-0.084px] whitespace-nowrap transition-colors min-[1440px]:text-[16px]",
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
            <p className="text-center text-[14px] leading-normal font-normal tracking-[-0.084px] text-[#0a0d14] opacity-40 min-[1440px]:text-[16px]">
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
