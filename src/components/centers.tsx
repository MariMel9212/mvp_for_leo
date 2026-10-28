"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const centers = [
  {
    id: "himki",
    image: "/centers/himki.png",
    name: "Ребцентр в Химках",
    program: "Программа от 3 до 12 мес",
  },
  {
    id: "zelenograd",
    image: "/centers/zelenograd.png",
    name: "Ребцентр в Зеленограде",
    program: "Программа от 5 до 12 мес",
  },
  {
    id: "istra",
    image: "/centers/timber.png",
    name: "Ребцентр в Истре",
    program: "Программа от 3 до 12 мес",
    price: "90 000",
  },
  {
    id: "zvenigorod",
    image: "/centers/log.png",
    name: "Ребцентр в Звенигороде",
    program: "Программа от 6 до 12 мес",
    price: "120 000",
  },
  {
    id: "odintsovo",
    image: "/centers/himki.png",
    name: "Ребцентр в Одинцово",
    program: "Программа от 3 до 9 мес",
  },
  {
    id: "solnechnogorsk",
    image: "/centers/zelenograd.png",
    name: "Ребцентр в Солнечногорске",
    program: "Программа от 4 до 12 мес",
    price: "80 000",
  },
];

export function Centers() {
  const scroller = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;

    const sync = () => {
      setEdges({
        start: el.scrollLeft <= 2,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
      });
    };

    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, []);

  const move = (direction: number) => {
    const el = scroller.current;
    const card = el?.querySelector("article");
    if (!el || !card) return;
    const gap = Number.parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap) || 16;
    el.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: "smooth" });
  };

  return (
    <section
      id="uchrezhdeniya"
      aria-roledescription="карусель"
      className="mx-auto mt-24 w-full max-w-[1400px] px-4 pb-24 min-[768px]:mt-40 min-[768px]:pb-40 min-[1440px]:px-8"
    >
      <div className="flex w-full flex-col gap-12 min-[768px]:gap-[88px]">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[clamp(36px,6vw,56px)] leading-[1.1] font-medium text-[#0a0d14]">
            Проверенные учереждения
          </h2>
          <div className="flex shrink-0 gap-2">
            <CarouselButton
              label="Предыдущие центры"
              disabled={edges.start}
              onClick={() => move(-1)}
            >
              <Chevron direction="left" />
            </CarouselButton>
            <CarouselButton
              label="Следующие центры"
              disabled={edges.end}
              onClick={() => move(1)}
            >
              <Chevron direction="right" />
            </CarouselButton>
          </div>
        </div>

        <div
          ref={scroller}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {centers.map((center) => (
            <article
              key={center.id}
              className="relative aspect-[464/463] w-[86%] shrink-0 snap-start overflow-hidden rounded-[23px] min-[768px]:w-[calc((100%-16px)/2)]"
            >
              <img
                src={center.image}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-b from-transparent to-black/80 px-4 pt-10 pb-4">
                <div className="min-w-0">
                  <h3 className="text-[20px] leading-[1.1] font-medium text-white">
                    {center.name}
                  </h3>
                  <p className="mt-1 text-[14px] leading-[1.1] font-normal text-white/80">
                    {center.program}
                  </p>
                </div>
                {center.price ? (
                  <p className="flex shrink-0 items-end gap-1.5 whitespace-nowrap text-white">
                    <span className="text-[20px] leading-[1.1] font-medium">
                      {center.price}
                    </span>
                    <span className="text-[14px] leading-[1.1] opacity-80">
                      ₽ / месяц
                    </span>
                  </p>
                ) : (
                  <button
                    type="button"
                    className="inline-flex h-[34px] shrink-0 items-center justify-center rounded-[8px] bg-[rgba(120,216,112,0.92)] px-[10px] text-[16px] leading-[1.1] font-medium text-[rgba(17,17,17,0.9)]"
                  >
                    Запросить цену
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CarouselButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-11 items-center justify-center rounded-[8px] bg-[#0a0d14] text-[#fffffc] transition-opacity disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d={direction === "left" ? "M11 4L6 9l5 5" : "M7 4l5 5-5 5"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
