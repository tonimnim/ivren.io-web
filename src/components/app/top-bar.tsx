"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu } from "@base-ui/react/menu";
import { Drawer } from "@base-ui/react/drawer";
import { ChevronDown, LogOut, Menu as MenuIcon, Search } from "lucide-react";
import { Logo } from "@/components/logo";
import { RailLinks } from "@/components/app/rail-links";
import { findNavItem, type NavBand } from "@/lib/dashboard-nav";

/**
 * Title and caption come from the nav array — never retyped per page.
 * Carries the mobile navigation, because a rail hidden below md with no
 * other way in is a dashboard with no navigation on a phone.
 */
export function TopBar({
  orgName,
  role,
  bands,
}: {
  orgName: string;
  role: string | null;
  bands: NavBand[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const item = findNavItem(pathname ?? "");

  const initials = orgName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex min-h-16 items-center justify-between gap-4 border-b border-hairline bg-paper px-4 py-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
          <Drawer.Trigger
            aria-label="Open navigation"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-secondary transition-colors hover:bg-surface hover:text-ink md:hidden"
          >
            <MenuIcon className="h-[18px] w-[18px]" />
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Backdrop className="fixed inset-0 z-40 bg-ink/25" />
            <Drawer.Popup className="fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col bg-paper">
              <div className="flex h-16 items-center border-b border-hairline px-5">
                <Logo />
              </div>
              <div className="flex-1 overflow-y-auto">
                <RailLinks
                  bands={bands}
                  onNavigate={() => setDrawerOpen(false)}
                />
              </div>
            </Drawer.Popup>
          </Drawer.Portal>
        </Drawer.Root>

        <div className="min-w-0">
          <h1 className="truncate text-[15px] font-medium text-ink">
            {item?.label ?? "Console"}
          </h1>
          {item?.caption && (
            <p className="hidden truncate text-[12.5px] text-ink-label sm:block">
              {item.caption}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() =>
            window.dispatchEvent(
              new KeyboardEvent("keydown", { key: "k", metaKey: true }),
            )
          }
          aria-label="Search screens"
          className="hidden items-center gap-2 rounded-lg border border-hairline bg-surface/60 py-1.5 pr-1.5 pl-3 text-[12.5px] text-ink-label transition-colors hover:border-ink-label/40 hover:text-ink-secondary lg:flex"
        >
          <Search className="h-3.5 w-3.5" />
          Search
          <kbd className="rounded border border-hairline bg-paper px-1.5 py-0.5 font-mono text-[10px]">
            ⌘K
          </kbd>
        </button>

        <Menu.Root>
          <Menu.Trigger className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft font-mono text-[11px] font-medium text-accent">
              {initials || "IV"}
            </span>
            <span className="hidden max-w-[12rem] truncate text-[13px] text-ink sm:block">
              {orgName}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-ink-label" />
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner sideOffset={8} align="end">
              <Menu.Popup className="min-w-[220px] rounded-xl border border-hairline bg-paper p-1.5 shadow-[0_12px_32px_-12px_rgb(20_24_29/0.24)]">
                <div className="px-3 py-2">
                  <p className="truncate text-[13px] font-medium text-ink">
                    {orgName}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-ink-label">
                    {role ?? "no role"}
                  </p>
                </div>
                <Menu.Separator className="my-1 h-px bg-hairline-soft" />
                <Menu.Item
                  onClick={signOut}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-ink-secondary outline-none data-[highlighted]:bg-surface data-[highlighted]:text-ink"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </div>
    </header>
  );
}
