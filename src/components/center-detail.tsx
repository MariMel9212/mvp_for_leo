import { CallRequestButton } from "@/components/call-request-modal";

const facts = [
  {
    label: "Направления:",
    value: "алкоголизм, наркомания",
    extra: "+2",
  },
  { label: "Формат:", value: "с проживанием" },
  { label: "Программа:", value: "АН, АА, АИ" },
  { label: "Курс:", value: "от 3 до 12 месяцев" },
  { label: "Выпускников:", value: "148 человек" },
];

const amenities = [
  [
    { icon: "/icons/amenity-pool.svg", label: "Бассейн" },
    { icon: "/icons/amenity-group.svg", label: "Групповая" },
    { icon: "/icons/amenity-territory.svg", label: "Частная территория" },
  ],
  [
    { icon: "/icons/amenity-gym.svg", label: "Спортзал" },
    { icon: "/icons/amenity-dining.svg", label: "Столовая" },
    { icon: "/icons/amenity-rooms.svg", label: "Отдельные комнаты" },
  ],
];

export function CenterDetail() {
  return (
    <div className="mx-auto mt-[58px] w-[1200px] pb-[160px]">
      <div className="relative h-[400px] overflow-hidden rounded-[23px]">
        <div className="absolute top-0 left-0 h-[400px] w-[598px] overflow-hidden bg-[#cfcece]">
          <div className="absolute top-0 left-[calc(50%-13.5px)] h-[528px] w-[719px] -translate-x-1/2">
            <img
              alt="Дом реабилитационного центра"
              src="/centers/himki/house.png"
              className="absolute top-[0.02%] left-[-2.82%] h-[99.98%] w-[105.64%] max-w-none"
            />
          </div>
        </div>
        <div className="absolute top-0 right-[301px] h-[198px] w-[297px] overflow-hidden bg-[#cfcece]">
          <img
            alt="Спальня"
            src="/centers/himki/yoga.png"
            width={303}
            height={227}
            className="absolute top-0 left-0 h-[227px] w-[303px] max-w-none object-cover"
          />
        </div>
        <div className="absolute top-0 right-0 h-[198px] w-[297px] overflow-hidden bg-[#cfcece]">
          <img
            alt="Бассейн"
            src="/centers/himki/bedroom.png"
            width={339}
            height={254}
            className="absolute top-[-26px] left-0 h-[254px] w-[339px] max-w-none object-cover"
          />
        </div>
        <div className="absolute right-[301px] bottom-0 h-[198px] w-[297px] overflow-hidden bg-[#cfcece]">
          <img
            alt="Зал для занятий"
            src="/centers/himki/pool.png"
            width={301}
            height={201}
            className="absolute top-0 left-0 h-[201px] w-[301px] max-w-none object-cover"
          />
        </div>
        <div className="absolute right-0 bottom-0 h-[198px] w-[297px] overflow-hidden bg-[#cfcece]">
          <img
            alt=""
            src="/centers/himki/kitchen.png"
            width={301}
            height={200}
            className="absolute top-0 left-0 h-[200px] w-[301px] max-w-none object-cover"
          />
          <div className="absolute inset-0 bg-[rgba(74,74,74,0.38)]" />
          <p className="absolute top-[85px] left-[81px] text-18 font-medium text-white">+ 8 фотографий</p>
        </div>
      </div>

      <div className="mt-[34px] flex items-start justify-between">
        <div className="w-[699px]">
          <div className="flex flex-col gap-[16px] border-b border-[rgba(0,0,0,0.04)] pb-[32px]">
            <div className="flex flex-col gap-[6px]">
              <h1 className="text-28 font-medium">Реабилитационный центр в Химках</h1>
              <p className="text-18">Московская область</p>
            </div>
            <CallRequestButton
              label="Выбрать центр"
              topic="Реабилитационный центр в Химках"
              className="lime-control flex h-[38px] w-fit items-center justify-center rounded-[8px] px-[20px] text-16 drop-shadow-[0_4px_2px_rgba(173,173,173,0.1)]"
            />
          </div>

          <div className="mt-[33px] flex w-[612px] flex-col gap-[24px]">
            <div className="flex flex-col gap-[10px]">
              <h2 className="text-18 font-medium text-black">Про центр</h2>
              <div>
                <p className="text-16">
                  Реабилитационный центр предлагает комплексную программу восстановления для людей, столкнувшихся с
                  алкогольной, наркотической и&nbsp;другими формами зависимости. Программа включает индивидуальную
                </p>
                <div className="flex items-center gap-[2px]">
                  <p className="min-w-0 flex-1 truncate text-16">
                    групповую психотерапию, работу с психологами, восстановление социальных
                  </p>
                  <span className="px-[2px] text-16 font-medium opacity-80">Читать</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[18px]">
              <div className="flex flex-col gap-[16px]">
                {amenities.map((row) => (
                  <div key={row[0].label} className="flex items-center gap-[24px]">
                    {row.map((item, index) => (
                      <div
                        key={item.label}
                        className={`flex items-center gap-[6px] ${index < 2 ? "w-[180px]" : ""}`}
                      >
                        <img alt="" src={item.icon} width={20} height={20} className="size-[20px] shrink-0" />
                        <span className="text-18 font-medium whitespace-nowrap">{item.label}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="flex h-[38px] w-fit items-center justify-center rounded-[8px] bg-[#e7e7e7] px-[20px] text-16"
              >
                Смотреть все
              </button>
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-[12px] rounded-[19px] border border-[rgba(0,0,0,0.04)] bg-white p-[20px] text-18 whitespace-nowrap">
          {facts.map((fact) => (
            <p key={fact.label} className="flex items-center gap-[6px]">
              <span className="font-medium">{fact.label}</span>
              <span className="flex items-center gap-[4px]">
                {fact.value}
                {fact.extra ? <span className="font-medium opacity-70">{fact.extra}</span> : null}
              </span>
            </p>
          ))}
        </aside>
      </div>
    </div>
  );
}
