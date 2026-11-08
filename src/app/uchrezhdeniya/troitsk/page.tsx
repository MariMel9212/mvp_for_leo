import type { Metadata } from "next";
import { CenterFrame } from "@/components/center-frame";
import { CenterPage } from "@/components/center-page";
import { troitskCenter } from "@/content/centers/troitsk";

export const metadata: Metadata = {
  title: "Реабилитационно-образовательный центр в Троицке — Leo",
  description:
    "Реабилитационно-образовательный центр в Троицке для подростков 14–17 лет. Программа «Пифагор», проживание, 200 000 ₽ / мес.",
};

export default function TroitskCenterPage() {
  return (
    <CenterFrame ctaTopic="Реабилитационно-образовательный центр в Троицке">
      <CenterPage center={troitskCenter} />
    </CenterFrame>
  );
}
