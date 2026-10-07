import type { FlowEdge, FlowNode } from "@/components/diagram/FlowDiagram";
import type { Product } from "./work";

type Diagram = { nodes: FlowNode[]; edges: FlowEdge[]; height: number };

export type Problem = {
  id: string;
  question: string;
  capability: string;
  anchor: string;
  what: string;
  related: { slug?: Product["slug"]; text: string } | null;
  before: Diagram;
  after: Diagram;
};

const chain = (ids: string[], opts: Partial<FlowEdge> = {}): FlowEdge[] =>
  ids.slice(1).map((id, i) => ({ from: ids[i], to: id, route: "v", ...opts }));

export const problems: Problem[] = [
  {
    id: "manual",
    question: "We're doing too much manually.",
    capability: "Workflow automation",
    anchor: "automate-operations",
    what: "We automate the routine path end to end and send only the exceptions to a person.",
    related: { slug: "nurmed", text: "NurMed drafts the clinical note so doctors stop typing through consultations." },
    before: {
      height: 380,
      nodes: [
        { id: "pdf", label: "PDF arrives", x: 100, y: 30 },
        { id: "emp", label: "Employee", x: 100, y: 95, tone: "muted", note: "reads it" },
        { id: "sheet", label: "Spreadsheet", x: 100, y: 160, tone: "muted", note: "re-types it" },
        { id: "mgr", label: "Manager", x: 100, y: 225, tone: "muted", note: "approves by email" },
        { id: "crm", label: "CRM", x: 100, y: 290, tone: "muted", note: "copies it again" },
        { id: "cust", label: "Customer email", x: 100, y: 355, tone: "muted", note: "written by hand" },
      ],
      edges: chain(["pdf", "emp", "sheet", "mgr", "crm", "cust"], { dashed: true }),
    },
    after: {
      height: 380,
      nodes: [
        { id: "pdf", label: "PDF arrives", x: 100, y: 30 },
        { id: "hub", label: "Quishub workflow", x: 100, y: 100, tone: "ink" },
        { id: "val", label: "Validation", x: 192, y: 168 },
        { id: "crm", label: "CRM update", x: 192, y: 222 },
        { id: "note", label: "Notification", x: 192, y: 276 },
        { id: "human", label: "Human approval", x: 192, y: 330, note: "only exceptions", notePos: "below" },
      ],
      edges: [
        { from: "pdf", to: "hub", route: "v", live: true },
        ...["val", "crm", "note", "human"].map((to) => ({ from: "hub", to, route: "tree" as const, live: true })),
      ],
    },
  },
  {
    id: "connect",
    question: "Our systems don't talk to each other.",
    capability: "Integrations",
    anchor: "connect-systems",
    what: "We connect the tools you already pay for, so data is entered once and stays in sync everywhere.",
    related: { slug: "senteez", text: "Senteez pulls reviews from Google, TripAdvisor, Facebook and BestBuy into one system." },
    before: {
      height: 280,
      nodes: [
        { id: "emp", label: "Employee", x: 62, y: 130, tone: "muted", note: "copies between them", notePos: "below" },
        { id: "crm", label: "CRM", x: 220, y: 40 },
        { id: "bill", label: "Billing", x: 220, y: 100 },
        { id: "inbox", label: "Inbox", x: 220, y: 160 },
        { id: "sheet", label: "Sheets", x: 220, y: 220 },
      ],
      edges: ["crm", "bill", "inbox", "sheet"].map((to) => ({ from: "emp", to, route: "h" as const, dashed: true, mid: 150 })),
    },
    after: {
      height: 280,
      nodes: [
        { id: "hub", label: "Integration layer", x: 80, y: 130, w: 140, tone: "ink", note: "one copy of each record", notePos: "below" },
        { id: "crm", label: "CRM", x: 226, y: 40 },
        { id: "bill", label: "Billing", x: 226, y: 100 },
        { id: "inbox", label: "Inbox", x: 226, y: 160 },
        { id: "sheet", label: "Sheets", x: 226, y: 220 },
      ],
      edges: ["crm", "bill", "inbox", "sheet"].map((to) => ({ from: "hub", to, route: "h" as const, live: true, mid: 168 })),
    },
  },
  {
    id: "product",
    question: "We need to build a software product.",
    capability: "Product development",
    anchor: "build-software",
    what: "We design, build and launch web and mobile products, then keep improving them after launch.",
    related: { slug: "fictionpub", text: "FictionPub serves more than 20,000 writers." },
    before: {
      height: 290,
      nodes: [
        { id: "idea", label: "An idea", x: 100, y: 40 },
        { id: "sheet", label: "Spreadsheet", x: 100, y: 110, tone: "muted", note: "tracks customers" },
        { id: "manual", label: "Manual service", x: 100, y: 180, tone: "muted", note: "you, every time" },
        { id: "cust", label: "Customers", x: 100, y: 250, tone: "muted", note: "waiting on you" },
      ],
      edges: chain(["idea", "sheet", "manual", "cust"], { dashed: true }),
    },
    after: {
      height: 350,
      nodes: [
        { id: "cust", label: "Customers", x: 100, y: 40 },
        { id: "app", label: "Web & mobile app", x: 100, y: 105, tone: "ink" },
        { id: "api", label: "API", x: 100, y: 170 },
        { id: "db", label: "Database", x: 192, y: 225 },
        { id: "bill", label: "Billing", x: 192, y: 275 },
        { id: "admin", label: "Admin panel", x: 192, y: 325 },
      ],
      edges: [
        { from: "cust", to: "app", route: "v", live: true },
        { from: "app", to: "api", route: "v", live: true },
        ...["db", "bill", "admin"].map((to) => ({ from: "api", to, route: "tree" as const, live: true })),
      ],
    },
  },
  {
    id: "legacy",
    question: "Our existing software is becoming a problem.",
    capability: "Modernisation",
    anchor: "improve-software",
    what: "We audit what you have, fix what matters most first, and keep the system your team already relies on.",
    related: {
      text: "One audit found five critical issues. Fixing the top three made the platform 80% faster and doubled release speed.",
    },
    before: {
      height: 290,
      nodes: [
        { id: "plat", label: "Your platform", x: 100, y: 40, note: "getting slower" },
        { id: "slow", label: "Slow pages", x: 190, y: 110, tone: "muted" },
        { id: "deploy", label: "Manual deploys", x: 190, y: 160, tone: "muted" },
        { id: "tests", label: "No tests", x: 190, y: 210, tone: "muted" },
        { id: "fragile", label: "Fragile integrations", x: 190, y: 260, tone: "muted" },
      ],
      edges: ["slow", "deploy", "tests", "fragile"].map((to) => ({ from: "plat", to, route: "tree" as const, dashed: true })),
    },
    after: {
      height: 250,
      nodes: [
        { id: "audit", label: "Audit", x: 100, y: 40, note: "5 critical issues" },
        { id: "fix", label: "Fix the top 3", x: 100, y: 110, tone: "ink" },
        { id: "fast", label: "80% faster", x: 190, y: 175 },
        { id: "rel", label: "Releases 2× as fast", x: 190, y: 225 },
      ],
      edges: [
        { from: "audit", to: "fix", route: "v", live: true },
        { from: "fix", to: "fast", route: "tree", live: true },
        { from: "fix", to: "rel", route: "tree", live: true },
      ],
    },
  },
  {
    id: "ai",
    question: "We want to use AI inside a real workflow.",
    capability: "Applied AI",
    anchor: "apply-ai",
    what: "We put AI at the step where it helps, grounded in your own data, with checks and a person before anything goes out.",
    related: { slug: "paklawassist", text: "PakLawAssist retrieves Pakistani law before it drafts anything." },
    before: {
      height: 330,
      nodes: [
        { id: "q", label: "A question", x: 100, y: 40 },
        { id: "search", label: "Search the files", x: 100, y: 105, tone: "muted", note: "by hand" },
        { id: "read", label: "Read documents", x: 100, y: 170, tone: "muted", note: "one by one" },
        { id: "draft", label: "Draft an answer", x: 100, y: 235, tone: "muted" },
        { id: "check", label: "Check it again", x: 100, y: 300, tone: "muted", note: "every time" },
      ],
      edges: chain(["q", "search", "read", "draft", "check"], { dashed: true }),
    },
    after: {
      height: 380,
      nodes: [
        { id: "req", label: "Request", x: 100, y: 40 },
        { id: "ret", label: "Retrieve your data", x: 100, y: 100 },
        { id: "ai", label: "AI drafts", x: 100, y: 160, tone: "ink", note: "the only AI step" },
        { id: "val", label: "Validate", x: 100, y: 220 },
        { id: "ok", label: "Person approves", x: 100, y: 280 },
        { id: "out", label: "Formatted answer", x: 100, y: 340 },
      ],
      edges: chain(["req", "ret", "ai", "val", "ok", "out"], { live: true }),
    },
  },
  {
    id: "calls",
    question: "We're missing calls, and the leads that come with them.",
    capability: "Voice agents",
    anchor: "apply-ai",
    what: "A voice agent answers every call, asks the right questions, books the appointment and updates your CRM.",
    related: null,
    before: {
      height: 280,
      nodes: [
        { id: "call", label: "Incoming call", x: 100, y: 40 },
        { id: "busy", label: "Nobody free", x: 100, y: 110, tone: "muted", note: "busy, after hours" },
        { id: "vm", label: "Voicemail", x: 100, y: 180, tone: "muted" },
        { id: "lost", label: "Lead calls someone else", x: 100, y: 250, tone: "muted" },
      ],
      edges: chain(["call", "busy", "vm", "lost"], { dashed: true }),
    },
    after: {
      height: 320,
      nodes: [
        { id: "call", label: "Incoming call", x: 100, y: 40 },
        { id: "agent", label: "Voice agent answers", x: 100, y: 100, tone: "ink" },
        { id: "qual", label: "Qualifies the caller", x: 100, y: 160 },
        { id: "book", label: "Books appointment", x: 100, y: 220 },
        { id: "crm", label: "CRM updated", x: 100, y: 280, note: "team notified" },
      ],
      edges: chain(["call", "agent", "qual", "book", "crm"], { live: true }),
    },
  },
];
