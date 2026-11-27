import type { Dict } from "@/dictionaries";
import { PlanTicket } from "./PlanTicket";
import { rub } from "./Rub";

export function Pricing({ dict, otherLang }: { dict: Dict; otherLang: string }) {
  const p = dict.pricing;
  return (
    <section id="tarify" className="sec pricing" aria-labelledby="tarify-title">
      <div className="wrap">
        <header className="sec__head">
          <p className="pill-tag">{rub(p.eyebrow)}</p>
          <h2 id="tarify-title" className="h2 reveal">
            {p.title}
          </h2>
          {p.lead && <p className="sec__lead">{p.lead}</p>}
        </header>
        <div className="tickets">
          {p.plans.map((plan, i) => (
            <PlanTicket key={plan.id} id={plan.id} featured={i === 1} labels={{ choose: p.choose, chosen: p.chosen }}>
              <div>
                <p className="ticket__top">
                  <span lang={otherLang}>{plan.gloss}</span>
                  {i === 1 && <span className="ticket__tag">{p.tag}</span>}
                </p>
                <h3 className="ticket__name h3">{plan.name}</h3>
                <p className="ticket__was">
                  <s>
                    <span className="sr-only">{p.was} </span>
                    {rub(`${plan.oldPrice.replace(" ", "\u00a0")}\u00a0₽`)}
                  </s>
                  <span className="ticket__off">{p.off}</span>
                </p>
                <p className="ticket__price">
                  <span className="sr-only">{p.now} </span>
                  <span>{rub(`${plan.price.replace(" ", "\u00a0")}\u00a0₽`)}</span>
                  <small>{p.perMonth}</small>
                </p>
                <p className="ticket__per">{rub(plan.perLesson.replace(/ (?=₽)/g, "\u00a0"))}</p>
              </div>
              <ul className="ticket__list">
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </PlanTicket>
          ))}
        </div>
      </div>
    </section>
  );
}
