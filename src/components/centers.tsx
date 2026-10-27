export function Centers() {
  return (
    <section className="mt-16 pb-20 min-[768px]:mt-[181px] min-[768px]:pb-28 min-[1440px]:mt-[200px] min-[1440px]:pb-36">
      <div className="mx-auto w-full max-w-[940px] px-4 min-[1440px]:max-w-[1180px]">
      <h2 className="text-[32px] leading-[1.1] font-medium text-black min-[768px]:text-[44px] min-[1440px]:text-[52px]">
        Проверенные учереждения
      </h2>

      <div className="-mx-4 mt-8 flex gap-3 overflow-x-auto px-4 pb-1 min-[768px]:mx-0 min-[768px]:mt-[52px] min-[768px]:overflow-visible min-[768px]:px-0 min-[1440px]:mt-16 min-[1440px]:gap-[15px]">
        <div className="h-[260px] w-[272px] shrink-0 overflow-hidden rounded-[6px] bg-[#e7e6e6] min-[768px]:h-[329px] min-[768px]:w-[345px] min-[1440px]:h-[413px] min-[1440px]:w-[433px]">
          <img
            src="/centers/himki.png"
            alt="Ребцентр в Химках"
            className="size-full object-cover"
          />
        </div>
        <div className="h-[260px] w-[272px] shrink-0 bg-[#e7e6e6] min-[768px]:h-[329px] min-[768px]:w-[345px] min-[1440px]:h-[413px] min-[1440px]:w-[433px]" />
        <div className="h-[260px] w-[272px] shrink-0 bg-[#e7e6e6] min-[768px]:h-[329px] min-[768px]:w-[345px] min-[1440px]:h-[413px] min-[1440px]:w-[433px]" />
      </div>

      <div className="mt-5 w-[272px] min-[768px]:w-[345px] min-[1440px]:mt-6 min-[1440px]:w-[433px]">
        <p className="text-[20px] leading-[1.1] font-medium text-black min-[1440px]:text-[24px]">
          Ребцентр в Химках
        </p>
        <p className="mt-1 text-[14px] leading-[1.1] font-normal text-black min-[1440px]:text-[16px]">
          Программа от 3 до 12 мес
        </p>
        <button
          type="button"
          className="mt-[23px] inline-flex h-[34px] items-center justify-center rounded-[8px] bg-[rgba(120,216,112,0.1)] px-[10px] text-[16px] leading-[1.1] font-medium text-[rgba(17,17,17,0.9)] min-[1440px]:mt-7 min-[1440px]:h-[40px] min-[1440px]:px-4 min-[1440px]:text-[18px]"
        >
          Запросить цену
        </button>
      </div>
      </div>
    </section>
  );
}
