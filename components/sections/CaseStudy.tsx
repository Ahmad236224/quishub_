"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect } from "react";
import SectionLabel from "@/components/ui/SectionLabel";

const metrics = [
  { value: 34, suffix: "%", label: "Drop in consultation time" },
  { value: 15, suffix: " min", label: "TAT improvement, Week 1" },
  { value: 1, suffix: " week", label: "Time to measurable impact" },
  { value: 0, suffix: "", label: "Extra staff needed" },
];

function AnimatedNumber({
  value,
  suffix,
  inView,
}: {
  value: number;
  suffix: string;
  inView: boolean;
}) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => {
    if (value % 1 !== 0) return v.toFixed(1);
    return Math.round(v).toString();
  });
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (inView) {
      const controls = animate(motionValue, value, {
        duration: 1.5,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [inView, motionValue, value]);

  return (
    <span className="text-[32px] font-bold text-quishub-black">
      <motion.span ref={ref}>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function CaseStudy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="section-white section-padding">
      <div className="container-content">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="text-center mb-10"
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.5, ease: "easeOut" }}>
            <SectionLabel variant="light">SUCCESS STORY</SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-quishub-black font-semibold tracking-heading"
            style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
          >
            Real results. Real Week 1.
          </motion.h2>
        </motion.div>

        <motion.div
          ref={containerRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="surface-card-strong grid grid-cols-1 gap-10 rounded-feature p-8 md:p-12 lg:grid-cols-2"
        >
          <div>
            <span className="text-sm text-quishub-muted">
              Healthcare - Kenya
            </span>
            <h3 className="mt-3 text-2xl font-semibold text-quishub-black leading-snug">
              How NurMed cut clinical consultation time by 34% in the first week.
            </h3>
            <p className="mt-4 text-quishub-muted text-sm leading-body">
              Doctors at Avenue Broadwalk General Practice were spending too
              long on documentation. We built NurMed, an AI clinical
              documentation platform that handles the typing so doctors
              don&apos;t have to. Average consultation time dropped from 44
              minutes to 29 in the first week after deployment.
            </p>
            <a
              href="/work"
              className="inline-flex items-center mt-5 text-quishub-black text-sm hover:underline cursor-pointer"
            >
              Read the full story {"->"}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="surface-subtle rounded-[10px] p-5"
              >
                <AnimatedNumber
                  value={metric.value}
                  suffix={metric.suffix}
                  inView={isInView}
                />
                <p className="mt-1 text-[13px] text-quishub-muted">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}


