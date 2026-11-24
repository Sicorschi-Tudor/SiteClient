import "server-only";
import { appendFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { legalMeta } from "@/legal/documents";
import type { LeadInput } from "./lead";

/**
 * Lead journal: every accepted lead is written here BEFORE it is forwarded to
 * Telegram or anywhere else, so the primary copy of a Russian citizen's data
 * lives on the site's own server (ч. 5 ст. 18 152-ФЗ). The server must be in Russia.
 *
 * One JSON object per line. LEAD_JOURNAL_PATH overrides the location.
 */
const FILE = path.resolve(process.env.LEAD_JOURNAL_PATH ?? path.join(process.cwd(), "data", "leads.jsonl"));

/** Leads without a contract are kept 6 months (see the Policy, section 5), then removed. */
const RETENTION_MS = 183 * 24 * 60 * 60 * 1000;
const PURGE_EVERY_MS = 24 * 60 * 60 * 1000;
let lastPurge = 0;

export type JournalEntry = {
  receivedAt: string;
  name: string;
  contact: string;
  email: string;
  level: string;
  plan: string;
  locale: string;
  page: string;
  suspicious: boolean;
  /** Proof of consent: given via the form checkbox, with the edition of the consent text. */
  consent: { given: true; edition: string };
};

export function journalEntry(lead: LeadInput, meta: { now: number; page?: string; suspicious: boolean }): JournalEntry {
  return {
    receivedAt: new Date(meta.now).toISOString(),
    name: lead.name,
    contact: lead.contact,
    email: lead.email,
    level: lead.level,
    plan: lead.plan,
    locale: lead.locale,
    page: (meta.page ?? "").slice(0, 300),
    suspicious: meta.suspicious,
    consent: { given: true, edition: legalMeta.updated },
  };
}

/** Removes entries older than the retention period. Runs at most once a day per server process. */
async function purge(now: number) {
  if (now - lastPurge < PURGE_EVERY_MS) return;
  lastPurge = now;
  let raw: string;
  try {
    raw = await readFile(FILE, "utf8");
  } catch {
    return; // nothing written yet
  }
  const lines = raw.split("\n").filter(Boolean);
  const keep = lines.filter((line) => {
    try {
      const t = Date.parse((JSON.parse(line) as JournalEntry).receivedAt);
      return Number.isFinite(t) && now - t < RETENTION_MS;
    } catch {
      return false;
    }
  });
  if (keep.length === lines.length) return;
  const tmp = `${FILE}.tmp`;
  await writeFile(tmp, keep.length ? keep.join("\n") + "\n" : "", { mode: 0o600 });
  await rename(tmp, FILE);
}

/** Throws if the lead could not be stored — the caller must then NOT forward it anywhere. */
export async function writeToJournal(entry: JournalEntry, now: number) {
  await mkdir(path.dirname(FILE), { recursive: true, mode: 0o700 });
  await purge(now);
  await appendFile(FILE, JSON.stringify(entry) + "\n", { encoding: "utf8", mode: 0o600 });
}
