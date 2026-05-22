"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function TelemetryTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Log a view action whenever the pathname changes
    const logView = async () => {
      try {
        await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "view" }),
          // keepalive ensures the request completes even if user navigates away quickly
          keepalive: true
        });
      } catch (err) {
        // Silently fail to not disturb user
      }
    };

    logView();
  }, [pathname]);

  useEffect(() => {
    // 2. Log general interaction clicks (buttons, links, etc.)
    const handleGlobalClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Track clicks on active interactive elements like buttons, links, or inputs
      if (
        target.closest("button") || 
        target.closest("a") || 
        target.closest("input") ||
        target.closest("select")
      ) {
        try {
          await fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "click" }),
            keepalive: true
          });
        } catch (err) {
          // Silently fail
        }
      }
    };

    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  return null; // pure behavior, no UI
}
