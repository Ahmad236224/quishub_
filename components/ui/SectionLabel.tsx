import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  variant?: "dark" | "light";
  className?: string;
}

export default function SectionLabel({
  children,
  variant = "dark",
  className,
}: SectionLabelProps) {
  return (
    <span
      className={cn(
        "font-ui inline-flex items-center text-[11px] uppercase font-bold tracking-label-wide px-3.5 py-1.5 rounded-full mb-4 shadow-sm transition-colors duration-200",
        "surface-chip text-quishub-black",
        className
      )}
    >
      {children}
    </span>
  );
}
