import type { CenterPageData } from "@/content/centers/types";

const cover = "absolute inset-0";

export const klyuchiCenter: CenterPageData = {
  title: "Реабилитационный центр в Москве",
  region: "Москва",
  facts: [
    { label: "Направления:", value: "алкоголизм, наркомания" },
    { label: "Формат:", value: "с проживанием" },
    { label: "Размещение:", value: "индивидуальное, общее" },
    { label: "Стоимость:", value: "от 120 000 ₽ / мес" },
  ],
  about: {
    lead: "С 2011 года центр помогает людям с алкогольной и наркотической зависимостью. Это лицензированный загородный стационар: небольшие группы, общая кухня и специалисты, к которым можно подойти между занятиями. ",
    rest: "Программа собирается после приёма нарколога: детоксикация, индивидуальная и групповая психотерапия, работа с семьёй. Первый месяц уходит на адаптацию и работу с отрицанием, затем начинаются семейные сессии. После курса остаются группы поддержки, куратор и встречи через 3 и 6 месяцев. Обращение анонимное, без постановки на учёт.",
  },
  amenities: [
    { icon: "rooms", label: "Комнаты" },
    { icon: "group", label: "Зал для занятий" },
    { icon: "living", label: "Комната отдыха" },
    { icon: "territory", label: "Частная территория" },
    { icon: "rooms", label: "Отдельная комната" },
    { icon: "dining", label: "Трёхразовое питание" },
  ],
  schedule: [],
  staff: {
    kind: "people",
    summary:
      "Психиатр\u2011нарколог, руководитель программы реабилитации, клинический психолог, 6 консультантов по химической зависимости и 2 психолога.",
    people: [
      { name: "Алексей Гитлевич", role: "Психиатр\u2011нарколог", photo: "/centers/klyuchi/staff/gitlevich.webp" },
      { name: "Владислав Владимиров", role: "Руководитель программы реабилитации", photo: "/centers/klyuchi/staff/vladimirov.webp" },
      { name: "Наталья Бычкова", role: "Клинический психолог", photo: "/centers/klyuchi/staff/bychkova.webp" },
    ],
  },
  features: [
    "Анонимно, без учёта",
    "Индивидуальная программа",
    "Работа с семьёй",
    "Сопровождение после курса",
    "Загородный стационар",
  ],
  gallery: {
    main: { src: "/centers/klyuchi/group.webp", alt: "Зал для занятий", frameClassName: cover },
    topMiddle: { src: "/centers/klyuchi/single.webp", alt: "Отдельная комната", frameClassName: cover },
    topRight: { src: "/centers/klyuchi/pool.webp", alt: "Бассейн", frameClassName: cover },
    bottomMiddle: { src: "/centers/klyuchi/dining.webp", alt: "Кухня", frameClassName: cover },
    more: { src: "/centers/klyuchi/rest.webp", alt: "Комната отдыха", frameClassName: cover },
    moreLabel: "+ 3 фотографии",
    photos: [
      { src: "/centers/klyuchi/hall.webp", alt: "Холлы центра" },
      { src: "/centers/klyuchi/room.webp", alt: "Комнаты" },
      { src: "/centers/klyuchi/pool.webp", alt: "Бассейн" },
      { src: "/centers/klyuchi/bath.webp", alt: "Ванная" },
      { src: "/centers/klyuchi/group.webp", alt: "Зал для занятий" },
      { src: "/centers/klyuchi/dining.webp", alt: "Кухня" },
      { src: "/centers/klyuchi/rest.webp", alt: "Комната отдыха" },
      { src: "/centers/klyuchi/single.webp", alt: "Отдельная комната" },
    ],
  },
};
