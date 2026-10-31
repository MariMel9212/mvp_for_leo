import Link from "next/link";

const links = [
  { label: "Все учереждения", href: "/uchrezhdeniya" },
  { label: "Раздел", href: "/#podbor" },
  { label: "Раздел", href: "/#podbor" },
];

export function SiteHeader({ ctaHref = "/#situacii" }: { ctaHref?: string }) {
  return (
    <header className="flex w-full justify-center pt-[32px]">
      <div className="flex h-[44px] w-[1180px] items-center justify-between px-[16px]">
        <Link href="/" className="text-24 font-bold text-[#111] opacity-80">
          СвойЦентр
        </Link>
        <nav aria-label="Разделы" className="flex items-center gap-[42px] opacity-80">
          <span aria-hidden className="block h-[24px] w-[55px]" />
          {links.map((link, index) => (
            <Link key={index} href={link.href} className="text-16 text-black">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href={ctaHref}
          className="lime-control flex h-[38px] w-[153px] shrink-0 items-center justify-center rounded-[8px] px-[20px] text-16"
        >
          Выбрать центр
        </Link>
      </div>
    </header>
  );
}
