import type { CSSProperties } from "react";
import { asset } from "@/lib/base-path";
import { tie } from "@/lib/tie";

const appStore = "https://apps.apple.com/ru/app/leo-recovery/id6752736987";

function LeafMark({ style }: { style: CSSProperties }) {
  return (
    <svg viewBox="0 0 46.2608 45.1626" aria-hidden className="h-[45.163px] w-[46.261px] overflow-visible" style={style}>
      <path
        d="M40.9089 0.0598084C42.6209 -0.0188573 44.5517 -0.00989035 46.2608 0.0294018C40.9347 2.47693 39.0268 5.82825 36.8283 10.4694C32.091 20.4713 30.856 35.6206 16.5658 39.2233C13.2728 40.0536 10.0707 40.0217 6.68309 39.8428C9.90245 30.3397 15.9493 22.2494 24.0321 15.1927C25.5338 13.8812 27.1473 12.6876 28.7503 11.4666C27.1693 11.9061 25.1122 12.8542 23.6784 13.5526C23.1011 13.8443 22.5343 14.1518 21.9789 14.4745C11.4825 20.5987 4.93194 30.9026 1.97544 41.2718C1.61125 42.5467 1.34361 43.8715 1.05877 45.1626C-1.55964 33.7843 0.44605 19.7422 9.69407 10.8141C17.8534 2.93735 29.1288 0.730954 40.9089 0.0598084Z"
        fill="#8AA8E6"
        fillOpacity="0.4"
      />
    </svg>
  );
}

function GlassCard({
  title,
  text,
  className,
  rotate,
  leafClassName,
  leafStyle,
  clipLeaf = false,
  scale = 1,
}: {
  title: string;
  text: ReturnType<typeof tie>;
  className: string;
  rotate: number;
  leafClassName: string;
  leafStyle: CSSProperties;
  clipLeaf?: boolean;
  scale?: number;
}) {
  return (
    <div className={`absolute flex items-center justify-center max-[1439px]:origin-center max-[1439px]:scale-110 ${className}`}>
      <div className="relative h-[89.299px] w-[262px]" style={{ transform: `rotate(${rotate}deg) scale(${scale})` }}>
        <div className="absolute inset-0" style={{ filter: "drop-shadow(0 0 14px rgba(107,107,107,0.22))" }}>
          <div className="absolute inset-0 rounded-[20.219px] bg-white/70" />
        </div>
        <div
          className="absolute inset-0 rounded-[20.219px]"
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
            <LeafMark style={leafStyle} />
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

const storeButtonClass =
  "inline-flex h-[52px] items-center gap-2.5 rounded-[12px] border border-[#e6e7ea] bg-white px-3 text-[#27292d] shadow-[0_4px_12px_rgba(39,41,45,0.08)] transition duration-150 ease-out hover:-translate-y-0.5 hover:border-[#d5d7dc] hover:shadow-[0_8px_18px_rgba(39,41,45,0.12)] active:translate-y-0 active:shadow-[0_2px_6px_rgba(39,41,45,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#27292d] min-[1440px]:h-14 min-[1440px]:gap-3 min-[1440px]:px-5";

function StoreLabel({ kicker, name }: { kicker: string; name: string }) {
  return (
    <span className="flex flex-col items-start">
      <span className="text-[9px] leading-[11px] tracking-[0.06em] uppercase opacity-55 min-[1440px]:text-[10px] min-[1440px]:leading-[12px]">
        {kicker}
      </span>
      <span className="text-[16px] leading-[18px] font-medium min-[1440px]:text-[18px] min-[1440px]:leading-[20px]">{name}</span>
    </span>
  );
}

function GooglePlayIcon() {
  return (
    <svg width="18" height="20" viewBox="11.5 8.4 29.2 31.2" aria-hidden className="h-6 w-[22px] shrink-0 min-[1440px]:h-7 min-[1440px]:w-[26px]">
      <defs>
        <linearGradient id="play-blue" x1="26.1597" y1="10.4519" x2="6.02366" y2="30.5879" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00A0FF" />
          <stop offset="0.01" stopColor="#00A1FF" />
          <stop offset="0.26" stopColor="#00BEFF" />
          <stop offset="0.51" stopColor="#00D2FF" />
          <stop offset="0.76" stopColor="#00DFFF" />
          <stop offset="1" stopColor="#00E3FF" />
        </linearGradient>
        <linearGradient id="play-yellow" x1="40.6" y1="24" x2="11.57" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE000" />
          <stop offset="0.41" stopColor="#FFBD00" />
          <stop offset="0.78" stopColor="#FFA500" />
          <stop offset="1" stopColor="#FF9C00" />
        </linearGradient>
        <linearGradient id="play-red" x1="29.8" y1="26.76" x2="2.48" y2="54.06" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF3A44" />
          <stop offset="1" stopColor="#C31162" />
        </linearGradient>
        <linearGradient id="play-green" x1="8.76" y1="0.22" x2="20.95" y2="12.41" gradientUnits="userSpaceOnUse">
          <stop stopColor="#32A071" />
          <stop offset="0.48" stopColor="#15CF74" />
          <stop offset="1" stopColor="#00F076" />
        </linearGradient>
      </defs>
      <path d="M12.5277 9.04787C12.1322 9.51541 11.9305 10.1164 11.9637 10.7279V37.2719C11.9228 37.8843 12.1255 38.4881 12.5277 38.9519L12.6117 39.0479L27.4797 24.1799V23.8199L12.6117 8.96387L12.5277 9.04787Z" fill="url(#play-blue)" />
      <path d="M32.4 29.1353L27.48 24.1793V23.8193L32.4 18.8633L32.508 18.9353L38.4 22.2713C40.08 23.2193 40.08 24.7793 38.4 25.7393L32.532 29.0753L32.4 29.1353Z" fill="url(#play-yellow)" />
      <path d="M32.5438 29.064L27.4798 24L12.5278 38.952C12.8669 39.2538 13.3009 39.4275 13.7547 39.4428C14.2084 39.4582 14.6531 39.3142 15.0118 39.036L32.5438 29.064Z" fill="url(#play-red)" />
      <path d="M32.5438 18.9358L15.0118 8.97577C14.6555 8.69366 14.211 8.54624 13.7567 8.55941C13.3024 8.57257 12.8673 8.7455 12.5278 9.04777L27.4798 23.9998L32.5438 18.9358Z" fill="url(#play-green)" />
    </svg>
  );
}

function AppStoreIcon() {
  return (
    <svg width="16" height="20" viewBox="12 9 22 28" aria-hidden className="h-6 w-5 shrink-0 fill-current min-[1440px]:h-7 min-[1440px]:w-6">
      <path d="M30.08 23.8668C30.0935 22.8253 30.3709 21.8041 30.8865 20.8982C31.4021 19.9923 32.1391 19.2311 33.029 18.6856C32.4637 17.8805 31.7179 17.218 30.8509 16.7506C29.9839 16.2832 29.0196 16.0238 28.0345 15.9931C25.9331 15.7731 23.896 17.247 22.8251 17.247C21.7336 17.247 20.0849 16.0149 18.3095 16.0513C17.1612 16.0883 16.042 16.4213 15.0611 17.0179C14.0802 17.6145 13.2709 18.4542 12.7122 19.4554C10.2921 23.6338 12.0973 29.7746 14.4156 33.1522C15.5755 34.8061 16.9311 36.6535 18.7049 36.588C20.4406 36.5162 21.0889 35.4842 23.184 35.4842C25.2598 35.4842 25.868 36.588 27.6777 36.5463C29.5403 36.5162 30.7137 34.8851 31.833 33.2156C32.6664 32.0371 33.3077 30.7347 33.7331 29.3565C32.651 28.9001 31.7276 28.1362 31.078 27.16C30.4284 26.1837 30.0813 25.0384 30.08 23.8668Z" />
      <path d="M26.6618 13.7719C27.6773 12.5562 28.1776 10.9936 28.0565 9.41602C26.505 9.57851 25.0718 10.318 24.0426 11.487C23.5394 12.0581 23.1539 12.7225 22.9084 13.4423C22.6628 14.162 22.5619 14.9229 22.6114 15.6816C23.3874 15.6896 24.1551 15.5218 24.8567 15.191C25.5583 14.8602 26.1755 14.375 26.6618 13.7719Z" />
    </svg>
  );
}

export function FamilyAppSection() {
  return (
    <section className="relative mt-16 overflow-hidden bg-[#fdfdfd] px-4 pt-2 pb-10 max-md:mt-12 max-md:pt-0 max-md:pb-5 min-[1440px]:mt-[106px] min-[1440px]:h-[637px] min-[1440px]:px-0 min-[1440px]:pt-0 min-[1440px]:pb-2">
      <div className="min-[1440px]:absolute min-[1440px]:top-[14px] min-[1440px]:left-[120px] min-[1440px]:w-[496px]">
        <h2 className="text-40 font-medium max-md:text-28 md:max-[1439px]:text-[32px] md:max-[1439px]:leading-[40px]">
          {tie("Помогаем тем, кто рядом")}
        </h2>
        <p className="mt-6 max-w-[496px] text-16 text-[#737577] max-md:mt-3">
          {tie(
            "Приложение Leo помогает близким с зависимостью лучше понимать свои чувства, справляться с переживаниями и находить опору каждый день",
          )}
        </p>
      </div>

      <div
        role="img"
        aria-label="Экран приложения Leo: практики самопомощи и дневник эмоций"
        className="relative mx-auto mt-8 w-full max-w-[420px] [container-type:inline-size] max-md:mt-12 min-[1440px]:absolute min-[1440px]:top-[25px] min-[1440px]:left-[767px] min-[1440px]:mx-0 min-[1440px]:mt-0 min-[1440px]:w-[482.7px] min-[1440px]:max-w-none"
      >
        <div className="w-full" style={{ paddingBottom: `${(598 / 482.695) * 100}%` }} />
        <div className="absolute top-0 left-0 h-[598px] w-[482.695px] origin-top-left [transform:scale(calc(100cqw/482.695px))] max-[1439px]:[transform:translateX(calc(50cqw-220.36px*100cqw/482.695px))_scale(calc(100cqw/482.695px))]">
          <div className="absolute inset-0 overflow-hidden">
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
          </div>
          <GlassCard
            title="Практики самопомощи"
            text={tie("Осваивайте способы справляться со стрессом и тревогой")}
            className="top-[53.84px] left-0 h-[97.61px] w-[264.715px] max-md:top-[112px]"
            rotate={-1.83}
            clipLeaf
            leafClassName="top-[46.67px] left-[200.49px] h-[59.241px] w-[62.566px]"
            leafStyle={{ transform: "scaleY(-1) rotate(155.85deg) skewX(2.64deg)" }}
            scale={1.18}
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

      <div className="relative z-10 mt-2 flex flex-wrap justify-center gap-2 min-[1440px]:absolute min-[1440px]:top-[515px] min-[1440px]:left-[120px] min-[1440px]:mt-0 min-[1440px]:justify-start min-[1440px]:gap-[14px]">
        <a href={appStore} target="_blank" rel="noopener noreferrer" aria-label="Скачать в Google Play" className={storeButtonClass}>
          <GooglePlayIcon />
          <StoreLabel kicker="Скачать из" name="Google Play" />
        </a>
        <a href={appStore} target="_blank" rel="noopener noreferrer" aria-label="Загрузить в App Store" className={storeButtonClass}>
          <AppStoreIcon />
          <StoreLabel kicker="Загрузите в" name="App Store" />
        </a>
      </div>
    </section>
  );
}
