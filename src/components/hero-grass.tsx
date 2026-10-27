"use client";

import { useEffect, useRef } from "react";

const COUNT = 15000;

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

      const depth = new Int16Array(sw * sh);
      depth.fill(-1);
      const queue = new Int32Array(inkCount);
      let head = 0;
      let tail = 0;
      const seed = (index: number) => {
        depth[index] = 1;
        queue[tail] = index;
        tail += 1;
      };
      for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
          const index = y * sw + x;
          if (!ink[index]) continue;
          const outside =
            x === 0 ||
            y === 0 ||
            x === sw - 1 ||
            y === sh - 1 ||
            !ink[index - 1] ||
            !ink[index + 1] ||
            !ink[index - sw] ||
            !ink[index + sw];
          if (outside) seed(index);
        }
      }
      while (head < tail) {
        const index = queue[head];
        head += 1;
        const next = depth[index] + 1;
        const x = index % sw;
        const neighbors = [index - 1, index + 1, index - sw, index + sw];
        for (let n = 0; n < 4; n++) {
          const neighbor = neighbors[n];
          if (n < 2 && ((n === 0 && x === 0) || (n === 1 && x === sw - 1))) continue;
          if (neighbor < 0 || neighbor >= ink.length) continue;
          if (!ink[neighbor] || depth[neighbor] >= 0) continue;
          depth[neighbor] = next;
          queue[tail] = neighbor;
          tail += 1;
        }
      }

      let maxDepth = 1;
      for (let i = 0; i < depth.length; i++) {
        if (depth[i] > maxDepth) maxDepth = depth[i];
      }

      const spanX = Math.max(1, maxX - minX);
      const spanY = Math.max(1, maxY - minY);
      const xs = new Int16Array(inkCount);
      const ys = new Int16Array(inkCount);
      const cumulative = new Float32Array(inkCount);
      let total = 0;
      let cursor = 0;
      for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
          const index = y * sw + x;
          if (depth[index] < 1) continue;
          const inside = depth[index] / maxDepth;
          xs[cursor] = x;
          ys[cursor] = y;
          total += 0.015 + inside ** 1.65;
          cumulative[cursor] = total;
          cursor += 1;
        }
      }

      const pick = () => {
        const target = Math.random() * total;
        let low = 0;
        let high = cursor - 1;
        while (low < high) {
          const mid = (low + high) >> 1;
          if (cumulative[mid] < target) low = mid + 1;
          else high = mid;
        }
        return low;
      };

      for (let i = 0; i < COUNT; i++) {
        const index = pick();
        const x = xs[index];
        const y = ys[index];
        const homeX = (x - minX + Math.random()) / spanX;
        const homeY = (y - minY + Math.random()) / spanY;
        particles.push({
          homeX,
          homeY,
          fromX: homeX + (Math.random() - 0.5) * 0.03,
          fromY: 1.08 + Math.random() * 0.18,
          height: (maxY - y) / spanY,
          phase: Math.random() * Math.PI * 2,
          delay: Math.random() * 0.28,
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
