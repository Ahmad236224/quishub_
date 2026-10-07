"use client";

import { useEffect, useState } from "react";

// Always false on the server and first client render, so markup hydrates cleanly.
export function useReducedMotionSafe() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(m.matches);
    sync();
    m.addEventListener("change", sync);
    return () => m.removeEventListener("change", sync);
  }, []);
  return reduce;
}
