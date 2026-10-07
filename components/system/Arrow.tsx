import { cn } from "@/lib/utils";

export default function Arrow({ className, direction = "right" }: { className?: string; direction?: "right" | "down" | "up-right" }) {
  const rotate = direction === "down" ? "rotate-90" : direction === "up-right" ? "-rotate-45" : "";
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("inline-block h-[0.9em] w-[0.9em] shrink-0", rotate, className)}
    >
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}
