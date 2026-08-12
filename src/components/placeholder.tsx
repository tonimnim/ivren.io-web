export function Placeholder({
  children,
  as = "span",
}: {
  children: string;
  as?: "span" | "div";
}) {
  const Tag = as;
  return (
    <Tag className="inline-flex max-w-full items-center gap-1 break-all rounded border border-dashed border-warn/50 bg-warn-soft px-1.5 py-0.5 font-mono text-[0.85em] text-warn">
      {`{{${children}}}`}
    </Tag>
  );
}
