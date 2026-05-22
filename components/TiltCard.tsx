"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltMax?: number;
  glareIntensity?: number;
}

export default function TiltCard({
  children, 
  className = "",
  tiltMax = 12,
  glareIntensity = 0.15,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = -((y - centerY) / centerY) * tiltMax;
      const rotateY = ((x - centerX) / centerX) * tiltMax;
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      gsap.to(el, { rotateX, rotateY, transformPerspective: 1000, duration: 0.5, ease: "power2.out" });
    };

    const onEnter = () => setIsHovering(true);
    const onLeave = () => {
      setIsHovering(false);
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mousemove", onMove);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("mousemove", onMove);
    };
  }, [tiltMax]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {children}
      {isHovering && (
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, rgba(99,102,241,${glareIntensity}), transparent)`,
            mixBlendMode: "screen",
          }}  
        />
      )}
    </div>
  );
}
