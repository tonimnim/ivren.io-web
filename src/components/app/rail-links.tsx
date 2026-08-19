"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon } from "@/components/app/nav-icon";
import type { NavBand } from "@/lib/dashboard-nav";

/**
 * The banded list, shared by the fixed rail and the mobile drawer so there
 * is one implementation of what the navigation looks like.
 */
export function RailLinks({
  bands,
  onNavigate,
}: {
  bands: NavBand[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6 px-3 py-4">
      {bands.map((band) => (
        <div key={band.band}>
          <p className="px-3 pb-1.5 text-[11px] font-medium text-ink-label">
            {band.band}
          </p>
          <ul className="space-y-0.5">
            {band.items.map((item) => {
              const active =
                pathname === item.path ||
                (item.path !== "/dashboard" &&
                  pathname.startsWith(item.path + "/"));

              return (
                <li key={item.id}>
                  <Link
                    href={item.path}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex items-center gap-2.5 rounded-md px-3 py-[7px] text-[13.5px] transition-colors duration-150 ${
                      active
                        ? "bg-surface-2 font-medium text-ink"
                        : "text-ink-secondary hover:bg-surface hover:text-ink"
                    }`}
                  >
                    {active && (
                      <span
                        aria-hidden
                        className="absolute top-1/2 left-0 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-accent"
                      />
                    )}
                    <NavIcon
                      name={item.icon}
                      className={`h-[15px] w-[15px] shrink-0 ${
                        active ? "text-accent" : "text-ink-label"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
