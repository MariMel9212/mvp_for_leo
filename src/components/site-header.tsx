import Link from "next/link";
import { CallRequestButton } from "@/components/call-request-modal";

const links = [
  { label: "Учереждения", href: "/uchrezhdeniya" },
  { label: "Про подбор", href: "/#pro-podbor" },
  { label: "Контакты", href: "/#zayavka" },
];

const centerLinks = [
  { label: "Про подбор", href: "/#pro-podbor" },
  { label: "Контакты", href: "/#zayavka" },
];

export function SiteHeader({
  ctaHref = "/uchrezhdeniya",
  showCta = true,
  variant = "site",
  ctaTopic,
}: {
  ctaHref?: string;
  showCta?: boolean;
  variant?: "site" | "center";
  ctaTopic?: string;
}) {
  if (variant === "center") {
    return (
      <header className="flex w-full justify-center pt-[32px]">
        <div className="flex h-[44px] w-[1200px] items-center justify-between">
          <Link href="/" className="text-[20px] leading-[25px] font-bold text-[#161616]">
            Принятие
          </Link>
          <nav aria-label="Разделы" className="flex items-center gap-[42px]">
            {centerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-16 text-[#27292d]">
                {link.label}
              </Link>
            ))}
          </nav>
          <CallRequestButton
            label="Выбрать центр"
            topic={ctaTopic ?? "Подбор центра"}
            className="lime-control flex h-[38px] w-[153px] shrink-0 items-center justify-center rounded-[8px] px-[20px] text-16 drop-shadow-[0_4px_4px_rgba(0,0,0,0.2)]"
          />
        </div>
      </header>
    );
  }

  return (
    <header className="flex w-full justify-center pt-[32px]">
      <div
        className={
          showCta
            ? "flex h-[44px] w-[1180px] items-center justify-between px-[16px]"
            : "grid h-[44px] w-[1200px] grid-cols-[1fr_auto_1fr] items-center"
        }
      >
        <Link href="/" className="text-24 font-bold text-[#27292d] opacity-80">
          СвойЦентр
        </Link>
        <nav aria-label="Разделы" className="flex items-center gap-[42px] opacity-80">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-16 text-[#27292d]">
              {link.label}
            </Link>
          ))}
        </nav>
        {showCta ? (
          <Link
            href={ctaHref}
            className="lime-control flex h-[38px] w-[153px] shrink-0 items-center justify-center rounded-[8px] px-[20px] text-16"
          >
            Выбрать центр
          </Link>
        ) : (
          <span />
        )}
      </div>
    </header>
  );
}
