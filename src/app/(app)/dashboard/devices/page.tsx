import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/app/page-header";
import { StatTile } from "@/components/app/stat-tile";
import { Notice } from "@/components/app/notice";
import { MintKey } from "@/components/app/mint-key";
import { OfflineActivation } from "@/components/activate/offline-activation";
import { getSession } from "@/lib/session";
import { getMe } from "@/lib/me";
import { readLicence } from "@/lib/licence";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Devices", robots: { index: false } };

/** The holders of licensing.manage — the roles the API lets mint a key. */
const KEY_ROLES = ["owner", "admin"];

export default async function DevicesPage() {
  const me = await getMe();
  if (!me) redirect("/login");
  const token = await getSession();

  const licence = await readLicence(token!);
  const mayMint = KEY_ROLES.includes(me.role ?? "");

  return (
    <>
      <PageHeader
        title="Devices"
        description="Every machine running Ivren under this organisation's licence, and how each one is activated."
      />

      {licence.kind === "unavailable" && (
        <div className="mb-6">
          <Notice tone="warn" title="Licensing is unavailable on our side">
            No machine can be activated right now, online or offline, and seat
            counts can&apos;t be read until it is back. This is ours to fix;
            the page recovers by itself when it is.
          </Notice>
        </div>
      )}

      {licence.kind === "none" && (
        <div className="mb-6">
          <Notice title="No paid plan yet">
            The free tier needs no licence and no key: install Ivren and map
            the estate. A paid plan creates the licence key that machines
            running the engine activate with.{" "}
            {["owner", "admin", "revenue"].includes(me.role ?? "") && (
              <Link
                href="/dashboard/billing"
                className="text-accent hover:text-accent-strong"
              >
                See plans
              </Link>
            )}
          </Notice>
        </div>
      )}

      {licence.kind === "entitled" && (
        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <StatTile
            label="Machines"
            value={
              licence.seats === null || licence.seatsInUse === null
                ? "—"
                : `${licence.seatsInUse} / ${licence.seats}`
            }
            hint="Used / included by your plan"
            icon="Monitor"
          />
          <StatTile
            label="Licence key"
            value={licence.keyIssued ? "Minted" : "Not minted"}
            hint={
              licence.keyIssued
                ? "Shown once, when it was minted"
                : "Needed before any machine can activate"
            }
            icon="KeyRound"
            tone={licence.keyIssued ? "ok" : "warn"}
          />
          <StatTile
            label="Licence period ends"
            value={licence.periodEnd ? formatDate(licence.periodEnd) : "—"}
            hint="After it, machines fall back to the free tier"
            icon="Calendar"
          />
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
        <section className="min-w-0 rounded-xl border border-hairline bg-paper p-5 sm:p-6">
          <h2 className="text-[15px] font-medium text-ink">
            Activate an offline machine
          </h2>
          <p className="mt-1 mb-5 text-[13px] leading-relaxed text-ink-secondary">
            For a machine with no internet connection: paste the request it
            saved and carry the licence back. The same form is open to anyone
            at{" "}
            <Link href="/activate" className="text-accent hover:text-accent-strong">
              ivren.io/activate
            </Link>
            , so it works from a computer where nobody is signed in.
          </p>
          <OfflineActivation />
        </section>

        <div className="min-w-0 space-y-6">
          {mayMint && licence.kind === "entitled" && (
            <section className="rounded-xl border border-hairline bg-paper p-5 sm:p-6">
              <h2 className="text-[15px] font-medium text-ink">Licence key</h2>
              <p className="mt-1 mb-4 text-[13px] leading-relaxed text-ink-secondary">
                What a machine presents when it activates. Owners and admins
                mint it, and it is shown once.
              </p>
              <MintKey keyIssued={licence.keyIssued} />
            </section>
          )}

          <Notice title="The machine list isn't available yet">
            Each machine&apos;s name, site, version and last check-in arrive
            with the device registry, along with removing a machine. Until
            then, the count above is how many machines are activated.
          </Notice>
        </div>
      </div>
    </>
  );
}
