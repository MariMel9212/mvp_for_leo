import type { Metadata } from "next";
import { CenterFrame } from "@/components/center-frame";
import { CenterPage } from "@/components/center-page";
import { profmedCenter } from "@/content/centers/profmed";

export const metadata: Metadata = {
  title: "Детокс клиника в Химках — Leo",
  description:
    "Детоксикация в клинике в Химках: вывод из запоя и снятие ломки, стационар и выезд врача примерно за 30 минут. От 5 500 ₽.",
};

export default function ProfmedPage() {
  return (
    <CenterFrame ctaTopic={profmedCenter.title}>
      <CenterPage center={profmedCenter} />
    </CenterFrame>
  );
}
