"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";

const testimonials = [
  {
    quote:
      "They are very much enjoying the use and convenience of typing much less if at all. The first week after installation, average TAT at our General Practice clinic dropped by 15 minutes - from 44 to 29.",
    name: "Clinical Team",
    role: "Avenue Broadwalk General Practice - NurMed Deployment",
    initials: "CT",
  },
  {
    quote:
      "From the start, they demonstrated a strong understanding of the project requirements and approached the development process with thoughtful planning and clear communication.",
    name: "Product Team",
    role: "Full-Stack PWA & Web3 Project - Upwork, 5.0",
    initials: "PT",
  },
  {
    quote:
      "They stepped into the project at a critical time and solved issues created by previous developers with grace, calmness, and precision.",
    name: "Development Team",
    role: "Blockchain Project - Upwork, 5.0",
    initials: "DT",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Testimonials() {
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
            <SectionLabel variant="light">CLIENT STORIES</SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-quishub-black font-semibold tracking-heading"
            style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
          >
            The teams who trust us.
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((t) => (
            <motion.article
              key={t.name}
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="surface-card rounded-card p-7 transition-transform duration-200 hover:scale-[1.01]"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-quishub-black fill-quishub-black"
                  />
                ))}
              </div>
              <p className="text-sm text-quishub-muted leading-body">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-6">
                                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-quishub-white"
                  style={{
                    background: "var(--button-primary-bg)",
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-quishub-black">
                    {t.name}
                  </p>
                  <p className="text-xs text-quishub-muted">{t.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}




