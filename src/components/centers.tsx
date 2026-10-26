const centers = [
  "Реабилитационный центр в Химках",
  "Медикаментозная терапия",
];

export function Centers() {
  return (
    <section className="mx-auto w-full max-w-[940px] px-4 pt-20 pb-24 min-[768px]:pt-[140px] min-[768px]:pb-[160px] min-[1440px]:max-w-[1180px]">
      <h2 className="text-center text-[32px] leading-[1.1] font-medium text-black min-[768px]:text-[44px] min-[1440px]:text-[56px]">
        Проверенные центры
      </h2>
      <div className="mt-12 flex max-w-[267px] flex-col gap-12 min-[768px]:mt-16 min-[768px]:ml-[18px] min-[768px]:gap-16">
        {centers.map((name) => (
          <p key={name} className="text-[21px] leading-[1.1] font-medium text-black min-[1440px]:text-[26px]">
            {name}
          </p>
        ))}
      </div>
    </section>
  );
}
