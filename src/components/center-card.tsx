import Link from "next/link";
import { CenterPhoto, type CenterSlide } from "@/components/center-photo";
import { tie } from "@/lib/tie";

export type CenterKind = "rehab" | "detox";
export type CenterDependency = "alco" | "narco" | "game";

export type CatalogCenter = {
  title: string;
  titleLines: [string, string];
  course: string;
  price?: string;
  slides: CenterSlide[];
  kind: CenterKind;
  dependencies: CenterDependency[];
  teen: boolean;
  aftercare: boolean;
  badge?: { label: string; className: string };
  href?: string;
  place?: string;
};

export const catalogCenters: CatalogCenter[] = [
  {
    title: "Реабилитационный центр в Чехове",
    titleLines: ["Реабилитационный центр", "в Чехове"],
    course: "Детоксикация и реабилитация",
    place: "Подмосковье",
    slides: [
      { src: "/centers/narkolog/house.webp", className: "cover" },
      { src: "/centers/narkolog/sauna.webp", className: "cover" },
      { src: "/centers/narkolog/room.webp", className: "cover" },
      { src: "/centers/narkolog/group.webp", className: "cover" },
    ],
    kind: "rehab",
    dependencies: ["alco", "narco"],
    teen: false,
    aftercare: true,
    href: "/uchrezhdeniya/vyhod-est",
  },
  {
    title: "Реабилитационно-образовательный центр",
    titleLines: ["Реабилитационно-", "образовательный центр"],
    course: "Индивидуальная программа",
    place: "Москва",
    slides: [
      { src: "/centers/troitsk/house.webp", className: "cover" },
      { src: "/centers/troitsk/attic.webp", className: "cover" },
      { src: "/centers/troitsk/room.webp", className: "cover" },
      { src: "/centers/troitsk/living.webp", className: "cover" },
    ],
    kind: "rehab",
    dependencies: [],
    teen: true,
    aftercare: true,
    badge: { label: "Подходит для подростков", className: "bg-[#e1f300]" },
    href: "/uchrezhdeniya/obraz-mysli",
  },
  {
    title: "Реабилитационный центр в Подмосковье",
    titleLines: ["Реабилитационный центр", "в Подмосковье"],
    course: "Авторская методика",
    price: "от 120 000 ₽ / мес",
    place: "Подмосковье",
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
    title: "Детокс клиника в Химках",
    titleLines: ["Детокс клиника", "в Химках"],
    course: "Детоксикация и вывод из запоя",
    price: "от 5 500 ₽",
    place: "Химки",
    slides: [
      { src: "/centers/profmed/ward.webp", className: "cover" },
      { src: "/centers/profmed/consult.webp", className: "cover" },
      { src: "/centers/profmed/procedure.webp", className: "cover" },
      { src: "/centers/profmed/dining.webp", className: "cover" },
    ],
    kind: "detox",
    dependencies: ["alco", "narco", "game"],
    teen: false,
    aftercare: false,
    badge: { label: "Детокс", className: "bg-[#deeaff]" },
    href: "/uchrezhdeniya/profmed",
  },
];

export function CenterCard({ center }: { center: CatalogCenter }) {
  const className = "relative block w-full drop-shadow-[0px_8px_10px_rgba(91,90,90,0.08)]";
  const card = (
    <div className="relative h-[494px] w-full md:h-[534px]">
      <div className="absolute top-0 right-0 left-0 h-[360px] overflow-hidden rounded-tl-[14px] rounded-tr-[14px] bg-white md:h-[400px]">
        <CenterPhoto slides={center.slides} frameClassName="bottom-0" />
      </div>
      <div className="absolute top-[332px] right-0 left-0 z-20 md:top-[372px]">
        <div className="flex h-[28px] items-start">
          {center.badge ? (
            <span
              className={`flex h-[28px] items-center rounded-tr-[14px] pt-[6px] pr-[10px] pb-[2px] pl-[12px] text-[13px] leading-[20px] whitespace-nowrap text-[#27292d] ${center.badge.className}`}
            >
              {center.badge.label}
            </span>
          ) : null}
        </div>
        <div className="flex flex-col gap-[8px] rounded-bl-[14px] rounded-br-[14px] bg-white px-[12px] pt-[8px] pb-[14px] text-[#27292d]">
          <h2 className="w-[283px] max-w-full text-[22px] leading-[28px] font-medium">
            <span className="block">{tie(center.titleLines[0])}</span>
            <span className="block">{tie(center.titleLines[1])}</span>
          </h2>
          <div className="flex w-full flex-col text-[16px] leading-[24px]">
            <p>{center.place ?? "Московская область"}</p>
            <p className="opacity-50">{tie(center.course)}</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (!center.href) return <article className={className}>{card}</article>;
  return (
    <Link href={center.href} className={className}>
      {card}
    </Link>
  );
}
