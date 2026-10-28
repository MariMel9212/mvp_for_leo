import type { ReactNode } from "react";

export function Situation() {
  return (
    <section
      id="situatsii"
      className="mx-auto mt-24 w-full max-w-[1400px] px-4 min-[768px]:mt-40 min-[1440px]:px-8"
    >
      <div className="mx-auto flex w-full flex-col gap-[54px]">
        <h2 className="text-[32px] leading-[1.1] font-medium text-[#0a0d14] opacity-96 min-[768px]:text-[38px]">
          Подбираем помощь под ситуацию
        </h2>
        <div className="flex flex-col items-center gap-6 min-[1040px]:flex-row min-[1040px]:items-start">
          <DetoxCard />
          <RehabCard />
        </div>
      </div>
    </section>
  );
}

function DesignFrame({ children }: { children: ReactNode }) {
  return (
    <div className="@container w-full max-w-[720px] min-[1040px]:max-w-none min-[1040px]:min-w-0 min-[1040px]:flex-1">
      <div className="relative h-[calc(100cqw*408/480)] overflow-hidden">
        <div className="absolute top-0 left-0 h-[408px] w-[480px] origin-top-left [transform:scale(calc(100cqw/480px))]">
          {children}
        </div>
      </div>
    </div>
  );
}

function PickLink({ children }: { children: ReactNode }) {
  return (
    <a
      href="#podbor"
      className="absolute top-[calc(382px-34px*480px/100cqw)] left-[26px] z-10 inline-flex h-11 shrink-0 origin-top-left scale-[calc(480px/100cqw)] items-center justify-center rounded-[8px] bg-[#e1f300] px-4 text-[16px] leading-[1.1] font-medium text-[#0a0d14]/80 hover:bg-[#d6e600]"
    >
      {children}
    </a>
  );
}

function DetoxCard() {
  return (
    <DesignFrame>
      <article className="relative h-[408px] w-[480px] overflow-hidden rounded-[11px] bg-[rgba(245,250,255,0.85)]">
        <div className="absolute top-[8px] left-[-207px] h-[513px] w-[862px]">
          <img
            src="/situations/photo.png"
            alt=""
            className="absolute top-0 left-[-0.1%] h-full w-[100.21%] max-w-none"
          />
        </div>
        <div
          className="absolute top-0 left-0 h-[136px] w-[480px] backdrop-blur-[1.05px]"
          style={{
            background:
              "linear-gradient(to bottom, #f5faff 0%, rgba(245,250,255,0.93) 28.455%, rgba(245,250,255,0) 94.85%)",
          }}
        />
        <div className="absolute top-[28px] left-[26px] flex w-[395px] flex-col gap-[10px] text-[#0a0d14]">
          <h3 className="text-[28px] leading-[1.1] font-medium opacity-96">
            Детокс
          </h3>
          <p className="w-[350px] text-[14px] leading-[1.1] font-normal">
            Подберем клиники и стационары с медицинским наблюдение для
            безопасного выхода из острого состояния
          </p>
        </div>
        <PickLink>Подобрать детокс</PickLink>
      </article>
    </DesignFrame>
  );
}

function RehabCard() {
  return (
    <DesignFrame>
      <article className="relative h-[408px] w-[480px] overflow-hidden rounded-[11px] bg-[#f5faff]">
        <div className="absolute top-[85px] left-[-7px] flex h-[380px] w-[570px] items-center justify-center">
          <div className="-scale-y-100 rotate-180">
            <img
              src="/situations/house.png"
              alt=""
              width={570}
              height={380}
              className="block h-[380px] w-[570px] max-w-none"
            />
          </div>
        </div>
        <div className="absolute top-0 left-0 h-[126px] w-[480px] backdrop-blur-[0.15px]" />
        <div className="absolute bottom-[294px] left-[26px] flex w-[357px] flex-col gap-[10px] text-[#0a0d14]">
          <h3 className="text-[28px] leading-[1.1] font-medium opacity-96">
            Реабилитация
          </h3>
          <p className="w-[350px] text-[14px] leading-[1.1] font-normal">
            Подберем программы и центры, где работают с&nbsp;причиной
            зависимости и помогают вернутся к&nbsp;полноценной жизни
          </p>
        </div>
        <PickLink>Подобрать реабилитацию</PickLink>
        <CenterCard />
      </article>
    </DesignFrame>
  );
}

function CenterCard() {
  return (
    <div className="absolute top-[132px] left-[153px] h-[197.04px] w-[173px] overflow-hidden rounded-[11.161px] bg-white shadow-[0px_1px_9.1px_3px_rgba(27,27,27,0.19)]">
      <div className="absolute top-[5.58px] left-[5.58px] h-[67.397px] w-[162.268px] overflow-hidden rounded-[7.298px]">
        <img
          src="/situations/center-photo.png"
          alt=""
          className="absolute top-[-7.58px] left-[0.42px] h-[108px] w-[162px] max-w-none object-cover"
        />
      </div>
      <div className="absolute top-[12.45px] left-[142.52px] size-[18.888px] overflow-hidden rounded-[9.444px] bg-white">
        <img
          src="/situations/heart.svg"
          alt=""
          className="absolute top-[4.72px] left-[4.72px]"
        />
      </div>
      <p className="absolute top-[80.7px] left-[10.73px] w-[137.37px] font-[family-name:var(--font-inter)] text-[9.015px] leading-[1.25] font-medium text-[#080909]">
        Центр «Рассвет»
      </p>
      <img
        src="/situations/pin.svg"
        alt=""
        className="absolute top-[82.85px] left-[155.4px] opacity-[0.08]"
      />
      <img
        src="/situations/map-pin.svg"
        alt=""
        className="absolute top-[94.44px] left-[10.73px]"
      />
      <p className="absolute top-[94.01px] left-[19.32px] w-[124.491px] font-[family-name:var(--font-inter)] text-[6.439px] leading-[1.25] font-normal text-[#080909]">
        Московская область
      </p>
      <div className="absolute top-[106.46px] left-[10.73px] flex gap-[2.146px] overflow-hidden">
        {["Стационар", "Программа 3–6 месяцев", "Работа с семьёй"].map(
          (label) => (
            <span
              key={label}
              className="rounded-[3.005px] bg-[#f2f2f1] px-[3.434px] py-[1.717px] font-[family-name:var(--font-inter)] text-[4.937px] leading-[1.3] font-normal whitespace-nowrap text-[#080909]"
            >
              {label}
            </span>
          ),
        )}
      </div>
      <Feature
        icon="/situations/users-round.svg"
        top="127.07px"
        textTop="127.5px"
        size="6.01px"
      >
        Небольшие группы до 20 человек
      </Feature>
      <Feature
        icon="/situations/shield-check.svg"
        top="140.37px"
        textTop="140.8px"
        size="6.01px"
      >
        Индивидуальная программа
      </Feature>
      <Feature
        icon="/situations/user-round.svg"
        top="154.11px"
        textTop="154.54px"
        size="5.795px"
      >
        Психологи, психиатры, семейные терапевты
      </Feature>
      <p className="absolute top-[174.72px] left-[10.73px] w-[122.345px] font-[family-name:var(--font-inter)] text-[9.015px] leading-[1.25] font-normal text-[#080909]">
        от 80 000 ₽ / месяц
      </p>
      <div className="absolute top-[170.42px] left-[142.52px] grid size-[19.318px] place-items-center overflow-hidden rounded-[9.873px] bg-[#efeeec]">
        <img src="/situations/arrow.svg" alt="" />
      </div>
    </div>
  );
}

function Feature({
  icon,
  top,
  textTop,
  size,
  children,
}: {
  icon: string;
  top: string;
  textTop: string;
  size: string;
  children: ReactNode;
}) {
  return (
    <>
      <img
        src={icon}
        alt=""
        className="absolute left-[10.73px]"
        style={{ top }}
      />
      <p
        className="absolute left-[27.04px] w-[137.37px] font-[family-name:var(--font-inter)] leading-[1.25] font-normal text-[#080909]"
        style={{ top: textTop, fontSize: size }}
      >
        {children}
      </p>
    </>
  );
}
