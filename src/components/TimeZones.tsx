"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import type { Dict } from "@/dictionaries";

/** Kaliningrad is UTC+2 (MSK−1) … Kamchatka is UTC+12 (MSK+9). One city per zone. */
const FIRST_UTC = 2;

// A minute-resolution clock shared by every subscriber; server snapshot is 0 = "no time yet".
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
  // First paint after hydration: publish the real time.
  queueMicrotask(cb);
  return () => {
    subs.delete(cb);
    if (subs.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

const hhmm = (ms: number, utcOffset: number) => {
  const d = new Date(ms + utcOffset * 3_600_000);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
};

export function TimeZones({ zones }: { zones: Dict["zones"] }) {
  const t = useSyncExternalStore(
    subscribe,
    () => now,
    () => 0,
  );
  // Visitor's own UTC offset — only meaningful once we are in the browser.
  const mine = t ? -new Date(t).getTimezoneOffset() / 60 : null;

  // Keyboard users need a tab stop only while the strip actually scrolls sideways.
  const listRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const sync = () => {
      if (el.scrollWidth > el.clientWidth + 1) el.tabIndex = 0;
      else el.removeAttribute("tabindex");
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <ol className="zones__list" ref={listRef} aria-label={zones.title}>
      {zones.cities.map((city, i) => {
        const utc = FIRST_UTC + i;
        const msk = utc - 3;
        const you = mine === utc;
        // Lessons run 7:00–23:00 local time; before hydration we simply show the offset.
        const hour = t ? new Date(t + utc * 3_600_000).getUTCHours() : -1;
        const open = hour >= 7 && hour < 23;
        return (
          <li className="zone" key={city} data-you={you} data-open={t ? open : undefined}>
            <span className="zone__city">{city}</span>
            <span className="zone__time" suppressHydrationWarning>
              {t ? hhmm(t, utc) : "7:00–23:00"}
            </span>
            <span className="zone__off" suppressHydrationWarning>
              {t ? (open ? zones.open : zones.night) : `${zones.msk}${msk === 0 ? "" : msk > 0 ? `+${msk}` : `−${-msk}`}`}
            </span>
            <span className="zone__you">{zones.yours}</span>
          </li>
        );
      })}
    </ol>
  );
}
