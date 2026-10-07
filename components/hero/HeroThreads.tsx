"use client";

import { useEffect, useRef, type RefObject } from "react";
import { cn } from "@/lib/utils";

type Props = {
  /** Element the threads gather around (the hero illustration). Falls back to the right side of the hero. */
  anchorRef?: RefObject<HTMLElement | null>;
  color?: string;
  /** Secondary warm-grey strands, mixed in sparingly. */
  secondaryColor?: string;
  /** Base stroke opacity. Strands peak at ~1.7× this near the anchor. */
  opacity?: number;
  speed?: number;
  /** 0–1, scales the number of strands. */
  density?: number;
  interactive?: boolean;
  className?: string;
};

type Strand = {
  spread: number; // vertical offset away from the pinch, -1..1
  reach: number; // how far left the strand travels, as a fraction of the anchor's x
  amp: number;
  freqA: number;
  freqB: number;
  phase: number;
  drift: number;
  alpha: number;
  width: number;
  secondary: boolean;
};

const SEGMENTS = 72;
const MOUSE_RADIUS = 170;
const MOUSE_PUSH = 7;

// Deterministic so the composition is the same on every visit.
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function makeStrands(count: number): Strand[] {
  const r = rng(7);
  return Array.from({ length: count }, (_, i) => {
    const secondary = i % 4 === 3;
    return {
      spread: (i / Math.max(count - 1, 1)) * 2 - 1 + (r() - 0.5) * 0.18,
      reach: 0.3 + r() * 0.3,
      amp: 10 + r() * 22,
      freqA: 0.9 + r() * 1.1,
      freqB: 2.1 + r() * 1.6,
      phase: r() * Math.PI * 2,
      drift: 0.6 + r() * 0.8,
      alpha: secondary ? 0.55 + r() * 0.25 : 0.6 + r() * 0.4,
      width: r() > 0.8 ? 1.25 : 1,
      secondary,
    };
  });
}

function rgb(hex: string) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

/**
 * Slow, low-opacity strands that gather behind the hero illustration and thin out towards the copy.
 * Canvas 2D, driven entirely from refs: nothing here re-renders React per frame.
 */
export default function HeroThreads({
  anchorRef,
  color = "#735CFF",
  secondaryColor = "#7a7268",
  opacity = 0.1,
  speed = 0.15,
  density = 0.6,
  interactive = true,
  className,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const glow = glowRef.current;
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !glow || !ctx) return;

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerMq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const primary = rgb(color);
    const secondary = rgb(secondaryColor);

    let w = 0;
    let h = 0;
    let mobile = false;
    let anchor = { x: 0, y: 0, w: 0, h: 0 };
    let strands: Strand[] = [];
    let raf = 0;
    let visible = true;
    let last = 0;
    let time = 0;
    // Pointer target, smoothed position, and a 0–1 presence that eases in/out so nothing ever jumps.
    const mouse = { tx: -9999, ty: -9999, x: -9999, y: -9999, on: 0, target: 0 };

    const layout = () => {
      const rect = root.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      mobile = w < 768;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const a = anchorRef?.current?.getBoundingClientRect();
      anchor =
        a && a.width > 0
          ? { x: a.left - rect.left + a.width / 2, y: a.top - rect.top + a.height / 2, w: a.width, h: a.height }
          : { x: w * 0.72, y: h * 0.5, w: w * 0.5, h: h * 0.6 };

      const size = Math.min(anchor.w, anchor.h) * 1.1;
      glow.style.width = glow.style.height = `${size}px`;
      glow.style.transform = `translate(${anchor.x - size / 2}px, ${anchor.y - size / 2}px)`;

      const count = Math.round((mobile ? 8 : 18) * Math.min(Math.max(density, 0), 1)) || 1;
      if (count !== strands.length) strands = makeStrands(count);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const base = opacity * (mobile ? 0.7 : 1);
      // Capped by width so narrow, tall layouts keep a horizontal flow rather than near-vertical strands.
      const fan = Math.min(h * 0.36, anchor.h * 0.75, w * 0.32);
      const startX = w + 40;

      for (const s of strands) {
        const endX = anchor.x * (1 - s.reach) - (mobile ? w * 0.1 : 0);
        const span = startX - endX;
        // Where along the strand it passes the anchor: this is the pinch point.
        const tA = (startX - anchor.x) / span;
        const t0 = time * s.drift;

        ctx.beginPath();
        for (let i = 0; i <= SEGMENTS; i++) {
          const t = i / SEGMENTS;
          const x = startX - span * t;
          // Strands draw together through the illustration and loosen either side of it.
          const d = Math.abs(t - tA) / Math.max(tA, 1 - tA);
          const envelope = 0.22 + 0.78 * smooth(0, 1, d);
          const wave =
            Math.sin(t * s.freqA * Math.PI * 2 + s.phase + t0) * s.amp +
            Math.sin(t * s.freqB * Math.PI * 2 - s.phase * 0.7 + t0 * 0.63) * s.amp * 0.35;
          let y = anchor.y + s.spread * fan * envelope + wave * (0.35 + 0.65 * envelope);

          if (mouse.on > 0.001) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < MOUSE_RADIUS) {
              const f = 1 - dist / MOUSE_RADIUS;
              y += Math.sign(dy || 1) * f * f * MOUSE_PUSH * mouse.on;
            }
          }

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        // Brightest where the strand meets the illustration, gone by its far end.
        const peak = Math.min(base * 1.7, 0.2) * s.alpha;
        const rest = base * 0.7 * s.alpha;
        const rgbStr = s.secondary ? secondary : primary;
        const g = ctx.createLinearGradient(startX, 0, endX, 0);
        g.addColorStop(0, `rgba(${rgbStr}, ${rest})`);
        g.addColorStop(Math.min(Math.max(tA, 0.01), 0.99), `rgba(${rgbStr}, ${peak})`);
        g.addColorStop(1, `rgba(${rgbStr}, 0)`);
        ctx.strokeStyle = g;
        ctx.lineWidth = s.width;
        ctx.stroke();
      }
    };

    const animated = () => !reduceMq.matches;

    const frame = (now: number) => {
      raf = 0;
      if (!visible || !animated()) return;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      // Phones get ~30fps; the motion is slow enough that it reads the same.
      if (mobile && dt < 1 / 32 && last) {
        raf = requestAnimationFrame(frame);
        return;
      }
      last = now;
      time += dt * speed;

      mouse.on += (mouse.target - mouse.on) * 0.04;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;

      draw();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf || !visible || !animated()) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const refresh = () => {
      layout();
      draw();
      start();
    };

    const onPointer = (e: PointerEvent) => {
      if (!interactive || mobile || !pointerMq.matches) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (inside && mouse.target === 0) {
        mouse.x = x;
        mouse.y = y;
      }
      mouse.tx = x;
      mouse.ty = y;
      mouse.target = inside ? 1 : 0;
    };
    const onLeave = () => (mouse.target = 0);

    const ro = new ResizeObserver(refresh);
    ro.observe(root);
    if (anchorRef?.current) ro.observe(anchorRef.current);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(root);

    const onVisibility = () => (document.hidden ? stop() : start());
    const onMotion = () => (reduceMq.matches ? (stop(), draw()) : start());

    document.addEventListener("visibilitychange", onVisibility);
    reduceMq.addEventListener("change", onMotion);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    refresh();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMq.removeEventListener("change", onMotion);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [anchorRef, color, secondaryColor, opacity, speed, density, interactive]);

  return (
    <div ref={rootRef} aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      {/* Stacked layouts: calm above the illustration. Two-column: calm on the left, behind the copy. */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 h-full w-full [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,.15)_40%,black_62%,black_100%)] [mask-image:linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,.15)_40%,black_62%,black_100%)] xl:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,.15)_30%,black_65%,black_100%)] xl:[mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,.15)_30%,black_65%,black_100%)]"
      />
      <div
        ref={glowRef}
        className="absolute left-0 top-0 z-[1] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(113, 78, 255, 0.08), transparent 65%)" }}
      />
    </div>
  );
}
