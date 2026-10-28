import { Centers } from "@/components/centers";
import { Hero } from "@/components/hero";
import { Situation } from "@/components/situation";
import { SiteHeader } from "@/components/site-header";
import { Stats } from "@/components/stats";

export default function HomePage() {
  return (
    <main className="relative overflow-x-clip bg-white text-black">
      <SiteHeader />
      <Hero />
      <Stats />
      <Situation />
      <Centers />
    </main>
  );
}
