import type { Metadata } from "next";
import { CenterFrame } from "@/components/center-frame";
import { CenterPage } from "@/components/center-page";
import { himkiCenter } from "@/content/centers/himki";

export const metadata: Metadata = {
  title: "Реабилитационный центр в Химках — СвойЦентр",
  description: "Реабилитационный центр в Химках: программа с проживанием, курс от 3 до 12 месяцев.",
};

export default function HimkiCenterPage() {
  return (
    <CenterFrame>
      <CenterPage center={himkiCenter} />
    </CenterFrame>
  );
}
