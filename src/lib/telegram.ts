import "server-only";
import { legalMeta } from "@/legal/documents";
import type { LeadInput } from "./lead";

const PLAN_LABEL: Record<string, string> = {
  group: "Группа",
  personal: "Один на один",
  intensive: "Интенсив",
};
const LEVEL_LABEL: Record<string, string> = {
  unknown: "Не знаю — определить на пробном",
  a1: "Начинающий (A1)",
  a2: "Элементарный (A2)",
  b1: "Средний (B1)",
  b2: "Выше среднего (B2)",
  c1: "Продвинутый (C1)",
};

/** Telegram HTML parse mode only needs these three escaped. */
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function isTelegramConfigured() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

export function formatLead(lead: LeadInput, meta: { when: string; referer?: string }) {
  const rows = [
    "<b>Новая заявка с сайта</b>",
    "",
    `<b>Имя:</b> ${esc(lead.name)}`,
    `<b>Телефон / Telegram:</b> ${esc(lead.contact)}`,
    lead.email ? `<b>Email:</b> ${esc(lead.email)}` : null,
    `<b>Уровень:</b> ${esc(LEVEL_LABEL[lead.level] ?? lead.level)}`,
    `<b>Тариф:</b> ${esc(lead.plan ? (PLAN_LABEL[lead.plan] ?? lead.plan) : "не выбран — нужна консультация")}`,
    "",
    `<i>Язык сайта: ${esc(lead.locale)} · ${esc(meta.when)} МСК</i>`,
    `<i>Согласие на обработку ПДн: дано (редакция от ${esc(legalMeta.updated)})</i>`,
    meta.referer ? `<i>Страница: ${esc(meta.referer.slice(0, 200))}</i>` : null,
  ];
  return rows.filter((r) => r !== null).join("\n");
}

/**
 * Sends the lead to every chat id in TELEGRAM_CHAT_ID (comma separated).
 * TELEGRAM_API_BASE lets you point at a relay if api.telegram.org is not
 * reachable from the hosting provider.
 */
export async function sendToTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN!;
  const base = (process.env.TELEGRAM_API_BASE ?? "https://api.telegram.org").replace(/\/$/, "");
  const chats = process.env.TELEGRAM_CHAT_ID!.split(",").map((s) => s.trim()).filter(Boolean);

  const results = await Promise.allSettled(
    chats.map(async (chat_id) => {
      const res = await fetch(`${base}/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chat_id,
          text,
          parse_mode: "HTML",
          link_preview_options: { is_disabled: true },
        }),
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`Telegram ${res.status} for chat ${chat_id}: ${body.slice(0, 300)}`);
      }
    }),
  );

  const failed = results.filter((r) => r.status === "rejected");
  for (const f of failed) console.error("[lead]", (f as PromiseRejectedResult).reason);
  // The lead is safe as long as at least one recipient got it.
  if (failed.length === chats.length) throw new Error("Telegram delivery failed for all chats");
}

/**
 * Optional safety net: LEAD_WEBHOOK_URL receives the lead as JSON
 * (e.g. a Google Apps Script, n8n/Albato hook or your CRM). Used in addition
 * to Telegram so a blocked Telegram never loses a lead.
 */
export function isWebhookConfigured() {
  return Boolean(process.env.LEAD_WEBHOOK_URL);
}

export async function sendToWebhook(lead: LeadInput, when: string): Promise<void> {
  const { name, contact, email, level, plan, locale } = lead;
  const res = await fetch(process.env.LEAD_WEBHOOK_URL!, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name, contact, email, level, plan, locale, when }),
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}
