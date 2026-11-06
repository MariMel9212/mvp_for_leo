import type { Metadata } from "next";
import { CenterFrame } from "@/components/center-frame";
import { CenterPage } from "@/components/center-page";
import { narkologCenter } from "@/content/centers/narkolog";

export const metadata: Metadata = {
  title: "Реабилитационный центр в Москве — СвойЦентр",
  description:
    "Стационар и выездная помощь в Москве для взрослых и подростков. Алкоголизм и наркомания, анонимное обращение, круглосуточно.",
};

export default function NarkologCenterPage() {
  return (
    <CenterFrame ctaTopic={narkologCenter.title}>
      <CenterPage center={narkologCenter} />
    </CenterFrame>
  );
}
