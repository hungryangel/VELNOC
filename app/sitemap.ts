import type { MetadataRoute } from "next";
import { SITE_URL, pageMeta } from "@/lib/site";

const sitemapKeys: Array<keyof typeof pageMeta> = [
  "home",
  "about",
  "origin",
  "manifesto",
  "services",
  "cases",
  "process",
  "faq",
  "criteria",
  "diagnosis",
  "simulator",
  "contact"
];

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapKeys.map((key) => ({
    url: `${SITE_URL}${pageMeta[key].path}`,
    lastModified: new Date("2026-05-18"),
    changeFrequency: key === "home" ? "weekly" : "monthly",
    priority: key === "home" ? 1 : ["services", "diagnosis"].includes(key) ? 0.9 : 0.8
  }));
}
