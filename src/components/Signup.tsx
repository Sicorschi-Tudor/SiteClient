import type { Dict } from "@/dictionaries";
import { localePath } from "@/dictionaries";
import type { Locale } from "@/lib/site";
import { LeadForm } from "./LeadForm";
import { rub } from "./Rub";

export function Signup({ locale, dict }: { locale: Locale; dict: Dict }) {
  const perMonth = dict.pricing.perMonth;
  return (
    <section id="zapis" className="sec signup brand" aria-labelledby="zapis-title">
      <div className="wrap">
        <div className="signup__panel">
          <div className="signup__grid">
            <header className="signup__intro">
              <p className="signup__zero" aria-hidden="true">
                {rub("0\u00a0₽")}
              </p>
              <h2 id="zapis-title" className="h2">
                {dict.form.title}
              </h2>
              <p className="signup__flow">{dict.form.flow}</p>
            </header>
        <LeadForm
          locale={locale}
          t={dict.form}
          plans={dict.pricing.plans.map((p) => ({
            id: p.id,
            name: p.name,
            price: `${p.price.replace(" ", " ")} ₽ ${perMonth}`,
          }))}
          links={{ consent: localePath(locale, "/consent"), privacy: localePath(locale, "/privacy") }}
        />
          </div>
        </div>
      </div>
    </section>
  );
}
