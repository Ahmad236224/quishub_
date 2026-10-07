"use client";

import { motion } from "framer-motion";
import { productBySlug } from "@/lib/content/work";

const steps = productBySlug.paklawassist.pipeline;
const ease = [0.16, 1, 0.3, 1] as const;

const clauses = ["Scope of work", "Payment terms", "Termination", "Governing law"];

export default function PakLawVisual() {
  return (
    <figure className="rounded-lg border border-line bg-surface-2">
      <div className="border-b border-line px-5 py-4 md:px-7">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-2" aria-label="PakLawAssist pipeline">
          {steps.map((s, i) => (
            <motion.li
              key={s}
              className="flex items-center gap-2"
              initial={{ opacity: 0.35 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.22 }}
            >
              {i > 0 && <span aria-hidden="true" className="hidden h-px w-5 bg-line-2 sm:block" />}
              <span className="rounded-[4px] border border-line-2 px-2 py-1 font-mono text-[11.5px] text-ink">
                {String(i + 1).padStart(2, "0")} {s}
              </span>
            </motion.li>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-1 gap-6 px-5 py-6 md:grid-cols-[1fr_1.6fr] md:px-7 md:py-8">
        <div className="space-y-4">
          <p className="label-mono">Retrieved first</p>
          <ul className="space-y-2.5 font-ui text-[15px] text-ink">
            <li className="flex items-baseline justify-between border-b border-line pb-2.5">
              <span>Judgments</span>
              <span className="font-mono text-[12px] text-mute">1.2M indexed</span>
            </li>
            <li className="flex items-baseline justify-between border-b border-line pb-2.5">
              <span>Statutes</span>
              <span className="font-mono text-[12px] text-mute">Pakistan</span>
            </li>
            <li className="flex items-baseline justify-between border-b border-line pb-2.5">
              <span>Regulations</span>
              <span className="font-mono text-[12px] text-mute">Pakistan</span>
            </li>
          </ul>
          <p className="text-[13.5px] leading-relaxed text-mute">
            Generation only starts once the relevant local law is in hand. Nothing is drafted from general knowledge alone.
          </p>
        </div>

        <motion.div
          className="rounded-md border border-line bg-background p-5 shadow-[var(--shadow-lg)] md:p-6"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, delay: 1.1, ease }}
          aria-label="Example of a formatted contract draft"
          role="img"
        >
          <p className="font-ui text-[17px] font-medium text-ink">Services Agreement</p>
          <p className="mt-1 font-mono text-[11px] text-mute">Draft · formatted for download</p>
          <div className="mt-5 space-y-4">
            {clauses.map((c, i) => {
              const grounded = c === "Governing law";
              return (
                <div key={c} className={grounded ? "relative -mx-2 rounded-[4px] bg-[var(--signal-soft)] px-2 py-2" : ""}>
                  <p className="font-ui text-[13px] font-medium text-ink">
                    {i + 1}. {c}
                  </p>
                  <span className="mt-2 block h-[5px] w-full rounded-full bg-line" />
                  <span className="mt-1.5 block h-[5px] w-4/5 rounded-full bg-line" />
                  {grounded && <p className="mt-2 font-mono text-[10.5px] text-signal-ink">Grounded in retrieved Pakistani law</p>}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </figure>
  );
}
