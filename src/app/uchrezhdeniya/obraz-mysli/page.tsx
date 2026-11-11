import type { Metadata } from "next";
import { CenterFrame } from "@/components/center-frame";
import { CenterPage } from "@/components/center-page";
import { obrazMysliCenter } from "@/content/centers/obraz-mysli";

export const metadata: Metadata = {
  title: "Реабилитационно-образовательный центр — Leo",
  description:
    "Реабилитационно-образовательный центр «Образ Мысли» для подростков 14–17 лет в Троицке. Программа «Пифагора», проживание, 200 000 ₽.",
};

export default function ObrazMysliPage() {
  return (
    <CenterFrame ctaTopic={obrazMysliCenter.title}>
      <CenterPage center={obrazMysliCenter} />
    </CenterFrame>
  );
}
