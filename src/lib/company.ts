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
