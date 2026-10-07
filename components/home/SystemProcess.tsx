"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { useRange } from "@/components/system/useRange";
import { useReducedMotionSafe } from "@/components/system/useReducedMotionSafe";
import Label from "@/components/system/Label";
import { cn } from "@/lib/utils";

const steps = [
  { name: "Understand", text: "We sit with the people doing the work and watch how it actually runs." },
  { name: "Map", text: "We draw the current workflow: every hand-off, spreadsheet and exception." },
  { name: "Build", text: "We build the smallest system that removes the most manual work." },
  { name: "Test", text: "Real data and real edge cases, before anyone depends on it." },
  { name: "Ship", text: "Live in production, with monitoring from day one." },
  { name: "Improve", text: "We keep measuring, and take on the next thing that still needs a person." },
];

export default function SystemProcess({ index = "04" }: { index?: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const progress = useRange(scrollYProgress, [0, 1], [reduce ? 1 : 0, 1]);

  return (
    <section aria-labelledby="process-title" className="border-t border-line py-24 md:py-36">
      <div className="wrap">
        <Label index={index || undefined}>How we work</Label>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
          <h2 id="process-title" className="max-w-[18ch] font-display text-display-xl font-semibold lg:col-span-8">
            Before we build anything, we map what happens today.
          </h2>
          <p className="max-w-[40ch] text-lede text-mute lg:col-span-4 lg:self-end">
            The spreadsheet nobody mentions. The approval that only happens on WhatsApp. We find those first, because that is where the real system lives.
          </p>
        </div>

        <ol ref={ref} className="relative mt-16 grid grid-cols-1 gap-0 md:mt-24 md:grid-cols-6 md:gap-6">
          {/* Rail: horizontal on desktop, vertical on mobile */}
          <span aria-hidden="true" className="absolute left-[4px] top-[4px] hidden h-px w-[calc(100%-8px)] bg-line-2 md:block" />
          <motion.span
            aria-hidden="true"
            className="absolute left-[4px] top-[4px] hidden h-px w-[calc(100%-8px)] origin-left bg-ink md:block"
            style={{ scaleX: progress }}
          />
          <span aria-hidden="true" className="absolute bottom-6 left-[4px] top-2 w-px bg-line-2 md:hidden" />
          <motion.span
            aria-hidden="true"
            className="absolute bottom-6 left-[4px] top-2 w-px origin-top bg-ink md:hidden"
            style={{ scaleY: progress }}
          />

          {steps.map((s, i) => {
            const key = s.name === "Map";
            return (
              <li key={s.name} className="relative pb-10 pl-8 md:pb-0 md:pl-0">
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-0 top-[4px] h-[9px] w-[9px] rounded-full border md:relative md:top-auto md:block",
                    key ? "border-signal bg-signal" : "border-ink bg-background"
                  )}
                />
                <p className="font-mono text-[11.5px] text-mute md:mt-6">{String(i + 1).padStart(2, "0")}</p>
                <p className={cn("mt-2 font-ui text-[24px] font-medium tracking-[-0.015em]", key && "text-signal-ink")}>{s.name}</p>
                <p className="mt-3 max-w-[30ch] text-[15px] leading-relaxed text-mute">{s.text}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
