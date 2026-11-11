import type { Metadata } from "next";
import { CenterFrame } from "@/components/center-frame";
import { CenterPage } from "@/components/center-page";
import { vyhodEstCenter } from "@/content/centers/vyhod-est";

export const metadata: Metadata = {
  title: "Реабилитационный центр в Чехове — Leo",
  description:
    "Реабилитационный центр в Чехове: программа 12 шагов, проживание, постлечебная поддержка. От 65 000 ₽.",
};

export default function VyhodEstPage() {
  return (
    <CenterFrame ctaTopic={vyhodEstCenter.title}>
      <CenterPage center={vyhodEstCenter} />
    </CenterFrame>
  );
}
