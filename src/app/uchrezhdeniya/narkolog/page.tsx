import type { Metadata } from "next";
import { CenterFrame } from "@/components/center-frame";
import { CenterPage } from "@/components/center-page";
import { narkologCenter } from "@/content/centers/narkolog";

export const metadata: Metadata = {
  title: "Реабилитационный центр в Чехове — Leo",
  description:
    "Реабилитационный центр в тихом городе Чехов. Химические и нехимические зависимости, 12 шагов, от 65 000 ₽ в месяц.",
};

export default function NarkologCenterPage() {
  return (
    <CenterFrame ctaTopic={narkologCenter.title}>
      <CenterPage center={narkologCenter} />
    </CenterFrame>
  );
}
