import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { AppRail } from "@/components/app/app-rail";
import { TopBar } from "@/components/app/top-bar";
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

  return (
    <div className="app-surface flex min-h-svh bg-surface">
      <aside className="hidden w-[248px] shrink-0 flex-col border-r border-hairline bg-paper md:flex">
        <div className="flex h-16 items-center border-b border-hairline px-5">
          <Logo />
        </div>
        <div className="flex-1 overflow-y-auto">
          <AppRail bands={bands} />
        </div>
        <div className="border-t border-hairline p-4">
          <Link
            href="/download"
            className="block rounded-lg bg-surface px-3 py-2.5 text-[12.5px] leading-relaxed text-ink-secondary transition-colors hover:text-ink"
          >
            Run it locally — download the engine
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar orgName={me.name} />
        <main id="main" className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
