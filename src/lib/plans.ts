import { z } from "zod";
import { CONTROL_PLANE_URL } from "@/lib/control-plane";

/**
 * The plan catalogue, read from the control plane — never hard-coded here.
 *
 * Prices are indicative list prices the backend owns and may change, so every
 * page renders whatever `GET /billing/plans` says. The list is public (a price
 * list is not a secret) and changes rarely, so it is cached for an hour rather
 * than fetched per visitor.
 *
 * Plain `fetch` rather than the typed client: the client can only take a cache
 * option for every call it makes, including the authenticated ones, and those
 * must never be cached.
 */
const PlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  min_sites: z.number().int(),
  max_sites: z.number().int(),
  seats_per_site: z.number().int(),
  annual_cents_per_site: z.number().int(),
  currency: z.string(),
  ai_layer: z.boolean(),
});

const CatalogueSchema = z.object({ plans: z.array(PlanSchema) });

export type Plan = z.infer<typeof PlanSchema>;

/** The catalogue, or null when the control plane cannot be reached. */
export async function getPlans(): Promise<Plan[] | null> {
  try {
    const res = await fetch(`${CONTROL_PLANE_URL}/billing/plans`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const parsed = CatalogueSchema.safeParse(await res.json());
    return parsed.success ? parsed.data.plans : null;
  } catch {
    return null;
  }
}

/** "$5,000". List prices are whole units; cents would be false precision. */
export function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

/** "1–3 sites". */
export function siteBand(plan: Plan) {
  return `${plan.min_sites}–${plan.max_sites} sites`;
}

/** Who each plan is for. Marketing copy, so it lives here, keyed by the id. */
export const PLAN_AUDIENCE: Record<string, string> = {
  pilot: "One hospital",
  network: "Hospital groups",
  enterprise: "Health systems",
};

/**
 * Card checkout is decided — Pilot is bought by card, Network and Enterprise
 * by quote — but the control plane cannot take a card yet: `/billing/subscribe`
 * creates the subscription server-side with no way to collect a payment method.
 * Until Stripe Checkout exists, no page offers "Buy now". Flip this when it does.
 */
export const CARD_CHECKOUT_AVAILABLE = false;

/** Whether a plan is bought by card once checkout exists. */
export function isSelfServe(plan: Plan) {
  return plan.id === "pilot";
}
