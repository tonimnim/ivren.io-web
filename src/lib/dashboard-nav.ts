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
        id: "users",
        label: "Users",
        icon: "Users",
        path: "/dashboard/users",
        caption: "Who may act on this organisation, and what each may do",
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
export function visibleBands(sections: string[]): NavBand[] {
  return dashboardNav
    .map((b) => ({
      ...b,
      items: b.items.filter((i) => !i.section || sections.includes(i.section)),
    }))
    .filter((b) => b.items.length > 0);
}
