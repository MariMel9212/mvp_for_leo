import Link from "next/link";
import { CenterPhoto, type CenterSlide } from "@/components/center-photo";

type Center = {
  title: string;
  course: string;
  slides: CenterSlide[];
  badge?: { label: string; className: string };
};

const himkiSlides: CenterSlide[] = [
  { src: "/centers/himki.png", className: "top-[-8px] left-[-149px] h-[507px] w-[719px]" },
  { src: "/centers/himki.png", className: "top-[-8px] left-[-16px] h-[507px] w-[719px]" },
  { src: "/centers/himki.png", className: "top-[-8px] left-[-300px] h-[507px] w-[719px]" },
  { src: "/centers/himki.png", className: "top-[-90px] left-[-160px] h-[507px] w-[719px]" },
];

const serpuhovSlides: CenterSlide[] = [
  { src: "/centers/serpuhov.png", className: "top-[-40px] left-[-109px] h-[507px] w-[594px]" },
  { src: "/centers/serpuhov.png", className: "top-[-8px] left-[-8px] h-[507px] w-[594px]" },
  { src: "/centers/serpuhov.png", className: "top-[-40px] left-[-210px] h-[507px] w-[594px]" },
  { src: "/centers/serpuhov.png", className: "top-[-100px] left-[-80px] h-[507px] w-[594px]" },
];

const zelenogradSlides: CenterSlide[] = [
  { src: "/centers/zelenograd.webp", className: "top-[-40px] left-[-69px] h-[514px] w-[514px]" },
  { src: "/centers/zelenograd.webp", className: "top-[-8px] left-0 h-[514px] w-[514px]" },
  { src: "/centers/zelenograd.webp", className: "top-[-40px] left-[-130px] h-[514px] w-[514px]" },
  { src: "/centers/zelenograd.webp", className: "top-[-110px] left-[-40px] h-[514px] w-[514px]" },
];

const teenBadge = { label: "Подходит для подростков", className: "w-[188px] bg-[#e1f300] text-[#27292d]" };
const medicalBadge = { label: "Медицинское наблюдение", className: "w-[192px] bg-[#deeaff] text-[#0a0d14]" };

const centers: Center[] = [
  {
    title: "Реабилитационный центр в Химках",
    course: "Курс от 3 до 12 месяцев",
    slides: himkiSlides,
    badge: teenBadge,
  },
  {
    title: "Реабилитационный центр в Серпухово",
    course: "Курс от 3 до 12 месяцев",
    slides: serpuhovSlides,
  },
  {
    title: "Детокс клиника в\u00a0Зеленограде",
    course: "Курс от 4 до 14 дней",
    slides: zelenogradSlides,
    badge: medicalBadge,
  },
  {
    title: "Детокс клиника в\u00a0Зеленограде",
    course: "Курс от 4 до 14 дней",
    slides: zelenogradSlides,
    badge: medicalBadge,
  },
  {
    title: "Реабилитационный центр в Химках",
    course: "Курс от 3 до 12 месяцев",
    slides: himkiSlides,
    badge: teenBadge,
  },
  {
    title: "Реабилитационный центр в Серпухово",
    course: "Курс от 3 до 12 месяцев",
    slides: serpuhovSlides,
  },
];

function CenterCard({ title, course, slides, badge }: Center) {
  return (
    <article className="relative h-[534px] w-full overflow-hidden rounded-[14px] drop-shadow-[0_0_5px_rgba(91,90,90,0.08)]">
      <div className="h-[400px] overflow-hidden rounded-t-[14px] bg-white">
        <CenterPhoto slides={slides} frameClassName="h-[396px]" />
      </div>
      <div className="absolute top-[372px] right-0 left-0">
        <div className="relative h-[28px] w-[320px]">
          {badge ? (
            <span
              className={`absolute top-0 left-[4px] flex h-[28px] items-start rounded-tr-[14px] pt-[6px] pr-[10px] pb-[2px] pl-[12px] text-13 ${badge.className}`}
            >
              {badge.label}
            </span>
          ) : null}
        </div>
        <div className="flex flex-col gap-[8px] rounded-b-[14px] bg-white px-[12px] pt-[8px] pb-[14px]">
          <h3 className="text-[22px] leading-[28px] font-medium text-[#27292d]">{title}</h3>
          <div className="text-16 text-[#27292d]">
            <p>Московская область</p>
            <p className="opacity-50">{course}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export function LicensedCenters() {
  return (
    <section id="uchrezhdeniya" className="mt-16 px-[120px] max-[1439px]:px-4 md:mt-[120px]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 min-[1440px]:gap-[52px]">
        <h2 className="text-40 font-medium max-[1439px]:text-[32px] max-[1439px]:leading-[40px]">Лицензированные учереждения</h2>
        <div className="grid grid-cols-3 gap-6 max-[1199px]:grid-cols-2 max-[639px]:grid-cols-1">
          {centers.map((center, index) => (
            <CenterCard key={index} {...center} />
          ))}
        </div>
        <Link
          href="/uchrezhdeniya"
          className="lime-control mx-auto flex h-[56px] w-full max-w-[377px] items-center justify-center gap-[4px] rounded-[12px] px-[20px] text-18 leading-[24px] font-medium"
        >
          Смотреть все
          <img alt="" src="/icons/arrow-right.svg" width={24} height={24} />
        </Link>
      </div>
    </section>
  );
}
