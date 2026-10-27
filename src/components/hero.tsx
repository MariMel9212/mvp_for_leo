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
    <section
      id="podbor"
      className="relative overflow-hidden bg-gradient-to-b from-[#cee0f5] to-white"
    >
      <div
        className="pointer-events-none absolute bottom-0"
        style={{ left: "-34.84%", width: "169.55%", height: "clamp(220px, 21.5vw, 360px)" }}
      >
        <HeroGrass />
      </div>
      <div
        className="relative z-10 mx-auto w-full max-w-[940px] px-4 min-[1440px]:max-w-[1180px]"
        style={{
          paddingTop: "clamp(152px, calc(16.1vw + 64px), 320px)",
          paddingBottom: "clamp(157px, calc(18.92vw - 36px), 281px)",
        }}
      >
        <div
          className="flex flex-col items-center text-center"
          style={{ gap: "clamp(28px, 2.65625vw, 56px)" }}
        >
          <h1 className="w-full max-w-[clamp(320px,46.25vw,960px)] text-[clamp(26px,2.96875vw,64px)] leading-[1.1] font-medium text-[#111]">
            Проверенные ребцентра для&nbsp;лечения и&nbsp;восстановления
            при&nbsp;зависимостях
          </h1>

          <div
            className="flex flex-col gap-[6px]"
            style={{ width: "clamp(280px, 25vw, 560px)" }}
          >
            <div
              role="tablist"
              aria-label="Кому нужна помощь"
              className="flex h-[clamp(36px,2.8125vw,58px)] w-full gap-[2px] rounded-[10px] bg-[#f6f8fa] p-[2px]"
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
                      "flex h-full flex-1 items-center justify-center px-[8px] text-[clamp(14px,1.09375vw,22px)] leading-5 font-medium tracking-[-0.084px] whitespace-nowrap transition-colors",
                      selected
                        ? "rounded-[8px] bg-white text-[#0a0d14]"
                        : "rounded-[6px] text-[#868c98] hover:text-[#0a0d14]",
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            <p className="text-center text-[clamp(14px,1.09375vw,22px)] leading-[normal] font-normal tracking-[-0.084px] text-[#0a0d14] opacity-40">
              Бесплатная и анонимная консультация
            </p>
          </div>

          <Button
            type="button"
            className="h-[clamp(46px,3.59375vw,74px)] overflow-hidden rounded-[8px] border-0 bg-[#037bd7] px-[10px] text-[clamp(17px,1.328125vw,28px)] leading-[1.1] font-medium text-white shadow-[inset_0px_2px_3px_0px_rgba(255,255,255,0.25)] hover:bg-[#037bd7]"
            style={{ width: "clamp(280px, 25vw, 560px)" }}
          >
            Подобрать центр
          </Button>
        </div>
      </div>
    </section>
  );
}
