"use client";

import { motion } from "framer-motion";
import { productBySlug } from "@/lib/content/work";

const ease = [0.16, 1, 0.3, 1] as const;
const nurmed = productBySlug.nurmed;

export default function NurMedVisual() {
  return (
    <figure className="rounded-lg border border-line bg-surface-2">
      <div className="px-5 pb-6 pt-5 md:px-7 md:pb-8 md:pt-6">
        <p className="label-mono">Average consultation · Avenue Broadwalk General Practice</p>

        <div className="mt-8 space-y-7">
          <div>
            <div className="flex items-baseline justify-between">
              <span className="font-ui text-[15px] text-mute">Before NurMed</span>
              <span className="font-ui text-[clamp(2rem,4vw,3rem)] font-medium leading-none tracking-[-0.03em] text-mute">
                44<span className="ml-1 text-[0.45em] tracking-normal">min</span>
              </span>
            </div>
            <motion.div
              className="mt-3 flex h-10 origin-left overflow-hidden rounded-[4px]"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.9, ease }}
            >
              <span className="h-full w-2/3 bg-line-2" />
              <span
                className="flex h-full w-1/3 items-center justify-center border-l border-surface-2 font-mono text-[11px] text-ink-2"
                style={{ background: "repeating-linear-gradient(135deg, var(--line-2) 0 1px, transparent 1px 7px)" }}
              >
                typing notes
              </span>
            </motion.div>
            <p className="mt-2 font-mono text-[11px] text-mute">About a third of every consultation went to documentation.</p>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="font-ui text-[15px] text-ink">With NurMed, first week</span>
              <span className="font-ui text-[clamp(2rem,4vw,3rem)] font-medium leading-none tracking-[-0.03em] text-ink">
                29<span className="ml-1 text-[0.45em] tracking-normal">min</span>
              </span>
            </div>
            <div className="relative mt-3 h-10">
              <motion.span
                className="absolute inset-y-0 left-0 w-[65.9%] origin-left rounded-[4px] bg-ink"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.9, delay: 0.35, ease }}
              />
              <motion.span
                className="absolute inset-y-0 left-[65.9%] right-0 ml-1 flex items-center justify-center rounded-[4px] border border-dashed border-signal font-mono text-[12px] text-signal-ink"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                −15 min
              </motion.span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-line px-5 py-4 md:px-7">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-[11.5px] text-ink-2" aria-label="NurMed pipeline">
          {nurmed.pipeline.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true" className="hidden h-px w-4 bg-line-2 sm:block" />}
              <span className="sm:contents">
                <span className="text-mute sm:hidden">{String(i + 1).padStart(2, "0")} </span>
                {s}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {nurmed.quote && (
        <figcaption className="border-t border-line px-5 py-5 md:px-7">
          <p className="text-[15px] leading-relaxed text-ink-2">&ldquo;{nurmed.quote.text}&rdquo;</p>
          <p className="mt-3 font-mono text-[11.5px] text-mute">{nurmed.quote.by}</p>
        </figcaption>
      )}
    </figure>
  );
}
