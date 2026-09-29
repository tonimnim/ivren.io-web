/**
 * One array declares every screen. The rail renders it, the top bar takes
 * its title and caption from it, and the command palette searches it.
 *
 * Every entry here is backed by a real endpoint and a built page. Screens
 * without data behind them are not listed at all — a rail of dead links
 * teaches people the navigation lies.
 */
export type NavItem = {
  id: string;
  label: string;
  icon: string;
  path: string;
  caption: string;
  /** Server-served section required to see this. Omit for always-visible. */
  section?: string;
  /**
   * Roles that see this. Omit for every role.
   *
   * A stopgap with a reason: the sections `/auth/me` serves describe the
   * engine's console (interfaces, queues, routes…), not these web screens, so
   * there is no served section to gate Billing on yet. The roles listed are the
   * holders of the permission the screen reads — the API still refuses anyone
   * else. When the sections contract grows web screens, this moves there.
   */
  roles?: string[];
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
        caption: "Your organisation, its seats and its licence",
      },
      {
        id: "people",
        label: "People",
        icon: "Users",
        path: "/dashboard/users",
        caption: "Who may act on this organisation, and what each may do",
      },
      {
        id: "billing",
        label: "Billing",
        icon: "CreditCard",
        path: "/dashboard/billing",
        caption: "Your plan, what it includes, and how to change it",
        // billing.read
        roles: ["owner", "admin", "revenue"],
      },
    ],
  },
  {
    band: "Machines",
    items: [
      {
        id: "devices",
        label: "Devices",
        icon: "Monitor",
        path: "/dashboard/devices",
        caption: "Every machine running Ivren, and how each is activated",
      },
      {
        id: "downloads",
        label: "Downloads",
        icon: "Download",
        path: "/dashboard/downloads",
        caption: "The desktop app, for every machine in this organisation",
      },
    ],
  },
  {
    band: "Security",
    items: [
      {
        id: "keys",
        label: "API keys",
        icon: "KeyRound",
        path: "/dashboard/keys",
        caption: "Credentials for CI and integrations — not engine installs",
      },
      {
        id: "access",
        label: "Access log",
        icon: "ScrollText",
        path: "/dashboard/access",
        caption: "Refusals and role changes, newest first",
        section: "access",
      },
    ],
  },
];

export const navItems: NavItem[] = dashboardNav.flatMap((b) => b.items);

export function findNavItem(pathname: string): NavItem | undefined {
  return [...navItems]
    .sort((a, b) => b.path.length - a.path.length)
    .find((i) => pathname === i.path || pathname.startsWith(i.path + "/"));
}

/**
 * Permission beats visibility: a screen the role may not see is absent
 * from the rail entirely, never rendered locked.
 */
export function visibleBands(
  sections: string[],
  role: string | null,
): NavBand[] {
  return dashboardNav
    .map((b) => ({
      ...b,
      items: b.items.filter(
        (i) =>
          (!i.section || sections.includes(i.section)) &&
          (!i.roles || (role !== null && i.roles.includes(role))),
      ),
    }))
    .filter((b) => b.items.length > 0);
}
