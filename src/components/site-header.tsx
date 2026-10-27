const links = ["Про подбор", "Про подбор", "Про подбор", "Про подбор"];

export function SiteHeader() {
  return (
    <header className="bg-white">
      <div className="mx-auto flex h-[64px] w-full max-w-[940px] items-center justify-between gap-6 px-4 min-[1440px]:h-[80px] min-[1440px]:max-w-[1180px]">
        <a
          href="#podbor"
          className="shrink-0 text-[18px] leading-[1.1] font-bold tracking-[-0.5px] text-[#111] opacity-80"
          style={{
            fontFamily:
              '"SF Pro Display", "SF Pro Text", var(--font-google-sans), sans-serif',
          }}
        >
          СвойЦентр
        </a>
        <nav
          aria-label="Разделы"
          className="hidden min-w-0 items-center gap-[42px] text-[14px] leading-[1.1] font-normal text-[#111] opacity-80 min-[1100px]:flex"
        >
          {links.map((label, index) => (
            <a key={index} href="#kak-rabotaet" className="whitespace-nowrap">
              {label}
            </a>
          ))}
        </nav>
        <a
          href="#podbor"
          className="shrink-0 text-[16px] leading-[1.1] font-medium text-[#037bd7]"
        >
          Выбрать центр
        </a>
      </div>
    </header>
  );
}
