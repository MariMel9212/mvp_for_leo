import type { Metadata } from "next";
import { CenterFrame } from "@/components/center-frame";
import { CenterPage } from "@/components/center-page";
import { obrazMysliCenter } from "@/content/centers/obraz-mysli";

export const metadata: Metadata = {
  title: "Центр «Образ Мысли» — Leo",
  description:
    "Реабилитационно-образовательный центр «Образ Мысли» для подростков. Индивидуальная программа, учёба с куратором, работа с родителями. Консультация бесплатная.",
};

export default function ObrazMysliPage() {
  return (
    <CenterFrame ctaTopic={obrazMysliCenter.title}>
      <CenterPage center={obrazMysliCenter} />
    </CenterFrame>
  );
}
