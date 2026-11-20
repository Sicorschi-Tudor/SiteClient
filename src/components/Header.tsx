import type { Dict } from "@/dictionaries";
import { localePath } from "@/dictionaries";
import type { Locale } from "@/lib/site";
import { MobileMenu } from "./MobileMenu";

export function Logo({ dict, href }: { dict: Dict; href: string }) {
  return (
    <a className="logo" href={href} aria-label={dict.brand.name}>
      <span className="logo__w" aria-hidden="true">
        glossa
        <span className="logo__dot" />
      </span>
    </a>
  );
}

/** A plain <a>: each language is its own static page with its own URL. */
export function LangSwitch({ locale, dict, path = "" }: { locale: Locale; dict: Dict; path?: string }) {
  const other: Locale = locale === "ru" ? "en" : "ru";
  return (
    <a className="lang" href={localePath(other, path)} hrefLang={other} lang={other} aria-label={dict.nav.switchTo}>
      <b aria-hidden="true">{locale}</b>
      <span aria-hidden="true">{other}</span>
    </a>
  );
}

export function Header({ locale, dict }: { locale: Locale; dict: Dict }) {
  return (
    <header className="hdr">
      <div className="hdr__in">
        <Logo dict={dict} href={localePath(locale)} />
        <nav className="nav" aria-label={dict.nav.label}>
          <ol>
            {dict.nav.items.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ol>
        </nav>
        <LangSwitch locale={locale} dict={dict} />
        <a className="btn btn--sm hdr__cta" href="#zapis">
          {dict.nav.cta}
        </a>
        <MobileMenu
          items={dict.nav.items}
          labels={{ menu: dict.nav.menu, close: dict.nav.close, nav: dict.nav.label, cta: dict.hero.cta }}
          lang={<LangSwitch locale={locale} dict={dict} />}
        />
      </div>
    </header>
  );
}
