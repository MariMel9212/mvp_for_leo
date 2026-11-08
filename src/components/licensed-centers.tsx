import Link from "next/link";
import { CenterCard, catalogCenters } from "@/components/center-card";
import { asset } from "@/lib/base-path";

export function LicensedCenters() {
  return (
    <section id="uchrezhdeniya" className="mt-16 px-[120px] max-[1439px]:px-4 md:mt-[120px]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 min-[1440px]:gap-[52px]">
        <h2 className="text-40 font-medium max-md:text-28 md:max-[1439px]:text-[32px] md:max-[1439px]:leading-[40px]">Центры, которым можно доверять</h2>
        <div className="grid grid-cols-3 gap-6 max-[1199px]:grid-cols-2 max-[639px]:grid-cols-1">
          {catalogCenters.map((center) => (
            <CenterCard key={center.href} center={center} />
          ))}
        </div>
        <Link
          href="/uchrezhdeniya"
          className="lime-control mx-auto flex h-[56px] w-full max-w-[377px] items-center justify-center gap-[4px] rounded-[12px] px-[20px] text-18 leading-[24px] font-medium"
        >
          Смотреть все
          <img alt="" src={asset("/icons/arrow-right.svg")} width={24} height={24} />
        </Link>
      </div>
    </section>
  );
}
