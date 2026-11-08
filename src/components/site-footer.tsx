import Link from "next/link";
import { CallRequestButton } from "@/components/call-request-modal";
import { asset } from "@/lib/base-path";
import { tie } from "@/lib/tie";

export function SiteFooter() {
  return (
    <footer className="w-full bg-[linear-gradient(180deg,#fdfdfd_27.44%,#d2def3_100%)] text-[#27292d] min-[1440px]:mt-[65px]">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="px-4 pt-10 min-[1440px]:px-[120px] min-[1440px]:pt-[38px]">
          <div className="flex max-w-[538px] flex-col items-start gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-[28px] leading-8 font-medium">
                {tie("Индивидуальный подбор реабилитационного учереждения")}
              </h2>
              <p className="text-16 opacity-60">{tie("Подберем лицензированное учереждение для работы с зависимостью")}</p>
            </div>
            <CallRequestButton
              label="Консультация"
              topic="Индивидуальный подбор реабилитационного учереждения"
              className="lime-control flex h-[38px] items-center justify-center rounded-[8px] px-5 text-16 shadow-[0_4px_2px_rgba(173,173,173,0.2)]"
            />
          </div>
        </div>
      </div>

      <div aria-hidden className="mt-10 h-px w-full bg-[rgba(39,41,45,0.12)] min-[1440px]:mt-[46px]" />

      <div className="mx-auto w-full max-w-[1440px]">
        <div className="px-4 pt-8 pb-8 min-[1440px]:px-[120px] min-[1440px]:pt-[71px] min-[1440px]:pb-[13px]">
          <div className="flex max-w-[314px] flex-col gap-2">
            <Link href="/" aria-label="Leo" className="w-fit">
              <img alt="" src={asset("/brand/leo.svg")} width={59} height={24} className="block h-6 w-auto" />
            </Link>
            <p className="text-13 leading-5 opacity-60">
              {tie("Сервис подбора проверенных реабилитационных центров для взрослых и подростков")}
            </p>
          </div>

          <p className="mt-10 max-w-[520px] text-[11px] leading-4 opacity-60 min-[1440px]:mt-[99px]">
            {tie("Сервис помогает выбрать учреждение и самостоятельно не оказывает медицинскую помощь")}
          </p>

          <div className="mt-6 flex flex-col gap-3 text-[11px] leading-4 opacity-60 min-[1440px]:mt-10 min-[1440px]:flex-row min-[1440px]:items-start min-[1440px]:justify-between">
            <p>{tie("Оператор персональных данных: ИП Мельничук Л. И.")}</p>
            <Link href="/politika" className="w-fit underline-offset-2 hover:underline">
              Политика обработки персональных данных
            </Link>
          </div>

          <p className="mt-6 text-[11px] leading-4 min-[1440px]:mt-10">© 2026 Leo. Все права защищены</p>
        </div>
      </div>
    </footer>
  );
}
