const links = ["Раздел", "Раздел", "Раздел", "Раздел"];

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 bg-transparent pt-8">
      <div className="mx-auto flex h-11 w-full max-w-[940px] items-center justify-between gap-6 px-4 min-[1440px]:max-w-[1180px]">
        <a
          href="#podbor"
          className="shrink-0 text-[24px] leading-[1.1] font-bold tracking-[-0.5px] text-[#111] opacity-80"
          style={{
            fontFamily:
              '"SF Pro Display", "SF Pro Text", var(--font-google-sans), sans-serif',
          }}
        >
          СвойЦентр
        </a>
        <nav
          aria-label="Разделы"
          className="hidden min-w-0 items-center gap-[42px] text-[16px] leading-[1.1] font-medium text-[#111] opacity-80 min-[1100px]:flex"
        >
          {links.map((label, index) => (
            <a key={index} href="#kak-rabotaet" className="whitespace-nowrap">
              {label}
            </a>
          ))}
        </nav>
        <a
          href="#podbor"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-[8px] bg-[#e1f300] px-4 text-[16px] leading-[1.1] font-medium text-[#0a0d14]/80 hover:bg-[#d6e600]"
        >
          Выбрать центр
        </a>
      </div>
    </header>
  );
}
