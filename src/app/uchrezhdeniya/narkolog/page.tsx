import type { Metadata } from "next";
import { CenterFrame } from "@/components/center-frame";
import { CenterPage } from "@/components/center-page";
import { narkologCenter } from "@/content/centers/narkolog";

export const metadata: Metadata = {
  title: "Реабилитационный центр в Чехове — СвойЦентр",
  description:
    "Стационар и выездная помощь в Чехове для взрослых и подростков. Алкоголизм и наркомания, от 450 000 ₽ / мес, анонимное обращение, круглосуточно.",
};

export default function NarkologCenterPage() {
  return (
    <CenterFrame ctaTopic={narkologCenter.title}>
      <CenterPage center={narkologCenter} />
    </CenterFrame>
  );
}
