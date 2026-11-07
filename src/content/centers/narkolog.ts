import type { CenterPageData } from "@/content/centers/types";

const cover = "absolute inset-0";

export const narkologCenter: CenterPageData = {
  title: "Реабилитационный центр в Чехове",
  region: "Московская область",
  facts: [
    {
      label: "Направления:",
      value: "химические и нехимические",
      extra: "7 видов",
      extraHint: "Наркомания, алкоголизм, токсикомания, лекарственная зависимость, лудомания, игромания, РПП",
    },
    { label: "Формат:", value: "с проживанием" },
    { label: "Программы:", value: "12 шагов, АА, АН, АИ" },
    { label: "Стоимость:", value: "от 65 000 ₽ / мес" },
  ],
  about: {
    lead: "Дом находится в Московской области, в тихом городе Чехов. В нём есть тренажёрный зал, а баня топится два раза в месяц. ",
    rest: "Центр работает с химическими зависимостями: наркомания, алкоголизм, токсикомания и лекарственная зависимость, и с нехимическими: лудомания, игромания и РПП. С ребятами занимаются по 12-шаговой программе АА (Анонимные алкоголики), АН (Анонимные наркоманы) и АИ (Анонимные игроки). Проходят терапевтические группы и индивидуальная работа с психологом, по необходимости подключается психиатр. За время работы больше 40 выпускников. После выхода из центра ребят поддерживают и помогают в ресоциализации: в курс включена постлечебная программа. Во время прохождения проводят семейные сессии и обязательные телефонные звонки с родственниками. Стоимость от 65 000 ₽.",
  },
  amenities: [
    { icon: "gym", label: "Тренажёрный зал" },
    { icon: "bath", label: "Баня 2 раза в месяц" },
  ],
  schedule: [
    { time: "08:50", event: "Подъём" },
    { time: "09:10", event: "Зарядка, водные процедуры" },
    { time: "09:55", event: "Завтрак" },
    { time: "10:20", event: "Утреннее собрание" },
    { time: "12:00", event: "Малая группа, тренинг, труды, работа с психологом" },
    { time: "14:30", event: "Обед" },
    { time: "15:10", event: "Сончас" },
    { time: "16:30", event: "Чайхона" },
    { time: "17:40", event: "Самоанализ" },
    { time: "18:30", event: "Написание задания" },
    { time: "19:30", event: "Ужин" },
    { time: "20:00", event: "Обратная связь" },
    { time: "21:00", event: "Группа самопомощи" },
    { time: "22:00", event: "Подведение итогов дня" },
    { time: "23:00", event: "Отбой" },
  ],
  staff: {
    kind: "counts",
    counts: [
      { count: "4", role: "Консультанта" },
      { count: "2", role: "Психолога" },
      { count: "1", role: "Психиатр" },
    ],
  },
  features: [
    "Постлечебная программа",
    "Помощь в ресоциализации",
    "Семейные сессии",
    "Звонки с родственниками",
    "Терапевтические группы",
    "Психиатр по необходимости",
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
