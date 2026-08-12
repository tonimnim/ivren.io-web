import Link from "next/link";
import { ReactNode } from "react";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "onDark"
  | "onDarkSecondary";

const VARIANT_CLASSES: Record<Variant, string> = {
  // Inset top highlight + a hue-matched (never black) shadow. A gradient
  // fill here is the dated alternative.
  primary:
    "bg-accent text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_1px_2px_rgb(13_99_179/0.20),0_8px_20px_-8px_rgb(13_99_179/0.28)] hover:bg-accent-strong hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_1px_2px_rgb(13_99_179/0.24),0_12px_26px_-10px_rgb(13_99_179/0.34)]",
  secondary:
    "bg-transparent text-ink border border-hairline hover:border-ink-secondary",
  ghost: "!px-0 !py-0 bg-transparent text-accent hover:text-accent-strong",
  // For the deep-blue hero: inverted primary, ghost-on-dark secondary.
  onDark:
    "bg-white text-ink shadow-[0_1px_2px_rgb(4_12_20/0.35),0_10px_28px_-10px_rgb(4_12_20/0.5)] hover:bg-white/90",
  onDarkSecondary:
    "bg-transparent text-white border border-white/25 hover:border-white/60",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 ease-out ${VARIANT_CLASSES[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
