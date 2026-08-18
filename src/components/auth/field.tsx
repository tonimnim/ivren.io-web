/** One labelled input. Kept dumb so both auth forms stay readable. */
export function Field({
  id,
  label,
  hint,
  ...props
}: {
  id: string;
  label: string;
  hint?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        name={id}
        className="mt-2 w-full rounded-lg border border-hairline bg-paper px-3.5 py-2.5 text-sm text-ink shadow-[inset_0_1px_2px_rgb(20_24_29/0.03)] outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink-label/70 hover:border-ink-label/40 focus:border-accent focus:shadow-[0_0_0_3px_rgb(13_99_179/0.12)]"
        {...props}
      />
      {hint && (
        <p className="mt-1.5 text-xs leading-relaxed text-ink-label">{hint}</p>
      )}
    </div>
  );
}

/** Full-width submit with a consistent pending state. */
export function SubmitButton({
  pending,
  children,
  pendingLabel,
}: {
  pending: boolean;
  children: React.ReactNode;
  pendingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_1px_2px_rgb(13_99_179/0.2)] transition-colors duration-150 hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

/** Inline error, announced without shifting the layout when it appears. */
export function FormError({ message }: { message: string | null }) {
  return (
    <p
      aria-live="polite"
      className={`text-[13px] leading-relaxed text-flag ${message ? "" : "sr-only"}`}
    >
      {message}
    </p>
  );
}
