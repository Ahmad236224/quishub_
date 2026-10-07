"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ElectricLogo from "@/components/brand/ElectricLogo";
import { useReducedMotionSafe } from "@/components/system/useReducedMotionSafe";

// The Quishub mark, then one icon per service, then back to the mark. Service icons are from Lucide.
const sequence = [
  { label: "Quishub", src: "/favicon.svg" },
  { label: "Automation", src: "/images/services/cog.svg" },
  { label: "Healthcare", src: "/images/services/heart-pulse.svg" },
  { label: "Mobile apps", src: "/images/services/smartphone.svg" },
  { label: "Workflows", src: "/images/services/workflow.svg" },
  { label: "AI systems", src: "/images/services/brain-circuit.svg" },
  { label: "Custom software", src: "/images/services/code-xml.svg" },
  { label: "Integrations", src: "/images/services/cable.svg" },
];

const HOLD_MS = 2800;
const MORPH_MS = 1200;

export default function HeroLogoCycle() {
  const reduce = useReducedMotionSafe();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % sequence.length), HOLD_MS + MORPH_MS);
    return () => clearInterval(id);
  }, [reduce]);

  const current = sequence[index];

  return (
    <div className="absolute inset-0">
      <ElectricLogo
        src={current.src}
        color="#ecc7ff"
        glowColor="#ad6dff"
        scale={0.7}
        strands={4}
        bend={0.6}
        crackle={1.5}
        arcs={1}
        speed={2.5}
        interactive
        intensity={1}
        glow={1}
        thickness={1.5}
        flicker={0.6}
        fill={0}
        cursorIntensity={0.75}
        cursorRadius={100}
        morphMs={MORPH_MS}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={current.label}
            className="label-mono text-ink"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
          >
            {current.label}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
