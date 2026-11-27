"use client";

import { useEffect, useRef, useState } from "react";

const START = 7; // the lesson is already 7 seconds in when the page opens
const LENGTH = 50 * 60;
const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/**
 * "00:07 / 50:00" — the call is running. Ticks once a second; stops while the tab is
 * hidden or the hero's pause button is pressed, and never moves with reduced motion.
 */
export function LessonTimer() {
  const [sec, setSec] = useState(START);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      if (ref.current?.closest(".hero")?.getAttribute("data-paused") === "true") return;
      setSec((s) => (s + 1 >= LENGTH ? START : s + 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="call-timer" ref={ref} aria-hidden="true">
      {fmt(sec)} <span>/ {fmt(LENGTH)}</span>
    </span>
  );
}
