"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  CheckCircle2,
  CircleDashed,
  MinusCircle,
  RotateCcw,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/button";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import {
  DESTINATIONS,
  EDITABLE,
  INTRO,
  REPLAYED,
  outcomeFor,
  sanitize,
  type Change,
  type DestId,
  type FieldKey,
  type Outcome,
  type Verdict,
} from "@/components/hero/hero-scenarios";

/*
 * The home hero: one HL7 message, read, routed and proved.
 *
 * It plays its story once when it scrolls into view — the message is read
 * (fields annotated, identifiers masked), routed to three destinations, a
 * change is proposed, yesterday's traffic is replayed through it, and the gate
 * gives its verdict — then hands the controls over. Every motion is a product
 * behaviour, not decoration. Under reduced motion it renders the finished
 * composition and every interaction answers instantly.
 */

type Phase =
  | "rest"
  | "read"
  | "route"
  | "ready"
  | "propose"
  | "replay"
  | "verdict";

type Stage = {
  phase: Phase;
  change: Change | null;
  outcome: Outcome | null;
  count: number;
  /** The intro has handed over; hints show and fields invite a click. */
  idle: boolean;
  /** "that proves it." has been earned on screen. */
  proven: boolean;
  /** Bumped on every replay so CSS animations run again. */
  run: number;
};

const ORDER: Phase[] = [
  "rest",
  "read",
  "route",
  "ready",
  "propose",
  "replay",
  "verdict",
];
const reached = (phase: Phase, min: Phase) =>
  ORDER.indexOf(phase) >= ORDER.indexOf(min);

const REST: Stage = {
  phase: "rest",
  change: null,
  outcome: null,
  count: 0,
  idle: false,
  proven: false,
  run: 0,
};

/** Where the story ends. Reduced motion starts here. */
const FINAL: Stage = {
  phase: "verdict",
  change: INTRO,
  outcome: outcomeFor(INTRO),
  count: REPLAYED,
  idle: true,
  proven: true,
  run: 0,
};

/** The intro's beats, in milliseconds from its start. */
const T = {
  start: 500,
  route: 1500,
  propose: 2800,
  replay: 3700,
  replayMs: 1300,
  editReplayMs: 900,
  idleAfter: 900,
};

const n = (v: number) => v.toLocaleString("en-US");
const fieldId = (key: FieldKey) => `hero-field-${key}`;

/** Every scripted change, offered as a one-click try once the intro hands over. */
const TRIES = (Object.keys(EDITABLE) as FieldKey[]).flatMap((key) =>
  EDITABLE[key].presets.map((preset) => ({ key, preset })),
);

const VERDICT: Record<
  Verdict,
  { text: string; stamp: string; Icon: typeof CheckCircle2 }
> = {
  PASS: {
    text: "text-[#4ade80]",
    stamp: "border-[#4ade80]/40 bg-[#4ade80]/10",
    Icon: CheckCircle2,
  },
  FAIL: {
    text: "text-[#f87171]",
    stamp: "border-[#f87171]/45 bg-[#f87171]/10",
    Icon: XCircle,
  },
  INDETERMINATE: {
    text: "text-[#fbbf24]",
    stamp: "border-[#fbbf24]/40 bg-[#fbbf24]/10",
    Icon: MinusCircle,
  },
};

/* ------------------------------------------------------------------ text */

const SEPARATOR = /([|^~\\&])/;

/** HL7 text with its separators set back, so the values carry the line. */
function Hl7({ text, tone = "text-white/85" }: { text: string; tone?: string }) {
  return (
    <>
      {text.split(SEPARATOR).map((part, i) =>
        part === "" ? null : part.length === 1 && SEPARATOR.test(part) ? (
          <span key={i} className="text-white/30">
            {part}
          </span>
        ) : (
          <span key={i} className={tone}>
            {part}
          </span>
        ),
      )}
    </>
  );
}

function Segment({ id }: { id: string }) {
  return <span className="font-medium text-[#7cc4f5]">{id}</span>;
}

/** An identifier Ivren never shows, not even here. */
function Masked({ width }: { width: number }) {
  return (
    <>
      <span className="sr-only">masked</span>
      <span aria-hidden className="text-white/[0.13] select-none">
        {"█".repeat(width)}
      </span>
    </>
  );
}

/** A margin note naming the field beneath (or above) it. */
function Note({
  show,
  below,
  delay,
  children,
}: {
  show: boolean;
  below?: boolean;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`pointer-events-none absolute left-0 border-l border-[#7cc4f5]/60 pl-1.5 font-mono text-[8.5px] leading-none tracking-[0.14em] whitespace-nowrap text-[#7cc4f5]/85 uppercase transition-[opacity,transform] duration-500 sm:text-[9.5px] ${
        below ? "top-full mt-1.5" : "bottom-full mb-1.5"
      } ${
        show
          ? "translate-y-0 opacity-100"
          : below
            ? "-translate-y-1 opacity-0"
            : "translate-y-1 opacity-0"
      }`}
      style={{ transitionDelay: show ? `${delay}ms` : "0ms" }}
    >
      {children}
    </span>
  );
}

function Line({
  index,
  sweep,
  run,
  below,
  children,
}: {
  index: number;
  sweep: boolean;
  run: number;
  below?: boolean;
  children: React.ReactNode;
}) {
  return (
    <p
      className={`relative whitespace-pre pt-[1.5rem] ${below ? "pb-[1.5rem]" : ""}`}
    >
      {children}
      {sweep && (
        <span
          key={`${run}-${index}`}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[1.5rem] h-[1.6em] overflow-hidden"
        >
          <span
            className="absolute inset-y-0 left-0 w-1/4 animate-[hero-sweep_900ms_cubic-bezier(0.4,0,0.2,1)_both] bg-[linear-gradient(90deg,rgb(124_196_245/0),rgb(124_196_245/0.24),rgb(124_196_245/0))] opacity-0"
            style={{ animationDelay: `${index * 320}ms` }}
          />
        </span>
      )}
    </p>
  );
}

function Annotated({
  show,
  delay,
  label,
  below,
  children,
}: {
  show: boolean;
  delay: number;
  label: string;
  below?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span className="relative inline-block">
      <Note show={show} delay={delay} below={below}>
        {label}
      </Note>
      {children}
    </span>
  );
}

/* ---------------------------------------------------------- editable field */

function FieldButton({
  k,
  stage,
  active,
  annotated,
  noteDelay,
  noteBelow,
  onOpen,
}: {
  k: FieldKey;
  stage: Stage;
  active: boolean;
  annotated: boolean;
  noteDelay: number;
  noteBelow?: boolean;
  onOpen: (key: FieldKey) => void;
}) {
  const field = EDITABLE[k];
  const diff =
    stage.change?.key === k && reached(stage.phase, "propose")
      ? stage.change
      : null;
  const shown = diff ? diff.value : field.original;

  return (
    <span className="relative inline-block">
      <Note show={annotated} delay={noteDelay} below={noteBelow}>
        {k} · {field.name}
      </Note>
      <button
        id={fieldId(k)}
        type="button"
        onClick={() => onOpen(k)}
        aria-pressed={active}
        aria-label={`${k}, ${field.name}: ${shown || "empty"}. Change it and run the gate.`}
        className={`-mx-[3px] rounded-[4px] px-[3px] transition-[background-color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7cc4f5] ${
          active
            ? "bg-[#7cc4f5]/20 shadow-[inset_0_0_0_1px_rgb(124_196_245/0.55)]"
            : "hover:bg-white/[0.08]"
        } ${
          stage.idle && !diff
            ? "underline decoration-white/40 decoration-dotted decoration-1 underline-offset-[6px]"
            : ""
        }`}
      >
        {diff ? (
          <>
            <del className="decoration-[#f87171]/80">
              <Hl7 text={field.original} tone="text-white/35" />
            </del>
            <span aria-hidden className="px-1 text-white/30">
              →
            </span>
            <ins className="no-underline">
              {diff.value ? (
                <Hl7 text={diff.value} tone="text-[#a8dcff]" />
              ) : (
                <span className="text-[#a8dcff]">∅</span>
              )}
            </ins>
          </>
        ) : (
          <Hl7 text={field.original} />
        )}
      </button>
    </span>
  );
}

/* ------------------------------------------------------------ destinations */

type TicketState =
  | "waiting"
  | "received"
  | "running"
  | "ok"
  | "fail"
  | "unproven";

function ticketState(stage: Stage, id: DestId): TicketState {
  if (!reached(stage.phase, "route")) return "waiting";
  if (stage.phase === "replay") return "running";
  if (stage.phase === "verdict" && stage.outcome) {
    if (stage.outcome.breaks[id]) return "fail";
    if (stage.outcome.verdict === "INDETERMINATE") return "unproven";
    return "ok";
  }
  return "received";
}

const TICKET_TONE: Record<TicketState, string> = {
  waiting: "border-white/[0.1] bg-white/[0.02]",
  received: "border-white/[0.14] bg-white/[0.035]",
  running: "border-white/[0.14] bg-white/[0.035]",
  ok: "border-[#4ade80]/30 bg-[#4ade80]/[0.05]",
  fail: "border-[#f87171]/50 bg-[#f87171]/[0.08]",
  unproven: "border-[#fbbf24]/40 bg-[#fbbf24]/[0.06]",
};

function TicketStatus({
  state,
  reason,
}: {
  state: TicketState;
  reason?: string;
}) {
  switch (state) {
    case "waiting":
      return (
        <span className="inline-flex items-center gap-1.5 text-white/35">
          <CircleDashed className="h-3.5 w-3.5" aria-hidden />
          Waiting
        </span>
      );
    case "received":
      return (
        <span className="inline-flex items-center gap-2 text-white/65">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#7cc4f5]" />
          Receiving ADT^A01
        </span>
      );
    case "running":
      return (
        <span className="inline-flex w-full items-center gap-2 text-white/55">
          <span
            aria-hidden
            className="h-1 flex-1 animate-[hero-shimmer_1.1s_linear_infinite] rounded-full bg-[linear-gradient(90deg,rgb(255_255_255/0.06),rgb(124_196_245/0.5),rgb(255_255_255/0.06))] bg-[length:200%_100%]"
          />
          Replaying
        </span>
      );
    case "ok":
      return (
        <span className="inline-flex items-center gap-1.5 text-[#4ade80]">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
          Unchanged
        </span>
      );
    case "fail":
      return (
        <span className="inline-flex min-w-0 items-center gap-1.5 text-[#f87171]">
          <XCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="truncate font-mono text-[11.5px]">{reason}</span>
        </span>
      );
    case "unproven":
      return (
        <span className="inline-flex items-center gap-1.5 text-[#fbbf24]">
          <MinusCircle className="h-3.5 w-3.5" aria-hidden />
          Unproven
        </span>
      );
  }
}

/* -------------------------------------------------------------------- hero */

export function MessageHero() {
  const reduced = usePrefersReducedMotion();
  const [state, setState] = useState<Stage>(REST);
  // Reduced motion never plays the story; it starts at the end of it.
  const stage = reduced && state.phase === "rest" ? FINAL : state;

  const [editing, setEditing] = useState<FieldKey | null>(null);
  const [draft, setDraft] = useState("");

  const stageRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);
  const frame = useRef<number | null>(null);
  const started = useRef(false);
  const inputId = useId();

  const clearAll = useCallback(() => {
    for (const t of timers.current) window.clearTimeout(t);
    timers.current = [];
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  }, []);

  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  useEffect(() => clearAll, [clearAll]);

  /** Replay yesterday's traffic through a change, then give the verdict. */
  const runGate = useCallback(
    (change: Change, animate: boolean, ms: number) => {
      clearAll();
      const outcome = outcomeFor(change);

      if (!animate) {
        setState((s) => ({
          ...s,
          phase: "verdict",
          change,
          outcome,
          count: REPLAYED,
          idle: true,
          proven: true,
        }));
        return;
      }

      setState((s) => ({ ...s, phase: "replay", change, outcome: null, count: 0 }));

      // Frames only animate the counter. Browsers pause them for a page that
      // is not being painted — a background tab — so the verdict itself rides
      // a timer, and lands on time whether or not a single frame ran.
      const begin = performance.now();
      const count = (now: number) => {
        const t = Math.min(1, (now - begin) / ms);
        const eased = 1 - Math.pow(1 - t, 3);
        setState((s) =>
          s.phase === "replay" ? { ...s, count: Math.round(eased * REPLAYED) } : s,
        );
        frame.current = t < 1 ? requestAnimationFrame(count) : null;
      };
      frame.current = requestAnimationFrame(count);

      after(ms, () => {
        if (frame.current !== null) cancelAnimationFrame(frame.current);
        frame.current = null;
        setState((s) => ({
          ...s,
          phase: "verdict",
          outcome,
          count: REPLAYED,
          proven: true,
        }));
        after(T.idleAfter, () => setState((s) => ({ ...s, idle: true })));
      });
    },
    [after, clearAll],
  );

  const playIntro = useCallback(() => {
    clearAll();
    setEditing(null);
    setState((s) => ({ ...REST, phase: "read", run: s.run + 1 }));
    after(T.route, () => setState((s) => ({ ...s, phase: "route" })));
    after(T.propose, () =>
      setState((s) => ({ ...s, phase: "propose", change: INTRO })),
    );
    after(T.replay, () => runGate(INTRO, true, T.replayMs));
  }, [after, clearAll, runGate]);

  // Play once, when the stage is actually in view.
  useEffect(() => {
    if (reduced) return;
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (started.current || !entries.some((e) => e.isIntersecting)) return;
        started.current = true;
        io.disconnect();
        after(T.start, playIntro);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, after, playIntro]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function openEditor(key: FieldKey) {
    if (editing === key) {
      closeEditor();
      return;
    }
    // Touching the message ends the intro; it never starts over the visitor.
    started.current = true;
    clearAll();
    const current =
      stage.change?.key === key && reached(stage.phase, "propose")
        ? stage.change.value
        : EDITABLE[key].original;
    setDraft(current);
    setEditing(key);
    setState((s) => {
      const base = reduced && s.phase === "rest" ? FINAL : s;
      if (base.phase === "verdict") return { ...base, idle: true };
      return {
        ...base,
        phase: "ready",
        change: null,
        outcome: null,
        count: 0,
        idle: true,
      };
    });
  }

  function closeEditor() {
    const key = editing;
    setEditing(null);
    // The field is always rendered, so focus can go straight back to it.
    if (key) document.getElementById(fieldId(key))?.focus();
  }

  function submit(value: string) {
    if (!editing) return;
    const clean = sanitize(editing, value);
    setDraft(clean);
    runGate({ key: editing, value: clean }, !reduced, T.editReplayMs);
  }

  /** A one-click try: straight through the gate, no editor needed. */
  function tryChange(change: Change) {
    started.current = true;
    setEditing(null);
    runGate(change, !reduced, T.editReplayMs);
  }

  function replay() {
    started.current = true;
    if (reduced) {
      clearAll();
      setEditing(null);
      setState(FINAL);
      return;
    }
    playIntro();
  }

  const annotated = reached(stage.phase, "read");
  const routed = reached(stage.phase, "route");
  const sweeping = stage.phase === "read" && !reduced;
  const verdict =
    stage.phase === "verdict" && stage.outcome ? stage.outcome.verdict : null;
  const mark = verdict ? VERDICT[verdict] : null;
  const proposedHint =
    stage.change &&
    EDITABLE[stage.change.key].presets.find((p) => p.value === stage.change?.value)
      ?.hint;

  const pending =
    stage.phase === "replay"
      ? `Replaying yesterday's ${n(REPLAYED)} messages through the changed interface…`
      : stage.phase === "propose" && proposedHint
        ? `Proposed: ${proposedHint} in PV1-3.`
        : routed
          ? "Change a field, and the gate replays yesterday's traffic through it."
          : "Waiting for the message to be read and routed.";

  return (
    <>
      <div className="mx-auto max-w-[840px] text-center">
        <p className="kicker kicker-dark flex items-center justify-center gap-3">
          <span aria-hidden className="inline-block h-px w-6 bg-white/30 sm:w-8" />
          Healthcare integration · Interface assurance
          <span aria-hidden className="inline-block h-px w-6 bg-white/30 sm:w-8" />
        </p>

        <h1 className="mt-6 text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[1.02] font-medium tracking-[-0.028em] text-balance text-white">
          The interface engine{" "}
          <span
            className={`font-normal transition-colors duration-1000 ${
              stage.proven ? "text-white" : "text-white/50"
            }`}
          >
            that proves it.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-[52ch] text-base leading-[1.65] text-pretty text-white/75 sm:text-lg">
          Ivren routes clinical messages like any interface engine — and
          unlike any of them, shows you what it carried, what changed, and
          what a change would break, before you ship it.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row sm:items-center">
          <Button href="/download" variant="onDark" className="w-full sm:w-auto">
            Download Ivren
          </Button>
          <Button
            href="/docs"
            variant="onDarkSecondary"
            className="w-full sm:w-auto"
          >
            Explore the docs
          </Button>
        </div>
      </div>

      <figure
        ref={stageRef}
        aria-label="A synthetic HL7 admit message, routed to three destinations, with the deployment gate's verdict on a proposed change"
        className="relative mx-auto mt-10 max-w-5xl sm:mt-12"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-8 -top-16 h-32 bg-[radial-gradient(50%_100%_at_50%_100%,rgb(124_196_245/0.22),rgb(124_196_245/0)_100%)] blur-md"
        />

        <div className="relative overflow-hidden rounded-xl border border-white/[0.12] bg-[#051729]/80 text-left shadow-[0_40px_90px_-40px_rgb(0_0_0/0.75)] backdrop-blur-sm">
          {/* the feed */}
          <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-2.5 font-mono text-[10.5px] tracking-[0.06em] sm:px-6">
            <span className="flex min-w-0 items-center gap-2 whitespace-nowrap text-white/55">
              <span
                aria-hidden
                className={`h-1.5 w-1.5 shrink-0 rounded-full bg-[#4ade80] ${
                  stage.phase === "read" ? "animate-pulse" : ""
                }`}
              />
              ADT^A01 admit
              <span className="hidden sm:inline"> · in over MLLP · 02:14</span>
            </span>
            <span className="flex shrink-0 items-center gap-3 whitespace-nowrap sm:gap-4">
              <span className="text-white/35">synthetic sample</span>
              <button
                type="button"
                onClick={replay}
                className="inline-flex items-center gap-1.5 rounded p-0.5 text-white/45 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7cc4f5]"
              >
                <RotateCcw className="h-3 w-3" aria-hidden />
                <span className="sr-only sm:not-sr-only">Replay</span>
              </button>
            </span>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_15.5rem] lg:gap-12">
            {/* the message */}
            <div className="flex min-w-0 flex-col">
              <div className="overflow-x-auto px-4 pt-4 pb-5 font-mono text-[11.5px] leading-[1.65] sm:px-6 sm:text-[13px] lg:flex lg:flex-1 lg:flex-col lg:justify-center xl:text-[15px] xl:leading-[1.7]">
                <Line index={0} sweep={sweeping} run={stage.run}>
                  <Segment id="MSH" />
                  <Hl7 text={"|^~\\&|REG|GENERAL|IVREN|GENERAL|20260930021400||"} />
                  <Annotated show={annotated} delay={630} label="MSH-9 · Admit">
                    <Hl7 text="ADT^A01" />
                  </Annotated>
                  <Hl7 text="|48213|P|2.5.1" />
                </Line>
                <Line index={1} sweep={sweeping} run={stage.run}>
                  <Segment id="PID" />
                  <Hl7 text="|1||" />
                  <Masked width={8} />
                  <Hl7 text="^^^MRN||" />
                  <Annotated
                    show={annotated}
                    delay={590}
                    label="PID-5 · Name · masked"
                  >
                    <Masked width={4} />
                    <Hl7 text="^" />
                    <Masked width={4} />
                  </Annotated>
                  <Hl7 text="||" />
                  <Masked width={8} />
                  <Hl7 text="|F" />
                </Line>
                <Line index={2} sweep={sweeping} run={stage.run} below>
                  <Segment id="PV1" />
                  <Hl7 text="|1|" />
                  <FieldButton
                    k="PV1-2"
                    stage={stage}
                    active={editing === "PV1-2"}
                    annotated={annotated}
                    noteDelay={700}
                    noteBelow
                    onOpen={openEditor}
                  />
                  <Hl7 text="|" />
                  <FieldButton
                    k="PV1-3"
                    stage={stage}
                    active={editing === "PV1-3"}
                    annotated={annotated}
                    noteDelay={720}
                    onOpen={openEditor}
                  />
                  <Hl7 text="|||||||MED" />
                </Line>
              </div>

              {!editing && (
                <div
                  inert={!stage.idle}
                  className={`mx-4 mb-5 transition-opacity duration-700 sm:mx-6 ${
                    stage.idle ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <p className="text-[12.5px] leading-relaxed text-white/65">
                    <span className="font-medium text-white">Your turn.</span>{" "}
                    Try a change, and the gate replays yesterday&apos;s traffic
                    through it.
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {TRIES.map(({ key, preset }) => {
                      const current =
                        stage.change?.key === key &&
                        stage.change.value === preset.value &&
                        reached(stage.phase, "propose");
                      return (
                        <button
                          key={`${key}-${preset.value}`}
                          type="button"
                          onClick={() => tryChange({ key, value: preset.value })}
                          aria-pressed={current}
                          className={`rounded-full border px-2.5 py-1 text-[11.5px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7cc4f5] ${
                            current
                              ? "border-[#7cc4f5]/60 bg-[#7cc4f5]/15 text-white"
                              : "border-white/15 text-white/75 hover:border-white/40 hover:text-white"
                          }`}
                        >
                          <span className="font-mono text-white/45">{key}</span>{" "}
                          <span className="font-mono text-[#a8dcff]">{preset.value}</span>{" "}
                          <span className="text-white/55">{preset.hint}</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-[11.5px] text-white/40">
                    Or click an underlined field and write your own.
                  </p>
                </div>
              )}

              {editing && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit(draft);
                  }}
                  className="mx-4 mb-4 rounded-lg border border-[#7cc4f5]/25 bg-[#7cc4f5]/[0.05] p-3.5 sm:mx-6"
                >
                  <div className="flex flex-wrap items-center gap-2.5">
                    <label
                      htmlFor={inputId}
                      className="font-mono text-[10px] tracking-[0.14em] text-[#7cc4f5] uppercase"
                    >
                      {editing} · {EDITABLE[editing].name}
                    </label>
                    <input
                      id={inputId}
                      ref={inputRef}
                      value={draft}
                      onChange={(e) => setDraft(sanitize(editing, e.target.value))}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") closeEditor();
                      }}
                      spellCheck={false}
                      autoComplete="off"
                      autoCapitalize="characters"
                      maxLength={editing === "PV1-3" ? 16 : 3}
                      className="w-[9.5rem] rounded-md border border-white/15 bg-[#030d18]/70 px-2.5 py-1.5 font-mono text-[13px] text-white outline-none transition-colors focus:border-[#7cc4f5]/70"
                    />
                    <button
                      type="submit"
                      className="rounded-md bg-white px-3 py-1.5 text-[12.5px] font-medium text-[#071b2e] transition-colors hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7cc4f5]"
                    >
                      Run the gate
                    </button>
                    <button
                      type="button"
                      onClick={closeEditor}
                      aria-label="Close the editor"
                      className="ml-auto rounded p-1 text-white/40 transition-colors hover:text-white"
                    >
                      <X className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="mr-1 text-[12px] text-white/40">Try</span>
                    {EDITABLE[editing].presets.map((p) => {
                      const current =
                        stage.change?.key === editing &&
                        stage.change.value === p.value &&
                        reached(stage.phase, "propose");
                      return (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => submit(p.value)}
                          aria-pressed={current}
                          className={`rounded-full border px-2.5 py-1 font-mono text-[11.5px] transition-colors ${
                            current
                              ? "border-[#7cc4f5]/60 bg-[#7cc4f5]/15 text-white"
                              : "border-white/15 text-white/80 hover:border-white/40 hover:text-white"
                          }`}
                        >
                          {p.value}
                          <span className="ml-1.5 font-sans text-white/45">
                            {p.hint}
                          </span>
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => submit(EDITABLE[editing].original)}
                      className="rounded-full px-2 py-1 text-[11.5px] text-white/45 transition-colors hover:text-white"
                    >
                      restore
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* where it goes */}
            <div className="relative px-4 pb-4 sm:px-6 lg:py-5 lg:pr-6 lg:pl-0">
              <span
                aria-hidden
                className={`absolute top-1/2 -left-12 hidden h-px w-6 origin-left bg-white/25 transition-transform duration-300 lg:block ${
                  routed ? "scale-x-100" : "scale-x-0"
                }`}
              />
              <span
                aria-hidden
                className={`absolute -left-6 hidden w-px origin-center bg-white/25 transition-transform duration-500 lg:block ${
                  routed ? "scale-y-100" : "scale-y-0"
                }`}
                style={{
                  top: "calc(1.25rem + 2.875rem)",
                  bottom: "calc(1.25rem + 2.875rem)",
                  transitionDelay: routed ? "250ms" : "0ms",
                }}
              />

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {DESTINATIONS.map((d, i) => {
                  const state = ticketState(stage, d.id);
                  const delay =
                    stage.phase === "verdict"
                      ? i * 140
                      : stage.phase === "route"
                        ? 600 + i * 110
                        : 0;
                  return (
                    <div
                      key={d.id}
                      className={`relative rounded-lg border px-4 py-3 transition-[border-color,background-color,opacity,transform] duration-500 lg:h-[5.75rem] ${
                        TICKET_TONE[state]
                      } ${routed ? "translate-y-0 opacity-100" : "translate-y-1 opacity-45"}`}
                      style={{ transitionDelay: `${delay}ms` }}
                    >
                      <span
                        aria-hidden
                        className={`absolute top-1/2 -left-6 hidden h-px w-6 origin-left bg-white/25 transition-transform duration-300 lg:block ${
                          routed ? "scale-x-100" : "scale-x-0"
                        }`}
                        style={{
                          transitionDelay: routed ? `${600 + i * 90}ms` : "0ms",
                        }}
                      />
                      {stage.phase === "route" && !reduced && (
                          <span
                            key={`${stage.run}-${d.id}`}
                            aria-hidden
                            className="absolute top-1/2 -left-6 hidden h-[5px] w-[5px] animate-[hero-tick_650ms_ease-in_both] rounded-full bg-[#7cc4f5] opacity-0 shadow-[0_0_8px_rgb(124_196_245/0.9)] lg:block"
                            style={{ animationDelay: `${760 + i * 90}ms` }}
                          />
                        )}
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-[14px] font-medium text-white">{d.name}</p>
                        <p className="font-mono text-[10.5px] tracking-[0.08em] text-white/40">
                          {d.transport}
                        </p>
                      </div>
                      <p className="mt-0.5 font-mono text-[11px] text-white/45">
                        reads {d.reads}
                      </p>
                      <div className="mt-2 flex min-h-[1.25rem] items-center text-[12.5px]">
                        <TicketStatus state={state} reason={stage.outcome?.breaks[d.id]} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* the gate */}
          <div className="mx-4 mb-4 rounded-lg border border-white/10 bg-[#030d18]/55 px-4 py-3.5 sm:mx-6 sm:px-5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11.5px]">
              <span className="tracking-[0.18em] text-white/40">GATE</span>
              {stage.change && reached(stage.phase, "propose") ? (
                <span className="text-white/75">
                  {stage.change.key}{" "}
                  <span className="text-white/35 line-through decoration-[#f87171]/80">
                    {EDITABLE[stage.change.key].original}
                  </span>{" "}
                  <span className="text-white/35">→</span>{" "}
                  <span className="text-[#a8dcff]">{stage.change.value || "∅"}</span>
                </span>
              ) : (
                <span className="text-white/40">waiting for a change</span>
              )}
              {stage.change && reached(stage.phase, "replay") && (
                <span className="font-tabular text-white/45">
                  replayed {n(stage.count)} / {n(REPLAYED)}
                </span>
              )}
              {mark && verdict && (
                <span
                  key={`${stage.run}-${stage.change?.key}-${stage.change?.value}`}
                  className={`ml-auto inline-flex animate-[fade-up_0.4s_ease-out_both] items-center gap-2 rounded-md border px-2.5 py-1 text-[14px] font-semibold tracking-[0.12em] ${mark.text} ${mark.stamp}`}
                >
                  <mark.Icon className="h-4 w-4" aria-hidden />
                  {verdict}
                </span>
              )}
            </div>
            <div aria-live="polite" className="mt-2.5 min-h-[2.75rem]">
              {verdict && stage.outcome ? (
                <>
                  <p className="font-mono text-[12px] leading-relaxed text-white/85">
                    {stage.outcome.finding}
                  </p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-white/55">
                    {stage.outcome.why}
                  </p>
                </>
              ) : (
                <p className="font-mono text-[12px] leading-relaxed text-white/40">
                  {pending}
                </p>
              )}
            </div>
          </div>

        </div>
      </figure>

      <div className="kicker mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 font-tabular">
        <span className="text-white/60">HL7 v2 · FHIR R4 · DICOM · X12 · NCPDP</span>
        <span className="text-white/40">
          Runs offline · No telemetry · Never sends patient data
        </span>
      </div>
    </>
  );
}
