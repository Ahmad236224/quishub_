"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * "Connected business system": separate tools drift apart, signal paths draw them into one core,
 * the system runs for a while, then lets go. One seamless loop, drawn on a single 2D canvas from refs.
 *
 * Depth, back to front: faint orbit guides → rings behind the core → signal paths → core → rings in
 * front → tool panels → pulses → a few sharp foreground marks. Each layer gets its own parallax.
 */

type Glyph = "crm" | "email" | "calls" | "docs" | "schedule" | "payments" | "software" | "data";

// Positions are in units of the scene size S, relative to the core. z (-1..1) sets scale, opacity and parallax.
const MODULES: { glyph: Glyph; x: number; y: number; z: number; w: number; h: number }[] = [
  { glyph: "crm", x: -0.56, y: -0.27, z: 0.2, w: 80, h: 50 },
  { glyph: "email", x: -0.17, y: -0.53, z: -0.4, w: 62, h: 44 },
  { glyph: "calls", x: 0.31, y: -0.45, z: 0.5, w: 48, h: 48 },
  { glyph: "docs", x: 0.6, y: -0.07, z: -0.2, w: 52, h: 64 },
  { glyph: "schedule", x: 0.47, y: 0.35, z: 0.3, w: 72, h: 52 },
  { glyph: "payments", x: 0.07, y: 0.53, z: -0.5, w: 78, h: 48 },
  { glyph: "software", x: -0.38, y: 0.41, z: 0.6, w: 86, h: 56 },
  { glyph: "data", x: -0.63, y: 0.07, z: -0.3, w: 60, h: 48 },
];
const MOBILE_MODULES = [0, 2, 3, 4, 5, 6];

const RINGS = [
  { r: 0.16, tilt: 0.62, rot: -0.35, rgb: "24, 17, 31", a: 0.3, highlight: false, ticks: false },
  { r: 0.225, tilt: 0.5, rot: 0.85, rgb: "124, 92, 252", a: 0.4, highlight: true, ticks: false },
  { r: 0.3, tilt: 0.42, rot: 2.1, rgb: "24, 17, 31", a: 0.2, highlight: false, ticks: true },
];

const FOREGROUND = [
  { x: -0.31, y: -0.12, kind: "node" },
  { x: 0.27, y: 0.2, kind: "node" },
  { x: 0.6, y: -0.62, kind: "pill" },
  { x: -0.14, y: 0.68, kind: "node" },
] as const;

const PLUM = "24, 17, 31";
const VIOLET = "124, 92, 252";
const INDIGO = "108, 92, 231";
const LILAC = "162, 107, 255";

// Loop length, and the resting frame shown when motion is reduced (fully connected, system running).
const LOOP = 18;
const STILL_AT = 11.2;

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

type Pt = { x: number; y: number };

function bez(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return { x: a * p0.x + b * p1.x + c * p2.x + d * p3.x, y: a * p0.y + b * p1.y + c * p2.y + d * p3.y };
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

// Minimal interface fragments: a hint of each tool, never a label.
function drawGlyph(ctx: CanvasRenderingContext2D, g: Glyph, w: number, h: number) {
  const ink = `rgba(${PLUM}, 0.5)`;
  const faint = `rgba(${PLUM}, 0.14)`;
  const accent = `rgba(${VIOLET}, 0.9)`;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = ink;
  ctx.fillStyle = faint;

  switch (g) {
    case "crm": {
      ctx.beginPath();
      ctx.arc(17, h / 2, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.lineWidth = 2.4;
      line(ctx, 32, h / 2 - 5, 64, h / 2 - 5);
      ctx.strokeStyle = faint;
      line(ctx, 32, h / 2 + 4, 52, h / 2 + 4);
      break;
    }
    case "email": {
      roundRect(ctx, 15, 12, w - 30, h - 24, 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(16, 13);
      ctx.lineTo(w / 2, h / 2 + 1);
      ctx.lineTo(w - 16, 13);
      ctx.stroke();
      break;
    }
    case "calls": {
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(${PLUM}, 0.32)`;
      for (const r of [9, 14]) {
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, r, -0.75, 0.75);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, r, Math.PI - 0.75, Math.PI + 0.75);
        ctx.stroke();
      }
      break;
    }
    case "docs": {
      ctx.beginPath();
      ctx.moveTo(14, 11);
      ctx.lineTo(w - 22, 11);
      ctx.lineTo(w - 14, 19);
      ctx.lineTo(w - 14, h - 11);
      ctx.lineTo(14, h - 11);
      ctx.closePath();
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.strokeStyle = faint;
      for (const [y, len] of [[26, 18], [33, 22], [40, 14], [47, 20]]) line(ctx, 19, y, 19 + len, y);
      break;
    }
    case "schedule": {
      ctx.lineWidth = 2;
      ctx.strokeStyle = faint;
      line(ctx, 14, 14, w - 14, 14);
      for (let r = 0; r < 2; r++)
        for (let c = 0; c < 5; c++) {
          ctx.fillStyle = r === 1 && c === 2 ? accent : faint;
          roundRect(ctx, 14 + c * 9.5, 22 + r * 9.5, 6.5, 6.5, 1.5);
          ctx.fill();
        }
      break;
    }
    case "payments": {
      ctx.fillStyle = faint;
      ctx.fillRect(10, 13, w - 20, 5);
      roundRect(ctx, 16, 25, 11, 8, 1.5);
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.strokeStyle = faint;
      line(ctx, w - 36, 34, w - 16, 34);
      break;
    }
    case "software": {
      ctx.fillStyle = `rgba(${PLUM}, 0.28)`;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(14 + i * 6, 12, 1.7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = faint;
      line(ctx, 8, 19, w - 8, 19);
      ctx.fillStyle = faint;
      ctx.fillRect(12, 24, 14, h - 34);
      ctx.lineWidth = 2;
      ctx.strokeStyle = ink;
      line(ctx, 33, 28, 60, 28);
      ctx.strokeStyle = faint;
      line(ctx, 33, 35, 72, 35);
      line(ctx, 33, 42, 54, 42);
      break;
    }
    case "data": {
      const bars = [10, 17, 13, 23];
      bars.forEach((bh, i) => {
        ctx.fillStyle = i === bars.length - 1 ? accent : faint;
        roundRect(ctx, 15 + i * 9, h - 12 - bh, 5.5, bh, 1.5);
        ctx.fill();
      });
      break;
    }
  }
}

const PAD = 20;

function makeSprite(g: Glyph, w: number, h: number, k: number) {
  const c = document.createElement("canvas");
  c.width = Math.ceil((w + PAD * 2) * k);
  c.height = Math.ceil((h + PAD * 2) * k);
  const ctx = c.getContext("2d")!;
  ctx.scale(k, k);
  ctx.translate(PAD, PAD);

  ctx.save();
  ctx.shadowColor = `rgba(${PLUM}, 0.1)`;
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;
  roundRect(ctx, 0, 0, w, h, 10);
  ctx.fillStyle = "rgba(252, 251, 249, 0.94)";
  ctx.fill();
  ctx.restore();

  roundRect(ctx, 0.5, 0.5, w - 1, h - 1, 9.5);
  ctx.strokeStyle = `rgba(${PLUM}, 0.1)`;
  ctx.lineWidth = 1;
  ctx.stroke();

  drawGlyph(ctx, g, w, h);
  return c;
}

export default function ConnectedSystem({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const column = root?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !column || !ctx) return;

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerMq = window.matchMedia("(hover: hover) and (pointer: fine)");

    let w = 0;
    let h = 0;
    let S = 1;
    let reach = 1; // tools sit closer in on the two-column layout so the right edge never clips them
    let unit = 1; // panel scale: S relative to the 600px design size
    let dpr = 1;
    let compact = false;
    let wide = false;
    let center: Pt = { x: 0, y: 0 };
    let modules: (typeof MODULES)[number][] = [];
    let sprites: HTMLCanvasElement[] = [];
    let raf = 0;
    let visible = true;
    let last = 0;
    let time = 1; // start just before the tools begin to connect
    const mouse = { tx: 0, ty: 0, x: 0, y: 0 };

    const layout = () => {
      const r = root.getBoundingClientRect();
      const col = column.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      wide = window.innerWidth >= 1280;
      compact = window.innerWidth < 768;
      // Two-column: sit slightly right of the column centre so the weight falls towards the edge.
      center = {
        x: col.left - r.left + col.width * (wide ? 0.55 : 0.5),
        y: col.top - r.top + col.height * 0.5,
      };
      S = wide ? Math.min(col.width * 0.92, col.height) : Math.min(col.width / 1.45, col.height / 1.25);
      unit = Math.min(Math.max(S / 600, 0.62), 1.08);
      reach = wide ? 0.85 : 1;

      modules = compact ? MOBILE_MODULES.map((i) => MODULES[i]) : MODULES;
      sprites = modules.map((m) => makeSprite(m.glyph, m.w, m.h, unit * dpr));
    };

    const draw = (t: number) => {
      const u = ((t % LOOP) + LOOP) % LOOP;
      const sys = smooth(7.5, 9.5, u) * (1 - smooth(14, 16, u));
      const breath = 0.5 + 0.5 * Math.sin(t * ((Math.PI * 2) / 6));
      const segs = compact ? 48 : 72;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const px = (depth: number): Pt => ({ x: mouse.x * depth, y: mouse.y * depth });
      const main = px(5);
      const c = { x: center.x + mouse.x * 6, y: center.y + mouse.y * 6 };

      // Layer 1: faint orbit guides.
      const bg = px(2.5);
      ctx.save();
      ctx.setLineDash([2, 7]);
      ctx.lineDashOffset = -t * 2;
      ctx.lineWidth = 1;
      for (const [rr, a] of [[0.5, 0.08], [0.76, 0.055]] as const) {
        ctx.strokeStyle = `rgba(${PLUM}, ${a})`;
        ctx.beginPath();
        ctx.ellipse(center.x + bg.x, center.y + bg.y, rr * S, rr * S * 0.8, -0.22, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // Soft light under the system; brighter while it runs.
      const glow = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, S * 0.46);
      glow.addColorStop(0, `rgba(${VIOLET}, ${0.13 + 0.07 * sys + 0.03 * breath})`);
      glow.addColorStop(0.45, `rgba(${VIOLET}, ${0.045 + 0.02 * sys})`);
      glow.addColorStop(1, `rgba(${VIOLET}, 0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(c.x - S * 0.5, c.y - S * 0.5, S, S);

      // Rings, projected from 3D; split so the core sits between their back and front halves.
      const ringPass = (front: boolean) => {
        RINGS.forEach((ring, k) => {
          const R = ring.r * S;
          const tilt = ring.tilt + 0.07 * Math.sin(t * 0.18 + k * 2.1);
          const rot = ring.rot + t * (k % 2 ? -0.012 : 0.009);
          const ct = Math.cos(tilt);
          const st = Math.sin(tilt);
          const cr = Math.cos(rot);
          const sr = Math.sin(rot);
          const project = (theta: number, scale = 1) => {
            const x = R * scale * Math.cos(theta);
            const y0 = R * scale * Math.sin(theta);
            const y = y0 * ct;
            const z = y0 * st;
            return { x: c.x + x * cr - y * sr, y: c.y + x * sr + y * cr, z: z / R };
          };

          ctx.lineWidth = 1;
          for (let i = 0; i < segs; i++) {
            const a0 = (i / segs) * Math.PI * 2;
            const a1 = ((i + 1) / segs) * Math.PI * 2;
            const p0 = project(a0);
            const p1 = project(a1);
            const zm = (p0.z + p1.z) / 2;
            if (zm >= 0 !== front) continue;
            ctx.strokeStyle = `rgba(${ring.rgb}, ${ring.a * (0.35 + 0.65 * (zm + 1) * 0.5)})`;
            line(ctx, p0.x, p0.y, p1.x, p1.y);
          }

          if (ring.ticks) {
            const spin = t * 0.02;
            for (let i = 0; i < 36; i++) {
              const th = (i / 36) * Math.PI * 2 + spin;
              const a = project(th);
              if (a.z >= 0 !== front) continue;
              const b = project(th, i % 3 === 0 ? 1.07 : 1.035);
              ctx.strokeStyle = `rgba(${PLUM}, ${0.2 * (0.35 + 0.65 * (a.z + 1) * 0.5)})`;
              line(ctx, a.x, a.y, b.x, b.y);
            }
          }

          if (ring.highlight) {
            // A brighter arc travels the ring: the system "thinking".
            const start = t * 0.32;
            const len = 0.8;
            ctx.lineWidth = 1.8;
            ctx.lineCap = "round";
            for (let i = 0; i < 16; i++) {
              const a0 = start + (i / 16) * len;
              const a1 = start + ((i + 1) / 16) * len;
              const p0 = project(a0);
              const p1 = project(a1);
              const zm = (p0.z + p1.z) / 2;
              if (zm >= 0 !== front) continue;
              const fade = Math.sin((i / 16) * Math.PI);
              ctx.strokeStyle = `rgba(${LILAC}, ${fade * (0.35 + 0.45 * sys) * (0.3 + 0.7 * (zm + 1) * 0.5)})`;
              line(ctx, p0.x, p0.y, p1.x, p1.y);
            }
            ctx.lineCap = "butt";
          }
        });
      };

      ringPass(false);

      // Module positions and connection state.
      const coreR = S * 0.078;
      const placed = modules.map((m, i) => {
        const rise = 2.4 + i * 0.55;
        const fall = 14.4 + i * 0.25;
        const conn = smooth(rise, rise + 1.7, u) * (1 - smooth(fall, fall + 1.4, u));
        const spread = (1.08 - 0.08 * conn) * reach;
        const depth = 1 + m.z * 0.6;
        return {
          m,
          i,
          conn,
          scale: 1 + m.z * 0.08,
          alpha: Math.min(0.8 + m.z * 0.2, 1),
          x: center.x + m.x * S * spread + Math.sin(t * 0.13 + i * 1.7) * 6 + main.x * depth,
          y: center.y + m.y * S * spread + Math.cos(t * 0.11 + i * 2.3) * 5 + main.y * depth,
        };
      });

      // Paths from each tool into the core, all curving the same way so the system reads as one motion.
      const paths = placed.map((p) => {
        const dx = c.x - p.x;
        const dy = c.y - p.y;
        const len = Math.hypot(dx, dy);
        const nx = dx / len;
        const ny = dy / len;
        const end = { x: c.x - nx * coreR * 1.3, y: c.y - ny * coreR * 1.3 };
        const bend = len * 0.13;
        const p0 = { x: p.x, y: p.y };
        const p1 = { x: p.x + dx * 0.35 - ny * bend, y: p.y + dy * 0.35 + nx * bend };
        const p2 = { x: p.x + dx * 0.75 - ny * bend * 0.3, y: p.y + dy * 0.75 + nx * bend * 0.3 };
        return [p0, p1, p2, end] as const;
      });

      paths.forEach(([p0, p1, p2, p3], i) => {
        const conn = placed[i].conn;
        if (conn < 0.005) return;
        const grad = ctx.createLinearGradient(p0.x, p0.y, p3.x, p3.y);
        grad.addColorStop(0, `rgba(${PLUM}, ${0.12 * conn})`);
        grad.addColorStop(1, `rgba(${INDIGO}, ${(0.38 + 0.12 * sys) * conn})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        const n = Math.max(2, Math.ceil(36 * conn));
        for (let s = 0; s <= n; s++) {
          const q = bez(p0, p1, p2, p3, (s / n) * conn);
          if (s === 0) ctx.moveTo(q.x, q.y);
          else ctx.lineTo(q.x, q.y);
        }
        ctx.stroke();
      });

      // Neighbouring tools link up once the system is running: the connected workflow around the core.
      const ring = [...placed].sort((a, b) => Math.atan2(a.y - c.y, a.x - c.x) - Math.atan2(b.y - c.y, b.x - c.x));
      const links = ring.map((a, k) => {
        const b = ring[(k + 1) % ring.length];
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        const ctl = { x: c.x + (mx - c.x) * 1.22, y: c.y + (my - c.y) * 1.22 };
        return { a, b, ctl };
      });
      if (sys > 0.005) {
        ctx.lineWidth = 1;
        for (const { a, b, ctl } of links) {
          ctx.strokeStyle = `rgba(${INDIGO}, ${0.16 * sys})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.quadraticCurveTo(ctl.x, ctl.y, b.x, b.y);
          ctx.stroke();
        }
      }

      // Core: a dark lens with light inside.
      const core = ctx.createRadialGradient(c.x - coreR * 0.35, c.y - coreR * 0.4, 0, c.x, c.y, coreR);
      core.addColorStop(0, "#3b2a5e");
      core.addColorStop(0.6, "#231833");
      core.addColorStop(1, "#18111f");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(c.x, c.y, coreR, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${VIOLET}, ${0.45 + 0.25 * sys})`;
      ctx.stroke();
      ctx.strokeStyle = `rgba(${LILAC}, ${0.22 + 0.15 * breath})`;
      ctx.beginPath();
      ctx.arc(c.x, c.y, coreR * 0.64, 0, Math.PI * 2);
      ctx.stroke();
      const lightR = coreR * 0.58 * (0.9 + 0.1 * breath) * (1 + 0.25 * sys);
      const light = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, lightR);
      light.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      light.addColorStop(0.28, `rgba(214, 190, 255, ${0.75 + 0.2 * sys})`);
      light.addColorStop(1, `rgba(${VIOLET}, 0)`);
      ctx.fillStyle = light;
      ctx.beginPath();
      ctx.arc(c.x, c.y, lightR, 0, Math.PI * 2);
      ctx.fill();

      ringPass(true);

      // Tool panels, back to front.
      [...placed]
        .sort((a, b) => a.m.z - b.m.z)
        .forEach((p) => {
          const img = sprites[p.i];
          const dw = (img.width / dpr) * p.scale;
          const dh = (img.height / dpr) * p.scale;
          ctx.globalAlpha = p.alpha;
          ctx.drawImage(img, p.x - dw / 2, p.y - dh / 2, dw, dh);
          ctx.globalAlpha = 1;
          // Status light: on once the tool is part of the system.
          if (p.conn > 0.01) {
            const sx = p.x + (p.m.w / 2 - 7) * unit * p.scale;
            const sy = p.y - (p.m.h / 2 - 7) * unit * p.scale;
            ctx.fillStyle = `rgba(${VIOLET}, ${0.9 * p.conn})`;
            ctx.beginPath();
            ctx.arc(sx, sy, 2.4 * unit, 0, Math.PI * 2);
            ctx.fill();
          }
        });

      // Pulses: work moving into the system, and results moving back out.
      const pulse = (pt: Pt, a: number, r: number) => {
        const g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, r * 4);
        g.addColorStop(0, `rgba(${VIOLET}, ${0.35 * a})`);
        g.addColorStop(1, `rgba(${VIOLET}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${VIOLET}, ${a})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
        ctx.fill();
      };

      paths.forEach(([p0, p1, p2, p3], i) => {
        const conn = placed[i].conn;
        if (conn < 0.9) return;
        const period = 2.8 + i * 0.27;
        let q = (t / period + i * 0.37) % 1;
        if (i % 3 === 1) q = 1 - q; // outbound
        const a = (conn - 0.9) * 10 * Math.sin(Math.PI * q) * (0.45 + 0.55 * sys);
        for (let s = 5; s >= 1; s--) {
          const tq = q - (i % 3 === 1 ? -1 : 1) * s * 0.014;
          if (tq < 0 || tq > 1) continue;
          const pt = bez(p0, p1, p2, p3, tq);
          ctx.fillStyle = `rgba(${VIOLET}, ${a * 0.35 * (1 - s / 6)})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.3, 0, Math.PI * 2);
          ctx.fill();
        }
        pulse(bez(p0, p1, p2, p3, q), a, 1.8);
      });

      // Occasionally a signal passes directly between two tools.
      if (sys > 0.005) {
        links.forEach(({ a, b, ctl }, k) => {
          if (k % 2) return;
          const q = (t / 5.5 + k * 0.29) % 1;
          const s = 1 - q;
          const pt = {
            x: s * s * a.x + 2 * s * q * ctl.x + q * q * b.x,
            y: s * s * a.y + 2 * s * q * ctl.y + q * q * b.y,
          };
          pulse(pt, sys * Math.sin(Math.PI * q) * 0.8, 1.5);
        });
      }

      // Layer 3: a few sharp marks close to the viewer.
      const fg = px(8);
      FOREGROUND.forEach((f, i) => {
        if (compact && i === 2) return;
        const x = center.x + f.x * S * reach + fg.x + Math.sin(t * 0.09 + i * 2) * 8;
        const y = center.y + f.y * S * reach + fg.y + Math.cos(t * 0.1 + i) * 6;
        if (f.kind === "node") {
          ctx.lineWidth = 1;
          ctx.strokeStyle = `rgba(${PLUM}, 0.42)`;
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = `rgba(${VIOLET}, ${0.5 + 0.4 * Math.sin(t * 0.8 + i * 1.9) ** 2})`;
          ctx.beginPath();
          ctx.arc(x, y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const pw = 34 * unit;
          const ph = 12 * unit;
          roundRect(ctx, x - pw / 2, y - ph / 2, pw, ph, ph / 2);
          ctx.fillStyle = "rgba(252, 251, 249, 0.96)";
          ctx.fill();
          ctx.strokeStyle = `rgba(${PLUM}, 0.16)`;
          ctx.stroke();
          ctx.fillStyle = `rgba(${VIOLET}, ${0.4 + 0.5 * sys})`;
          ctx.beginPath();
          ctx.arc(x - pw / 2 + ph / 2, y, 2.2 * unit, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = `rgba(${PLUM}, 0.3)`;
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          line(ctx, x - pw / 2 + ph, y, x + pw / 2 - ph / 2, y);
          ctx.lineCap = "butt";
        }
      });
    };

    const animated = () => !reduceMq.matches;

    const frame = (now: number) => {
      raf = 0;
      if (!visible || !animated()) return;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      if (compact && last && dt < 1 / 32) {
        raf = requestAnimationFrame(frame);
        return;
      }
      last = now;
      time += dt;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      draw(time);
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
    const still = () => draw(animated() ? time : STILL_AT);

    const refresh = () => {
      layout();
      still();
      start();
    };

    const onPointer = (e: PointerEvent) => {
      if (!wide || !pointerMq.matches) return;
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const ro = new ResizeObserver(refresh);
    ro.observe(root);
    ro.observe(column);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(root);

    const onVisibility = () => (document.hidden ? stop() : start());
    const onMotion = () => (reduceMq.matches ? (stop(), still()) : start());

    document.addEventListener("visibilitychange", onVisibility);
    reduceMq.addEventListener("change", onMotion);
    window.addEventListener("pointermove", onPointer, { passive: true });

    refresh();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMq.removeEventListener("change", onMotion);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-y-[-8%] -left-5 -right-5 sm:-left-7 sm:-right-7 lg:-left-12 lg:-right-12",
        // Stacked layouts: feather every edge. Two-column: bleed to the viewport edge and dissolve towards the copy.
        "[-webkit-mask-image:radial-gradient(ellipse_62%_56%_at_50%_50%,black_62%,transparent_100%)] [mask-image:radial-gradient(ellipse_62%_56%_at_50%_50%,black_62%,transparent_100%)]",
        "xl:-left-[14%] xl:right-[calc(-1*max(48px,50vw_-_var(--container)/2_+_48px))]",
        "xl:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,.4)_12%,black_30%,black_100%)] xl:[mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,.4)_12%,black_30%,black_100%)]",
        className
      )}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
