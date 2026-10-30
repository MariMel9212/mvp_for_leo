type Center = {
  title: string;
  course: string;
  photo: string;
  photoClassName: string;
  badge?: { label: string; className: string };
};

const centers: Center[] = [
  {
    title: "Реабилитационный центр в Серпухово",
    course: "Курс от 3 до 12 месяцев",
    photo: "/centers/serpuhov.png",
    photoClassName: "top-[-40px] left-[-86px] h-[507px] w-[594px]",
    badge: { label: "Медицинское наблюдение", className: "w-[192px] bg-[#deeaff]" },
  },
  {
    title: "Реабилитационный центр в Химках",
    course: "Курс от 3 до 12 месяцев",
    photo: "/centers/himki.png",
    photoClassName: "top-[-8px] left-[-126px] h-[507px] w-[719px]",
    badge: { label: "Подходит для подростков", className: "w-[188px] bg-[#e1f300]" },
  },
  {
    title: "Детокс клиника в\u00a0Зеленограде",
    course: "Курс от 4 до 14 дней",
    photo: "/centers/zelenograd.png",
    photoClassName: "top-[-40px] left-[-46px] h-[514px] w-[514px]",
    badge: { label: "Медицинское наблюдение", className: "w-[192px] bg-[#deeaff]" },
  },
  {
    title: "Детокс клиника в\u00a0Зеленограде",
    course: "Курс от 4 до 14 дней",
    photo: "/centers/zelenograd.png",
    photoClassName: "top-[-40px] left-[-46px] h-[514px] w-[514px]",
    badge: { label: "Медицинское наблюдение", className: "w-[192px] bg-[#deeaff]" },
  },
  {
    title: "Реабилитационный центр в Серпухово",
    course: "Курс от 3 до 12 месяцев",
    photo: "/centers/serpuhov.png",
    photoClassName: "top-[-40px] left-[-86px] h-[507px] w-[594px]",
    badge: { label: "Медицинское наблюдение", className: "w-[192px] bg-[#deeaff]" },
  },
  {
    title: "Реабилитационный центр в Химках",
    course: "Курс от 3 до 12 месяцев",
    photo: "/centers/himki.png",
    photoClassName: "top-[-8px] left-[-126px] h-[507px] w-[719px]",
    badge: { label: "Подходит для подростков", className: "w-[188px] bg-[#e1f300]" },
  },
];

function CenterCard({ title, course, photo, photoClassName, badge }: Center) {
  return (
    <article className="relative h-[559px] w-[429px] shadow-[0_0_10px_rgba(91,90,90,0.08)]">
      <div className="h-[425px] overflow-hidden rounded-t-[14px] bg-white">
        <div className="absolute top-[4px] left-[4px] h-[421px] w-[421px] overflow-hidden rounded-[10px]">
          <img alt="" src={photo} className={`absolute max-w-none ${photoClassName}`} />
        </div>
      </div>
      <div className="absolute top-[397px] left-0 w-[429px]">
        <div className="relative h-[28px] w-[320px]">
          {badge ? (
            <span
              className={`absolute top-0 left-[128px] flex h-[28px] items-start rounded-tr-[14px] pt-[6px] pr-[10px] pb-[2px] pl-[18px] text-13 text-[#0a0d14] ${badge.className}`}
            >
              {badge.label}
            </span>
          ) : null}
          <span className="absolute top-0 left-0 flex h-[28px] w-[141px] items-start rounded-tr-[14px] bg-white pt-[6px] pr-[10px] pb-[2px] pl-[12px] text-13 text-[#0a0d14]">
            Алко / Нарко / Игро
          </span>
        </div>
        <div className="flex flex-col gap-[8px] rounded-b-[14px] bg-white px-[12px] pt-[8px] pb-[14px]">
          <h3 className="w-[283px] text-[22px] leading-[28px] font-medium text-[#0a0d14]">{title}</h3>
          <div className="w-[178px] text-16 text-[#0a0d14]">
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
    <section id="uchrezhdeniya" className="mt-[120px] ml-[53px] flex w-[1335px] flex-col gap-[52px]">
      <h2 className="w-[1335px] text-40 font-medium">Лицензированные учереждения</h2>
      <div className="flex w-[1335px] flex-col gap-[24px]">
        <div className="flex gap-[24px]">
          {centers.slice(0, 3).map((center, index) => (
            <CenterCard key={index} {...center} />
          ))}
        </div>
        <div className="flex gap-[24px]">
          {centers.slice(3).map((center, index) => (
            <CenterCard key={index} {...center} />
          ))}
        </div>
      </div>
    </section>
  );
}
