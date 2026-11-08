import { asset } from "@/lib/base-path";
import { tie } from "@/lib/tie";

const appStore = "https://apps.apple.com/ru/app/leo-recovery/id6752736987";

const stores = [
  { src: "/app/google-play.svg", alt: "Скачать в Google Play", href: appStore, width: 162, height: 48 },
  { src: "/app/app-store.svg", alt: "Загрузить в App Store", href: appStore, width: 144, height: 48 },
];

export function FamilyAppSection() {
  return (
    <section className="relative mt-16 overflow-hidden bg-[#fdfdfd] px-4 pt-2 pb-2 min-[1440px]:mt-[106px] min-[1440px]:h-[637px] min-[1440px]:px-0 min-[1440px]:pt-0">
      <div className="min-[1440px]:absolute min-[1440px]:top-[14px] min-[1440px]:left-[120px] min-[1440px]:w-[496px]">
        <h2 className="text-40 font-medium max-[1439px]:text-[32px] max-[1439px]:leading-[40px]">
          {tie("Помогаем тем, кто рядом")}
        </h2>
        <p className="mt-6 max-w-[496px] text-16 opacity-60">
          {tie(
            "Приложение Leo помогает близким с зависимостью лучше понимать свои чувства, справляться с переживаниями и находить опору каждый день",
          )}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-[14px] min-[1440px]:absolute min-[1440px]:top-[515px] min-[1440px]:left-[120px] min-[1440px]:mt-0">
        {stores.map((store) => (
          <a
            key={store.src}
            href={store.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={store.alt}
            className="block h-12 w-auto rounded-[10px] transition duration-200 ease-out hover:-translate-y-px hover:shadow-[0_4px_14px_rgba(39,41,45,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#27292d] active:translate-y-0 active:shadow-none"
          >
            <img alt="" src={asset(store.src)} width={store.width} height={store.height} className="h-12 w-auto" />
          </a>
        ))}
      </div>

      <div
        role="img"
        aria-label="Экран приложения Leo: практики самопомощи и дневник эмоций"
        className="relative mx-auto mt-8 aspect-[483/598] w-full max-w-[420px] min-[1440px]:absolute min-[1440px]:top-[25px] min-[1440px]:left-[767px] min-[1440px]:mx-0 min-[1440px]:mt-0 min-[1440px]:h-[598px] min-[1440px]:w-[483px] min-[1440px]:max-w-none"
      >
        <img
          alt=""
          src={asset("/app/phone.webp")}
          width={1371}
          height={2519}
          className="absolute top-0 left-[13.87%] w-[63.35%] max-w-none"
        />
        <img
          alt=""
          src={asset("/app/card-practices.svg")}
          width={321}
          height={153}
          className="absolute top-[4.35%] -left-[5.6%] w-[66.46%] max-w-none"
        />
        <img
          alt=""
          src={asset("/app/card-diary.svg")}
          width={320}
          height={153}
          className="absolute top-[56.67%] left-[40.12%] w-[66.25%] max-w-none"
        />
      </div>
    </section>
  );
}
