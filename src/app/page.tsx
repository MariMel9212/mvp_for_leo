import { Hero } from "@/components/hero";
import { HowWeMatch } from "@/components/how-we-match";
import { SiteHeader } from "@/components/site-header";
import { Stats } from "@/components/stats";
import { WhenToSeek } from "@/components/when-to-seek";

export default function HomePage() {
  return (
    <main className="bg-white text-[#141414]">
      <SiteHeader />
      <Hero />
      <Stats />
      <WhenToSeek />
      <HowWeMatch />
    </main>
  );
}
