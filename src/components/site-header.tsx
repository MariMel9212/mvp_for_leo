import Link from "next/link";
import { CallRequestButton } from "@/components/call-request-modal";

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
  const buttonClass =
    "lime-control flex h-[38px] w-[153px] shrink-0 items-center justify-center rounded-[8px] px-[20px] text-16 shadow-[0_4px_4px_rgba(173,173,173,0.1)]";

  return (
    <header className="flex w-full justify-center pt-[32px]">
      <div className="flex h-[44px] w-[1200px] items-center justify-between">
        <Link href="/" className="text-[20px] leading-[25px] font-bold text-[#161616]">
          Принятие
        </Link>
        <nav aria-label="Разделы" className="flex items-center gap-[42px]">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-16 text-[#27292d]">
              {link.label}
            </Link>
          ))}
        </nav>
        {ctaTopic ? (
          <CallRequestButton label="Выбрать центр" topic={ctaTopic} className={buttonClass} />
        ) : (
          <Link href={ctaHref} className={buttonClass}>
            Выбрать центр
          </Link>
        )}
      </div>
    </header>
  );
}
