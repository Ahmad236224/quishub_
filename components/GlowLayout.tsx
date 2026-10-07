"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowLayoutProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export default function GlowLayout({
  children,
  className,
  contentClassName,
}: GlowLayoutProps) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden bg-[rgb(var(--quishub-light-rgb))]",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(229,229,228,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(229,229,228,0.03) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-[-10%] h-72 w-72 rounded-full md:h-[28rem] md:w-[28rem]"
        style={{
          background:
            "radial-gradient(circle, rgba(37,99,235,0.32) 0%, rgba(37,99,235,0.12) 35%, rgba(37,99,235,0) 70%)",
          filter: "blur(22px)",
        }}
        animate={{
          x: [0, 80, -10, 0],
          y: [0, 30, 80, 0],
          scale: [1, 1.08, 0.96, 1],
        }}
        transition={{
          duration: 18,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-[-12%] h-80 w-80 rounded-full md:h-[30rem] md:w-[30rem]"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.28) 0%, rgba(124,58,237,0.1) 38%, rgba(124,58,237,0) 72%)",
          filter: "blur(22px)",
        }}
        animate={{
          x: [0, -70, 15, 0],
          y: [0, -40, -10, 0],
          scale: [1, 0.94, 1.06, 1],
        }}
        transition={{
          duration: 20,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      <div className={cn("relative z-10", contentClassName)}>{children}</div>
    </section>
  );
}
