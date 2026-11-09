import type { ReactNode } from "react";
import { CoverageScan, FormatRadar, SituationSheets } from "@/components/step-art";
import { tie } from "@/lib/tie";

const format = tie("Детокс, стационарная реабилитация или последовательное прохождение нескольких этапов");

const cardClass =
  "relative w-full overflow-hidden rounded-[26px] border-t border-r border-l border-[#3a7cee]/7 bg-[#f2f8fe] min-[1440px]:w-[383px]";

const cardStyle = {
  backgroundImage:
    "linear-gradient(180deg, rgba(138, 158, 255, 0.06) 0%, rgba(235, 235, 235, 0.06) 100%)",
};

function StepCopy({ title, text, mobileText }: { title: string; text: string; mobileText?: string }) {
  return (
    <div className="flex flex-col items-center gap-[6px] px-[26px] pt-[36px] text-center max-[1439px]:min-h-[124px] max-[1439px]:px-5 max-[1439px]:pt-7 @max-[220px]:min-h-0 @max-[220px]:gap-1.5 @max-[220px]:px-3 @max-[220px]:pt-4 @max-[220px]:pb-2">
      <h3 className="w-full max-w-[331px] text-24 font-medium max-[1439px]:text-[20px] max-[1439px]:leading-[26px] @max-[220px]:text-[16px] @max-[220px]:leading-[20px]">{tie(title)}</h3>
      <p className={`w-full max-w-[331px] text-18 max-[1439px]:text-16 max-[1439px]:leading-[22px] @max-[220px]:text-13 @max-[220px]:leading-[18px]${mobileText ? " max-md:hidden" : ""}`}>{tie(text)}</p>
      {mobileText ? <p className="w-full text-16 leading-[22px] md:hidden">{tie(mobileText)}</p> : null}
    </div>
  );
}

function ArtWell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative mt-2 h-[176px] overflow-hidden @max-[220px]:mt-auto @max-[220px]:h-[136px] min-[1440px]:absolute min-[1440px]:inset-0 min-[1440px]:mt-0 min-[1440px]:h-auto min-[1440px]:overflow-visible${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}

export function RecoverySteps() {
  return (
    <section id="shagi" className="relative mt-16 w-full min-[1440px]:mt-[120px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2"
        style={{
          backgroundColor: "#fdfdfd",
          backgroundImage: "linear-gradient(180deg, rgba(210,222,243,0.25) 0%, rgba(222,234,255,0.25) 100%)",
        }}
      />
      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-[120px] pt-8 pb-8 max-[1439px]:px-4 min-[1440px]:gap-[52px] min-[1440px]:py-[34px]">
        <h2 className="text-40 font-medium max-md:text-28 md:max-[1439px]:text-[32px] md:max-[1439px]:leading-[40px]">{tie("3 шага до выздоровления")}</h2>
        <div className="grid w-full grid-cols-1 items-stretch gap-6 max-md:grid-cols-2 max-md:gap-3 min-[1440px]:flex min-[1440px]:h-[486px] min-[1440px]:flex-row min-[1440px]:items-end min-[1440px]:gap-[24px]">
          <article className={`situation-card @container ${cardClass} max-[1439px]:flex max-[1439px]:h-full max-[1439px]:flex-col min-[1440px]:h-[318px]`} style={cardStyle}>
            <StepCopy
              title="Разбираемся в ситуации"
              text="Тип зависимости, состояние человека, прошлый опыт лечения, возраст и другие важные обстоятельства"
            />
            <ArtWell>
              <SituationSheets />
            </ArtWell>
          </article>

          <article className={`format-card @container ${cardClass} max-[1439px]:flex max-[1439px]:h-full max-[1439px]:flex-col min-[1440px]:h-[402px]`} style={cardStyle}>
            <StepCopy title="Определяем формат" text={format} />
            <ArtWell>
              <FormatRadar />
            </ArtWell>
          </article>

          <article className={`coverage-card ${cardClass} max-md:col-span-2 max-[1439px]:flex max-[1439px]:h-full max-[1439px]:flex-col max-[1439px]:[container-type:inline-size] min-[1440px]:h-[486px]`} style={cardStyle}>
            <StepCopy
              title="Отбираем учреждения"
              text={format}
              mobileText="Программа, лицензии, персонал и другие важные критерии"
            />
            <ArtWell className="max-md:h-[268px] md:max-[1439px]:h-[252px]">
              <CoverageScan />
            </ArtWell>
          </article>
        </div>
      </div>
    </section>
  );
}
