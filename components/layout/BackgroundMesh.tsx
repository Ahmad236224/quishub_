"use client";

import { usePathname } from "next/navigation";

export default function BackgroundMesh() {
  const pathname = usePathname();

  // The blog wants a flat Platinum canvas, not the dotted mesh texture.
  if (pathname.startsWith("/blog") || pathname.startsWith("/studio")) return null;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, color-mix(in oklab, var(--ink) 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--ink) 6%, transparent) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black 30%, transparent 75%)",
          maskImage: "radial-gradient(ellipse at 50% 30%, black 30%, transparent 75%)",
        }}
      />
    </div>
  );
}
