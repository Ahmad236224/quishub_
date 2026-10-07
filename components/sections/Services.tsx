"use client";

import { motion } from "framer-motion";
import { Brain, Layers, Server, Zap, Database, Shield, ArrowRight } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import { fadeUp, staggerContainer } from "@/components/animations/motionPresets";

const services = [
  {
    icon: Brain,
    title: "AI & LLM Integration",
    description:
      "RAG pipelines that retrieve the right context. Evaluation layers that catch bad outputs before your users do. Prompt engineering that actually holds up in production - not just in a demo.",
  },
  {
    icon: Layers,
    title: "SaaS MVP Development",
    description:
      "Zero to live product. Database design, API contracts, auth, and frontend - all built to grow with you, not against you.",
  },
  {
    icon: Server,
    title: "Scalable Backend Systems",
    description:
      "Built for the traffic you'll have, not just the traffic you have now. Queue systems, microservices, cloud-native infrastructure, and monitoring that keeps things running.",
  },
  {
    icon: Zap,
    title: "AI Automation Platforms",
    description:
      "Not if/else logic dressed up as AI. Real agents that understand context, handle edge cases, and know when to escalate to a human.",
  },
  {
    icon: Database,
    title: "Data-Driven Systems",
    description:
      "Systems that turn raw data into operational intelligence. Pipelines, warehouses, analytics layers, and dashboards - all production-ready.",
  },
  {
    icon: Shield,
    title: "Architecture Consulting",
    description:
      "Already have a system? We audit, redesign, and roadmap scalable architectures - identifying bottlenecks before they become outages.",
  },
];

export default function Services() {
  return (
    <section className="section-light section-padding">
      <div className="container-content">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer(0.1)}
          className="text-center mb-14"
        >
          <motion.div variants={fadeUp}>
            <SectionLabel variant="light">WHAT WE BUILD</SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-quishub-black font-semibold tracking-heading"
            style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
          >
            Every system we build runs in production.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-[17px] text-quishub-muted max-w-[600px] mx-auto"
          >
            We don&apos;t prototype and disappear. We architect, build, and deploy.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer(0.12)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.title}
                variants={fadeUp}
                className="group surface-card rounded-card p-7 transition-transform duration-200 cursor-pointer hover:scale-[1.01]"
              >
                <div className="surface-icon flex h-11 w-11 items-center justify-center rounded-[10px]">
                  <Icon size={20} className="text-quishub-black" />
                </div>
                <h3 className="mt-4 text-[17px] font-semibold text-quishub-black transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#2563eb] group-hover:to-[#7c3aed] group-hover:drop-shadow-[0_0_12px_rgba(124,58,237,0.6)]">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm text-quishub-muted leading-relaxed">
                  {service.description}
                </p>
                <span className="inline-flex items-center gap-1 mt-4 text-[13px] text-quishub-black hover:underline cursor-pointer">
                  Learn more <ArrowRight size={12} />
                </span>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}



