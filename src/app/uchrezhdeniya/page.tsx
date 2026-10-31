import type { Metadata } from "next";
import { Institutions } from "@/components/institutions";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Все учереждения — СвойЦентр",
  description: "Лицензированные учереждения: фильтр по типу, зависимости, программе и возрасту.",
};

export default function InstitutionsPage() {
  return (
    <main className="relative mx-auto w-[1440px] bg-[#fdfdfd] pb-[100px] text-black">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 h-[356px] w-[1440px] bg-[linear-gradient(180deg,#d3def3_0%,#fdfdfd_85.955%)]"
      />
      <div className="relative">
        <SiteHeader />
        <Institutions />
      </div>
    </main>
  );
}
