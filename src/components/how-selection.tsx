import type { CSSProperties, ReactNode } from "react";

const cardStyle: CSSProperties = {
  backgroundImage:
    "linear-gradient(180deg, rgba(138, 158, 255, 0.06) 0%, rgba(235, 235, 235, 0.06) 100%), linear-gradient(90deg, #f2f8fe 0%, #f2f8fe 100%)",
};

const radarDots: Array<[number, number]> = [
  [91, 301],
  [102, 282],
  [110, 274],
  [202, 275],
  [214, 288],
  [222, 306],
  [108, 303],
  [117, 290],
  [196, 291],
  [205, 306],
  [122, 305],
  [189, 306],
];

const sparks: Array<[number, number, number]> = [
  [151.6, 219.4, 2.8],
  [108, 148.8, 2.8],
  [156.9, 103.4, 2.8],
  [152.3, 83.2, 2.8],
  [94.3, 88, 2.8],
  [128.9, 118.1, 2.8],
  [110.1, 173.3, 2.8],
  [110.8, 106.9, 2.8],
  [131, 212.4, 2.8],
  [97.8, 196.4, 2.8],
  [157.2, 205.4, 2.8],
  [163.2, 92.9, 2.8],
  [115.7, 152.3, 2.8],
  [160.7, 90.1, 2.8],
  [152.3, 199.9, 2.8],
  [163.5, 188, 2.8],
  [121.2, 201.3, 2.8],
  [98.5, 92.9, 2.8],
];

const obscured = [
  { label: "Business management", x: 38.08, y: 71.63, w: 125.78 },
  { label: "Digital platform", x: -31.45, y: 111.46, w: 105.87 },
  { label: "Customer Portal", x: 80.71, y: 111.46, w: 133.82 },
  { label: "Healthcare", x: -43.67, y: 151.64, w: 105.87 },
  { label: "Travel booking", x: 67.43, y: 151.64, w: 94.34 },
  { label: "Online education", x: 34.24, y: 191.12, w: 119.14 },
];

export function HowSelection() {
  return (
    <section
      id="kak-proiskhodit"
      className="mx-auto mt-16 w-full max-w-[1400px] px-4 min-[768px]:mt-[108px] min-[1440px]:px-8"
    >
      <div className="mx-auto flex w-full flex-col gap-[54px]">
        <h2 className="text-[32px] leading-[1.1] font-medium text-[#0a0d14] opacity-96 min-[768px]:text-[38px]">
          Как происходит подбор
        </h2>

        <div className="mx-auto flex w-full max-w-[420px] flex-col gap-4 min-[768px]:hidden">
          <PhoneCard height={264}>
            <SituationCard />
          </PhoneCard>
          <PhoneCard height={328}>
            <FormatCard />
          </PhoneCard>
          <PhoneCard height={413}>
            <CentersCard />
          </PhoneCard>
        </div>

        <div className="@container hidden w-full min-[768px]:block">
          <div className="relative h-[calc(100cqw*413/984)] overflow-hidden">
            <div className="absolute top-0 left-0 h-[413px] w-[984px] origin-top-left [transform:scale(calc(100cqw/984px))]">
              <div className="absolute bottom-0 left-0">
                <SituationCard />
              </div>
              <div className="absolute bottom-0 left-[336px]">
                <FormatCard />
              </div>
              <div className="absolute bottom-0 left-[672px]">
                <CentersCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneCard({
  height,
  children,
}: {
  height: number;
  children: ReactNode;
}) {
  return (
    <div className="@container w-full">
      <div
        className="relative overflow-hidden"
        style={{ height: `calc(100cqw * ${height} / 312)` }}
      >
        <div
          className="absolute top-0 left-0 w-[312px] origin-top-left [transform:scale(calc(100cqw/312px))]"
          style={{ height }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function CardShell({
  height,
  children,
}: {
  height: number;
  children: ReactNode;
}) {
  return (
    <article
      className="relative w-[312px] overflow-clip rounded-tl-[27px] rounded-tr-[27px] rounded-bl-[16px] rounded-br-[16px] border border-[rgba(58,124,238,0.07)]"
      style={{ ...cardStyle, height }}
    >
      {children}
    </article>
  );
}

function CardCopy({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="absolute top-[52px] left-[15px] flex w-[282px] flex-col items-center gap-[10px] text-center text-[#0a0d14]">
      <h3 className="w-full text-[22px] leading-[1.1] font-medium opacity-96">
        {title}
      </h3>
      <p className="w-full text-[14px] leading-[1.2] font-normal">{body}</p>
    </div>
  );
}

function SituationCard() {
  return (
    <CardShell height={264}>
      <CardCopy
        title="Разбираемся в ситуации"
        body="Тип зависимости, состояние человека, прошлый опыт лечения, возраст и другие важные обстоятельства"
      />
      <div className="absolute top-[168.37px] left-[calc(50%+0.5px)] h-[132.724px] w-[195px] -translate-x-1/2">
        <div className="absolute top-[1.8px] left-[78.84px] flex h-[130.836px] w-[116.158px] items-center justify-center">
          <div className="rotate-[14deg]">
            <img
              src="/process/table.svg"
              alt=""
              width={91.801}
              height={111.952}
              className="block max-w-none"
            />
          </div>
        </div>
        <div className="absolute top-[1.89px] left-0 flex h-[130.836px] w-[116.158px] items-center justify-center">
          <div className="-rotate-[14deg]">
            <img
              src="/process/checklist.svg"
              alt=""
              width={91.801}
              height={111.952}
              className="block max-w-none"
            />
          </div>
        </div>
        <img
          src="/process/document.svg"
          alt=""
          width={99.919}
          height={121.852}
          className="absolute top-0 left-[45.54px] block max-w-none"
        />
      </div>
    </CardShell>
  );
}

function FormatCard() {
  return (
    <CardShell height={328}>
      <CardCopy
        title="Определяем подходящий формат"
        body={"Детокс, стационарная реабилитация или\u00a0последовательное прохождение нескольких этапов"}
      />
      <div className="absolute top-[226px] left-[54px] h-[203px] w-[203px]">
        <img
          src="/process/radar.svg"
          alt=""
          width={229.145}
          height={230}
          className="absolute block max-w-none"
          style={{ left: -12.28, top: -27 }}
        />
      </div>
      {radarDots.map(([x, y]) => (
        <span
          key={`${x}-${y}`}
          className="absolute size-[2px] rounded-full bg-[#b2c7eb]"
          style={{ left: x, top: y }}
        />
      ))}
    </CardShell>
  );
}

function CentersCard() {
  return (
    <CardShell height={413}>
      <CardCopy
        title="Отбираем подходящие учреждения"
        body="Сверяем регион, бюджет, программу, специалистов и условия пребывания"
      />
      <div className="absolute top-[165px] left-[-7.87px] h-[261px] w-[327.735px]">
        {obscured.map((item) => (
          <div
            key={item.label}
            className="absolute h-[30.048px] overflow-hidden rounded-[15.373px] bg-[rgba(214,220,216,0.55)]"
            style={{ left: item.x, top: item.y, width: item.w }}
          >
            <p className="absolute top-[8.04px] left-[9.43px] truncate font-[family-name:var(--font-inter)] text-[10.482px] leading-none font-normal text-[#777e78] opacity-[0.07] blur-[0.873px]">
              {item.label}
            </p>
          </div>
        ))}
        <div
          className="absolute rounded-[24px] bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.72),rgba(255,255,255,0))]"
          style={{ left: 71.63, top: 71.63, width: 91.89, height: 146.75 }}
        />
        {sparks.map(([x, y, size]) => (
          <span
            key={`${x}-${y}`}
            className="absolute rounded-full bg-white shadow-[0_0_4px_rgba(120,190,255,0.9)]"
            style={{ left: x, top: y, width: size, height: size }}
          />
        ))}
        <div
          className="absolute bg-[#8ec8ff]/70 blur-[2px]"
          style={{ left: 156.88, top: 77.57, width: 6.29, height: 145.35 }}
        />
        <div
          className="absolute bg-[#5eb6ff]"
          style={{ left: 162.82, top: 43.33, width: 1.75, height: 205.45 }}
        />
        <img
          src="/process/callout.svg"
          alt=""
          width={135.217}
          height={41.928}
          className="absolute block max-w-none"
          style={{ left: 96.43, top: 18.87 }}
        />
        <p
          className="absolute font-[family-name:var(--font-inter)] text-[9.83px] leading-[13.627px] font-medium whitespace-nowrap text-[#3a9ff8] opacity-80"
          style={{ left: 106.87, top: 27, width: 116 }}
        >
          Скрининг учереждений
        </p>
        <p
          className="absolute font-[family-name:var(--font-inter)] text-[10.831px] leading-none font-normal whitespace-nowrap text-[#101110] opacity-60"
          style={{ left: 165.61, top: 120.54 }}
        >
          возраст
        </p>
        <CategoryPill
          label="Регион проживания"
          x={168.06}
          y={71.63}
          width={140.46}
          markLeft={119.15}
          markTop={8.39}
        />
        <CategoryPill
          label="Программа выздоровления"
          x={218.37}
          y={111.81}
          width={150.24}
        />
        <CategoryPill
          label="Персонал в организайии"
          x={159.68}
          y={151.64}
          width={168.06}
          markLeft={144.3}
          markTop={8.04}
        />
        <CategoryPill
          label="Лицензии"
          x={156.53}
          y={191.12}
          width={89.1}
          markLeft={65.34}
          markTop={8.04}
        />
      </div>
    </CardShell>
  );
}

function CategoryPill({
  label,
  x,
  y,
  width,
  markLeft,
  markTop,
}: {
  label: string;
  x: number;
  y: number;
  width: number;
  markLeft?: number;
  markTop?: number;
}) {
  return (
    <div
      className="absolute h-[30.048px] overflow-hidden rounded-[15.373px] border-[0.699px] border-[#c8c9c7] bg-white/40"
      style={{ left: x, top: y, width }}
    >
      <p className="absolute top-[8.04px] left-[9.78px] font-[family-name:var(--font-inter)] text-[10.831px] leading-[13.277px] font-normal whitespace-nowrap text-[#101110]">
        {label}
      </p>
      {markLeft != null && markTop != null ? (
        <span
          className="absolute size-[13.976px] rounded-full"
          style={{
            left: markLeft,
            top: markTop,
            background:
              "linear-gradient(180deg, #f6ffc8 0%, #e1f300 42%, #cdde00 100%)",
            boxShadow:
              "0 0.349px 1.048px rgba(16,142,56,0.13), inset 0 0.45px 0.7px rgba(255,255,255,0.9)",
          }}
        >
          <img
            src="/process/check.svg"
            alt=""
            width={8.036}
            height={8.036}
            className="absolute top-[2.97px] left-[2.97px] block max-w-none"
          />
        </span>
      ) : null}
    </div>
  );
}
