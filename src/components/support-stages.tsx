const cards = [
  {
    title: "Разберём вашу ситуацию",
    text: "Поговорим о том, что происходит сейчас, и подскажем, какие шаги стоит предпринять в первую очередь",
    n: "1",
    className: "h-auto bg-white min-[1440px]:row-span-2 min-[1440px]:h-[540px]",
    copyClass: "gap-[20px]",
    numberClass: "top-[414px] left-[336px] text-[#e3eefd]",
  },
  {
    title: "Найдём подходящий вариант",
    text: "Подберём несколько вариантов с учётом состояния человека, региона, бюджета и\u00a0необходимых условий",
    n: "2",
    className: "h-auto bg-white min-[1440px]:h-[258px]",
    copyClass: "gap-[20px]",
    numberClass: "top-[132px] left-[328px] text-[#e3eefd]",
  },
  {
    title: "Поможем принять решение",
    text: "Объясним различия между вариантами, ответим на вопросы и поможем выбрать подходящий формат помощи",
    n: "3",
    className: "h-auto bg-white min-[1440px]:h-[258px]",
    copyClass: "gap-[28px]",
    numberClass: "top-[132px] left-[326px] text-[#e3eefd]",
  },
  {
    title: "Останемся на связи",
    text: "Если ситуация изменится или появятся новые вопросы, поможем скорректировать дальнейшие шаги",
    n: "4",
    className: "h-auto min-[1440px]:col-span-2 min-[1440px]:h-[258px]",
    style: { backgroundImage: "linear-gradient(107deg, rgba(222,234,255,0.7) 0%, rgba(58,159,248,0.294) 100%)" },
    copyClass: "w-full gap-[28px] min-[1440px]:w-[399px]",
    numberClass: "top-[132px] left-[727px] text-white/87",
  },
];

export function SupportStages() {
  return (
    <section className="relative mt-[20px]">
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 bg-[#f6f8fa]" />
      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-[120px] py-8 max-[1439px]:px-4 min-[1440px]:gap-[52px] min-[1440px]:py-[42px]">
        <h2 className="text-40 font-medium max-[1439px]:text-[32px] max-[1439px]:leading-[40px]">Поддержка на всех этапах</h2>
        <div className="grid w-full grid-cols-3 gap-4 max-[1439px]:grid-cols-1 min-[1440px]:grid-rows-[258px_258px] min-[1440px]:gap-[24px]">
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
                className={`pointer-events-none absolute hidden text-[134px] leading-[168px] font-medium min-[1440px]:block ${card.numberClass}`}
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
