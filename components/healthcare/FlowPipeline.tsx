"use client";

import { motion } from "framer-motion";

export interface FlowStep {
  label: string;
  sub?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Responsive workflow-diagram primitive: cards wrap onto as many rows as
 * needed instead of forcing a single horizontally-scrolling row, so every
 * step stays fully visible (no half-cut boxes) on any screen size. Pure
 * CSS/SVG connectors — no chart library. Used across the healthcare page
 * for process/status pipelines (prior auth lifecycle, RCM flow, document
 * processing, before/after, etc).
 */
export default function FlowPipeline({
  steps,
  tone = "light",
  numbered = false,
}: {
  steps: FlowStep[];
  tone?: "light" | "dark";
  numbered?: boolean;
}) {
  const isDark = tone === "dark";
  return (
    <div className="flex flex-wrap items-stretch gap-x-2 gap-y-4" role="list" aria-label="Workflow steps">
      {steps.map((step, i) => (
        <motion.div
          key={step.label}
          role="listitem"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, delay: i * 0.03 }}
          className="flex items-center gap-2"
        >
          <div
            className={`flex h-full min-h-[96px] w-[150px] flex-col justify-center rounded-xl px-4 py-3.5 text-center shadow-sm sm:w-[168px] ${
              isDark
                ? "bg-white/[0.06] ring-1 ring-inset ring-white/10"
                : "bg-quishub-surface ring-1 ring-inset ring-quishub-border"
            }`}
          >
            {numbered && (
              <span
                className={`mx-auto mb-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[0.62rem] font-bold text-white`}
                style={{ background: "linear-gradient(135deg,#7c3aed,#2563eb)" }}
              >
                {i + 1}
              </span>
            )}
            <span
              className={`text-[0.86rem] font-semibold leading-snug ${
                isDark ? "text-white" : "text-quishub-black"
              }`}
            >
              {step.label}
            </span>
            {step.sub && (
              <span
                className={`mt-1 text-[0.74rem] leading-snug ${
                  isDark ? "text-white/50" : "text-quishub-muted"
                }`}
              >
                {step.sub}
              </span>
            )}
          </div>

          {i < steps.length - 1 && (
            <div
              className={`flex h-full shrink-0 items-center justify-center ${
                isDark ? "text-white/25" : "text-quishub-faint"
              }`}
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 shrink-0"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
