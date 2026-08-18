"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { headerNav } from "@/lib/nav";
import { featureGroups } from "@/lib/features";

/* Client-only platform constant, hydration-safe without a setState-in-effect. */
const noopSubscribe = () => () => {};
function useIsMac() {
  return useSyncExternalStore(
    noopSubscribe,
    () => /Mac|iP(hone|ad|od)/.test(navigator.platform ?? ""),
    () => false,
  );
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden
      className={`transition-transform duration-200 ease-out ${
        open ? "rotate-180" : ""
      }`}
    >
      <path
        d="M2 4l3 3 3-3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Roughly the height of the home hero's headline block — while above
 * this the header stays dark-glass over the deep hero. */
const DARK_HERO_EXTENT = 480;

export function SiteHeader() {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState<string | null>(null);
  const isMac = useIsMac();
  const pathname = usePathname();
  const router = useRouter();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrolled = scrollY > 8;

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProductOpen(false);
        setMenuOpen(false);
      }
      // ⌘K / Ctrl+K jumps to the docs — the closest thing this static
      // site honestly has to search.
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        router.push("/docs");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  // Lock background scroll while the mobile sheet is open.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  // Close menus when the route changes, without an extra render pass.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (menuOpen) setMenuOpen(false);
    if (productOpen) setProductOpen(false);
  }

  function openProduct() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setProductOpen(true);
  }

  function scheduleCloseProduct() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setProductOpen(false), 140);
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  // On the home page's deep-blue hero the header rides dark: fully
  // transparent at the very top, dark glass while still inside the hero,
  // and the normal light bar once past it (or when the mobile sheet
  // opens over it).
  const onDark =
    pathname === "/" && scrollY < DARK_HERO_EXTENT && !menuOpen;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ease-out ${
        onDark
          ? scrolled
            ? "border-white/10 bg-[rgb(7_27_46/0.78)] backdrop-blur-md"
            : "border-transparent bg-transparent"
          : `border-hairline/80 backdrop-blur-md ${
              scrolled || productOpen ? "bg-canvas/90" : "bg-canvas/80"
            }`
      }`}
    >
      <div className="relative mx-auto flex h-[60px] max-w-6xl items-center justify-between gap-4 px-6 sm:h-[68px] sm:gap-6">
        <Logo onDark={onDark} />

        <nav className="hidden items-center gap-1 md:flex">
          {headerNav.map((item) =>
            item.mega ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={openProduct}
                onMouseLeave={scheduleCloseProduct}
              >
                <Link
                  href={item.href}
                  aria-expanded={productOpen}
                  onFocus={openProduct}
                  onClick={() => setProductOpen(false)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors duration-150 ease-out ${
                    onDark
                      ? isActive(item.href) || productOpen
                        ? "text-white"
                        : "text-white/70 hover:text-white"
                      : isActive(item.href) || productOpen
                        ? "text-ink"
                        : "text-ink-secondary hover:text-ink"
                  }`}
                >
                  {item.label}
                  <ChevronDown open={productOpen} />
                </Link>

                {productOpen && (
                  <div className="absolute top-full left-0 z-50 w-[min(720px,calc(100vw-3rem))] pt-2">
                    <div className="rounded-xl border border-hairline bg-canvas/95 p-2 shadow-[0_1px_2px_rgba(20,24,29,0.04),0_16px_44px_-18px_rgba(20,24,29,0.24)] backdrop-blur-md">
                      <div className="grid gap-2 md:grid-cols-[1fr_212px]">
                        <div className="grid grid-cols-2 gap-0.5">
                          {featureGroups.map((group) => (
                            <Link
                              key={group.key}
                              href={`/product#${group.key}`}
                              onClick={() => setProductOpen(false)}
                              className="rounded-lg px-3 py-2.5 transition-colors duration-150 ease-out hover:bg-surface"
                            >
                              <span className="text-[15px] font-medium text-ink">
                                {group.title}
                              </span>
                              <span className="mt-0.5 block text-xs leading-relaxed text-ink-secondary">
                                {group.summary}
                              </span>
                            </Link>
                          ))}
                        </div>

                        <div className="flex flex-col gap-0.5 border-l border-hairline-soft pl-2">
                          <Link
                            href="/download"
                            onClick={() => setProductOpen(false)}
                            className="rounded-lg bg-accent-soft px-3 py-2.5 transition-opacity duration-150 ease-out hover:opacity-80"
                          >
                            <span className="text-sm font-medium text-accent">
                              Download Ivren
                            </span>
                            <span className="mt-0.5 block text-xs leading-relaxed text-ink-secondary">
                              One ~15 MB executable. Runs offline, never
                              phones home.
                            </span>
                          </Link>
                          {[
                            { label: "Quick start", href: "/docs/quick-start" },
                            { label: "CLI reference", href: "/docs/cli-reference" },
                            { label: "Security", href: "/security" },
                            { label: "Changelog", href: "/changelog" },
                          ].map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setProductOpen(false)}
                              className="rounded-lg px-3 py-2 text-[13px] text-ink-secondary transition-colors duration-150 ease-out hover:bg-surface hover:text-ink"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="mt-2 flex items-center gap-2 border-t border-hairline-soft px-3 pt-2.5 pb-1 font-mono text-[10.5px] tracking-[0.06em] text-ink-label">
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 rounded-full bg-ok"
                        />
                        runs entirely on your machine — offline, never phones
                        home, no telemetry
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm transition-colors duration-150 ease-out ${
                  onDark
                    ? isActive(item.href)
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                    : isActive(item.href)
                      ? "text-ink"
                      : "text-ink-secondary hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <button
            type="button"
            onClick={() => router.push("/docs")}
            aria-label="Search the docs"
            className={`hidden items-center gap-2 rounded-full border py-1.5 pr-1.5 pl-3 text-[12.5px] transition-colors duration-150 ease-out lg:flex ${
              onDark
                ? "border-white/20 bg-white/10 text-white/70 hover:border-white/40 hover:text-white"
                : "border-hairline bg-surface/70 text-ink-label hover:border-ink-label/40 hover:text-ink-secondary"
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <circle
                cx="5.2"
                cy="5.2"
                r="3.6"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path
                d="M8 8l2.6 2.6"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            Search docs
            <kbd
              className={`rounded-md border px-1.5 py-0.5 font-mono text-[10px] ${
                onDark
                  ? "border-white/20 bg-white/10 text-white/60"
                  : "border-hairline bg-canvas text-ink-label"
              }`}
            >
              {isMac ? "⌘" : "Ctrl"} K
            </kbd>
          </button>

          <Link
            href="/request-access"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150 ease-out ${
              onDark
                ? "bg-white text-ink shadow-[0_1px_2px_rgb(4_12_20/0.35)] hover:bg-white/90"
                : "bg-accent text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_1px_2px_rgb(13_99_179/0.2)] hover:bg-accent-strong"
            }`}
          >
            Get started
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-150 md:hidden ${
            onDark ? "text-white hover:bg-white/10" : "text-ink hover:bg-surface"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
            {menuOpen ? (
              <path
                d="M4 4l12 12M16 4L4 16"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M2.5 6h15M2.5 14h15"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="max-h-[calc(100vh-3.5rem)] overflow-y-auto border-t border-hairline bg-canvas px-4 py-3 md:hidden">
          <nav className="flex flex-col">
            {headerNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-3 text-[15px] transition-colors duration-150 ${
                  isActive(item.href)
                    ? "bg-surface-2 font-medium text-ink"
                    : "text-ink-secondary hover:bg-surface hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/request-access"
            className="mt-2 flex items-center justify-center rounded-full bg-accent px-4 py-3 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-strong"
          >
            Get started
          </Link>
        </div>
      )}
    </header>
  );
}
