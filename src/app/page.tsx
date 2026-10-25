import { Hero } from "@/components/hero";
import { HowWeMatch } from "@/components/how-we-match";
import { SiteHeader } from "@/components/site-header";
import { Stats } from "@/components/stats";
import { WhenToSeek } from "@/components/when-to-seek";

export default function HomePage() {
  return (
    <main className="mx-auto w-full bg-white pb-16 min-[1280px]:w-[1280px] min-[1280px]:pb-[120px]">
      <SiteHeader />
      <Hero />
      <Stats />
      <WhenToSeek />
      <HowWeMatch />
    </main>
  );
}
