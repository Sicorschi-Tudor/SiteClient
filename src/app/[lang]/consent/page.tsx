import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/LegalPage";
import { getDictionary, localePath } from "@/dictionaries";
import { consentDocument } from "@/legal/documents";
import { isLocale } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/consent">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    title: `${consentDocument.title} — ${getDictionary(lang).brand.name}`,
    alternates: { canonical: localePath(lang, "/consent"), languages: { ru: "/consent", en: "/en/consent" } },
    robots: { index: false, follow: true },
  };
}

export default async function Consent({ params }: PageProps<"/[lang]/consent">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <LegalPage locale={lang} dict={getDictionary(lang)} path="/consent" doc={consentDocument} />;
}
