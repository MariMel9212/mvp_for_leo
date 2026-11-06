import type { CenterPageData } from "@/content/centers/types";

const cover = "absolute inset-0";

export const klyuchiCenter: CenterPageData = {
  title: "Реабилитационный центр «Ключи»",
  region: "Москва",
  facts: [
    { label: "Направления:", value: "алкоголизм, наркомания" },
    { label: "Формат:", value: "с проживанием" },
    { label: "Палата:", value: "на 4 человека", extra: "+2", extraHint: "Апартаменты на 2 человека и личные апартаменты" },
    { label: "Стоимость:", value: "от 120 000 ₽ / мес" },
  ],
  about: {
    lead: "Центр «Ключи» с 2011 года помогает людям с алкогольной и наркотической зависимостью. Это лицензированный загородный стационар: небольшие группы, общая кухня и специалисты, к которым можно подойти между занятиями. ",
    rest: "Программа собирается после приёма нарколога: детоксикация, индивидуальная и групповая психотерапия, работа с семьёй. Первый месяц уходит на адаптацию и работу с отрицанием, затем начинаются семейные сессии. После курса остаются группы поддержки, куратор и встречи через 3 и 6 месяцев. Обращение анонимное, без постановки на учёт.",
  },
  amenities: [
    { icon: "pool", label: "Бассейн" },
    { icon: "group", label: "Зал для занятий" },
    { icon: "dining", label: "Домашнее питание" },
    { icon: "rooms", label: "Комнаты" },
    { icon: "living", label: "Комната отдыха" },
    { icon: "territory", label: "Загородная территория" },
  ],
  schedule: [],
  staff: {
    kind: "people",
    summary:
      "4 специалиста: основатель центра и психотерапевт, психиатр\u2011нарколог, руководитель программы реабилитации и клинический психолог.",
    people: [
      { name: "Руслан Молодцов", role: "Основатель центра, психотерапевт", photo: "/centers/klyuchi/staff/molodtsov.webp" },
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
    "Домашнее питание",
  ],
  gallery: {
    main: { src: "/centers/klyuchi/hall.webp", alt: "Холлы центра", frameClassName: cover },
    topMiddle: { src: "/centers/klyuchi/room.webp", alt: "Комнаты", frameClassName: cover },
    topRight: { src: "/centers/klyuchi/pool.webp", alt: "Бассейн", frameClassName: cover },
    bottomMiddle: { src: "/centers/klyuchi/dining.webp", alt: "Домашнее питание", frameClassName: cover },
    more: { src: "/centers/klyuchi/single.webp", alt: "Отдельная комната", frameClassName: cover },
    moreLabel: "+ 3 фотографии",
    photos: [
      { src: "/centers/klyuchi/hall.webp", alt: "Холлы центра" },
      { src: "/centers/klyuchi/room.webp", alt: "Комнаты" },
      { src: "/centers/klyuchi/single.webp", alt: "Отдельная комната" },
      { src: "/centers/klyuchi/bath.webp", alt: "Ванная" },
      { src: "/centers/klyuchi/group.webp", alt: "Зал для занятий" },
      { src: "/centers/klyuchi/dining.webp", alt: "Домашнее питание" },
      { src: "/centers/klyuchi/rest.webp", alt: "Комната отдыха" },
      { src: "/centers/klyuchi/pool.webp", alt: "Бассейн" },
    ],
  },
};
