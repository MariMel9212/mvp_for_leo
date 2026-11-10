import type { Metadata } from "next";
import { CenterFrame } from "@/components/center-frame";
import { CenterPage } from "@/components/center-page";
import { klyuchiCenter } from "@/content/centers/klyuchi";

export const metadata: Metadata = {
  title: "Реабилитационный центр «Ключи» — Leo",
  description:
    "Загородный центр «Ключи» в Подмосковье. Алкогольная, наркотическая и игровая зависимость, авторская программа, от 120 000 ₽ в месяц.",
};

export default function KlyuchiCenterPage() {
  return (
    <CenterFrame ctaTopic={klyuchiCenter.title}>
      <CenterPage center={klyuchiCenter} />
    </CenterFrame>
  );
}
