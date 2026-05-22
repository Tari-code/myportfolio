"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const isHoveringRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(hover: none)").matches;
    if (isTouchDevice) {
      setIsDesktop(false);
      return;
    }
    setIsDesktop(true);

    const ring = ringRef.current;
    const dot = dotRef.current;
    const cursor = cursorRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Dot follows instantly
      gsap.to(dot, { x: e.clientX - 6, y: e.clientY - 6, duration: 0.1, ease: "power2.out" });
    };

    const raf = () => {
      // Ring follows with lag using lerp
      ringPosRef.current.x += (mouseRef.current.x - ringPosRef.current.x) * 0.12;
      ringPosRef.current.y += (mouseRef.current.y - ringPosRef.current.y) * 0.12;

      if (ring) {
        gsap.set(ring, { x: ringPosRef.current.x - 18, y: ringPosRef.current.y - 18 });
      }
      requestAnimationFrame(raf);
    };

    window.addEventListener("mousemove", handleMouseMove);
    const rafId = requestAnimationFrame(raf);

    // Hover magnetic effect on interactive elements
    const interactiveElements = document.querySelectorAll("a, button, [data-magnetic]");

    const onMouseEnter = () => {
      isHoveringRef.current = true;
      gsap.to(ring, {
        scale: 2.2,
        borderColor: "rgba(99, 102, 241, 0.6)",
        duration: 0.3,
        ease: "power2.out"
      });
      gsap.to(dot, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: "power2.out"
      });
    };

    const onMouseLeave = () => {
      isHoveringRef.current = false;
      gsap.to(ring, {
        scale: 1,
        borderColor: "rgba(99, 102, 241, 0.3)",
        duration: 0.4,
        ease: "elastic.out(1, 0.5)"
      });
      gsap.to(dot, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", onMouseEnter);
      el.addEventListener("mouseleave", onMouseLeave);
    });

    const observer = new MutationObserver(() => {
      document.querySelectorAll("a, button:not([data-no-magnetic])").forEach((el) => {
        if (!(el as HTMLElement).hasAttribute("data-magnetic-bound")) {
          (el as HTMLElement).setAttribute("data-magnetic-bound", "true");
          el.addEventListener("mouseenter", onMouseEnter);
          el.addEventListener("mouseleave", onMouseLeave);
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnter);
        el.removeEventListener("mouseleave", onMouseLeave);
      });
      observer.disconnect();
    };
  }, []);

  if (!isDesktop) return null;

  return (
    <>
      {/* Main ring cursor */}
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[10000] mix-blend-difference"
        style={{
          left: 0,
          top: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1.5px solid rgba(99,102,241,0.3)",
          willChange: "transform",
        }}
      />
      {/* Dot cursor */}
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[10000]"
        style={{
          left: 0,
          top: 0,
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #818cf8, #a855f7)",
          willChange: "transform",
        }}
      />
      {/* Gradient glow trail */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] opacity-0"
        style={{
          left: 0,
          top: 0,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
          willChange: "left, top",
        }}
      />
    </>
  );
}
