import type { CSSProperties } from "react";
import type { Dict } from "@/dictionaries";
import { SnapTabs } from "./SnapTabs";
import { TimeZones } from "./TimeZones";

// One colour per card, in content order: format, schedule, method, reschedule.
const THEMES = ["card--paper", "card--brand", "card--accent", "card--mist"];

/**
 * Desktop: big sticky cards that pile up as you scroll.
 * Phones: a swipe deck with pills; each card shows one line and a small product graphic.
 */
export function Benefits({ dict, otherLang }: { dict: Dict; otherLang: string }) {
  const b = dict.benefits;
  return (
    <section id="format" className="sec fmt" aria-labelledby="format-title">
      <div className="wrap">
        <header className="sec__head">
          <h2 id="format-title" className="h2 reveal">
            {b.title}
          </h2>
        </header>
        <SnapTabs labels={b.items.map((it) => it.glyph)} names={b.items.map((it) => `${it.glyph} — ${it.word}`)} label={b.title} />
        <div className="stack">
          {b.items.map((it, i) => (
            <article className={`card ${THEMES[i]}`} key={it.word} style={{ "--i": i } as CSSProperties}>
              <div className="card__main">
                <p className="card__index" aria-hidden="true">
                  0{i + 1} <span>/ 0{b.items.length}</span>
                </p>
                <div className="card__kicker">
                  <h3 className="card__name">{it.word}</h3>
                  <span lang={otherLang}>{it.gloss}</span>
                </div>
                <p className="card__text">{it.text}</p>

                {i === 0 && (
                  <div className="mini-chat" aria-hidden="true">
                    <p className="mini-chat__b">
                      <b>{dict.hero.entry.teacher}</b> How was your weekend?
                    </p>
                    <p className="mini-chat__b mini-chat__b--me">
                      <b>{dict.hero.entry.you}</b> Great, thanks!
                    </p>
                  </div>
                )}
                {i === 1 && (
                  <>
                    <TimeZones zones={dict.zones} only={[0, 1, 8]} legend={false} className="zones--mini" />
                    <TimeZones zones={dict.zones} className="zones--full" />
                  </>
                )}
                {"bar" in it && it.bar && (
                  <div className="card__bar" aria-hidden="true">
                    <p className="split">
                      <span className="split__you" />
                      <span className="split__t" />
                    </p>
                    <p className="split__legend">
                      <span>{it.bar.you} · 70%</span>
                      <span>{it.bar.teacher} · 30%</span>
                    </p>
                  </div>
                )}
                {i === 3 && (
                  <svg className="mini-clock" viewBox="0 0 64 64" aria-hidden="true">
                    <circle cx="32" cy="32" r="29" />
                    <path className="mini-clock__ticks" d="M32 6v5M32 53v5M6 32h5M53 32h5" />
                    <path className="mini-clock__hand" d="M32 32V14" />
                    <path className="mini-clock__arc" d="M32 3a29 29 0 0 1 25.1 14.5" />
                    <circle cx="32" cy="32" r="3" />
                  </svg>
                )}
              </div>
              <p className="card__glyph" aria-hidden="true">
                {it.glyph}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
