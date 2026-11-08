import type { CSSProperties } from "react";
import { asset } from "@/lib/base-path";
import { tie } from "@/lib/tie";

const appStore = "https://apps.apple.com/ru/app/leo-recovery/id6752736987";

function GlassCard({
  title,
  text,
  className,
  rotate,
  leafClassName,
  leafStyle,
  clipLeaf = false,
}: {
  title: string;
  text: ReturnType<typeof tie>;
  className: string;
  rotate: number;
  leafClassName: string;
  leafStyle: CSSProperties;
  clipLeaf?: boolean;
}) {
  return (
    <div className={`absolute flex items-center justify-center ${className}`}>
      <div className="relative h-[89.299px] w-[262px]" style={{ transform: `rotate(${rotate}deg)` }}>
        <div
          className="absolute inset-0 rounded-[20.219px] shadow-[0_0_28px_rgba(107,107,107,0.11)]"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.58)",
            backdropFilter: "blur(18px) saturate(1.35)",
            WebkitBackdropFilter: "blur(18px) saturate(1.35)",
          }}
        />
        <div
          className="absolute inset-0 rounded-[20.219px]"
          style={clipLeaf ? { clipPath: "inset(0 round 20.219px)" } : undefined}
        >
          <span className={`pointer-events-none absolute flex items-center justify-center ${leafClassName}`}>
            <img alt="" src={asset("/app/leaf.svg")} width={46} height={45} className="h-[45.163px] w-[46.261px] max-w-none" style={leafStyle} />
          </span>
          <div className="absolute top-[13.48px] left-[11.79px] flex w-[186.18px] flex-col gap-[5.055px]">
            <p className="text-[13.479px] leading-[20.219px] font-medium text-black">{title}</p>
            <p className="text-[10.952px] leading-[16.849px] text-[#27292d]">{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const stores = [
  { src: "/app/google-play.svg", alt: "Скачать в Google Play", href: appStore, width: 162, height: 48 },
  { src: "/app/app-store.svg", alt: "Загрузить в App Store", href: appStore, width: 144, height: 48 },
];

export function FamilyAppSection() {
  return (
    <section className="relative mt-16 overflow-hidden bg-[#fdfdfd] px-4 pt-2 pb-10 min-[1440px]:mt-[106px] min-[1440px]:h-[637px] min-[1440px]:px-0 min-[1440px]:pt-0 min-[1440px]:pb-2">
      <div className="min-[1440px]:absolute min-[1440px]:top-[14px] min-[1440px]:left-[120px] min-[1440px]:w-[496px]">
        <h2 className="text-40 font-medium max-md:text-28 md:max-[1439px]:text-[32px] md:max-[1439px]:leading-[40px]">
          {tie("Помогаем тем, кто рядом")}
        </h2>
        <p className="mt-6 max-w-[496px] text-16 opacity-60">
          {tie(
            "Приложение Leo помогает близким с зависимостью лучше понимать свои чувства, справляться с переживаниями и находить опору каждый день",
          )}
        </p>
      </div>

      <div
        role="img"
        aria-label="Экран приложения Leo: практики самопомощи и дневник эмоций"
        className="relative mx-auto mt-8 w-full max-w-[420px] [container-type:inline-size] min-[1440px]:absolute min-[1440px]:top-[25px] min-[1440px]:left-[767px] min-[1440px]:mx-0 min-[1440px]:mt-0 min-[1440px]:w-[482.7px] min-[1440px]:max-w-none"
      >
        <div className="w-full" style={{ paddingBottom: `${(598 / 482.695) * 100}%` }} />
        <div className="absolute top-0 left-0 h-[598px] w-[482.695px] origin-top-left overflow-hidden [transform:scale(calc(100cqw/482.695px))] max-[1439px]:[transform:translateX(calc(50cqw-220.36px*100cqw/482.695px))_scale(calc(100cqw/482.695px))]">
          <div className="absolute top-0 left-[67.36px] h-[665.284px] w-[306px]">
            <div
              className="absolute overflow-hidden rounded-[24px] bg-white"
              style={{ left: "4.043%", top: "1.588%", width: "91.914%", height: "96.787%" }}
            >
              <img
                alt=""
                src={asset("/app/screen.webp")}
                width={1290}
                height={2796}
                className="absolute inset-0 h-full w-full max-w-none object-cover"
              />
              <img
                alt=""
                src={asset("/app/screen-wave.svg")}
                width={306}
                height={32}
                className="absolute top-0 left-0 w-full max-w-none"
                style={{ height: `${(32 / 662) * 100}%` }}
              />
            </div>
            <img
              alt=""
              src={asset("/app/frame.png")}
              width={1311}
              height={2708}
              className="pointer-events-none absolute top-0 left-0 h-full w-full max-w-none"
            />
          </div>
          <div
            aria-hidden
            className="absolute top-[452px] left-[0.36px] h-[234px] w-[429px]"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(253, 253, 253, 0) 18.59%, #fdfdfd 43.013%), linear-gradient(180deg, rgba(253, 253, 253, 0) 5.033%, #fdfdfd 36.877%)",
            }}
          />
          <GlassCard
            title="Практики самопомощи"
            text={tie("Осваивайте способы справляться со стрессом и тревогой")}
            className="top-[53.84px] left-0 h-[97.61px] w-[264.715px]"
            rotate={-1.83}
            clipLeaf
            leafClassName="top-[46.67px] left-[200.49px] h-[59.241px] w-[62.566px]"
            leafStyle={{ transform: "scaleY(-1) rotate(155.85deg) skewX(2.64deg)" }}
          />
          <GlassCard
            title="Дневник эмоций"
            text={tie("Записывайте свои переживания и улучшайте анализ чувств")}
            className="top-[334.91px] left-[198.02px] h-[97.485px] w-[264.676px]"
            rotate={1.8}
            clipLeaf
            leafClassName="top-[49.39px] left-[196.48px] h-[57.751px] w-[61.099px]"
            leafStyle={{ transform: "rotate(20.55deg) skewX(-2.64deg)" }}
          />
        </div>
      </div>

      <div className="relative z-10 mt-2 flex flex-wrap justify-center gap-3 min-[1440px]:absolute min-[1440px]:top-[515px] min-[1440px]:left-[120px] min-[1440px]:mt-0 min-[1440px]:justify-start min-[1440px]:gap-[14px]">
        {stores.map((store) => (
          <a
            key={store.src}
            href={store.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={store.alt}
            className="block h-11 w-auto rounded-[10px] transition duration-200 ease-out hover:-translate-y-px hover:shadow-[0_4px_14px_rgba(39,41,45,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#27292d] active:translate-y-0 active:shadow-none min-[1440px]:h-12"
          >
            <img alt="" src={asset(store.src)} width={store.width} height={store.height} className="h-11 w-auto min-[1440px]:h-12" />
          </a>
        ))}
      </div>
    </section>
  );
}
