"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  driftX: number;
  alpha: number;
  twinkle: number;
  green: boolean;
}

interface ParticlesCanvasProps {
  density?: number;
  className?: string;
}

// Partículas verdes/blancas flotando (requisito #10 de animaciones avanzadas)
export function ParticlesCanvas({
  density = 60,
  className = "",
}: ParticlesCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let raf = 0;

    const createParticles = () => {
      const count = Math.round(
        (density * canvas.width * canvas.height) / (1440 * 900)
      );
      particles = Array.from({ length: Math.max(count, 20) }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.2 + 0.4,
        speedY: Math.random() * 0.35 + 0.08,
        driftX: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.5 + 0.15,
        twinkle: Math.random() * Math.PI * 2,
        green: Math.random() > 0.35,
      }));
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      createParticles();
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.y -= p.speedY;
        p.x += p.driftX;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        const flicker = 0.65 + 0.35 * Math.sin(time / 900 + p.twinkle);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.green
          ? `rgba(74, 222, 128, ${p.alpha * flicker})`
          : `rgba(248, 250, 252, ${p.alpha * flicker * 0.8})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);

    const observer = new ResizeObserver(resize);
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    />
  );
}
