import type { CenterPageData } from "@/content/centers/types";

export const himkiCenter: CenterPageData = {
  title: "Реабилитационный центр в Химках",
  region: "Московская область",
  facts: [
    { label: "Направления:", value: "алкоголизм, наркомания", extra: "+2" },
    { label: "Формат:", value: "с проживанием" },
    { label: "Программа:", value: "АН, АА, АИ" },
    { label: "Курс:", value: "от 3 до 12 месяцев" },
    { label: "Выпускников:", value: "148 человек" },
  ],
  about: {
    lead: "Реабилитационный центр предлагает комплексную программу восстановления для людей, столкнувшихся с алкогольной, наркотической и другими формами зависимости. ",
    rest: "Программа включает индивидуальную и групповую психотерапию, работу с психологами и восстановление социальных навыков. Курс длится от 3 до 12 месяцев, группа до 20 человек.",
  },
  amenities: [
    { icon: "pool", label: "Бассейн" },
    { icon: "group", label: "Групповая" },
    { icon: "territory", label: "Частная территория" },
    { icon: "gym", label: "Спортзал" },
    { icon: "dining", label: "Столовая" },
    { icon: "rooms", label: "Отдельные комнаты" },
  ],
  schedule: [
    { time: "07:00–07:30", event: "Подъём, утренняя гигиена" },
    { time: "07:30–08:00", event: "Зарядка" },
    { time: "08:00–08:30", event: "Завтрак" },
    { time: "08:30–09:00", event: "Утренняя группа, планирование дня" },
    { time: "09:00–10:30", event: "Групповая психотерапия" },
    { time: "10:30–11:00", event: "Перерыв" },
    { time: "11:00–12:30", event: "Лекции и образовательные занятия" },
    { time: "12:30–13:30", event: "Обед, свободное время" },
    { time: "13:30–15:00", event: "Индивидуальная работа с психологом" },
    { time: "15:00–16:30", event: "Арт-терапия и практические занятия" },
    { time: "16:30–18:00", event: "Спорт, прогулки" },
    { time: "18:00–19:00", event: "Ужин" },
    { time: "19:00–20:30", event: "Группы взаимопомощи" },
    { time: "20:30–21:30", event: "Личное время" },
    { time: "21:30–22:00", event: "Вечерняя рефлексия, подведение итогов" },
    { time: "22:30", event: "Отбой" },
  ],
  staff: {
    kind: "counts",
    counts: [
      { count: "5", role: "Дежурных консультантов" },
      { count: "2", role: "Психиатра-нарколога" },
      { count: "3", role: "Психолога" },
    ],
  },
  features: [
    "Индивидуальная программа",
    "Работа с двойным диагнозом",
    "Семейная терапия",
    "Постлечебная программа",
  ],
  gallery: {
    main: {
      src: "/centers/himki/house.png",
      alt: "Дом реабилитационного центра",
      frameClassName: "absolute top-[-10px] left-[-87px] h-[579px] w-[811px]",
      imageClassName: "absolute top-[0.04%] left-0 h-[103.04%] w-full max-w-none object-cover",
    },
    topMiddle: {
      src: "/centers/himki/yoga.png",
      alt: "Спальня",
      frameClassName: "absolute top-0 left-[-13px] h-[246px] w-[329px]",
    },
    topRight: {
      src: "/centers/himki/bedroom.png",
      alt: "Бассейн",
      frameClassName: "absolute top-[-23px] left-[-11px] h-[268px] w-[357px]",
    },
    bottomMiddle: {
      src: "/centers/himki/pool.png",
      alt: "Зал для занятий",
      frameClassName: "absolute top-0 left-[-6px] h-[248px] w-[371px]",
    },
    more: {
      src: "/centers/himki/dining.jpg",
      alt: "",
      frameClassName: "absolute inset-0",
      imageClassName: "absolute top-[-8px] left-[-36px] h-[246px] w-[368px] max-w-none object-cover",
    },
    photos: [
      { src: "/centers/himki/house.png", alt: "Дом реабилитационного центра" },
      { src: "/centers/himki/yoga.png", alt: "Спальня" },
      { src: "/centers/himki/bedroom.png", alt: "Бассейн" },
      { src: "/centers/himki/pool.png", alt: "Зал для занятий" },
      { src: "/centers/himki/dining.jpg", alt: "Столовая" },
    ],
  },
};
