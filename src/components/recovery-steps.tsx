const format =
  "Детокс, стационарная реабилитация или\u00a0последовательное прохождение нескольких этапов";

const dots: { x: number; y: number; opacity: string }[] = [
  { x: 45, y: 61, opacity: "opacity-100" },
  { x: 175, y: 51, opacity: "opacity-100" },
  { x: 205, y: 56, opacity: "opacity-70" },
  { x: 74, y: 51, opacity: "opacity-70" },
  { x: 0, y: 73, opacity: "opacity-70" },
  { x: 23, y: 25, opacity: "opacity-40" },
  { x: 82, y: 80, opacity: "opacity-40" },
  { x: 162, y: 73, opacity: "opacity-40" },
  { x: 207, y: 0, opacity: "opacity-40" },
  { x: 216, y: 30, opacity: "opacity-40" },
  { x: 52, y: 0, opacity: "opacity-100" },
  { x: 241, y: 78, opacity: "opacity-100" },
];

const cardClass =
  "relative w-[383px] overflow-hidden rounded-[26px] border-t border-r border-l border-[#3a7cee]/7 bg-[#f2f8fe]";

const cardStyle = {
  backgroundImage:
    "linear-gradient(180deg, rgba(138, 158, 255, 0.06) 0%, rgba(235, 235, 235, 0.06) 100%)",
};

function StepCopy({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-[6px] px-[26px] pt-[36px] text-center">
      <h3 className="w-[331px] text-24 font-medium">{title}</h3>
      <p className="w-[331px] text-18">{text}</p>
    </div>
  );
}

export function RecoverySteps() {
  return (
    <section
      id="shagi"
      className="mt-[120px] flex w-[1440px] flex-col gap-[52px] rounded-[26px] bg-[#eef2f9]/28 px-[120px] pt-[34px] pb-[34px]"
    >
      <h2 className="w-[1200px] text-40 font-medium">3 шага до выздоровления</h2>
      <div className="flex h-[486px] w-[1200px] items-end gap-[24px]">
        <article className={`${cardClass} h-[318px]`} style={cardStyle}>
          <StepCopy
            title="Разбираемся в ситуации"
            text="Тип зависимости, состояние человека, прошлый опыт лечения, возраст и другие важные обстоятельства"
          />
          <div className="absolute top-[203px] left-[94px] h-[133px] w-[195px]">
            <div className="absolute top-[2px] left-[106px] flex h-[131px] w-[116px] items-center justify-center">
              <img alt="" src="/steps/table.svg" className="max-w-none rotate-[14deg]" />
            </div>
            <div className="absolute top-[24px] left-0 flex h-[131px] w-[116px] items-center justify-center">
              <img alt="" src="/steps/checklist.svg" className="max-w-none -rotate-[14deg]" />
            </div>
            <img alt="" src="/steps/document.svg" className="absolute top-0 left-[46px] max-w-none" />
          </div>
        </article>

        <article className={`${cardClass} h-[402px]`} style={cardStyle}>
          <StepCopy title="Определяем формат" text={format} />
          <div className="absolute top-[270px] left-1/2 h-[258px] w-[258px] -translate-x-1/2">
            <img alt="" src="/steps/radar.svg" className="absolute top-[-34px] left-[-16px] max-w-none" />
          </div>
          <div className="absolute top-[316px] left-[68px] h-[82px] w-[243px]">
            {dots.map((dot) => (
              <span
                key={`${dot.x}-${dot.y}`}
                className={`absolute h-[2px] w-[2px] rounded-full bg-white ${dot.opacity}`}
                style={{ left: dot.x, top: dot.y }}
              />
            ))}
          </div>
        </article>

        <article className={`${cardClass} h-[486px]`} style={cardStyle}>
          <StepCopy title="Отбираем учреждения" text={format} />
          <img
            alt=""
            src="/steps/coverage.png"
            width={383}
            height={289}
            className="absolute top-[197px] left-0 h-[289px] w-[383px] max-w-none"
          />
        </article>
      </div>
    </section>
  );
}
