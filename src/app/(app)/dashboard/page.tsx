import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, KeyRound, ShieldCheck } from "lucide-react";
import { StatTile } from "@/components/app/stat-tile";
import { authHeader, controlPlane } from "@/lib/control-plane";
import { getSession } from "@/lib/session";
import { getMe } from "@/lib/me";

export const metadata = { title: "Overview", robots: { index: false } };

/** Tolerant read: an endpoint that is unreachable must not blank the page. */
async function safeGet<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

export default async function OverviewPage() {
  const me = await getMe();
  if (!me) redirect("/login");
  const token = await getSession();

  const licence = await safeGet(async () => {
    const { data } = await controlPlane.GET("/licensing/status", {
      headers: authHeader(token!),
    });
    return data as Record<string, unknown> | undefined;
  });

  const usage = await safeGet(async () => {
    const { data } = await controlPlane.GET("/runs/usage", {
      headers: authHeader(token!),
    });
    return data as { runs?: number } | undefined;
  });

  const seatsLeft = Math.max(0, me.seats - me.seats_used);
  const entitled = Boolean(
    licence && (licence.entitled ?? licence.active ?? false),
  );
  const runs = usage?.runs ?? 0;

  return (
    <div className="mx-auto max-w-5xl">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Seats used"
          value={`${me.seats_used} / ${me.seats}`}
          hint={seatsLeft === 0 ? "No seats free" : `${seatsLeft} free`}
          icon="Users"
          tone={seatsLeft === 0 ? "warn" : "neutral"}
        />
        <StatTile
          label="Licence"
          value={entitled ? "Active" : "Trial"}
          hint={entitled ? "Entitled" : "Free to evaluate"}
          icon="BadgeCheck"
          tone={entitled ? "ok" : "neutral"}
        />
        <StatTile
          label="Runs this month"
          value={runs.toLocaleString("en-US")}
          hint="Gate and test runs uploaded"
          icon="Activity"
          tone="neutral"
        />
        <StatTile
          label="Your role"
          value={me.role ?? "—"}
          hint="Decides what you may see"
          icon="ShieldCheck"
          tone="accent"
        />
      </section>

      {/* A new organisation has no runs. Guidance beats an empty chart. */}
      {runs === 0 && (
        <section className="mt-6 rounded-xl border border-hairline bg-paper p-6">
          <h2 className="text-[15px] font-medium text-ink">
            Get the engine running
          </h2>
          <p className="mt-1.5 max-w-xl text-[13.5px] leading-relaxed text-ink-secondary">
            Ivren routes clinical messages where the messages are — on your
            own machines. This console is how you run the relationship
            around it: seats, licensing and evidence.
          </p>

          <ol className="mt-6 space-y-3">
            {[
              {
                Icon: Download,
                title: "Download the engine",
                body: "One executable for Windows. It runs offline and never phones home.",
                href: "/download",
                cta: "Download",
              },
              {
                Icon: KeyRound,
                title: "Create an API key",
                body: "Named at creation, for CI and integrations. Engine installs get their own credential.",
                href: "/dashboard/keys",
                cta: "Settings",
              },
              {
                Icon: ShieldCheck,
                title: "Gate your first change",
                body: "ivren gate returns 0 PASS, 1 FAIL, 3 INDETERMINATE — missing evidence never becomes a pass.",
                href: "/docs/cli-reference",
                cta: "CLI reference",
              },
            ].map((step, i) => (
              <li
                key={step.title}
                className="flex gap-4 border-t border-hairline-soft pt-3 first:border-t-0 first:pt-0"
              >
                <span className="mt-0.5 font-mono text-[11px] text-ink-label">
                  0{i + 1}
                </span>
                <step.Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-medium text-ink">
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-ink-secondary">
                    {step.body}
                  </p>
                </div>
                <Link
                  href={step.href}
                  className="shrink-0 self-center text-[13px] text-accent hover:text-accent-strong"
                >
                  {step.cta}
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      <p className="mt-6 rounded-xl border border-hairline bg-paper px-5 py-4 text-[12.5px] leading-relaxed text-ink-secondary">
        Your estate configuration is processed, never stored. This console
        has no storage that could hold it —{" "}
        <Link href="/security" className="text-accent hover:text-accent-strong">
          read the boundary
        </Link>
        .
      </p>
    </div>
  );
}
