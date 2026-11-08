import { pillGrains, readGrains } from "@/components/step-grains";

const radarDots: { x: number; y: number; opacity: number }[] = [
  { x: 45, y: 61, opacity: 1 },
  { x: 175, y: 51, opacity: 1 },
  { x: 205, y: 56, opacity: 0.7 },
  { x: 74, y: 51, opacity: 0.7 },
  { x: 0, y: 73, opacity: 0.7 },
  { x: 23, y: 25, opacity: 0.4 },
  { x: 82, y: 80, opacity: 0.4 },
  { x: 162, y: 73, opacity: 0.4 },
  { x: 207, y: 0, opacity: 0.4 },
  { x: 216, y: 30, opacity: 0.4 },
  { x: 52, y: 0, opacity: 1 },
  { x: 241, y: 78, opacity: 1 },
];

const scanParticles: { x: number; y: number; size: number }[] = [
  { x: 177.2, y: 256.4, size: 3.3 },
  { x: 106.2, y: 125.8, size: 2.9 },
  { x: 126.2, y: 173.9, size: 3.3 },
  { x: 151.9, y: 229.5, size: 2.9 },
  { x: 183.3, y: 120.9, size: 3.3 },
  { x: 135.2, y: 191.1, size: 2.9 },
  { x: 178, y: 97.2, size: 3.3 },
  { x: 141.3, y: 182.1, size: 2.9 },
  { x: 110.2, y: 102.9, size: 3.3 },
  { x: 170.3, y: 202.5, size: 2.9 },
  { x: 150.7, y: 138, size: 3.3 },
  { x: 136.8, y: 252.3, size: 2.9 },
  { x: 128.6, y: 202.5, size: 3.3 },
  { x: 126.2, y: 160.1, size: 2.9 },
  { x: 129.4, y: 124.9, size: 3.3 },
  { x: 138.4, y: 97.2, size: 2.9 },
  { x: 153.1, y: 248.3, size: 3.3 },
  { x: 173.5, y: 235.2, size: 2.9 },
  { x: 114.3, y: 229.5, size: 3.3 },
  { x: 146.2, y: 231.1, size: 2.9 },
  { x: 183.7, y: 240.1, size: 3.3 },
  { x: 141.7, y: 256.4, size: 2.9 },
  { x: 190.7, y: 108.6, size: 3.3 },
  { x: 160.1, y: 139.6, size: 2.9 },
  { x: 135.2, y: 178, size: 3.3 },
  { x: 116, y: 223.8, size: 2.9 },
  { x: 187.8, y: 105.3, size: 3.3 },
  { x: 180.1, y: 165.8, size: 2.9 },
  { x: 178, y: 233.6, size: 3.3 },
  { x: 181.7, y: 137.2, size: 2.9 },
  { x: 191.1, y: 219.7, size: 3.3 },
  { x: 120.9, y: 138, size: 2.9 },
  { x: 141.7, y: 235.2, size: 3.3 },
  { x: 168.2, y: 168.2, size: 2.9 },
  { x: 115.1, y: 108.6, size: 3.3 },
  { x: 153.1, y: 227.8, size: 2.9 },
  { x: 111.5, y: 182.9, size: 3.3 },
  { x: 160.9, y: 145.4, size: 2.9 },
  { x: 130.7, y: 115.1, size: 3.3 },
  { x: 106.2, y: 92.3, size: 2.9 },
];

function PaperOutline({ id, d }: { id: string; d: string }) {
  return (
    <g data-part="paper">
      <use href={`#${id}`} fill="white" />
      <mask id={`${id}-stroke`} fill="white">
        <use href={`#${id}`} />
      </mask>
      <path d={d} strokeWidth="1.34343" stroke="#EDF0F4" mask={`url(#${id}-stroke)`} />
    </g>
  );
}

function TableSheet() {
  const d =
    "M12.9865 0H81.0008C86.9655 0 91.8009 4.83537 91.8009 10.8001V101.152C91.8009 107.117 86.9655 111.952 81.0008 111.952H10.8001C4.83536 111.952 0 107.117 0 101.152V13.4343C0 4.47809 4.32882 0 12.9865 0Z";
  return (
    <svg data-part="table" width="91.8009" height="111.952" viewBox="0 0 91.8009 111.952" fill="none">
      <PaperOutline id="table-sheet" d={d} />
      <rect data-part="heading" x="10.7999" y="29.7004" width="42.3004" height="4.50005" rx="1.80002" fill="#F4F4F4" />
      <rect data-part="grid" x="10.8005" y="42.3004" width="69.3007" height="9.9001" rx="0.900009" fill="#F0F4F7" />
      <path
        data-part="grid-lines"
        d="M35.1007 42.3004H10.8005V53.1005M35.1007 42.3004H58.501M35.1007 42.3004V53.1005M58.501 42.3004H80.1012V53.1005M58.501 42.3004V53.1005M80.1012 53.1005V63.9006M80.1012 53.1005H58.501M80.1012 63.9006V74.7007M80.1012 63.9006H58.501M80.1012 74.7007V85.5008M80.1012 74.7007H58.501M80.1012 85.5008V96.3009H58.501M80.1012 85.5008H58.501M58.501 96.3009H35.1007M58.501 96.3009V85.5008M35.1007 96.3009H10.8005V85.5008M35.1007 96.3009V85.5008M10.8005 85.5008V74.7007M10.8005 85.5008H35.1007M10.8005 74.7007L10.8005 63.9006M10.8005 74.7007H35.1007M10.8005 63.9006V53.1005M10.8005 63.9006H35.1007M10.8005 53.1005H35.1007M35.1007 53.1005H58.501M35.1007 53.1005V63.9006M58.501 53.1005V63.9006M35.1007 63.9006H58.501M35.1007 63.9006V74.7007M58.501 63.9006V74.7007M35.1007 74.7007H58.501M35.1007 74.7007V85.5008M58.501 74.7007V85.5008M35.1007 85.5008H58.501"
        strokeWidth="0.900009"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#F4F4F4"
      />
      {[
        [15.3005, 57.6005, 13.5001],
        [39.6005, 57.6004, 12.6001],
        [63.0006, 57.6005, 10.8001],
        [15.3007, 68.4006, 13.5001],
        [39.5999, 68.4007, 12.6001],
        [63.0001, 68.4008, 10.8001],
        [15.3005, 79.2008, 13.5001],
        [39.6013, 79.2004, 12.6001],
        [63.0015, 79.2005, 10.8001],
        [15.3, 90.0011, 13.5001],
        [39.6007, 90.0007, 12.6001],
        [63.0008, 90.0008, 10.8001],
      ].map(([x, y, width]) => (
        <rect key={`${x}-${y}`} data-part="cell" x={x} y={y} width={width} height="1.80002" rx="0.900009" fill="#F4F4F4" />
      ))}
      <defs>
        <path id="table-sheet" d={d} />
      </defs>
    </svg>
  );
}

function ChecklistSheet() {
  const d =
    "M12.9865 0H81.9008C87.3685 0 91.8009 4.43243 91.8009 9.9001V102.052C91.8009 107.52 87.3685 111.952 81.9008 111.952H9.90009C4.43242 111.952 0 107.52 0 102.052V13.4343C0 4.47809 4.32882 0 12.9865 0Z";
  const rows = [
    { box: 44.1005, mark: 46.8006, line: 45.9005, lineWidth: 55.8006 },
    { box: 57.6006, mark: 60.3008, line: 59.4006, lineWidth: 55.8006 },
    { box: 71.1009, mark: 73.8009, line: 72.9008, lineWidth: 55.8006 },
    { box: 84.6007, mark: 87.3011, line: 86.4009, lineWidth: 39.6004 },
  ];
  return (
    <svg data-part="checklist" width="91.8009" height="111.952" viewBox="0 0 91.8009 111.952" fill="none">
      <PaperOutline id="check-sheet" d={d} />
      <rect data-part="heading" x="10.7997" y="29.7002" width="42.3004" height="4.50005" rx="1.80002" fill="#F4F4F4" />
      {rows.map((row) => (
        <g key={row.box} data-part="row">
          <rect data-part="box" x="10.8004" y={row.box} width="6.30006" height="6.30006" rx="1.35001" fill="#F2F7FA" />
          <path
            data-part="tick"
            d={`M11.7001 ${row.mark}L13.5001 ${row.mark + 1.8}L16.2001 ${row.mark - 1.8}`}
            strokeWidth="1.08001"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="#E8EDF2"
          />
          <rect data-part="line" x="23.4003" y={row.line} width={row.lineWidth} height="2.70003" rx="1.35001" fill="#F4F4F4" />
        </g>
      ))}
      <defs>
        <path id="check-sheet" d={d} />
      </defs>
    </svg>
  );
}

function DocumentSheet() {
  const d =
    "M14.1349 0H67.4968C70.3317 0 73.0711 1.02447 75.2103 2.88466L95.8773 20.856C98.4448 23.0886 99.919 26.3241 99.919 29.7265V110.097C99.919 116.589 94.656 121.852 88.1638 121.852H11.7552C5.26298 121.852 0 116.589 0 110.097V14.6223C0 4.87411 4.71163 0 14.1349 0Z";
  return (
    <svg data-part="document" width="99.9194" height="121.852" viewBox="0 0 99.9194 121.852" fill="none">
      <g data-part="paper">
        <use href="#document-sheet" fill="white" />
        <mask id="document-stroke" fill="white">
          <use href="#document-sheet" />
        </mask>
        <path d={d} strokeWidth="1.46223" stroke="#EDF0F4" mask="url(#document-stroke)" />
      </g>
      <path data-part="fold" d="M71.8934 0V12.9164C71.8934 20.5524 75.5489 24.3705 82.8601 24.3705H99.9194" strokeWidth="0.731115" stroke="#EDF0F4" />
      <path
        data-part="rules"
        d="M11.6974 35.3372H88.4644M11.6974 47.5225H88.4644M11.6974 59.7077H88.4644M11.6974 71.893H88.4644"
        strokeWidth="3.65557"
        strokeLinecap="round"
        stroke="#F5F5F5"
      />
      <defs>
        <path id="document-sheet" d={d} />
      </defs>
    </svg>
  );
}

export function SituationSheets() {
  return (
    <div data-part="sheets" className="situation-sheets absolute top-[203px] left-[94px] h-[133px] w-[195px] max-[1439px]:top-auto max-[1439px]:bottom-[-36px] max-[1439px]:left-1/2">
      <div data-part="table" className="situation-sheet absolute" style={{ left: 105.93, top: 1.8 }}>
        <div className="situation-sheet-motion">
          <TableSheet />
        </div>
      </div>
      <div data-part="checklist" className="situation-sheet absolute" style={{ left: 0, top: 24.1 }}>
        <div className="situation-sheet-motion">
          <ChecklistSheet />
        </div>
      </div>
      <div data-part="document" className="situation-sheet absolute" style={{ left: 45.54, top: 0 }}>
        <div className="situation-sheet-motion">
          <DocumentSheet />
        </div>
      </div>
    </div>
  );
}

export function FormatRadar() {
  return (
    <>
      <div data-part="radar" className="absolute top-[270px] left-1/2 h-[258px] w-[258px] -translate-x-1/2 max-[1439px]:top-auto max-[1439px]:bottom-[-124px] max-[1439px]:origin-bottom max-[1439px]:scale-[0.92]">
        <svg
          width="291.229"
          height="292.315"
          viewBox="0 0 291.229 292.315"
          fill="none"
          overflow="visible"
          className="absolute max-w-none"
          style={{ left: -15.6, top: -34.32 }}
        >
          <circle data-part="ring" cx="144.602" cy="163.315" r="129" fill="#B1D6FB" fillOpacity="0.3" />
          <circle data-part="ring" cx="144.602" cy="163.315" r="99.76" fill="#B6D9FB" fillOpacity="0.54" />
          <circle data-part="ring" cx="143.742" cy="162.455" r="69.66" fill="#93C7FA" fillOpacity="0.55" />
          <g data-part="wedge" mask="url(#radar-wedge)">
            <path d="M145.614 189.57L291.229 -62.6416H0L145.614 189.57Z" fill="#E1F300" fillOpacity="0.52" />
          </g>
          <g mask="url(#radar-wedge-glow)">
            <g clipPath="url(#wedge-impulse-shape)">
              <g className="radar-wedge-glow" data-part="wedge-glow" opacity="0">
                <rect x="-40" y="150" width="380" height="130" fill="url(#wedge-impulse-band)" />
              </g>
            </g>
          </g>
          <defs>
            <mask id="radar-wedge" maskUnits="userSpaceOnUse" x="-23" y="0" width="336" height="167">
              <g clipPath="url(#radar-wedge-clip)">
                <circle cx="144.79" cy="167.317" r="167.317" fill="#B1D6FB" fillOpacity="0.3" />
                <circle cx="144.791" cy="167.317" r="129.392" fill="#B6D9FB" fillOpacity="0.54" />
                <circle cx="143.675" cy="166.201" r="90.3511" fill="#93C7FA" fillOpacity="0.55" />
              </g>
            </mask>
            <mask id="radar-wedge-glow" maskUnits="userSpaceOnUse" x="-23" y="0" width="336" height="167">
              <g clipPath="url(#radar-wedge-clip)">
                <circle cx="144.79" cy="167.317" r="167.317" fill="white" fillOpacity="0.72" />
                <circle cx="144.791" cy="167.317" r="129.392" fill="white" fillOpacity="0.9" />
                <circle cx="143.675" cy="166.201" r="90.3511" fill="white" />
              </g>
            </mask>
            <linearGradient id="wedge-impulse-band" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#E1F300" stopOpacity="0" />
              <stop offset="0.28" stopColor="#E8FF3A" stopOpacity="0.45" />
              <stop offset="0.58" stopColor="#F6FF70" stopOpacity="1" />
              <stop offset="0.8" stopColor="#F6FF70" stopOpacity="0.85" />
              <stop offset="1" stopColor="#F6FF70" stopOpacity="0" />
            </linearGradient>
            <clipPath id="wedge-impulse-shape">
              <path d="M145.614 189.57L291.229 -62.6416H0L145.614 189.57Z" />
            </clipPath>
            <clipPath id="radar-wedge-clip">
              <rect width="334.634" height="166.493" fill="white" transform="translate(-22.5266)" />
            </clipPath>
          </defs>
        </svg>
      </div>
      <div data-part="dots" className="absolute top-[316px] left-[68px] h-[82px] w-[243px] max-[1439px]:hidden">
        {radarDots.map((dot) => (
          <span
            key={`${dot.x}-${dot.y}`}
            data-part="dot"
            className="absolute h-[2px] w-[2px] rounded-full bg-white"
            style={{ left: dot.x, top: dot.y, opacity: dot.opacity }}
          />
        ))}
      </div>
    </>
  );
}

const criteria = [
  "Регион проживания",
  "Программа выздоровления",
  "Персонал в организации",
  "Лицензии",
  "Возраст",
  "Тип зависимости",
  "Медицинское наблюдение",
  "Опыт лечения",
];

const pillGap = 12;
const pillHeight = 35.1;
const firstRow = 83.7;
const rowPitch = pillHeight + pillGap;

const criterionRows = [
  { top: firstRow, shift: 0, delay: "0s", grain: 0 },
  { top: firstRow + rowPitch, shift: 3, delay: "-11s", grain: 90 },
  { top: firstRow + rowPitch * 2, shift: 5, delay: "-6s", grain: 180 },
  { top: firstRow + rowPitch * 3, shift: 1, delay: "-17s", grain: 40 },
];

const grainTiles: { key: keyof typeof pillGrains; w: number }[] = [
  { key: "business", w: 147 },
  { key: "digital", w: 123.7 },
  { key: "portal", w: 156.4 },
  { key: "healthcare", w: 123.7 },
  { key: "travel", w: 110.2 },
  { key: "education", w: 139.2 },
];

function grainTexture() {
  let offset = 0;
  const specks: string[] = [];
  for (const tile of grainTiles) {
    for (const grain of readGrains(pillGrains[tile.key])) {
      specks.push(
        `<rect x="${(offset + grain.x).toFixed(2)}" y="${grain.y}" width="${grain.w}" height="${grain.h}" rx="${(Math.min(grain.w, grain.h) / 2).toFixed(2)}" fill="#919b94" fill-opacity="${grain.o}"/>`,
      );
    }
    offset += tile.w;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${offset}" height="35.1" viewBox="0 0 ${offset} 35.1">${specks.join("")}</svg>`;
  return { image: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`, width: offset };
}

const hiddenGrain = grainTexture();

function StatusMark() {
  return (
    <svg data-part="check" width="9.4" height="9.4" viewBox="0 0 9.4 9.4" fill="none" className="absolute top-[3.7px] left-[3.7px]">
      <path
        d="M1.565 4.696L3.522 6.652L7.826 2.348"
        stroke="#4b4b4b"
        strokeWidth="0.715"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CriterionPill({ label, clear, grain }: { label: string; clear: boolean; grain: number }) {
  return (
    <div
      data-part={clear ? "pill" : "hidden-pill"}
      className={`flex h-[35.1px] shrink-0 items-center gap-[8px] overflow-hidden rounded-[18px] border-[0.82px] border-solid pr-[8px] pl-[12px]${clear ? "" : " scan-grain"}`}
      style={{
        backgroundColor: clear ? "rgba(255,255,255,0.86)" : "#ecedeb",
        borderColor: clear ? "#c8c9c7" : "transparent",
        backgroundPosition: clear ? undefined : `${grain}px 0`,
      }}
    >
      <span
        data-part="pill-label"
        className="whitespace-nowrap"
        style={{
          fontSize: 12.66,
          lineHeight: "15.52px",
          color: clear ? "#101110" : "#777e78",
          opacity: clear ? 1 : 0.07,
        }}
      >
        {label}
      </span>
      <span
        data-part="status"
        className="relative size-[16.3px] shrink-0 rounded-full"
        style={{
          opacity: clear ? 1 : 0,
          background: "linear-gradient(162deg, #f6ffc8 0%, #e1f300 42%, #cdde00 100%)",
        }}
      >
        <StatusMark />
      </span>
    </div>
  );
}

function CriterionRow({
  top,
  delay,
  grain,
  items,
  clear,
}: {
  top: number;
  delay: string;
  grain: number;
  items: string[];
  clear: boolean;
}) {
  return (
    <div className="absolute right-0 left-0 overflow-hidden" style={{ top, height: pillHeight }}>
      <div className="criterion-track" style={{ animationDelay: delay }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex" style={{ gap: pillGap, paddingRight: pillGap }}>
            {items.map((label) => (
              <CriterionPill key={`${copy}-${label}`} label={label} clear={clear} grain={grain} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CoverageScan() {
  const rows = criterionRows.map((row) => ({
    ...row,
    items: criteria.map((_, index) => criteria[(index + row.shift) % criteria.length]),
  }));

  return (
    <div
      data-part="coverage"
      aria-hidden
      className="absolute top-[197px] left-0 h-[305px] w-[383px] overflow-hidden rounded-[45px] max-[1439px]:top-[calc(16px-23.27px*0.92*100cqw/383px)] max-[1439px]:bottom-auto max-[1439px]:left-[calc((100%-0.92*100cqw)/2)] max-[1439px]:origin-top-left max-[1439px]:[transform:scale(calc(0.92*100cqw/383px))]"
    >
      <style>{`.scan-grain{background-image:${hiddenGrain.image};background-repeat:repeat-x;background-size:${hiddenGrain.width}px 35.1px}`}</style>
      <div className="scan-source">
        {rows.map((row) => (
          <CriterionRow key={row.top} top={row.top} delay={row.delay} grain={row.grain} items={row.items} clear={false} />
        ))}
      </div>
      <div className="scan-reveal">
        {rows.map((row) => (
          <CriterionRow key={row.top} top={row.top} delay={row.delay} grain={row.grain} items={row.items} clear />
        ))}
      </div>
      <div
        data-part="scan-light"
        className="absolute"
        style={{
          left: 83.7,
          top: 83.7,
          width: 107.4,
          height: 171.5,
          background: "linear-gradient(90deg, rgba(70, 191, 255, 0) 0%, rgba(56, 184, 251, 0.46) 100%)",
          filter: "blur(14px)",
        }}
      />
      <div
        data-part="scan-bloom"
        className="absolute bg-[#32b5f0]"
        style={{ left: 183.3, top: 90.6, width: 7.3, height: 169.9, opacity: 0.45, filter: "blur(8px)" }}
      />
      {scanParticles.map((particle) => (
        <span
          key={`${particle.x}-${particle.y}`}
          data-part="particle"
          className="absolute rounded-full bg-white"
          style={{ left: particle.x, top: particle.y, width: particle.size, height: particle.size, opacity: 0.85 }}
        />
      ))}
      <div
        data-part="scanline"
        className="absolute rounded-full bg-[#afd5fa]"
        style={{
          left: 190.3,
          top: 50.6,
          width: 2,
          height: 240.1,
          boxShadow: "0 0 1.2px rgba(34, 158, 209, 0.2)",
        }}
      />
      <svg
        data-part="callout"
        width="154.752"
        height="45.731"
        viewBox="0 0 154.752 45.731"
        fill="none"
        className="absolute"
        style={{ left: 114.33, top: 23.27, filter: "drop-shadow(0 0.4px 1.6px rgba(18, 141, 196, 0.13))" }}
      >
        <path
          d="M7.2996 0H147.452C152.3184 0 154.7516 2.0787 154.7516 6.2361V23.6972C154.7516 27.8545 152.3184 29.9332 147.452 29.9332H103.6544C87.1086 29.9332 77.9883 32.4277 77.9883 45.7313H75.9159C75.9159 32.4277 68.1296 29.9332 51.5839 29.9332H7.2996C2.4332 29.9332 0 27.8545 0 23.6972V6.2361C0 2.0787 2.4332 0 7.2996 0Z"
          fill="url(#callout-fill)"
        />
        <defs>
          <linearGradient id="callout-fill" x1="0" y1="0" x2="154.752" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ddecfc" />
            <stop offset="0.45" stopColor="#c9e2fb" />
            <stop offset="1" stopColor="#abd3fa" />
          </linearGradient>
        </defs>
      </svg>
      <span
        data-part="callout-label"
        className="absolute font-medium text-[#3a9ff8]"
        style={{ left: 124.9, top: 31.6, width: 136, fontSize: 11.49, lineHeight: "15.92px", opacity: 0.8 }}
      >
        Скрининг учереждений
      </span>
    </div>
  );
}
