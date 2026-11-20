import type { ReactNode } from "react";
import type { Dict } from "@/dictionaries";
import { localePath } from "@/dictionaries";
import type { Locale } from "@/lib/site";
import { LangSwitch, Logo } from "./Header";

/** Operator details used in both legal documents — replace the placeholders once. */
export const operator = {
  name: "ИП Фамилия Имя Отчество",
  inn: "000000000000",
  ogrnip: "000000000000000",
  address: "000000, г. Город, ул. Улица, д. 0",
  email: "privacy@example.ru",
  site: "example.ru",
  updated: "20 ноября 2026 г.",
};

export function LegalShell({
  locale,
  dict,
  path,
  children,
}: {
  locale: Locale;
  dict: Dict;
  path: string;
  children: ReactNode;
}) {
  return (
    <>
      <header className="hdr">
        <div className="hdr__in hdr__in--legal">
          <Logo dict={dict} href={localePath(locale)} />
          <LangSwitch locale={locale} dict={dict} path={path} />
          <a className="btn btn--sm btn--ghost" href={localePath(locale)}>
            {dict.legal.back}
          </a>
        </div>
      </header>
      <main id="main" className="legal">
        <div className="wrap">
          {/* The documents are legally binding in Russian only. */}
          <article className="legal__body" lang="ru">
            {dict.legal.notice && (
              <p className="legal__note" lang={locale}>
                {dict.legal.notice}
              </p>
            )}
            {children}
          </article>
        </div>
      </main>
    </>
  );
}
