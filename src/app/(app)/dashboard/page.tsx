import Link from "next/link";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { StatTile } from "@/components/app/stat-tile";
import { authHeader, controlPlane } from "@/lib/control-plane";
import { getSession } from "@/lib/session";
import { getMe } from "@/lib/me";
import { readLicence, type LicenceState } from "@/lib/licence";

export const metadata = { title: "Overview", robots: { index: false } };

/** Tolerant read: an endpoint that is unreachable must not blank the page. */
async function safeGet<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

/** The holders of billing.read. */
const BILLING_ROLES = ["owner", "admin", "revenue"];

function licenceTile(licence: LicenceState) {
  switch (licence.kind) {
    case "entitled":
      return {
        value: "Paid",
        hint:
          licence.seats !== null
            ? `${licence.seats} machine seats`
            : "Paid plan active",
        tone: "ok" as const,
      };
    case "none":
      return {
        value: "Free",
        hint: "Map and analyse — no licence needed",
        tone: "neutral" as const,
      };
    case "unavailable":
      return {
        value: "Unavailable",
        hint: "Licensing is down on our side",
        tone: "warn" as const,
      };
    case "refused":
      return {
        value: "—",
        hint: "Not part of your role",
        tone: "neutral" as const,
      };
  }
}

export default async function OverviewPage() {
  const me = await getMe();
  if (!me) redirect("/login");
  const token = await getSession();

  const [licence, usage] = await Promise.all([
    readLicence(token!),
    safeGet(async () => {
      const { data } = await controlPlane.GET("/runs/usage", {
        headers: authHeader(token!),
      });
      return data as { runs?: number } | undefined;
    }),
  ]);

  const seatsLeft = Math.max(0, me.seats - me.seats_used);
  const runs = usage?.runs ?? 0;
  const tile = licenceTile(licence);
  const entitled = licence.kind === "entitled" ? licence : null;

  // Each step is ticked only when data proves it. A step nothing can detect —
  // downloading — is never ticked, rather than guessed at.
  const steps = [
    {
      title: "Choose a plan",
      body: "The free tier maps and analyses the whole estate. A paid plan runs the engine.",
      href: BILLING_ROLES.includes(me.role ?? "") ? "/dashboard/billing" : "/pricing",
      cta: "Plans",
      done: entitled !== null,
    },
    {
      title: "Download Ivren",
      body: "The desktop app, console and engine in one. It runs offline and never phones home.",
      href: "/dashboard/downloads",
      cta: "Downloads",
      done: false,
    },
    {
      title: "Mint the licence key",
      body: "What each machine presents when it activates. It is shown once.",
      href: "/dashboard/devices",
      cta: "Devices",
      done: entitled?.keyIssued ?? false,
    },
    {
      title: "Activate your first machine",
      body: "The machine writes an activation request; bring it to ivren.io/activate from any connected computer.",
      href: "/dashboard/devices",
      cta: "Devices",
      done: (entitled?.seatsInUse ?? 0) > 0,
    },
    {
      title: "Bring in your team",
      body: "Everyone gets their own account. Nobody shares a sign-in.",
      href: "/dashboard/users",
      cta: "People",
      done: me.seats_used > 1,
    },
  ];
  const onboarding = !(steps[0].done && steps[2].done && steps[3].done);

  return (
    <>
      <PageHeader
        title={me.name}
        description="Your organisation, its people and its licence."
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="People"
          value={`${me.seats_used} / ${me.seats}`}
          hint={seatsLeft === 0 ? "No seats free" : `${seatsLeft} free`}
          icon="Users"
          tone={seatsLeft === 0 ? "warn" : "neutral"}
        />
        <StatTile
          label="Licence"
          value={tile.value}
          hint={tile.hint}
          icon="BadgeCheck"
          tone={tile.tone}
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

      {onboarding && (
        <section className="mt-6 rounded-xl border border-hairline bg-paper p-6">
          <h2 className="text-[15px] font-medium text-ink">Getting started</h2>
          <p className="mt-1.5 max-w-xl text-[13.5px] leading-relaxed text-ink-secondary">
            Ivren routes clinical messages where the messages are — on your
            own machines. This console is how you run the relationship around
            it: plan, licence, machines and people.
          </p>

          <ol className="mt-6 space-y-3">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="flex gap-4 border-t border-hairline-soft pt-3 first:border-t-0 first:pt-0"
              >
                {step.done ? (
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-ok-soft">
                    <Check className="h-3 w-3 text-ok" aria-hidden />
                    <span className="sr-only">Done:</span>
                  </span>
                ) : (
                  <span className="mt-0.5 w-4 shrink-0 font-mono text-[11px] text-ink-label">
                    0{i + 1}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-[13.5px] font-medium ${step.done ? "text-ink-secondary" : "text-ink"}`}
                  >
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
    </>
  );
}
