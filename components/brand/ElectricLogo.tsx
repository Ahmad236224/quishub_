"use client";

import { useEffect, useRef } from "react";

type ElectricLogoProps = {
  /** SVG or raster image; its opaque pixels define the outline the current runs along. */
  src: string;
  color?: string;
  glowColor?: string;
  /** Logo size relative to the container (0–1). */
  scale?: number;
  /** Number of overlapping current strands per outline. */
  strands?: number;
  /** How far strands wander from the outline. */
  bend?: number;
  /** High-frequency jitter. */
  crackle?: number;
  /** How often arcs jump between nearby edges (0 disables). */
  arcs?: number;
  speed?: number;
  /** Cursor excites the current and draws arcs towards it. */
  interactive?: boolean;
  /** Overall opacity of the effect. */
  intensity?: number;
  /** Glow strength. */
  glow?: number;
  /** Stroke width in CSS pixels. */
  thickness?: number;
  /** Brightness flicker (0–1). */
  flicker?: number;
  /** Opacity of the solid logo fill underneath (0 hides it). */
  fill?: number;
  cursorIntensity?: number;
  cursorRadius?: number;
  /** Duration of the transformation when `src` changes. */
  morphMs?: number;
  className?: string;
};

type Pt = { x: number; y: number; nx: number; ny: number };
type Contour = { pts: Pt[]; closed: boolean };
type Arc = { a: [number, number]; b: [number, number]; born: number; life: number };

const hash = (n: number) => {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
};

// Smooth 2D value noise in [-1, 1].
function noise(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const h = (i: number, j: number) => hash(i + j * 57.13);
  const a = h(xi, yi) + (h(xi + 1, yi) - h(xi, yi)) * u;
  const b = h(xi, yi + 1) + (h(xi + 1, yi + 1) - h(xi, yi + 1)) * u;
  return (a + (b - a) * v) * 2 - 1;
}

const imageCache = new Map<string, Promise<HTMLImageElement>>();

function loadImage(src: string): Promise<HTMLImageElement> {
  let p = imageCache.get(src);
  if (!p) {
    p = fetchImage(src);
    p.catch(() => imageCache.delete(src));
    imageCache.set(src, p);
  }
  return p;
}

async function fetchImage(src: string): Promise<HTMLImageElement> {
  let url = src;
  let revoke = false;
  // SVGs without width/height have no intrinsic size in some browsers; give them one from the viewBox.
  if (/\.svg($|\?)/i.test(src)) {
    const text = await fetch(src).then((r) => r.text());
    const vb = text.match(/viewBox="\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)\s*"/);
    // Rasterise at >=512px so small viewBoxes (e.g. 24x24 icons) stay crisp when traced.
    const up = vb ? Math.max(1, 512 / Math.max(+vb[1], +vb[2])) : 1;
    const sized = vb && !/<svg[^>]*\swidth=/.test(text) ? text.replace("<svg", `<svg width="${+vb[1] * up}" height="${+vb[2] * up}"`) : text;
    url = URL.createObjectURL(new Blob([sized], { type: "image/svg+xml" }));
    revoke = true;
  }
  const img = new Image();
  img.decoding = "async";
  img.src = url;
  await img.decode();
  if (revoke) URL.revokeObjectURL(url);
  return img;
}

// Traces the logo's outline from its alpha channel into ordered, resampled polylines.
function traceContours(img: HTMLImageElement, w: number, h: number, scale: number) {
  const iw = img.naturalWidth || 1;
  const ih = img.naturalHeight || 1;
  const s = Math.min(w / iw, h / ih) * scale;
  const dw = Math.max(1, Math.round(iw * s));
  const dh = Math.max(1, Math.round(ih * s));
  const ox = (w - dw) / 2;
  const oy = (h - dh) / 2;

  const pad = 2;
  const c = document.createElement("canvas");
  c.width = dw + pad * 2;
  c.height = dh + pad * 2;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  g.drawImage(img, pad, pad, dw, dh);
  const data = g.getImageData(0, 0, c.width, c.height).data;
  const solid = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < c.width && y < c.height && data[(y * c.width + x) * 4 + 3] > 110;

  // Finer sampling for small logos so their outlines keep their shape.
  const step = Math.max(dw, dh) < 160 ? 1 : 2;
  const edge: [number, number][] = [];
  for (let y = 0; y < c.height; y += step) {
    for (let x = 0; x < c.width; x += step) {
      if (!solid(x, y)) continue;
      if (!solid(x - step, y) || !solid(x + step, y) || !solid(x, y - step) || !solid(x, y + step)) edge.push([x, y]);
    }
  }

  // Greedy nearest-neighbour chaining using a coarse spatial grid.
  const cell = 8;
  const cols = Math.ceil(c.width / cell);
  const grid = new Map<number, number[]>();
  edge.forEach(([x, y], i) => {
    const k = Math.floor(y / cell) * cols + Math.floor(x / cell);
    (grid.get(k) ?? grid.set(k, []).get(k)!).push(i);
  });
  const used = new Uint8Array(edge.length);
  const maxJump = step * 2.6;
  const nearest = (x: number, y: number) => {
    let best = -1;
    let bd = maxJump * maxJump;
    const cx = Math.floor(x / cell);
    const cy = Math.floor(y / cell);
    for (let j = cy - 1; j <= cy + 1; j++) {
      for (let i = cx - 1; i <= cx + 1; i++) {
        for (const idx of grid.get(j * cols + i) ?? []) {
          if (used[idx]) continue;
          const d = (edge[idx][0] - x) ** 2 + (edge[idx][1] - y) ** 2;
          if (d < bd) {
            bd = d;
            best = idx;
          }
        }
      }
    }
    return best;
  };

  const contours: Contour[] = [];
  for (let start = 0; start < edge.length; start++) {
    if (used[start]) continue;
    const chain: [number, number][] = [];
    let cur = start;
    while (cur !== -1) {
      used[cur] = 1;
      chain.push(edge[cur]);
      cur = nearest(edge[cur][0], edge[cur][1]);
    }
    if (chain.length < 12 / step) continue;

    // Resample every few pixels and smooth, then compute outward-ish normals.
    const every = step === 1 ? 2 : 3;
    const raw = chain.filter((_, i) => i % every === 0);
    const closed = Math.hypot(raw[0][0] - raw[raw.length - 1][0], raw[0][1] - raw[raw.length - 1][1]) < step * 6;
    const n = raw.length;
    const at = (i: number) => raw[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
    const smooth = raw.map((_, i) => {
      const [a, b, p] = [at(i - 1), at(i + 1), at(i)];
      return [(a[0] + b[0] + p[0] * 2) / 4, (a[1] + b[1] + p[1] * 2) / 4] as [number, number];
    });
    const sAt = (i: number) => smooth[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
    const pts = smooth.map(([x, y], i) => {
      const a = sAt(i - 2);
      const b = sAt(i + 2);
      const tx = b[0] - a[0];
      const ty = b[1] - a[1];
      const len = Math.hypot(tx, ty) || 1;
      return { x: x - pad + ox, y: y - pad + oy, nx: -ty / len, ny: tx / len };
    });
    contours.push({ pts, closed });
  }

  return { contours, box: { x: ox, y: oy, w: dw, h: dh } };
}

function bolt(g: CanvasRenderingContext2D, a: [number, number], b: [number, number], jag: number) {
  const pts: [number, number][] = [a, b];
  let spread = Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.25 * jag;
  for (let pass = 0; pass < 4; pass++) {
    for (let i = pts.length - 1; i > 0; i--) {
      const [x1, y1] = pts[i - 1];
      const [x2, y2] = pts[i];
      pts.splice(i, 0, [(x1 + x2) / 2 + (Math.random() - 0.5) * spread, (y1 + y2) / 2 + (Math.random() - 0.5) * spread]);
    }
    spread *= 0.55;
  }
  g.moveTo(pts[0][0], pts[0][1]);
  for (const [x, y] of pts.slice(1)) g.lineTo(x, y);
}

// Resamples a logo's outline to n points ordered by angle around its centre, so two logos can be paired point-for-point.
function morphPoints(all: Pt[], box: { x: number; y: number; w: number; h: number }, n: number) {
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  if (!all.length) return Array.from({ length: n }, () => [cx, cy] as [number, number]);
  const picked = Array.from({ length: n }, (_, i) => all[Math.floor((i / n) * all.length)]);
  return picked
    .map((p) => [p.x, p.y, Math.atan2(p.y - cy, p.x - cx)] as const)
    .sort((a, b) => a[2] - b[2])
    .map(([x, y]) => [x, y] as [number, number]);
}

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

type Shape = { img: HTMLImageElement; traced: ReturnType<typeof traceContours>; all: Pt[] };

export default function ElectricLogo({
  src,
  color = "#ecc7ff",
  glowColor = "#ad6dff",
  scale = 0.7,
  strands = 4,
  bend = 0.6,
  crackle = 1.5,
  arcs = 1,
  speed = 2.5,
  interactive = false,
  intensity = 1,
  glow = 1,
  thickness = 1.5,
  flicker = 0.6,
  fill = 0,
  cursorIntensity = 0.75,
  cursorRadius = 100,
  morphMs = 1100,
  className,
}: ElectricLogoProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setSrcRef = useRef<((src: string) => void) | null>(null);
  // Latest props, read by the animation loop without restarting it.
  const opts = useRef({ color, glowColor, strands, bend, crackle, arcs, speed, interactive, intensity, glow, thickness, flicker, fill, cursorIntensity, cursorRadius, morphMs });
  opts.current = { color, glowColor, strands, bend, crackle, arcs, speed, interactive, intensity, glow, thickness, flicker, fill, cursorIntensity, cursorRadius, morphMs };

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const g = canvas.getContext("2d");
    if (!g) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // The shape on screen, and the one it is transforming away from.
    let cur: Shape | null = null;
    let prev: Shape | null = null;
    let morphStart = 0;
    let pairs: { a: [number, number][]; b: [number, number][] } | null = null;
    let W = 0;
    let H = 0;
    let raf = 0;
    let visible = true;
    let disposed = false;
    let token = 0;
    const cursor = { x: -1e4, y: -1e4, on: false };
    const liveArcs: Arc[] = [];
    const t0 = performance.now();

    const shapeOf = (img: HTMLImageElement): Shape => {
      if (W <= 0 || H <= 0) return { img, traced: { contours: [], box: { x: 0, y: 0, w: 0, h: 0 } }, all: [] };
      const traced = traceContours(img, W, H, scale);
      return { img, traced, all: traced.contours.flatMap((c) => c.pts) };
    };
    const pairUp = () => {
      if (!prev || !cur) {
        pairs = null;
        return;
      }
      const n = Math.max(120, Math.min(360, Math.round(Math.max(W, H) * 1.6)));
      pairs = { a: morphPoints(prev.all, prev.traced.box, n), b: morphPoints(cur.all, cur.traced.box, n) };
    };

    const layout = () => {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width;
      H = r.height;
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (cur) cur = shapeOf(cur.img);
      if (prev) prev = shapeOf(prev.img);
      pairUp();
    };

    const drawStrands = (shape: Shape, t: number, fade: number, surge: number, boostAt: (x: number, y: number) => number) => {
      const o = opts.current;
      const n = Math.max(1, Math.round(o.strands));
      for (let s = 0; s < n; s++) {
        const flick = 1 - o.flicker * 0.5 * (0.5 + 0.5 * noise(t * 7 + s * 11.3, s * 3.7));
        const alpha = clamp01(o.intensity * flick * (s === 0 ? 1 : 0.55) * fade);
        if (alpha <= 0.01) continue;
        g.beginPath();
        for (const c of shape.traced.contours) {
          c.pts.forEach((p, k) => {
            const boost = (1 + boostAt(p.x, p.y) * 3) * (1 + surge * 3);
            const wander = noise(k * 0.09 + s * 31.7, t * 0.9 + s * 3.1) * (1.5 + o.bend * 7) * boost;
            const jitter = noise(k * 0.7 + s * 13.1, t * 9 + s) * o.crackle * 1.4 * boost;
            const d = wander + jitter;
            const x = p.x + p.nx * d;
            const y = p.y + p.ny * d;
            if (k === 0) g.moveTo(x, y);
            else g.lineTo(x, y);
          });
          if (c.closed) g.closePath();
        }
        // Wide soft pass for the glow, thin bright pass for the core.
        g.globalAlpha = alpha * 0.35 * Math.min(1, o.glow);
        g.strokeStyle = o.glowColor;
        g.lineWidth = o.thickness * (2 + o.glow * 3);
        g.shadowColor = o.glowColor;
        g.shadowBlur = 14 * o.glow;
        g.stroke();
        g.globalAlpha = alpha;
        g.strokeStyle = o.color;
        g.lineWidth = o.thickness * (s === 0 ? 1 : 0.6);
        g.shadowBlur = 4 * o.glow;
        g.stroke();
      }
    };

    const drawFill = (shape: Shape, a: number) => {
      const o = opts.current;
      if (o.fill <= 0 || a <= 0 || !shape.traced.box.w) return;
      const b = shape.traced.box;
      g.globalAlpha = clamp01(o.fill * o.intensity * a);
      g.drawImage(shape.img, b.x, b.y, b.w, b.h);
      g.globalAlpha = 1;
    };

    // Sparks travelling from the old outline to the new one, swirling on the way.
    const drawSparks = (m: number, t: number) => {
      if (!pairs) return;
      const o = opts.current;
      const { a, b } = pairs;
      const swirl = Math.sin(Math.PI * m) * Math.max(W, H) * 0.12;
      const pos = (i: number, e: number) => {
        const dx = b[i][0] - a[i][0];
        const dy = b[i][1] - a[i][1];
        const len = Math.hypot(dx, dy) || 1;
        const k = noise(i * 0.21, t * 0.6) * swirl;
        return [a[i][0] + dx * e + (-dy / len) * k, a[i][1] + dy * e + (dx / len) * k] as const;
      };
      const head = ease(m);
      const tail = ease(clamp01(m - 0.07));
      const alpha = clamp01(Math.sin(Math.PI * m) * 1.6) * o.intensity;
      g.beginPath();
      for (let i = 0; i < a.length; i++) {
        const [x1, y1] = pos(i, tail);
        const [x2, y2] = pos(i, head);
        g.moveTo(x1, y1);
        g.lineTo(x2, y2);
      }
      g.globalAlpha = alpha * 0.5;
      g.strokeStyle = o.glowColor;
      g.lineWidth = o.thickness * 3;
      g.shadowColor = o.glowColor;
      g.shadowBlur = 10 * o.glow;
      g.stroke();
      g.globalAlpha = alpha;
      g.strokeStyle = o.color;
      g.lineWidth = o.thickness;
      g.shadowBlur = 3 * o.glow;
      g.stroke();
    };

    const draw = (now: number) => {
      const o = opts.current;
      const t = ((now - t0) / 1000) * o.speed;
      g.clearRect(0, 0, W, H);
      if (!cur) return;

      // Transformation progress: 0 = old logo, 1 = new logo.
      let m = 1;
      if (prev) {
        m = reduce ? 1 : clamp01((now - morphStart) / o.morphMs);
        if (m >= 1) {
          prev = null;
          pairs = null;
        }
      }
      const old = prev;

      if (old) {
        drawFill(old, 1 - m / 0.35);
        drawFill(cur, (m - 0.65) / 0.35);
      } else {
        drawFill(cur, 1);
      }

      const r2 = o.cursorRadius * o.cursorRadius;
      const boostAt = (x: number, y: number) => {
        if (!o.interactive || !cursor.on) return 0;
        const d = (x - cursor.x) ** 2 + (y - cursor.y) ** 2;
        return d > r2 ? 0 : (1 - Math.sqrt(d) / o.cursorRadius) * o.cursorIntensity;
      };

      g.lineCap = "round";
      g.lineJoin = "round";
      g.globalCompositeOperation = "lighter";

      if (old) {
        // Old outline surges and breaks apart; the new one settles in as the sparks arrive.
        drawStrands(old, t, 1 - m / 0.3, m / 0.3, boostAt);
        drawStrands(cur, t, (m - 0.7) / 0.3, (1 - m) / 0.3, boostAt);
        drawSparks(m, t);
      } else {
        drawStrands(cur, t, 1, 0, boostAt);
      }

      // Arcs: short-lived bolts between nearby edge points, and towards the cursor.
      const all = cur.all;
      if (all.length && !reduce) {
        if (Math.random() < o.arcs * (old ? 0.35 : 0.06)) {
          const a = all[(Math.random() * all.length) | 0];
          const b = all[(Math.random() * all.length) | 0];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > Math.min(20, Math.max(W, H) * 0.15) && d < Math.max(W, H) * 0.3) {
            liveArcs.push({ a: [a.x, a.y], b: [b.x, b.y], born: now, life: 90 + Math.random() * 160 });
          }
        }
        if (o.interactive && cursor.on && Math.random() < o.cursorIntensity * 0.12) {
          let best: Pt | null = null;
          let bd = r2;
          for (let i = 0; i < all.length; i += 3) {
            const d = (all[i].x - cursor.x) ** 2 + (all[i].y - cursor.y) ** 2;
            if (d < bd) {
              bd = d;
              best = all[i];
            }
          }
          if (best) liveArcs.push({ a: [best.x, best.y], b: [cursor.x, cursor.y], born: now, life: 60 + Math.random() * 90 });
        }
      }
      for (let i = liveArcs.length - 1; i >= 0; i--) {
        const arc = liveArcs[i];
        const age = (now - arc.born) / arc.life;
        if (age >= 1) {
          liveArcs.splice(i, 1);
          continue;
        }
        g.beginPath();
        bolt(g, arc.a, arc.b, 0.6 + o.crackle * 0.3);
        g.globalAlpha = o.intensity * (1 - age);
        g.strokeStyle = o.color;
        g.lineWidth = o.thickness * 0.8;
        g.shadowColor = o.glowColor;
        g.shadowBlur = 12 * o.glow;
        g.stroke();
      }

      g.globalAlpha = 1;
      g.shadowBlur = 0;
      g.globalCompositeOperation = "source-over";
    };

    const loop = (now: number) => {
      raf = 0;
      if (!visible || disposed) return;
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reduce) draw(performance.now());
      else if (!raf) raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(() => {
      layout();
      if (reduce) draw(performance.now());
    });
    ro.observe(wrap);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(wrap);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      cursor.x = e.clientX - r.left;
      cursor.y = e.clientY - r.top;
      cursor.on = true;
    };
    const onLeave = () => {
      cursor.on = false;
    };
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);

    setSrcRef.current = (next: string) => {
      const mine = ++token;
      loadImage(next)
        .then((img) => {
          if (disposed || mine !== token) return;
          // Transform from whatever is on screen right now; off-screen changes just swap.
          prev = cur && visible ? cur : null;
          cur = shapeOf(img);
          morphStart = performance.now();
          pairUp();
          start();
        })
        .catch(() => {});
    };
    setSrcRef.current(src);

    return () => {
      disposed = true;
      setSrcRef.current = null;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
    // Later src changes go through setSrcRef so the loop (and the transformation) keeps running.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale]);

  const firstSrc = useRef(true);
  useEffect(() => {
    if (firstSrc.current) {
      firstSrc.current = false;
      return;
    }
    setSrcRef.current?.(src);
  }, [src]);

  return (
    <div ref={wrapRef} className={className} style={{ position: "absolute", inset: 0 }} aria-hidden="true">
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}
