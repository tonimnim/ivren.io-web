import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

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
  metadataBase: new URL("https://ivren.io"),
  title: {
    default: "Ivren — healthcare interface assurance and integration platform",
    template: "Ivren — %s",
  },
  description:
    "Ivren maps, verifies, runs, and monitors the data interfaces inside a hospital. Reads the configuration your interface engine already produces. Runs entirely on your machine.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Ivren — healthcare interface assurance and integration platform",
    description:
      "Ivren maps, verifies, runs, and monitors the data interfaces inside a hospital. Runs entirely on your machine.",
    url: "https://ivren.io",
    siteName: "Ivren",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ivren — healthcare interface assurance and integration platform",
    description:
      "Ivren maps, verifies, runs, and monitors the data interfaces inside a hospital. Runs entirely on your machine.",
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
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
