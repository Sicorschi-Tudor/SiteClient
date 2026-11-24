import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/LegalPage";
import { getDictionary, localePath } from "@/dictionaries";
import { privacyPolicy } from "@/legal/documents";
import { isLocale } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    title: `${privacyPolicy.title} — ${getDictionary(lang).brand.name}`,
    alternates: { canonical: localePath(lang, "/privacy"), languages: { ru: "/privacy", en: "/en/privacy" } },
    robots: { index: false, follow: true },
  };
}

export default async function Privacy({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <LegalPage locale={lang} dict={getDictionary(lang)} path="/privacy" doc={privacyPolicy} />;
}
