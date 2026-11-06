import type { Metadata } from "next";
import { CenterFrame } from "@/components/center-frame";
import { CenterPage } from "@/components/center-page";
import { klyuchiCenter } from "@/content/centers/klyuchi";

export const metadata: Metadata = {
  title: "Реабилитационный центр в Троицке — СвойЦентр",
  description:
    "Лицензированный загородный стационар в Троицке. Алкоголизм и наркомания, индивидуальное и общее размещение, от 120 000 ₽ / мес.",
};

export default function KlyuchiCenterPage() {
  return (
    <CenterFrame ctaTopic={klyuchiCenter.title}>
      <CenterPage center={klyuchiCenter} />
    </CenterFrame>
  );
}
