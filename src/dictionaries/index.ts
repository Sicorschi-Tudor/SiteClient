import type { Locale } from "@/lib/site";
import { en } from "./en";
import { ru, type Dict } from "./ru";

const dictionaries: Record<Locale, Dict> = { ru, en };
export const getDictionary = (locale: Locale): Dict => dictionaries[locale];
export type { Dict };

/** Contact details live in one place — replace the placeholders here. */
export const contacts = {
  phone: { href: "tel:+79991234567", label: "+7 (999) 123-45-67" },
  email: { href: "mailto:hello@example.ru", label: "hello@example.ru" },
  social: [
    { name: "Telegram", href: "https://t.me/example", handle: "@example" },
    { name: "MAX", href: "https://max.ru/example", handle: "max.ru/example" },
    { name: "VK", href: "https://vk.com/example", handle: "vk.com/example" },
  ],
};

/** Path helper: Russian lives at "/", English at "/en". */
export const localePath = (locale: Locale, path = "") =>
  locale === "ru" ? path || "/" : `/en${path}`;
