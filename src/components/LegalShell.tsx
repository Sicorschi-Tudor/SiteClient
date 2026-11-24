import type { ReactNode } from "react";
import type { Dict } from "@/dictionaries";
import { localePath } from "@/dictionaries";
import { metrikaId, type Locale } from "@/lib/site";
import { CookieSettings } from "./Analytics";
import { LangSwitch, Logo } from "./Header";

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
          {metrikaId && (
            <p className="legal__cookies">
              <CookieSettings label={dict.footer.cookies} />
            </p>
          )}
        </div>
      </main>
    </>
  );
}
