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
          paddingTop: "clamp(120px, calc(16.1vw + 32px), 288px)",
          paddingBottom: "clamp(157px, calc(18.92vw - 36px), 281px)",
        }}
      >
        <div
          className="flex flex-col items-center text-center"
          style={{ gap: "clamp(28px, 2.65625vw, 56px)" }}
        >
          <h1 className="w-full max-w-[clamp(340px,48.7vw,1010px)] text-[clamp(28px,calc(2.96875vw+2px),66px)] leading-[1.1] font-medium text-[#111]">
            Проверенные ребцентра для&nbsp;лечения и&nbsp;восстановления
            при&nbsp;зависимостях
          </h1>

          <div
            className="flex w-fit max-w-full flex-col items-stretch"
            style={{ gap: "clamp(28px, 2.65625vw, 56px)" }}
          >
            <div className="flex flex-col gap-[6px]">
              <div
                role="tablist"
                aria-label="Кому нужна помощь"
                className="flex h-[clamp(40px,2.8125vw,62px)] w-max max-w-full gap-1 rounded-[10px] bg-[#f6f8fa] p-1"
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
                        "flex h-full items-center justify-center px-[clamp(16px,1.4vw,24px)] text-[clamp(14px,1.09375vw,22px)] leading-5 font-normal tracking-[-0.084px] whitespace-nowrap transition-colors",
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
              className="h-[clamp(46px,3.59375vw,74px)] w-full overflow-hidden rounded-[8px] border-0 bg-[#e1f300] px-[10px] text-[clamp(17px,1.328125vw,28px)] leading-[1.1] font-medium text-[#0a0d14] shadow-[inset_0px_2px_3px_0px_rgba(255,255,255,0.25)] hover:bg-[#d6e600]"
            >
              Подобрать центр
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
