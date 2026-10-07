"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";

const faqs = [
  {
    q: "What industries do you work in?",
    a: "We've shipped systems in healthcare, legal tech, logistics, and hospitality - across Pakistan, Kenya, and the UAE. If the problem is technical and the stakes are real, we're interested.",
  },
  {
    q: "How long does a typical project take?",
    a: "Depends on scope. A focused MVP takes 6-10 weeks. A full AI integration with evaluation and monitoring takes longer. We'll tell you exactly what's realistic in the discovery call - not what sounds good.",
  },
  {
    q: "Do you work on existing codebases?",
    a: "Yes. We audit, redesign, and build on top of what you already have. We also tell you honestly what's worth keeping and what needs to be replaced.",
  },
  {
    q: "What makes you different from a standard dev agency?",
    a: "Most agencies build to spec. We build to scale. We ask the architecture questions upfront that most teams only discover six months after launch. And we build and operate our own products.",
  },
  {
    q: "What is your minimum project size?",
    a: "We don't do quick fixes or one-off tasks. Our minimum engagement is a focused build - something with real architecture decisions behind it. Book a call and we'll tell you if there's a fit.",
  },
  {
    q: "Do you offer ongoing support after launch?",
    a: "Yes. Most of our clients work with us beyond the initial build - monitoring, iteration, scaling. We don't hand off and disappear.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
            <SectionLabel variant="dark">FAQ</SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-quishub-black font-semibold tracking-heading"
            style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
          >
            Questions we get asked a lot.
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="max-w-[720px] mx-auto"
        >
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="surface-divider border-b py-5"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full cursor-pointer rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] flex items-center justify-between"
              >
                <span className="text-base font-medium text-quishub-black pr-4">
                  {faq.q}
                </span>
                {openIndex === i ? (
                  <Minus size={18} className="text-quishub-muted flex-shrink-0" />
                ) : (
                  <Plus size={18} className="text-quishub-muted flex-shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pt-3 text-sm text-quishub-muted leading-body">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


