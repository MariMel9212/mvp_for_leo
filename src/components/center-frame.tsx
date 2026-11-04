import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";

export function CenterFrame({ children }: { children: ReactNode }) {
  return (
    <main className="relative mx-auto w-[1440px] bg-[#fdfdfd] text-[#27292d]">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 h-[356px] w-screen -translate-x-1/2 bg-[linear-gradient(180deg,#d3def3_0%,#fdfdfd_85.955%)]"
      />
      <div className="relative">
        <SiteHeader showCta={false} />
        {children}
      </div>
    </main>
  );
}
