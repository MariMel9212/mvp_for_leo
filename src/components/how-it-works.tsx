const steps = [
  { text: "Заполните заявку, указав удобный метод связи", indent: false },
  { text: "Расскажите о ситуации", indent: true },
  { text: "Мы подберем несколько вариантов под ваши критерии", indent: false },
  {
    text: "Свяжем вас с центром и сопроводим на моменте подписания договора",
    indent: false,
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-[940px] px-4 pt-16 min-[768px]:pt-[90px] min-[1440px]:max-w-[1180px] min-[1440px]:pt-[120px]">
      <h2 className="text-center text-[32px] leading-[1.1] font-medium text-black min-[768px]:text-[44px] min-[1440px]:text-[56px]">
        Как работает подбор
      </h2>
      <ul className="mt-10 flex max-w-[640px] flex-col gap-6 pl-0 text-[17px] leading-5 font-medium tracking-[-0.102px] text-[#0a0d14] min-[768px]:mt-[120px] min-[768px]:gap-9 min-[768px]:pl-10 min-[1440px]:max-w-[760px] min-[1440px]:text-[20px] min-[1440px]:leading-6">
        {steps.map((step) => (
          <li key={step.text} className={step.indent ? "min-[768px]:pl-[90px]" : undefined}>
            {step.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
