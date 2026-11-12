import type { CenterPageData } from "@/content/centers/types";

const cover = "absolute inset-0";

export const profmedCenter: CenterPageData = {
  title: "Детокс клиника в Химках",
  region: "Московская область",
  facts: [
    { label: "Направления:", value: "алкоголизм, наркомания", extra: "ещё 2", extraHint: "Игромания и психические расстройства" },
    { label: "Формат:", value: "стационар и на дому" },
    { label: "Выезд:", value: "около 30 минут" },
  ],
  about: {
    lead: "Частная медицинская клиника работает с 1999 года и специализируется на наркологии, психиатрии и психотерапии. Здесь оказывают помощь при алкогольной и наркотической зависимости, а также различных психических расстройствах.",
    rest: "\n\nЛечение строится с учётом состояния пациента и включает медицинскую диагностику, детоксикацию, медикаментозную терапию и психологическую поддержку. При работе с зависимостями применяется комплексный подход, объединяющий медицинскую помощь, психотерапию и последующую социальную адаптацию.\n\nВ команде работают психиатры-наркологи, психотерапевты, клинические психологи и консультанты по зависимости. Клиника также проводит консультации для родственников и оказывает помощь при созависимости.\n\nПредусмотрены амбулаторное лечение, стационарная помощь, реабилитационные программы и выезд врача на дом.",
  },
  amenities: [
    { icon: "rooms", label: "Палаты на 1, 2 и 4" },
    { icon: "dining", label: "Столовая" },
    { icon: "living", label: "Зона отдыха" },
    { icon: "group", label: "Приём врача" },
  ],
  schedule: [],
  staff: {
    kind: "people",
    summary: "Наркологи, психиатры, психологи и аддиктологи.",
    people: [
      {
        name: "Невматулина Румия Захарьяновна",
        role: "Главный врач, психиатр-нарколог, психотерапевт",
        photo: "/centers/profmed/staff/nevmatulina.webp",
      },
      {
        name: "Рацко Алексей Андреевич",
        role: "Заместитель президента клиники, клинический психолог, аддиктолог",
        photo: "/centers/profmed/staff/ratsko.webp",
      },
      {
        name: "Назаров Иван Дмитриевич",
        role: "Аддиктолог, консультант по химической зависимости",
        photo: "/centers/profmed/staff/nazarov.webp",
      },
      {
        name: "Крылова Анна Владимировна",
        role: "Реаниматолог, нарколог, анестезиолог, токсиколог, трансфузиолог",
        photo: "/centers/profmed/staff/krylova.webp",
      },
      {
        name: "Бондарева Рита Сергеевна",
        role: "Заместитель главного врача",
        photo: "/centers/profmed/staff/bondareva.webp",
      },
      {
        name: "Корхов Марк Сергеевич",
        role: "Руководитель реабилитационного центра, клинический психолог",
        photo: "/centers/profmed/staff/korkhov.webp",
      },
    ],
  },
  features: [
    "Анонимно, без учёта",
    "Выезд за 30 минут",
    "Первый выезд бесплатно",
    "Без предоплаты",
    "Круглосуточно",
    "Лицензия на медицинскую помощь",
  ],
  gallery: {
    main: { src: "/centers/profmed/ward.webp", alt: "Палата стационара", frameClassName: cover },
    topMiddle: { src: "/centers/profmed/consult.webp", alt: "Приём врача", frameClassName: cover },
    topRight: { src: "/centers/profmed/procedure.webp", alt: "Процедура", frameClassName: cover },
    bottomMiddle: { src: "/centers/profmed/dining.webp", alt: "Столовая", frameClassName: cover },
    more: { src: "/centers/profmed/lounge.webp", alt: "Зона отдыха", frameClassName: cover },
    moreLabel: "+ 1 фотография",
    photos: [
      { src: "/centers/profmed/ward.webp", alt: "Палата стационара" },
      { src: "/centers/profmed/ward-single.webp", alt: "Палата" },
      { src: "/centers/profmed/consult.webp", alt: "Приём врача" },
      { src: "/centers/profmed/procedure.webp", alt: "Процедура" },
      { src: "/centers/profmed/dining.webp", alt: "Столовая" },
      { src: "/centers/profmed/lounge.webp", alt: "Зона отдыха" },
    ],
  },
};
