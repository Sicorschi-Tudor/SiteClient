"use client";

import { useRef, type ReactNode } from "react";
import { Arrow, Burger, Close } from "./Icons";

type Props = {
  items: { href: string; label: string }[];
  labels: { menu: string; close: string; nav: string; cta: string };
  /** Language switch — on narrow phones it lives here instead of the header. */
  lang: ReactNode;
};

/** Native <dialog>: focus trap, Esc and inert background come for free. */
export function MobileMenu({ items, labels, lang }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const close = () => ref.current?.close();

  return (
    <>
      <button
        type="button"
        className="menu-btn"
        aria-haspopup="dialog"
        aria-label={labels.menu}
        onClick={() => ref.current?.showModal()}
      >
        <Burger />
      </button>
      <dialog ref={ref} className="sheet" aria-label={labels.nav}>
        <div className="sheet__top">
          <span className="logo__w" aria-hidden="true">
            glossa
            <span className="logo__dot" />
          </span>
          <span style={{ marginLeft: "auto", marginRight: "0.5rem" }}>{lang}</span>
          <button type="button" className="menu-btn" aria-label={labels.close} onClick={close}>
            <Close />
          </button>
        </div>
        <ol>
          {items.map((item, i) => (
            <li key={item.href}>
              <a href={item.href} onClick={close}>
                {item.label}
                <span aria-hidden="true">0{i + 1}</span>
              </a>
            </li>
          ))}
        </ol>
        <a className="btn btn--block" href="#zapis" onClick={close}>
          {labels.cta}
          <Arrow />
        </a>
      </dialog>
    </>
  );
}
