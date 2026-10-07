import Image from "next/image";
import { cn } from "@/lib/utils";

export default function QWatermark({ className }: { className?: string }) {
  return (
    <Image
      src="/images/brand/quishub-monogram.png"
      alt=""
      aria-hidden="true"
      width={135}
      height={165}
      className={cn(
        "pointer-events-none absolute -bottom-6 -right-6 h-40 w-40 select-none object-contain opacity-[0.05] saturate-[2.2] md:h-56 md:w-56",
        className
      )}
    />
  );
}
