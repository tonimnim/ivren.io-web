/**
 * Single source of truth for company details rendered across the site.
 * Update here, not in individual pages.
 */
export const company = {
  legalName: "Ivren",
  email: "enquiry@ivren.io",
  securityEmail: "security@ivren.io",
  phone: "+1 (732) 532-8114",
  phoneHref: "tel:+17325328114",
  location: "Texas, United States",
  version: "1.7",
  /**
   * Public URL of the release artifacts. Leave empty until real signed
   * builds are published — the Download page falls back to a request
   * link rather than rendering a dead button.
   */
  downloadUrl: "",
} as const;

/**
 * Mailing-list endpoint. Empty means the subscribe bar falls back to a
 * pre-addressed mail draft rather than posting into a void.
 */
export const newsletterEndpoint = "";

export type Office = {
  /** City or region as it should read on the page. */
  city: string;
  country: string;
  /** Headquarters, Engineering, Support, Sales — short label. */
  role: string;
  /** What actually happens at this location. */
  detail: string;
  /** Short zone label plus UTC offset, e.g. "CT · UTC−6". */
  timezone: string;
  /** Optional street address. Omit unless it is a real, staffed office. */
  address?: string;
};

/**
 * Offices. Only real, staffed locations belong here — a fabricated
 * address on a vendor site is the kind of thing a procurement reviewer
 * checks and a CISO holds against you. Add entries as they open.
 */
export const offices: Office[] = [
  {
    city: "Texas",
    country: "United States",
    role: "Headquarters",
    detail:
      "Product, engineering, and customer support. Licence issuing and security response run from here.",
    timezone: "CT · UTC−6",
  },
];

/**
 * Social profiles. Only entries with a URL render — an empty string omits
 * that icon entirely.
 *
 * NOTE: these use the conventional handle for the domain and have NOT been
 * confirmed as owned by Ivren. Verify each one resolves to the real
 * account before this site takes meaningful traffic, and correct or blank
 * any that don't.
 */
export const social = {
  linkedin: "https://www.linkedin.com/company/ivren",
  x: "https://x.com/ivren",
  youtube: "https://www.youtube.com/@ivren",
  github: "",
  instagram: "",
} as const;

export type SocialKey = keyof typeof social;
