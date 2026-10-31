"use client";

import { useState } from "react";

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

export function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="px-[120px] pt-[120px] pb-[80px]">
      <div className="mx-auto flex w-[1200px] flex-col items-center gap-[48px]">
        <div className="flex w-full flex-col items-center gap-[10px] text-center">
          <h2 className="text-40 font-medium">Частые вопросы</h2>
          <p className="text-[18px] leading-[24px] opacity-60">Отвечаем на вопросы, которые возникают чаще всего</p>
        </div>
        <div className="flex w-[823px] flex-col gap-[12px]">
          {items.map((item, index) => {
            const expanded = open === index;
            return (
              <div key={item.q} className="overflow-hidden rounded-[16px] border border-[rgba(17,54,105,0.04)] bg-white">
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? -1 : index)}
                  className="flex h-[76px] w-full items-center justify-between py-[24px] pr-[24px] pl-[28px] text-left"
                >
                  <span className="text-18 leading-[28px] font-medium">{item.q}</span>
                  <Chevron open={expanded} />
                </button>
                {expanded && item.a ? (
                  <div className="px-[28px] pb-[24px]">
                    <div className="h-px bg-[#dedede] opacity-60" />
                    <p className="pt-[20px] text-16 text-black">{item.a}</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
