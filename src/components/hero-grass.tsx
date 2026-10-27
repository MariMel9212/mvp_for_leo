"use client";

import { useEffect, useRef } from "react";

const PER_COPY = 9000;
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
    img.src = "/hero/meadow.png";
    img.onload = () => {
      if (!loop.alive) return;
      const sw = 1100;
      const sh = Math.max(1, Math.round((sw * img.height) / img.width));
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
      for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
          const i = (y * sw + x) * 4;
          if (pixels[i + 3] > 24 && pixels[i] < 150) {
            ink[y * sw + x] = 1;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (maxX < minX) return;

      const spanX = Math.max(1, maxX - minX);
      const spanY = Math.max(1, maxY - minY);
      const bands: number[][] = Array.from({ length: BANDS }, () => []);
      for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
          if (!ink[y * sw + x]) continue;
          const height = (maxY - y) / spanY;
          const band = Math.min(BANDS - 1, Math.floor((1 - height) * BANDS));
          bands[band].push(y * sw + x);
        }
      }

      const bandWeight = bands.map((pixelsInBand, index) => {
        if (!pixelsInBand.length) return 0;
        const down = index / (BANDS - 1);
        return 0.08 + (1 - down) ** 1.8;
      });
      const weightSum = bandWeight.reduce((sum, weight) => sum + weight, 0);
      const copySpan = 0.76;

      const place = (index: number, copy: number) => {
        const x = index % sw;
        const y = (index / sw) | 0;
        const localX = (x - minX + Math.random()) / spanX;
        const homeX = localX * copySpan + copy * (1 - copySpan);
        const homeY = (y - minY + Math.random()) / spanY;
        particles.push({
          homeX,
          homeY,
          fromX: homeX + (Math.random() - 0.5) * 0.03,
          fromY: 1.08 + Math.random() * 0.2,
          height: (maxY - y) / spanY,
          phase: Math.random() * Math.PI * 2,
          delay: Math.random() * 0.28,
        });
      };

      for (let band = 0; band < BANDS; band++) {
        const pool = bands[band];
        if (!pool.length || weightSum === 0) continue;
        const count = Math.round((PER_COPY * bandWeight[band]) / weightSum);
        for (let i = 0; i < count; i++) {
          const index = pool[(Math.random() * pool.length) | 0];
          place(index, 0);
          place(index, 1);
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
          const radius = 1.35 * scale;
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
