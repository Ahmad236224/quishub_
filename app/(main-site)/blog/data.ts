export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string[];
  category: string;
  readTime: string;
  date: string;
  author: string;
  authorRole: string;
  coverImage: string;
}

export const categories = [
  "All Insights",
  "Healthcare & Clinical AI",
  "PropTech & Real Estate",
  "SaaS & Cloud Architecture",
  "Engineering Best Practices",
] as const;

export const featuredArticle: Article = {
  id: "featured-ambient-scribing",
  slug: "ambient-scribing-enterprise-hospitals",
  title:
    "The Reality of Ambient Scribing in Enterprise Hospitals: Cutting Charting Hours Without PHI Leaks.",
  excerpt:
    "How clinical listening models convert raw physician-patient dialogue into structured FHIR-ready SOAP notes while meeting strict HIPAA zero-retention standards.",
  category: "Healthcare AI & Compliance",
  readTime: "6 min read",
  date: "Sep 2026",
  author: "Muhammad",
  authorRole: "Founder & CTO",
  coverImage: "/images/healthcare/clinical-desk.jpg",
  body: [
    "Enterprise hospitals lose an estimated third of every clinical encounter to documentation. Ambient scribing systems recover that time by listening to the visit itself and turning raw dialogue into structured, billable notes — but only if the pipeline is built to survive real hospital constraints, not demo conditions.",
    "The hard part isn't transcription. It's the step after: mapping unstructured speech onto FHIR-shaped SOAP notes that a clinician will actually sign off on without a full rewrite. That means speaker diarization tuned for exam-room acoustics, medical-entity extraction that doesn't hallucinate dosages, and a review layer that keeps the physician as the final author of record.",
    "Compliance has to be architectural, not a policy document. Zero-retention audio pipelines, ephemeral processing windows, and private model deployments are what let a system pass a HIPAA risk assessment — bolting encryption onto a SaaS transcription API after the fact does not.",
    "Teams that get this right treat the scribe as clinical infrastructure: monitored latency budgets, fallback to manual entry when confidence drops, and audit trails on every generated note. Teams that treat it as a chatbot feature end up back at square one after their first compliance review.",
  ],
};

export const articles: Article[] = [
  {
    id: "1",
    title:
      "Bi-Directional FHIR Interoperability: Connecting Custom Apps to Epic and Cerner.",
    slug: "bi-directional-fhir-interoperability-epic-cerner",
    excerpt:
      "Why most 'FHIR-compatible' integrations only read data — and the architecture that lets custom apps write back to Epic and Cerner without breaking on the next EHR upgrade.",
    category: "Healthcare & Clinical AI",
    readTime: "7 min read",
    date: "Aug 2026",
    author: "Muhammad",
    authorRole: "Founder & CTO",
    coverImage: "/images/hospital-dashboard.png",
    body: [
      "Most integrations marketed as FHIR-compatible only pull data out of an EHR. Writing back — creating orders, updating problem lists, closing the loop — is where the real engineering happens, and where most third-party apps quietly give up.",
      "We built bi-directional sync by treating Epic's App Orchard and Cerner's Ignite APIs as first-class citizens, not an afterthought bolted onto a REST wrapper. That means resource-level conflict resolution, idempotent write queues, and version pinning that survives quarterly EHR upgrades.",
      "The payoff: a custom app that behaves like a native EHR module instead of a bolted-on widget that breaks every few months.",
    ],
  },
  {
    id: "2",
    title:
      "Automating Lease Verification: How We Scaled PMS Document Processing by 40%.",
    slug: "automating-lease-verification-pms-document-processing",
    excerpt:
      "A document pipeline that reads lease PDFs, cross-checks clauses against a property management system, and flags discrepancies before they become disputes.",
    category: "PropTech & Real Estate",
    readTime: "5 min read",
    date: "Aug 2026",
    author: "Uzair",
    authorRole: "Head of Product",
    coverImage: "/images/pre-visit-summary.png",
    body: [
      "Property managers process hundreds of lease documents a month, most of it manual clause-by-clause comparison against what's already in the PMS.",
      "We replaced that with a document pipeline: OCR and layout parsing to extract clauses, a verification layer that cross-references PMS records, and a review queue that only surfaces genuine discrepancies instead of every formatting difference.",
      "Throughput on document processing increased 40% in the first quarter, with a measurable drop in downstream lease disputes.",
    ],
  },
  {
    id: "3",
    title:
      "Field-Ready Offline Apps: Engineering Sync Engines for High-Volume Mobile Teams.",
    slug: "field-ready-offline-apps-sync-engines",
    excerpt:
      "Building mobile apps that stay fully functional with zero connectivity, then reconcile thousands of writes the moment a signal returns.",
    category: "Engineering Best Practices",
    readTime: "8 min read",
    date: "Jul 2026",
    author: "Muhammad",
    authorRole: "Founder & CTO",
    coverImage: "/images/cross-location-sync.png",
    body: [
      "Field teams — inspectors, technicians, clinicians on home visits — can't depend on connectivity. An app that degrades gracefully offline isn't a nice-to-have, it's the entire product.",
      "The core of this is a local-first sync engine: every write lands in an on-device store first, gets a vector clock, and queues for reconciliation. Conflict resolution has to be deterministic and explainable, or field teams stop trusting the app.",
      "We've shipped this pattern across mobile teams processing thousands of offline writes a day, reconciling in seconds once a signal returns.",
    ],
  },
  {
    id: "4",
    title:
      "Next.js App Router in Production: Avoiding Serverless Timeouts and Token Expirations.",
    slug: "nextjs-app-router-production-serverless-timeouts",
    excerpt:
      "The failure modes that only show up under real production load — and the architecture patterns that keep long-running requests from silently dying.",
    category: "SaaS & Cloud Architecture",
    readTime: "6 min read",
    date: "Jul 2026",
    author: "Uzair",
    authorRole: "Head of Product",
    coverImage: "/images/ai_network.png",
    body: [
      "App Router demos run great locally and then hit serverless execution limits the first week in production — usually on the one endpoint doing real work: a long AI generation call, a large export, a webhook chain.",
      "The fix isn't a bigger timeout. It's moving long-running work off the request-response cycle entirely: background jobs, streaming responses, and token refresh handled at the edge before it ever reaches application code.",
      "We treat every route that can exceed a few seconds as a candidate for a queue, not a direct serverless function call.",
    ],
  },
  {
    id: "5",
    title:
      "AI Agent Orchestration: Moving from Simple Chatbots to Autonomous Decision Trees.",
    slug: "ai-agent-orchestration-autonomous-decision-trees",
    excerpt:
      "What changes architecturally when an assistant stops answering questions and starts taking actions with real consequences.",
    category: "SaaS & Cloud Architecture",
    readTime: "7 min read",
    date: "Jun 2026",
    author: "Muhammad",
    authorRole: "Founder & CTO",
    coverImage: "/images/system-architecture-diagram-for-nurmed-ai-clinical.jpeg",
    body: [
      "A chatbot that answers questions has a forgiving failure mode: a bad answer is just a bad answer. An agent that books appointments, files claims, or triggers workflows does not have that luxury.",
      "Orchestrating autonomous agents means designing explicit decision trees with bounded tool access, confidence thresholds that trigger human review, and full action logging — not just prompt engineering on top of a single model call.",
      "The systems that hold up in production treat every agent action as a transaction with rollback semantics, not a one-shot generation.",
    ],
  },
  {
    id: "6",
    title:
      "The 2026 Digital Health Compliance Checklist: SOC 2, HIPAA, and Private LLMs.",
    slug: "2026-digital-health-compliance-checklist",
    excerpt:
      "What auditors are actually checking for this year when a digital health product uses large language models — and where private deployment becomes non-negotiable.",
    category: "Healthcare & Clinical AI",
    readTime: "9 min read",
    date: "Jun 2026",
    author: "Muhammad",
    authorRole: "Founder & CTO",
    coverImage: "/images/healthcare/Prior Authorization Tracking System.jpg",
    body: [
      "SOC 2 and HIPAA audits have caught up to LLM-powered products. Auditors now ask specific questions: where does PHI go when it hits a third-party model API, how long is it retained, and who can access logs.",
      "For most digital health products in 2026, the answer that satisfies both auditors and enterprise buyers is a privately hosted or zero-retention model deployment, with data residency and access controls documented at the architecture level, not just in a policy PDF.",
      "This checklist covers the eight areas we see audits fail on most: data flow mapping, model retention configuration, BAA coverage on every subprocessor, and incident response for model-specific failure modes.",
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  if (slug === featuredArticle.slug) return featuredArticle;
  return articles.find((a) => a.slug === slug);
}

export function getAllArticles(): Article[] {
  return [featuredArticle, ...articles];
}
