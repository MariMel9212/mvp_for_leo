import type { Metadata } from "next";
import { Institutions } from "@/components/institutions";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Все учереждения — СвойЦентр",
  description: "Лицензированные учереждения: фильтр по типу, зависимости, программе и возрасту.",
};

export default function InstitutionsPage() {
  return (
    <main className="mx-auto w-[1440px] bg-[#fdfdfd] pb-[100px] text-black">
      <SiteHeader />
      <Institutions />
    </main>
  );
}
