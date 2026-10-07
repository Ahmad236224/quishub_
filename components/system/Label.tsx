import { cn } from "@/lib/utils";

export default function Label({
  children,
  index,
  className,
  as: Tag = "p",
}: {
  children: React.ReactNode;
  index?: string;
  className?: string;
  as?: "p" | "span" | "h2" | "h3";
}) {
  return (
    <Tag className={cn("label-mono flex items-center gap-3", className)}>
      {index && <span className="text-ink">{index}</span>}
      {index && <span aria-hidden="true" className="h-px w-6 bg-line-2" />}
      <span>{children}</span>
    </Tag>
  );
}
