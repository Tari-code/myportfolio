"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface LoadingScreenProps {
  isVisible?: boolean;
  onComplete?: () => void;
  fullScreen?: boolean;
}

export default function LoadingScreen({ isVisible = true, onComplete, fullScreen = true }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<SVGGElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);

  const colors = [
    '#3b82f6', // blue-500
    '#a855f7', // purple-500
    '#eab308', // yellow-500
    '#ef4444', // red-500
    '#22c55e', // green-500
    '#6366f1', // indigo-500
  ];

  const getLetterPoints = () => {
    const points: { x: number, y: number, letter: string }[] = [];

    // T
    for (let x = 5; x <= 35; x += 6) points.push({ x, y: 15, letter: 'T' });
    for (let y = 21; y <= 55; y += 6) points.push({ x: 20, y, letter: 'T' });

    // A
    points.push({ x: 55, y: 15, letter: 'A' });
    points.push({ x: 50, y: 25, letter: 'A' });
    points.push({ x: 60, y: 25, letter: 'A' });
    points.push({ x: 45, y: 35, letter: 'A' });
    points.push({ x: 65, y: 35, letter: 'A' });
    points.push({ x: 52, y: 35, letter: 'A' });
    points.push({ x: 58, y: 35, letter: 'A' });
    points.push({ x: 40, y: 45, letter: 'A' });
    points.push({ x: 70, y: 45, letter: 'A' });
    points.push({ x: 35, y: 55, letter: 'A' });
    points.push({ x: 75, y: 55, letter: 'A' });

    // R
    for (let y = 15; y <= 55; y += 8) points.push({ x: 90, y, letter: 'R' });
    points.push({ x: 98, y: 15, letter: 'R' });
    points.push({ x: 106, y: 15, letter: 'R' });
    points.push({ x: 110, y: 25, letter: 'R' });
    points.push({ x: 110, y: 35, letter: 'R' });
    points.push({ x: 106, y: 35, letter: 'R' });
    points.push({ x: 98, y: 35, letter: 'R' });
    points.push({ x: 102, y: 45, letter: 'R' });
    points.push({ x: 110, y: 55, letter: 'R' });

    // I
    for (let y = 15; y <= 55; y += 8) points.push({ x: 130, y, letter: 'I' });

    return points;
  };

  const points = getLetterPoints();

  useEffect(() => {
    if (isVisible) {
      const ctx = gsap.context(() => {
        // Entry
        gsap.to(containerRef.current, {
          opacity: 1,
          display: "flex",
          duration: 0.2,
          ease: "power2.out"
        });

        const dots = dotsRef.current?.children;
        if (dots) {
          // Drawing Animation: Dots flow from a single point
          const drawTl = gsap.timeline({
            onComplete: () => {
              if (onComplete) onComplete();
            }
          });

          // 1. Initial State: All dots at center (80, 40) relative to their final positions
          // Actually, using x/y offsets relative to their fixed cx/cy
          drawTl.fromTo(dots,
            {
              scale: 0,
              opacity: 0,
              x: (i) => 80 - points[i].x,
              y: (i) => 40 - points[i].y
            },
            {
              scale: 1,
              opacity: 1,
              x: 0,
              y: 0,
              duration: 1.2,
              stagger: 0.02,
              ease: "power3.out"
            }
          );

          // 2. Final Shine/Hold
          drawTl.to(dots, {
            filter: "brightness(1.5)",
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            stagger: 0.01
          });

          drawTl.to({}, { duration: 0.5 });

          // Independent Color Shifting
          Array.from(dots).forEach((dot) => {
            gsap.to(dot, {
              fill: () => colors[Math.floor(Math.random() * colors.length)],
              duration: "random(0.5, 1.5)",
              repeat: -1,
              repeatRefresh: true,
              ease: "sine.inOut"
            });
          });
        }

        // Global Pulse
        gsap.to(logoWrapperRef.current, {
          scale: 1.05,
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });

      return () => ctx.revert();
    } else {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          gsap.set(containerRef.current, { display: "none" });
        }
      });
    }
  }, [isVisible, onComplete]);

  return (
    <div
      ref={containerRef}
      className={`z-50 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${fullScreen
        ? 'fixed inset-0 bg-background'
        : 'relative py-20 px-6 rounded-[3rem]'
        }`}
      style={{ opacity: 0, display: isVisible ? 'flex' : 'none' }}
    >
      <div
        ref={logoWrapperRef}
        className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg"
      >
        <div className="relative w-64 h-32 flex items-center justify-center">
          <svg viewBox="0 0 160 80" className="w-full h-full drop-shadow-[0_0_20px_rgba(var(--brand-500-rgb),0.3)]">
            <g ref={dotsRef}>
              {points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y + 10}
                  r={2.2}
                  fill={colors[i % colors.length]}
                  className="transition-colors duration-500"
                />
              ))}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
