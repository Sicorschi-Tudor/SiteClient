import type { Metadata, Viewport } from "next";
import { Onest, Unbounded } from "next/font/google";
import { notFound } from "next/navigation";
import { Analytics } from "@/components/Analytics";
import { getDictionary, localePath } from "@/dictionaries";
import { isLocale, locales, metrikaId, siteUrl } from "@/lib/site";
import "../globals.css";

// Fonts are downloaded at build time and served from our own origin —
// the visitor's browser never talks to Google.
const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-unbounded",
});
const onest = Onest({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-onest",
});

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    metadataBase: new URL(siteUrl),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: localePath(lang),
      languages: { ru: "/", en: "/en", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      siteName: dict.brand.name,
      title: dict.meta.title,
      description: dict.meta.description,
      url: localePath(lang),
      locale: dict.meta.ogLocale,
    },
    formatDetection: { telephone: false },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <html lang={lang} className={`${unbounded.variable} ${onest.variable}`}>
      <body>
        <a className="skip" href="#main">
          {dict.skip}
        </a>
        {/* First in reading/tab order, visually pinned to the bottom. */}
        <Analytics id={metrikaId} t={dict.cookie} privacyHref={localePath(lang, "/privacy")} />
        {children}
      </body>
    </html>
  );
}
