"use client";

import { useEffect, useRef } from "react";
import points from "@/data/pointfield.json";

const TILE_W = 727.1325073242188;
const TILE_H = 184;
const STRIP_W = 2170.313232421875;
const COPIES = [0, 721.5904541015625, 1443.1807861328125];

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
    let minY = TILE_H;
    let maxY = 0;
    for (let i = 1; i < points.length; i += 2) {
      const y = points[i];
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    const spanY = Math.max(1, maxY - minY);

    for (let i = 0; i < points.length; i += 2) {
      const x = points[i];
      const y = points[i + 1];
      const height = (maxY - y) / spanY;
      const phase = ((i * 17) % 628) / 100;
      const delay = ((i * 13) % 100) / 400;
      for (const origin of COPIES) {
        const homeX = (origin + x) / STRIP_W;
        const homeY = y / TILE_H;
        particles.push({
          homeX,
          homeY,
          fromX: homeX,
          fromY: homeY + 0.18 + ((i * 7) % 50) / 400,
          height,
          phase: phase + origin * 0.001,
          delay,
        });
      }
    }

    let pixelRatio = 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * pixelRatio));
      canvas.height = Math.max(1, Math.round(rect.height * pixelRatio));
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

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
      const radius = 0.83 * pixelRatio;
      const r2 = radius * radius;
      const reach = Math.ceil(radius);
      const swayScale = width * (TILE_W / STRIP_W) * 0.004;
      for (const particle of particles) {
        const t = reduce
          ? 1
          : Math.min(1, Math.max(0, (elapsed - particle.delay) / 0.9));
        const eased = easeOut(t);
        const sway = reduce
          ? 0
          : Math.sin(elapsed * 1.1 + particle.phase) *
            particle.height *
            particle.height *
            swayScale;
        const x = (particle.fromX + (particle.homeX - particle.fromX) * eased) * width + sway * eased;
        const y = (particle.fromY + (particle.homeY - particle.fromY) * eased) * height;
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
            data[index] = 17;
            data[index + 1] = 171;
            data[index + 2] = 9;
            data[index + 3] = alpha;
          }
        }
      }
      ctx.putImageData(buffer, 0, 0);
      loop.frame = requestAnimationFrame(draw);
    };
    loop.frame = requestAnimationFrame(draw);

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
