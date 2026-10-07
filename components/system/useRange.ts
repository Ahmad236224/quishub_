"use client";

import { transform, useTransform, type MotionValue } from "framer-motion";

// Function-form mapping so framer keeps it on the JS thread; its accelerated
// scroll-timeline path mis-maps multi-stop ranges on targeted useScroll.
export function useRange(value: MotionValue<number>, input: number[], output: number[]) {
  const map = transform(input, output);
  return useTransform(value, (v: number) => map(v));
}
