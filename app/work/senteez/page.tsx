import type { Metadata } from "next";
import CaseStudyLayout from "@/components/work/CaseStudyLayout";

export const metadata: Metadata = {
  title: "Senteez — Quishub",
  description: "Senteez turns 23,000+ reviews from Google, TripAdvisor, Facebook and BestBuy into decisions for hospitality and retail operators.",
};

export default function SenteezPage() {
  return (
    <CaseStudyLayout
      slug="senteez"
      eyebrow="Hospitality & retail intelligence · Dubai / US"
      subtitle="Beyond the star rating: intelligence for hospitality and retail."
      overview={[
        <>
          The primary bottleneck in modern hospitality is no longer just service speed. It is intelligence. Operators in Dubai and the US often rely on vanity metrics that hide the truth. A 4.2-star rating doesn&apos;t tell you why specific rooms or dishes are failing.
        </>,
        <>
          <strong className="font-medium text-ink">Senteez</strong> is an AI-driven feedback intelligence platform designed to move beyond averages. By ingesting thousands of reviews across multiple global platforms, Senteez uses fine-tuned NLP models to extract actionable insights.
        </>,
      ]}
      pipelineIntro="The Senteez architecture is built to handle heavy data throughput, converting unstructured text into structured, multi-dimensional insights through a four-stage process."
      blocks={[
        {
          kind: "steps",
          title: "The intelligence pipeline",
          items: [
            { title: "Ingest (multi-channel aggregator)", description: "The system connects via API or web scrapers to Google Business, TripAdvisor, Facebook, BestBuy, and industry-specific platforms to pull raw review data in real-time." },
            { title: "Analyze (the NLP core)", description: "The engine runs four distinct analysis layers: Sentiment Analysis, Intent Detection, Topic Modeling, and Named Entity Recognition (NER) to extract multi-dimensional insights from every review." },
            { title: "Structure", description: "Raw data is converted into a decision-ready schema, allowing for cross-location benchmarking and historical trend tracking." },
            { title: "Visualize & act", description: 'Insights are delivered via an executive dashboard, highlighting "Critical Fixes" and "Success Patterns" rather than just a total score.' },
          ],
        },
        {
          kind: "list",
          title: "NLP analysis layers",
          items: [
            { title: "Sentiment analysis", description: "Detecting the emotional tone of every sentence." },
            { title: "Intent detection", description: "Identifying if a user is complaining, recommending, or asking a question." },
            { title: "Topic modeling", description: 'Grouping feedback into categories like "Cleanliness," "Staff Behavior," or "Value for Money."' },
            { title: "Named entity recognition", description: "Pinpointing specific mentions of employees, dishes, or locations." },
          ],
        },
        {
          kind: "table",
          title: "Live global impact",
          headers: ["Sector", "Coverage", "Review volume"],
          rows: [
            ["Dubai Marina hotels", "8 luxury properties", "11,127 reviews"],
            ["Dubai Marina restaurants", "9 dining establishments", "6,007 reviews"],
            ["US coffee brands", "5 national brands", "6,067 reviews"],
          ],
        },
        {
          kind: "list",
          title: "Features",
          items: [
            { title: "Cross-platform benchmarking", description: "Compare your performance on TripAdvisor against Google Business in a single view." },
            { title: "Competitor intelligence", description: "Ingest competitor reviews to identify their weaknesses and capitalize on market gaps." },
            { title: "Alert system", description: "Automated notifications for high-intent negative reviews to allow for rapid recovery." },
            { title: "Scalable data infrastructure", description: "Built to handle millions of reviews with low-latency processing." },
          ],
        },
      ]}
      deployments={{ title: "Access the platform", items: [{ label: "Live application", value: "senteez.com" }] }}
    />
  );
}
