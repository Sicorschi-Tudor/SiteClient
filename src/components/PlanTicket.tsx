"use client";

import type { ReactNode } from "react";
import { setSelection, useSelection } from "@/lib/selection";
import type { PlanId } from "@/lib/site";
import { Arrow } from "./Icons";

type Props = {
  id: PlanId;
  featured: boolean;
  labels: { choose: string; chosen: string };
  children: [stub: ReactNode, list: ReactNode];
};

/**
 * The ticket's content is rendered on the server and passed in as children;
 * this shell only knows whether it is the selected one.
 * "Choose" is a real anchor to #zapis, so the scroll works without JS too.
 */
export function PlanTicket({ id, featured, labels, children }: Props) {
  const { plan } = useSelection();
  const selected = plan === id;
  const [stub, list] = children;

  return (
    <article
      className={`ticket rv${featured ? " ticket--feat" : ""}`}
      data-selected={selected}
      // Pointer position feeds the soft light that follows the cursor across the card.
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {stub}
      <div className="ticket__body">
        {list}
        <a
          className={`btn btn--block ticket__cta${featured ? " btn--accent" : " btn--ghost"}`}
          href="#zapis"
          data-plan={id}
          onClick={() => setSelection({ plan: id })}
        >
          {labels.choose}
          <Arrow />
        </a>
      </div>
      {selected && (
        <span className="stamp" aria-hidden="true">
          {labels.chosen}
        </span>
      )}
    </article>
  );
}
