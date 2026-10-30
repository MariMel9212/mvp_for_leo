"use client";

import { useState } from "react";

type Kind = "rehab" | "detox";
type FilterId = "all" | Kind;

type Crop = {
  left: string;
  top: string;
  width: string;
  height: string;
};

type Center = {
  id: string;
  kind: Kind;
  image: string;
  crop: Crop;
  name: string;
  region: string;
  course: string;
  type: string;
  badge?: { label: string; tone: "lime" | "blue" };
};

const filters: { id: FilterId; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "detox", label: "Детокс" },
  { id: "rehab", label: "Ребцентр" },
];

const houseCrop: Crop = {
  left: "calc(-29 / 304 * 100%)",
  top: "0",
  width: "calc(429 / 304 * 100%)",
  height: "calc(280 / 274 * 100%)",
};

const manorCrop: Crop = {
  left: "calc(-74 / 304 * 100%)",
  top: "0",
  width: "calc(519 / 304 * 100%)",
  height: "calc(347 / 274 * 100%)",
};

const clinicCrop: Crop = {
  left: "0",
  top: "calc(-18 / 274 * 100%)",
  width: "calc(305 / 304 * 100%)",
  height: "calc(304 / 274 * 100%)",
};

const centers: Center[] = [
  {
    id: "serpuhov-1",
    kind: "rehab",
    image: "/centers/serpuhov.jpg",
    crop: houseCrop,
    name: "Реабилитационный центр в Серпухово",
    region: "Московская область",
    course: "Курс от 3 до 12 месяцев",
    type: "Алко / Нарко / Игро",
  },
  {
    id: "himki-1",
    kind: "rehab",
    image: "/centers/himki-house.jpg",
    crop: manorCrop,
    name: "Реабилитационный центр в Химках",
    region: "Московская область",
    course: "Курс от 3 до 12 месяцев",
    type: "Алко / Нарко",
    badge: { label: "Подходит для подростков", tone: "lime" },
  },
  {
    id: "zelenograd-1",
    kind: "detox",
    image: "/centers/zelenograd-clinic.jpg",
    crop: clinicCrop,
    name: "Детокс клиника в Зеленограде",
    region: "Московская область",
    course: "Курс от 4 до 14 дней",
    type: "Алко / Нарко",
    badge: { label: "Медицинское наблюдение", tone: "blue" },
  },
  {
    id: "zelenograd-2",
    kind: "detox",
    image: "/centers/zelenograd-clinic.jpg",
    crop: clinicCrop,
    name: "Детокс клиника в Зеленограде",
    region: "Московская область",
    course: "Курс от 4 до 14 дней",
    type: "Алко / Нарко",
    badge: { label: "Медицинское наблюдение", tone: "blue" },
  },
  {
    id: "serpuhov-2",
    kind: "rehab",
    image: "/centers/serpuhov.jpg",
    crop: houseCrop,
    name: "Реабилитационный центр в Серпухово",
    region: "Московская область",
    course: "Курс от 3 до 12 месяцев",
    type: "Алко / Нарко / Игро",
  },
  {
    id: "himki-2",
    kind: "rehab",
    image: "/centers/himki-house.jpg",
    crop: manorCrop,
    name: "Реабилитационный центр в Химках",
    region: "Московская область",
    course: "Курс от 3 до 12 месяцев",
    type: "Алко / Нарко",
    badge: { label: "Подходит для подростков", tone: "lime" },
  },
];

const badgeTone = {
  lime: "bg-[#e1f300]",
  blue: "bg-[#edf3fe]",
} as const;

export function Centers() {
  const [filter, setFilter] = useState<FilterId>("all");
  const visible = centers.filter((center) => filter === "all" || center.kind === filter);

  return (
    <section id="uchrezhdeniya" className="mx-auto mt-24 w-full max-w-[1400px] px-4 pb-24 min-[768px]:mt-40 min-[768px]:pb-40 min-[1440px]:px-8">
      <div className="flex flex-col gap-6 min-[768px]:flex-row min-[768px]:items-end min-[768px]:justify-between">
        <h2 className="text-32 font-medium text-[#0a0d14] opacity-[0.96] min-[768px]:text-40 min-[1100px]:text-48">
          Проверенные учереждения
        </h2>
        <div className="flex w-fit items-end gap-2 border-b border-black/40" role="tablist" aria-label="Тип учреждения">
          {filters.map((item) => {
            const selected = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setFilter(item.id)}
                className={
                  selected
                    ? "-mb-px border-b border-black px-0.5 pb-1.5 text-18 font-medium text-black"
                    : "px-0.5 pb-1.5 text-18 font-medium text-black/40"
                }
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 min-[720px]:grid-cols-2 min-[960px]:grid-cols-3">
        {visible.map((center) => (
          <CenterCard key={center.id} center={center} />
        ))}
      </div>

      <a
        href="#podbor"
        className="mx-auto mt-[72px] flex h-11 w-[min(100%,312px)] items-center justify-center rounded-[8px] bg-[#e1f300] text-16 font-medium text-[#0a0d14]/80 hover:bg-[#d6e600]"
      >
        Подобрать центр
      </a>
    </section>
  );
}

function CenterCard({ center }: { center: Center }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[12px] bg-white shadow-[0px_0px_10px_0px_rgba(91,90,90,0.08)]">
      <div className="relative m-1 aspect-[304/274] overflow-hidden rounded-[10px]">
        <img
          src={center.image}
          alt=""
          className="absolute max-w-none object-cover"
          style={center.crop}
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end">
          <span className="relative z-10 rounded-tr-[14px] bg-white px-2.5 py-1.5 text-11 text-[#0a0d14] drop-shadow-[0px_-1px_1.4px_rgba(0,0,0,0.14)]">
            {center.type}
          </span>
          {center.badge ? (
            <span
              className={`-ml-3 rounded-tr-[14px] py-1.5 pr-2.5 pl-4 text-11 text-[#0a0d14] drop-shadow-[0px_-1px_1.4px_rgba(0,0,0,0.14)] ${badgeTone[center.badge.tone]}`}
            >
              {center.badge.label}
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-1.5 px-3 pt-3.5 pb-3.5">
        <h3 className="max-w-[228px] text-18 font-medium text-[#0a0d14]">
          {center.name}
        </h3>
        <div className="flex flex-col gap-1 text-13 text-[#0a0d14]">
          <p>{center.region}</p>
          <p className="opacity-60">{center.course}</p>
        </div>
      </div>
    </article>
  );
}
