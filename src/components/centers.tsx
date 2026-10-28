const centers = [
  {
    image: "/centers/himki.png",
    name: "Ребцентр в Химках",
    program: "Программа от 3 до 12 мес",
  },
  {
    image: "/centers/zelenograd.png",
    name: "Ребцентр в Зеленограде",
    program: "Программа от 5 до 12 мес",
  },
  {
    image: "/centers/timber.png",
    name: "Ребцентр в Химках",
    program: "Программа от 3 до 12 мес",
  },
  {
    image: "/centers/log.png",
    name: "Ребцентр в Химках",
    program: "Программа от 3 до 12 мес",
    price: "120 000",
  },
];

export function Centers() {
  return (
    <section className="mx-auto mt-[var(--space-section)] flex w-full max-w-[940px] flex-col gap-[var(--space-heading)] px-4 pb-[var(--space-section)] min-[1440px]:max-w-[1180px]">
      <h2 className="text-center text-[32px] leading-[1.1] font-medium text-black min-[768px]:text-[44px]">
        Проверенные учереждения
      </h2>

      <div className="grid grid-cols-1 gap-3 min-[768px]:grid-cols-2">
        {centers.map((center) => (
          <article
            key={center.image}
            className="relative aspect-[464/463] overflow-hidden rounded-[23px]"
          >
            <img
              src={center.image}
              alt={center.name}
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 flex h-[97px] items-center justify-between gap-3 bg-gradient-to-b from-transparent to-black/80 px-4 pt-3.5">
              <div className="min-w-0">
                <p className="text-[20px] leading-[1.1] font-medium text-white">
                  {center.name}
                </p>
                <p className="mt-1 text-[14px] leading-[1.1] font-normal text-white/80">
                  {center.program}
                </p>
              </div>
              {center.price ? (
                <p className="flex shrink-0 items-end gap-1.5 whitespace-nowrap text-white">
                  <span className="text-[20px] leading-[1.1] font-medium">
                    {center.price}
                  </span>
                  <span className="text-[14px] leading-[1.1] opacity-80">
                    ₽ / месяц
                  </span>
                </p>
              ) : (
                <button
                  type="button"
                  className="inline-flex h-[34px] shrink-0 items-center justify-center rounded-[8px] bg-[rgba(120,216,112,0.92)] px-[10px] text-[16px] leading-[1.1] font-medium text-[rgba(17,17,17,0.9)]"
                >
                  Запросить цену
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
