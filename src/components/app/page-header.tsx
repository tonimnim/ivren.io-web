/** One heading treatment for every console page. */
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-5 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[19px] font-medium tracking-tight text-ink">
          {title}
        </h1>
        <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-ink-secondary">
          {description}
        </p>
      </div>
      {action}
    </header>
  );
}

/** Shown when a list is legitimately empty, or a read was refused. */
export function EmptyState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="px-5 py-12 text-center">
      <p className="text-[13.5px] font-medium text-ink">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-[13px] leading-relaxed text-ink-secondary">
        {body}
      </p>
    </div>
  );
}
