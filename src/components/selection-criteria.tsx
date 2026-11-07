"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { tie } from "@/lib/tie";

const GRID = 56;
const GRID_OFFSET = 2;
const MIN_GAP = 16;

function snapToGrid(section: HTMLElement) {
  const sectionTop = section.getBoundingClientRect().top;
  section.querySelectorAll<HTMLElement>("[data-snap-gap]").forEach((gap) => {
    const line = gap.nextElementSibling;
    if (!(line instanceof HTMLElement)) return;
    const y = line.getBoundingClientRect().top - sectionTop;
    const next = GRID_OFFSET + Math.ceil((y - GRID_OFFSET) / GRID - 1e-3) * GRID;
    const delta = next - y;
    if (Math.abs(delta) < 0.75) return;
    gap.style.height = `${gap.getBoundingClientRect().height + delta}px`;
  });
}

const criteria: { n: string; title: string; text: ReactNode }[] = [
  {
    n: "01",
    title: "Медицинская лицензия",
    text: "Проверяем, есть ли у учреждения действующая лицензия и\u00a0соответствует ли она заявленным медицинским услугам",
  },
  {
    n: "02",
    title: "Юридический статус",
    text: "Сверяем регистрацию организации, ОГРН, ИНН и актуальные сведения в ЕГРЮЛ",
  },
  {
    n: "03",
    title: "Персонал и специалисты",
    text: tie("Проверяем, есть ли в учреждении профильные врачи, психологи и другие специалисты, необходимые для конкретного формата помощи"),
  },
  {
    n: "04",
    title: "Договор и стоимость",
    text: "Проверяем, чтобы условия оказания услуг, стоимость, порядок оплаты, расторжения и возврата были зафиксированы в договоре",
  },
  {
    n: "05",
    title: "Персональные данные",
    text: "Проверяем правила обработки персональных данных, необходимые согласия и документы по видеонаблюдению, если\u00a0оно используется",
  },
];

export function SelectionCriteria() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const snap = () => {
      observer.disconnect();
      section.querySelectorAll<HTMLElement>("[data-snap-gap]").forEach((gap) => {
        gap.style.height = `${MIN_GAP}px`;
      });
      snapToGrid(section);
      observer.observe(section);
    };
    const observer = new ResizeObserver(snap);
    snap();
    document.fonts?.ready.then(snap);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="pro-podbor" className="relative w-full pt-16 pb-16 min-[1440px]:pt-[120px] min-[1440px]:pb-[92px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(136,136,136,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(136,136,136,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          backgroundPosition: "0 2px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[73px]"
        style={{ backgroundImage: "linear-gradient(to bottom, #fdfdfd 0%, rgba(253,253,253,0) 100%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[73px]"
        style={{ backgroundImage: "linear-gradient(to top, #fdfdfd 0%, rgba(253,253,253,0) 100%)" }}
      />
      <div className="relative mx-auto flex w-full max-w-[1200px] flex-col items-start px-0 max-[1439px]:px-4 min-[1440px]:flex-row">
        <div className="flex w-full shrink-0 flex-col gap-[24px] min-[1440px]:w-[483px] max-[1439px]:[&_br]:hidden">
          <h2 className="text-40 font-medium max-[1439px]:text-[32px] max-[1439px]:leading-[40px]">
            {tie("Отбираем учреждения по понятным критериям")}
          </h2>
          <p className="text-16 opacity-60">
            {tie("При подборе специализированного учреждения мы оцениваем весь комплекс факторов: качество и формат оказываемых услуг, соответствие требованиям законодательства, квалификацию специалистов, безопасность и прозрачность условий")}
          </p>
        </div>
        <ol className="mt-10 flex w-full flex-col max-[1439px]:[&_br]:hidden min-[1440px]:mt-[120px] min-[1440px]:ml-auto min-[1440px]:w-[588px]">
          {criteria.map((item, index) => (
            <li key={item.n} className="flex flex-col">
              <div className="flex items-start gap-[16px]">
                <span className="text-24 font-medium text-[#5a98ff] opacity-80">{item.n}</span>
                <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
                  <h3 className="text-24 font-medium max-[1439px]:text-[20px] max-[1439px]:leading-[26px]">{tie(item.title)}</h3>
                  <p className="text-16 opacity-60">{typeof item.text === "string" ? tie(item.text) : item.text}</p>
                </div>
              </div>
              {index < criteria.length - 1 ? (
                <>
                  <div data-snap-gap style={{ height: MIN_GAP }} />
                  <div className="h-px bg-[rgba(39,41,45,0.035)]" />
                  <div className="h-4" />
                </>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
