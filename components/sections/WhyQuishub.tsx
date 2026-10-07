"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";

const rows = [
  { feature: "Ships to production", quishub: "Always", others: "Sometimes" },
  { feature: "AI output evaluation", quishub: "Built-in", others: "None" },
  { feature: "Architecture-first", quishub: "Every time", others: "Rarely" },
  { feature: "Scalable from day one", quishub: "Yes", others: "After problems" },
  { feature: "Full transparency", quishub: "Full access", others: "Limited" },
  {
    feature: "Token cost optimization",
    quishub: "75%+ savings",
    others: "Not considered",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function WhyQuishub() {
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
            <SectionLabel variant="dark">WHY US</SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-quishub-black font-semibold tracking-heading"
            style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
          >
            Built different. By design.
          </motion.h2>
        </motion.div>

        {/* Desktop: table */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="hidden md:block surface-card overflow-hidden rounded-card"
        >
          <table className="w-full text-left">
            <thead>
              <tr className="surface-subtle">
                <th className="px-6 py-4 text-xs uppercase text-quishub-muted font-medium tracking-label-wide w-[36%]">
                  What matters
                </th>
                <th className="px-6 py-4 text-xs uppercase text-quishub-muted font-medium tracking-label-wide w-[32%]">
                  Quishub
                </th>
                <th className="px-6 py-4 text-xs uppercase text-quishub-muted font-medium tracking-label-wide w-[32%]">
                  Others
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.feature}
                  className="surface-divider border-t"
                >
                  <td className="px-6 py-4 text-sm text-quishub-black">
                    {row.feature}
                  </td>
                  <td className="px-6 py-4">
                    <span className="surface-subtle inline-flex items-center gap-2 rounded-md px-3 py-1 text-sm text-quishub-black">
                      <Check size={14} />
                      {row.quishub}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 text-sm text-quishub-muted">
                      <X size={14} />
                      {row.others}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Mobile: stacked cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          className="md:hidden space-y-3"
        >
          {rows.map((row) => (
            <motion.div
              key={row.feature}
              variants={fadeUp}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="surface-card rounded-card p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-label-wide text-quishub-muted mb-3">
                {row.feature}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="surface-subtle rounded-md px-3 py-2">
                  <p className="text-[10px] uppercase tracking-label-wide text-quishub-muted mb-1">Quishub</p>
                  <span className="inline-flex items-center gap-1.5 text-sm text-quishub-black font-medium">
                    <Check size={13} />
                    {row.quishub}
                  </span>
                </div>
                <div className="rounded-md px-3 py-2" style={{ background: "var(--surface-subtle-bg)", border: "1px solid var(--surface-subtle-border)" }}>
                  <p className="text-[10px] uppercase tracking-label-wide text-quishub-muted mb-1">Others</p>
                  <span className="inline-flex items-center gap-1.5 text-sm text-quishub-muted">
                    <X size={13} />
                    {row.others}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-12 text-xl text-quishub-black text-center font-medium"
        >
          We&apos;d rather say no to a project than ship something we&apos;re not proud of.
        </motion.p>
      </div>
    </section>
  );
}
