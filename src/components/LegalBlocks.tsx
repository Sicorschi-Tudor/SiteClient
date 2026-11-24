import { Fragment, type ReactNode } from "react";
import { localePath } from "@/dictionaries";
import type { LegalBlock } from "@/legal/documents";
import type { Locale } from "@/lib/site";

/** Values substituted into the legal texts. Edit them in src/legal/documents.ts. */
type Tokens = Record<"SITE" | "EMAIL" | "UPDATED", string>;

/**
 * Turns one line of legal text into React nodes:
 * - {{TOKEN}} is replaced with its value (the e-mail becomes a mailto link),
 * - "(/consent)" and "(/privacy)" become links to the other document.
 */
function inline(text: string, tokens: Tokens, locale: Locale): ReactNode {
  const parts = text.split(/(\{\{(?:SITE|EMAIL|UPDATED)\}\}|\s?\((?:\/consent|\/privacy)\))/g);
  return parts.map((part, i) => {
    const token = part.match(/^\{\{(SITE|EMAIL|UPDATED)\}\}$/);
    if (token) {
      const key = token[1] as keyof Tokens;
      if (key === "EMAIL") {
        return (
          <a key={i} href={`mailto:${tokens.EMAIL}`}>
            {tokens.EMAIL}
          </a>
        );
      }
      return <Fragment key={i}>{tokens[key]}</Fragment>;
    }
    const link = part.match(/^\s?\((\/consent|\/privacy)\)$/);
    if (link) {
      const path = link[1];
      return (
        <Fragment key={i}>
          {" ("}
          <a href={localePath(locale, path)}>{path}</a>
          {")"}
        </Fragment>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function LegalBlocks({ blocks, tokens, locale }: { blocks: LegalBlock[]; tokens: Tokens; locale: Locale }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === "h2") return <h2 key={i}>{inline(b.text, tokens, locale)}</h2>;
        if (b.type === "ul")
          return (
            <ul key={i}>
              {b.items.map((item, j) => (
                <li key={j}>{inline(item, tokens, locale)}</li>
              ))}
            </ul>
          );
        return <p key={i}>{inline(b.text, tokens, locale)}</p>;
      })}
    </>
  );
}
