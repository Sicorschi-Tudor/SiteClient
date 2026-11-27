import Image from "next/image";
import type { Dict } from "@/dictionaries";
import { Arrow } from "./Icons";
import { SpeakCard } from "./SpeakCard";
import heroPhoto from "@/assets/hero.jpg";

/** Thin line icons for the facts grid (inline SVG, no icon library). */
const FACT_ICONS = [
  <path key="u" d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20a7.5 7.5 0 0 1 15 0" />,
  <path key="c" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2" />,
  <path key="d" d="M4 6.5h16V20H4zM4 10.5h16M8.5 4v4M15.5 4v4M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />,
  <path key="p" d="M5 20v-5M10 20v-8M15 20v-11M20 20V5" />,
];

export function Hero({ dict }: { dict: Dict }) {
  const h = dict.hero;
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <p className="hero__kicker">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 3 1 8.5 12 14l9-4.5V16h2V8.5z" />
              <path d="M5.5 12.2V16c0 1.9 2.9 3.5 6.5 3.5s6.5-1.6 6.5-3.5v-3.8L12 15.5z" />
            </svg>
            {h.kicker}
          </p>
          <h1 id="hero-title" className="hero__title">
            {h.h1.lead} <em>{h.h1.accent}</em>
          </h1>
          <p className="hero__lede">{h.lede}</p>
          <a className="btn btn--lg hero__cta" href="#zapis">
            {h.ctaFree}
            <Arrow />
          </a>
          <p className="hero__assure">
            <span className="hero__assure-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2" />
              </svg>
            </span>
            <span>
              <b>{h.assure.strong}</b>
              {h.assure.rest}
            </span>
          </p>
        </div>

        {/* Photo: Vitaly Gariev, Unsplash License (free for commercial use). Replace src/assets/hero.jpg to change it. */}
        <div className="hero__visual">
          <div className="hero__stage">
            <span className="hero__back hero__back--a" aria-hidden="true" />
            <span className="hero__back hero__back--b" aria-hidden="true" />
            <div className="hero__photo">
              <Image
                src={heroPhoto}
                alt=""
                fill
                preload
                placeholder="blur"
                sizes="(min-width: 64rem) 26rem, 80vw"
              />
            </div>
          </div>
          <p className="word" aria-hidden="true">
            <small>{h.word.label}</small>
            <b lang="en">{h.word.term}</b>
            <span lang="en">{h.word.ipa}</span>
            <em>{h.word.tr}</em>
          </p>
          <SpeakCard t={h.speak} />
        </div>
      </div>

      <div className="wrap">
        <ul className="facts">
          {h.facts.map((f, i) => (
            <li key={f.title}>
              <svg className="facts__icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {FACT_ICONS[i]}
              </svg>
              <span>
                <b>{f.title}</b>
                {f.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
