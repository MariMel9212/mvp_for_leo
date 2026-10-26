"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const steps = [
  "Заполните заявку, указав удобный метод связи",
  "Расскажите о ситуации",
  "Мы подберем несколько вариантов под ваши критерии",
  "Свяжем вас с центром и сопроводим на моменте подписания договора",
];

export function HowItWorks() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section
      id="kak-rabotaet"
      className="mx-auto w-full max-w-[940px] px-4 pt-16 min-[768px]:pt-20 min-[1440px]:max-w-[1180px] min-[1440px]:pt-24"
    >
      <h2 className="text-center text-[32px] leading-[1.1] font-medium text-black min-[768px]:text-[44px] min-[1440px]:text-[56px]">
        Как работает подбор
      </h2>

      <div
        className="relative mt-14 hidden min-[1024px]:block min-[1440px]:mt-16"
        onMouseLeave={() => setActive(null)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setActive(null);
          }
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-10 min-[1440px]:h-12"
        >
          <div className="absolute top-1/2 right-[12.5%] left-[12.5%] h-px -translate-y-1/2 bg-[#e6e6e6]" />
          <div
            className="absolute top-1/2 left-[12.5%] h-px -translate-y-1/2 bg-[#11ab09] transition-[width] duration-300 ease-out"
            style={{ width: active === null ? "0%" : `${active * 25}%` }}
          />
        </div>
        <ol className="grid grid-cols-4">
          {steps.map((text, index) => {
            const reached = active !== null && index <= active;
            const current = active === index;
            return (
              <li
                key={text}
                tabIndex={0}
                className="relative px-3 text-center outline-none"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
              >
                <span
                  className={cn(
                    "relative z-10 mx-auto grid size-10 place-items-center rounded-full text-[14px] font-medium transition-colors duration-300 min-[1440px]:size-12 min-[1440px]:text-[16px]",
                    reached
                      ? "bg-[#11ab09] text-white"
                      : "bg-white text-[#11ab09] ring-2 ring-[#11ab09]",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p
                  className={cn(
                    "mt-6 text-[16px] leading-[1.35] font-medium text-[#0a0d14] transition-opacity duration-300 min-[1440px]:text-[18px]",
                    active !== null && !current && "opacity-40",
                  )}
                >
                  {text}
                </p>
              </li>
            );
          })}
        </ol>
      </div>

      <ol className="mt-10 min-[1024px]:hidden">
        {steps.map((text, index) => (
          <li key={text} className="flex gap-5">
            <div className="flex flex-col items-center">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#11ab09] text-[14px] font-medium text-white">
                {String(index + 1).padStart(2, "0")}
              </span>
              {index < steps.length - 1 && (
                <span className="my-1 w-px flex-1 bg-[#11ab09]/30" />
              )}
            </div>
            <p className="pt-2 pb-8 text-[16px] leading-[1.35] font-medium text-[#0a0d14]">
              {text}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
