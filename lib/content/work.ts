// Single source of truth for product facts. Every number here is either from the
// original case-study pages or confirmed by the Quishub team — do not add new ones.

export type Product = {
  slug: "nurmed" | "senteez" | "paklawassist" | "fictionpub";
  name: string;
  industry: string;
  region: string;
  kind: string;
  headline: string;
  summary: string;
  problem: string;
  pipeline: string[];
  facts: { value: string; label: string }[];
  live: { label: string; href: string };
  image: string;
  quote?: { text: string; by: string };
};

export const products: Product[] = [
  {
    slug: "nurmed",
    name: "NurMed",
    industry: "Healthcare",
    region: "US / UAE",
    kind: "Clinical documentation",
    headline: "Giving doctors their consultations back.",
    summary:
      "NurMed listens to the consultation and drafts the clinical note, so the doctor can look at the patient instead of the keyboard.",
    problem:
      "Doctors were spending about a third of every consultation typing notes while patients waited.",
    pipeline: ["Capture", "Recognise", "Draft", "Review", "EHR-ready"],
    facts: [
      { value: "15 min", label: "Saved per consultation" },
      { value: "34%", label: "Shorter visits" },
      { value: "Week 1", label: "Time to measurable impact" },
    ],
    live: { label: "agent.nurmed.com", href: "https://agent.nurmed.com" },
    image: "/images/nurmed-ai.jpg",
    quote: {
      text:
        "Doctors are enjoying the convenience of typing much less, if at all. Patients feel they've been served more quickly, and our team feels much less fatigued by the documentation workload.",
      by: "Clinical team, Avenue Broadwalk General Practice",
    },
  },
  {
    slug: "senteez",
    name: "Senteez",
    industry: "Hospitality & retail",
    region: "Dubai / US",
    kind: "Review intelligence",
    headline: "23,000 reviews. One clear picture.",
    summary:
      "Senteez pulls reviews from Google, TripAdvisor, Facebook and BestBuy, reads every sentence, and shows operators what is actually breaking the experience.",
    problem:
      "A 4.2-star average doesn't tell you which rooms, dishes or staff behaviours are costing you guests.",
    pipeline: ["Ingest", "Analyse", "Structure", "Act"],
    facts: [
      { value: "23,000+", label: "Reviews analysed" },
      { value: "92%", label: "Theme accuracy" },
      { value: "22", label: "Hotels, restaurants and brands" },
    ],
    live: { label: "senteez.com", href: "https://senteez.com" },
    image: "/images/senteez.jpg",
  },
  {
    slug: "paklawassist",
    name: "PakLawAssist",
    industry: "Legal",
    region: "Pakistan",
    kind: "Legal knowledge system",
    headline: "Legal guidance grounded in Pakistani law.",
    summary:
      "Generic AI answers with US and UK assumptions. PakLawAssist retrieves Pakistan's own statutes and judgments first, then drafts contracts, petitions and compliance guidance from them.",
    problem:
      "Startups and SMEs in Pakistan couldn't get reliable legal guidance: consultants were slow and expensive, and online tools answered for the wrong country.",
    pipeline: ["Retrieve", "Reason", "Generate", "Validate", "Format"],
    facts: [
      { value: "1.2M", label: "Judgments indexed" },
      { value: "2", label: "Government deployments (SMEDA, PSIC)" },
      { value: "14", label: "Jurisdictions in Nuworo, its international version" },
    ],
    live: { label: "agent.paklawassist.com", href: "https://agent.paklawassist.com" },
    image: "/images/paklawassist.jpg",
  },
  {
    slug: "fictionpub",
    name: "FictionPub",
    industry: "Publishing",
    region: "United States",
    kind: "Manuscript platform",
    headline: "From a premise to a full-length novel in about 30 minutes.",
    summary:
      "FictionPub plans the market, characters and chapter structure before writing a word, then drafts the whole manuscript and checks every chapter against a quality gate.",
    problem:
      "Most writing tools give you a paragraph or a scene. Nobody had solved the full manuscript.",
    pipeline: ["Concept", "Characters", "Plot", "Draft", "Quality gate"],
    facts: [
      { value: "20,000+", label: "Writers" },
      { value: "100,000", label: "Words per manuscript" },
      { value: "2.4M", label: "Chapters generated" },
    ],
    live: { label: "app.fictionpub.ai", href: "https://app.fictionpub.ai" },
    image: "/images/fictionpub-ai.jpg",
  },
];

export const productBySlug = Object.fromEntries(products.map((p) => [p.slug, p])) as Record<
  Product["slug"],
  Product
>;

export const senteezCoverage = [
  { sector: "Dubai Marina hotels", places: 8, reviews: 11127 },
  { sector: "Dubai Marina restaurants", places: 9, reviews: 6007 },
  { sector: "US coffee brands", places: 5, reviews: 6067 },
];

export const proofIndex = [
  { industry: "Healthcare", product: "NurMed", slug: "nurmed", problem: "Doctors typing through consultations", result: "44 → 29 min per consultation" },
  { industry: "Legal", product: "PakLawAssist", slug: "paklawassist", problem: "Legal guidance for the wrong country", result: "Deployed with SMEDA and PSIC" },
  { industry: "Legal, international", product: "Nuworo", slug: "paklawassist", problem: "Contract review across borders", result: "14 jurisdictions" },
  { industry: "Hospitality & retail", product: "Senteez", slug: "senteez", problem: "Star ratings that explain nothing", result: "23,000+ reviews, 92% theme accuracy" },
  { industry: "Publishing", product: "FictionPub", slug: "fictionpub", problem: "Months to reach a first draft", result: "20,000+ writers, 2.4M chapters" },
] as const;

export const clientQuotes = [
  {
    text: "They rebuilt our PWA in two sprints and found $14k/mo of cloud we didn't know we were burning.",
    by: "Founder",
    context: "Full-stack PWA, via Upwork",
  },
  {
    text: "Senior engineers who actually read the whitepaper. Delivered the on-chain workflow we'd been stuck on for months.",
    by: "CTO",
    context: "Blockchain platform, via Upwork",
  },
];

export const upworkRating = "5.0";
