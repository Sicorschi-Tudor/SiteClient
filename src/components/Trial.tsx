import type { Dict } from "@/dictionaries";
import { Arrow } from "./Icons";

// Length of each part in minutes — drives the proportions of the ruler.
const PARTS = [5, 15, 20, 10];
const MARKS = [0, 5, 20, 40, 50];

/** What actually happens in the free lesson, drawn to scale on a 50-minute ruler. */
export function Trial({ dict }: { dict: Dict }) {
  const t = dict.trial;
  return (
    <section className="sec" aria-labelledby="trial-title">
      <div className="wrap">
        <header className="sec__head rv">
          <p className="tag">{t.eyebrow}</p>
          <h2 id="trial-title" className="h2">
            {t.title}
          </h2>
        </header>

        <div className="trialbox">
        <div className="ruler" aria-hidden="true">
          <i className="ruler__head" />
          <div className="ruler__bar">
            {PARTS.map((m, i) => (
              <span key={i} style={{ flexGrow: m }} data-talk={i === 1 || i === 2} />
            ))}
          </div>
          <div className="ruler__marks">
            {MARKS.map((m) => (
              <span key={m} style={{ left: `${(m / 50) * 100}%` }}>
                {m}
              </span>
            ))}
          </div>
        </div>

        <ol className="trial">
          {t.steps.map((s) => (
            <li key={s.time}>
              <p className="trial__time">
                {s.time} <small>{t.minutes}</small>
              </p>
              <h3 className="h3">{s.name}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
        </div>

        <p className="trial__act">
          <a className="btn" href="#zapis">
            {t.cta}
            <Arrow />
          </a>
          <span>{t.note}</span>
        </p>
      </div>
    </section>
  );
}
