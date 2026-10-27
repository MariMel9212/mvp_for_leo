"use client";

import { useEffect, useRef } from "react";

const BANDS = 10;

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

    let scale = 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      scale = dpr;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const img = new Image();
    img.src = "/hero/blades.png";
    img.onload = () => {
      if (!loop.alive) return;
      const sw = img.width;
      const sh = img.height;
      const sample = document.createElement("canvas");
      sample.width = sw;
      sample.height = sh;
      const sampleCtx = sample.getContext("2d", { willReadFrequently: true });
      if (!sampleCtx) return;
      sampleCtx.drawImage(img, 0, 0, sw, sh);
      const pixels = sampleCtx.getImageData(0, 0, sw, sh).data;

      const ink = new Uint8Array(sw * sh);
      let minX = sw;
      let maxX = 0;
      let minY = sh;
      let maxY = 0;
      let inkCount = 0;
      for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
          const i = (y * sw + x) * 4;
          if (pixels[i + 3] > 40) {
            ink[y * sw + x] = 1;
            inkCount += 1;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (!inkCount) return;

      const spanX = Math.max(1, maxX - minX);
      const spanY = Math.max(1, maxY - minY);
      const bands: number[][] = Array.from({ length: BANDS }, () => []);
      for (let y = minY; y <= maxY; y++) {
        const up = (maxY - y) / spanY;
        const band = Math.min(BANDS - 1, Math.floor((1 - up) * BANDS));
        for (let x = minX; x <= maxX; x++) {
          if (ink[y * sw + x]) bands[band].push(y * sw + x);
        }
      }

      for (let band = 0; band < BANDS; band++) {
        const pool = bands[band];
        if (!pool.length) continue;
        const down = band / (BANDS - 1);
        const spacing = 0.62 + down ** 1.15 * 2.3;
        const count = Math.max(1, Math.round(pool.length / (spacing * spacing)));
        for (let i = 0; i < count; i++) {
          const index = pool[(Math.random() * pool.length) | 0];
          const x = index % sw;
          const y = (index / sw) | 0;
          const homeX = (x - minX + Math.random()) / spanX;
          const homeY = (y - minY + Math.random()) / spanY;
          particles.push({
            homeX,
            homeY,
            fromX: homeX + (Math.random() - 0.5) * 0.02,
            fromY: 1.08 + Math.random() * 0.18,
            height: (maxY - y) / spanY,
            phase: Math.random() * Math.PI * 2,
            delay: Math.random() * 0.28,
          });
        }
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
        for (const particle of particles) {
          const t = reduce
            ? 1
            : Math.min(1, Math.max(0, (elapsed - particle.delay) / 1.15));
          const eased = easeOut(t);
          if (eased <= 0) continue;
          const sway = reduce
            ? 0
            : Math.sin(elapsed * 1.25 + particle.phase) *
              particle.height *
              particle.height *
              width *
              0.004;
          const x =
            (particle.fromX + (particle.homeX - particle.fromX) * eased) * width +
            sway * eased;
          const y =
            (particle.fromY + (particle.homeY - particle.fromY) * eased) * height;
          const radius = 1.65 * scale;
          const r2 = radius * radius;
          const reach = Math.ceil(radius);
          const cx = x | 0;
          const cy = y | 0;
          const alpha = eased * 255;
          for (let dy = -reach; dy <= reach; dy++) {
            const py = cy + dy;
            if (py < 0 || py >= height) continue;
            for (let dx = -reach; dx <= reach; dx++) {
              if (dx * dx + dy * dy > r2) continue;
              const px = cx + dx;
              if (px < 0 || px >= width) continue;
              const index = (py * width + px) * 4;
              data[index] = 20;
              data[index + 1] = 24;
              data[index + 2] = 18;
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
      className="absolute inset-0 block h-full w-full"
    />
  );
}
