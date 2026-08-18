import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { authHeader, controlPlane } from "@/lib/control-plane";
import { getSession } from "@/lib/session";
import { LogoutButton } from "@/components/app/logout-button";

export const metadata = { title: "Dashboard", robots: { index: false } };

/**
 * Server component: the session token is read here and never reaches the
 * browser. `sections` is the API's nav contract — render exactly what it
 * returns, never a locked-looking item the role may not use.
 */
export default async function DashboardPage() {
  const token = await getSession();
  if (!token) redirect("/login");

  const { data, error } = await controlPlane.GET("/auth/me", {
    headers: authHeader(token),
  });

  // An expired or revoked session is indistinguishable from none.
  if (error || !data) redirect("/login");

  const sections = data.sections ?? [];

  return (
    <div className="min-h-svh">
      <header className="border-b border-hairline">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo />
          <LogoutButton />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <p className="kicker">Organisation</p>
        <h1 className="mt-3 text-3xl font-medium tracking-[-0.024em] text-ink">
          {data.name}
        </h1>

        <dl className="mt-8 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-3">
          {[
            ["Seats used", `${data.seats_used} of ${data.seats}`],
            ["Your role", data.role ?? "—"],
            ["Organisation ID", data.id],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0 bg-canvas p-5">
              <dt className="font-mono text-[10.5px] tracking-[0.14em] text-ink-label uppercase">
                {label}
              </dt>
              <dd className="mt-2 truncate font-mono text-sm text-ink">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-12 text-xl font-medium text-ink">
          Available to you
        </h2>
        {sections.length ? (
          <ul className="mt-5 flex flex-wrap gap-2">
            {sections.map((s: string) => (
              <li
                key={s}
                className="rounded-full border border-hairline bg-surface px-3 py-1.5 font-mono text-xs text-ink-secondary"
              >
                {s}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-secondary">
            This credential has no sections assigned. An administrator in
            your organisation can grant them.
          </p>
        )}

        <p className="mt-12 border-t border-hairline pt-6 text-sm text-ink-secondary">
          Prefer to run it locally?{" "}
          <Link
            href="/download"
            className="text-accent hover:text-accent-strong"
          >
            Download the engine
          </Link>{" "}
          and activate it with your API key.
        </p>
      </div>
    </div>
  );
}
