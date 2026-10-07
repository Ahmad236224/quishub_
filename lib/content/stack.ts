// icon: file in /public/images/stack. Brand marks come from Simple Icons; tools it has no mark for use an initials badge.
type Tech = { name: string; icon: string };
const t = (name: string, icon: string): Tech => ({ name, icon: `/images/stack/${icon}.svg` });

export type StackCategory = { category: string; blurb: string; items: Tech[] };

export const stack: StackCategory[] = [
  {
    category: "AI & automation",
    blurb: "Models, retrieval, agents and the workflows around them.",
    items: [t("LangChain", "langchain"), t("OpenAI", "openai"), t("Anthropic", "anthropic"), t("LlamaIndex", "llamaindex"), t("Groq", "groq"), t("Cohere", "cohere")],
  },
  {
    category: "Data",
    blurb: "Relational, cache and vector storage for search and memory.",
    items: [t("Pinecone", "pinecone"), t("Weaviate", "weaviate"), t("Qdrant", "qdrant"), t("pgvector", "pgvector"), t("PostgreSQL", "postgresql"), t("Redis", "redis")],
  },
  {
    category: "Backend",
    blurb: "APIs, jobs and business rules that behave the same every time.",
    items: [
      t("Python", "python"), t("FastAPI", "fastapi"), t("Node.js", "nodedotjs"), t("Express", "express"), t("Django", "django"),
      t("Prisma", "prisma"), t("Supabase", "supabase"), t("Neon", "neon"), t("Celery", "celery"), t("GraphQL", "graphql"),
    ],
  },
  {
    category: "Frontend",
    blurb: "Interfaces people use every day without a manual.",
    items: [
      t("React", "react"), t("Next.js", "nextdotjs"), t("TypeScript", "typescript"), t("Tailwind", "tailwindcss"), t("Vite", "vite"),
      t("Framer Motion", "framer"), t("GSAP", "gsap"), t("TanStack Query", "reactquery"), t("Zustand", "zustand"),
    ],
  },
  { category: "Mobile",
    blurb: "iOS and Android from one codebase.", items: [t("React Native", "react"), t("Flutter", "flutter"), t("Expo", "expo")] },
  { category: "Workflow tools",
    blurb: "Connecting the tools a team already uses.", items: [t("n8n", "n8n"), t("Make", "make"), t("Zapier", "zapier"), t("Retool", "retool")] },
  {
    category: "Cloud & DevOps",
    blurb: "Hosting, pipelines and monitoring from the first deploy.",
    items: [
      t("Docker", "docker"), t("Kubernetes", "kubernetes"), t("AWS", "aws"), t("GCP", "googlecloud"), t("Vercel", "vercel"),
      t("Caddy", "caddy"), t("MinIO/S3", "minio"), t("Sentry", "sentry"), t("GitHub Actions", "githubactions"), t("Nginx", "nginx"),
    ],
  },
  {
    category: "Payments & comms",
    blurb: "Billing, calls, messages and email.",
    items: [t("Stripe", "stripe"), t("Telnyx", "telnyx"), t("Resend", "resend"), t("Google Play Billing", "googleplay"), t("StoreKit", "apple")],
  },
  { category: "Testing",
    blurb: "Real data and edge cases, tested before launch.", items: [t("Playwright", "playwright"), t("Jest", "jest"), t("Vitest", "vitest"), t("Supertest", "supertest")] },
];
