import { isLevelId, isPlanId, type LevelId, type PlanId } from "./site";

export type LeadInput = {
  name: string;
  contact: string;
  email: string;
  level: LevelId;
  /** Empty = the visitor wants advice on the plan. */
  plan: PlanId | "";
  consent: boolean;
  locale: string;
  /** Honeypot — must stay empty. */
  website: string;
  /** ms between form render and submit. */
  elapsed: number;
};

export type LeadField = "name" | "contact" | "email" | "level" | "plan" | "consent";
export type LeadErrors = Partial<Record<LeadField, "required" | "invalid">>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** +7 999 123-45-67, 8 (999) 1234567 … — at least 10 digits. */
const PHONE_RE = /^\+?[\d\s().-]{10,22}$/;
/** @username or t.me/username (5–32 chars, Telegram rules). */
const TG_RE = /^(?:@|(?:https?:\/\/)?t\.me\/)[a-zA-Z][\w]{4,31}$/;

export function isValidContact(raw: string): boolean {
  const v = raw.trim();
  if (TG_RE.test(v)) return true;
  if (!PHONE_RE.test(v)) return false;
  const digits = v.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

/** Shared by the client (instant feedback) and the API route (source of truth). */
export function validateLead(d: Partial<LeadInput>): LeadErrors {
  const e: LeadErrors = {};
  const name = (d.name ?? "").trim();
  if (!name) e.name = "required";
  else if (name.length < 2 || name.length > 80) e.name = "invalid";

  const contact = (d.contact ?? "").trim();
  if (!contact) e.contact = "required";
  else if (!isValidContact(contact)) e.contact = "invalid";

  const email = (d.email ?? "").trim();
  if (email && (email.length > 120 || !EMAIL_RE.test(email))) e.email = "invalid";

  if (!d.level) e.level = "required";
  else if (!isLevelId(d.level)) e.level = "invalid";

  // The trial lesson is free — choosing a plan up front is optional.
  if (d.plan && !isPlanId(d.plan)) e.plan = "invalid";

  if (d.consent !== true) e.consent = "required";
  return e;
}
