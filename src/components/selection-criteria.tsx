import type { ReactNode } from "react";

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
    text: (
      <>
        Проверяем, есть ли в учреждении профильные врачи, психологи
        <br />
        и&nbsp;другие специалисты, необходимые для конкретного формата
        <br />
        помощи
      </>
    ),
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
  return (
    <section className="mt-[120px] px-[120px]">
      <div className="flex w-[1200px] items-start">
        <div className="flex w-[483px] shrink-0 flex-col gap-[24px]">
          <h2 className="text-40 font-medium">
            Отбираем учреждения
            <br />
            по понятным критериям
          </h2>
          <p className="text-16 opacity-60">
            При подборе специализированного учреждения мы оцениваем
            <br />
            весь комплекс факторов: качество и формат оказываемых
            <br />
            услуг, соответствие требованиям законодательства,
            <br />
            квалификацию специалистов, безопасность и прозрачность
            <br />
            условий
          </p>
        </div>
        <ol className="mt-[120px] ml-auto flex w-[588px] flex-col gap-[12px]">
          {criteria.map((item, index) => (
            <li key={item.n} className={index < criteria.length - 1 ? "flex flex-col gap-[12px]" : undefined}>
              <div className="flex items-start gap-[16px]">
                <span className="text-24 font-medium text-[#5a98ff] opacity-80">{item.n}</span>
                <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
                  <h3 className="text-24 font-medium">{item.title}</h3>
                  <p className="text-16 opacity-60">{item.text}</p>
                </div>
              </div>
              {index < criteria.length - 1 ? (
                <div className="relative h-0">
                  <div className="absolute inset-x-0 h-px bg-black/10" />
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
