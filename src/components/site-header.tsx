"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinkClass =
  "text-sm leading-5 font-normal tracking-[-0.08px] text-[#1f1f1f] transition-opacity hover:opacity-70 min-[1280px]:text-base min-[1280px]:leading-6 min-[1280px]:tracking-[-0.16px]";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-20 flex min-h-[50px] items-center bg-white min-[1200px]:min-h-[80px]">
      <div className="mx-auto flex w-full min-w-[320px] items-center px-[15px] min-[1200px]:max-w-[1140px]">
        <a
          href="#podbor"
          className="text-[20px] leading-none font-medium tracking-[-0.16px] text-[#141414] min-[1200px]:text-[22px]"
        >
          Leo
        </a>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 min-[1024px]:block"
          aria-label="Основная навигация"
        >
          <a id="dlya-biznesa" href="#dlya-biznesa" className={navLinkClass}>
            Для бизнеса
          </a>
        </nav>

        <div className="ml-auto flex items-center">
          <Button
            variant="brand"
            size="header"
            nativeButton={false}
            render={<a href="#podbor" />}
            className="max-[767px]:mr-[30px] min-[1024px]:ml-[30px]"
          >
            Выбрать ребцентр
          </Button>
          <button
            type="button"
            className="relative h-4 w-6 shrink-0 min-[1024px]:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Закрыть меню" : "Меню"}
            onClick={() => setOpen((value) => !value)}
          >
            <span
              className={cn(
                "absolute inset-x-0 h-0.5 bg-[#141414] transition-transform",
                open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0",
              )}
            />
            <span
              className={cn(
                "absolute top-1/2 inset-x-0 h-0.5 -translate-y-1/2 bg-[#141414] transition-opacity",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "absolute inset-x-0 h-0.5 bg-[#141414] transition-transform",
                open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0",
              )}
            />
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={cn(
          "absolute inset-x-0 top-full border-t border-[#dae0e5] bg-white px-[15px] py-2 min-[1024px]:hidden",
          !open && "hidden",
        )}
      >
        <a
          href="#dlya-biznesa"
          className="block py-3 text-base leading-6 text-[#1f1f1f]"
          onClick={() => setOpen(false)}
        >
          Для бизнеса
        </a>
      </div>
    </header>
  );
}
