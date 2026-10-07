import Image from "next/image";
import { cn } from "@/lib/utils";

/** Intrinsic size of the exported logo artwork (public/quishub-logo-*.png). */
const LOGO_W = 2135;
const LOGO_H = 685;
const LOGO_RATIO = LOGO_W / LOGO_H;

interface LogoProps {
  /** Sizing/layout classes. Height-based classes (e.g. `h-7 md:h-9`) are preferred. */
  className?: string;
  priority?: boolean;
  /** Fallback width in px, used only when `className` sets no height. */
  width?: number;
}

const imgClass = "h-full w-auto max-w-none object-contain select-none";

export default function Logo({ className, priority = false, width = 136 }: LogoProps) {
  const hasHeightClass = /(^|[\s:])h-/.test(className ?? "");

  return (
    <span
      className={cn("!inline-flex items-center shrink-0 w-auto", className)}
      style={hasHeightClass ? undefined : { height: Math.round(width / LOGO_RATIO) }}
    >
      {/* Dark ink wordmark — for light backgrounds */}
      <Image
        src="/quishub-logo-light.png"
        alt="Quishub"
        width={LOGO_W}
        height={LOGO_H}
        priority={priority}
        sizes="200px"
        className={cn(imgClass, "dark:hidden")}
      />
      {/* Light ink wordmark — for dark backgrounds */}
      <Image
        src="/quishub-logo-dark.png"
        alt=""
        aria-hidden="true"
        width={LOGO_W}
        height={LOGO_H}
        priority={priority}
        sizes="200px"
        className={cn(imgClass, "hidden dark:block")}
      />
    </span>
  );
}
