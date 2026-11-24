import type { Dict } from "@/dictionaries";
import { contacts, localePath } from "@/dictionaries";
import { metrikaId, type Locale } from "@/lib/site";
import { CookieSettings } from "./Analytics";

export function Footer({ locale, dict }: { locale: Locale; dict: Dict }) {
  const f = dict.footer;
  const year = new Date().getFullYear();
  return (
    <footer id="kontakty" className="ftr" aria-labelledby="kontakty-title">
      <div className="wrap">
        <h2 id="kontakty-title" className="h2">
          {f.title}
        </h2>
        <div className="ftr__cols">
          <div className="ftr__col">
            <h3 className="label">{f.contactsTitle}</h3>
            <ul>
              <li>
                <a className="ftr__big" href={contacts.phone.href}>
                  {contacts.phone.label}
                </a>
              </li>
              <li>
                <a className="ftr__big" href={contacts.email.href}>
                  {contacts.email.label}
                </a>
              </li>
              <li>
                <span>
                  {f.region} <small>{f.hours}</small>
                </span>
              </li>
            </ul>
          </div>
          <div className="ftr__col">
            <h3 className="label">{f.socialTitle}</h3>
            <ul>
              {contacts.social.map((s) => (
                <li key={s.name}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.name} <small>{s.handle}</small>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="ftr__col">
            <h3 className="label">{f.legalTitle}</h3>
            <ul>
              <li>
                <a href={localePath(locale, "/privacy")}>{f.privacy}</a>
              </li>
              <li>
                <a href={localePath(locale, "/consent")}>{f.consent}</a>
              </li>
              {metrikaId && (
                <li>
                  <CookieSettings label={f.cookies} />
                </li>
              )}
            </ul>
          </div>
        </div>
        <p className="ftr__legal">
          <span>
            © {year} {dict.brand.name}. {f.rights}
          </span>
        </p>
      </div>
      <p className="ftr__mark" aria-hidden="true">
        <span>glossa</span>
      </p>
    </footer>
  );
}
