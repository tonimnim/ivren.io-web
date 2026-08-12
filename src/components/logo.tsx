import Image from "next/image";
import Link from "next/link";

export function Logo({
  className = "",
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <Link
      href="/"
      className={`inline-flex shrink-0 items-center gap-2.5 ${className}`}
      aria-label="Ivren home"
    >
      {/* Two masters of the same mark: brand blue for light surfaces,
          solid white for the deep-blue hero and footer. */}
      <Image
        src={onDark ? "/logo-white.png" : "/logo.png"}
        alt=""
        width={40}
        height={40}
        priority
        className="h-9 w-9 sm:h-10 sm:w-10"
      />
      <span
        className={`font-display text-xl font-semibold tracking-tight sm:text-2xl ${
          onDark ? "text-white" : "text-ink"
        }`}
      >
        Ivren
      </span>
    </Link>
  );
}
