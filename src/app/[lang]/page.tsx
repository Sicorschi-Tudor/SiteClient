import { notFound } from "next/navigation";
import { Benefits } from "@/components/Benefits";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Kinetic } from "@/components/Kinetic";
import { Pricing } from "@/components/Pricing";
import { QuizSection } from "@/components/QuizSection";
import { Signup } from "@/components/Signup";
import { Trial } from "@/components/Trial";
import { getDictionary } from "@/dictionaries";
import { isLocale, siteUrl } from "@/lib/site";

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const otherLang = lang === "ru" ? "en" : "ru";

  // Structured data: lets search engines show the FAQ and the school as an organisation.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        name: dict.brand.name,
        url: siteUrl,
        description: dict.meta.description,
        areaServed: { "@type": "Country", name: "RU" },
      },
      {
        "@type": "FAQPage",
        mainEntity: dict.faq.items.map((it) => ({
          "@type": "Question",
          name: it.q,
          acceptedAnswer: { "@type": "Answer", text: it.a },
        })),
      },
    ],
  };

  return (
    <>
      <Header locale={lang} dict={dict} />
      <main id="main">
        <Hero dict={dict} />
        <Trial dict={dict} />
        <Benefits dict={dict} otherLang={otherLang} />
        <Kinetic rows={dict.kinetic} />
        <QuizSection dict={dict} />
        <Pricing dict={dict} otherLang={otherLang} />
        <Signup locale={lang} dict={dict} />
        <Faq dict={dict} />
      </main>
      <Footer locale={lang} dict={dict} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
