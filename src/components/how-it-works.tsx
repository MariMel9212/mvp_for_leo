"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const steps = [
  "Заполните заявку, указав удобный метод связи",
  "Расскажите о\u00a0ситуации",
  "Мы подберем несколько вариантов под\u00a0ваши критерии",
  "Свяжем вас с\u00a0центром и\u00a0сопроводим на\u00a0моменте подписания договора",
];

type Label = {
  x: number;
  y: number;
  w: number;
  anchorX: number;
  anchorY: number;
  rule: "above" | "below";
};

type Scene = {
  d: string;
  width: number;
  height: number;
  labels: Label[];
};

// The stroke stays inside a channel; phrases sit above it or below it and never on it.
const desktop: Scene = {
  d: "M 48 236 C 110 168 186 160 258 190 C 348 228 390 312 478 316 C 572 320 628 164 728 158 C 828 152 888 304 978 310",
  width: 1000,
  height: 460,
  labels: [
    { x: 36, y: 62, w: 280, anchorX: 186, anchorY: 168, rule: "below" },
    { x: 330, y: 342, w: 270, anchorX: 478, anchorY: 316, rule: "above" },
    { x: 560, y: 36, w: 300, anchorX: 728, anchorY: 158, rule: "below" },
    { x: 690, y: 342, w: 290, anchorX: 940, anchorY: 308, rule: "above" },
  ],
};

const mobile: Scene = {
  d: "M 26 40 C 52 100 8 160 26 210 C 54 280 6 350 26 410 C 54 480 8 540 26 590",
  width: 360,
  height: 660,
  labels: [
    { x: 70, y: 16, w: 274, anchorX: 26, anchorY: 40, rule: "above" },
    { x: 70, y: 176, w: 274, anchorX: 26, anchorY: 210, rule: "above" },
    { x: 70, y: 360, w: 274, anchorX: 26, anchorY: 410, rule: "above" },
    { x: 70, y: 530, w: 274, anchorX: 26, anchorY: 590, rule: "above" },
  ],
};

const LOOP_MS = 18000;

function closestFraction(path: SVGPathElement, x: number, y: number) {
  const length = path.getTotalLength();
  let bestT = 0;
  let best = Infinity;
  for (let i = 0; i <= 240; i++) {
    const t = i / 240;
    const point = path.getPointAtLength(length * t);
    const dist = (point.x - x) ** 2 + (point.y - y) ** 2;
    if (dist < best) {
      best = dist;
      bestT = t;
    }
  }
  return bestT;
}

function travel(elapsed: number) {
  if (elapsed < 1800) return elapsed / 1800;
  const t = ((elapsed - 1800) % LOOP_MS) / LOOP_MS;
  return t < 0.5 ? 1 - t * 2 : (t - 0.5) * 2;
}

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const fractions = useRef<number[]>([0, 0.33, 0.66, 1]);
  const pin = useRef<number | null>(null);
  const penRef = useRef<HTMLSpanElement>(null);
  const [wide, setWide] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(0);

  const scene = wide ? desktop : mobile;

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const layout = window.matchMedia("(min-width: 768px)");
    const apply = () => {
      setReduced(motion.matches);
      setWide(layout.matches);
    };
    apply();
    motion.addEventListener("change", apply);
    layout.addEventListener("change", apply);
    return () => {
      motion.removeEventListener("change", apply);
      layout.removeEventListener("change", apply);
    };
  }, []);

  useEffect(() => {
    const path = pathRef.current;
    const glow = glowRef.current;
    if (!path || !glow) return;

    const length = path.getTotalLength();
    fractions.current = scene.labels.map((label) =>
      closestFraction(path, label.anchorX, label.anchorY),
    );

    if (reduced) {
      path.style.strokeDasharray = "none";
      path.style.strokeDashoffset = "0";
      glow.style.opacity = "0";
      if (penRef.current) penRef.current.style.opacity = "0";
      return;
    }

    path.style.transition = "none";
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    const reveal = requestAnimationFrame(() => {
      path.style.transition = "stroke-dashoffset 1.8s cubic-bezier(0.22, 1, 0.36, 1)";
      path.style.strokeDashoffset = "0";
    });

    glow.style.opacity = "1";
    glow.style.strokeDasharray = `36 ${length}`;

    let frame = 0;
    const started = performance.now();
    const tick = (now: number) => {
      const elapsed = now - started;
      const pinned = pin.current;
      const progress = pinned === null ? travel(elapsed) : pinned;
      const point = path.getPointAtLength(length * Math.min(progress, 0.999));
      const marks = fractions.current;
      let nearest = 0;
      let nearestDist = Infinity;
      for (let i = 0; i < marks.length; i++) {
        const dist = Math.abs(progress - marks[i]);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = i;
        }
      }
      setActive((prev) => (prev === nearest ? prev : nearest));
      const pen = penRef.current;
      if (pen) {
        pen.style.opacity = "1";
        pen.style.left = `${(point.x / scene.width) * 100}%`;
        pen.style.top = `${(point.y / scene.height) * 100}%`;
      }
      glow.style.strokeDashoffset = `${length * (1 - progress)}`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(reveal);
      cancelAnimationFrame(frame);
    };
  }, [reduced, scene, wide]);

  return (
    <section
      id="kak-rabotaet"
      ref={sectionRef}
      className="mx-auto w-full max-w-[940px] px-4 pt-16 min-[768px]:pt-24 min-[1440px]:max-w-[1180px] min-[1440px]:pt-28"
    >
      <h2 className="text-center text-[32px] leading-[1.1] font-medium text-black min-[768px]:text-[44px] min-[1440px]:text-[56px]">
        Как работает подбор
      </h2>

      <div
        className="relative mt-10 min-[768px]:mt-14"
        style={{ aspectRatio: `${scene.width} / ${scene.height}` }}
        onMouseLeave={() => {
          pin.current = null;
        }}
      >
        <svg
          aria-hidden
          className="absolute inset-0 h-full w-full overflow-visible"
          viewBox={`0 0 ${scene.width} ${scene.height}`}
          preserveAspectRatio="none"
        >
          <path
            ref={pathRef}
            d={scene.d}
            fill="none"
            stroke="#11ab09"
            strokeOpacity={0.28}
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            ref={glowRef}
            d={scene.d}
            fill="none"
            stroke="#11ab09"
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <span
          ref={penRef}
          aria-hidden
          className="pointer-events-none absolute size-2.5 rounded-full bg-[#11ab09] opacity-0 shadow-[0_0_0_7px_rgba(17,171,9,0.16)]"
          style={{ transform: "translate(-50%, -50%)" }}
        />

        <ol className="absolute inset-0 m-0 list-none p-0">
          {steps.map((text, index) => {
            const label = scene.labels[index];
            return (
              <li
                key={text}
                className="absolute"
                style={{
                  left: `${(label.x / scene.width) * 100}%`,
                  top: `${(label.y / scene.height) * 100}%`,
                  width: `${(label.w / scene.width) * 100}%`,
                }}
                onMouseEnter={() => {
                  pin.current = fractions.current[index] ?? index / (steps.length - 1);
                }}
                onFocus={() => {
                  pin.current = fractions.current[index] ?? index / (steps.length - 1);
                }}
                onBlur={() => {
                  pin.current = null;
                }}
              >
                {label.rule === "above" && (
                  <span
                    aria-hidden
                    className={cn(
                      "mb-2 block h-0.5 w-7 rounded-full bg-[#11ab09] transition-opacity duration-500",
                      reduced || active === index ? "opacity-100" : "opacity-0",
                    )}
                  />
                )}
                <p
                  tabIndex={0}
                  className={cn(
                    "text-[15px] leading-[1.35] font-medium text-[#0a0d14] transition-opacity duration-500 outline-none focus-visible:outline-2 focus-visible:outline-[#11ab09] min-[768px]:text-[17px] min-[1440px]:text-[20px]",
                    reduced || active === index ? "opacity-100" : "opacity-35",
                  )}
                >
                  {text}
                </p>
                {label.rule === "below" && (
                  <span
                    aria-hidden
                    className={cn(
                      "mt-2 block h-0.5 w-7 rounded-full bg-[#11ab09] transition-opacity duration-500",
                      reduced || active === index ? "opacity-100" : "opacity-0",
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
