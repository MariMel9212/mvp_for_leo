"use client";

import { useEffect, useRef } from "react";

const COUNT = 12000;

type Particle = {
  homeX: number;
  homeY: number;
  fromX: number;
  fromY: number;
  height: number;
  phase: number;
  delay: number;
};

function easeOut(t: number) {
  return 1 - (1 - t) ** 3;
}

export function HeroGrass() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = { frame: 0, alive: true };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const particles: Particle[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const img = new Image();
    img.src = "/hero/grass.png";
    img.onload = () => {
      if (!loop.alive) return;
      const sw = 520;
      const sh = Math.max(1, Math.round((sw * img.height) / img.width));
      const sample = document.createElement("canvas");
      sample.width = sw;
      sample.height = sh;
      const sampleCtx = sample.getContext("2d", { willReadFrequently: true });
      if (!sampleCtx) return;
      sampleCtx.drawImage(img, 0, 0, sw, sh);
      const pixels = sampleCtx.getImageData(0, 0, sw, sh).data;

      const spots: { x: number; y: number }[] = [];
      let minY = sh;
      let maxY = 0;
      for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
          const i = (y * sw + x) * 4;
          if (pixels[i] < 128) {
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            spots.push({ x, y });
          }
        }
      }
      if (!spots.length) return;

      const span = Math.max(1, maxY - minY);
      const heights = new Float32Array(spots.length);
      for (let i = 0; i < spots.length; i++) {
        heights[i] = (maxY - spots[i].y) / span;
      }

      for (let i = 0; i < COUNT; i++) {
        const index = (Math.random() * spots.length) | 0;
        const spot = spots[index];
        const homeX = spot.x / sw;
        const homeY = (spot.y - minY) / span;
        particles.push({
          homeX,
          homeY,
          fromX: homeX + (Math.random() - 0.5) * 0.16,
          fromY: 1.2 + Math.random() * 0.5,
          height: heights[index],
          phase: Math.random() * Math.PI * 2,
          delay: Math.random() * 0.4,
        });
      }

      const started = performance.now();
      let buffer: ImageData | null = null;
      const draw = (now: number) => {
        if (!loop.alive) return;
        const width = canvas.width;
        const height = canvas.height;
        if (!buffer || buffer.width !== width || buffer.height !== height) {
          buffer = ctx.createImageData(width, height);
        }
        const data = buffer.data;
        data.fill(0);
        const elapsed = (now - started) / 1000;
        const radius = Math.max(1.4, width / 900);
        const r2 = radius * radius;
        const reach = Math.ceil(radius);
        for (const particle of particles) {
          const t = reduce
            ? 1
            : Math.min(1, Math.max(0, (elapsed - particle.delay) / 1.25));
          const eased = easeOut(t);
          if (eased <= 0) continue;
          const sway = reduce
            ? 0
            : Math.sin(elapsed * 1.25 + particle.phase) *
              particle.height *
              particle.height *
              width *
              0.011;
          const x =
            (particle.fromX + (particle.homeX - particle.fromX) * eased) * width +
            sway * eased;
          const y =
            (particle.fromY + (particle.homeY - particle.fromY) * eased) * height;
          const cx = x | 0;
          const cy = y | 0;
          const alpha = (0.55 + 0.45 * eased) * 255;
          for (let dy = -reach; dy <= reach; dy++) {
            const py = cy + dy;
            if (py < 0 || py >= height) continue;
            for (let dx = -reach; dx <= reach; dx++) {
              if (dx * dx + dy * dy > r2) continue;
              const px = cx + dx;
              if (px < 0 || px >= width) continue;
              const index = (py * width + px) * 4;
              data[index] = 26;
              data[index + 1] = 36;
              data[index + 2] = 24;
              data[index + 3] = alpha;
            }
          }
        }
        ctx.putImageData(buffer, 0, 0);
        loop.frame = requestAnimationFrame(draw);
      };
      loop.frame = requestAnimationFrame(draw);
    };

    return () => {
      loop.alive = false;
      cancelAnimationFrame(loop.frame);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="block h-full w-full"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
