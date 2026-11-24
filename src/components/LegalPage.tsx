import type { Dict } from "@/dictionaries";
import { contacts } from "@/dictionaries";
import { legalMeta, type LegalDocument } from "@/legal/documents";
import type { Locale } from "@/lib/site";
import { LegalBlocks } from "./LegalBlocks";
import { LegalShell } from "./LegalShell";

/** Public domain of the site; until NEXT_PUBLIC_SITE_URL is set the brand name is used instead. */
function siteName(fallback: string) {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url) return fallback;
  try {
    return new URL(url).host;
  } catch {
    return fallback;
  }
}

export function LegalPage({
  locale,
  dict,
  path,
  doc,
}: {
  locale: Locale;
  dict: Dict;
  path: "/privacy" | "/consent";
  doc: LegalDocument;
}) {
  const tokens = {
    SITE: siteName(dict.brand.name),
    EMAIL: contacts.email.label,
    UPDATED: legalMeta.updated,
  };
  return (
    <LegalShell locale={locale} dict={dict} path={path}>
      <p className="tag">Редакция от {legalMeta.updated}</p>
      <h1 className="h2">{doc.title}</h1>
      <LegalBlocks blocks={doc.blocks} tokens={tokens} locale={locale} />
    </LegalShell>
  );
}
