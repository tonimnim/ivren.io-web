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

/**
 * The tagline. Claims the category an evaluator's checklist actually
 * has, then the difference.
 */
export const SITE_TAGLINE = "The interface engine that proves it.";

/** Default title. Leads with the category term buyers search for. */
export const SITE_TITLE =
  "Ivren — the healthcare interface engine that proves it";

/**
 * One canonical description used as the default across the site.
 *
 * Ivren IS the interface engine — it routes clinical messages. Reading
 * an incumbent's configuration is a migration on-ramp, not the identity;
 * describing it as a layer over the engine you already run inverts the
 * product.
 */
export const SITE_DESCRIPTION =
  "Ivren is a healthcare interface engine. It routes HL7 v2, FHIR, DICOM, X12, and NCPDP messages through one durable, audited pipeline — and unlike any other engine, shows you what it carried, what changed, and what a change would break before you ship it. Runs entirely on your own machine, offline, with no account.";

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
  applicationSubCategory: "Healthcare interface engine",
  slogan: SITE_TAGLINE,
  operatingSystem: "Windows 10, Windows 11",
  softwareVersion: company.version,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  downloadUrl: `${SITE_URL}/download`,
  publisher: { "@id": `${SITE_URL}/#organization` },
  featureList: [
    "MLLP, HTTP and file spool listeners",
    "HL7 v2 across twelve embedded dictionaries, plus FHIR, CDA, DICOM, X12 and NCPDP",
    "Filters and transforms through one durable, reviewed pipeline",
    "Fan-out over MLLP, HTTP, HTTPS and file",
    "Durable queue with fsync-before-ack, dead letters and replay",
    "Hash-chained audit trail and role-based access control",
    "Deployment gate with CI exit codes (PASS, FAIL, INDETERMINATE, REFUSED)",
    "Interface estate inventory correlated across mixed engines",
    "Certificate expiry and unencrypted-feed detection",
    "Migration on-ramp: imports an incumbent engine's configuration",
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
