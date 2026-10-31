"use client";

import { useState } from "react";

export type CenterSlide = {
  src: string;
  className: string;
};

export function CenterPhoto({
  slides,
  frameClassName,
}: {
  slides: CenterSlide[];
  frameClassName: string;
}) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  function scrub(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const next = Math.min(count - 1, Math.max(0, Math.floor(ratio * count)));
    setIndex((current) => (current === next ? current : next));
  }

  return (
    <div
      className={`absolute top-[4px] left-[4px] w-[376px] overflow-hidden rounded-[10px] ${frameClassName}`}
      onPointerMove={scrub}
      onPointerLeave={() => setIndex(0)}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ width: `${count * 100}%`, transform: `translateX(-${(index * 100) / count}%)` }}
      >
        {slides.map((slide, slideIndex) => (
          <div key={slideIndex} className="relative h-full overflow-hidden" style={{ width: `${100 / count}%` }}>
            <img alt="" src={slide.src} className={`absolute max-w-none ${slide.className}`} />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute top-[8px] left-[185px] flex items-center gap-[4px]">
        {slides.map((_, slideIndex) => (
          <span
            key={slideIndex}
            className={`rounded-full transition-all duration-300 ease-out ${
              slideIndex === index ? "h-[8px] w-[16px] bg-[#8aa7d9]" : "size-[8px] bg-[#9bb6e5] opacity-50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
