"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CallRequestButton } from "@/components/call-request-modal";
import { asset } from "@/lib/base-path";

const links = [
  { label: "Про подбор", href: "/#pro-podbor" },
  { label: "Контакты", href: "/#zayavka" },
];

export function SiteHeader({
  ctaHref = "/uchrezhdeniya",
  ctaTopic,
}: {
  ctaHref?: string;
  showCta?: boolean;
  variant?: "site" | "center";
  ctaTopic?: string;
}) {
  const [open, setOpen] = useState(false);
  const buttonClass =
    "lime-control flex h-[38px] w-[153px] shrink-0 items-center justify-center rounded-[8px] px-[20px] text-16 shadow-[0_4px_4px_rgba(173,173,173,0.1)]";

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="mx-auto flex w-full max-w-[1440px] justify-center px-[120px] pt-5 max-[1439px]:px-4 min-[1440px]:pt-[32px]">
      <div className="flex w-full max-w-[1200px] items-center justify-between md:h-[44px]">
        <Link href="/" aria-label="Leo" className="shrink-0">
          <img alt="" src={asset("/brand/leo.svg")} width={46.96} height={20} className="block h-5 w-auto" />
        </Link>
        <nav aria-label="Разделы" className="hidden items-center gap-[42px] md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-16 text-[#27292d]">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="relative flex items-center gap-2">
          {ctaTopic ? (
            <CallRequestButton label="Выбрать центр" topic={ctaTopic} className={buttonClass} />
          ) : (
            <Link href={ctaHref} className={buttonClass}>
              Выбрать центр
            </Link>
          )}
          <button
            type="button"
            className="flex size-[38px] shrink-0 items-center justify-center text-[#161616] md:hidden"
            aria-expanded={open}
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M3 3L15 15M15 3L3 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden>
                <path d="M1 1.5H17M1 7H17M1 12.5H17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            )}
          </button>
          {open ? (
            <nav
              aria-label="Разделы"
              className="absolute top-[calc(100%+8px)] right-0 z-30 flex w-[180px] flex-col rounded-[12px] bg-white p-2 shadow-[0_8px_24px_rgba(39,41,45,0.12)] md:hidden"
            >
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-[8px] px-3 py-2 text-16 text-[#27292d]"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
      </div>
    </header>
  );
}
