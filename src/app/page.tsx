import { readFileSync } from "node:fs";
import path from "node:path";
import { Centers } from "@/components/centers";
import { Hero } from "@/components/hero";
import { HowSelection } from "@/components/how-selection";
import { Situation } from "@/components/situation";
import { SiteHeader } from "@/components/site-header";
import { Stats } from "@/components/stats";

// Inlined after the hero so the field is drawn before the first paint.
const heroFieldBoot = readFileSync(
  path.join(process.cwd(), "src/hero-field-boot.js"),
  "utf8",
);

export default function HomePage() {
  return (
    <main className="relative overflow-x-clip bg-[#fdfdfd] text-black">
      <SiteHeader />
      <Hero />
      <script dangerouslySetInnerHTML={{ __html: heroFieldBoot }} />
      <Stats />
      <Situation />
      <HowSelection />
      <Centers />
    </main>
  );
}
