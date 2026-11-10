import { readFileSync } from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import { AudienceTabs } from "@/components/audience-tabs";
import { HeroField } from "@/components/hero-field";
import { ConsultForm } from "@/components/consult-form";
import { LicensedCenters } from "@/components/licensed-centers";
import { RecoverySteps } from "@/components/recovery-steps";
import { CallRequestButton } from "@/components/call-request-modal";
import { FaqSection } from "@/components/faq-section";
import { FamilyAppSection } from "@/components/family-app";
import { SelectionCriteria } from "@/components/selection-criteria";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SupportStages } from "@/components/support-stages";
import { asset } from "@/lib/base-path";
import { tie } from "@/lib/tie";

const stats: { value: string; label: string; desktopLines?: [string, string] }[] = [
  { value: "3 000 +", label: "семей получили профильную помощь" },
  { value: "6 000 +", label: "зависимых прошедших лечение" },
  { value: "24/7", label: "на связи в сложной ситуации", desktopLines: ["на связи", "в сложной ситуации"] },
  { value: "86%", label: "удачно подобранных учреждений" },
];

export default function HomePage() {
  // Read on each render so the dev server picks up edits to the boot script.
  const heroFieldBoot = readFileSync(path.join(process.cwd(), "src/hero-field-boot.js"), "utf8");

  return (
    <>
    <main className="mx-auto w-full max-w-[1440px] bg-[#fdfdfd] text-[#27292d]">
      <section className="relative flex flex-col bg-[#d2def3] max-[1439px]:-mt-[env(safe-area-inset-top,0px)] max-[1439px]:pt-[env(safe-area-inset-top,0px)] min-[1440px]:block min-[1440px]:h-[772px] min-[1440px]:bg-transparent">
        <div className="relative z-20 min-[1440px]:absolute min-[1440px]:inset-x-0 min-[1440px]:top-0">
          <SiteHeader revealCta />
        </div>

        <div className="relative w-full max-[1439px]:h-[max(700px,calc(100dvh-8.5rem))] min-[1440px]:absolute min-[1440px]:inset-0">
          <div className="pointer-events-none absolute inset-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, #d2def3 0%, #d5e0f4 7.7%, #d9e3f5 15.4%, #dce5f5 23.1%, #dfe8f6 30.8%, #e2eaf7 38.5%, #e6ecf8 46.1%, #e9eff9 53.9%, #ecf1f9 61.5%, #f0f3fa 69.2%, #f3f6fb 76.9%, #f6f8fa 84.6%, #fdfdfd 92.3%, #fdfdfd 100%)",
              }}
            />
            <HeroField />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-[#fdfdfd] min-[1440px]:hidden" />
          </div>

          <div className="relative z-10 flex h-full w-full items-center justify-center px-4 max-[1439px]:py-8 min-[1440px]:items-start min-[1440px]:px-0 min-[1440px]:pt-[198px]">
            <div id="podbor" className="flex w-full max-w-[34rem] flex-col items-center gap-8 min-[1440px]:max-w-[754px] min-[1440px]:gap-[42px]">
              <h1 className="w-full text-center text-48 font-medium max-[1439px]:text-[32px] max-[1439px]:leading-[38px] max-md:text-[30px] max-md:leading-[36px] max-md:tracking-[-0.02em]">
                {tie("Проверенные ребцентра для восстановления при зависимостях")}
              </h1>
              <AudienceTabs />
              <a
                id="hero-cta"
                href="#situacii"
                className="lime-control flex h-[56px] w-full max-w-[377px] items-center justify-center rounded-[12px] px-[20px] text-18 leading-[24px] font-medium"
              >
                Подобрать центр
              </a>
            </div>
          </div>
        </div>
      </section>
      <script dangerouslySetInnerHTML={{ __html: heroFieldBoot }} />

      <section className="grid grid-cols-2 gap-6 px-[120px] max-[1439px]:px-4 min-[1440px]:flex min-[1440px]:justify-between">
        {stats.map((item) => (
          <div key={item.value} className="flex w-full flex-col items-center gap-[2px] min-[1440px]:w-[220px]">
            <p className="text-32 font-medium">{item.value}</p>
            <p className="w-full text-center text-16 text-[#737577] min-[1440px]:w-[220px]">
              {item.desktopLines ? (
                <>
                  {tie(item.desktopLines[0])}
                  <br className="hidden min-[1440px]:inline" />
                  <span className="min-[1440px]:hidden"> </span>
                  {tie(item.desktopLines[1])}
                </>
              ) : (
                tie(item.label)
              )}
            </p>
          </div>
        ))}
      </section>

      <section id="situacii" className="mt-12 px-[120px] max-[1439px]:px-4 min-[1440px]:mt-[160px]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 min-[1440px]:gap-[52px]">
          <h2 className="text-40 font-medium max-md:text-28 md:max-[1439px]:text-[32px] md:max-[1439px]:leading-[40px]">{tie("Помощь с учётом вашей ситуации")}</h2>
          <div className="flex flex-col gap-6 min-[1440px]:flex-row min-[1440px]:gap-[24px]">
            <SituationCard
              title="Детокс"
              text={tie("Клиники и стационары с медицинским наблюдение для безопасного выхода из острого состояния")}
              image="/desktop/detox.webp"
              imageClassName="top-[-42px] left-[-254px] h-[621px] w-[1043px]"
              imageWidth={966}
              imageHeight={575}
              focus="52% 76%"
              frameScale="scale-[1.4]"
              action="Подобрать детокс"
            />
            <SituationCard
              title="Реабилитация"
              text={tie("Программы и центры, где работают с причиной зависимости и помогают вернутся к полноценной жизни")}
              image="/desktop/rehab.webp"
              imageClassName="top-0 left-[-189px] h-[527px] w-[790px] object-cover"
              imageWidth={790}
              imageHeight={527}
              focus="68% 36%"
              frameScale="scale-[1.24]"
              action="Подобрать реабилитацию"
            />
          </div>
        </div>
      </section>

      <RecoverySteps />
      <LicensedCenters />
      <ConsultForm />
      <SelectionCriteria />
      <SupportStages />
      <FamilyAppSection />
      <FaqSection />
    </main>
    <SiteFooter />
    </>
  );
}

function SituationCard({
  title,
  text,
  image,
  imageClassName,
  imageWidth,
  imageHeight,
  focus,
  frameScale = "scale-[1.18]",
  action,
}: {
  title: string;
  text: ReactNode;
  image: string;
  imageClassName: string;
  imageWidth: number;
  imageHeight: number;
  focus: string;
  frameScale?: string;
  action: string;
}) {
  return (
    <article className="w-full overflow-hidden rounded-[20px] min-[1440px]:w-[588px]">
      <div className="flex flex-col gap-[6px] bg-[#eef2f9] px-6 pt-5 pb-[10px] md:pt-8 min-[1440px]:px-[32px]">
        <h3 className="text-32 font-medium max-md:text-24">{title}</h3>
        <p className="w-full max-w-[457px] text-16">{text}</p>
      </div>
      <div className="relative h-[320px] overflow-hidden min-[1440px]:h-[443px]">
        <img
          alt=""
          src={asset(image)}
          width={imageWidth}
          height={imageHeight}
          className={`absolute inset-0 h-full w-full origin-center object-cover min-[1440px]:hidden ${frameScale}`}
          style={{ objectPosition: focus, transformOrigin: focus }}
        />
        <img
          alt=""
          src={asset(image)}
          width={imageWidth}
          height={imageHeight}
          className={`absolute hidden max-w-none min-[1440px]:block ${imageClassName}`}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 h-[122px] w-full"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #eef2f9 0%, rgba(238, 242, 249, 76%) 50%, rgba(238, 242, 249, 0%) 100%)",
          }}
        />
        <div className="absolute bottom-0 left-0 flex w-full px-6 pb-[24px] min-[1440px]:px-[32px]">
          <CallRequestButton label={action} topic={title} />
        </div>
      </div>
    </article>
  );
}
