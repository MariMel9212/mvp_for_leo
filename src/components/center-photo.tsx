"use client";

import { useState, type ReactNode } from "react";
import { asset } from "@/lib/base-path";

export type CenterSlide = {
  src: string;
  className: string;
};

function mobilePhoto(src: string) {
  return src.replace(/\.(webp|jpe?g|png)$/i, "-m.webp");
}

function phaseOf(className: string) {
  const num = (name: string) => {
    const hit = className.match(new RegExp(`(?:^|\\s)${name}-\\[(-?\\d+(?:\\.\\d+)?)px\\]`));
    return hit ? Number(hit[1]) : 0;
  };
  return { x: num("left"), y: num("top"), w: num("w"), h: num("h") };
}

export function CenterPhoto({
  slides,
  frameClassName,
  badge,
}: {
  slides: CenterSlide[];
  frameClassName: string;
  badge?: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const cover = slides.every((slide) => slide.className === "cover");
  const phase = phaseOf(slides[index].className);

  function scrub(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const next = Math.min(count - 1, Math.max(0, Math.floor(ratio * count)));
    setIndex((current) => (current === next ? current : next));
  }

  return (
    <div
      className={`absolute top-[4px] right-[4px] left-[4px] overflow-hidden rounded-[10px] ${frameClassName}`}
      onPointerMove={scrub}
      onPointerLeave={() => setIndex(0)}
    >
      {cover ? (
        slides.map((slide, slideIndex) => (
          <picture key={slide.src} className="absolute inset-0">
            <source media="(min-width: 1100px)" srcSet={asset(slide.src)} />
            <img
              alt=""
              src={asset(mobilePhoto(slide.src))}
              decoding="async"
              fetchPriority={slideIndex === 0 ? "high" : "low"}
              className={`h-full w-full object-cover object-center transition-opacity duration-500 ease-out ${
                slideIndex === index ? "relative z-10 opacity-100" : "opacity-0"
              }`}
            />
          </picture>
        ))
      ) : (
        <>
          <img
            alt=""
            src={asset(mobilePhoto(slides[index].src))}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center min-[1100px]:hidden"
          />
          <picture>
            <source media="(min-width: 1100px)" srcSet={asset(slides[index].src)} />
            <img
              alt=""
              src={asset(mobilePhoto(slides[index].src))}
              decoding="async"
              className="absolute top-0 left-0 hidden max-w-none transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] min-[1100px]:block"
              style={{ width: phase.w, height: phase.h, transform: `translate3d(${phase.x}px, ${phase.y}px, 0)` }}
            />
          </picture>
        </>
      )}
      {badge}
      <div className="pointer-events-none absolute top-[8px] left-1/2 z-20 flex -translate-x-1/2 items-center gap-[4px]">
        {slides.map((_, slideIndex) => (
          <span
            key={slideIndex}
            className={`rounded-full ${
              slideIndex === index ? "h-[8px] w-[16px] bg-[#8aa7d9]" : "size-[8px] bg-[#9bb6e5] opacity-50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
