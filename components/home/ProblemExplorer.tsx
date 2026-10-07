"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FlowDiagram from "@/components/diagram/FlowDiagram";
import Label from "@/components/system/Label";
import ButtonLink from "@/components/system/ButtonLink";
import { problems, type Problem } from "@/lib/content/problems";
import { productBySlug } from "@/lib/content/work";
import { cn } from "@/lib/utils";

const DW = 280;

function Panel({ p }: { p: Problem }) {
  const related = p.related?.slug ? productBySlug[p.related.slug] : null;
  return (
    <motion.div
      key={p.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-lg border border-line bg-surface-2"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:divide-x sm:divide-line">
        <div className="px-5 pb-4 pt-5">
          <p className="label-mono">Before · by hand</p>
          <FlowDiagram className="mt-4" {...p.before} width={DW} title={`Before: ${p.question}`} />
        </div>
        <div className="border-t border-line px-5 pb-4 pt-5 sm:border-t-0">
          <p className="label-mono text-ink">After · as a system</p>
          <FlowDiagram className="mt-4" {...p.after} width={DW} title={`After: how Quishub would handle it`} />
        </div>
      </div>
      <div className="border-t border-line px-5 py-5 md:px-6">
        <p className="label-mono">What we build</p>
        <p className="mt-2 font-ui text-[19px] font-medium text-ink">{p.capability}</p>
        <p className="mt-2 max-w-[56ch] text-[15px] leading-relaxed text-ink-2">{p.what}</p>
        <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="max-w-[46ch] text-[14px] leading-relaxed text-mute">
            {related ? <span className="text-ink">{related.name}. </span> : p.related ? <span className="text-ink">From an audit. </span> : null}
            {p.related?.text ?? "A capability we build for clients; no public case study yet."}
          </p>
          {related ? (
            <ButtonLink href={`/work/${related.slug}`} variant="text" className="shrink-0 text-[14px]">
              See {related.name}
            </ButtonLink>
          ) : (
            <ButtonLink href={`/services#${p.anchor}`} variant="text" className="shrink-0 text-[14px]">
              How we do it
            </ButtonLink>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProblemExplorer() {
  const [active, setActive] = useState(problems[0].id);
  const current = problems.find((p) => p.id === active)!;

  return (
    <section className="py-24 md:py-36" aria-labelledby="problems-title">
      <div className="wrap">
        <Label index="02">Where we come in</Label>
        <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <h2 id="problems-title" className="max-w-[16ch] font-display text-display-lg font-semibold">
              What is slowing your business down?
            </h2>
            <p className="mt-5 max-w-[40ch] text-lede text-mute">Pick the one that sounds most like you.</p>

            <ul className="mt-12 border-t border-line">
              {problems.map((p, i) => {
                const on = p.id === active;
                return (
                  <li key={p.id} className="border-b border-line">
                    <button
                      type="button"
                      onClick={() => setActive(p.id)}
                      aria-expanded={on}
                      className={cn(
                        "group flex w-full items-baseline gap-5 py-5 text-left transition-colors duration-300 md:py-6",
                        on ? "text-ink" : "text-mute hover:text-ink"
                      )}
                    >
                      <span className={cn("font-mono text-[12px] transition-colors", on ? "text-signal" : "text-mute-2")}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 font-ui text-[clamp(1.25rem,2vw,1.75rem)] font-medium leading-snug tracking-[-0.015em]">
                        {p.question}
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "h-2 w-2 shrink-0 rounded-full transition-all duration-300",
                          on ? "bg-signal" : "bg-transparent ring-1 ring-line-2 group-hover:ring-ink"
                        )}
                      />
                    </button>
                    {/* Mobile: panel opens under its row */}
                    {on && (
                      <div className="pb-6 lg:hidden">
                        <Panel p={p} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="hidden lg:col-span-6 lg:block">
            <div className="sticky top-28" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <Panel key={current.id} p={current} />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
