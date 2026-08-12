import { ReactNode } from "react";

export function WindowChrome({
  children,
  title = "Ivren console",
}: {
  children?: ReactNode;
  title?: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-hairline bg-canvas">
      <div className="flex items-center gap-2 border-b border-hairline bg-surface px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full border border-hairline" />
        <span className="h-2.5 w-2.5 rounded-full border border-hairline" />
        <span className="h-2.5 w-2.5 rounded-full border border-hairline" />
        <span className="ml-2 font-mono text-[11px] text-ink-label">
          {title}
        </span>
      </div>
      <div className="flex aspect-[16/10] items-center justify-center bg-surface">
        {children ?? (
          <div className="flex flex-col items-center gap-2 text-ink-label">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
              <rect
                x="4"
                y="4"
                width="32"
                height="32"
                rx="4"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="14" cy="14" r="3" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M6 28l9-9 6 6 5-5 8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
            <p className="font-mono text-xs">product screenshot</p>
          </div>
        )}
      </div>
    </div>
  );
}
