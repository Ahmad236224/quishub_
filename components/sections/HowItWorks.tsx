"use client";

import { motion } from "framer-motion";
import { Search, PenTool, Rocket } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import { fadeUp, staggerContainer } from "@/components/animations/motionPresets";

const steps = [
  {
    num: "01",
    icon: Search,
    title: "Discovery Workshop",
    description:
      "We get into your systems, your constraints, and your actual goals before a single line of code is written. We define what success looks like so we're building the right thing.",
  },
  {
    num: "02",
    icon: PenTool,
    title: "Architecture & Design",
    description:
      "We design the system, pick the right stack, and map every data flow. You see the full blueprint before we build. No surprises mid-project.",
  },
  {
    num: "03",
    icon: Rocket,
    title: "Build, Deploy & Measure",
    description:
      "We ship to production, monitor real-world performance, and iterate. You get a system that works - not a handoff document and good luck.",
  },
];

export default function HowItWorks() {
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
            <SectionLabel variant="dark">THE PROCESS</SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-quishub-black font-semibold tracking-heading"
            style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
          >
            Brief to production. No guesswork in between.
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer(0.14)}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 relative"
        >
          <div className="surface-connector absolute left-[33.33%] right-[33.33%] top-1/2 z-0 hidden h-px -translate-y-1/2 border-t border-dashed md:block" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                variants={fadeUp}
                className="surface-card relative z-10 rounded-card p-7"
              >
                <span className="surface-number absolute right-5 top-4 select-none text-5xl font-bold">
                  {step.num}
                </span>
                <div className="surface-icon flex h-10 w-10 items-center justify-center rounded-full">
                  <Icon size={18} className="text-quishub-black" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-quishub-black">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-quishub-muted leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}



