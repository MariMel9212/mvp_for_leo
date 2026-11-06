"use client";

import { useEffect, useRef, useState } from "react";

const items: { q: string; a?: string }[] = [
  {
    q: "Как вы подбираете учреждение?",
    a: "Мы анализируем вашу ситуацию: тип зависимости, состояние человека, регион, бюджет и\u00a0предпочтения по формату помощи — детокс или реабилитация. На основе этих данных отбираем несколько учреждений из нашей базы проверенных организаций, у которых есть действующая лицензия, квалифицированный персонал и прозрачные условия договора",
  },
  { q: "Консультация действительно бесплатная и анонимная?" },
  { q: "В чём разница между детоксом и реабилитацией?" },
  { q: "Вы работаете только с Московским регионом?" },
  { q: "Что делать, если ситуация экстренная?" },
  { q: "Могу ли я подобрать учреждение для подростка?" },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={`shrink-0 ${open ? "" : "rotate-180"}`}
    >
      <path d="M6 15L12 9L18 15" stroke="#27292D" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function trimSpacer(spacer: HTMLDivElement | null) {
  if (!spacer || spacer.offsetHeight === 0) return;
  const slack = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
  const spare = Math.min(spacer.offsetHeight, Math.max(0, slack));
  if (spare > 0) spacer.style.height = `${spacer.offsetHeight - spare}px`;
}

function holdQuestion(button: HTMLButtonElement, spacer: HTMLDivElement | null, locking: { current: boolean }) {
  const top = button.getBoundingClientRect().top;
  const scroller = document.documentElement;
  let lastHeight = scroller.scrollHeight;
  const started = performance.now();
  locking.current = true;
  const lock = () => {
    const delta = lastHeight - scroller.scrollHeight;
    if (spacer && Math.abs(delta) > 0.5) {
      spacer.style.height = `${Math.max(0, spacer.offsetHeight + delta)}px`;
    }
    lastHeight = scroller.scrollHeight;
    const shift = button.getBoundingClientRect().top - top;
    if (Math.abs(shift) > 0.5) window.scrollBy(0, shift);
    if (performance.now() - started < 360) {
      requestAnimationFrame(lock);
      return;
    }
    trimSpacer(spacer);
    locking.current = false;
  };
  requestAnimationFrame(lock);
}

export function FaqSection() {
  const [open, setOpen] = useState(0);
  const spacer = useRef<HTMLDivElement>(null);
  const locking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (!locking.current) trimSpacer(spacer.current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="px-[120px] pt-16 pb-16 [overflow-anchor:none] max-[1439px]:px-4 min-[1440px]:pt-[120px] min-[1440px]:pb-[80px]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-8 min-[1440px]:gap-[48px]">
        <div className="flex w-full flex-col items-center gap-[10px] text-center">
          <h2 className="text-40 font-medium max-[1439px]:text-[32px] max-[1439px]:leading-[40px]">Частые вопросы</h2>
          <p className="text-[18px] leading-[24px] opacity-60">Отвечаем на вопросы, которые возникают чаще всего</p>
        </div>
        <div className="flex w-full max-w-[823px] flex-col gap-[12px]">
          {items.map((item, index) => {
            const expanded = open === index;
            return (
              <div key={item.q} className="overflow-hidden rounded-[16px] border border-[rgba(17,54,105,0.04)] bg-white">
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={(event) => {
                    holdQuestion(event.currentTarget, spacer.current, locking);
                    setOpen(expanded ? -1 : index);
                  }}
                  className="flex min-h-[76px] w-full items-center justify-between gap-4 py-4 pr-4 pl-5 text-left min-[1440px]:py-[24px] min-[1440px]:pr-[24px] min-[1440px]:pl-[28px]"
                >
                  <span className="text-18 leading-[28px] font-medium">{item.q}</span>
                  <Chevron open={expanded} />
                </button>
                {item.a ? (
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-[28px] pb-[24px]">
                        <div className="h-px bg-[#dedede] opacity-60" />
                        <p className="pt-[20px] text-16 text-black">{item.a}</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
      <div ref={spacer} aria-hidden />
    </section>
  );
}
