"use client";

import { usePathname } from "next/navigation";
import { findNavItem } from "@/lib/dashboard-nav";
import { LogoutButton } from "@/components/app/logout-button";

/** Title and caption come from the nav array — never retyped per page. */
export function TopBar({ orgName }: { orgName: string }) {
  const pathname = usePathname();
  const item = findNavItem(pathname ?? "");

  return (
    <header className="flex min-h-16 items-center justify-between gap-6 border-b border-hairline bg-paper px-6 py-3">
      <div className="min-w-0">
        <h1 className="truncate text-[15px] font-medium text-ink">
          {item?.label ?? "Dashboard"}
        </h1>
        {item?.caption && (
          <p className="truncate text-[12.5px] text-ink-label">
            {item.caption}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <span className="hidden max-w-[16rem] truncate text-[13px] text-ink-secondary sm:block">
          {orgName}
        </span>
        <LogoutButton />
      </div>
    </header>
  );
}
