import type { Metadata } from "next";
import CaseStudyLayout from "@/components/work/CaseStudyLayout";

export const metadata: Metadata = {
  title: "FictionPub — Quishub",
  description: "FictionPub takes 20,000+ writers from a premise to a 100,000-word manuscript in about 30 minutes, with every chapter checked against a quality gate.",
};

export default function FictionPubPage() {
  return (
    <CaseStudyLayout
      slug="fictionpub"
      eyebrow="Creative tech · United States"
      subtitle="Solving the blank page problem at scale."
      overview={[
        <>
          Writing a novel is an endurance sport that traditionally takes months or years. While most AI tools offer short-form assistance, a paragraph here and a scene there, <strong className="font-medium text-ink">FictionPub.ai</strong> is built to solve the full manuscript. From students to professional authors, our 20,000+ users move from a single concept to a 100,000-word draft in under 30 minutes.
        </>,
      ]}
      pipelineIntro="The creative pipeline goes from concept to finished manuscript, and nothing reaches the writer without passing the quality gate."
      blocks={[
        {
          kind: "steps",
          title: "The multi-stage generative pipeline",
          items: [
            { title: "Market & concept", description: "The engine begins with market research and high-level story conceptualization." },
            { title: "Character & world building", description: "Detailed profiles and setting descriptions are generated to ensure internal consistency." },
            { title: "Structural plotting", description: "The system breaks the concept into a chapter-by-chapter plot structure before a single word of prose is written." },
            { title: "Draft generation", description: "Utilizing a distributed task queue, the system generates the full manuscript, streaming content to the user in real-time." },
            { title: "LLM-as-judge (the quality gate)", description: "Every chapter is evaluated for creativity, coherence, and pacing. If a section scores below 70%, the system automatically triggers a regeneration." },
          ],
        },
        {
          kind: "list",
          title: "The engineering behind the narrative",
          intro: "To handle the computational load of generating 100,000-word manuscripts for thousands of users at once, the backend runs on a resilient creative stack:",
          items: [
            { title: "Multi-provider AI strategy", description: "We dynamically route tasks between Anthropic and OpenAI based on the specific requirements of the task (e.g., creative prose vs. logical plotting)." },
            { title: "Distributed task management", description: "A Celery + Redis queue manages long-running generation jobs (20–30 minutes), ensuring system stability at scale." },
            { title: "Real-time feedback", description: "WebSocket streaming allows writers to watch their novel come to life paragraph by paragraph, rather than waiting for a single bulk delivery." },
            { title: "Opik prompt governance", description: 'We manage 500+ genre-specific prompts with rigorous versioning and A/B testing to ensure "Hard Sci-Fi" feels different from "Regency Romance."' },
            { title: "Auto-recovery systems", description: 'Our "Zero Lost Work" protocol detects stuck tasks and allows the generation to resume from any stage in the event of a network or API interruption.' },
          ],
        },
        {
          kind: "table",
          title: "Performance and reach",
          intro: "FictionPub.ai is currently the leading full-length manuscript generator in the US market.",
          headers: ["Metric", "Achievement"],
          rows: [
            ["User base", "20,000+ active writers"],
            ["Manuscript length", "Up to 100,000 words"],
            ["Generation speed", "~30 minutes per novel"],
            ["Quality standard", "70% automated quality gate"],
          ],
        },
      ]}
      deployments={{ title: "Experience the platform", items: [{ label: "Live application", value: "app.fictionpub.ai" }] }}
    />
  );
}
