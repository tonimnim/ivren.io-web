import type { Metadata } from "next";
import { company, social } from "@/lib/company";

export const SITE_URL = "https://ivren.io";
export const SITE_NAME = "Ivren";

/**
 * Category terms this site should rank for. Deliberately excludes
 * competitor product names — see the vendor-neutral positioning rule.
 * These feed page keywords and the glossary, not keyword stuffing.
 */
export const CORE_TERMS = [
  "healthcare interface engine",
  "healthcare integration engine",
  "healthcare interoperability platform",
  "HL7 interface monitoring",
  "HL7 v2 parser",
  "HL7 message validation",
  "interface estate mapping",
  "clinical data integration",
  "hospital integration software",
  "FHIR R4 validation",
  "DICOM worklist monitoring",
  "X12 claims validation",
  "NCPDP pharmacy claims",
  "MLLP listener",
  "ADT feed monitoring",
  "interface regression testing",
  "interface engine migration",
  "HL7 impact analysis",
  "healthcare EDI integration",
  "air-gapped healthcare software",
] as const;

/** One canonical description used as the default across the site. */
export const SITE_DESCRIPTION =
  "Ivren maps, verifies, runs, and monitors the HL7, FHIR, DICOM, X12, and NCPDP interfaces inside a hospital. It reads the configuration your interface engine already produces, proves changes are safe before they reach production, and runs entirely on your own machine — offline, with no account.";

type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
};

/**
 * Per-route metadata. Two things this exists to prevent:
 *
 * 1. Inherited `og:url`. Next merges metadata shallowly, so an
 *    `openGraph` object defined in the root layout is inherited whole by
 *    every descendant — making every page claim to be the homepage.
 *    Defining openGraph per page replaces it outright.
 * 2. Missing canonicals. Next does not emit `rel="canonical"` on its
 *    own; `metadataBase` only resolves relative URLs. Canonical must
 *    never be set in a layout or every page canonicalises to one URL.
 */
export function pageMetadata({
  title,
  description,
  path,
  ogType = "website",
}: PageSeoInput): Metadata {
  const url = `${SITE_URL}${path || "/"}`;
  // og:title does not inherit title.template — compute it once.
  const fullTitle = path === "" ? title : `${title} — ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: ogType,
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

const sameAs = Object.values(social).filter(Boolean);

/** Organization — the entity signal that ties the brand to its profiles. */
export const organizationSchema = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  legalName: company.legalName,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.png`,
    width: 2000,
    height: 2000,
  },
  description: SITE_DESCRIPTION,
  email: company.email,
  telephone: company.phone,
  address: {
    "@type": "PostalAddress",
    addressRegion: "TX",
    addressCountry: "US",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: company.email,
      telephone: company.phone,
      areaServed: "US",
      availableLanguage: "English",
    },
    {
      "@type": "ContactPoint",
      contactType: "technical support",
      email: company.securityEmail,
      areaServed: "US",
    },
  ],
  ...(sameAs.length ? { sameAs } : {}),
};

/** WebSite — establishes the site entity and its name for search engines. */
export const webSiteSchema = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-US",
};

/** SoftwareApplication — the product itself, the strongest signal here. */
export const softwareSchema = {
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#software`,
  name: SITE_NAME,
  // HealthApplication is a supported enum and a real topical signal.
  applicationCategory: "HealthApplication",
  applicationSubCategory: "Healthcare integration and interface assurance",
  operatingSystem: "Windows 10, Windows 11",
  softwareVersion: company.version,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  downloadUrl: `${SITE_URL}/download`,
  publisher: { "@id": `${SITE_URL}/#organization` },
  featureList: [
    "Interface estate mapping from existing engine configuration exports",
    "Downstream impact analysis for field changes",
    "Regression testing against recorded traffic",
    "Deployment gate with CI exit codes (PASS, FAIL, INDETERMINATE, REFUSED)",
    "Shadow-run migration with signed divergence reports",
    "HL7 v2, FHIR R4, DICOM, X12 and NCPDP parsing and conformance",
    "Durable local engine with MLLP, HTTP and file listeners",
    "Alert-on-silence for feeds that stop unexpectedly",
    "Offline and air-gapped licence activation",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description:
      "Free Trial tier — full product, no account required. Professional and Enterprise licensing available.",
  },
};

/** Wraps schema objects in a single @graph for one script tag. */
export function jsonLdGraph(...nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

export function breadcrumbSchema(
  trail: { name: string; path: string }[],
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path}`,
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
