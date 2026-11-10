import type { CenterPageData } from "@/content/centers/types";

const cover = "absolute inset-0";

export const vyhodEstCenter: CenterPageData = {
  title: "Реабилитационный центр",
  region: "Чехов",
  facts: [
    { label: "Направления:", value: "алкоголизм, наркомания" },
    { label: "Формат:", value: "стационар и выезд" },
    { label: "Опыт:", value: "больше 15 лет" },
    { label: "Стоимость:", value: "на консультации" },
  ],
  about: {
    lead: "Реабилитационный центр в Чехове. Помощь круглосуточная: вывод из запоя и передозировки, детоксикация и дальнейшая реабилитация. ",
    rest: "Центр работает с алкогольной и наркотической зависимостью, в том числе с тяжёлыми случаями и сопутствующими состояниями. Стационарный этап снимает интоксикацию и восстанавливает состояние, дальше подключаются психотерапия, трудотерапия и физические занятия. Отдельно занимаются с близкими и созависимыми. Команда на месте больше 15 лет, программу прошли больше 1000 человек. Выезд — по Москве и области, в радиусе до 100 км от Москвы. Анонимно. Точную стоимость называют на консультации: на сайте центра она не опубликована.",
  },
  amenities: [
    { icon: "territory", label: "Дом центра" },
    { icon: "rooms", label: "Комнаты" },
    { icon: "dining", label: "Столовая" },
    { icon: "group", label: "Зал для занятий" },
    { icon: "living", label: "Комната отдыха" },
    { icon: "bath", label: "Баня" },
  ],
  schedule: [],
  staff: {
    kind: "people",
    summary: "Руководитель центра, программный руководитель, врач-нарколог и консультанты по зависимости.",
    people: [
      { name: "Роман Акимов", role: "Руководитель центра", photo: "/centers/narkolog/staff/akimov.webp" },
      { name: "Оксана Арбатская", role: "Программный руководитель", photo: "/centers/narkolog/staff/arbatskaya.webp" },
      { name: "Ирина Филатова", role: "Врач-нарколог", photo: "/centers/narkolog/staff/filatova.jpg" },
      { name: "Анатолий Коломенский", role: "Старший консультант", photo: "/centers/narkolog/staff/kolomensky.webp" },
      { name: "Дмитрий Тютрин", role: "Консультант по зависимости", photo: "/centers/narkolog/staff/tyutrin.jpg" },
      { name: "Александр Верещагин", role: "Консультант по зависимости", photo: "/centers/narkolog/staff/vereshchagin.jpg" },
    ],
  },
  features: [
    "Экстренный выезд",
    "Детоксикация",
    "Работа с созависимыми",
    "Психотерапия",
    "Анонимно",
    "Круглосуточно",
  ],
  gallery: {
    main: { src: "/centers/narkolog/house.webp", alt: "Дом центра", frameClassName: cover },
    topMiddle: { src: "/centers/narkolog/room.webp", alt: "Комната", frameClassName: cover },
    topRight: { src: "/centers/narkolog/group.webp", alt: "Зал для занятий", frameClassName: cover },
    bottomMiddle: { src: "/centers/narkolog/dining.webp", alt: "Столовая", frameClassName: cover },
    more: { src: "/centers/narkolog/sauna.webp", alt: "Баня", frameClassName: cover },
    moreLabel: "+ 3 фотографии",
    photos: [
      { src: "/centers/narkolog/house.webp", alt: "Дом центра" },
      { src: "/centers/narkolog/room.webp", alt: "Комната" },
      { src: "/centers/narkolog/group.webp", alt: "Зал для занятий" },
      { src: "/centers/narkolog/dining.webp", alt: "Столовая" },
      { src: "/centers/narkolog/living.webp", alt: "Комната отдыха" },
      { src: "/centers/narkolog/hall.webp", alt: "Холл" },
      { src: "/centers/narkolog/cabinet.webp", alt: "Кабинет" },
      { src: "/centers/narkolog/sauna.webp", alt: "Баня" },
    ],
  },
};
