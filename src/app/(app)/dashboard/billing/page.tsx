import { redirect } from "next/navigation";
import { PageHeader, EmptyState } from "@/components/app/page-header";
import { Notice } from "@/components/app/notice";
import { StatTile } from "@/components/app/stat-tile";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authHeader, controlPlane } from "@/lib/control-plane";
import { getSession } from "@/lib/session";
import { getMe } from "@/lib/me";
import { formatDate } from "@/lib/format";
import { company } from "@/lib/company";
import {
  CARD_CHECKOUT_AVAILABLE,
  PLAN_AUDIENCE,
  formatPrice,
  getPlans,
  siteBand,
  type Plan,
} from "@/lib/plans";

export const metadata = { title: "Billing", robots: { index: false } };

type BillingState =
  | { kind: "unavailable" }
  | { kind: "refused" }
  | {
      kind: "ok";
      subscribed: boolean;
      plan: string | null;
      status: string | null;
      seats: number | null;
      periodEnd: string | null;
      cancelledAt: string | null;
    };

async function readBilling(token: string): Promise<BillingState> {
  try {
    const { data, response } = await controlPlane.GET("/billing/status", {
      headers: authHeader(token),
    });
    if (response.status === 401 || response.status === 403) {
      return { kind: "refused" };
    }
    if (!data) return { kind: "unavailable" };
    const d = data as Record<string, unknown>;
    const str = (v: unknown) => (typeof v === "string" ? v : null);
    return {
      kind: "ok",
      subscribed: d.subscribed === true,
      plan: str(d.plan),
      status: str(d.status),
      seats: typeof d.seats === "number" ? d.seats : null,
      periodEnd: str(d.current_period_end),
      cancelledAt: str(d.cancelled_at),
    };
  } catch {
    return { kind: "unavailable" };
  }
}

/** Stripe's subscription states, in words a hospital's admin would use. */
const STATUS_WORDS: Record<string, string> = {
  active: "Active",
  trialing: "Active",
  past_due: "Payment failed",
  unpaid: "Unpaid",
  canceled: "Cancelled",
  incomplete: "Awaiting payment",
  incomplete_expired: "Expired",
  paused: "Paused",
};

const FAILED = new Set(["past_due", "unpaid"]);

/** Sites follow from seats only when they divide exactly; otherwise say nothing. */
function sitesFor(seats: number | null, plan: Plan | null) {
  if (seats === null || !plan || plan.seats_per_site <= 0) return null;
  return seats % plan.seats_per_site === 0 ? seats / plan.seats_per_site : null;
}

export default async function BillingPage() {
  const me = await getMe();
  if (!me) redirect("/login");
  const token = await getSession();

  const [billing, plans] = await Promise.all([
    readBilling(token!),
    getPlans(),
  ]);

  const quoteHref = `mailto:${company.email}?subject=${encodeURIComponent(
    `Ivren plan quote — ${me.name}`,
  )}&body=${encodeURIComponent(
    `Organisation: ${me.name}\nPlan:\nNumber of sites:\nAnything else:\n`,
  )}`;

  if (billing.kind === "refused") {
    return (
      <>
        <PageHeader
          title="Billing"
          description="Your plan, what it includes, and how to change it."
        />
        <div className="overflow-hidden rounded-xl border border-hairline bg-paper">
          <EmptyState
            title="Billing isn't part of your role"
            body="Owners, admins and revenue staff see this organisation's plan."
          />
        </div>
      </>
    );
  }

  const current =
    billing.kind === "ok" && billing.plan
      ? (plans?.find((p) => p.id === billing.plan) ?? null)
      : null;
  const sites =
    billing.kind === "ok" ? sitesFor(billing.seats, current) : null;

  return (
    <>
      <PageHeader
        title="Billing"
        description="Your plan, what it includes, and how to change it."
      />

      {billing.kind === "unavailable" && (
        <div className="mb-6">
          <Notice tone="warn" title="Billing is unavailable right now">
            This organisation&apos;s plan can&apos;t be read at the moment.
            This is ours to fix; nothing about your plan has changed.
          </Notice>
        </div>
      )}

      {billing.kind === "ok" && billing.subscribed && (
        <>
          {billing.status && FAILED.has(billing.status) && (
            <div className="mb-6">
              <Notice tone="warn" title="The last payment didn't go through">
                Contact us to update the payment method and keep the plan.{" "}
                <a href={quoteHref} className="text-accent hover:text-accent-strong">
                  Email us
                </a>
              </Notice>
            </div>
          )}
          <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile
              label="Plan"
              value={current?.name ?? billing.plan ?? "—"}
              hint={current ? siteBand(current) : undefined}
              icon="CreditCard"
              tone="accent"
            />
            <StatTile
              label="Status"
              value={
                billing.status
                  ? (STATUS_WORDS[billing.status] ?? billing.status)
                  : "—"
              }
              icon="BadgeCheck"
              tone={
                billing.status && FAILED.has(billing.status) ? "warn" : "ok"
              }
            />
            <StatTile
              label={sites !== null ? "Sites" : "People included"}
              value={
                sites !== null
                  ? String(sites)
                  : billing.seats !== null
                    ? String(billing.seats)
                    : "—"
              }
              hint={
                sites !== null && current
                  ? `${formatPrice(sites * current.annual_cents_per_site, current.currency)} a year`
                  : undefined
              }
              icon="Building2"
            />
            <StatTile
              label={billing.cancelledAt ? "Ends" : "Renews"}
              value={billing.periodEnd ? formatDate(billing.periodEnd) : "—"}
              icon="Calendar"
            />
          </section>
        </>
      )}

      {billing.kind === "ok" && !billing.subscribed && (
        <div className="mb-6">
          <Notice title="No paid plan yet — the free tier is active">
            Every machine can map and analyse the whole estate, offline, with
            no licence. A paid plan runs the engine, priced per site per year.
          </Notice>
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-hairline bg-paper">
        <div className="border-b border-hairline px-5 py-4">
          <h2 className="text-[15px] font-medium text-ink">Plans</h2>
          <p className="mt-0.5 text-[13px] text-ink-secondary">
            List prices per site, per year.
          </p>
        </div>
        {plans ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Sites</TableHead>
                  <TableHead className="text-right">Per site, per year</TableHead>
                  <TableHead className="text-right">People per site</TableHead>
                  <TableHead>AI layer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <p className="text-[13.5px] font-medium text-ink">
                        {p.name}
                        {current?.id === p.id && (
                          <span className="ml-2 text-[12px] font-normal text-accent">
                            your plan
                          </span>
                        )}
                      </p>
                      {PLAN_AUDIENCE[p.id] && (
                        <p className="text-[12.5px] text-ink-label">
                          {PLAN_AUDIENCE[p.id]}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-[13px] text-ink-secondary">
                      {siteBand(p)}
                    </TableCell>
                    <TableCell className="text-right font-tabular text-[13px] text-ink">
                      {formatPrice(p.annual_cents_per_site, p.currency)}
                    </TableCell>
                    <TableCell className="text-right font-tabular text-[13px] text-ink-secondary">
                      {p.seats_per_site}
                    </TableCell>
                    <TableCell className="text-[13px] text-ink-secondary">
                      {p.ai_layer ? "Explain and ask" : "Not included"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <EmptyState
            title="The price list is unavailable right now"
            body="Ask us and we'll send the current list with a quote."
          />
        )}
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Notice
          title={
            CARD_CHECKOUT_AVAILABLE
              ? "Buying a plan"
              : "Card checkout isn't available yet"
          }
        >
          Every plan can be bought today by quote and purchase order, and
          quotes come back within one business day.{" "}
          <a href={quoteHref} className="text-accent hover:text-accent-strong">
            Request a quote
          </a>
        </Notice>
        <Notice title="Invoices and payment method">
          These arrive with the billing portal. Until then, ask us for any
          invoice and we&apos;ll send it.
        </Notice>
      </div>
    </>
  );
}
