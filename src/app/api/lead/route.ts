import { NextResponse } from "next/server";
import { journalEntry, writeToJournal } from "@/lib/journal";
import { validateLead, type LeadInput } from "@/lib/lead";
import {
  formatLead,
  isTelegramConfigured,
  isWebhookConfigured,
  sendToTelegram,
  sendToWebhook,
} from "@/lib/telegram";

/**
 * Per-instance limiter: enough to stop a bored script, no external storage needed.
 * Only DELIVERED leads count, so a visitor retrying after a failed send is never locked out.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_IP = 8;
/** Backstop against header rotation: no more than this many leads per window in total. */
const MAX_TOTAL = 120;
const MAX_KEYS = 5000;
const hits = new Map<string, number[]>();
let total: number[] = [];
let lastSweep = 0;

/** Forget IP addresses once their 10-minute window is over (the Policy promises no longer). */
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [ip, times] of hits) {
    if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(ip);
  }
}

/**
 * The client IP as reported by the reverse proxy. `x-real-ip` (nginx, Vercel) is set by
 * the proxy itself; in `x-forwarded-for` only the LAST hop is appended by our proxy —
 * everything before it is sent by the client and can be forged.
 * Returns "" when unknown: then we do not rate-limit per IP at all (better than putting
 * every visitor into one shared bucket). nginx: `proxy_set_header X-Real-IP $remote_addr;`
 */
function clientIp(req: Request) {
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real;
  const xff = req.headers.get("x-forwarded-for");
  return xff?.split(",").pop()?.trim() ?? "";
}

function isLimited(ip: string, now: number) {
  sweep(now);
  total = total.filter((t) => now - t < WINDOW_MS);
  if (total.length >= MAX_TOTAL) return true;
  if (!ip) return false;
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  return recent.length >= MAX_PER_IP;
}

function recordHit(ip: string, now: number) {
  total.push(now);
  if (!ip) return;
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.delete(ip); // re-insert so the Map stays ordered by last activity
  hits.set(ip, recent);
  // Bounded memory: drop the least recently active keys (Map keeps insertion order).
  while (hits.size > MAX_KEYS) {
    const oldest = hits.keys().next().value;
    if (oldest === undefined) break;
    hits.delete(oldest);
  }
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let raw: Record<string, unknown>;
  try {
    const parsed = await req.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("shape");
    raw = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const lead = {
    name: str(raw.name, 80),
    contact: str(raw.contact, 100),
    email: str(raw.email, 120),
    level: str(raw.level, 20),
    plan: str(raw.plan, 20),
    consent: raw.consent === true,
    locale: raw.locale === "en" ? "en" : "ru",
    website: str(raw.website, 200),
    elapsed: typeof raw.elapsed === "number" && Number.isFinite(raw.elapsed) ? raw.elapsed : 0,
  } as LeadInput;

  // Honeypot filled: a bot. Pretend success, but leave a trace so a false positive can be found.
  if (lead.website) {
    console.warn("[lead] dropped (honeypot filled):", { name: lead.name, contact: lead.contact });
    return NextResponse.json({ ok: true });
  }

  const errors = validateLead(lead);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, error: "validation", fields: errors }, { status: 422 });
  }

  const now = Date.now();
  const ip = clientIp(req);
  if (isLimited(ip, now)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  // Submitted faster than a person can type: suspicious, but a valid lead is never thrown away.
  const suspicious = lead.elapsed < 1500;

  const when = new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Moscow",
  }).format(now);
  const page = req.headers.get("referer") ?? undefined;
  const text =
    (suspicious ? "⚠️ <i>Возможно, спам: форма отправлена быстрее 1,5 с</i>\n\n" : "") +
    formatLead(lead, { when, referer: page });

  // 1) Primary copy on our own server (in Russia) — only then is the lead forwarded anywhere.
  try {
    await writeToJournal(journalEntry(lead, { now, page, suspicious }), now);
  } catch (err) {
    console.error("[lead] could not write the lead journal — lead NOT forwarded:", err);
    return NextResponse.json({ ok: false, error: "storage" }, { status: 503 });
  }

  const channels: Promise<void>[] = [];
  if (isTelegramConfigured()) channels.push(sendToTelegram(text));
  if (isWebhookConfigured()) channels.push(sendToWebhook(lead, when));

  if (channels.length === 0) {
    if (process.env.NODE_ENV !== "production" || process.env.LEAD_DEMO_MODE === "1") {
      console.info("[lead] No delivery channel configured — lead printed instead:\n" + text);
      recordHit(ip, now);
      return NextResponse.json({ ok: true, demo: true });
    }
    console.error("[lead] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID are missing — lead NOT delivered:\n" + text);
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  // The visitor sees success if at least one channel accepted the lead.
  const results = await Promise.allSettled(channels);
  const failures = results.filter((r) => r.status === "rejected");
  for (const f of failures) console.error("[lead] channel failed:", (f as PromiseRejectedResult).reason);
  if (failures.length === results.length) {
    console.error("[lead] ALL channels failed, lead content:\n" + text);
    return NextResponse.json({ ok: false, error: "delivery" }, { status: 502 });
  }
  recordHit(ip, now);
  return NextResponse.json({ ok: true });
}
