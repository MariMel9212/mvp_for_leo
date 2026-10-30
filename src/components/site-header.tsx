"use client";

const links = ["Раздел", "Раздел", "Раздел", "Раздел"];

function scrollToSection(
  event: React.MouseEvent<HTMLAnchorElement>,
  id: string,
) {
  event.preventDefault();
  if (id === "podbor") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 bg-transparent pt-8">
      <div className="mx-auto flex h-11 w-full max-w-[940px] items-center justify-between gap-6 px-4 min-[1440px]:max-w-[1180px]">
        <a
          href="#podbor"
          onClick={(event) => scrollToSection(event, "podbor")}
          className="shrink-0 text-24 font-bold text-[#111] opacity-80"
        >
          СвойЦентр
        </a>
        <nav
          aria-label="Разделы"
          className="hidden min-w-0 items-center gap-[42px] text-16 font-medium text-[#111] opacity-80 min-[1100px]:flex"
        >
          {links.map((label, index) => (
            <a
              key={index}
              href="#situatsii"
              onClick={(event) => scrollToSection(event, "situatsii")}
              className="whitespace-nowrap"
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          href="#podbor"
          onClick={(event) => scrollToSection(event, "podbor")}
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-[8px] bg-[#e1f300] px-4 text-16 font-medium text-[#0a0d14]/80 hover:bg-[#d6e600]"
        >
          Выбрать центр
        </a>
      </div>
    </header>
  );
}
