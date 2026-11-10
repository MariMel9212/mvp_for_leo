import type { Metadata } from "next";
import { CenterFrame } from "@/components/center-frame";
import { CenterPage } from "@/components/center-page";
import { vyhodEstCenter } from "@/content/centers/vyhod-est";

export const metadata: Metadata = {
  title: "Центр «Выход Есть» в Чехове — Leo",
  description:
    "Реабилитационный центр «Выход Есть» в Чехове: детоксикация и реабилитация при алкогольной и наркотической зависимости, круглосуточно.",
};

export default function VyhodEstPage() {
  return (
    <CenterFrame ctaTopic={vyhodEstCenter.title}>
      <CenterPage center={vyhodEstCenter} />
    </CenterFrame>
  );
}
