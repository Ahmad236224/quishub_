import type { Metadata } from "next";
import CaseStudyLayout from "@/components/work/CaseStudyLayout";

export const metadata: Metadata = {
  title: "NurMed — Quishub",
  description: "NurMed drafts clinical notes from the consultation so doctors type less. Average consultations fell from 44 to 29 minutes in the first week.",
};

export default function NurMedPage() {
  return (
    <CaseStudyLayout
      slug="nurmed"
      eyebrow="Healthcare · US / UAE"
      subtitle="Restoring the patient-doctor connection."
      overview={[
        <>
          The primary bottleneck in modern healthcare is no longer just medical complexity. It is documentation. Doctors in Pakistan and abroad spend a disproportionate amount of every consultation typing into systems while patients wait, leading to &ldquo;screen fatigue&rdquo; and a degraded patient experience.
        </>,
        <>
          <strong className="font-medium text-ink">NurMed</strong> is an AI-driven clinical documentation platform designed to handle the heavy lifting of medical charting. By automating the transcription and structuring of clinical notes, NurMed allows doctors to focus on the person in front of them, not the keyboard.
        </>,
      ]}
      pipelineIntro="NurMed uses a Clinical AI Orchestration Engine so documentation is not just fast, but medically accurate and properly structured. Every note moves through a secure, five-stage pipeline."
      blocks={[
        {
          kind: "steps",
          title: "The clinical workflow",
          items: [
            { title: "Retrieve (ambient capture)", description: "The system securely captures the audio stream of the patient-doctor conversation or processes digital intake forms as the primary reference context." },
            { title: "Process (entity recognition)", description: "High-fidelity speech-to-text conversion is paired with Clinical Entity Recognition (CER) to identify symptoms, medications, and history." },
            { title: "Structure (RAG-based generation)", description: "Using Retrieval-Augmented Generation, the engine drafts clinical notes (such as SOAP notes) grounded in established clinical guidelines and the specific patient’s history." },
            { title: "Review (validation)", description: "An automated clinical review layer scans for potential hallucinations or inconsistencies before the doctor sees the draft." },
            { title: "Finalize (EHR integration)", description: "The final output is formatted into EHR-ready documents, ready for one-click integration into the hospital’s existing management system." },
          ],
        },
        {
          kind: "table",
          title: "Proven impact on efficiency",
          headers: ["Metric", "Before NurMed", "With NurMed", "Improvement"],
          rows: [
            ["Turnaround time (TAT)", "44 minutes", "29 minutes", "−15 minutes"],
            ["Consultation duration", "Standard", "Reduced by 34%", "More patients served"],
            ["Impact velocity", "N/A", "Week 1", "Immediate ROI"],
          ],
        },
        {
          kind: "quote",
          text: "Doctors are enjoying the convenience of typing much less, if at all. Patients feel they've been served more quickly, and our team feels much less fatigued by the documentation workload.",
          by: "Clinical team, Avenue Broadwalk General Practice",
        },
        {
          kind: "list",
          title: "Security and institutional governance",
          intro: "Built for the sensitive nature of medical data, the NurMed architecture includes:",
          items: [
            { title: "HIPAA/GDPR alignment", description: "End-to-end encryption for all medical data streams and stored records." },
            { title: "Admin/clinician dashboard", description: "Centralized management for hospital administrators to track efficiency metrics and manage user licenses." },
            { title: "Role-based access", description: "Strict partitioning ensuring only authorized medical personnel can access or edit patient records." },
          ],
        },
      ]}
      deployments={{
        title: "Live deployments",
        items: [
          { label: "Main platform", value: "Live at agent.nurmed.com" },
          { label: "Partner systems", value: "Currently integrating with Medi-Link Systems and local private practices to streamline outpatient workflows." },
        ],
      }}
    />
  );
}
