import { readFileSync } from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import { AudienceTabs } from "@/components/audience-tabs";
import { HeroField } from "@/components/hero-field";

const heroFieldBoot = readFileSync(
  path.join(process.cwd(), "src/hero-field-boot.js"),
  "utf8",
);

const stats = [
  { value: "3 000 +", label: "семей получили профильную помощь" },
  { value: "6 000 +", label: "зависимых прошедших лечение" },
  { value: "30 +", label: "лицензированных организаций" },
  { value: "86%", label: "удачно подобранных учереждений" },
];

const sections = ["Раздел", "Раздел", "Раздел"];

export default function HomePage() {
  return (
    <main className="mx-auto w-[1440px] bg-[#fdfdfd] text-black">
      <section className="relative h-[772px]">
        <div className="pointer-events-none absolute top-0 left-1/2 h-full w-screen -translate-x-1/2 overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #d2def3 0%, #d5e0f4 8%, #d9e3f5 15%, #dce5f5 23%, #dfe8f6 31%, #e2eaf7 38%, #e6ecf8 46%, #e9eff9 54%, #ecf1f9 62%, #f0f3fa 69%, #f3f6fb 77%, #f6f8fc 85%, #fafbfc 92%, #fdfdfd 100%)",
            }}
          />
          <HeroField />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-[122px]">
          <header className="flex w-full justify-center pt-[32px]">
            <div className="flex h-[44px] w-[1180px] items-center justify-between px-[16px]">
              <a href="#podbor" className="text-24 font-bold text-[#111] opacity-80">
                СвойЦентр
              </a>
              <nav aria-label="Разделы" className="flex items-center gap-[42px] opacity-80">
                <span aria-hidden className="block h-[24px] w-[55px]" />
                {sections.map((label, index) => (
                  <a key={index} href="#podbor" className="text-16 text-black">
                    {label}
                  </a>
                ))}
              </nav>
              <a
                href="#situacii"
                className="flex h-[44px] items-center justify-center rounded-[8px] bg-[#e1f300] px-[20px] text-16 text-black"
              >
                Выбрать центр
              </a>
            </div>
          </header>

          <div id="podbor" className="flex w-[754px] flex-col items-center gap-[42px]">
            <h1 className="w-full text-center text-48 font-medium">
              Проверенные ребцентра для&nbsp;лечения и восстановления при зависимостях
            </h1>
            <AudienceTabs />
            <a
              href="#situacii"
              className="flex h-[46px] w-[377px] items-center justify-center rounded-[8px] bg-[#e1f300] px-[20px] text-16 font-medium text-black"
            >
              Выбрать центр
            </a>
          </div>
        </div>
      </section>
      <script dangerouslySetInnerHTML={{ __html: heroFieldBoot }} />

      <section className="flex w-[1440px] items-start justify-between px-[120px]">
        {stats.map((item) => (
          <div key={item.value} className="flex w-[220px] flex-col items-center gap-[2px]">
            <p className="text-32 font-medium">{item.value}</p>
            <p className="w-[220px] text-center text-16 opacity-40">{item.label}</p>
          </div>
        ))}
      </section>

      <section id="situacii" className="mt-[120px] px-[120px] pb-[406px]">
        <div className="flex w-[1200px] flex-col gap-[51px]">
          <h2 className="text-40 font-medium">Подбираем помощь под ситуацию</h2>
          <div className="flex gap-[24px]">
            <SituationCard
              title="Детокс"
              text={
                <>
                  Клиники и стационары с медицинским наблюдение для&nbsp;безопасного
                  выхода из острого состояния
                </>
              }
              image="/desktop/detox.png"
              imageClassName="top-[-52px] left-[-213px] h-[575px] w-[966px]"
              imageWidth={966}
              imageHeight={575}
              action="Подобрать детокс"
            />
            <SituationCard
              title="Реабилитация"
              text="Программы и центры, где работают с причиной зависимости и помогают вернутся к полноценной жизни"
              image="/desktop/rehab.png"
              imageClassName="top-0 left-[-189px] h-[527px] w-[790px] object-cover"
              imageWidth={790}
              imageHeight={527}
              action="Подобрать реабилитацию"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function SituationCard({
  title,
  text,
  image,
  imageClassName,
  imageWidth,
  imageHeight,
  action,
}: {
  title: string;
  text: ReactNode;
  image: string;
  imageClassName: string;
  imageWidth: number;
  imageHeight: number;
  action: string;
}) {
  return (
    <article className="w-[588px] overflow-hidden rounded-[20px]">
      <div className="flex flex-col gap-[6px] bg-[#eef2f9] px-[32px] pt-[32px] pb-[10px]">
        <h3 className="text-32 font-medium text-[#0a0d14] opacity-[96%]">{title}</h3>
        <p className="w-[457px] text-16">{text}</p>
      </div>
      <div className="relative h-[443px] overflow-hidden">
        <img
          alt=""
          src={image}
          width={imageWidth}
          height={imageHeight}
          className={`absolute max-w-none ${imageClassName}`}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 h-[122px] w-[588px]"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #eef2f9 0%, rgba(238, 242, 249, 76%) 50%, rgba(238, 242, 249, 0%) 100%)",
          }}
        />
        <div className="absolute bottom-0 left-0 flex w-[588px] px-[32px] pb-[24px]">
          <a
            href="#situacii"
            className="flex h-[44px] items-center justify-center rounded-[8px] bg-[#e1f300] px-[20px] text-16 text-black shadow-[0_4px_4px_rgba(173,173,173,20%)]"
          >
            {action}
          </a>
        </div>
      </div>
    </article>
  );
}
