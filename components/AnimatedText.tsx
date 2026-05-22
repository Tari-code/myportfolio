"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedTextProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  staggerDelay?: number;
}

export default function AnimatedText({
  children,
  className = "",
  as: Tag = "span",
  staggerDelay = 0.035,
}: AnimatedTextProps) {
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [splitMode, setSplitMode] = useState<"chars" | "words">("chars");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (splitMode === "words") {
        if (!containerRef.current) return;
        gsap.from(containerRef.current.querySelectorAll<HTMLElement>(".anim-word"), {
          y: 60,
          opacity: 0,
          rotationX: -15,
          duration: 0.9,
          ease: "expo.out",
          stagger: staggerDelay,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      } else {
        charsRef.current.forEach((_, i) => {
          if (!charsRef.current[i]) return;
          gsap.from(charsRef.current[i]!, {
            y: 40,
            opacity: 0,
            scale: 0.5,
            rotationZ: -8,
            duration: 0.7,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: charsRef.current[i]!,
              start: "top 92%",
              toggleActions: "play none none none",
            },
          });
        });
      }
    });

    return () => ctx.revert();
  }, [children, splitMode, staggerDelay]);

  // Decide split mode by element type
  useEffect(() => {
    const el = document.createElement(Tag);
    setSplitMode(Tag === "span" || Tag === "p" ? "chars" : "words");
  }, [Tag]);

  const words = children.split(/\s+/);

  return (
    <Tag ref={containerRef as any} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="anim-word inline-block overflow-hidden mr-[0.3em]"
        >
          {splitMode === "chars"
            ? word.split("").map((ch, ci) => (
                <span
                  key={ci}
                  ref={(el) => {
                    charsRef.current[i * 100 + ci] = el;
                  }}
                  className="inline-block"
                  style={{ display: "inline-block" }}
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))
            : word}
        </span>
      ))}
    </Tag>
  );
}
