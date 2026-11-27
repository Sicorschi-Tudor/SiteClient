"use client";

import { useState, type CSSProperties } from "react";
import type { Dict } from "@/dictionaries";

const BARS = [0.35, 0.6, 0.85, 0.5, 1, 0.7, 0.4, 0.8, 0.55, 0.95, 0.65, 0.4, 0.75, 0.5, 0.9, 0.6, 0.35, 0.7, 0.45, 0.3];

/** Floating "speaking practice" card: the play button animates the voice line. No audio is loaded. */
export function SpeakCard({ t }: { t: Dict["hero"]["speak"] }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="speak" data-playing={playing}>
      <p className="speak__top" lang="en">
        <span>{t.label}</span>
        <b>{t.level}</b>
      </p>
      <div className="speak__row">
        <button
          type="button"
          className="speak__play"
          aria-pressed={playing}
          aria-label={t.play}
          onClick={() => setPlaying((p) => !p)}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
            {playing ? <path d="M4 3h3.5v12H4zM10.5 3H14v12h-3.5z" /> : <path d="M5 2.5v13l11-6.5z" />}
          </svg>
        </button>
        <span className="speak__wave" aria-hidden="true">
          {BARS.map((h, i) => (
            <i key={i} style={{ "--h": h, "--d": `${i * 70}ms` } as CSSProperties} />
          ))}
        </span>
      </div>
      <p className="speak__text" lang="en">
        <b>{t.line1}</b> {t.line2}
      </p>
    </div>
  );
}
