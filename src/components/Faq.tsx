import type { Dict } from "@/dictionaries";

/** Native <details name>: an exclusive accordion with zero JavaScript. */
export function Faq({ dict }: { dict: Dict }) {
  const f = dict.faq;
  return (
    <section id="voprosy" className="sec faq" aria-labelledby="voprosy-title">
      <div className="wrap faq__grid">
        <header className="faq__head">
          <h2 id="voprosy-title" className="h2 reveal">
            {f.title}
          </h2>
        </header>
        <div className="faq__list rv">
          {f.items.map((it, i) => (
            <details className="qa" name="faq" key={it.q} open={i === 0}>
              <summary>
                <span>{it.q}</span>
                <span className="qa__plus" aria-hidden="true" />
              </summary>
              <div className="qa__a">
                <p>{it.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
