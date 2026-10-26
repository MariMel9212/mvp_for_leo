const steps = [
  "Заполните заявку, указав удобный метод связи",
  "Расскажите о ситуации",
  "Мы подберем несколько вариантов под ваши критерии",
  "Свяжем вас с центром и сопроводим на моменте подписания договора",
];

export function HowItWorks() {
  return (
    <section
      id="kak-rabotaet"
      className="mx-auto w-full max-w-[940px] px-4 pt-16 min-[768px]:pt-20 min-[1440px]:max-w-[1180px] min-[1440px]:pt-24"
    >
      <h2 className="text-center text-[32px] leading-[1.1] font-medium text-black min-[768px]:text-[44px] min-[1440px]:text-[56px]">
        Как работает подбор
      </h2>
      <ol className="mt-8 grid grid-cols-1 gap-3 min-[768px]:mt-12 min-[768px]:grid-cols-4 min-[768px]:gap-4 min-[1440px]:mt-14">
        {steps.map((text, index) => (
          <li
            key={text}
            className="flex flex-col rounded-[16px] bg-[#f8f8f8] px-5 py-6 min-[1440px]:px-6 min-[1440px]:py-7"
          >
            <span className="text-[28px] leading-none font-medium text-[#11ab09] min-[1440px]:text-[32px]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="mt-4 text-[16px] leading-[1.35] font-medium text-[#0a0d14] min-[1440px]:mt-5 min-[1440px]:text-[18px]">
              {text}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
