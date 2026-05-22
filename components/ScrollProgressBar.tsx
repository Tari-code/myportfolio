"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ScrollProgressBar() {
  const progressRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let current = 0;
    let target = 0;

    const update = () => {
      current += (target - current) * 0.08;

      if (progressRef.current) {
        gsap.set(progressRef.current, { scaleX: current / 100 });
      }

      rafRef.current = requestAnimationFrame(update);
    };

    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      target = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    rafRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-full h-[3px] z-[10001] origin-left"
      style={{ transformOrigin: "left center" }}
    >
      <div
        ref={progressRef}
        className="h-full w-full"
        style={{
          background: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)",
          boxShadow: "0 0 12px rgba(99,102,241,0.6), 0 0 30px rgba(168,85,247,0.3)",
          transform: "scaleX(0)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
