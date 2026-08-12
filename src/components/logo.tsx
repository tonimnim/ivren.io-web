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
      {/* The mark never sits directly on a dark field — on the deep hero
          it rides a small white tile instead. */}
      {onDark ? (
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white sm:h-10 sm:w-10">
          <Image
            src="/logo.png"
            alt=""
            width={40}
            height={40}
            priority
            className="h-7 w-7 sm:h-8 sm:w-8"
          />
        </span>
      ) : (
        <Image
          src="/logo.png"
          alt=""
          width={40}
          height={40}
          priority
          className="h-9 w-9 sm:h-10 sm:w-10"
        />
      )}
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
