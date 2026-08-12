import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PreFooterCta } from "@/components/pre-footer-cta";
import { JsonLd } from "@/components/json-ld";
import {
  SITE_DESCRIPTION,
  SITE_URL,
  jsonLdGraph,
  organizationSchema,
  softwareSchema,
  webSiteSchema,
} from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Ivren — healthcare interface assurance and integration platform",
    template: "%s — Ivren",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Ivren",
  category: "Healthcare software",
  authors: [{ name: "Ivren", url: SITE_URL }],
  creator: "Ivren",
  publisher: "Ivren",
  formatDetection: { telephone: false, address: false, email: false },
  /*
   * max-snippet:-1 is the lever that uncaps how much of a page may be
   * used as direct input to AI Overviews and AI Mode. These belong at
   * the top level, not only under googleBot.
   */
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  alternates: {
    types: { "application/rss+xml": `${SITE_URL}/changelog/feed.xml` },
  },
  /*
   * No `openGraph.url` here. Metadata merges shallowly, so a url set at
   * the layout level is inherited by every page — making each one claim
   * to be the homepage. Pages set their own via pageMetadata().
   */
  openGraph: {
    title: "Ivren — healthcare interface assurance and integration platform",
    description: SITE_DESCRIPTION,
    siteName: "Ivren",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ivren — healthcare interface assurance and integration platform",
    description: SITE_DESCRIPTION,
  },
};

export const viewport = {
  themeColor: "#ffffff",
  colorScheme: "light" as const,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
      style={{ colorScheme: "light" }}
    >
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        <JsonLd
          data={jsonLdGraph(
            organizationSchema,
            webSiteSchema,
            softwareSchema,
          )}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <PreFooterCta />
        <SiteFooter />
      </body>
    </html>
  );
}
