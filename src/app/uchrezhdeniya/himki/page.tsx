import type { Metadata } from "next";
import { CenterDetail } from "@/components/center-detail";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Реабилитационный центр в Химках — СвойЦентр",
  description: "Реабилитационный центр в Химках: программа с проживанием, курс от 3 до 12 месяцев.",
};

export default function HimkiCenterPage() {
  return (
    <main className="relative mx-auto w-[1440px] bg-[#fdfdfd] text-[#27292d]">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 h-[356px] w-screen -translate-x-1/2 bg-[linear-gradient(180deg,#d3def3_0%,#fdfdfd_85.955%)]"
      />
      <div className="relative">
        <SiteHeader showCta={false} />
        <CenterDetail />
      </div>
    </main>
  );
}
