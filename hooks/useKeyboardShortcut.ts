"use client";

import { useEffect } from "react";

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: { meta?: boolean; ctrl?: boolean; shift?: boolean } = {}
) {
  const { meta = true, ctrl = true, shift = false } = options;

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const modifier = meta ? event.metaKey : ctrl ? event.ctrlKey : false;
      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        modifier &&
        event.shiftKey === shift
      ) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, callback, meta, ctrl, shift]);
}
