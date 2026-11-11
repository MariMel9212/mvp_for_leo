import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { tie } from "@/lib/tie";

export const metadata: Metadata = {
  title: "Политика обработки персональных данных — Leo",
  description: "Оператор персональных данных сервиса Leo: MelniApps LLS",
};

export default function PrivacyPage() {
  return (
    <main className="bg-[#fdfdfd] text-[#27292d]">
      <SiteHeader />
      <article className="mx-auto w-full max-w-[720px] px-4 pt-12 pb-20 min-[1440px]:px-0 min-[1440px]:pt-16">
        <h1 className="text-40 font-medium max-md:text-28 md:max-[1439px]:text-[32px] md:max-[1439px]:leading-[40px]">
          Политика обработки персональных данных
        </h1>
        <div className="mt-8 flex flex-col gap-4 text-16">
          <p>{tie("Оператор персональных данных: MelniApps LLS")}</p>
          <p className="opacity-60">
            {tie("Сервис помогает выбрать учреждение и самостоятельно не оказывает медицинскую помощь.")}
          </p>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
