"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  type MotionValue,
} from "framer-motion";
import { hvh, vhv } from "@/components/diagram/FlowDiagram";
import { useRange } from "@/components/system/useRange";
import { useReducedMotionSafe } from "@/components/system/useReducedMotionSafe";
import Label from "@/components/system/Label";

// Cropped to the content bounds so the diagram fills its space.
const VB = { x: 80, y: 50, w: 1040, h: 500 };
const OH = 52;

type Obj = { id: string; label: string; scatter: [number, number, number]; order: [number, number] };

const objs: Obj[] = [
  { id: "email", label: "Email", scatter: [180, 120, -7], order: [170, 110] },
  { id: "whatsapp", label: "WhatsApp", scatter: [1010, 410, 6], order: [170, 230] },
  { id: "phone", label: "Phone", scatter: [560, 90, -9], order: [170, 350] },
  { id: "pdf", label: "PDF", scatter: [950, 110, 5], order: [170, 470] },
  { id: "employee", label: "Employee", scatter: [150, 380, 4], order: [600, 110] },
  { id: "spreadsheet", label: "Spreadsheet", scatter: [690, 500, -3], order: [1010, 350] },
  { id: "crm", label: "CRM", scatter: [350, 510, 5], order: [1010, 230] },
  { id: "database", label: "Database", scatter: [840, 290, -5], order: [1010, 470] },
];
const objById = Object.fromEntries(objs.map((o) => [o.id, o]));
const objW = (o: Obj) => Math.round(o.label.length * 11.5 + 52);

// The hand-offs people do today. Drawn between the scattered positions.
const messy: { a: string; b: string; note?: string }[] = [
  { a: "email", b: "employee", note: "forward" },
  { a: "phone", b: "employee", note: "write it down" },
  { a: "pdf", b: "employee", note: "read & re-type" },
  { a: "employee", b: "spreadsheet", note: "copy" },
  { a: "spreadsheet", b: "crm", note: "copy again" },
  { a: "whatsapp", b: "crm" },
  { a: "database", b: "spreadsheet", note: "export" },
  { a: "crm", b: "email" },
];

function messyPath(a: Obj, b: Obj, i: number) {
  const [x1, y1] = a.scatter;
  const [x2, y2] = b.scatter;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const bend = (i % 2 ? 1 : -1) * 70;
  const cx = mx + (-(y2 - y1) / len) * bend;
  const cy = my + ((x2 - x1) / len) * bend;
  return { d: `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`, label: [(mx + cx) / 2, (my + cy) / 2] as [number, number] };
}

const HUB = { x: 600, y: 350, w: 280, h: 72, label: "Your workflow" };

function orderedEdges() {
  const out: string[] = [];
  const hubL = HUB.x - HUB.w / 2;
  const hubR = HUB.x + HUB.w / 2;
  for (const id of ["email", "whatsapp", "phone", "pdf"]) {
    const o = objById[id];
    out.push(hvh(o.order[0] + objW(o) / 2, o.order[1], hubL, HUB.y, 380));
  }
  for (const id of ["crm", "spreadsheet", "database"]) {
    const o = objById[id];
    out.push(hvh(hubR, HUB.y, o.order[0] - objW(o) / 2, o.order[1], 830));
  }
  const emp = objById.employee;
  out.push(vhv(emp.order[0], emp.order[1] + OH / 2, HUB.x, HUB.y - HUB.h / 2, 225));
  return out;
}
const clean = orderedEdges();

function StoryObject({ o, p }: { o: Obj; p: MotionValue<number> }) {
  const w = objW(o);
  const x = useRange(p,[0.56, 0.8], [o.scatter[0] - w / 2, o.order[0] - w / 2]);
  const y = useRange(p,[0.56, 0.8], [o.scatter[1] - OH / 2, o.order[1] - OH / 2]);
  const rotate = useRange(p,[0.56, 0.8], [o.scatter[2], 0]);
  return (
    <motion.g style={{ x, y, rotate, transformBox: "fill-box", transformOrigin: "center" }}>
      <rect width={w} height={OH} rx={7} style={{ fill: "var(--surface-2)", stroke: "var(--line-2)" }} />
      <text x={w / 2} y={OH / 2 + 0.5} textAnchor="middle" dominantBaseline="central" fontSize={19} fontWeight={500} className="font-ui" style={{ fill: "var(--ink)" }}>
        {o.label}
      </text>
    </motion.g>
  );
}

function MessyLine({ i, p }: { i: number; p: MotionValue<number> }) {
  const m = messy[i];
  const { d, label } = messyPath(objById[m.a], objById[m.b], i);
  const pathLength = useRange(p,[0.12 + i * 0.03, 0.3 + i * 0.022], [0, 1]);
  const opacity = useRange(p,[0.54, 0.62], [1, 0]);
  const noteOpacity = useRange(p,[0.28 + i * 0.018, 0.34 + i * 0.018, 0.54, 0.62], [0, 1, 1, 0]);
  return (
    <motion.g style={{ opacity }}>
      <motion.path d={d} fill="none" stroke="var(--mute-2)" strokeWidth={1.25} strokeDasharray="4 5" style={{ pathLength }} />
      {m.note && (
        <motion.text x={label[0]} y={label[1]} textAnchor="middle" dominantBaseline="central" fontSize={12} className="font-mono" style={{ fill: "var(--mute)", opacity: noteOpacity }}>
          {m.note}
        </motion.text>
      )}
    </motion.g>
  );
}

function CleanLine({ d, p, live, i }: { d: string; p: MotionValue<number>; live: boolean; i: number }) {
  const pathLength = useRange(p,[0.74, 0.9], [0, 1]);
  return (
    <g>
      <motion.path d={d} fill="none" stroke="var(--line-2)" strokeWidth={1.5} style={{ pathLength }} />
      {live && (
        <path
          d={d}
          pathLength={100}
          fill="none"
          className="flow-packet"
          stroke="var(--signal)"
          strokeWidth={5}
          strokeLinecap="round"
          style={{ "--packet-delay": `${-(i * 0.43)}s`, "--packet-dur": "2.4s" } as React.CSSProperties}
        />
      )}
    </g>
  );
}

function Scene({ p, title }: { p: MotionValue<number>; title: string }) {
  const [live, setLive] = useState(p.get() > 0.92);
  useMotionValueEvent(p, "change", (v) => setLive(v > 0.92));
  const hubOpacity = useRange(p,[0.68, 0.78], [0, 1]);
  const hubScale = useRange(p,[0.68, 0.78], [0.92, 1]);

  return (
    <svg viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} preserveAspectRatio="xMidYMid meet" className="block h-full w-full overflow-visible" role="img" aria-label={title}>
      {messy.map((_, i) => (
        <MessyLine key={i} i={i} p={p} />
      ))}
      {clean.map((d, i) => (
        <CleanLine key={i} d={d} p={p} live={live} i={i} />
      ))}
      <motion.g style={{ opacity: hubOpacity, scale: hubScale, transformBox: "fill-box", transformOrigin: "center" }}>
        <rect x={HUB.x - HUB.w / 2} y={HUB.y - HUB.h / 2} width={HUB.w} height={HUB.h} rx={9} style={{ fill: "var(--ink)" }} />
        <text x={HUB.x} y={HUB.y - 9} textAnchor="middle" dominantBaseline="central" fontSize={22} fontWeight={500} className="font-ui" style={{ fill: "var(--bg)" }}>
          {HUB.label}
        </text>
        <text x={HUB.x} y={HUB.y + 17} textAnchor="middle" dominantBaseline="central" fontSize={13} className="font-mono" style={{ fill: "var(--bg)", opacity: 0.65, letterSpacing: "0.04em" }}>
          RUNNING AS SOFTWARE
        </text>
      </motion.g>
      {objs.map((o) => (
        <StoryObject key={o.id} o={o} p={p} />
      ))}
    </svg>
  );
}

const copy = {
  label: "The system you already have",
  t1: "Your business already has a system.",
  t2: "It might just be spread across emails, spreadsheets, phone calls and people.",
  t3: "We turn that workflow into software.",
};

function StickyStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const t1 = useRange(p,[0.54, 0.6], [1, 0]);
  const t2 = useRange(p,[0.18, 0.26, 0.54, 0.6], [0, 1, 1, 0]);
  const t2y = useRange(p,[0.18, 0.26], [12, 0]);
  const t3 = useRange(p,[0.8, 0.88], [0, 1]);
  const t3y = useRange(p,[0.8, 0.88], [16, 0]);

  return (
    <div ref={ref} className="relative" style={{ height: "330vh" }}>
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="wrap pt-24 lg:pt-28">
          <Label index="01">{copy.label}</Label>
          <div className="mt-6 grid">
            <motion.div style={{ opacity: t1 }} className="[grid-area:1/1]">
              <h2 className="max-w-[20ch] font-display text-display-lg font-semibold">{copy.t1}</h2>
              <motion.p style={{ opacity: t2, y: t2y }} className="mt-5 max-w-[46ch] text-lede text-mute">
                {copy.t2}
              </motion.p>
            </motion.div>
            <motion.h2 style={{ opacity: t3, y: t3y }} className="max-w-[20ch] font-display text-display-lg font-semibold [grid-area:1/1]">
              {copy.t3}
            </motion.h2>
          </div>
        </div>
        <div className="wrap min-h-0 flex-1 pb-6 pt-2">
          <Scene p={p} title="Scattered tools and manual hand-offs reorganising into one workflow" />
        </div>
      </div>
    </div>
  );
}

function StaticStory() {
  const messyP = useMotionValue(0.5);
  const orderedP = useMotionValue(1);
  return (
    <div className="wrap py-24">
      <Label index="01">{copy.label}</Label>
      <h2 className="mt-6 max-w-[20ch] font-display text-display-lg font-semibold">{copy.t1}</h2>
      <p className="mt-5 max-w-[46ch] text-lede text-mute">{copy.t2}</p>
      <div className="mt-10">
        <Scene p={messyP} title="Tools connected by manual hand-offs" />
      </div>
      <h2 className="mt-16 max-w-[20ch] font-display text-display-lg font-semibold">{copy.t3}</h2>
      <div className="mt-10">
        <Scene p={orderedP} title="The same tools organised into one workflow" />
      </div>
    </div>
  );
}

const chipTilt = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3", "rotate-1", "-rotate-2", "rotate-2", "-rotate-3"];

function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex h-10 items-center rounded-md border border-line-2 bg-surface-2 px-3.5 font-ui text-[15px] font-medium ${className ?? ""}`}>
      {children}
    </span>
  );
}

function MobileStory() {
  return (
    <div className="wrap py-20">
      <Label index="01">{copy.label}</Label>
      <h2 className="mt-6 font-display text-display-lg font-semibold">{copy.t1}</h2>
      <p className="mt-5 text-lede text-mute">{copy.t2}</p>

      <div className="mt-10 flex flex-wrap gap-x-3 gap-y-4" aria-hidden="true">
        {objs.map((o, i) => (
          <Chip key={o.id} className={chipTilt[i]}>
            {o.label}
          </Chip>
        ))}
      </div>
      <p className="mt-6 font-mono text-[12px] leading-loose text-mute">
        {messy.filter((m) => m.note).map((m) => m.note).join("  ·  ")}
      </p>

      <h2 className="mt-16 font-display text-display-lg font-semibold">{copy.t3}</h2>
      <div className="mt-10 flex flex-col items-stretch" aria-label="The same tools organised into one workflow" role="img">
        <div className="grid grid-cols-2 gap-2">
          {["Email", "WhatsApp", "Phone", "PDF"].map((l) => (
            <Chip key={l} className="justify-center">{l}</Chip>
          ))}
        </div>
        <span className="mx-auto h-8 w-px bg-line-2" />
        <div className="rounded-lg bg-ink px-4 py-4 text-center text-background">
          <p className="font-ui text-[17px] font-medium">Your workflow</p>
          <p className="mt-1 font-mono text-[11px] tracking-[0.04em] opacity-70">RUNNING AS SOFTWARE</p>
        </div>
        <div className="flex items-center justify-center gap-3 py-3">
          <span className="h-px w-8 bg-line-2" />
          <span className="font-mono text-[12px] text-mute">Employee reviews the exceptions</span>
        </div>
        <span className="mx-auto h-5 w-px bg-line-2" />
        <div className="grid grid-cols-3 gap-2">
          {["CRM", "Spreadsheet", "Database"].map((l) => (
            <Chip key={l} className="justify-center px-2 text-[14px]">{l}</Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BusinessSystemStory() {
  const reduce = useReducedMotionSafe();
  return (
    <section data-theme="dark" className="bg-background text-ink" aria-label={copy.label}>
      <div className="hidden md:block">{reduce ? <StaticStory /> : <StickyStory />}</div>
      <div className="md:hidden">
        <MobileStory />
      </div>
    </section>
  );
}
