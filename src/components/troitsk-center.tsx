"use client";

import { useEffect, useState } from "react";
import { CallRequestButton } from "@/components/call-request-modal";

const prepositions = new Set([
  "в",
  "во",
  "без",
  "до",
  "для",
  "за",
  "из",
  "изо",
  "к",
  "ко",
  "на",
  "над",
  "о",
  "об",
  "обо",
  "от",
  "по",
  "под",
  "при",
  "про",
  "с",
  "со",
  "у",
  "через",
]);

function tie(text: string) {
  const parts = text.split(" ");
  const out: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    const bare = parts[i].replace(/^[«"(\[]+|[»".,:;!?)\]]+$/g, "").toLowerCase();
    if (prepositions.has(bare) && parts[i + 1]) {
      out.push(`${parts[i]}\u00A0${parts[i + 1]}`);
      i += 1;
    } else {
      out.push(parts[i]);
    }
  }
  return out.join(" ");
}

const facts: { label: string; value: string; extra?: string; extraHint?: string }[] = [
  { label: "Возраст:", value: "14–17 лет" },
  { label: "Формат:", value: tie("с проживанием") },
  { label: "Программа:", value: "«Пифагор»" },
  { label: "Стоимость:", value: "200 000 ₽ / мес" },
];

const amenities = [
  [
    { icon: "/icons/amenity-gym.svg", label: "Спортзал" },
    { icon: "/icons/amenity-group.svg", label: "Групповая" },
    { icon: "/icons/amenity-field.svg", label: "Спортивная площадка" },
  ],
  [
    { icon: "/icons/amenity-dining.svg", label: "Столовая" },
    { icon: "/icons/amenity-rooms.svg", label: "Общие комнаты" },
    { icon: "/icons/amenity-classroom.svg", label: "Учебный класс" },
  ],
];

const allAmenities = [
  ...amenities.flat(),
  { icon: "/icons/amenity-territory.svg", label: "Частная территория" },
  { icon: "/icons/amenity-living.svg", label: "Большая гостиная" },
];

const schedule = [
  ["07:00", "Подъём"],
  ["07:00–07:25", "Личная гигиена"],
  ["07:30–08:00", "Зарядка / йога"],
  ["08:05–08:30", "Настрой на день"],
  ["08:35–09:00", "Завтрак"],
  ["09:00", "Учёба / рисование / лекция / чтение"],
  ["10:45–11:55", "Трудовая деятельность"],
  ["12:00–12:55", "Лекция"],
  ["13:00–13:55", "Чтение"],
  ["14:00–14:25", "Обед"],
  ["14:30–15:30", "Тихий час"],
  ["15:30–15:55", "Гигиена, уборка"],
  ["16:00–16:25", "Полдник"],
  ["16:30–17:25", "Прогулка"],
  ["17:30–18:25", "Малая группа / тренинг / подготовка к мероприятию"],
  ["18:30–18:55", "Игры"],
  ["19:00–19:25", "Ужин"],
  ["19:30–20:25", "Написание заданий"],
  ["20:30–21:25", "Подведение итогов дня"],
  ["21:30–21:55", "Чай / планёрка"],
  ["22:00–22:25", "Личная гигиена"],
  ["22:30", "Отбой"],
];

const staff = [
  { role: "Основатель Института психологии", count: 1 },
  { role: "Руководитель центра", count: 1 },
  { role: "Руководитель психологической службы", count: 1 },
  { role: "Клинический психолог", count: 1 },
  { role: "Педагог-психолог", count: 1 },
  { role: "Врач-психиатр", count: 1 },
  { role: "Учебные кураторы", count: 2 },
  { role: "Консультанты по коррекции поведения", count: 4 },
];

const features = [
  "Программа «Пифагор»",
  "Диагностический месяц",
  "Индивидуальный подход",
  "Психологическое сопровождение",
  "Семейная психотерапия",
  "Группы для созависимых",
  "Групповые занятия",
  "Образовательные занятия",
  "Спортзал и площадка",
  "Распорядок дня",
];

const aboutLead = tie(
  "Центр для подростков от 14 до 17 лет помогает изменить деструктивные модели поведения, сформировать ответственность за свои поступки и восстановить отношения с близкими. ",
);

const aboutRest = tie(
  "Основные направления — коррекция девиантного поведения, эмоциональные и поведенческие трудности, социальные навыки, семейные отношения и психологическое сопровождение. В основе работы — программа «Пифагор»: первый месяц уходит на диагностику поведения, эмоционального состояния и семейной ситуации. Дальше идут психологическое сопровождение, групповые занятия, учёба и развитие самостоятельности. На территории есть спортивный зал и спортивная площадка, а день расписан: занятия, тренинги, физическая активность, труд, прогулки и отдых.",
);

const galleryPhotos = [
  { src: "/centers/troitsk/modal/01.jpg", alt: "Дом центра" },
  { src: "/centers/troitsk/modal/02.jpg", alt: "Мансарда" },
  { src: "/centers/troitsk/modal/03.jpg", alt: "Комната для занятий" },
  { src: "/centers/troitsk/modal/04.jpg", alt: "Гостиная" },
  { src: "/centers/troitsk/modal/05.jpg", alt: "Спальня с двухъярусными кроватями" },
  { src: "/centers/troitsk/modal/06.jpg", alt: "Комната с флипчартом" },
  { src: "/centers/troitsk/modal/07.jpg", alt: "Свободная комната" },
  { src: "/centers/troitsk/modal/08.jpg", alt: "Территория" },
  { src: "/centers/troitsk/modal/09.jpg", alt: "Комната с телевизором" },
  { src: "/centers/troitsk/modal/10.jpg", alt: "Спальня" },
  { src: "/centers/troitsk/modal/11.jpg", alt: "Общая комната" },
  { src: "/centers/troitsk/modal/12.jpg", alt: "Зал" },
  { src: "/centers/troitsk/modal/13.jpg", alt: "Кабинет" },
];

export function TroitskCenter() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);

  useEffect(() => {
    if (!galleryOpen && !amenitiesOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setGalleryOpen(false);
      setAmenitiesOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [galleryOpen, amenitiesOpen]);

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
        <button
          type="button"
          aria-label="Открыть все фотографии"
          onClick={() => setGalleryOpen(true)}
          className="group absolute right-0 bottom-0 h-[238px] w-[297px] cursor-pointer overflow-hidden bg-[#cfcece] p-0"
        >
          <img
            alt=""
            src="/centers/troitsk/bunk.jpg"
            width={311}
            height={414}
            className="absolute top-[-91px] left-0 h-[414px] w-[311px] max-w-none object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-[rgba(74,74,74,0.37)] transition-colors duration-200 group-hover:bg-[rgba(39,41,45,0.52)]" />
          <p className="absolute top-[calc(50%-14px)] left-[calc(50%-67.5px)] text-18 font-medium whitespace-nowrap text-white">
            + 8 фотографий
          </p>
        </button>
      </div>

      <div className="mt-[32px] flex items-start justify-between">
        <div className="flex w-[612px] flex-col gap-[30px]">
          <div className="flex flex-col gap-[16px] border-b border-[rgba(0,0,0,0.04)] pb-[32px]">
            <div className="flex flex-col gap-[6px]">
              <h1 className="text-28 font-medium">{tie("Реабилитационно-образовательный центр в Троицке")}</h1>
              <p className="text-18">Московская область</p>
            </div>
            <CallRequestButton
              label="Выбрать центр"
              topic="Реабилитационно-образовательный центр в Троицке"
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
                onClick={() => setAmenitiesOpen(true)}
                className="flex h-[38px] w-fit items-center justify-center rounded-[8px] bg-[#e7e7e7] px-[20px] text-16"
              >
                Смотреть все
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-[28px] border-b border-[rgba(0,0,0,0.04)] pb-[32px]">
            <div className="flex flex-col gap-[8px]">
              <div className={`relative ${scheduleOpen ? "" : "h-[202px] overflow-hidden"}`}>
                <div className="flex flex-col gap-[12px]">
                  <h2 className="text-18 font-medium">Расписание дня</h2>
                  <ul className="flex flex-col gap-[12px]">
                    {schedule.map(([time, event]) => (
                      <li key={time} className="flex flex-col gap-[6px]">
                        <p className="text-18 leading-[28px]">{tie(event)}</p>
                        <p className="text-16 leading-[24px] opacity-60 tabular-nums">{time}</p>
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
              <button
                type="button"
                onClick={() => setScheduleOpen((open) => !open)}
                className="w-fit text-16 font-medium opacity-80"
              >
                {scheduleOpen ? "Свернуть" : "Подробнее"}
              </button>
            </div>
            <div className="flex flex-col gap-[14px]">
              <div className="flex items-baseline justify-between gap-[16px]">
                <h2 className="text-18 font-medium">Персонал дома</h2>
                <p className="text-16 opacity-60">12 специалистов</p>
              </div>
              <ul>
                {staff.map((person) => (
                  <li
                    key={person.role}
                    className="flex items-baseline justify-between gap-[24px] border-t border-[rgba(0,0,0,0.06)] py-[8px] text-16"
                  >
                    <span>{tie(person.role)}</span>
                    <span className="w-[16px] shrink-0 text-right tabular-nums opacity-60">{person.count}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-[4px]">
                <p className="text-16 font-medium">На смене</p>
                <p className="text-16">
                  {tie("С подростками работают два консультанта\u2011мужчины, один консультант\u2011женщина и психолог.")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[10px]">
            <h2 className="text-18 font-medium">Особенности</h2>
            <ul className="flex flex-wrap content-center gap-[8px]">
              {features.map((feature) => (
                <li key={feature} className="rounded-[8px] bg-[#ebeff8] p-[10px] text-16">
                  {tie(feature)}
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
                {fact.extra ? (
                  <span className="group/extra relative">
                    <button type="button" className="font-medium opacity-70 outline-none hover:opacity-100">
                      {fact.extra}
                    </button>
                    {fact.extraHint ? (
                      <span className="absolute top-full right-0 z-20 hidden pt-[4px] group-hover/extra:block group-focus-within/extra:block">
                        <span
                          role="tooltip"
                          className="block rounded-[10px] bg-white px-[12px] py-[8px] text-16 font-normal text-[#27292d] shadow-[0_8px_24px_rgba(36,74,127,0.12)]"
                        >
                          {fact.extraHint}
                        </span>
                      </span>
                    ) : null}
                  </span>
                ) : null}
              </span>
            </p>
          ))}
        </aside>
      </div>
      {galleryOpen ? <PhotoGallery onClose={() => setGalleryOpen(false)} /> : null}
      {amenitiesOpen ? <AmenitiesModal onClose={() => setAmenitiesOpen(false)} /> : null}
    </div>
  );
}

function AmenitiesModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(39,41,45,0.45)] p-[24px]">
      <button type="button" aria-label="Закрыть" className="absolute inset-0 cursor-default" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="center-amenities-title"
        className="relative w-[720px] rounded-[21px] bg-white"
      >
        <div className="flex items-center justify-between px-[26px] pt-[20px] pb-[20px]">
          <h2 id="center-amenities-title" className="text-24 font-medium">
            Условия
          </h2>
          <button type="button" aria-label="Закрыть" onClick={onClose} className="opacity-70">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M7 7L17 17M17 7L7 17" stroke="#27292D" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <ul className="grid grid-cols-3 gap-x-[24px] gap-y-[16px] px-[26px] pb-[28px]">
          {allAmenities.map((item) => (
            <li key={item.label} className="flex items-center gap-[6px]">
              <img alt="" src={item.icon} width={20} height={20} className="size-[20px] shrink-0" />
              <span className="text-16 font-medium whitespace-nowrap">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PhotoGallery({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(39,41,45,0.45)] p-[24px]">
      <button type="button" aria-label="Закрыть" className="absolute inset-0 cursor-default" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="center-photos-title"
        className="relative flex max-h-[calc(100vh-48px)] w-[1100px] flex-col overflow-hidden rounded-[21px] bg-white"
      >
        <div className="flex items-center justify-between px-[26px] pt-[20px] pb-[16px]">
          <h2 id="center-photos-title" className="text-24 font-medium">
            Фотографии
          </h2>
          <button type="button" aria-label="Закрыть" onClick={onClose} className="opacity-70">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M7 7L17 17M17 7L7 17" stroke="#27292D" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-[8px] overflow-y-auto px-[26px] pb-[26px]">
          {galleryPhotos.map((photo) => (
            <img
              key={photo.src}
              alt={photo.alt}
              src={photo.src}
              loading="lazy"
              decoding="async"
              className="h-[220px] w-full rounded-[12px] object-cover"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
