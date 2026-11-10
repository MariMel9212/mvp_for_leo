"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const steps = ["Разбираемся в ситуации", "Определяем формат", "Отбираем учреждения"];

export function StepRail({ children }: { children: ReactNode }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const update = () => {
      if (!window.matchMedia("(max-width: 767px)").matches) return;
      const cards = [...el.querySelectorAll<HTMLElement>(":scope > article")];
      const edge = el.getBoundingClientRect().left;
      let best = 0;
      let bestDist = Number.POSITIVE_INFINITY;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.getBoundingClientRect().left - edge);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setIndex(best);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function go(next: number) {
    const el = scroller.current;
    const card = el?.querySelectorAll<HTMLElement>(":scope > article")[next];
    if (!el || !card) return;
    const pad = Number.parseFloat(getComputedStyle(el).paddingLeft) || 0;
    el.scrollTo({ left: card.offsetLeft - pad, behavior: "smooth" });
  }

  return (
    <div>
      <div
        ref={scroller}
        className="step-rail relative w-full max-md:flex max-md:snap-x max-md:snap-mandatory max-md:scroll-pl-4 max-md:items-stretch max-md:gap-6 max-md:overflow-x-auto max-md:pr-12 max-md:pl-4 max-md:-mx-4 max-md:w-[calc(100%+2rem)] md:max-[1439px]:grid md:max-[1439px]:w-full md:max-[1439px]:grid-cols-1 md:max-[1439px]:gap-6 md:max-[1439px]:p-0 min-[1440px]:flex min-[1440px]:h-[486px] min-[1440px]:flex-row min-[1440px]:items-end min-[1440px]:gap-[24px] min-[1440px]:p-0"
      >
        {children}
      </div>
      <div className="mt-6 flex items-center justify-center gap-2 md:hidden">
        {steps.map((label, i) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            aria-current={i === index ? "true" : undefined}
            onClick={() => go(i)}
            className={`h-1.5 rounded-full transition-[width] ${i === index ? "w-6 bg-[#7ea0e0]" : "w-1.5 bg-[#d2def3]"}`}
          />
        ))}
      </div>
    </div>
  );
}
