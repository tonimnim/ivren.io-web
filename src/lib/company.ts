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

/**
 * Offices. Only real, staffed locations belong here — a fabricated
 * address on a vendor site is the kind of thing a procurement reviewer
 * verifies and a CISO holds against you.
 */
export const offices = [
  {
    city: "Texas",
    country: "United States",
    role: "Headquarters",
    detail: "Product, engineering, and support",
  },
] as const;

/**
 * Social profiles. Only entries with a URL are rendered — an empty string
 * means the profile is simply omitted, never linked to a guessed handle.
 */
export const social = {
  linkedin: "",
  x: "",
  youtube: "",
  github: "",
  instagram: "",
} as const;

export type SocialKey = keyof typeof social;
