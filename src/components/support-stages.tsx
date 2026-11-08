import { tie } from "@/lib/tie";

const cards = [
  {
    title: "Разберём вашу ситуацию",
    text: "Поговорим о том, что происходит сейчас, и подскажем, какие шаги стоит предпринять в первую очередь",
    n: "1",
    className: "h-auto bg-white min-[1440px]:row-span-2 min-[1440px]:h-[540px]",
    copyClass: "gap-[20px]",
    numberClass: "text-[#e3eefd] min-[1440px]:top-[414px] min-[1440px]:left-[336px]",
  },
  {
    title: "Найдём подходящий вариант",
    text: "Подберём несколько вариантов с учётом состояния человека, региона, бюджета и\u00a0необходимых условий",
    n: "2",
    className: "h-auto bg-white min-[1440px]:h-[258px]",
    copyClass: "gap-[20px]",
    numberClass: "text-[#e3eefd] min-[1440px]:top-[132px] min-[1440px]:left-[328px]",
  },
  {
    title: "Поможем принять решение",
    text: "Объясним различия между вариантами, ответим на вопросы и поможем выбрать подходящий формат помощи",
    n: "3",
    className: "h-auto bg-white min-[1440px]:h-[258px]",
    copyClass: "gap-[28px]",
    numberClass: "text-[#e3eefd] min-[1440px]:top-[132px] min-[1440px]:left-[326px]",
  },
  {
    title: "Останемся на связи",
    text: "Если ситуация изменится или появятся новые вопросы, поможем скорректировать дальнейшие шаги",
    n: "4",
    className: "h-auto min-[1440px]:col-span-2 min-[1440px]:h-[258px]",
    style: { backgroundImage: "linear-gradient(107deg, rgba(222,234,255,0.7) 0%, rgba(58,159,248,0.294) 100%)" },
    copyClass: "w-full gap-[28px] min-[1440px]:w-[399px]",
    numberClass: "text-white/87 min-[1440px]:top-[132px] min-[1440px]:left-[727px]",
  },
];

export function SupportStages() {
  return (
    <section className="relative mt-[20px]">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#f6f8fa]" />
      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-[120px] py-8 max-[1439px]:px-4 min-[1440px]:gap-[52px] min-[1440px]:py-[42px]">
        <h2 className="text-40 font-medium max-[1439px]:text-[32px] max-[1439px]:leading-[40px]">{tie("Поддерживаем на каждом этапе")}</h2>
        <div className="grid w-full grid-cols-3 items-start gap-4 max-[1439px]:grid-cols-1 min-[1440px]:grid-rows-[258px_258px] min-[1440px]:gap-[24px]">
          {cards.map((card) => (
            <article
              key={card.n}
              className={`relative overflow-hidden rounded-[17px] ${card.className}`}
              style={"style" in card ? card.style : undefined}
            >
              <div className={`flex flex-col px-[14px] pt-[36px] max-[1439px]:pt-5 max-[1439px]:pb-[78px] ${card.copyClass}`}>
                <h3 className="text-24 font-medium max-[1439px]:text-[20px] max-[1439px]:leading-[26px]">{tie(card.title)}</h3>
                <p className="text-[18px] leading-[24px] opacity-60 max-[1439px]:text-16 max-[1439px]:leading-[22px]">{tie(card.text)}</p>
              </div>
              <span
                aria-hidden
                className={`pointer-events-none absolute text-[104px] leading-none font-medium max-[1439px]:right-[-16px] max-[1439px]:bottom-[-18px] min-[1440px]:text-[134px] min-[1440px]:leading-[168px] ${card.numberClass}`}
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
