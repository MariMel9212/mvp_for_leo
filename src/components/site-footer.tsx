import Link from "next/link";
import { CallRequestButton } from "@/components/call-request-modal";
import { asset } from "@/lib/base-path";
import { tie } from "@/lib/tie";

const topic = "Индивидуальный подбор реабилитационного учереждения";

function ConsultButton() {
  return (
    <CallRequestButton
      label="Консультация"
      topic={topic}
      className="lime-control flex h-[38px] items-center justify-center rounded-[8px] px-[20px] text-16 shadow-[0_4px_2px_rgba(173,173,173,0.2)]"
    />
  );
}

function Brand() {
  return (
    <Link href="/" aria-label="Leo" className="block h-6 w-[59px]">
      <img alt="" src={asset("/brand/leo.svg")} width={59} height={24} className="block h-6 w-auto" />
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative w-full bg-[linear-gradient(180deg,#fdfdfd_27.44%,#d2def3_100%)] text-[#27292d] min-[1440px]:mt-[65px]">
      <div className="px-4 pt-10 min-[1440px]:hidden">
        <div className="flex max-w-[538px] flex-col items-start gap-5">
          <div className="flex flex-col gap-3">
            <h2 className="text-[28px] leading-8 font-medium">{tie(topic)}</h2>
            <p className="text-16 opacity-60">{tie("Подберем лицензированное учереждение для работы с зависимостью")}</p>
          </div>
          <ConsultButton />
        </div>
      </div>

      <div aria-hidden className="mt-10 h-px w-full bg-black/4 min-[1440px]:absolute min-[1440px]:top-[242px] min-[1440px]:mt-0" />

      <div className="px-4 pt-8 pb-8 min-[1440px]:hidden">
        <div className="flex max-w-[314px] flex-col gap-2">
          <Brand />
          <p className="text-13 leading-5 opacity-60">
            {tie("Сервис подбора проверенных реабилитационных центров для взрослых и подростков")}
          </p>
        </div>
        <p className="mt-10 max-w-[520px] text-11 opacity-60">
          {tie("Сервис помогает выбрать учреждение и самостоятельно не оказывает медицинскую помощь")}
        </p>
        <div className="mt-6 flex flex-col gap-3 text-11 opacity-60">
          <p>{tie("Оператор персональных данных: ИП Мельничук Л. И.")}</p>
          <Link href="/politika" className="w-fit underline-offset-2 hover:underline">
            Политика обработки персональных данных
          </Link>
        </div>
        <p className="mt-6 text-11">© 2026 Leo. Все права защищены</p>
      </div>

      <div className="relative mx-auto hidden h-[625px] w-full max-w-[1440px] min-[1440px]:block">
        <div className="absolute top-[38px] left-[120px] flex w-[538px] flex-col items-start gap-[20px]">
          <div className="flex w-full flex-col gap-[12px]">
            <h2 className="text-[28px] leading-[32px] font-medium">{tie(topic)}</h2>
            <p className="text-16 opacity-60">{tie("Подберем лицензированное учереждение для работы с зависимостью")}</p>
          </div>
          <ConsultButton />
        </div>

        <div className="absolute top-[313px] left-[120px] flex w-[314px] flex-col gap-[8px]">
          <Brand />
          <p className="text-13 leading-5 opacity-60">
            {tie("Сервис подбора проверенных реабилитационных центров для взрослых и подростков")}
          </p>
        </div>

        <p className="absolute top-[484px] left-[120px] text-11 whitespace-nowrap opacity-60">
          {tie("Сервис помогает выбрать учреждение и самостоятельно не оказывает медицинскую помощь")}
        </p>
        <p className="absolute top-[540px] left-[120px] text-11 whitespace-nowrap opacity-60">
          {tie("Оператор персональных данных: ИП Мельничук Л. И.")}
        </p>
        <Link
          href="/politika"
          className="absolute top-[540px] left-[925px] text-11 whitespace-nowrap opacity-60 underline-offset-2 hover:underline"
        >
          Политика обработки персональных данных
        </Link>
        <p className="absolute top-[596px] left-[120px] text-11 whitespace-nowrap">© 2026 Leo. Все права защищены</p>
      </div>
    </footer>
  );
}
