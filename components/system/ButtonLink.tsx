import Link from "next/link";
import { cn } from "@/lib/utils";
import Arrow from "./Arrow";

type Variant = "primary" | "secondary" | "text";

const styles: Record<Variant, string> = {
  primary:
    "h-12 px-6 rounded-md bg-ink text-background hover:bg-ink-2 [&_svg]:transition-transform [&:hover_svg]:translate-x-0.5",
  secondary:
    "h-12 px-6 rounded-md border border-line-2 text-ink hover:border-ink [&_svg]:transition-transform [&:hover_svg]:translate-x-0.5",
  text: "text-ink link-draw pb-0.5 [&_svg]:transition-transform [&:hover_svg]:translate-x-1",
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  external?: boolean;
};

export default function ButtonLink({ href, children, variant = "primary", arrow = true, className, external }: Props) {
  const cls = cn(
    "group inline-flex items-center justify-center gap-2.5 whitespace-nowrap font-ui text-[15px] font-medium tracking-[-0.005em] transition-colors duration-200",
    styles[variant],
    className
  );
  const content = (
    <>
      <span>{children}</span>
      {arrow && <Arrow className={external ? "-rotate-45" : undefined} />}
    </>
  );
  if (external || href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <a href={href} className={cls} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}
