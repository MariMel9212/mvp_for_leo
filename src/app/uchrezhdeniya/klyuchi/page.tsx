import type { Metadata } from "next";
import { CenterFrame } from "@/components/center-frame";
import { CenterPage } from "@/components/center-page";
import { klyuchiCenter } from "@/content/centers/klyuchi";

export const metadata: Metadata = {
  title: "Реабилитационный центр в Москве — СвойЦентр",
  description:
    "Лицензированный загородный стационар в Москве. Алкоголизм и наркомания, палата на 4 человека, от 120 000 ₽ / мес.",
};

export default function KlyuchiCenterPage() {
  return (
    <CenterFrame>
      <CenterPage center={klyuchiCenter} />
    </CenterFrame>
  );
}
