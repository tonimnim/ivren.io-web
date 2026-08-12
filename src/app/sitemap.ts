import type { MetadataRoute } from "next";
import { docsNav } from "@/lib/nav";

const BASE_URL = "https://ivren.io";

const ROUTES = [
  "",
  "/product",
  "/download",
  "/docs",
  "/pricing",
  "/security",
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
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.6,
  }));
}
