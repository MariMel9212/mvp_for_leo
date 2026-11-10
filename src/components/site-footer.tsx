import Link from "next/link";
import { CallRequestButton } from "@/components/call-request-modal";
import { asset } from "@/lib/base-path";
import { tie } from "@/lib/tie";

const topic = "Индивидуальный подбор реабилитационного учреждения";

const sections = [
  { label: "Помощь по ситуации", href: "/#situacii" },
  { label: "Шаги выздоровления", href: "/#shagi" },
  { label: "Центры", href: "/uchrezhdeniya" },
  { label: "Про подбор", href: "/#pro-podbor" },
  { label: "Контакты", href: "/#zayavka" },
];

function ConsultButton() {
  return (
    <CallRequestButton
      label="Консультация"
      topic={topic}
      className="lime-control flex h-[38px] items-center justify-center rounded-[8px] px-[20px] text-16"
    />
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[linear-gradient(180deg,#fdfdfd_0%,#d2def3_100%)] text-[#27292d] min-[1440px]:mt-[80px]">
      <div className="mx-auto w-full max-w-[1440px] px-4 pt-12 min-[1440px]:px-[120px] min-[1440px]:pt-16">
        <div className="flex max-w-[538px] flex-col items-start gap-5">
          <div className="flex flex-col gap-3">
            <h2 className="text-[28px] leading-8 font-medium">{tie(topic)}</h2>
            <p className="text-16 text-[#5e6062]">{tie("Подберем лицензированное учреждение для работы с зависимостью")}</p>
          </div>
          <ConsultButton />
        </div>
      </div>

      <div className="mt-10 h-px w-full bg-black/8" />

      <div className="mx-auto mt-8 w-full max-w-[1440px] px-4 min-[1440px]:px-[120px]">
        <div className="flex flex-col gap-8 min-[800px]:flex-row min-[800px]:items-start min-[800px]:justify-between">
          <div className="flex max-w-[360px] flex-col gap-3">
            <Link href="/" aria-label="Leo" className="block h-6 w-fit">
              <img alt="" src={asset("/brand/leo.svg")} width={59} height={24} className="block h-6 w-auto" />
            </Link>
            <p className="text-13 leading-5 text-[#5e6062]">
              {tie("Сервис подбора проверенных реабилитационных центров для взрослых и подростков")}
            </p>
          </div>
          <nav aria-label="Навигация" className="flex flex-col gap-3">
            <p className="text-13 font-medium text-[#5e6062]">Навигация</p>
            <ul className="flex flex-col gap-2">
              {sections.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-16 opacity-80 transition-opacity hover:opacity-100">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="mt-10 h-px w-full bg-black/8" />

      <div className="mx-auto mt-6 w-full max-w-[1440px] px-4 pb-8 min-[1440px]:px-[120px] min-[1440px]:pb-10">
        <div className="flex flex-col gap-4 text-11 leading-4 text-[#5e6062]">
          <div className="flex flex-col gap-3 min-[800px]:flex-row min-[800px]:items-start min-[800px]:justify-between min-[800px]:gap-8">
            <p className="max-w-[720px]">{tie("Сервис помогает выбрать учреждение и самостоятельно не оказывает медицинскую помощь")}</p>
            <div className="flex flex-col gap-2 min-[800px]:items-end min-[800px]:text-right">
              <p>{tie("Оператор персональных данных: ИП Мельничук Л. И.")}</p>
              <Link href="/politika" className="w-fit underline-offset-2 hover:underline">
                Политика обработки персональных данных
              </Link>
            </div>
          </div>
          <p className="text-[#27292d]">© 2026 Leo. Все права защищены</p>
        </div>
      </div>
    </footer>
  );
}
