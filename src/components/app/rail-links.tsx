"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon } from "@/components/app/nav-icon";
import type { NavBand } from "@/lib/dashboard-nav";

/**
 * The banded list itself, shared by the fixed rail and the mobile drawer so
 * there is one implementation of "what the navigation looks like".
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
    <nav className="flex flex-col gap-7 p-4">
      {bands.map((band) => (
        <div key={band.band}>
          <p className="px-3 pb-2 font-mono text-[10px] font-medium tracking-[0.14em] text-ink-label uppercase">
            {band.band}
          </p>
          <ul className="space-y-0.5">
            {band.items.map((item) => {
              const active =
                pathname === item.path || pathname.startsWith(item.path + "/");
              const soon = item.status === "soon";

              return (
                <li key={item.id}>
                  <Link
                    href={item.path}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] transition-colors duration-150 ${
                      active
                        ? "bg-accent-soft font-medium text-accent"
                        : soon
                          ? "text-ink-label hover:bg-surface hover:text-ink-secondary"
                          : "text-ink-secondary hover:bg-surface hover:text-ink"
                    }`}
                  >
                    <NavIcon
                      name={item.icon}
                      className={`h-4 w-4 shrink-0 ${
                        active
                          ? "text-accent"
                          : soon
                            ? "text-ink-label/60"
                            : "text-ink-label"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                    {soon && (
                      <span className="ml-auto rounded-full bg-surface-2 px-1.5 py-0.5 font-mono text-[9.5px] tracking-[0.08em] text-ink-label uppercase">
                        soon
                      </span>
                    )}
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
