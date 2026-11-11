import type { CenterPageData } from "@/content/centers/types";

const cover = "absolute inset-0";

export const vyhodEstCenter: CenterPageData = {
  title: "Реабилитационный центр",
  region: "Чехов",
  facts: [
    { label: "Направления:", value: "алкоголизм, наркомания", extra: "ещё 5", extraHint: "Токсикомания, лекарственная зависимость, лудомания, игромания и расстройства пищевого поведения" },
    { label: "Формат:", value: "с проживанием" },
    { label: "Программа:", value: "12 шагов" },
    { label: "Стоимость:", value: "от 65 000 ₽" },
  ],
  about: {
    lead: "Реабилитационный центр оказывает помощь людям с алкогольной, наркотической и другими видами зависимости.",
    rest: "\n\nПрограмма включает медицинскую помощь, психологическую поддержку и реабилитацию. Специалисты работают не только с последствиями употребления, но и с психологическими причинами зависимости, помогая человеку постепенно вернуться к самостоятельной жизни.\n\nВ команде работают врач-нарколог, программный руководитель и консультанты по зависимости. Также предусмотрена поддержка родственников и работа с созависимостью.\n\nЦентр оказывает экстренную наркологическую помощь, проводит реабилитацию в стационарном и амбулаторном форматах. Обращения принимаются круглосуточно, с соблюдением конфиденциальности.",
  },
  amenities: [
    { icon: "territory", label: "Частная территория" },
    { icon: "gym", label: "Тренажёрный зал" },
    { icon: "bath", label: "Баня" },
    { icon: "group", label: "Группы" },
    { icon: "rooms", label: "Общие комнаты" },
  ],
  schedule: [
    { time: "08:50", event: "Подъём" },
    { time: "09:10", event: "Зарядка и водные процедуры" },
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
    kind: "people",
    summary: "4 консультанта, 2 клинических психолога, один психиатр",
    people: [
      { name: "Акимов Роман Александрович", role: "Руководитель центра", photo: "/centers/narkolog/staff/akimov.webp" },
      { name: "Арбатская Оксана Анатольевна", role: "Программный руководитель", photo: "/centers/narkolog/staff/arbatskaya.webp" },
      { name: "Филатова Ирина Викторовна", role: "Врач-нарколог (стаж более 4 лет)", photo: "/centers/narkolog/staff/filatova.webp" },
      { name: "Коломенский Анатолий Вячеславович", role: "Старший консультант по зависимости (стаж более 7 лет)", photo: "/centers/narkolog/staff/kolomensky.webp" },
      { name: "Тютрин Дмитрий Игоревич", role: "Консультант по зависимости (стаж более 3 лет)", photo: "/centers/narkolog/staff/tyutrin.webp" },
      { name: "Верещагин Александр Николаевич", role: "Консультант по химической и нехимической зависимости (стаж более 5 лет)", photo: "/centers/narkolog/staff/vereshchagin.webp" },
    ],
  },
  features: [
    "Программа 12 шагов",
    "Постлечебная программа",
    "Семейные сессии",
    "Ресоциализация",
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
