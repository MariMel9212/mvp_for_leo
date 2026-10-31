const cards = [
  {
    title: "Разберём вашу ситуацию",
    text: "Поговорим о том, что происходит сейчас, и подскажем, какие шаги стоит предпринять в первую очередь",
    n: "1",
    className: "row-span-2 h-[540px] border border-[#dedede] bg-white",
    copyClass: "gap-[20px]",
    numberClass: "top-[414px] left-[336px] text-[#e3eefd]",
  },
  {
    title: "Найдём подходящий вариант",
    text: "Подберём несколько вариантов с учётом состояния человека, региона, бюджета и\u00a0необходимых условий",
    n: "2",
    className: "h-[258px] border border-[#dedede] bg-white",
    copyClass: "gap-[20px]",
    numberClass: "top-[132px] left-[328px] text-[#e3eefd]",
  },
  {
    title: "Поможем принять решение",
    text: "Объясним различия между вариантами, ответим на вопросы и поможем выбрать подходящий формат помощи",
    n: "3",
    className: "h-[258px] border border-[#dedede] bg-white",
    copyClass: "gap-[28px]",
    numberClass: "top-[132px] left-[326px] text-[#e3eefd]",
  },
  {
    title: "Останемся на связи",
    text: "Если ситуация изменится или появятся новые вопросы, поможем скорректировать дальнейшие шаги",
    n: "4",
    className: "col-span-2 h-[258px]",
    style: { backgroundImage: "linear-gradient(107deg, #deeaff 0%, rgba(58,159,248,0.42) 100%)" },
    copyClass: "w-[399px] gap-[28px]",
    numberClass: "top-[132px] left-[727px] text-white/87",
  },
];

export function SupportStages() {
  return (
    <section className="relative mt-[112px]">
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 bg-[#f6f8fa]" />
      <div className="relative mx-auto flex w-[1440px] flex-col gap-[52px] px-[120px] py-[42px]">
        <h2 className="text-40 font-medium">Поддержка на всех этапах</h2>
        <div className="grid w-[1200px] grid-cols-3 grid-rows-[258px_258px] gap-[24px]">
          {cards.map((card) => (
            <article
              key={card.n}
              className={`relative overflow-hidden rounded-[17px] ${card.className}`}
              style={"style" in card ? card.style : undefined}
            >
              <div className={`flex flex-col px-[14px] pt-[36px] ${card.copyClass}`}>
                <h3 className="text-24 font-medium">{card.title}</h3>
                <p className="text-[18px] leading-[24px] opacity-60">{card.text}</p>
              </div>
              <span
                aria-hidden
                className={`pointer-events-none absolute text-[134px] leading-[168px] font-medium ${card.numberClass}`}
              >
                {card.n}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
