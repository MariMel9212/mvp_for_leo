const stats = [
  { value: "3 000 +", label: "семей получили профильную помощь" },
  { value: "6 000 +", label: "зависимых прошедших лечение" },
  { value: "30 +", label: "лицензированных организаций" },
  { value: "86%", label: "удачно подобранных учереждений" },
];

export function Stats() {
  return (
    <section className="mx-auto w-full min-w-[320px] px-[15px] min-[576px]:max-w-[540px] min-[768px]:max-w-[720px] min-[992px]:max-w-[960px] min-[1200px]:max-w-[1140px]">
      <div className="flex flex-wrap items-start">
        {stats.map((item) => (
          <div
            key={item.value}
            className="w-1/2 px-[5px] pt-6 pb-5 text-center min-[768px]:w-1/4"
          >
            <p className="text-[21px] leading-10 font-medium text-[#141414] min-[768px]:text-[32px]">
              {item.value}
            </p>
            <p className="mx-auto max-w-[315px] text-[14px] leading-[1.2] text-[#a2adb8] min-[768px]:text-[20px]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
