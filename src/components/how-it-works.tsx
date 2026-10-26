"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const steps = [
  "Заполните заявку, указав удобный метод связи",
  "Расскажите о\u00a0ситуации",
  "Мы подберем несколько вариантов под\u00a0ваши критерии",
  "Свяжем вас с\u00a0центром и\u00a0сопроводим на\u00a0моменте подписания договора",
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const el = sectionRef.current;
    if (!el) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const travel = el.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      const scrolled = Math.min(Math.max(-rect.top, 0), travel);
      const progress = scrolled / travel;
      const index = Math.min(
        steps.length - 1,
        Math.floor(progress * steps.length * 0.999),
      );
      setActive((prev) => (prev === index ? prev : index));
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  const goTo = (index: number) => {
    const el = sectionRef.current;
    if (!el || reduced) {
      setActive(index);
      return;
    }
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + (travel * (index + 0.5)) / steps.length,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="kak-rabotaet"
      ref={sectionRef}
      className={cn(
        "mx-auto w-full max-w-[940px] px-4 min-[1440px]:max-w-[1180px]",
        reduced
          ? "pt-16 pb-8 min-[768px]:pt-20"
          : "h-[230vh] min-[768px]:h-[280vh] min-[1440px]:h-[320vh]",
      )}
    >
      <div
        className={cn(
          reduced
            ? ""
            : "sticky top-0 flex h-svh flex-col justify-between py-8 min-[768px]:py-14",
        )}
      >
        {reduced && (
          <h2 className="text-[32px] leading-[1.1] font-medium text-black min-[768px]:text-[44px] min-[1440px]:text-[56px]">
            Как работает подбор
          </h2>
        )}

        <ol className="sr-only">
          {steps.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ol>

        {reduced ? (
          <ol className="mt-12 flex flex-col gap-10">
            {steps.map((text, index) => (
              <li key={text}>
                <p className="text-[15px] font-medium text-[#11ab09]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 max-w-[16em] text-[28px] leading-[1.1] font-medium tracking-[-0.02em] text-black min-[768px]:text-[40px]">
                  {text}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col justify-center">
            <h2 className="text-[32px] leading-[1.1] font-medium text-black min-[768px]:text-[44px] min-[1440px]:text-[56px]">
              Как работает подбор
            </h2>
            <p className="mt-8 text-[15px] font-medium text-[#11ab09] tabular-nums min-[768px]:mt-12 min-[1440px]:text-[18px]">
              {String(active + 1).padStart(2, "0")}
            </p>
            <p
              key={active}
              aria-hidden
              className="mt-3 max-w-[12em] text-[34px] leading-[1.05] font-medium tracking-[-0.03em] text-black motion-safe:[animation:step-in_0.55s_ease] min-[768px]:mt-4 min-[768px]:text-[56px] min-[1440px]:text-[76px]"
            >
              {steps[active]}
            </p>
            <p
              aria-hidden
              className="mt-4 min-h-[1.4em] max-w-[14em] overflow-hidden text-[20px] leading-[1.15] font-medium tracking-[-0.03em] text-[#d4d4d4] [mask-image:linear-gradient(#000_30%,transparent)] min-[768px]:mt-8 min-[768px]:min-h-[2.3em] min-[768px]:text-[32px] min-[1440px]:text-[44px]"
            >
              {steps[active + 1] ?? ""}
            </p>
          </div>
        )}

        <div className={cn("grid grid-cols-4 gap-3", reduced && "mt-12")}>
          {steps.map((text, index) => {
            const reached = index <= active;
            return (
              <button
                key={text}
                type="button"
                onClick={() => goTo(index)}
                aria-current={index === active ? "step" : undefined}
                aria-label={text}
                className="cursor-pointer border-0 bg-transparent p-0 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#11ab09]"
              >
                <span
                  className={cn(
                    "block text-[13px] font-medium tabular-nums min-[1440px]:text-[15px]",
                    index === active
                      ? "text-[#11ab09]"
                      : reached
                        ? "text-[#111]"
                        : "text-[#c8c8c8]",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "mt-2 block h-[3px] w-full",
                    reached ? "bg-[#11ab09]" : "bg-[#ececec]",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
