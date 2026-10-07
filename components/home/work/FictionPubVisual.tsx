"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { productBySlug } from "@/lib/content/work";
import { useReducedMotionSafe } from "@/components/system/useReducedMotionSafe";

const steps = productBySlug.fictionpub.pipeline;
const GATE = 70;
// Relative bar lengths only — they illustrate the gate, they are not scores.
const chapters = [86, 79, 58, 91, 74, 83];
const RETRY = 2;
const RETRY_TO = 81;

export default function FictionPubVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const reduce = useReducedMotionSafe();

  return (
    <figure className="rounded-lg border border-line bg-surface-2">
      <div className="border-b border-line px-5 py-4 md:px-7">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-[11.5px]" aria-label="FictionPub pipeline">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true" className="hidden h-px w-4 bg-line-2 sm:block" />}
              <span className={i === steps.length - 1 ? "text-ink" : "text-mute"}>{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <div ref={ref} className="px-5 py-6 md:px-7 md:py-8">
        <div className="flex items-baseline justify-between">
          <p className="label-mono">Each chapter checked before delivery</p>
        </div>
        <div className="relative mt-10">
          <div
            aria-hidden="true"
            className="absolute -bottom-2 -top-2 z-10 border-l border-dashed border-signal"
            style={{ left: `calc(76px + (100% - 184px) * ${GATE / 100})` }}
          >
            <span className="absolute -top-5 left-1.5 whitespace-nowrap font-mono text-[10.5px] text-signal-ink">{GATE}% quality gate</span>
          </div>
          <ul className="space-y-3">
            {chapters.map((v, i) => {
              const retry = i === RETRY;
              const final = retry ? RETRY_TO : v;
              return (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 font-mono text-[11px] text-mute">CH {String(i + 1).padStart(2, "0")}</span>
                  <div className="relative h-6 flex-1">
                    {retry && !reduce && (
                      <motion.span
                        className="absolute inset-y-0 left-0 origin-left rounded-[3px] border border-dashed border-mute-2"
                        style={{ width: `${v}%` }}
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: [0, 1, 1, 0.5] } : {}}
                        transition={{ duration: 2.2, times: [0, 0.2, 0.7, 1], delay: 0.6 }}
                      />
                    )}
                    <motion.span
                      className={`absolute inset-y-0 left-0 origin-left rounded-[3px] ${retry ? "bg-ink" : "bg-line-2"}`}
                      style={{ width: `${final}%` }}
                      initial={{ scaleX: 0 }}
                      animate={inView || reduce ? { scaleX: 1 } : {}}
                      transition={{ duration: 0.8, delay: retry ? 1.9 : 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <span className="w-24 shrink-0 text-right font-mono text-[10.5px] text-mute">{retry ? "regenerated" : "passed"}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="mt-6 text-[13.5px] leading-relaxed text-mute">
          A chapter that scores below the gate on creativity, coherence or pacing is rewritten automatically before the writer sees it.
        </p>
      </div>
    </figure>
  );
}
