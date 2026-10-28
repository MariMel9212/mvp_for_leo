import { Hero } from "@/components/hero";
import { HowSelection } from "@/components/how-selection";
import { Situation } from "@/components/situation";
import { SiteHeader } from "@/components/site-header";
import { Stats } from "@/components/stats";

export default function HomePage() {
  return (
    <main className="relative overflow-x-clip bg-[#fffffc] text-black">
      <SiteHeader />
      <Hero />
      <Stats />
      <Situation />
      <HowSelection />
    </main>
  );
}
