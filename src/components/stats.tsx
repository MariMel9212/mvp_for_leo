const stats = [
  { value: "3 000 +", label: "семей получили профильную помощь" },
  { value: "6 000 +", label: "зависимых прошедших лечение" },
  { value: "30 +", label: "лицензированных организаций" },
  { value: "86%", label: "удачно подобранных учереждений" },
];

export function Stats() {
  return (
    <section className="mx-auto mt-8 w-full max-w-[940px] px-4">
      <div className="flex flex-wrap justify-between gap-y-6">
        {stats.map((item) => (
          <div
            key={item.value}
            className="w-[calc(50%-8px)] text-center min-[768px]:w-[160px]"
          >
            <p className="text-[26px] leading-[1.1] font-medium text-[#111]">
              {item.value}
            </p>
            <p className="text-[16px] leading-[1.1] font-normal text-[#111] opacity-40">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
