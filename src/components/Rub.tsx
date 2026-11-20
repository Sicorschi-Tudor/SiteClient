import { Fragment, type ReactNode } from "react";

/**
 * The ruble sign sits in the heavy "latin-ext" subset of the web fonts (~150 KB for one glyph).
 * Rendering it in a system font keeps those files from ever being requested.
 */
export function rub(text: string): ReactNode {
  const parts = text.split("₽");
  if (parts.length === 1) return text;
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && <span className="rub">₽</span>}
    </Fragment>
  ));
}
