"use client";

import { ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface OctacsThemeProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export default function OctacsTheme({
  children,
  className,
  contentClassName,
}: OctacsThemeProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const blueRef = useRef<HTMLDivElement>(null);
  const purpleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y > 1400) return;

      const gridYVal = Math.max(-32, Math.min(0, (y / 1200) * -32));
      const blueYVal = Math.max(-58, Math.min(0, (y / 1400) * -58));
      const purpleYVal = Math.max(-42, Math.min(0, (y / 1400) * -42));

      if (gridRef.current) gridRef.current.style.transform = `translate3d(0, ${gridYVal}px, 0)`;
      if (blueRef.current) blueRef.current.style.transform = `translate3d(0, ${blueYVal}px, 0)`;
      if (purpleRef.current) purpleRef.current.style.transform = `translate3d(0, ${purpleYVal}px, 0)`;
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "relative min-h-screen text-[rgb(var(--quishub-black-rgb))]",
        className
      )}
    >
      <div className="fixed inset-0 w-full min-h-screen overflow-hidden pointer-events-none -z-10">
        <div ref={gridRef} className="absolute inset-0 opacity-20" style={{ willChange: "transform" }}>
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(var(--octacs-grid-rgb), var(--octacs-grid-opacity)) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--octacs-grid-rgb), var(--octacs-grid-opacity)) 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />
        </div>

        <div
          ref={blueRef}
          className="octacs-nebula-blue absolute -left-24 top-[-10rem] h-[18rem] w-[18rem] rounded-full blur-[150px] md:-left-28 md:h-[34rem] md:w-[34rem] md:blur-[200px] mix-blend-screen"
          style={{ willChange: "transform" }}
        />
        <div
          ref={purpleRef}
          className="octacs-nebula-purple absolute -right-20 bottom-[-12rem] h-[16rem] w-[16rem] rounded-full blur-[150px] md:-right-24 md:h-[32rem] md:w-[32rem] md:blur-[200px] mix-blend-screen"
          style={{ willChange: "transform" }}
        />
      </div>

      <div className={cn("relative z-10", contentClassName)}>{children}</div>
    </div>
  );
}
