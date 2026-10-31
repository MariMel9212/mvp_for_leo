import { CoverageScan, FormatRadar, SituationSheets } from "@/components/step-art";

const format =
  "Детокс, стационарная реабилитация или\u00a0последовательное прохождение нескольких этапов";

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
    <section id="shagi" className="relative mt-[120px] w-[1440px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 bg-[linear-gradient(180deg,rgba(236,236,236,0.2)_0%,rgba(189,226,255,0.2)_100%)]"
      />
      <div className="relative flex flex-col gap-[52px] px-[120px] pt-[34px] pb-[34px]">
        <h2 className="w-[1200px] text-40 font-medium">3 шага до выздоровления</h2>
        <div className="flex h-[486px] w-[1200px] items-end gap-[24px]">
          <article className={`situation-card ${cardClass} h-[318px]`} style={cardStyle}>
            <StepCopy
              title="Разбираемся в ситуации"
              text="Тип зависимости, состояние человека, прошлый опыт лечения, возраст и другие важные обстоятельства"
            />
            <SituationSheets />
          </article>

          <article className={`format-card ${cardClass} h-[402px]`} style={cardStyle}>
            <StepCopy title="Определяем формат" text={format} />
            <FormatRadar />
          </article>

          <article className={`coverage-card ${cardClass} h-[486px]`} style={cardStyle}>
            <StepCopy title="Отбираем учреждения" text={format} />
            <CoverageScan />
          </article>
        </div>
      </div>
    </section>
  );
}
