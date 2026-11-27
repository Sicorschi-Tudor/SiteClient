"use client";

import { useSyncExternalStore } from "react";

/**
 * One shared clock for every live-time element (hero chip, time-zone tiles).
 * Server snapshot is 0 = "time not known yet", so the server HTML never shows a wrong time.
 */
let now = 0;
const subs = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(cb: () => void) {
  subs.add(cb);
  if (!timer) {
    now = Date.now();
    timer = setInterval(() => {
      now = Date.now();
      subs.forEach((s) => s());
    }, 20_000);
  }
  queueMicrotask(cb);
  return () => {
    subs.delete(cb);
    if (subs.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

export function useNow() {
  return useSyncExternalStore(
    subscribe,
    () => now,
    () => 0,
  );
}

export const hhmm = (d: Date) => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
