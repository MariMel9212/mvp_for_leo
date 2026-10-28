"use client";

import { useLayoutEffect, useRef } from "react";

const COUNT = 3500;
const CAMERA_Z = 900;
const TAN_HALF = Math.tan((75 * Math.PI) / 180 / 2);
const DOT = 2.8;

type Particle = {
  theta: number;
  r: number;
  speed: number;
  homeX: number;
  homeY: number;
  homeZ: number;
  fromX: number;
  fromY: number;
  fromZ: number;
  flyX: number;
  flyY: number;
  flyZ: number;
  progress: number;
  flyProgress: number;
  flyBack: number;
  offsetX: number;
  offsetY: number;
  offsetZ: number;
};

function ease(t: number) {
  return 1 - (1 - t) ** 3;
}

function band() {
  const compact = window.matchMedia("(max-width: 1599px)").matches;
  return compact ? { inner: 480, outer: 700 } : { inner: 350, outer: 610 };
}

function createParticles(inner: number, outer: number, settled: boolean) {
  const particles: Particle[] = [];
  const span = outer * 4;
  for (let index = 0; index < COUNT; index++) {
    const theta = Math.random() * Math.PI * 2;
    const radius = inner + Math.random() ** 2.5 * (outer - inner);
    const depth = (2 * Math.random() - 1) ** 4 * 100;
    const homeX = Math.cos(theta) * radius;
    const homeY = Math.sin(theta) * radius;
    particles.push({
      theta,
      r: radius,
      speed: 0.0001 + Math.random() * 0.0003,
      homeX,
      homeY,
      homeZ: depth,
      fromX: settled ? homeX : (Math.random() - 0.5) * span,
      fromY: settled ? homeY : (Math.random() - 0.5) * span,
      fromZ: settled ? depth : (Math.random() - 0.5) * 1000,
      flyX: (Math.random() - 0.5) * span,
      flyY: (Math.random() - 0.5) * span,
      flyZ: (Math.random() - 0.5) * 1000,
      progress: settled ? 1 : 0,
      flyProgress: 0,
      flyBack: 0,
      offsetX: 0,
      offsetY: 0,
      offsetZ: 0,
    });
  }
  return particles;
}

export function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(min-width: 769px)").matches;
    let { inner, outer } = band();
    let particles = createParticles(inner, outer, reduce);
    let flyOut = false;
    let pixelRatio = 1;
    const loop = { frame: 0, alive: true };
    const started = performance.now();
    let last = started;
    const pointer = { x: 0, y: 0, time: started, speed: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * pixelRatio));
      canvas.height = Math.max(1, Math.round(rect.height * pixelRatio));
      const next = band();
      if (next.inner !== inner || next.outer !== outer) {
        inner = next.inner;
        outer = next.outer;
        particles = createParticles(inner, outer, reduce || performance.now() - started > 2800);
      }
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const visibility = new IntersectionObserver(
      ([entry]) => {
        flyOut = !entry.isIntersecting;
      },
      { threshold: 0.45 },
    );
    visibility.observe(canvas);

    const onMove = (event: MouseEvent) => {
      if (!finePointer) return;
      const now = performance.now();
      const dt = now - pointer.time || 16;
      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;
      const traveled = Math.hypot(dx, dy);
      pointer.speed = pointer.speed * 0.8 + (traveled / dt) * 0.2;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.time = now;

      const rect = canvas.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      const worldX = nx * TAN_HALF * (rect.width / rect.height) * CAMERA_Z;
      const worldY = ny * TAN_HALF * CAMERA_Z;
      const strength = Math.min(pointer.speed, 1);
      const reach = 20 + 80 * strength;
      const force = 0.25 + 0.25 * strength;

      for (const particle of particles) {
        const dxHome = particle.homeX - worldX;
        const dyHome = particle.homeY - worldY;
        const dzHome = particle.homeZ - 0;
        const distance = Math.hypot(dxHome, dyHome, dzHome);
        if (distance <= 0 || distance >= reach) continue;
        const push = (reach - distance) * force * (0.8 + 0.4 * Math.random());
        const unit = distance;
        const side = 0.5 + 0.8 * Math.max(0, particle.homeY / outer);
        const nextX = particle.homeX + particle.offsetX + (dxHome / unit) * push * side;
        const nextY = particle.homeY + particle.offsetY + (dyHome / unit) * push;
        const radius = Math.hypot(nextX, nextY);
        if (radius < inner && radius > 0) {
          const scale = inner / radius;
          particle.offsetX = nextX * scale - particle.homeX;
          particle.offsetY = nextY * scale - particle.homeY;
        } else {
          particle.offsetX += (dxHome / unit) * push * side;
          particle.offsetY += (dyHome / unit) * push;
        }
        particle.offsetZ += (dzHome / unit) * push;
      }
    };
    window.addEventListener("mousemove", onMove);

    const draw = (now: number) => {
      if (!loop.alive) return;
      const dt = Math.min(48, now - last);
      last = now;
      const frames = dt / 16.67;
      const width = canvas.width;
      const height = canvas.height;
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#b2c7eb";
      canvas.style.opacity = reduce ? "1" : String(Math.min(1, (now - started) / 1000));

      for (const particle of particles) {
        let x: number;
        let y: number;
        let z: number;

        if (!reduce && flyOut) {
          particle.flyProgress = Math.min(1, particle.flyProgress + 0.02 * frames);
          particle.flyBack = 0;
          const t = ease(particle.flyProgress);
          x = particle.homeX + (particle.flyX - particle.homeX) * t;
          y = particle.homeY + (particle.flyY - particle.homeY) * t;
          z = particle.homeZ + (particle.flyZ - particle.homeZ) * t;
        } else if (!reduce && particle.flyProgress > 0) {
          if (particle.flyProgress >= 1) {
            particle.flyProgress = 0.99;
            particle.flyBack = 0;
          }
          particle.flyBack = Math.min(1, particle.flyBack + 0.006 * frames);
          const t = ease(particle.flyBack);
          x = particle.flyX + (particle.homeX - particle.flyX) * t;
          y = particle.flyY + (particle.homeY - particle.flyY) * t;
          z = particle.flyZ + (particle.homeZ - particle.flyZ) * t;
          if (particle.flyBack === 1) particle.flyProgress = 0;
        } else if (!reduce && particle.progress < 1) {
          particle.flyProgress = 0;
          particle.progress = Math.min(1, particle.progress + 0.006 * frames);
          const t = ease(particle.progress);
          x = particle.fromX + (particle.homeX - particle.fromX) * t;
          y = particle.fromY + (particle.homeY - particle.fromY) * t;
          z = particle.fromZ + (particle.homeZ - particle.fromZ) * t;
        } else {
          particle.flyProgress = 0;
          const settle = 1 - 0.92 ** frames;
          particle.offsetX += (0 - particle.offsetX) * settle;
          particle.offsetY += (0 - particle.offsetY) * settle;
          particle.offsetZ += (0 - particle.offsetZ) * settle;
          if (!reduce) {
            particle.theta -= particle.speed * frames;
            particle.homeX = Math.cos(particle.theta) * particle.r;
            particle.homeY = Math.sin(particle.theta) * particle.r;
          }
          x = particle.homeX + particle.offsetX;
          y = particle.homeY + particle.offsetY;
          z = particle.homeZ + particle.offsetZ;
        }

        const depth = CAMERA_Z - z;
        if (depth <= 1) continue;
        const scale = height / 2 / (depth * TAN_HALF);
        const sx = width / 2 + x * scale;
        const sy = height / 2 - y * scale;
        const radius = (DOT * scale) / 2;
        if (sx < -radius || sy < -radius || sx > width + radius || sy > height + radius) continue;
        context.beginPath();
        context.arc(sx, sy, Math.max(0.45, radius), 0, Math.PI * 2);
        context.fill();
      }

      loop.frame = requestAnimationFrame(draw);
    };
    loop.frame = requestAnimationFrame(draw);

    return () => {
      loop.alive = false;
      cancelAnimationFrame(loop.frame);
      observer.disconnect();
      visibility.disconnect();
      window.removeEventListener("mousemove", onMove);
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
