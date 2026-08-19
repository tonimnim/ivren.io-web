import { redirect } from "next/navigation";
import Link from "next/link";
import { Download } from "lucide-react";
import { Logo } from "@/components/logo";
import { RailLinks } from "@/components/app/rail-links";
import { TopBar } from "@/components/app/top-bar";
import { CommandPalette } from "@/components/app/command-palette";
import { visibleBands } from "@/lib/dashboard-nav";
import { getMe } from "@/lib/me";

/**
 * The console shell. Geist throughout, matching the installed console, so
 * the hosted and local surfaces read as one product.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await getMe();
  if (!me) redirect("/login");

  const bands = visibleBands(me.sections ?? []);
  const seatsLeft = Math.max(0, me.seats - me.seats_used);

  return (
    <div className="app-surface flex min-h-svh bg-surface">
      <aside className="hidden w-[248px] shrink-0 flex-col border-r border-hairline bg-paper md:flex">
        <div className="flex h-16 items-center border-b border-hairline px-5">
          <Logo />
        </div>

        <div className="flex-1 overflow-y-auto">
          <RailLinks bands={bands} />
        </div>

        <div className="border-t border-hairline p-3">
          <div className="rounded-lg bg-surface px-3 py-2.5">
            <p className="font-mono text-[10px] tracking-[0.14em] text-ink-label uppercase">
              Seats
            </p>
            <p className="mt-1 font-tabular text-[13px] text-ink">
              {me.seats_used} of {me.seats} used
            </p>
            {seatsLeft === 0 && (
              <p className="mt-0.5 text-[11.5px] text-warn">None free</p>
            )}
          </div>

          <Link
            href="/download"
            className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-[12.5px] text-ink-secondary transition-colors hover:bg-surface hover:text-ink"
          >
            <Download className="h-3.5 w-3.5 text-ink-label" />
            Download the engine
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar orgName={me.name} role={me.role ?? null} bands={bands} />
        <main id="main" className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>

      <CommandPalette bands={bands} />
    </div>
  );
}
