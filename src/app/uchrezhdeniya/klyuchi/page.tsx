import type { Metadata } from "next";
import { CenterFrame } from "@/components/center-frame";
import { CenterPage } from "@/components/center-page";
import { klyuchiCenter } from "@/content/centers/klyuchi";

export const metadata: Metadata = {
  title: "Реабилитационный центр в Троицке — Leo",
  description:
    "Загородный коттедж в Новой Москве, 20 минут от МКАД. Бассейн, банный комплекс, программы АН и ВДА, от 120 000 ₽ в месяц.",
};

export default function KlyuchiCenterPage() {
  return (
    <CenterFrame ctaTopic={klyuchiCenter.title}>
      <CenterPage center={klyuchiCenter} />
    </CenterFrame>
  );
}
