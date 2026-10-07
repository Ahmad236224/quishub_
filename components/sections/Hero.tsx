"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Link from "next/link";
import GlowLayout from "@/components/GlowLayout";
import GlowButton from "@/components/GlowButton";

const techPills = [
  { name: "LLM Integration", logo: "https://cdn.simpleicons.org/openai/412991" },
  { name: "RAG Systems", emoji: "🧠" },
  { name: "SaaS MVP", emoji: "🚀" },
  { name: "AI Agents", logo: "https://cdn.simpleicons.org/langchain/1C3C3C" },
  { name: "Backend Architecture", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
  { name: "Data Pipelines", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachekafka/apachekafka-original.svg" },
  { name: "Automation Platforms", logo: "https://cdn.simpleicons.org/n8n/EA4B71" },
  { name: "Healthcare AI", emoji: "🏥" },
  { name: "Legal AI", emoji: "⚖️" },
  { name: "Production Deployment", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <GlowLayout className="section-light pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="container-content">
        <motion.div
          className="max-w-[800px] mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.5, ease: "easeOut" }}>
            <Badge>AI Product Studio</Badge>
          </motion.div>

          <h1 className="mt-6 text-quishub-black font-semibold leading-hero tracking-hero" style={{ fontSize: "clamp(40px, 6vw, 72px)" }}>
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "120%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              >
                Your Clients Don&apos;t Need More Demos.
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                style={{
                  background: "var(--quishub-gradient)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                }}
                initial={{ y: "120%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.22 }}
              >
                They Need AI That Ships.
              </motion.span>
            </span>
          </h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-5 text-lg text-quishub-muted max-w-[600px] mx-auto leading-body"
          >
            We build AI systems that go live, handle real traffic, and
            don&apos;t break at scale. No prototypes handed off to your team. No
            babysitting required. Just working products - from brief to
            production.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link href="/contact">
              <GlowButton>Book a Discovery Call</GlowButton>
            </Link>
            <Link href="/work">
              <Button variant="secondary">See Our Work</Button>
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-6 flex items-start justify-center gap-2"
          >
            <Check size={14} className="text-quishub-black flex-shrink-0 mt-[3px]" />
            <span className="text-[13px] text-quishub-muted text-left max-w-[520px]">
              Consistently rated 5.0 on Upwork &mdash; 20,000+ users on our own
              products &mdash; live across healthcare, legal, logistics, and creative
              tech
            </span>
          </motion.div>
        </motion.div>

        <div className="mt-14 overflow-hidden">
          <div className="flex animate-marquee w-max">
            {[...techPills, ...techPills].map((pill, i) => (
              <span
                key={i}
                className="surface-chip inline-flex items-center gap-2 flex-shrink-0 mx-2 text-quishub-muted text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap"
              >
                {pill.logo ? (
                  <img
                    src={pill.logo}
                    alt={pill.name}
                    className="h-3.5 w-3.5 object-contain"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span aria-hidden="true">{pill.emoji ?? "◆"}</span>
                )}
                {pill.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </GlowLayout>
  );
}


