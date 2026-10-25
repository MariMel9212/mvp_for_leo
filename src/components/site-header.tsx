import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="relative flex h-[60px] items-center justify-between bg-white px-4 min-[1280px]:block min-[1280px]:px-0">
      <a
        href="#dlya-biznesa"
        id="dlya-biznesa"
        className="text-[13px] leading-[1.1] font-normal tracking-[-0.5px] text-[#111] min-[1280px]:absolute min-[1280px]:top-[30px] min-[1280px]:left-[587px]"
      >
        Для бизнеса
      </a>
      <Button
        variant="brand"
        size="header"
        nativeButton={false}
        render={<a href="#podbor" />}
        className="min-[1280px]:absolute min-[1280px]:top-[19px] min-[1280px]:right-[190px]"
      >
        Выбрать ребцентр
      </Button>
    </header>
  );
}
