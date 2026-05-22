"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

const COLORS = ["#6366f1", "#a855f7", "#818cf8", "#ec4899", "#0d9488"];

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    window.addEventListener("mousemove", onMouseMove);

    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    const particles = particlesRef.current;
    const PARTICLE_COUNT = 70;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.05,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: Math.random() * 240,
        maxLife: 240,
      });
    }

    const animate = () => {
      const ctx2 = ctxRef.current;
      if (!ctx2) return;
      ctx2.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        // Mouse interaction — gentle attraction
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            p.vx += dx * 0.00015;
            p.vy += dy * 0.00015;
          }
        }

        // Apply velocity
        p.x += p.vx;
        p.y += p.vy;

        // Soft drift wrapping
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Friction
        p.vx *= 0.999;
        p.vy *= 0.999;

        // Life-cycle pulsing opacity
        p.life = (p.life + 1) % p.maxLife;
        const pulse = Math.sin((p.life / p.maxLife) * Math.PI * 2) * 0.2 + 0.8;
        const alpha = p.opacity * pulse;

        ctx2.beginPath();
        ctx2.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx2.fillStyle = p.color;
        ctx2.globalAlpha = alpha;
        ctx2.fill();
      });

      // Draw connection lines between close particles
      ctx2.globalAlpha = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const lineAlpha = (1 - dist / 120) * 0.15;
            ctx2.beginPath();
            ctx2.moveTo(particles[i].x, particles[i].y);
            ctx2.lineTo(particles[j].x, particles[j].y);
            ctx2.strokeStyle = `rgba(99,102,241,${lineAlpha})`;
            ctx2.lineWidth = 0.5;
            ctx2.stroke();
          }
        }
      }

      // Mouse glow
      if (mouseRef.current.active) {
        const grd = ctx2.createRadialGradient(
          mouseRef.current.x, mouseRef.current.y, 0,
          mouseRef.current.x, mouseRef.current.y, 200
        );
        grd.addColorStop(0, "rgba(99,102,241,0.07)");
        grd.addColorStop(1, "rgba(99,102,241,0)");
        ctx2.globalAlpha = 1;
        ctx2.fillStyle = grd;
        ctx2.fillRect(0, 0, w, h);
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-[1] pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
