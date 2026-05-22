"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { Sun, Moon } from "lucide-react";
import gsap from "gsap";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    
    // Animation for the icon
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        rotation: 360,
        scale: 0.5,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setTheme(newTheme);
          gsap.fromTo(iconRef.current, 
            { rotation: -360, scale: 0.5, opacity: 0 },
            { rotation: 0, scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
          );
        }
      });
    } else {
      setTheme(newTheme);
    }
  };

  if (!mounted) return <div className="w-10 h-10" />;

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all group overflow-hidden"
      aria-label="Toggle Theme"
    >
      {/* Colorful Background Reveal */}
      <div className={`absolute inset-0 transition-transform duration-500 ease-expo ${
        theme === "dark" 
          ? "bg-gradient-to-br from-indigo-600 to-purple-600 translate-y-0" 
          : "bg-gradient-to-br from-orange-400 to-pink-500 translate-y-0"
      }`} />
      
      <div ref={iconRef} className="relative z-10 text-white">
        {theme === "dark" ? <Moon size={22} /> : <Sun size={22} />}
      </div>
      
      {/* Animated Shine Effect */}
      <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12" />
    </button>
  );
}
