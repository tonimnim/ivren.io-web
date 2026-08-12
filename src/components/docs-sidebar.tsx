"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNav } from "@/lib/nav";

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <ul className="space-y-1">
      {docsNav.map((item) => {
        const active = pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className={`block rounded-md px-3 py-1.5 text-sm transition-colors duration-150 ${
                active
                  ? "bg-accent-soft font-medium text-accent"
                  : "text-ink-secondary hover:bg-surface hover:text-ink"
              }`}
            >
              {item.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function DocsSidebar() {
  return (
    <nav>
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.1em] text-ink-label">
        Docs
      </p>
      <NavList />
    </nav>
  );
}

export function DocsMobileNav() {
  return (
    <details className="mb-8 rounded-md border border-hairline md:hidden">
      <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-ink">
        Docs navigation
      </summary>
      <div className="border-t border-hairline px-3 py-3">
        <NavList />
      </div>
    </details>
  );
}
