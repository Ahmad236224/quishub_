"use client";

import FlowDiagram, { type FlowEdge, type FlowNode } from "@/components/diagram/FlowDiagram";
import { edges, nodes } from "./model";

// Flat projection of the 3D layout: shown while the canvas loads, on tablets,
// and whenever WebGL isn't available.
const S = 66;
const toX = (x: number) => Math.round((x + 5.75) * S);
const toY = (y: number) => Math.round((2.6 - y) * S + 18);

const flatNodes: FlowNode[] = nodes.map((n) => ({
  id: n.id,
  label: n.label,
  x: toX(n.pos[0]),
  y: toY(n.pos[1]),
  tone: n.kind === "final" ? "ink" : "default",
  desc: n.desc,
}));

const flatEdges: FlowEdge[] = edges
  .filter((e) => e.id !== "review-process")
  .map((e) => ({
    from: e.from,
    to: e.to,
    route: e.id === "process-review" ? "v" : "h",
    mid: e.to === "intake" ? toX(-3.25) : undefined,
    live: e.to !== "intake" || e.from === "email",
  }));

export default function WorkflowStatic({
  activeId,
  onActivate,
}: {
  activeId: string | null;
  onActivate: (id: string) => void;
}) {
  return (
    <FlowDiagram
      nodes={flatNodes}
      edges={flatEdges}
      width={toX(5.3)}
      height={toY(-2.4)}
      title="Business inputs flowing through intake, validation and processing to completion, with exceptions sent to human review"
      activeId={activeId}
      onActivate={onActivate}
    />
  );
}
