import type { Metadata } from "next";
import CaseStudyLayout from "@/components/work/CaseStudyLayout";

export const metadata: Metadata = {
  title: "PakLawAssist — Quishub",
  description: "PakLawAssist grounds legal drafting and compliance guidance in Pakistan's own law. Deployed with SMEDA and PSIC.",
};

export default function PakLawAssistPage() {
  return (
    <CaseStudyLayout
      slug="paklawassist"
      eyebrow="Legal tech · Pakistan"
      subtitle="Legal tech built for Pakistan's own ecosystem."
      overview={[
        <>
          Startups and SMEs in Pakistan face a significant barrier to entry regarding reliable legal guidance. Traditional legal consultancy is often prohibitively expensive and slow, while generic Large Language Models (LLMs) default to US or UK-centric assumptions that hold no legal weight in Pakistan.
        </>,
        <>
          <strong className="font-medium text-ink">PakLawAssist</strong> was built to bridge this gap. It is a purpose-built, RAG-first legal AI platform explicitly grounded in Pakistan&apos;s actual legal and regulatory frameworks, delivering contextually accurate guidance and ready-to-use legal documents.
        </>,
      ]}
      pipelineIntro="Unlike standard chat interfaces, PakLawAssist relies on a multi-step RAG (Retrieval-Augmented Generation) orchestration pipeline to ensure legal accuracy and reliability. Every document or compliance check passes through five distinct layers."
      blocks={[
        {
          kind: "steps",
          title: "The architecture flow",
          items: [
            { title: "Retrieve", description: "The system queries a specialized vector database containing Pakistan's statutory laws, regulatory guidelines, and legal precedents to fetch the exact local context required." },
            { title: "Reason", description: "The engine analyzes the retrieved context against the user's prompt to ensure applicability and prevent hallucinations." },
            { title: "Generate", description: "The LLM drafts the response or document, such as a contract or petition, strictly constrained by the retrieved local legal framework." },
            { title: "Validate", description: "An automated validation layer checks the output for structural integrity and alignment with the initial prompt." },
            { title: "Format", description: "Instead of outputting raw chat text, the system compiles the final output into clean, professionally formatted, and downloadable legal documents." },
          ],
        },
        {
          kind: "list",
          title: "Core platform capabilities",
          items: [
            { title: "Localized contract drafting & review", description: "Generates and reviews agreements based on Pakistani corporate and contract law instead of generic templates." },
            { title: "Compliance guidance", description: "Provides accurate regulatory roadmaps tailored for local startups and SMEs." },
            { title: "Petition drafting", description: "Structures formal legal petitions aligned with the formats required by local courts and regulatory bodies." },
            { title: "Clean document output", description: "Goes from AI generation to production-ready documents without the clutter of conversational AI text." },
          ],
        },
        {
          kind: "list",
          title: "Enterprise and institutional governance",
          intro: "To support institutional deployments and secure B2B usage, the platform includes comprehensive backend governance:",
          items: [
            { title: "Role-based access control", description: "Secure partitioning of data and platform capabilities based on user roles and institutional hierarchies." },
            { title: "Usage quotas & rate limiting", description: "Automated token and generation tracking to manage infrastructure costs and API limits." },
            { title: "Admin governance", description: "A centralized dashboard for institutional partners to monitor usage, manage users, and audit platform activity." },
          ],
        },
      ]}
      deployments={{
        title: "Live ecosystem and deployments",
        intro: "The PakLawAssist architecture currently supports multiple live deployments across the public and private sectors:",
        items: [
          { label: "Core application", value: "Live at agent.paklawassist.com" },
          { label: "SMEDA", value: "Custom knowledge chatbot deployed with SMEDA (Small and Medium Enterprises Development Authority)" },
          { label: "PSIC", value: "Custom knowledge chatbot deployed with PSIC (Punjab Small Industries Corporation)" },
          { label: "Global reach", value: "The underlying architecture powers our international legal tech variant, live at nuworo.com" },
        ],
      }}
    />
  );
}
