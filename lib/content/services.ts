import type { Product } from "./work";

export type Situation = {
  id: string;
  /** Old anchor ids still linked from elsewhere (footer, chatbot, bookmarks). */
  aliases: string[];
  title: string;
  problem: string;
  body: string;
  examples: string[];
  capabilities: string[];
  diagram: string;
  related?: { slug: Product["slug"]; note: string };
  proof?: string[];
  healthcare?: boolean;
};

export const situations: Situation[] = [
  {
    id: "build-software",
    aliases: ["digital-product-launch", "saas-mvp-development"],
    title: "Build software",
    problem: "The business runs on a spreadsheet and a group chat, or the idea needs a real product to sell.",
    body: "We design, build and launch web and mobile products with accounts, billing and reporting built in, then keep improving them after launch.",
    examples: ["Customer portals", "SaaS products with subscriptions", "Internal tools your team actually uses", "Mobile apps"],
    capabilities: ["Web and mobile apps", "Secure user accounts and roles", "Billing and subscriptions", "Analytics dashboards", "Deployments without downtime"],
    diagram: "product",
    related: { slug: "fictionpub", note: "A full product we built and run, used by more than 20,000 writers." },
  },
  {
    id: "automate-operations",
    aliases: ["intelligent-automation", "smart-workflow-solutions", "ai-automation-platforms"],
    title: "Automate operations",
    problem: "People copy, check and chase things that follow the same rules every time.",
    body: "We automate the routine path end to end. Anything unusual goes to the right person with the context to decide quickly, and every step is logged.",
    examples: ["Document intake and processing", "Approvals and escalations", "Follow-ups and notifications", "Clinical documentation"],
    capabilities: ["Custom workflow automation", "Document processing", "Human review for exceptions", "Monitoring dashboards"],
    diagram: "manual",
    related: { slug: "nurmed", note: "Average consultations went from 44 to 29 minutes in the first week." },
    healthcare: true,
  },
  {
    id: "connect-systems",
    aliases: ["business-intelligence", "data-driven-systems"],
    title: "Connect systems",
    problem: "Your CRM, billing, inbox and spreadsheets each hold part of the truth, and someone keeps them in sync by hand.",
    body: "We connect the tools you already pay for so data is entered once, stays in sync, and ends up somewhere you can actually read it.",
    examples: ["Syncing CRM and billing", "Pulling data from third-party platforms", "One reporting view across tools", "Live dashboards"],
    capabilities: ["Integrations and APIs", "Data pipelines", "Dashboards and automated reports", "Data quality checks"],
    diagram: "connect",
    related: { slug: "senteez", note: "Pulls reviews from Google, TripAdvisor, Facebook and BestBuy into one system." },
  },
  {
    id: "improve-software",
    aliases: ["enterprise-infrastructure", "scalable-backend-systems", "strategic-advisory", "strategic-technology-advisory", "architecture-consulting"],
    title: "Improve existing software",
    problem: "It works, mostly. But it's slow, fragile, and every release is a risk.",
    body: "We audit what you have, fix what matters most first, and keep the system your team already relies on. You get a plan in plain language, ordered by business impact.",
    examples: ["System audits and roadmaps", "Performance and scaling work", "Stabilising a codebase another team built"],
    capabilities: ["Architecture review", "Performance and load work", "Monitoring and alerts", "Cloud infrastructure", "Handover to your team"],
    diagram: "legacy",
    proof: [
      "One audit found five critical issues. Fixing the top three made the platform 80% faster and doubled release speed.",
      "A logistics platform that crashed at peak hours now handles ten times the original traffic at 99.9% uptime.",
    ],
  },
  {
    id: "apply-ai",
    aliases: ["ai-llm-integration"],
    title: "Apply AI to workflows",
    problem: "You want AI doing real work, not a demo, and you can't afford it being wrong.",
    body: "We put AI at the step where it helps, grounded in your own documents, with validation and a person before anything goes out. That includes voice agents that answer calls and book appointments.",
    examples: ["Drafting documents from your own data", "Sorting and routing incoming requests", "Voice agents for inbound calls", "Summarising long records"],
    capabilities: ["Retrieval over your documents", "Validation and human review", "Model choice and cost control", "Evaluation and monitoring"],
    diagram: "ai",
    related: { slug: "paklawassist", note: "Retrieves Pakistani law before it drafts anything. Deployed with SMEDA and PSIC." },
  },
];
