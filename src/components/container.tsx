import { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 ${className}`}
    >
      {children}
    </div>
  );
}

export function Section({
  children,
  className = "",
  hairline = true,
  id,
}: {
  children: ReactNode;
  className?: string;
  hairline?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`py-16 md:py-24 ${hairline ? "border-t border-hairline" : ""} ${className}`}
    >
      <Container>{children}</Container>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-label">
      {children}
    </p>
  );
}
