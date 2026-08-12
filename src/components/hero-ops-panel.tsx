"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/*
 * The hero set piece: a dense, live ops console in the product's own
 * visual language — explicitly labeled as the synthetic sample estate.
 * It is an illustration of the product's ideas, never passed off as a
 * screenshot.
 *
 * Three live behaviors, all honest to how the product works:
 *   1. Packets travel the feed paths continuously.
 *   2. Every ~12s the Billing feed goes silent (alert-on-silence),
 *      flags amber in the rail and on the map, then recovers.
 *   3. The gate command types and stamps PASS (exit 0); the message
 *      counter ticks like a real console.
 */

type MapNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  flag?: boolean;
};

const NODES: MapNode[] = [
  { id: "adt", label: "ADT", x: 100, y: 70, w: 58 },
  { id: "lab", label: "Lab", x: 270, y: 44, w: 56 },
  { id: "rad", label: "Radiology", x: 565, y: 58, w: 96 },
  { id: "pharm", label: "Pharmacy", x: 85, y: 235, w: 92 },
  { id: "reg", label: "Registration", x: 180, y: 330, w: 112 },
  { id: "billing", label: "Billing", x: 660, y: 215, w: 74, flag: true },
  { id: "claims", label: "Claims", x: 515, y: 330, w: 72 },
];

type MapEdge = { d: string; flag?: boolean; packet?: boolean; delay: number };

const EDGES: MapEdge[] = [
  { d: "M380 205 Q230 140 128 82", packet: true, delay: 0 },
  { d: "M380 205 Q320 105 276 58", packet: true, delay: 0.7 },
  { d: "M380 205 Q480 105 556 70", packet: true, delay: 1.4 },
  { d: "M380 205 Q230 235 130 237", packet: true, delay: 2.1 },
  { d: "M380 205 Q270 300 208 322", delay: 0.4 },
  { d: "M380 205 Q530 200 622 214", flag: true, delay: 0.9 },
  { d: "M380 205 Q450 290 508 322", packet: true, delay: 2.8 },
  { d: "M128 78 Q200 50 268 50", delay: 1.6 },
  { d: "M628 222 Q590 290 528 324", delay: 2.0 },
];

type RailRow = {
  name: string;
  proto: string;
  perDay: string;
  flag?: boolean;
};

const RAIL: RailRow[] = [
  { name: "ADT", proto: "HL7v2 · MLLP", perDay: "4,213" },
  { name: "Lab", proto: "HL7v2 · MLLP", perDay: "3,876" },
  { name: "Radiology", proto: "DICOM MWL", perDay: "812" },
  { name: "Pharmacy", proto: "NCPDP", perDay: "1,940" },
  { name: "Registration", proto: "HL7v2", perDay: "2,145" },
  { name: "Billing", proto: "X12 · SFTP", perDay: "1,102", flag: true },
  { name: "Claims", proto: "X12", perDay: "1,088" },
];

const CMD = "ivren gate --route adt-to-billing --evidence shadow-report.json";
const TYPE_MS = 26;
const HOLD_MS = 6500;
const CYCLE_MS = 12000;
const SILENT_MS = 2600;

function useTypedCommand(reduced: boolean) {
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reduced) return;
    let i = 0;
    function tick() {
      i += 1;
      setTyped(CMD.slice(0, i));
      if (i >= CMD.length) {
        setDone(true);
        timer.current = setTimeout(() => {
          i = 0;
          setTyped("");
          setDone(false);
          timer.current = setTimeout(tick, TYPE_MS);
        }, HOLD_MS);
        return;
      }
      timer.current = setTimeout(tick, TYPE_MS);
    }
    timer.current = setTimeout(tick, 900);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [reduced]);

  // Under reduced motion the command renders fully typed, no animation.
  return { typed: reduced ? CMD : typed, done: reduced ? true : done };
}

/* The alert-on-silence incident cycle, driven from one place so the
 * rail row, map edge, and status dot never drift out of sync. */
function useSilenceCycle(reduced: boolean) {
  const [silent, setSilent] = useState(false);

  useEffect(() => {
    if (reduced) return;
    let inner: ReturnType<typeof setTimeout> | null = null;
    const outer = setInterval(() => {
      setSilent(true);
      inner = setTimeout(() => setSilent(false), SILENT_MS);
    }, CYCLE_MS);
    return () => {
      clearInterval(outer);
      if (inner) clearTimeout(inner);
    };
  }, [reduced]);

  return reduced ? false : silent;
}

/* Message counter ticking like a live console. Deterministic increment —
 * no randomness needed to read as alive. */
function useTickingCount(reduced: boolean, start: number) {
  const [n, setN] = useState(start);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => {
      setN((m) => m + 1 + (m % 3));
    }, 1700);
    return () => clearInterval(t);
  }, [reduced]);

  return n;
}

export function HeroOpsPanel() {
  const reduced = usePrefersReducedMotion();
  const { typed, done } = useTypedCommand(reduced);
  const silent = useSilenceCycle(reduced);
  const msgs = useTickingCount(reduced, 14203);

  return (
    <div className="relative">
      {/* hue-matched glow bed behind the panel */}
      <div
        aria-hidden
        className="absolute -inset-x-6 -top-8 bottom-0 -z-10 rounded-[32px] bg-[radial-gradient(60%_60%_at_50%_28%,rgb(13_99_179/0.22),rgb(13_99_179/0)_76%)] blur-xl"
      />

      <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[radial-gradient(120%_90%_at_50%_0%,#13202d_0%,#0b1016_58%)] shadow-[0_1px_2px_rgb(10_15_20/0.4),0_28px_80px_-28px_rgb(13_99_179/0.4)]">
        {/* top edge highlight */}
        <div
          aria-hidden
          className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />

        {/* header */}
        <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-white/[0.06] px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1.5 sm:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            </div>
            <span className="font-mono text-xs whitespace-nowrap text-white/50">
              ivren — live estate map
            </span>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-white/[0.05] px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] whitespace-nowrap text-[#7ddba4] uppercase">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#4ade80]" />
            <span className="sm:hidden">sample data</span>
            <span className="hidden sm:inline">synthetic sample estate</span>
          </span>
        </div>

        <div className="flex">
          {/* interface rail */}
          <div className="hidden w-[218px] shrink-0 flex-col border-r border-white/[0.06] md:flex">
            <div className="flex items-center justify-between px-3 pt-3 pb-2 font-mono text-[10px] tracking-[0.14em] text-white/35 uppercase">
              <span>interfaces · 7</span>
              <span>msgs/day</span>
            </div>

            {RAIL.map((row, i) => {
              const isSilent = row.flag && silent;
              return (
                <div
                  key={row.name}
                  className="flex items-center gap-2 px-3 py-[7px]"
                  style={{
                    animation: `node-in 0.4s ease-out ${0.4 + i * 0.06}s backwards`,
                  }}
                >
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 ${
                      isSilent ? "animate-pulse bg-[#fbbf24]" : "bg-[#4ade80]"
                    }`}
                  />
                  <span className="font-mono text-xs text-white/80">
                    {row.name}
                  </span>
                  <span className="hidden font-mono text-[9.5px] text-white/25 lg:inline">
                    {row.proto}
                  </span>
                  <span
                    className={`ml-auto font-tabular font-mono text-[11px] transition-colors duration-300 ${
                      isSilent ? "text-[#fbbf24]" : "text-white/40"
                    }`}
                  >
                    {isSilent ? "silent 2m" : row.perDay}
                  </span>
                </div>
              );
            })}

            <div className="flex-1" />

            <div className="space-y-1 border-t border-white/[0.06] px-3 py-2.5 font-mono text-[10.5px] text-white/35">
              <p className="flex justify-between">
                <span>engine</span>
                <span className="text-[#4ade80]">ok</span>
              </p>
              <p className="flex justify-between">
                <span>queue depth</span>
                <span className="font-tabular">0</span>
              </p>
              <p className="flex justify-between">
                <span>dead-letter</span>
                <span className="font-tabular">0</span>
              </p>
            </div>
          </div>

          {/* topology canvas */}
          <div className="relative min-w-0 flex-1 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.035)_1px,transparent_0)] [background-size:22px_22px]">
            <svg
              viewBox="0 0 760 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Illustration of a hospital interface estate: seven synthetic interfaces connected through Ivren, with live message traffic and one feed briefly flagged silent before recovering"
              className="block h-auto w-full"
            >
              {EDGES.map((e, i) => (
                <path
                  key={i}
                  d={e.d}
                  className="edge-draw"
                  stroke={e.flag && silent ? "#e0684b" : "#3d7db5"}
                  strokeOpacity={e.flag && silent ? 0.85 : 0.5}
                  strokeWidth="1.5"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset="1"
                  style={{
                    animation: `edge-draw 1.1s ease-out ${0.3 + e.delay * 0.25}s forwards`,
                    transition: "stroke 0.4s ease, stroke-opacity 0.4s ease",
                  }}
                />
              ))}

              {EDGES.filter((e) => e.packet).map((e, i) => (
                <circle
                  key={`p-${i}`}
                  r="2.5"
                  fill="#7cc4f5"
                  className="packet"
                  style={{
                    offsetPath: `path("${e.d}")`,
                    animationDelay: `${1.6 + e.delay}s`,
                    filter: "drop-shadow(0 0 4px rgb(96 170 235 / 0.9))",
                  }}
                />
              ))}

              {/* hub */}
              <g
                style={{
                  animation: "node-in 0.5s ease-out 0.15s backwards",
                  transformOrigin: "380px 205px",
                }}
              >
                <circle
                  cx="380"
                  cy="205"
                  r="20"
                  stroke="#2f6ea8"
                  strokeOpacity="0.5"
                  strokeWidth="1"
                />
                <circle cx="380" cy="205" r="13" fill="#0d63b3" />
                <circle cx="380" cy="205" r="3" fill="#e8f1fa" />
                <text
                  x="380"
                  y="244"
                  textAnchor="middle"
                  fontSize="11"
                  fill="#6ea9d8"
                  fontFamily="var(--font-mono)"
                >
                  ivren
                </text>
              </g>

              {NODES.map((n, i) => {
                const x = n.x - n.w / 2;
                const y = n.y - 13;
                const isSilent = n.flag && silent;
                return (
                  <g
                    key={n.id}
                    style={{
                      animation: `node-in 0.5s ease-out ${0.25 + i * 0.09}s backwards`,
                      transformOrigin: `${n.x}px ${n.y}px`,
                    }}
                  >
                    <rect
                      x={x}
                      y={y}
                      width={n.w}
                      height="26"
                      rx="7"
                      fill="#161e27"
                      stroke={
                        isSilent
                          ? "rgb(251 191 36 / 0.4)"
                          : "rgb(255 255 255 / 0.08)"
                      }
                      strokeWidth="1"
                      style={{ transition: "stroke 0.4s ease" }}
                    />
                    <circle
                      cx={x + 12}
                      cy={n.y}
                      r="2.5"
                      fill={isSilent ? "#fbbf24" : "#4ade80"}
                      style={{ transition: "fill 0.4s ease" }}
                    />
                    <text
                      x={x + 21}
                      y={n.y + 3.5}
                      fontSize="11"
                      fill="#93a5b5"
                      fontFamily="var(--font-mono)"
                    >
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* terminal + counters strip */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-white/[0.06] px-4 py-3">
          <div className="min-w-0 font-mono text-[12.5px] leading-relaxed">
            <p className="truncate">
              <span className="text-white/35">$ </span>
              <span className="text-white/85">{typed}</span>
              {!reduced && !done && (
                <span className="animate-pulse text-[#7cc4f5]">▍</span>
              )}
            </p>
            <p
              className={`transition-opacity duration-300 ${done ? "opacity-100" : "opacity-0"}`}
            >
              <span className="font-medium text-[#4ade80]">PASS</span>
              <span className="text-white/40">{"  (exit 0)"}</span>
            </p>
          </div>

          <div className="hidden items-center gap-5 font-mono text-[11px] text-white/35 md:flex">
            <span>
              msgs today{" "}
              <span className="font-tabular text-white/70">
                {msgs.toLocaleString("en-US")}
              </span>
            </span>
            <span>
              errors <span className="font-tabular text-[#4ade80]">0</span>
            </span>
            <span>
              silent feeds{" "}
              <span
                className={`font-tabular transition-colors duration-300 ${
                  silent ? "text-[#fbbf24]" : "text-white/70"
                }`}
              >
                {silent ? 1 : 0}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
