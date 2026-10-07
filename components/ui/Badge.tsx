import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export default function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "font-ui inline-flex items-center border border-quishub-border bg-quishub-surfaceAlt text-quishub-black text-xs uppercase tracking-[0.08em] font-medium px-3.5 py-1 rounded-full",
        className
      )}
    >
      {children}
    </span>
  );
}
