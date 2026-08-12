export type NavLink = {
  label: string;
  href: string;
};

export const mainNav: NavLink[] = [
  { label: "Product", href: "/product" },
  { label: "Download", href: "/download" },
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "/pricing" },
  { label: "Security", href: "/security" },
  { label: "Company", href: "/company" },
];

/**
 * Desktop header nav. "Download" is omitted here because it is the primary
 * CTA button; "Product" opens a mega-menu but still links through for
 * keyboard and no-JS use.
 */
export const headerNav: (NavLink & { mega?: boolean })[] = [
  { label: "Product", href: "/product", mega: true },
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "/pricing" },
  { label: "Security", href: "/security" },
  { label: "Company", href: "/company" },
];

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Product overview", href: "/product" },
      { label: "Download", href: "/download" },
      { label: "Pricing", href: "/pricing" },
      { label: "Security", href: "/security" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "How licensing & billing works", href: "/licensing" },
      { label: "Brand & press", href: "/brand" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Company", href: "/company" },
      { label: "Accessibility statement", href: "/accessibility" },
      { label: "Security.txt", href: "/.well-known/security.txt" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of use", href: "/terms" },
      { label: "EULA", href: "/eula" },
      { label: "Refund policy", href: "/refund" },
    ],
  },
];

export const docsNav: { title: string; href: string }[] = [
  { title: "Quick start", href: "/docs/quick-start" },
  { title: "Importing your estate", href: "/docs/importing-your-estate" },
  { title: "The console", href: "/docs/console" },
  { title: "CLI reference", href: "/docs/cli-reference" },
  { title: "Licensing & activation", href: "/docs/licensing-activation" },
  { title: "Security architecture", href: "/docs/security-architecture" },
  { title: "FAQ", href: "/docs/faq" },
];
