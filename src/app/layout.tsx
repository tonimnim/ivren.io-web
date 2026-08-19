import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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

/*
 * Geist matches the installed console's typeface, so the hosted dashboard
 * and the desktop app read as one product. Loaded here so the variables
 * exist document-wide; only the (app) subtree actually applies them.
 */
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      "Ivren — the healthcare interface engine that proves it",
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
    title: "Ivren — the healthcare interface engine that proves it",
    description: SITE_DESCRIPTION,
    siteName: "Ivren",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ivren — the healthcare interface engine that proves it",
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
      className={`${inter.variable} ${jetbrainsMono.variable} ${geist.variable} ${geistMono.variable} h-full`}
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
        {children}
      </body>
    </html>
  );
}
