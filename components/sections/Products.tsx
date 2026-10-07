"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";

const products = [
  {
    name: "PakLawAssist",
    url: "https://paklawassist.com",
    displayUrl: "paklawassist.com",
    description:
      "AI legal readiness platform built for Pakistan's legal and regulatory framework. RAG-grounded contract drafting, review, and compliance guidance. Live with SMEDA and PSIC - two Pakistan government departments.",
  },
  {
    name: "Senteez",
    url: "https://senteez.com",
    displayUrl: "senteez.com",
    description:
      "Feedback intelligence for hospitality and retail. Ingests reviews from Google, TripAdvisor, Facebook, and more. Fine-tuned NLP models extract what customers actually mean - not just their star rating.",
  },
  {
    name: "NurMed",
    url: "https://nurmed.ai",
    displayUrl: "nurmed.ai",
    description:
      "AI clinical documentation for doctors. Handles the typing so clinicians can focus on the patient. Deployed at Avenue Broadwalk General Practice - consultation time dropped 34% in Week 1.",
  },
  {
    name: "Nuworo",
    url: "https://nuworo.com",
    displayUrl: "nuworo.com",
    description:
      "The international version of PakLawAssist. Contract review built for global standards.",
  },
  {
    name: "FictionPub.ai",
    url: "https://app.fictionpub.ai",
    displayUrl: "app.fictionpub.ai",
    description:
      "Enterprise-grade AI novel writing platform. 20,000+ active users across the US. Generates complete 60,000-100,000 word manuscripts in 20-30 minutes with built-in quality assurance. Multi-provider AI, real-time streaming, and LLM-as-Judge evaluation - all running in production at scale.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Products() {
  return (
    <section className="section-light section-padding">
      <div className="container-content">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="text-center mb-14"
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.5, ease: "easeOut" }}>
            <SectionLabel variant="light">WHAT WE&apos;VE BUILT FOR OURSELVES</SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-quishub-black font-semibold tracking-heading"
            style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
          >
            We don&apos;t just build for clients. We ship our own.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-4 text-[17px] text-quishub-muted max-w-[720px] mx-auto leading-body"
          >
            Every product we operate is built to the same standard we hold for
            client work. That means we&apos;ve lived through the architecture
            decisions, the scaling problems, and the production fires - not
            just read about them.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {products.map((product) => (
            <motion.article
              key={product.name}
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="surface-card rounded-card p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-quishub-black">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-label-wide text-quishub-muted">
                    {product.displayUrl}
                  </p>
                </div>
                <a
                  href={product.url}
                  target={product.url.startsWith("http") ? "_blank" : undefined}
                  rel={product.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={`Open ${product.name}`}
                  className="surface-icon flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[8px] text-quishub-black transition-opacity duration-200 hover:opacity-75"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
              <p className="mt-4 text-sm leading-body text-quishub-muted">
                {product.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
