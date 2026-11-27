"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Pills above a horizontal snap deck (phones). Tapping a pill scrolls to its card;
 * swiping the deck moves the active pill. Without JS the deck still swipes.
 */
export function SnapTabs({ labels, names, label }: { labels: string[]; names: string[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const track = () => ref.current?.nextElementSibling as HTMLElement | null;

  useEffect(() => {
    const deck = track();
    if (!deck) return;
    const cards = Array.from(deck.children) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(cards.indexOf(e.target as HTMLElement));
        }
      },
      { root: deck, threshold: 0.6 },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <div className="snaptabs" ref={ref} role="group" aria-label={label}>
      {labels.map((l, i) => (
        <button
          key={l}
          type="button"
          aria-current={active === i ? "true" : undefined}
          aria-label={names[i]}
          className="snaptabs__tab"
          onClick={() => {
            const deck = track();
            const card = deck?.children[i] as HTMLElement | undefined;
            if (!deck || !card) return;
            deck.scrollTo({ left: card.offsetLeft - (deck.clientWidth - card.clientWidth) / 2, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
          }}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
