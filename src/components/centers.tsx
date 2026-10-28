"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const centers = [
  {
    id: "rassvet",
    image: "/centers/himki.png",
    focus: "center",
    name: "Центр «Рассвет»",
    region: "Московская область",
    match: 92,
    price: "120 000",
    note: "Стационар на 3–6 месяцев. Небольшие группы и работа с семьёй.",
  },
  {
    id: "tishina",
    image: "/centers/timber.png",
    focus: "center",
    name: "Центр «Тишина»",
    region: "Химки",
    match: 88,
    price: "90 000",
    note: "Детокс и программа до 12 месяцев. Медицинское наблюдение, группы до 15 человек.",
  },
  {
    id: "bereg",
    image: "/centers/zelenograd.png",
    focus: "center",
    name: "Центр «Берег»",
    region: "Зеленоград",
    match: 85,
    price: "80 000",
    note: "Поэтапное восстановление, 5–12 месяцев. Группы до 18 человек.",
  },
  {
    id: "sosny",
    image: "/centers/log.png",
    focus: "center",
    name: "Центр «Сосны»",
    region: "Истра",
    match: 90,
    price: "110 000",
    note: "Загородная программа 12 шагов, 3–12 месяцев. Группы до 12 человек.",
  },
  {
    id: "polyana",
    image: "/centers/himki.png",
    focus: "18% 40%",
    name: "Центр «Поляна»",
    region: "Звенигород",
    match: 87,
    price: "100 000",
    note: "Стационар с трудотерапией, 6–12 месяцев. Группы до 20 человек.",
  },
  {
    id: "orion",
    image: "/centers/timber.png",
    focus: "78% center",
    name: "Центр «Орион»",
    region: "Одинцово",
    match: 84,
    price: "95 000",
    note: "Семейное сопровождение, программа 4–12 месяцев. Группы до 16 человек.",
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
    const gap = Number.parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap) || 32;
    el.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: "smooth",
    });
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
            <CarouselButton label="Предыдущие центры" disabled={edges.start} onClick={() => move(-1)}>
              <Chevron direction="left" />
            </CarouselButton>
            <CarouselButton label="Следующие центры" disabled={edges.end} onClick={() => move(1)}>
              <Chevron direction="right" />
            </CarouselButton>
          </div>
        </div>

        <div
          ref={scroller}
          className="flex snap-x snap-mandatory items-stretch gap-8 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {centers.map((center) => (
            <CenterCard key={center.id} center={center} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CenterCard({ center }: { center: (typeof centers)[number] }) {
  return (
    <article className="flex w-[min(84%,400px)] shrink-0 snap-start flex-col overflow-hidden rounded-[11px] border border-[rgba(58,124,238,0.07)] bg-[#f5faff] min-[900px]:w-[400px]">
      <div className="h-[210px] overflow-hidden">
        <img
          src={center.image}
          alt=""
          className="size-full object-cover"
          style={{ objectPosition: center.focus }}
        />
      </div>
      <div className="flex flex-1 flex-col px-[26px] pt-6 pb-[26px]">
        <h3 className="text-[22px] leading-[1.1] font-medium text-[#0a0d14]">
          {center.name}
        </h3>
        <p className="mt-2.5 text-[14px] leading-[1.2] text-[#0a0d14] opacity-40">
          {center.region}
        </p>
        <p className="mt-1 text-[14px] leading-[1.1] text-[#0a0d14]">
          <span className="font-medium">{center.match}%</span>
          <span className="opacity-40"> совпадение</span>
        </p>
        <p className="mt-4 text-[14px] leading-[1.2] text-[#0a0d14]">{center.note}</p>
        <div className="mt-auto flex flex-col items-start gap-5 pt-8">
          <p className="text-[22px] leading-[1.1] font-medium text-[#0a0d14]">
            от {center.price} ₽
            <span className="mt-1 block text-[14px] leading-[1.1] font-normal opacity-40">
              в месяц
            </span>
          </p>
          <a
            href="#podbor"
            className="inline-flex h-11 items-center justify-center rounded-[8px] bg-[#e1f300] px-4 text-[16px] leading-[1.1] font-medium text-[#0a0d14]/80 hover:bg-[#d6e600]"
          >
            Выбрать
          </a>
        </div>
      </div>
    </article>
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
      className="inline-flex size-11 items-center justify-center rounded-[8px] bg-[#f6f8fa] text-[#0a0d14] transition-opacity disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d={direction === "left" ? "M12.5 4.2L6.7 10l5.8 5.8" : "M7.5 4.2L13.3 10 7.5 15.8"}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
