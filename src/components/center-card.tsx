import Link from "next/link";
import { CenterPhoto, type CenterSlide } from "@/components/center-photo";
import { tie } from "@/lib/tie";

export type CenterKind = "rehab" | "detox";
export type CenterDependency = "alco" | "narco" | "game";

export type CatalogCenter = {
  title: string;
  course: string;
  price?: string;
  slides: CenterSlide[];
  kind: CenterKind;
  dependencies: CenterDependency[];
  teen: boolean;
  aftercare: boolean;
  titleLines?: string[];
  badge?: { label: string; className: string };
  href?: string;
  place?: string;
};

export const catalogCenters: CatalogCenter[] = [
  {
    title: "Реабилитационно-образовательный центр в Троицке",
    course: "Подростки от 14 до 17 лет",
    price: "200 000 ₽ / мес",
    slides: [
      { src: "/centers/troitsk/house.webp", className: "cover" },
      { src: "/centers/troitsk/attic.webp", className: "cover" },
      { src: "/centers/troitsk/room.webp", className: "cover" },
      { src: "/centers/troitsk/living.webp", className: "cover" },
    ],
    kind: "rehab",
    dependencies: [],
    teen: true,
    aftercare: false,
    titleLines: ["Реабилитационно-образовательный", "центр в Троицке"],
    badge: { label: "Подходит для подростков", className: "w-[188px] bg-[#e1f300]" },
    href: "/uchrezhdeniya/troitsk",
  },
  {
    title: "Реабилитационный центр в Троицке",
    course: "Загородный коттедж • 20 минут от МКАД",
    price: "от 120 000 ₽ / месяц",
    place: "Новая Москва",
    slides: [
      { src: "/centers/klyuchi/group.webp", className: "cover" },
      { src: "/centers/klyuchi/single.webp", className: "cover" },
      { src: "/centers/klyuchi/pool.webp", className: "cover" },
      { src: "/centers/klyuchi/dining.webp", className: "cover" },
    ],
    kind: "rehab",
    dependencies: ["alco", "narco", "game"],
    teen: false,
    aftercare: true,
    href: "/uchrezhdeniya/klyuchi",
  },
  {
    title: "Реабилитационный центр в Чехове",
    course: "Стационар и выезд на дом • 24/7",
    price: "от 450 000 ₽ / месяц",
    place: "Московская область",
    slides: [
      { src: "/centers/narkolog/house.webp", className: "cover" },
      { src: "/centers/narkolog/room.webp", className: "cover" },
      { src: "/centers/narkolog/dining.webp", className: "cover" },
      { src: "/centers/narkolog/group.webp", className: "cover" },
    ],
    kind: "rehab",
    dependencies: ["alco", "narco", "game"],
    teen: true,
    aftercare: false,
    badge: { label: "Подходит для подростков", className: "w-[188px] bg-[#e1f300]" },
    href: "/uchrezhdeniya/narkolog",
  },
];

export function CenterCard({ center }: { center: CatalogCenter }) {
  const className =
    "relative block h-[566px] w-full overflow-hidden rounded-[14px] drop-shadow-[0_0_5px_rgba(91,90,90,0.08)]";
  const card = (
    <>
      <div className="h-[400px] overflow-hidden rounded-t-[14px] bg-white">
        <CenterPhoto slides={center.slides} frameClassName="h-[396px]" />
      </div>
      <div className="absolute top-[372px] right-0 left-0 z-20">
        <div className="relative h-[28px] w-[320px]">
          {center.badge ? (
            <span
              className={`absolute top-0 left-[4px] flex h-[28px] items-start rounded-tr-[14px] pt-[6px] pr-[10px] pb-[2px] pl-[12px] text-13 text-[#0a0d14] ${center.badge.className}`}
            >
              {center.badge.label}
            </span>
          ) : null}
        </div>
        <div className="flex min-h-[166px] flex-col gap-[8px] rounded-b-[14px] bg-white px-[12px] pt-[8px] pb-[14px]">
          <h2 className={`${center.titleLines ? "w-full" : "w-full max-w-[283px]"} text-[22px] leading-[28px] font-medium text-[#0a0d14]`}>
            {center.titleLines ? (
              <>
                <span className="block text-[19px] leading-[28px] min-[1200px]:whitespace-nowrap">{tie(center.titleLines[0])}</span>
                <span className="block min-[1200px]:whitespace-nowrap">{tie(center.titleLines[1])}</span>
              </>
            ) : (
              tie(center.title)
            )}
          </h2>
          <div className="w-full text-16 text-[#0a0d14]">
            <p>{center.place ?? "Московская область"}</p>
            <p className="opacity-50">{tie(center.course)}</p>
          </div>
          {center.price ? <p className="text-16 text-black">{center.price}</p> : null}
        </div>
      </div>
    </>
  );

  if (!center.href) return <article className={className}>{card}</article>;
  return (
    <Link href={center.href} className={className}>
      {card}
    </Link>
  );
}
