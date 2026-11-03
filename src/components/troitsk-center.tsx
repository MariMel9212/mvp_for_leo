"use client";

import { useState } from "react";
import { CallRequestButton } from "@/components/call-request-modal";

const facts = [
  { label: "Направления:", value: "алкоголизм, наркомания", extra: "+2" },
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
    { icon: "/icons/amenity-rooms.svg", label: "Общие комнаты" },
  ],
];

const schedule = [
  ["07:00–07:30", "Подъём, утренняя гигиена"],
  ["07:30–08:00", "Зарядка"],
  ["08:00–08:30", "Завтрак"],
  ["08:30–09:00", "Утренняя группа, планирование дня"],
  ["09:00–10:30", "Групповая психотерапия"],
  ["10:30–11:00", "Перерыв"],
  ["11:00–12:30", "Лекции и образовательные занятия"],
  ["12:30–13:30", "Обед, свободное время"],
  ["13:30–15:00", "Индивидуальная работа с психологом"],
  ["15:00–16:30", "Арт-терапия и практические занятия"],
  ["16:30–18:00", "Спорт, прогулки"],
  ["18:00–19:00", "Ужин"],
  ["19:00–20:30", "Группы взаимопомощи"],
  ["20:30–21:30", "Личное время"],
  ["21:30–22:00", "Вечерняя рефлексия, подведение итогов"],
  ["22:30", "Отбой"],
];

const staff = [
  ["5", "Дежурных консультантов"],
  ["2", "Психиатра - нарколога"],
  ["3", "Психолога"],
];

const features = [
  "Подходит для подростков",
  "Индивидуальная программа",
  "Работа с двойным диагнозом",
  "Семейная терапия",
  "Репетиторы по предметам",
  "Постлечебная программа",
];

const aboutLead =
  "Реабилитационно-образовательный центр специализируется на помощи подросткам, столкнувшимся с поведенческими и эмоциональными трудностями, конфликтами в семье, отказом от учёбы, социальной изоляцией ";

const aboutRest =
  "и употреблением психоактивных веществ. В основе программы — индивидуальный подход к каждому подростку. Специалисты изучают причины возникших трудностей и разрабатывают план восстановления, который сочетает психологическую поддержку, образовательные занятия, развитие социальных навыков и формирование самостоятельности.";

export function TroitskCenter() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  return (
    <div className="mx-auto mt-[58px] w-[1200px] pb-[160px]">
      <div className="relative h-[480px] overflow-hidden rounded-[22px] bg-white">
        <div className="absolute top-0 left-0 h-[480px] w-[598px] overflow-hidden">
          <div className="absolute top-0 left-[-92px] h-[507px] w-[760px]">
            <img
              alt="Солнечный дом из красного кирпича в саду"
              src="/centers/troitsk/house.png"
              className="absolute inset-0 size-full max-w-none object-cover"
            />
          </div>
        </div>
        <div className="absolute top-0 right-[301px] h-[238px] w-[297px] overflow-hidden bg-[#ebebeb]">
          <div className="absolute top-0 left-[-52px] h-[249px] w-[444px]">
            <img
              alt="Мансарда"
              src="/centers/troitsk/attic.png"
              className="absolute inset-0 size-full max-w-none object-cover"
            />
          </div>
        </div>
        <div className="absolute top-0 right-0 h-[238px] w-[297px] overflow-hidden bg-[#ebebeb]">
          <div className="absolute top-0 left-[-9px] h-[247px] w-[330px]">
            <img
              alt="Комната для занятий"
              src="/centers/troitsk/room.png"
              className="absolute inset-0 size-full max-w-none object-cover"
            />
          </div>
        </div>
        <div className="absolute right-[301px] bottom-0 h-[238px] w-[297px] overflow-hidden bg-[#ebebeb]">
          <div className="absolute top-0 left-[-10px] h-[245px] w-[327px]">
            <img
              alt="Гостиная"
              src="/centers/troitsk/living.png"
              className="absolute inset-0 size-full max-w-none object-cover"
            />
          </div>
        </div>
        <div className="absolute right-0 bottom-0 h-[238px] w-[297px] overflow-hidden bg-[#cfcece]">
          <img
            alt="Спальня с двухъярусными кроватями"
            src="/centers/troitsk/bunk.jpg"
            width={311}
            height={414}
            className="absolute top-[-91px] left-0 h-[414px] w-[311px] max-w-none object-cover"
          />
          <div className="absolute inset-0 bg-[rgba(74,74,74,0.37)]" />
          <p className="absolute top-[calc(50%-14px)] left-[calc(50%-67.5px)] text-18 font-medium whitespace-nowrap text-white">
            + 8 фотографий
          </p>
        </div>
      </div>

      <div className="mt-[32px] flex items-start gap-[190px]">
        <div className="flex w-[612px] flex-col gap-[30px]">
          <div className="flex flex-col gap-[16px] border-b border-[rgba(0,0,0,0.04)] pb-[32px]">
            <div className="flex flex-col gap-[6px]">
              <h1 className="text-28 font-medium">Реабилитационный центр в Троицке</h1>
              <p className="text-18">Московская область</p>
            </div>
            <CallRequestButton
              label="Выбрать центр"
              topic="Реабилитационный центр в Троицке"
              className="lime-control flex h-[38px] w-fit items-center justify-center rounded-[8px] px-[20px] text-16 drop-shadow-[0_4px_2px_rgba(173,173,173,0.1)]"
            />
          </div>

          <div className="flex flex-col gap-[24px] border-b border-[rgba(0,0,0,0.04)] pb-[32px]">
            <div className="flex flex-col gap-[10px]">
              <h2 className="text-24 font-medium">Про центр</h2>
              {aboutOpen ? (
                <div className="text-16">
                  {aboutLead}
                  {aboutRest}{" "}
                  <button
                    type="button"
                    onClick={() => setAboutOpen(false)}
                    className="inline px-[2px] font-medium whitespace-nowrap opacity-80"
                  >
                    Свернуть
                  </button>
                </div>
              ) : (
                <div>
                  <p className="h-[72px] overflow-hidden text-16 text-ellipsis">{aboutLead}</p>
                  <div className="flex items-center gap-[2px]">
                    <p className="min-w-0 flex-1 truncate text-16 whitespace-pre">{aboutRest}</p>
                    <button
                      type="button"
                      onClick={() => setAboutOpen(true)}
                      className="px-[2px] text-16 font-medium whitespace-nowrap opacity-80"
                    >
                      Читать
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-[18px]">
              <div className="flex flex-col gap-[16px]">
                {amenities.map((row) => (
                  <div key={row[0].label} className="flex items-center gap-[24px]">
                    {row.map((item, index) => (
                      <div key={item.label} className={`flex items-center gap-[6px] ${index < 2 ? "w-[180px]" : ""}`}>
                        <img alt="" src={item.icon} width={20} height={20} className="size-[20px] shrink-0" />
                        <span className="text-16 font-medium whitespace-nowrap">{item.label}</span>
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

          <div className="flex flex-col gap-[8px] border-b border-[rgba(0,0,0,0.04)] pb-[32px]">
            <div className={`relative flex items-start justify-between ${scheduleOpen ? "" : "h-[134px] overflow-hidden"}`}>
              <div className="flex w-[312px] flex-col gap-[10px]">
                <h2 className="text-18 font-medium">Расписание дня</h2>
                <ul className="flex flex-col gap-[8px] text-16">
                  {schedule.map(([time, event]) => (
                    <li key={time} className="flex gap-[6px]">
                      <span className="shrink-0 whitespace-nowrap">{time}</span>
                      <span>{event}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-[10px]">
                <h2 className="text-18 font-medium">Персонал дома</h2>
                <ul className="flex flex-col gap-[8px] text-16 whitespace-nowrap">
                  {staff.map(([count, role]) => (
                    <li key={role} className="flex gap-[4px]">
                      <span>{count}</span>
                      <span>{role}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {scheduleOpen ? null : (
                <img
                  alt=""
                  src="/centers/himki/schedule-fade.png"
                  width={612}
                  height={34}
                  className="pointer-events-none absolute bottom-0 left-0 h-[34px] w-[612px] max-w-none"
                />
              )}
            </div>
            {scheduleOpen ? null : (
              <button type="button" onClick={() => setScheduleOpen(true)} className="w-fit text-16 font-medium opacity-80">
                Подробнее
              </button>
            )}
          </div>

          <div className="flex flex-col gap-[10px]">
            <h2 className="text-18 font-medium">Особенности</h2>
            <ul className="flex flex-wrap content-center gap-[8px]">
              {features.map((feature) => (
                <li key={feature} className="rounded-[8px] bg-[#ebeff8] p-[10px] text-16">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="flex shrink-0 flex-col gap-[12px] rounded-[19px] border border-[rgba(0,0,0,0.04)] bg-white p-[20px] text-18 whitespace-nowrap">
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
