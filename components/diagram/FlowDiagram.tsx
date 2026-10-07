"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export type NodeTone = "default" | "muted" | "ink" | "signal";

export type FlowNode = {
  id: string;
  label: string;
  /** Centre of the node, in viewBox units. */
  x: number;
  y: number;
  w?: number;
  tone?: NodeTone;
  note?: string;
  notePos?: "right" | "left" | "below" | "above";
  /** Spoken description for interactive nodes. */
  desc?: string;
};

export type FlowEdge = {
  from: string;
  to: string;
  /** "h"/"v" force the leading direction; "tree" drops from the parent then turns into the child. */
  route?: "auto" | "h" | "v" | "tree";
  mid?: number;
  dashed?: boolean;
  live?: boolean;
};

export const NODE_H = 34;
const R = 8;

export function nodeWidth(n: FlowNode) {
  return n.w ?? Math.max(56, Math.round(n.label.length * 7.6 + 28));
}

export function hvh(x1: number, y1: number, x2: number, y2: number, mx: number) {
  if (Math.abs(y2 - y1) < 1) return `M${x1},${y1} H${x2}`;
  const sy = Math.sign(y2 - y1);
  const s1 = Math.sign(mx - x1) || 1;
  const s2 = Math.sign(x2 - mx) || 1;
  const r = Math.min(R, Math.abs(y2 - y1) / 2, Math.abs(mx - x1), Math.abs(x2 - mx));
  return `M${x1},${y1} H${mx - s1 * r} Q${mx},${y1} ${mx},${y1 + sy * r} V${y2 - sy * r} Q${mx},${y2} ${mx + s2 * r},${y2} H${x2}`;
}

export function vhv(x1: number, y1: number, x2: number, y2: number, my: number) {
  if (Math.abs(x2 - x1) < 1) return `M${x1},${y1} V${y2}`;
  const sx = Math.sign(x2 - x1);
  const s1 = Math.sign(my - y1) || 1;
  const s2 = Math.sign(y2 - my) || 1;
  const r = Math.min(R, Math.abs(x2 - x1) / 2, Math.abs(my - y1), Math.abs(y2 - my));
  return `M${x1},${y1} V${my - s1 * r} Q${x1},${my} ${x1 + sx * r},${my} H${x2 - sx * r} Q${x2},${my} ${x2},${my + s2 * r} V${y2}`;
}

export function edgePath(a: FlowNode, b: FlowNode, e: FlowEdge) {
  const wa = nodeWidth(a);
  const wb = nodeWidth(b);
  const route = e.route ?? "auto";

  if (route === "tree") {
    const x = a.x;
    const y1 = a.y + NODE_H / 2;
    const bx = b.x > x ? b.x - wb / 2 : b.x + wb / 2;
    const sx = Math.sign(bx - x) || 1;
    const r = Math.min(R, Math.abs(b.y - y1));
    return `M${x},${y1} V${b.y - r} Q${x},${b.y} ${x + sx * r},${b.y} H${bx}`;
  }

  const rightOf = b.x - wb / 2 >= a.x + wa / 2 + 6;
  const leftOf = a.x - wa / 2 >= b.x + wb / 2 + 6;
  const horizontal = route === "h" || (route === "auto" && (rightOf || leftOf));

  if (horizontal) {
    const dir = b.x >= a.x ? 1 : -1;
    const x1 = a.x + (dir * wa) / 2;
    const x2 = b.x - (dir * wb) / 2;
    return hvh(x1, a.y, x2, b.y, e.mid ?? (x1 + x2) / 2);
  }
  const dir = b.y >= a.y ? 1 : -1;
  const y1 = a.y + (dir * NODE_H) / 2;
  const y2 = b.y - (dir * NODE_H) / 2;
  return vhv(a.x, y1, b.x, y2, e.mid ?? (y1 + y2) / 2);
}

const toneStyle: Record<NodeTone, { fill: string; stroke: string; text: string; dash?: string }> = {
  default: { fill: "var(--surface-2)", stroke: "var(--line-2)", text: "var(--ink)" },
  muted: { fill: "transparent", stroke: "var(--line-2)", text: "var(--mute)", dash: "3 3" },
  ink: { fill: "var(--ink)", stroke: "var(--ink)", text: "var(--bg)" },
  signal: { fill: "var(--signal-soft)", stroke: "var(--signal)", text: "var(--ink)" },
};

type Props = {
  nodes: FlowNode[];
  edges: FlowEdge[];
  width: number;
  height: number;
  title: string;
  className?: string;
  activeId?: string | null;
  /** When set, nodes become focusable buttons. */
  onActivate?: (id: string) => void;
  /** Per-node lift (0–1), e.g. from pointer proximity. */
  lift?: Record<string, number>;
  packetDuration?: number;
};

export default function FlowDiagram({
  nodes,
  edges,
  width,
  height,
  title,
  className,
  activeId,
  onActivate,
  lift,
  packetDuration = 2.8,
}: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { margin: "80px" });
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const interactive = Boolean(onActivate);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("block h-auto w-full overflow-visible", className)}
      role={interactive ? "group" : "img"}
      aria-label={title}
      data-paused={!inView}
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {edges.map((e, i) => {
          const a = byId[e.from];
          const b = byId[e.to];
          if (!a || !b) return null;
          const d = edgePath(a, b, e);
          const hot = activeId != null && (e.to === activeId || e.from === activeId);
          return (
            <g key={`${e.from}-${e.to}`}>
              <path
                d={d}
                stroke={hot ? "var(--signal)" : e.dashed ? "var(--mute-2)" : "var(--line-2)"}
                strokeWidth={hot ? 1.5 : 1.25}
                strokeDasharray={e.dashed ? "3 4" : undefined}
                style={{ transition: "stroke .3s" }}
              />
              {e.live && (
                <path
                  d={d}
                  pathLength={100}
                  className="flow-packet"
                  stroke="var(--signal)"
                  strokeWidth={4}
                  style={
                    {
                      "--packet-delay": `${-((i * 0.61) % packetDuration)}s`,
                      "--packet-dur": `${packetDuration}s`,
                    } as React.CSSProperties
                  }
                />
              )}
            </g>
          );
        })}
      </g>

      {nodes.map((n) => {
        const w = nodeWidth(n);
        const tone = n.id === activeId ? (n.tone === "ink" ? "ink" : "signal") : n.tone ?? "default";
        const t = toneStyle[tone];
        const up = (lift?.[n.id] ?? 0) * -3;
        const notePos = n.notePos ?? "right";
        const note =
          n.note &&
          (notePos === "right"
            ? { x: w + 10, y: NODE_H / 2, anchor: "start" as const }
            : notePos === "left"
              ? { x: -10, y: NODE_H / 2, anchor: "end" as const }
              : notePos === "above"
                ? { x: w / 2, y: -9, anchor: "middle" as const }
                : { x: w / 2, y: NODE_H + 14, anchor: "middle" as const });
        const activate = onActivate ? () => onActivate(n.id) : undefined;

        return (
          <g
            key={n.id}
            transform={`translate(${n.x - w / 2} ${n.y - NODE_H / 2 + up})`}
            style={{ transition: "transform .35s cubic-bezier(.16,1,.3,1)" }}
            {...(interactive
              ? {
                  role: "button",
                  tabIndex: 0,
                  "aria-label": n.desc ? `${n.label}. ${n.desc}` : n.label,
                  "aria-pressed": n.id === activeId,
                  onMouseEnter: activate,
                  onFocus: activate,
                  onClick: activate,
                  onKeyDown: (ev: React.KeyboardEvent) => {
                    if (ev.key === "Enter" || ev.key === " ") {
                      ev.preventDefault();
                      activate?.();
                    }
                  },
                  className: "cursor-pointer outline-none",
                }
              : {})}
          >
            <rect
              width={w}
              height={NODE_H}
              rx={6}
              style={{ fill: t.fill, stroke: t.stroke, transition: "fill .3s, stroke .3s" }}
              strokeWidth={1}
              strokeDasharray={t.dash}
            />
            <text
              x={w / 2}
              y={NODE_H / 2 + 0.5}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={12.5}
              fontWeight={500}
              className="font-ui"
              style={{ fill: t.text, transition: "fill .3s" }}
            >
              {n.label}
            </text>
            {note && (
              <text
                x={note.x}
                y={note.y}
                textAnchor={note.anchor}
                dominantBaseline="central"
                fontSize={9.5}
                className="font-mono"
                style={{ fill: "var(--mute)", letterSpacing: "0.02em" }}
              >
                {n.note}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
