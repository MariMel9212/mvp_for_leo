import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { SiteHeader } from "@/components/site-header";
import { Stats } from "@/components/stats";

export default function HomePage() {
  return (
    <main className="bg-white text-black">
      <SiteHeader />
      <Hero />
      <Stats />
      <HowItWorks />
    </main>
  );
}
