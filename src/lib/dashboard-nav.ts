/**
 * One array declares every screen. The rail renders it, the top bar takes
 * its title and caption from it, and routes are built from it — a screen
 * exists in exactly one place, as in the installed console.
 *
 * Bands are the shape of the product, not a visual grouping. The web
 * console is the control plane, so the installed console's estate-at-rest
 * bands (Operations, Map, Wire…) are deliberately absent: that data lives
 * on-prem and hosting it would breach the transit-yes-rest-no boundary.
 */
export type NavStatus = "ready" | "partial" | "soon";

export type NavItem = {
  id: string;
  label: string;
  icon: string;
  path: string;
  status: NavStatus;
  caption: string;
  /** Server-served section required to see this. Omit for always-visible. */
  section?: string;
};

export type NavBand = { band: string; items: NavItem[] };

export const dashboardNav: NavBand[] = [
  {
    band: "Organisation",
    items: [
      {
        id: "overview",
        label: "Overview",
        icon: "LayoutDashboard",
        path: "/dashboard",
        status: "ready",
        caption: "Your organisation, its seats and its licence",
      },
      {
        id: "users",
        label: "Users & roles",
        icon: "Users",
        path: "/dashboard/users",
        status: "soon",
        caption: "Who may act on this organisation, and what each may do",
      },
    ],
  },
  {
    band: "AI lanes",
    items: [
      {
        id: "explain",
        label: "Explain",
        icon: "Sparkles",
        path: "/dashboard/explain",
        status: "soon",
        caption: "Paste an export, get an explanation. Nothing is stored.",
      },
      {
        id: "evidence",
        label: "Evidence",
        icon: "FileCheck",
        path: "/dashboard/evidence",
        status: "soon",
        caption: "Resolve a claim to the place it can be checked",
      },
    ],
  },
  {
    band: "Billing",
    items: [
      {
        id: "billing",
        label: "Plan & seats",
        icon: "CreditCard",
        path: "/dashboard/billing",
        status: "soon",
        caption: "What this organisation is on, and what it is using",
      },
    ],
  },
  {
    band: "Compliance",
    items: [
      {
        id: "audit",
        label: "Access log",
        icon: "ScrollText",
        path: "/dashboard/audit",
        status: "soon",
        caption: "Refusals and role changes, newest first",
        section: "audit",
      },
    ],
  },
  {
    band: "System",
    items: [
      {
        id: "keys",
        label: "API keys",
        icon: "KeyRound",
        path: "/dashboard/keys",
        status: "soon",
        caption: "Credentials for CI and integrations — not engine installs",
      },
      {
        id: "settings",
        label: "Settings",
        icon: "Settings",
        path: "/dashboard/settings",
        status: "soon",
        caption: "This organisation: profile, contacts and preferences",
        section: "settings",
      },
    ],
  },
];

/** Flatten for route/title lookup. */
export const navItems: NavItem[] = dashboardNav.flatMap((b) => b.items);

export function findNavItem(pathname: string): NavItem | undefined {
  // Longest match wins so /dashboard/users beats /dashboard.
  return [...navItems]
    .sort((a, b) => b.path.length - a.path.length)
    .find((i) => pathname === i.path || pathname.startsWith(i.path + "/"));
}

/**
 * Permission beats visibility: a screen the role may not see is absent
 * from the rail entirely, never rendered locked. Items without a section
 * requirement are organisation basics every member may see.
 */
export function visibleBands(sections: string[]): NavBand[] {
  return dashboardNav
    .map((b) => ({
      ...b,
      items: b.items.filter((i) => !i.section || sections.includes(i.section)),
    }))
    .filter((b) => b.items.length > 0);
}
