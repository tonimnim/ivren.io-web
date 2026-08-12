/**
 * The ivren wordmark.
 *
 * Set lowercase deliberately: in Inter a capital "I" is an unadorned
 * vertical stroke identical to a lowercase "l", so "Ivren" misreads as
 * "lvren". The dotted lowercase "i" removes the ambiguity, and carrying
 * the brand blue on that first letter ties the word to the mark.
 */
export function Wordmark({
  onDark = false,
  className = "",
}: {
  onDark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`font-display font-semibold tracking-[-0.045em] lowercase ${className}`}
    >
      <span className={onDark ? "text-[#7cc4f5]" : "text-accent"}>i</span>
      <span className={onDark ? "text-white" : "text-ink"}>vren</span>
    </span>
  );
}
