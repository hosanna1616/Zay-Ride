"use client";

import { useEffect } from "react";

/**
 * Registers `/sw.js` for PWA offline shell.
 * Replace with `@serwist/next` or `next-pwa` when you need precache revisioning.
 */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);
  return null;
}
