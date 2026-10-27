"use client";

import { useLayoutEffect, useRef } from "react";
import points from "@/data/pointfield.json";

const TILE_W = 727.1325073242188;
const TILE_H = 184;
const STRIP_W = 2170.313232421875;
const COPIES = [0, 721.5904541015625, 1443.1807861328125];
const STRIP_LEFT = -0.3484;
const STRIP_WIDTH = 1.6955;

type Particle = {
  stripX: number;
  stripY: number;
  fromX: number;
  fromY: number;
  height: number;
  phase: number;
  appear: number;
  moveAt: number;
  travel: number;
  bow: number;
  trail: number;
};

function ease(t: number) {
  return 1 - (1 - t) ** 2;
}

function unit(seed: number) {
  const value = Math.sin(seed * 127.1) * 43758.5453;
  return value - Math.floor(value);
}

export function HeroGrass() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
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

    let seed = 1;
    for (let i = 0; i < points.length; i += 2) {
      const x = points[i];
      const y = points[i + 1];
      const height = (maxY - y) / spanY;
      const phase = ((i * 17) % 628) / 100;
      const places = [x];
      // Only the tip of the neighboring blade, so it fills the bare column
      // without landing on the grass that is already there.
      if (x >= 263 && x <= 300) places.push(x + 140);
      for (const placeX of places) {
        for (const origin of COPIES) {
          const stripX = (origin + placeX) / STRIP_W;
          const depth = Math.min(1, Math.max(0, (y - 124) / (maxY - 124)));
          const roll = unit(i * 0.37 + 2.2);
          const stretch = depth * depth * depth * (0.18 + roll * roll) * 30;
          const stripY = (y + stretch) / TILE_H;
          const trail = Math.min(1, stretch / 30);
          const a = unit(seed++);
          const b = unit(seed++);
          const c = unit(seed++);
          particles.push({
            stripX,
            stripY,
            fromX: (a - 0.5) * 16,
            fromY: 8 + b * 18,
            height,
            phase: phase + origin * 0.001,
            appear: 0,
            moveAt: a * 0.06,
            travel: 0.7 + b * 0.35,
            bow: (c - 0.5) * 8,
            trail,
          });
        }
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
      const swayScale = 6 * pixelRatio;
      const grassPx =
        Math.min(360, Math.max(220, (width / pixelRatio) * 0.215)) * pixelRatio;
      for (const particle of particles) {
        const appeared = reduce
          ? 1
          : Math.min(1, 0.9 + (elapsed - particle.appear) / 0.12);
        if (appeared <= 0) continue;
        const t = reduce
          ? 1
          : Math.min(1, Math.max(0, (elapsed - particle.moveAt) / particle.travel));
        const eased = ease(t);
        const settled = reduce
          ? 1
          : Math.min(1, Math.max(0, (t - 0.82) / 0.18));
        const sway = reduce
          ? 0
          : Math.sin(elapsed * 1.15 + particle.phase) *
            particle.height *
            particle.height *
            swayScale *
            settled * settled;
        const endX = (STRIP_LEFT + particle.stripX * STRIP_WIDTH) * width;
        const tailPx = 52 * pixelRatio;
        const endY = height - tailPx - grassPx + particle.stripY * grassPx;
        const bow = Math.sin(eased * Math.PI) * particle.bow * pixelRatio;
        const x = endX + (particle.fromX * pixelRatio + bow) * (1 - eased) + sway;
        const y = endY + particle.fromY * pixelRatio * (1 - eased);
        const cx = x | 0;
        const cy = y | 0;
        const alpha = appeared * 132 * (1 - particle.trail * 0.78);
        for (let dy = -reach; dy <= reach; dy++) {
          const py = cy + dy;
          if (py < 0 || py >= height) continue;
          for (let dx = -reach; dx <= reach; dx++) {
            if (dx * dx + dy * dy > r2) continue;
            const px = cx + dx;
            if (px < 0 || px >= width) continue;
            const index = (py * width + px) * 4;
            data[index] = 118;
            data[index + 1] = 170;
            data[index + 2] = 96;
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
