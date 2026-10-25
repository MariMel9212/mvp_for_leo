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
    <section id="podbor" className="bg-[#f4f4f4]">
      <div className="mx-auto w-full min-w-[320px] px-[15px] py-10 min-[576px]:max-w-[540px] min-[768px]:max-w-[720px] min-[768px]:pt-[85px] min-[768px]:pb-[180px] min-[992px]:max-w-[960px] min-[1200px]:max-w-[1140px]">
        <div className="flex flex-col items-stretch gap-8 min-[768px]:items-start min-[768px]:gap-10">
          <h1 className="max-w-[640px] text-[24px] leading-[26px] font-medium text-[#141414] min-[768px]:text-[56px] min-[768px]:leading-[58px]">
            <span className="text-[rgba(6,150,59,0.9)]">Проверенные ребцентра</span>
            {" для\u00A0лечения и\u00A0восстановления при\u00A0зависимостях"}
          </h1>

          <div className="flex w-full flex-col gap-2 min-[768px]:w-max">
          <div
            role="tablist"
            aria-label="Кому нужна помощь"
            className="flex h-12 w-full items-center rounded-[8px] border border-[#dae0e5] bg-[#f3f5f6] min-[768px]:h-14 min-[768px]:w-max min-[768px]:max-w-full min-[768px]:rounded-[12px]"
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
                    "flex h-full min-w-0 flex-1 items-center justify-center px-4 text-[15px] leading-6 font-normal tracking-[-0.16px] whitespace-nowrap text-[#8497a6] transition-colors min-[390px]:text-[16px] min-[768px]:flex-none min-[768px]:px-5 min-[768px]:text-[18px] min-[768px]:tracking-[-0.28px]",
                    selected
                      ? "rounded-[9px] bg-white font-medium text-[#1a2833] min-[768px]:rounded-[12px] min-[768px]:leading-[22px]"
                      : "hover:bg-white/20 hover:text-[#1a2833]",
                  )}
                >
                  <span className="flex flex-col items-center">
                    <span>{item.label}</span>
                    <span aria-hidden="true" className="h-0 overflow-hidden font-medium invisible">
                      {item.label}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-center text-[12px] leading-[18px] font-normal text-[#687077] min-[768px]:text-[16px]">
            Бесплатная и анонимная консультация
          </p>
          </div>
          <Button variant="brand" size="hero" type="button">
            Подобрать ребцентр
          </Button>
        </div>
      </div>
    </section>
  );
}
