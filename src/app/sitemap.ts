import type { MetadataRoute } from "next";
import { docsNav } from "@/lib/nav";
import { SITE_URL } from "@/lib/seo";

/**
 * lastModified is hand-maintained on purpose. Stamping `new Date()` at
 * build time tells crawlers every page changed on every deploy, which
 * trains them to discount the signal entirely.
 *
 * changeFrequency and priority are omitted — Google ignores both.
 */
const CONTENT_UPDATED: Record<string, string> = {
  "": "2026-08-12",
  "/product": "2026-08-12",
  "/download": "2026-08-12",
  "/pricing": "2026-08-12",
  "/security": "2026-08-12",
  "/glossary": "2026-08-12",
  "/docs": "2026-08-12",
  "/company": "2026-08-12",
  "/licensing": "2026-08-12",
  "/changelog": "2026-08-12",
};

const FALLBACK = "2026-08-12";

const ROUTES = [
  "",
  "/product",
  "/download",
  "/pricing",
  "/security",
  "/glossary",
  "/docs",
  "/company",
  "/licensing",
  "/changelog",
  "/brand",
  "/accessibility",
  "/privacy",
  "/terms",
  "/eula",
  "/refund",
  ...docsNav.map((d) => d.href),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route || "/"}`,
    lastModified: CONTENT_UPDATED[route] ?? FALLBACK,
  }));
}
