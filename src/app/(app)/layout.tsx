import { redirect } from "next/navigation";
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

  const bands = visibleBands(me.sections ?? [], me.role ?? null);

  return (
    <div className="app-surface flex h-svh overflow-hidden bg-surface">
      <aside className="hidden w-[236px] shrink-0 flex-col border-r border-hairline bg-paper md:flex">
        <div className="flex h-14 shrink-0 items-center border-b border-hairline px-4">
          <Logo size="rail" href="/dashboard" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <RailLinks bands={bands} />
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
