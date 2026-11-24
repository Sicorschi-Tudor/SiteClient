"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Dict } from "@/dictionaries";
import { validateLead, type LeadErrors, type LeadField } from "@/lib/lead";
import { setSelection, useSelection } from "@/lib/selection";
import {
  isLevelId,
  isPlanId,
  levelIds,
  METRIKA_LEAD_GOAL,
  metrikaId,
  type Locale,
} from "@/lib/site";
import { Arrow } from "./Icons";
import { rub } from "./Rub";

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void;
  }
}

type Props = {
  locale: Locale;
  t: Dict["form"];
  plans: { id: string; name: string; price: string }[];
  links: { consent: string; privacy: string };
};

const DRAFT_KEY = "lead-draft";
const ORDER: LeadField[] = ["name", "contact", "email", "level", "plan", "consent"];

export function LeadForm({ locale, t, plans, links }: Props) {
  const { plan, level } = useSelection();
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [failure, setFailure] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const shownAt = useRef(0);

  // Restore a draft (it survives the RU ⇄ EN switch, which is a full page load).
  useEffect(() => {
    shownAt.current = Date.now();
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw) as Record<string, string>;
      const form = formRef.current;
      if (!form) return;
      for (const key of ["name", "contact", "email"] as const) {
        const el = form.elements.namedItem(key);
        if (el instanceof HTMLInputElement && typeof d[key] === "string" && !el.value) el.value = d[key];
      }
      setSelection({
        ...(isPlanId(d.plan) ? { plan: d.plan } : {}),
        ...(isLevelId(d.level) ? { level: d.level } : {}),
      });
    } catch {
      /* private mode or corrupted draft — start clean */
    }
  }, []);

  // Plan / level can change outside the form (pricing cards, hero rail) — keep the draft in step.
  const restored = useRef(false);
  useEffect(() => {
    if (!restored.current) {
      restored.current = true;
      return;
    }
    try {
      const prev = JSON.parse(sessionStorage.getItem(DRAFT_KEY) ?? "{}") as Record<string, unknown>;
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...prev, plan, level }));
    } catch {
      /* storage unavailable */
    }
  }, [plan, level]);

  const saveDraft = (extra: Record<string, string> = {}) => {
    const form = formRef.current;
    if (!form) return;
    const fd = new FormData(form);
    try {
      sessionStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          name: fd.get("name"),
          contact: fd.get("contact"),
          email: fd.get("email"),
          plan,
          level,
          ...extra,
        }),
      );
    } catch {
      /* storage unavailable */
    }
  };

  const clearError = (field: LeadField) => {
    setFailure("");
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const focusFirstInvalid = (errs: LeadErrors) => {
    const first = ORDER.find((f) => errs[f]);
    if (!first) return;
    const el = formRef.current?.elements.namedItem(first);
    if (el instanceof HTMLElement) el.focus();
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: String(fd.get("name") ?? ""),
      contact: String(fd.get("contact") ?? ""),
      email: String(fd.get("email") ?? ""),
      level,
      plan,
      consent: fd.get("consent") === "on",
    };

    const errs = validateLead(data);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setFailure(t.errors.summary);
      focusFirstInvalid(errs);
      return;
    }

    setFailure("");
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...data,
          locale,
          website: String(fd.get("hp_field") ?? ""),
          elapsed: Date.now() - shownAt.current,
        }),
      });

      if (res.ok) {
        const id = Number(metrikaId);
        if (id && typeof window.ym === "function") {
          window.ym(id, "reachGoal", METRIKA_LEAD_GOAL, { plan, level, locale });
        }
        form.reset();
        try {
          sessionStorage.removeItem(DRAFT_KEY);
        } catch {
          /* ignore */
        }
        shownAt.current = Date.now();
        dialogRef.current?.showModal();
      } else if (res.status === 422) {
        const body = (await res.json().catch(() => null)) as { fields?: LeadErrors } | null;
        const fields = body?.fields ?? {};
        setErrors(fields);
        setFailure(t.errors.summary);
        focusFirstInvalid(fields);
      } else if (res.status === 429) {
        setFailure(t.errors.rate);
      } else {
        setFailure(t.errors.server);
      }
    } catch {
      setFailure(t.errors.network);
    } finally {
      setStatus("idle");
    }
  }

  const err = (field: LeadField) => {
    const kind = errors[field];
    return kind ? t.errors[field][kind] || t.errors[field].required : "";
  };
  const describe = (field: LeadField, hint?: boolean) =>
    [errors[field] ? `f-${field}-err` : "", hint ? `f-${field}-hint` : ""].filter(Boolean).join(" ") || undefined;

  const chosenPlan = plans.find((p) => p.id === plan);

  return (
    <>
      <form
        ref={formRef}
        className="signup__form"
        method="post"
        onSubmit={onSubmit}
        onInput={() => saveDraft()}
        noValidate
        aria-labelledby="zapis-title"
      >
        <div className="gap">
          <label className="gap__label" htmlFor="f-name">
            {t.name.label}
          </label>
          <div className="gap__field">
            <input
              id="f-name"
              name="name"
              className="field"
              type="text"
              autoComplete="name"
              maxLength={80}
              placeholder={t.name.placeholder}
              aria-required="true"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={describe("name")}
              onInput={() => clearError("name")}
            />
            {errors.name && (
              <span className="gap__err" id="f-name-err">
                {err("name")}
              </span>
            )}
          </div>
        </div>

        <div className="gap">
          <label className="gap__label" htmlFor="f-contact">
            {t.contact.label}
          </label>
          <div className="gap__field">
            <input
              id="f-contact"
              name="contact"
              className="field"
              type="text"
              autoComplete="tel"
              maxLength={100}
              placeholder={t.contact.placeholder}
              aria-required="true"
              aria-invalid={Boolean(errors.contact)}
              aria-describedby={describe("contact", true)}
              onInput={() => clearError("contact")}
            />
            {errors.contact ? (
              <span className="gap__err" id="f-contact-err">
                {err("contact")}
              </span>
            ) : null}
            <span className="gap__hint" id="f-contact-hint">
              {t.contact.hint}
            </span>
          </div>
        </div>

        <div className="gap">
          <label className="gap__label" htmlFor="f-email">
            {t.email.label}
          </label>
          <div className="gap__field">
            <input
              id="f-email"
              name="email"
              className="field"
              type="email"
              inputMode="email"
              autoComplete="email"
              maxLength={120}
              placeholder={t.email.placeholder}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={describe("email", true)}
              onInput={() => clearError("email")}
            />
            {errors.email && (
              <span className="gap__err" id="f-email-err">
                {err("email")}
              </span>
            )}
            <span className="gap__hint" id="f-email-hint">
              {t.email.hint}
            </span>
          </div>
        </div>

        <div className="gap">
          <label className="gap__label" htmlFor="f-level">
            {t.level.label}
          </label>
          <div className="gap__field">
            <select
              id="f-level"
              name="level"
              className="field"
              value={level}
              aria-invalid={Boolean(errors.level)}
              aria-describedby={describe("level")}
              onChange={(e) => {
                const v = e.target.value;
                if (isLevelId(v)) setSelection({ level: v });
                clearError("level");
                saveDraft({ level: v });
              }}
            >
              {levelIds.map((id) => (
                <option key={id} value={id}>
                  {t.levels[id]}
                </option>
              ))}
            </select>
            {errors.level && (
              <span className="gap__err" id="f-level-err">
                {err("level")}
              </span>
            )}
          </div>
        </div>

        <div className="gap">
          <label className="gap__label" htmlFor="f-plan">
            {t.plan.label}
          </label>
          <div className="gap__field">
            <select
              id="f-plan"
              name="plan"
              className="field"
              value={plan}
              aria-invalid={Boolean(errors.plan)}
              aria-describedby={describe("plan")}
              onChange={(e) => {
                const v = e.target.value;
                setSelection({ plan: isPlanId(v) ? v : "" });
                clearError("plan");
                saveDraft({ plan: v });
              }}
            >
              <option value="">{t.plan.placeholder}</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.plan && (
              <span className="gap__err" id="f-plan-err">
                {err("plan")}
              </span>
            )}
          </div>
        </div>

        {/* Honeypot: invisible to people, irresistible to bots. */}
        <div className="hp" aria-hidden="true">
          <label>
            {t.honeypot}
            <input
              type="text"
              name="hp_field"
              tabIndex={-1}
              autoComplete="off"
              data-1p-ignore
              data-lpignore="true"
              data-form-type="other"
            />
          </label>
        </div>

        <label className="consent">
          <input
            type="checkbox"
            name="consent"
            aria-required="true"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={describe("consent")}
            onChange={() => clearError("consent")}
          />
          <span>
            {t.consent.before}
            <a href={links.consent} target="_blank" rel="noopener">
              {t.consent.consentLink}
            </a>
            {t.consent.after}
            {errors.consent && (
              <span className="gap__err" id="f-consent-err">
                {err("consent")}
              </span>
            )}
          </span>
        </label>
        <p className="consent__note">
          {t.consent.policyBefore}
          <a href={links.privacy} target="_blank" rel="noopener">
            {t.consent.policyLink}
          </a>
          {t.consent.policyAfter}
        </p>

        <div className="signup__submit">
          <button className="btn btn--block" type="submit" aria-disabled={status === "sending"}>
            {status === "sending" ? t.sending : t.submit}
            <Arrow />
          </button>
          <p className="form-status" role="alert">
            {failure}
          </p>
        </div>
      </form>

      <aside className="aside" aria-label={t.slip.title}>
        <p className="label">{t.slip.title}</p>
        <dl className="slip" aria-live="polite">
          <div>
            <dt>{t.slip.level}</dt>
            <dd>{t.levels[level]}</dd>
          </div>
          {/* key restarts the highlight when a plan arrives from the pricing cards */}
          <div key={plan} className={plan ? "slip__new" : undefined}>
            <dt>{t.slip.plan}</dt>
            <dd>{chosenPlan ? chosenPlan.name : t.plan.placeholder}</dd>
          </div>
          <div>
            <dt>{t.slip.trial}</dt>
            <dd>{rub(t.slip.free)}</dd>
          </div>
        </dl>
        <div className="steps">
          <p className="label">{t.steps.title}</p>
          <ol>
            {t.steps.items.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
      </aside>

      <dialog ref={dialogRef} className="thanks" aria-labelledby="thanks-title">
        <span className="thanks__ok" aria-hidden="true">
          <svg viewBox="0 0 48 48">
            <path pathLength={1} d="M10 25l9 9 19-20" />
          </svg>
        </span>
        <h2 id="thanks-title" className="h2">
          {t.thanks.title}
        </h2>
        <p>{t.thanks.text}</p>
        <form method="dialog">
          <button className="btn btn--block" autoFocus>
            {t.thanks.ok}
          </button>
        </form>
      </dialog>
    </>
  );
}
