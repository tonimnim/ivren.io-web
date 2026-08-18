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
      <label
        htmlFor={id}
        className="block text-sm font-medium text-ink"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        className="mt-1.5 w-full rounded-lg border border-hairline bg-canvas px-3 py-2.5 text-sm text-ink outline-none transition-colors duration-150 placeholder:text-ink-label focus:border-accent"
        {...props}
      />
      {hint && (
        <p className="mt-1.5 text-xs leading-relaxed text-ink-label">{hint}</p>
      )}
    </div>
  );
}
