import { Blob } from "@/components/blob";

const topRow = [
  {
    src: "/illustrations/blob-1.svg",
    text: "С зависимостью столкнулись Вы или ваш Близкий",
  },
  {
    src: "/illustrations/blob-2.svg",
    text: "Пробовали бороться с зависимостью сами, но не получилость",
  },
];

const bottomRow = [
  {
    src: "/illustrations/blob-3.svg",
    text: "Тут некий фактик в 2 строки и текст подлинее",
  },
  {
    src: "/illustrations/blob-4.svg",
    text: "Тут некий фактик в 2 строки и текст подлинее",
  },
  {
    src: "/illustrations/blob-3.svg",
    text: "Тут некий фактик в 2 строки и текст подлинее",
  },
];

function Reason({ src, text }: { src: string; text: string }) {
  return (
    <div className="flex w-full max-w-[329px] flex-col items-center gap-[15px]">
      <Blob src={src} />
      <p className="w-full text-center text-[16px] leading-[1.2] font-medium tracking-[-0.16px] text-[#141414] min-[768px]:text-[18px] min-[768px]:tracking-[-0.28px]">
        {text}
      </p>
    </div>
  );
}

export function WhenToSeek() {
  return (
    <section className="mx-auto w-full min-w-[320px] px-[15px] py-12 min-[576px]:max-w-[540px] min-[768px]:max-w-[720px] min-[768px]:py-20 min-[992px]:max-w-[960px] min-[1200px]:max-w-[1140px]">
      <h2 className="mb-8 max-w-[720px] text-left text-[24px] leading-[26px] font-medium text-[#141414] min-[768px]:mx-auto min-[768px]:mb-[70px] min-[768px]:text-center min-[768px]:text-[56px] min-[768px]:leading-[64px]">
        Когда стоит обратиться за помощью
      </h2>
      <div className="mx-auto flex flex-col gap-12">
        <div className="flex flex-col items-center gap-12 min-[768px]:flex-row min-[768px]:justify-center min-[768px]:gap-8 min-[1200px]:gap-16">
          {topRow.map((item) => (
            <Reason key={item.src} {...item} />
          ))}
        </div>
        <div className="flex flex-col items-center gap-12 min-[768px]:flex-row min-[768px]:flex-wrap min-[768px]:justify-center min-[1200px]:flex-nowrap min-[1200px]:justify-between">
          {bottomRow.map((item, index) => (
            <Reason key={`${item.src}-${index}`} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
