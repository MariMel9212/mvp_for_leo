const stats = [
  { value: "3 000 +", label: "семей получили профильную помощь" },
  { value: "6 000 +", label: "зависимых прошедших лечение" },
  { value: "30 +", label: "лицензированных организаций" },
  { value: "86%", label: "удачно подобранных учереждений" },
];

export function Stats() {
  return (
    <section className="relative z-10 mx-auto -mt-16 w-full max-w-[1400px] px-4 min-[1440px]:-mt-20 min-[1440px]:px-8">
      <div className="flex flex-wrap justify-between gap-x-6 gap-y-6">
        {stats.map((item) => (
          <div
            key={item.value}
            className="w-[calc(50%-8px)] text-center min-[768px]:w-[160px] min-[1440px]:w-[220px]"
          >
            <p className="text-[26px] leading-[1.1] font-medium text-[#111] min-[1440px]:text-[34px]">
              {item.value}
            </p>
            <p className="text-[16px] leading-[1.1] font-normal text-[#111] opacity-40 min-[1440px]:text-[18px]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
