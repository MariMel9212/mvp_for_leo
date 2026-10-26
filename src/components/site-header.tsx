import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="bg-white">
      <div className="mx-auto flex h-[76px] w-full max-w-[940px] items-center justify-between px-4 min-[1440px]:h-[96px] min-[1440px]:max-w-[1180px]">
        <a
          href="#podbor"
          className="text-[26px] leading-none font-bold tracking-[-0.5px] text-[#059000] min-[1440px]:text-[34px]"
          style={{
            fontFamily:
              '"SF Pro Display", "SF Pro Text", var(--font-google-sans), sans-serif',
          }}
        >
          СвойЦентр
        </a>
        <Button
          variant="brand"
          size="header"
          nativeButton={false}
          render={<a href="#podbor" />}
        >
          Выбрать центр
        </Button>
      </div>
    </header>
  );
}
