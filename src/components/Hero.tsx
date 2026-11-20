import type { Dict } from "@/dictionaries";
import { Arrow, Check } from "./Icons";
import { LevelRail } from "./LevelRail";
import { MotionToggle } from "./MotionToggle";

export function Hero({ dict }: { dict: Dict }) {
  const h = dict.hero;
  const e = h.entry;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap">
        <p className="tag">{h.eyebrow}</p>
        {/* Screen readers get one stable sentence; the rotating phrases are visual. */}
        <h1 id="hero-title" className="hero__h1" aria-label={`${h.title.join(" ")} ${h.rotate[0]}`}>
          {h.title.map((line) => (
            <span key={line} aria-hidden="true">
              {line}
            </span>
          ))}
          <span className="rot" aria-hidden="true">
            {h.rotate.map((r) => (
              <span key={r}>{r}</span>
            ))}
          </span>
        </h1>

        <div className="hero__row">
          <div className="hero__text">
            <p className="hero__sub">{h.sub}</p>
            <div className="hero__act">
              <a className="btn btn--lg" href="#zapis">
                {h.cta}
                <Arrow />
              </a>
              <ul className="hero__note">
                {h.note.map((n) => (
                  <li key={n}>
                    <Check />
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lesson">
            <div className="lesson__top">
              <span className="avatar" aria-hidden="true">
                {e.teacher[0]}
              </span>
              <p className="lesson__who">
                <b>
                  {e.teacher} · {e.role}
                </b>
                <span className="live">{e.live}</span>
              </p>
              <span className="wave" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>
              <MotionToggle labels={{ pause: h.pause, play: h.play }} />
            </div>
            <div className="lesson__body">
              <p className="bubble">
                <b lang="en">{e.question}</b>
                <small lang="ru">{e.questionTr}</small>
              </p>
              <LevelRail entry={e} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
