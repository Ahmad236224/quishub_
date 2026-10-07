"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { vhv } from "@/components/diagram/FlowDiagram";
import { useReducedMotionSafe } from "@/components/system/useReducedMotionSafe";
import { cn } from "@/lib/utils";

// Coordinate space for the desktop diagram; nodes are positioned in % of it.
const W = 600;
const H = 520;
const NH = 40;

type Step = { id: string; label: string; step: string; x: number; y: number; tag?: string; desc: string; final?: boolean };

const steps: Step[] = [
  { id: "email", label: "Email", step: "IN", x: 128, y: 70, desc: "Requests arrive by email, often with attachments." },
  { id: "form", label: "Web form", step: "IN", x: 300, y: 70, desc: "Some come in through a form on your website." },
  { id: "phone", label: "Phone call", step: "IN", x: 472, y: 70, desc: "Calls are logged as structured requests, not notes on paper." },
  { id: "intake", label: "Intake", step: "01", x: 300, y: 172, desc: "Every request lands in one place, whichever channel it came from." },
  { id: "verify", label: "Verification", step: "02", x: 300, y: 262, desc: "Required data is checked before the workflow continues." },
  { id: "auto", label: "Automated route", step: "03", x: 162, y: 362, tag: "routine", desc: "Routine requests are processed automatically: records updated, documents generated." },
  { id: "human", label: "Human review", step: "03", x: 440, y: 362, tag: "when needed", desc: "Exceptions are routed to a person instead of silently failing." },
  { id: "done", label: "Complete", step: "04", x: 300, y: 462, final: true, desc: "The request finishes with the right systems updated." },
];
const byId = Object.fromEntries(steps.map((s) => [s.id, s]));

const top = (s: Step) => s.y - NH / 2;
const bottom = (s: Step) => s.y + NH / 2;
const edge = (a: string, b: string, mid: number) => ({
  from: a,
  to: b,
  d: vhv(byId[a].x, bottom(byId[a]), byId[b].x, top(byId[b]), mid),
});

const edges = [
  edge("email", "intake", 121),
  edge("form", "intake", 121),
  edge("phone", "intake", 121),
  edge("intake", "verify", 217),
  edge("verify", "auto", 312),
  edge("verify", "human", 312),
  edge("auto", "done", 412),
  edge("human", "done", 412),
];

const cycle = ["email", "intake", "verify", "auto", "human", "done"];

export default function WorkflowDiagram() {
  const reduce = useReducedMotionSafe();
  const [active, setActive] = useState("email");
  const [touched, setTouched] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10%" });

  useEffect(() => {
    if (reduce || touched || !inView) return;
    const t = setInterval(() => setActive((cur) => cycle[(cycle.indexOf(cur) + 1) % cycle.length]), 2800);
    return () => clearInterval(t);
  }, [reduce, touched, inView]);

  const activate = (id: string) => {
    setTouched(true);
    setActive(id);
  };
  const current = byId[active];
  const position = cycle.indexOf(active) >= 0 ? cycle.indexOf(active) + 1 : 1;

  return (
    <figure ref={ref} className="rounded-lg border border-line bg-surface-2" aria-label="How a request moves through a Quishub system">
      <figcaption className="flex items-center justify-between border-b border-line px-5 py-3.5 md:px-6">
        <span className="label-mono">Incoming request · workflow</span>
        <span className="label-mono hidden sm:inline">
          Step {String(position).padStart(2, "0")} / {String(cycle.length).padStart(2, "0")}
        </span>
      </figcaption>

      {/* Desktop / tablet */}
      <div className="hidden px-4 pt-4 sm:block md:px-6" data-paused={!inView}>
        <div className="relative mx-auto aspect-[600/520] w-full max-w-[600px]">
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true" fill="none">
            <rect x={24} y={30} width={552} height={80} rx={10} stroke="var(--line)" strokeDasharray="3 4" />
            <text x={36} y={22} fontSize={11} className="font-mono" style={{ fill: "var(--mute)", letterSpacing: "0.06em" }}>
              INPUTS
            </text>
            {edges.map((e, i) => {
              const hot = e.to === active || e.from === active;
              return (
                <g key={`${e.from}-${e.to}`}>
                  <path
                    d={e.d}
                    stroke={hot ? "var(--signal)" : "var(--line-2)"}
                    strokeWidth={hot ? 1.75 : 1.25}
                    strokeLinecap="round"
                    style={{ transition: "stroke .35s, stroke-width .35s" }}
                  />
                  <path
                    d={e.d}
                    pathLength={100}
                    className="flow-packet"
                    stroke="var(--signal)"
                    strokeWidth={5}
                    strokeLinecap="round"
                    style={{ "--packet-delay": `${-(i * 0.55)}s`, "--packet-dur": "3.2s", opacity: hot ? 1 : 0 } as React.CSSProperties}
                  />
                </g>
              );
            })}
          </svg>

          {steps.map((s) => {
            const on = s.id === active;
            return (
              <button
                key={s.id}
                type="button"
                onMouseEnter={() => activate(s.id)}
                onFocus={() => activate(s.id)}
                onClick={() => activate(s.id)}
                aria-pressed={on}
                aria-label={`${s.label}. ${s.desc}`}
                className={cn(
                  "absolute flex h-10 -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 whitespace-nowrap rounded-md border px-3.5 font-ui text-[14px] font-medium transition-[border-color,background-color,color,box-shadow] duration-300",
                  s.final
                    ? "border-ink bg-ink text-background"
                    : on
                      ? "border-ink bg-[var(--surface-card-strong-bg)] text-ink shadow-[0_6px_20px_-10px_rgba(22,14,32,0.35)]"
                      : "border-line-2 bg-[var(--surface-card-strong-bg)] text-ink hover:border-ink"
                )}
                style={{ left: `${(s.x / W) * 100}%`, top: `${(s.y / H) * 100}%` }}
              >
                <span className={cn("font-mono text-[10.5px]", s.final ? "opacity-60" : on ? "text-signal-ink" : "text-mute")}>{s.step}</span>
                {s.label}
                {s.tag && <span className="font-mono text-[10.5px] font-normal text-mute">{s.tag}</span>}
                {on && !s.final && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-signal" />}
              </button>
            );
          })}

        </div>
      </div>

      <div className="hidden min-h-[104px] border-t border-line px-5 py-4 sm:block md:px-6" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="label-mono text-ink">
              {current.step === "IN" ? "Input" : `Step ${current.step}`} · {current.label}
            </p>
            <p className="mt-2 max-w-[52ch] text-[15.5px] leading-relaxed text-ink-2">{current.desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile: vertical, no hover needed */}
      <ol className="px-5 py-5 sm:hidden">
        <li className="pb-4">
          <p className="label-mono">Inputs</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {["Email", "Web form", "Phone call"].map((l) => (
              <span key={l} className="inline-flex h-9 items-center rounded-md border border-line-2 bg-[var(--surface-card-strong-bg)] px-3 font-ui text-[14px] font-medium">
                {l}
              </span>
            ))}
          </div>
        </li>
        {["intake", "verify", "auto", "human", "done"].map((id) => {
          const s = byId[id];
          return (
            <li key={id} className="relative border-l border-line-2 pb-5 pl-5 last:pb-0">
              <span aria-hidden="true" className={cn("absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full border", s.final ? "border-ink bg-ink" : "border-ink bg-surface-2")} />
              <p className="flex items-baseline gap-2">
                <span className="font-mono text-[11px] text-mute">{s.step}</span>
                <span className="font-ui text-[15px] font-semibold">{s.label}</span>
                {s.tag && <span className="font-mono text-[11px] text-mute">· {s.tag}</span>}
              </p>
              <p className="mt-1 text-[14.5px] leading-relaxed text-ink-2">{s.desc}</p>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
