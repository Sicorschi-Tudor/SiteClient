import type { CSSProperties } from "react";
import type { Dict } from "@/dictionaries";

// One colour per card, in content order: format, schedule, method, reschedule.
const THEMES = ["card--paper", "card--brand", "card--accent", "card--mist"];

/** Cards are sticky and overlap as you scroll — each new one slides over the previous. */
export function Benefits({ dict, otherLang }: { dict: Dict; otherLang: string }) {
  const b = dict.benefits;
  return (
    <section id="format" className="sec" aria-labelledby="format-title">
      <div className="wrap">
        <header className="sec__head rv">
          <p className="tag">{b.eyebrow}</p>
          <h2 id="format-title" className="h2">
            {b.title}
          </h2>
        </header>
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
                {i === 1 && <p className="hours" aria-hidden="true" />}
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
