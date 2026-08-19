import Image from "next/image";
import Link from "next/link";
import { Wordmark } from "@/components/wordmark";

/**
 * Fluid sizing rather than stepped breakpoints — the lockup scales with
 * the viewport between a floor and a ceiling. The header ceiling is
 * bounded by the bar height (64px); the footer has no such constraint,
 * so the mark runs larger there as a brand anchor.
 */
const SIZES = {
  header: {
    gap: "gap-2.5",
    mark: "h-[clamp(2.5rem,3.2vw,2.875rem)] w-[clamp(2.5rem,3.2vw,2.875rem)]",
    word: "text-[clamp(1.5rem,2vw,1.875rem)]",
  },
  // The console rail is 236px wide and its header only 56px tall, so the
  // lockup is fixed rather than fluid — it is wayfinding there, not brand.
  rail: {
    gap: "gap-2",
    mark: "h-7 w-7",
    word: "text-[1.25rem]",
  },
  footer: {
    gap: "gap-3",
    mark: "h-[clamp(2.75rem,4.4vw,3.75rem)] w-[clamp(2.75rem,4.4vw,3.75rem)]",
    word: "text-[clamp(1.75rem,2.8vw,2.5rem)]",
  },
} as const;

export function Logo({
  className = "",
  onDark = false,
  size = "header",
  href = "/",
}: {
  className?: string;
  onDark?: boolean;
  size?: keyof typeof SIZES;
  href?: string;
}) {
  const s = SIZES[size];

  return (
    <Link
      href={href}
      className={`inline-flex shrink-0 items-center ${s.gap} ${className}`}
      aria-label="Ivren home"
    >
      {/* Two masters of the same mark: brand blue for light surfaces,
          solid white for the deep-blue hero and footer. */}
      <Image
        src={onDark ? "/logo-white.png" : "/logo.png"}
        alt=""
        width={60}
        height={60}
        priority
        className={s.mark}
      />
      <Wordmark onDark={onDark} className={s.word} />
    </Link>
  );
}
