"use client";

import { useEffect, useState } from "react";

type Heading = { id: string; text: string };

export function DocsToc() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLHeadingElement>("[data-docs-content] h2"),
    );
    // Heading list can only be known after the MDX-like content has rendered
    // its DOM; this reads that external structure once per page mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeadings(nodes.map((n) => ({ id: n.id, text: n.textContent ?? "" })));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-100px 0px -70% 0px" },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  if (headings.length < 2) return null;

  return (
    <nav className="sticky top-24 hidden max-h-[calc(100vh-8rem)] w-48 shrink-0 overflow-y-auto xl:block">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-ink-label">
        On this page
      </p>
      <ul className="space-y-2 border-l border-hairline">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`-ml-px block border-l pl-3 text-sm transition-colors duration-150 ${
                activeId === h.id
                  ? "border-accent text-ink"
                  : "border-transparent text-ink-label hover:text-ink-secondary"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
