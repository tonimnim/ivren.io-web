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
 * The console shell: exactly one viewport tall, with the rail fixed and
 * only the content column scrolling. Geist throughout, matching the
 * installed console, so the hosted and local surfaces read as one product.
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
  const seatPct = me.seats > 0 ? (me.seats_used / me.seats) * 100 : 0;

  return (
    <div className="app-surface flex h-svh overflow-hidden bg-surface">
      <aside className="hidden w-[236px] shrink-0 flex-col border-r border-hairline bg-paper md:flex">
        <div className="flex h-14 shrink-0 items-center border-b border-hairline px-4">
          <Logo size="rail" href="/dashboard" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <RailLinks bands={bands} />
        </div>

        <div className="shrink-0 border-t border-hairline p-3">
          <div className="rounded-lg border border-hairline bg-surface/70 p-3">
            <div className="flex items-baseline justify-between">
              <p className="text-[11px] font-medium text-ink-label">Seats</p>
              <p className="font-tabular text-[11.5px] text-ink-secondary">
                {me.seats_used}/{me.seats}
              </p>
            </div>
            <div
              className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2"
              role="img"
              aria-label={`${me.seats_used} of ${me.seats} seats used`}
            >
              <div
                className={`h-full rounded-full ${seatsLeft === 0 ? "bg-warn" : "bg-accent"}`}
                style={{ width: `${Math.min(100, seatPct)}%` }}
              />
            </div>
          </div>

          <Link
            href="/download"
            className="mt-2 flex items-center gap-2 rounded-md px-3 py-2 text-[12.5px] text-ink-secondary transition-colors hover:bg-surface hover:text-ink"
          >
            <Download className="h-[15px] w-[15px] text-ink-label" />
            Download the engine
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar orgName={me.name} role={me.role ?? null} bands={bands} />
        <main id="main" className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl p-4 sm:p-6">{children}</div>
        </main>
      </div>

      <CommandPalette bands={bands} />
    </div>
  );
}
