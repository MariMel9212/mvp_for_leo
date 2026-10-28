"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const centers = [
  {
    id: "rassvet",
    image: "/centers/rassvet.png",
    name: "Центр «Рассвет»",
    region: "Московская область",
    match: 92,
    price: "120 000",
    tags: ["Стационар", "Программа 3–6 месяцев", "Работа с семьёй"],
    groups: "Небольшие группы до 20 человек",
    program: "Индивидуальная программа",
    team: "Психологи, психиатры, семейные терапевты",
  },
  {
    id: "tishina",
    image: "/centers/himki.png",
    name: "Центр «Тишина»",
    region: "Химки",
    match: 88,
    price: "90 000",
    tags: ["Стационар", "Программа 3–12 месяцев", "Детокс"],
    groups: "Группы до 15 человек",
    program: "Программа с медицинским наблюдением",
    team: "Наркологи, психотерапевты, консультанты",
  },
  {
    id: "bereg",
    image: "/centers/zelenograd.png",
    name: "Центр «Берег»",
    region: "Зеленоград",
    match: 85,
    price: "80 000",
    tags: ["Стационар", "Программа 5–12 месяцев", "Реабилитация"],
    groups: "Небольшие группы до 18 человек",
    program: "Поэтапная программа восстановления",
    team: "Психологи, социальные работники, врачи",
  },
  {
    id: "sosny",
    image: "/centers/timber.png",
    name: "Центр «Сосны»",
    region: "Истра",
    match: 90,
    price: "110 000",
    tags: ["Загород", "Программа 3–12 месяцев", "12 шагов"],
    groups: "Группы до 12 человек",
    program: "Индивидуальный план на каждый этап",
    team: "Психологи, аддиктологи, терапевты",
  },
  {
    id: "polyana",
    image: "/centers/log.png",
    name: "Центр «Поляна»",
    region: "Звенигород",
    match: 87,
    price: "100 000",
    tags: ["Стационар", "Программа 6–12 месяцев", "Труд"],
    groups: "Группы до 20 человек",
    program: "Программа с трудотерапией",
    team: "Психологи, психиатры, инструкторы",
  },
  {
    id: "orion",
    image: "/centers/zelenograd.png",
    name: "Центр «Орион»",
    region: "Одинцово",
    match: 84,
    price: "95 000",
    tags: ["Стационар", "Программа 4–12 месяцев", "Семья"],
    groups: "Небольшие группы до 16 человек",
    program: "Семейная программа сопровождения",
    team: "Психологи и семейные терапевты",
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
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
    <article className="@container w-[min(88%,403px)] shrink-0 snap-start min-[900px]:w-[403px]">
      <div className="relative h-[calc(100cqw*459/403)]">
        <div className="absolute top-0 left-0 flex h-[459px] w-[403px] origin-top-left flex-col rounded-[26px] bg-white font-[family-name:var(--font-inter)] text-[#080909] shadow-[0px_22px_42px_0px_rgba(90,81,76,0.05)] [transform:scale(calc(100cqw/403px))]">
          <div className="relative mx-[13px] mt-[13px] h-[157px] overflow-hidden rounded-[17px]">
          <img
            src={center.image}
            alt=""
            className={
              center.image.endsWith("rassvet.png")
                ? "absolute top-[-187.9%] left-[-299.7%] h-[518.5%] w-[510.8%] max-w-none"
                : "absolute inset-0 size-full object-cover"
            }
          />
          <button
            type="button"
            aria-label={`Добавить ${center.name} в избранное`}
            className="absolute top-4 right-[15px] grid size-11 place-items-center rounded-[22px] bg-white"
          >
            <img src="/centers/icons/heart.svg" alt="" width={22} height={22} />
          </button>
          <div className="absolute bottom-[13px] left-[15px] flex h-[47px] items-center gap-[11px] rounded-[16px] bg-white px-[13px]">
            <img src="/centers/icons/sparkles.svg" alt="" width={22} height={22} />
            <p className="text-[16px] leading-normal whitespace-nowrap">
              Подходит на {center.match}%
            </p>
          </div>
          </div>

          <div className="flex flex-1 flex-col px-[25px] pt-[18px] pb-[17px]">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[21px] leading-[1.25] font-medium">{center.name}</h3>
              <img src="/centers/icons/pin.svg" alt="" width={16} height={16} className="mt-1 opacity-[0.08]" />
            </div>
            <p className="mt-[5px] flex items-center gap-1 text-[15px] leading-[1.25]">
              <img src="/centers/icons/map-pin.svg" alt="" width={16} height={16} />
              {center.region}
            </p>
            <div className="mt-2.5 flex gap-[5px]">
              {center.tags.map((tag) => (
                <span
                  key={tag}
                  className="shrink-0 rounded-[7px] bg-[#f2f2f1] px-2 py-1 text-[11.5px] leading-[15px] whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
            <ul className="mt-[25px] flex flex-col gap-[10px]">
              <Feature icon="/centers/icons/users.svg">{center.groups}</Feature>
              <Feature icon="/centers/icons/shield.svg">{center.program}</Feature>
              <Feature icon="/centers/icons/user.svg">{center.team}</Feature>
            </ul>
            <div className="mt-auto flex items-center justify-between gap-3 pt-[17px]">
              <p className="text-[21px] leading-[1.25]">от {center.price} ₽ / месяц</p>
              <button
                type="button"
                aria-label={`Открыть ${center.name}`}
                className="grid size-[45px] shrink-0 place-items-center rounded-[23px] bg-[#efeeec]"
              >
                <img src="/centers/icons/arrow.svg" alt="" width={20} height={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function Feature({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <li className="flex items-start gap-[17px] text-[14px] leading-[1.25]">
      <img src={icon} alt="" width={21} height={21} className="mt-px shrink-0" />
      <span>{children}</span>
    </li>
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
      className="inline-flex size-[45px] items-center justify-center rounded-[23px] bg-[#efeeec] text-[#080909] transition-opacity disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
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
