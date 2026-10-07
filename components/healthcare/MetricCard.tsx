"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Large editorial metric card — oversized number, short label, discreet
 * source caption. Used for third-party industry stats and (separately
 * styled by caller) for Quishub's own verified proof metrics.
 */
export default function MetricCard({
  value,
  label,
  source,
  index = 0,
}: {
  value: string;
  label: string;
  source?: string;
  index?: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="border-t border-quishub-border pt-5"
    >
      <div
        className="font-display bg-gradient-to-r from-[#7c3aed] to-[#2563eb] bg-clip-text text-[2.3rem] font-bold leading-none tracking-[-0.02em] text-transparent md:text-[2.6rem]"
      >
        {value}
      </div>
      <p className="mt-3 text-sm leading-[1.5] text-quishub-muted">{label}</p>
      {source && (
        <p className="mt-2 text-[0.68rem] uppercase tracking-[0.13em] text-quishub-faint">
          {source}
        </p>
      )}
    </motion.div>
  );
}
