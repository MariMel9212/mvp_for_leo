import type { ReactNode } from "react";
import { CoverageScan, FormatRadar, SituationSheets } from "@/components/step-art";
import { StepRail } from "@/components/step-rail";
import { tie } from "@/lib/tie";

const format = tie("Детокс, стационарная реабилитация или последовательное прохождение нескольких этапов");
const coverage = tie("Сверяем регион, бюджет, программу, специалистов и условия пребывания");

const cardClass =
  "relative w-full shrink-0 snap-start overflow-hidden rounded-[26px] bg-[#e4eefc] shadow-[0_8px_16px_-10px_rgba(36,74,127,0.22)] max-md:h-[362px] max-md:w-[calc(100vw-72px)] max-md:rounded-[25px] max-md:bg-white max-md:shadow-none md:shrink md:snap-none min-[1440px]:w-[383px]";

function StepCopy({ title, text }: { title: string; text: string }) {
  return (
    <div className="relative z-10 flex flex-col items-center gap-[6px] px-[26px] pt-[36px] text-center max-md:gap-2.5 max-md:px-[26px] max-md:pt-7 max-[1439px]:min-h-[124px] max-[1439px]:px-5 max-[1439px]:pt-7 max-md:min-h-0">
      <h3 className="w-full max-w-[331px] text-24 font-medium max-[1439px]:text-[20px] max-[1439px]:leading-[26px]">{tie(title)}</h3>
      <p className="w-full max-w-[331px] text-18 md:max-[1439px]:text-16 md:max-[1439px]:leading-[22px] max-md:text-[14px] max-md:leading-[22px]">{tie(text)}</p>
    </div>
  );
}

function ArtWell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative mt-2 h-[176px] overflow-hidden max-md:absolute max-md:inset-x-0 max-md:top-[148px] max-md:bottom-0 max-md:z-0 max-md:mt-0 max-md:h-auto max-md:rounded-t-[40px] max-md:bg-[rgba(228,238,252,0.55)] min-[1440px]:absolute min-[1440px]:inset-0 min-[1440px]:mt-0 min-[1440px]:h-auto min-[1440px]:overflow-visible${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}

export function RecoverySteps() {
  return (
    <section id="shagi" className="relative mt-12 w-full md:max-[1439px]:mt-20 min-[1440px]:mt-[120px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 bg-[#f6f8fa]"
      />
      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-[120px] py-8 max-md:gap-[38px] max-md:pt-[33px] max-md:pb-6 max-[1439px]:px-4 min-[1440px]:gap-[52px] min-[1440px]:py-[36px]">
        <h2 className="text-40 font-medium max-md:text-28 md:max-[1439px]:text-[32px] md:max-[1439px]:leading-[40px]">
          <span className="md:hidden">
            {tie("3 шага")}
            <br />
            {tie("до выздоровления")}
          </span>
          <span className="hidden md:inline">{tie("3 шага до выздоровления")}</span>
        </h2>
        <StepRail>
          <article className={`situation-card @container ${cardClass} max-[1439px]:flex max-[1439px]:flex-col md:max-[1439px]:h-full min-[1440px]:h-[318px]`}>
            <StepCopy
              title="Разбираемся в ситуации"
              text="Тип зависимости, состояние человека, прошлый опыт лечения, возраст и другие важные обстоятельства"
            />
            <ArtWell>
              <SituationSheets />
            </ArtWell>
          </article>

          <article className={`format-card @container ${cardClass} max-[1439px]:flex max-[1439px]:flex-col md:max-[1439px]:h-full min-[1440px]:h-[402px]`}>
            <StepCopy title="Определяем формат" text={format} />
            <ArtWell>
              <FormatRadar />
            </ArtWell>
          </article>

          <article className={`coverage-card ${cardClass} max-[1439px]:flex max-[1439px]:flex-col max-[1439px]:[container-type:inline-size] md:max-[1439px]:h-full min-[1440px]:h-[486px]`}>
            <StepCopy title="Отбираем учреждения" text={coverage} />
            <ArtWell className="md:max-[1439px]:h-[252px]">
              <CoverageScan />
            </ArtWell>
          </article>
        </StepRail>
      </div>
    </section>
  );
}
