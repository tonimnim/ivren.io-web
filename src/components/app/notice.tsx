import { Info, TriangleAlert } from "lucide-react";

/**
 * A plain statement about the state of the service or of a feature.
 *
 * This is how a screen says "not available yet" or "unavailable right now"
 * without rendering a disabled control: the words carry the state, and nothing
 * on the page pretends to be clickable when it is not.
 */
export function Notice({
  tone = "neutral",
  title,
  children,
}: {
  tone?: "neutral" | "warn";
  title: string;
  children: React.ReactNode;
}) {
  const warn = tone === "warn";
  const Icon = warn ? TriangleAlert : Info;
  return (
    <div
      className={`flex gap-3 rounded-xl border px-5 py-4 ${
        warn ? "border-warn/30 bg-warn-soft/50" : "border-hairline bg-paper"
      }`}
    >
      <Icon
        className={`mt-0.5 h-4 w-4 shrink-0 ${warn ? "text-warn" : "text-ink-label"}`}
        aria-hidden
      />
      <div className="min-w-0">
        <p className="text-[13.5px] font-medium text-ink">{title}</p>
        <div className="mt-0.5 text-[13px] leading-relaxed text-ink-secondary">
          {children}
        </div>
      </div>
    </div>
  );
}
