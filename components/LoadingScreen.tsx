"use client";

import { useEffect, useState } from "react";

interface LoadingScreenProps {
  isVisible?: boolean;
  onComplete?: () => void;
  fullScreen?: boolean;
}

export default function LoadingScreen({
  isVisible = true,
  onComplete,
  fullScreen = true,
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(!isVisible);

  useEffect(() => {
    if (!isVisible) {
      setHidden(true);
      return;
    }

    setHidden(false);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setHidden(true);
            onComplete?.();
          }, 300);
          return 100;
        }
        return p + Math.random() * 18 + 8;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isVisible, onComplete]);

  if (hidden) return null;

  return (
    <div
      className={
        fullScreen
          ? "fixed inset-0 z-[500] flex flex-col items-center justify-center bg-background"
          : "py-20 flex flex-col items-center justify-center"
      }
      role="status"
      aria-label="Loading"
    >
      <div className="relative mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center text-white font-bold text-xl shadow-glow animate-pulse-soft">
          T
        </div>
      </div>
      <div className="w-48 h-1 rounded-full bg-foreground/5 overflow-hidden">
        <div
          className="h-full bg-gradient-brand rounded-full transition-all duration-200 ease-expo"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="mt-4 text-xs text-muted-foreground font-medium">
        Loading experience...
      </p>
    </div>
  );
}
