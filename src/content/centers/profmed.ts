import type { CenterPageData } from "@/content/centers/types";

const cover = "absolute inset-0";

export const profmedCenter: CenterPageData = {
  title: "Клиника",
  region: "Химки",
  facts: [
    { label: "Направления:", value: "алкоголизм, наркомания", extra: "ещё 2", extraHint: "Игромания и психические расстройства" },
    { label: "Формат:", value: "стационар и на дому" },
    { label: "Выезд:", value: "около 30 минут" },
  ],
  about: {
    lead: "Клиника наркологии и психиатрии в Химках. Это детокс: снять запой, ломку и острое состояние, а не многомесячная реабилитация. ",
    rest: "Врач выезжает примерно за 30 минут, круглосуточно и без предоплаты. Первый выезд бесплатный, сам вызов врача — от 3 500 ₽. Детоксикация в палате — от 5 500 ₽, снятие ломки — от 5 900 ₽. В палате делают осмотр, несколько капельниц в день, назначают план и сопровождают. Размещение — на четверых, на двоих или одноместное, с питанием. Лечат алкоголизм, наркоманию, игроманию и психические расстройства. Данные в государственный учёт не передают. Лицензия № Л041-01162-50/00366814.",
  },
  amenities: [
    { icon: "rooms", label: "Палаты на 1, 2 и 4" },
    { icon: "dining", label: "Столовая" },
    { icon: "living", label: "Зона отдыха" },
    { icon: "group", label: "Приём врача" },
  ],
  schedule: [],
  staff: {
    kind: "counts",
    counts: [{ count: "20+", role: "Врачей: наркологи, психиатры, психологи, реаниматологи" }],
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
