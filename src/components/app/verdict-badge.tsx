import { CheckCircle2, MinusCircle, XCircle } from "lucide-react";

/**
 * A verdict is a status, so it ships with an icon and a word — never a
 * colour on its own.
 */
export function VerdictBadge({ verdict }: { verdict: string }) {
  const v = verdict.toLowerCase();
  const allowed = v === "allow" || v === "allowed" || v === "granted";
  const refused =
    v === "deny" || v === "denied" || v === "refused" || v === "refuse";

  const { Icon, cls } = allowed
    ? { Icon: CheckCircle2, cls: "border-ok/25 bg-ok-soft text-ok" }
    : refused
      ? { Icon: XCircle, cls: "border-flag/25 bg-flag-soft text-flag" }
      : { Icon: MinusCircle, cls: "border-hairline bg-surface text-ink-secondary" };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[12px] font-medium capitalize ${cls}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {verdict}
    </span>
  );
}
