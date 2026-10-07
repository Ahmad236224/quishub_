"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  /** Still frame matching the loop's first frame: shown while the video loads and to reduced-motion visitors. */
  poster: string;
  video: { webm?: string; mp4: string };
  alt: string;
  /** Keeps the subject in frame as the crop changes between breakpoints. */
  objectPosition?: string;
  /** Framing from the xl breakpoint up, where the media becomes a tall column. Defaults to objectPosition. */
  desktopObjectPosition?: string;
  className?: string;
};

const framing = "object-cover [object-position:var(--pos)] xl:[object-position:var(--pos-xl)]";

/** The hero's one visual: a muted, looping video over its own poster. No chrome, no card. */
export default function HeroMedia({ poster, video, alt, objectPosition = "center", desktopObjectPosition, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (mq.matches) v.pause();
      else v.play().catch(() => {});
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ "--pos": objectPosition, "--pos-xl": desktopObjectPosition ?? objectPosition } as React.CSSProperties}
    >
      <Image src={poster} alt={alt} fill priority sizes="(min-width: 1280px) 58vw, 100vw" className={framing} />
      <video
        ref={ref}
        className={cn("absolute inset-0 h-full w-full motion-reduce:hidden", framing)}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        aria-hidden
      >
        {video.webm && <source src={video.webm} type="video/webm" />}
        <source src={video.mp4} type="video/mp4" />
      </video>
    </div>
  );
}
