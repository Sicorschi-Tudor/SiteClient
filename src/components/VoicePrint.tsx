"use client";

import type { CSSProperties } from "react";
import { useSelection } from "@/lib/selection";

/** Resting height of each bar (0–1): a natural, speech-like envelope. */
const BARS = [0.3, 0.5, 0.75, 0.45, 0.9, 0.6, 0.35, 0.7, 1, 0.65, 0.4, 0.8, 0.55, 0.95, 0.7, 0.4, 0.6, 0.85, 0.5, 0.3, 0.65, 0.45, 0.25, 0.4];

/**
 * A voiceprint that "speaks" once when the card appears and again whenever the visitor
 * picks a level (the key restarts the animation). A coral playhead runs across the bars.
 */
export function VoicePrint() {
  const { level } = useSelection();
  return (
    <span className="voice" aria-hidden="true" key={level}>
      {BARS.map((h, i) => (
        <i key={i} style={{ "--h": h, "--d": `${i * 45}ms` } as CSSProperties} />
      ))}
    </span>
  );
}
