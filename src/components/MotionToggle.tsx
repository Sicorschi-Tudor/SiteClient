"use client";

import { useState } from "react";

/** Pause / play for the looping animations in the hero (WCAG 2.2.2). */
export function MotionToggle({ labels }: { labels: { pause: string; play: string } }) {
  const [paused, setPaused] = useState(false);
  return (
    <button
      type="button"
      className="pause"
      aria-label={paused ? labels.play : labels.pause}
      aria-pressed={paused}
      onClick={(e) => {
        const next = !paused;
        setPaused(next);
        e.currentTarget.closest<HTMLElement>(".hero")?.setAttribute("data-paused", String(next));
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
        {paused ? <path d="M3 1.5v11l9-5.5z" /> : <path d="M2.5 1.5h3v11h-3zM8.5 1.5h3v11h-3z" />}
      </svg>
    </button>
  );
}
