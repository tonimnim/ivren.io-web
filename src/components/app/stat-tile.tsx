import * as Icons from "lucide-react";

type Tone = "neutral" | "ok" | "warn" | "flag" | "accent";

const ICON_TONE: Record<Tone, string> = {
  neutral: "text-ink-label",
  ok: "text-ok",
  warn: "text-warn",
  flag: "text-flag",
  accent: "text-accent",
};

/**
 * One number, with the icon carrying the only colour. Values stay ink so
 * the tiles read as a set rather than a traffic light.
 */
export function StatTile({
  label,
  value,
  hint,
  icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: string;
  tone?: Tone;
}) {
  const Icon =
    (Icons as unknown as Record<
      string,
      React.ComponentType<{ className?: string }>
    >)[icon] ?? Icons.Circle;

  return (
    <div className="min-w-0 rounded-xl border border-hairline bg-paper p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[10px] font-medium tracking-[0.14em] text-ink-label uppercase">
          {label}
        </p>
        <Icon className={`h-4 w-4 shrink-0 ${ICON_TONE[tone]}`} />
      </div>
      <p className="mt-3 font-tabular text-2xl font-medium text-ink">{value}</p>
      {hint && <p className="mt-1 text-[12.5px] text-ink-label">{hint}</p>}
    </div>
  );
}
