import { Centers } from "@/components/centers";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { SiteHeader } from "@/components/site-header";
import { Stats } from "@/components/stats";

export default function HomePage() {
  return (
    <main className="overflow-x-clip bg-white text-black">
      <SiteHeader />
      <Hero />
      <Stats />
      <HowItWorks />
      <Centers />
    </main>
  );
}
