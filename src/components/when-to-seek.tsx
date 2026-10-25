import { Blob } from "@/components/blob";

const topRow = [
  {
    src: "/illustrations/blob-1.svg",
    lines: ["С зависимостью столкнулись Вы или", "ваш Близкий"],
    widthClass: "min-[1280px]:w-[297px]",
  },
  {
    src: "/illustrations/blob-2.svg",
    lines: ["Пробовали бороться с зависимостью", "сами, но не получилость"],
    widthClass: "min-[1280px]:w-[329px]",
  },
];

const placeholderLines = ["Тут некий фактик в 2 строки", "и текст подлинее"];

const bottomRow = [
  "/illustrations/blob-3.svg",
  "/illustrations/blob-4.svg",
  "/illustrations/blob-3.svg",
];

function Reason({
  src,
  lines,
  widthClass,
}: {
  src: string;
  lines: string[];
  widthClass: string;
}) {
  return (
    <div className={`flex w-full max-w-[329px] flex-col items-center gap-[15px] ${widthClass}`}>
      <Blob src={src} />
      <p className="w-full text-center text-[18px] leading-[1.1] font-medium tracking-[-0.5px] text-[#111]">
        {lines.map((line, index) => (
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
  );
}

export function WhenToSeek() {
  return (
    <section className="mx-auto mt-16 flex w-full max-w-[901px] flex-col items-center gap-10 px-4 min-[1280px]:mt-[100px] min-[1280px]:w-[901px] min-[1280px]:gap-[52px] min-[1280px]:px-0">
      <h2 className="w-full max-w-[525px] text-center text-[34px] leading-[1.1] font-medium tracking-[-0.5px] text-[rgba(17,17,17,0.9)] min-[1280px]:text-[46px]">
        Когда стоит обратиться
        <br className="max-[1279px]:hidden" />
        <span className="min-[1280px]:hidden"> </span>
        за помощью
      </h2>

      <div className="flex w-full flex-col gap-12 min-[1280px]:gap-[48px]">
        <div className="flex w-full flex-col items-center gap-12 min-[1280px]:flex-row min-[1280px]:items-end min-[1280px]:justify-between min-[1280px]:px-[118px]">
          {topRow.map((item) => (
            <Reason key={item.src} {...item} />
          ))}
        </div>
        <div className="flex w-full flex-col items-center gap-12 min-[1280px]:flex-row min-[1280px]:items-end min-[1280px]:gap-0 min-[1280px]:pr-[5px] min-[1280px]:pl-[20px]">
          {bottomRow.map((src, index) => (
            <Reason
              key={`${src}-${index}`}
              src={src}
              lines={placeholderLines}
              widthClass="min-[1280px]:w-[292px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
