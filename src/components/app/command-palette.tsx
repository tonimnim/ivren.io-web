"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { NavIcon } from "@/components/app/nav-icon";
import type { NavBand } from "@/lib/dashboard-nav";

/**
 * ⌘K over the same nav array the rail renders, matching the installed
 * console. It searches only what this role may see, because the bands are
 * already filtered server-side.
 */
export function CommandPalette({ bands }: { bands: NavBand[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink/20 px-4 pt-[12vh] backdrop-blur-[2px]"
      onClick={() => setOpen(false)}
    >
      <Command
        label="Search"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-xl border border-hairline bg-paper shadow-[0_16px_48px_-16px_rgb(20_24_29/0.28)]"
      >
        <Command.Input
          autoFocus
          placeholder="Search screens…"
          className="w-full border-b border-hairline px-4 py-3.5 text-sm text-ink outline-none placeholder:text-ink-label"
        />
        <Command.List className="max-h-[320px] overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-[13px] text-ink-label">
            Nothing matches that.
          </Command.Empty>

          {bands.map((band) => (
            <Command.Group
              key={band.band}
              heading={band.band}
              className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-ink-label [&_[cmdk-group-heading]]:uppercase"
            >
              {band.items.map((item) => (
                <Command.Item
                  key={item.id}
                  value={`${item.label} ${item.caption}`}
                  onSelect={() => {
                    setOpen(false);
                    router.push(item.path);
                  }}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] text-ink-secondary data-[selected=true]:bg-surface data-[selected=true]:text-ink"
                >
                  <NavIcon name={item.icon} className="h-4 w-4 text-ink-label" />
                  <span className="truncate">{item.label}</span>
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>
      </Command>
    </div>
  );
}
