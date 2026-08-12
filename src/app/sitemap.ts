import type { MetadataRoute } from "next";
import { docsNav } from "@/lib/nav";
import { SITE_URL } from "@/lib/seo";

/** Priority reflects genuine importance, not wishful thinking. */
const PRIMARY = ["/product", "/download", "/pricing", "/security", "/glossary"];
const LEGAL = ["/privacy", "/terms", "/eula", "/refund", "/accessibility"];

const ROUTES = [
  "",
  ...PRIMARY,
  "/docs",
  "/company",
  "/licensing",
  "/changelog",
  "/brand",
  ...LEGAL,
  ...docsNav.map((d) => d.href),
];

function priorityFor(route: string) {
  if (route === "") return 1;
  if (PRIMARY.includes(route)) return 0.9;
  if (LEGAL.includes(route)) return 0.3;
  if (route.startsWith("/docs")) return 0.7;
  return 0.6;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: LEGAL.includes(route)
      ? ("yearly" as const)
      : ("weekly" as const),
    priority: priorityFor(route),
  }));
}
