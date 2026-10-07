"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { senteezCoverage } from "@/lib/content/work";
import { useReducedMotionSafe } from "@/components/system/useReducedMotionSafe";

const VW = 640;
const VH = 360;

// Topic names come from the Senteez case study.
const topics = [
  { label: "Cleanliness", y: 80 },
  { label: "Staff behaviour", y: 180 },
  { label: "Value for money", y: 280 },
];
const layers = ["Sentiment", "Intent", "Topic", "Entities"];
const sourceY = [80, 180, 280];

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const dots = (() => {
  const r = rng(7);
  return Array.from({ length: 72 }, (_, i) => {
    const src = i % 3;
    const topic = Math.floor(r() * 3);
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * 30;
    return {
      sx: 196 + r() * 70,
      sy: sourceY[src] - 22 + r() * 44,
      ex: 482 + Math.cos(a) * d,
      ey: topics[topic].y + Math.sin(a) * d * 0.8,
      delay: 0.2 + r() * 1.1,
    };
  });
})();

export default function SenteezVisual() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const reduce = useReducedMotionSafe();
  const settled = reduce || inView;

  return (
    <figure className="rounded-lg border border-line bg-surface-2">
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5 md:px-7">
        <span className="label-mono">Reviews in, patterns out</span>
        <span className="label-mono hidden sm:inline">Google · TripAdvisor · Facebook · BestBuy</span>
      </div>
      <div className="space-y-6 px-5 py-6 sm:hidden">
        <ul className="space-y-3">
          {senteezCoverage.map((c) => (
            <li key={c.sector} className="flex items-baseline justify-between border-b border-line pb-3">
              <span className="font-ui text-[22px] font-medium">{c.reviews.toLocaleString("en-US")}</span>
              <span className="font-mono text-[11px] uppercase text-mute">{c.sector}</span>
            </li>
          ))}
        </ul>
        <p className="font-mono text-[11.5px] text-mute">{layers.join("  ·  ")}</p>
        <ul className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <li key={t.label} className="inline-flex items-center gap-2 rounded-md border border-line-2 px-3 py-2 font-ui text-[14px]">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-signal" />
              {t.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="hidden px-3 py-5 sm:block md:px-6">
        <svg ref={ref} viewBox={`0 0 ${VW} ${VH}`} className="block h-auto w-full" role="img" aria-label="Reviews from Dubai hotels, restaurants and US coffee brands are analysed and grouped into topics such as cleanliness, staff behaviour and value for money">
          {senteezCoverage.map((c, i) => (
            <g key={c.sector}>
              <text x={0} y={sourceY[i] - 8} fontSize={22} fontWeight={500} className="font-ui" style={{ fill: "var(--ink)" }}>
                {c.reviews.toLocaleString("en-US")}
              </text>
              <text x={0} y={sourceY[i] + 14} fontSize={10.5} className="font-mono" style={{ fill: "var(--mute)" }}>
                {c.sector.toUpperCase()}
              </text>
            </g>
          ))}

          <line x1={392} x2={392} y1={40} y2={320} stroke="var(--line-2)" />
          {layers.map((l, i) => (
            <g key={l}>
              <rect x={352} y={52 + i * 70} width={80} height={24} rx={4} style={{ fill: "var(--surface-2)", stroke: "var(--line-2)" }} />
              <text x={392} y={64 + i * 70} textAnchor="middle" dominantBaseline="central" fontSize={10.5} className="font-mono" style={{ fill: "var(--ink-2)" }}>
                {l}
              </text>
            </g>
          ))}

          {dots.map((d, i) => (
            <motion.circle
              key={i}
              cx={d.sx}
              cy={d.sy}
              r={3.2}
              initial={false}
              animate={settled ? { cx: d.ex, cy: d.ey } : { cx: d.sx, cy: d.sy }}
              transition={reduce ? { duration: 0 } : { duration: 1.6, delay: d.delay, ease: [0.65, 0, 0.35, 1] }}
              style={{ fill: i % 9 === 0 ? "var(--signal)" : "var(--mute)" }}
            />
          ))}

          {topics.map((t) => (
            <text key={t.label} x={VW} y={t.y} textAnchor="end" dominantBaseline="central" fontSize={13} fontWeight={500} className="font-ui" style={{ fill: "var(--ink)" }}>
              {t.label}
            </text>
          ))}
        </svg>
      </div>
    </figure>
  );
}
