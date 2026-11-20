/** Central, typo-safe ids shared by the form, pricing cards, the API route and the Telegram message. */
export const locales = ["ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ru";
export const isLocale = (v: string): v is Locale =>
  (locales as readonly string[]).includes(v);

export const planIds = ["group", "personal", "intensive"] as const;
export type PlanId = (typeof planIds)[number];
export const isPlanId = (v: unknown): v is PlanId =>
  typeof v === "string" && (planIds as readonly string[]).includes(v);

export const levelIds = ["unknown", "a1", "a2", "b1", "b2", "c1"] as const;
export type LevelId = (typeof levelIds)[number];
export const isLevelId = (v: unknown): v is LevelId =>
  typeof v === "string" && (levelIds as readonly string[]).includes(v);

/** Public site origin, used for canonical / hreflang / OG urls. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

/** Yandex.Metrika counter id. Empty = analytics disabled. */
export const metrikaId = process.env.NEXT_PUBLIC_YM_ID ?? "";
/** Goal identifier to create in Metrika (type: "JavaScript-событие"). */
export const METRIKA_LEAD_GOAL = "lead_form_submit";
