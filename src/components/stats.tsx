const stats = [
  { value: "3 000 +", lines: ["семей получили", "профильную помощь"] },
  { value: "6 000 +", lines: ["зависимых", "прошедших лечение"] },
  { value: "30 +", lines: ["лицензированных", "организаций"] },
  { value: "86%", lines: ["удачно подобранных", "учереждений"] },
];

export function Stats() {
  return (
    <section className="mx-auto mt-12 grid w-full max-w-[900px] grid-cols-2 gap-x-6 gap-y-8 px-4 text-center leading-[1.1] tracking-[-0.5px] text-[#111] min-[1280px]:mt-[34px] min-[1280px]:flex min-[1280px]:w-[900px] min-[1280px]:justify-between min-[1280px]:px-0">
      {stats.map((item) => (
        <div
          key={item.value}
          className="mx-auto flex w-[160px] flex-col items-center"
        >
          <p className="w-full text-[26px] font-medium">{item.value}</p>
          <p className="w-full text-[16px] font-normal opacity-40">
            {item.lines.map((line, index) => (
              <span key={line}>
                {index > 0 && (
                  <>
                    <br className="max-[1279px]:hidden" />
                    <span className="min-[1280px]:hidden"> </span>
                  </>
                )}
                {line}
              </span>
            ))}
          </p>
        </div>
      ))}
    </section>
  );
}
