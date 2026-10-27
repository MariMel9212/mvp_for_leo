"use client";

import { useEffect, useRef } from "react";

const PER_COPY = 7000;

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
      let inkCount = 0;
      let minY = sh;
      let maxY = 0;
      for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
          const i = (y * sw + x) * 4;
          if (pixels[i + 3] > 24 && pixels[i] < 150) {
            ink[y * sw + x] = 1;
            inkCount += 1;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (!inkCount) return;

      const xs = new Int16Array(inkCount);
      const ys = new Int16Array(inkCount);
      const cumulative = new Float32Array(inkCount);
      let total = 0;
      let cursor = 0;
      const span = Math.max(1, maxY - minY);
      const heights = new Float32Array(inkCount);
      for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
          if (!ink[y * sw + x]) continue;
          const height = (maxY - y) / span;
          xs[cursor] = x;
          ys[cursor] = y;
          heights[cursor] = height;
          total += 0.035 + height ** 1.85;
          cumulative[cursor] = total;
          cursor += 1;
        }
      }

      const pick = () => {
        const target = Math.random() * total;
        let low = 0;
        let high = cumulative.length - 1;
        while (low < high) {
          const mid = (low + high) >> 1;
          if (cumulative[mid] < target) low = mid + 1;
          else high = mid;
        }
        return low;
      };

      for (let i = 0; i < PER_COPY; i++) {
        const index = pick();
        const homeX = xs[index] / sw;
        const homeY = (ys[index] - minY) / span;
        const height = heights[index];
        const phase = Math.random() * Math.PI * 2;
        const delay = Math.random() * 0.28;
        for (let copy = 0; copy < 2; copy++) {
          const x = homeX * 0.5 + copy * 0.5;
          particles.push({
            homeX: x,
            homeY,
            fromX: x + (Math.random() - 0.5) * 0.04,
            fromY: 1.08 + Math.random() * 0.22,
            height,
            phase: phase + copy * 1.4,
            delay,
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
          const radius = (0.85 + particle.height * 1.15) * scale;
          const r2 = radius * radius;
          const reach = Math.ceil(radius);
          const cx = x | 0;
          const cy = y | 0;
          const alpha = (0.12 + 0.88 * particle.height) * eased * 255;
          for (let dy = -reach; dy <= reach; dy++) {
            const py = cy + dy;
            if (py < 0 || py >= height) continue;
            for (let dx = -reach; dx <= reach; dx++) {
              if (dx * dx + dy * dy > r2) continue;
              const px = cx + dx;
              if (px < 0 || px >= width) continue;
              const index = (py * width + px) * 4;
              if (data[index + 3] >= alpha) continue;
              data[index] = 18;
              data[index + 1] = 22;
              data[index + 2] = 16;
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
