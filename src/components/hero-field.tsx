"use client";

import { useLayoutEffect, useRef } from "react";

declare global {
  interface Window {
    bootHeroField?: (canvas: HTMLCanvasElement) => (() => void) | null;
  }
}

export function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const stop = window.bootHeroField?.(canvas);
    return () => stop?.();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-hero-field=""
      aria-hidden
      suppressHydrationWarning
      className="absolute inset-0 block h-full w-full"
    />
  );
}
