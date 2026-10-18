"use client";

import { useEffect, useRef } from "react";

interface Flake {
  x: number;
  y: number;
  r: number;
  speed: number;
  sway: number;
  swaySpeed: number;
  phase: number;
  opacity: number;
}

export default function Snowfall() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let width = 0;
    let height = 0;
    let flakes: Flake[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const spawn = (initial: boolean): Flake => ({
      x: Math.random() * width,
      y: initial ? Math.random() * height : -8,
      r: 0.8 + Math.random() * 2.4,
      speed: 0.35 + Math.random() * 0.9,
      sway: 12 + Math.random() * 32,
      swaySpeed: 0.3 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.35 + Math.random() * 0.55,
    });

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.min(160, Math.floor((width * height) / 14000));
      flakes = Array.from({ length: target }, () => spawn(true));
    };

    let last = performance.now();
    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - last) / 16.7, 3);
      last = now;
      ctx.clearRect(0, 0, width, height);
      const t = now / 1000;

      for (const f of flakes) {
        f.y += f.speed * dt;
        f.phase += f.swaySpeed * dt * 0.02;
        if (f.y > height + 8) {
          Object.assign(f, spawn(false));
        }
        const x = f.x + Math.sin(t * f.swaySpeed + f.phase) * f.sway;
        const tw = 0.75 + 0.25 * Math.sin(t * 2 + f.phase * 3);
        ctx.beginPath();
        ctx.arc(x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(235, 243, 255, ${(f.opacity * tw).toFixed(3)})`;
        ctx.shadowColor = "rgba(200, 225, 255, 0.8)";
        ctx.shadowBlur = f.r * 2.2;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(raf);
      }
    };

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60]"
    />
  );
}
