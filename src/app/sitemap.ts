import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { ru: `${siteUrl}/`, en: `${siteUrl}/en` };
  return [
    { url: `${siteUrl}/`, changeFrequency: "monthly", priority: 1, alternates: { languages } },
    { url: `${siteUrl}/en`, changeFrequency: "monthly", priority: 0.8, alternates: { languages } },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/consent`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
