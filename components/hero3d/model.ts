// One workflow model shared by the 3D scene, the static fallback and the mobile list.

export type NodeKind = "input" | "step" | "final";

export type WorkflowNode = {
  id: string;
  label: string;
  kind: NodeKind;
  desc: string;
  /** Structured (settled) position in scene units. */
  pos: [number, number, number];
  /** Loose starting position for the intro (inputs only). */
  scatter?: [number, number, number, number];
};

export const nodes: WorkflowNode[] = [
  { id: "email", label: "Email", kind: "input", desc: "Requests arrive through email, often with documents attached.", pos: [-4.7, 2.0, 0.25], scatter: [-5.3, 2.7, 1.1, 0.22] },
  { id: "pdf", label: "PDF", kind: "input", desc: "Forms and invoices arrive as attachments that someone has to read.", pos: [-4.7, 1.2, -0.2], scatter: [-3.6, 1.6, -1.0, -0.3] },
  { id: "form", label: "Web form", kind: "input", desc: "Some requests come in through a form on your website.", pos: [-4.7, 0.4, 0.15], scatter: [-5.8, 0.2, 0.6, 0.18] },
  { id: "phone", label: "Phone call", kind: "input", desc: "Calls become structured requests instead of notes on paper.", pos: [-4.7, -0.4, -0.25], scatter: [-4.0, -0.9, 1.3, -0.2] },
  { id: "sheet", label: "Spreadsheet", kind: "input", desc: "Records live in spreadsheets someone keeps up to date by hand.", pos: [-4.7, -1.2, 0.2], scatter: [-5.5, -1.9, -0.8, 0.28] },
  { id: "crm", label: "CRM", kind: "input", desc: "Customer history sits in the CRM, often out of sync.", pos: [-4.7, -2.0, -0.15], scatter: [-3.9, -2.6, 0.9, -0.16] },
  { id: "intake", label: "Intake", kind: "step", desc: "Every request lands in one place, whichever channel it came from.", pos: [-1.9, 0, 0] },
  { id: "validate", label: "Validation", kind: "step", desc: "Required information is checked before the workflow continues.", pos: [0.05, 0, 0] },
  { id: "process", label: "Processing", kind: "step", desc: "Business rules determine what happens next.", pos: [2.0, 0, 0] },
  { id: "review", label: "Human review", kind: "step", desc: "Exceptions are routed to a person instead of silently failing.", pos: [2.0, -1.85, -0.5] },
  { id: "done", label: "Complete", kind: "final", desc: "The right systems are updated and the request is closed.", pos: [4.15, 0.75, 0.7] },
];

export const byId = Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<string, WorkflowNode>;
export const inputIds = nodes.filter((n) => n.kind === "input").map((n) => n.id);

export type Edge = { id: string; from: string; to: string; label?: string };

export const edges: Edge[] = [
  ...inputIds.map((id) => ({ id: `${id}-intake`, from: id, to: "intake" })),
  { id: "intake-validate", from: "intake", to: "validate" },
  { id: "validate-process", from: "validate", to: "process" },
  { id: "process-done", from: "process", to: "done", label: "automated" },
  { id: "process-review", from: "process", to: "review", label: "exception" },
  { id: "review-process", from: "review", to: "process" },
];

export const edgeById = Object.fromEntries(edges.map((e) => [e.id, e])) as Record<string, Edge>;

export type Route = { id: string; label: string; edges: string[] };

// Requests that loop through the same system. Kept to the generic workflow.
export const routes: Route[] = [
  { id: "email", label: "Email request", edges: ["email-intake", "intake-validate", "validate-process", "process-done"] },
  { id: "pdf", label: "Document with an exception", edges: ["pdf-intake", "intake-validate", "validate-process", "process-review", "review-process", "process-done"] },
  { id: "phone", label: "Phone call", edges: ["phone-intake", "intake-validate", "validate-process", "process-done"] },
];

/** Node width in scene units, sized to its label. */
export const nodeWidth = (n: WorkflowNode) => Math.max(1.05, n.label.length * 0.118 + 0.62);
export const NODE_H = 0.46;
export const NODE_D = 0.22;
