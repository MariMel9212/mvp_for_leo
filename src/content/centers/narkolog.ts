import type { CenterPageData } from "@/content/centers/types";

const cover = "absolute inset-0";

export const narkologCenter: CenterPageData = {
  title: "Реабилитационный центр в Чехове",
  region: "Московская область",
  facts: [
    { label: "Направления:", value: "алкоголизм, наркомания" },
    { label: "Формат:", value: "стационар и на дому" },
    { label: "Кому:", value: "взрослые и подростки" },
    { label: "Стоимость:", value: "от 450 000 ₽ / мес" },
  ],
  about: {
    lead: "Центр в Чехове 15 лет помогает взрослым и подросткам: алкоголь, наркотики, токсические вещества, игры и социальные сети. Это стационар и выездная помощь: снятие интоксикации, реабилитация и работа с семьёй. ",
    rest: "Программа собирается индивидуально. В стационаре снимают интоксикацию и восстанавливают состояние, дальше идёт амбулаторный этап: психотерапия, трудотерапия и физические занятия. Обращение анонимное. Бригада выезжает по Москве и в радиусе до 100 км.",
  },
  amenities: [
    { icon: "rooms", label: "Комнаты" },
    { icon: "dining", label: "Столовая" },
    { icon: "group", label: "Зал для занятий" },
    { icon: "living", label: "Комната отдыха" },
    { icon: "territory", label: "Территория" },
  ],
  schedule: [],
  staff: {
    kind: "people",
    summary:
      "Руководитель центра, программный руководитель, врач-нарколог, старший консультант и два консультанта по зависимости.",
    people: [
      { name: "Роман Акимов", role: "Руководитель центра", photo: "/centers/narkolog/staff/akimov.webp" },
      { name: "Оксана Арбатская", role: "Программный руководитель", photo: "/centers/narkolog/staff/arbatskaya.webp" },
      { name: "Ирина Филатова", role: "Врач-нарколог", photo: "/centers/narkolog/staff/filatova.jpg" },
      { name: "Анатолий Коломенский", role: "Старший консультант по зависимости", photo: "/centers/narkolog/staff/kolomensky.webp" },
      { name: "Дмитрий Тютрин", role: "Консультант по зависимости", photo: "/centers/narkolog/staff/tyutrin.jpg" },
      {
        name: "Александр Верещагин",
        role: "Консультант по химической и нехимической зависимости",
        photo: "/centers/narkolog/staff/vereshchagin.jpg",
      },
    ],
  },
  features: [
    "Анонимно",
    "Индивидуальная программа",
    "Работа с семьёй",
    "Стационар и на дому",
    "Взрослые и подростки",
    "Круглосуточно",
  ],
  gallery: {
    main: { src: "/centers/narkolog/house.webp", alt: "Дом центра", frameClassName: cover },
    topMiddle: { src: "/centers/narkolog/room.webp", alt: "Комната", frameClassName: cover },
    topRight: { src: "/centers/narkolog/group.webp", alt: "Зал для занятий", frameClassName: cover },
    bottomMiddle: { src: "/centers/narkolog/dining.webp", alt: "Столовая", frameClassName: cover },
    more: { src: "/centers/narkolog/living.webp", alt: "Комната отдыха", frameClassName: cover },
    moreLabel: "+ 3 фотографии",
    photos: [
      { src: "/centers/narkolog/house.webp", alt: "Дом центра" },
      { src: "/centers/narkolog/room.webp", alt: "Комната" },
      { src: "/centers/narkolog/group.webp", alt: "Зал для занятий" },
      { src: "/centers/narkolog/dining.webp", alt: "Столовая" },
      { src: "/centers/narkolog/living.webp", alt: "Комната отдыха" },
      { src: "/centers/narkolog/hall.webp", alt: "Холл" },
      { src: "/centers/narkolog/cabinet.webp", alt: "Кабинет" },
      { src: "/centers/narkolog/sauna.webp", alt: "Сауна" },
    ],
  },
};
