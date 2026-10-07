"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges, Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { NODE_D, NODE_H, byId, edges, nodeWidth, nodes, routes, type Edge, type Route, type WorkflowNode } from "./model";

const C = {
  face: "#fdfcfa",
  final: "#160e20",
  border: "#cbc5ba",
  borderActive: "#160e20",
  line: "#cdc7bc",
  lineFocus: "#3a3540",
  lineHot: "#2563eb",
  layer: "#ebe7df",
  layerBorder: "#d6d0c4",
  packet: "#2563eb",
};

// Intro timeline, in seconds after the hero becomes visible.
const T = { inputsIn: 0.5, settleFrom: 0.9, settleTo: 1.85, stepsFrom: 0.45, stepsTo: 1.3, pipeLines: [0.9, 1.5], inputLines: [1.6, 2.2], firstPacket: 2.25 };
const SPEED = 2.3; // scene units per second
const SPAWN_GAP = 3.8;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
const seg = (t: number, a: number, b: number) => ease((t - a) / (b - a));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

function anchor(n: WorkflowNode, side: "l" | "r" | "t" | "b", dx = 0) {
  const w = nodeWidth(n);
  const [x, y, z] = n.pos;
  if (side === "l") return V(x - w / 2, y, z);
  if (side === "r") return V(x + w / 2, y, z);
  if (side === "t") return V(x + dx, y + NODE_H / 2, z);
  return V(x + dx, y - NODE_H / 2, z);
}

function curveFor(e: Edge) {
  const a = byId[e.from];
  const b = byId[e.to];
  if (e.id === "process-review" || e.id === "review-process") {
    const down = e.id === "process-review";
    const dx = down ? -0.32 : 0.32;
    const s = down ? anchor(a, "b", dx) : anchor(a, "t", dx);
    const t = down ? anchor(b, "t", dx) : anchor(b, "b", dx);
    const k = down ? -0.4 : 0.4;
    return new THREE.CatmullRomCurve3([s, s.clone().add(V(0, k, 0)), t.clone().add(V(0, -k, 0)), t], false, "centripetal");
  }
  const s = anchor(a, "r");
  const t = anchor(b, "l");
  const mid = s.clone().lerp(t, 0.5);
  return new THREE.CatmullRomCurve3([s, s.clone().add(V(0.4, 0, 0)), mid, t.clone().add(V(-0.4, 0, 0)), t], false, "centripetal");
}

type Shared = { time: React.MutableRefObject<number> };

function WorkflowNode3D({
  n,
  time,
  active,
  onActivate,
  geometry,
  faceMat,
  finalMat,
}: Shared & {
  n: WorkflowNode;
  active: boolean;
  onActivate: (id: string) => void;
  geometry: THREE.BoxGeometry;
  faceMat: THREE.Material;
  finalMat: THREE.Material;
}) {
  const group = useRef<THREE.Group>(null);
  const label = useRef<HTMLButtonElement>(null);
  const lift = useRef(0);
  const w = nodeWidth(n);
  const final = n.kind === "final";

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const t = time.current;
    let x = n.pos[0];
    let y = n.pos[1];
    let z = n.pos[2];
    let rot = 0;
    let appear: number;

    if (n.scatter) {
      appear = seg(t, 0, T.inputsIn);
      const settle = seg(t, T.settleFrom, T.settleTo);
      const [sx, sy, sz, sr] = n.scatter;
      const drift = (1 - settle) * Math.sin(t * 1.7 + sx * 3) * 0.07;
      x = lerp(sx, x, settle);
      y = lerp(sy, y, settle) + drift;
      z = lerp(sz, z, settle);
      rot = lerp(sr, 0, settle);
    } else {
      appear = final ? seg(t, 1.2, 1.9) : seg(t, T.stepsFrom, T.stepsTo);
      y -= (1 - appear) * 0.3;
    }

    lift.current = lerp(lift.current, active ? 0.14 : 0, 0.18);
    g.visible = appear > 0.01;
    g.position.set(x, y, z + lift.current);
    g.rotation.z = rot;
    g.scale.setScalar(lerp(0.7, 1, appear) * (active ? 1.04 : 1));
    if (label.current) label.current.style.opacity = String(appear);
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry} material={final ? finalMat : faceMat} scale={[w, NODE_H, NODE_D]}>
        <Edges color={active ? C.borderActive : final ? C.final : C.border} threshold={20} />
      </mesh>
      <Html center position={[0, 0, NODE_D / 2 + 0.002]} zIndexRange={[30, 10]} style={{ pointerEvents: "none" }}>
        <button
          ref={label}
          type="button"
          onClick={() => onActivate(n.id)}
          onMouseEnter={() => onActivate(n.id)}
          onFocus={() => onActivate(n.id)}
          aria-pressed={active}
          aria-label={`${n.label}. ${n.desc}`}
          className={`pointer-events-auto whitespace-nowrap rounded-[5px] px-3 py-1.5 font-ui text-[13px] font-semibold leading-none tracking-[-0.005em] opacity-0 outline-offset-4 ${
            final ? "text-[#f4f2ee]" : "text-ink"
          }`}
          style={{ minWidth: `${Math.round(w * 52)}px` }}
        >
          {n.label}
        </button>
      </Html>
    </group>
  );
}

function Connection({
  e,
  points,
  time,
  hot,
  focus,
}: Shared & { e: Edge; points: THREE.Vector3[]; hot: boolean; focus: boolean }) {
  const ref = useRef<any>(null);
  const toIntake = e.to === "intake";
  const [a, b] = toIntake ? T.inputLines : T.pipeLines;

  useFrame(() => {
    const m = ref.current?.material;
    if (!m) return;
    const base = seg(time.current, a, b);
    m.opacity = base * (hot ? 1 : focus ? 0.9 : toIntake ? 0.75 : 0.95);
  });

  return (
    <Line
      ref={ref}
      points={points}
      color={hot ? C.lineHot : focus ? C.lineFocus : C.line}
      lineWidth={hot ? 1.8 : focus ? 1.4 : 1.1}
      transparent
      opacity={0}
    />
  );
}

function Packets({
  time,
  curves,
  lengths,
  reduce,
  onHot,
  onRoute,
}: Shared & {
  curves: Record<string, THREE.CatmullRomCurve3>;
  lengths: Record<string, number>;
  reduce: boolean;
  onHot: (ids: string) => void;
  onRoute: (r: Route) => void;
}) {
  const refs = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)];
  const slots = useRef([
    { active: false, route: 0, s: 0 },
    { active: false, route: 0, s: 0 },
  ]);
  const nextRoute = useRef(0);
  const lastSpawn = useRef(-Infinity);
  const lastHot = useRef("");
  const totals = useMemo(() => routes.map((r) => r.edges.reduce((sum, id) => sum + lengths[id], 0)), [lengths]);

  useFrame((_, delta) => {
    if (reduce) return;
    const t = time.current;
    const ps = slots.current;

    if (t >= T.firstPacket) {
      const running = ps.filter((p) => p.active).length;
      if (running === 0 || (running < 2 && t - lastSpawn.current > SPAWN_GAP)) {
        const free = ps.find((p) => !p.active);
        if (free) {
          free.active = true;
          free.s = 0;
          free.route = nextRoute.current % routes.length;
          nextRoute.current += 1;
          lastSpawn.current = t;
          onRoute(routes[free.route]);
        }
      }
    }

    const hot: string[] = [];
    ps.forEach((p, i) => {
      const mesh = refs[i].current;
      if (!mesh) return;
      if (!p.active) {
        mesh.visible = false;
        return;
      }
      p.s += Math.min(delta, 0.05) * SPEED;
      if (p.s >= totals[p.route]) {
        p.active = false;
        mesh.visible = false;
        return;
      }
      let rest = p.s;
      for (const id of routes[p.route].edges) {
        if (rest <= lengths[id]) {
          mesh.position.copy(curves[id].getPointAt(rest / lengths[id]));
          hot.push(id);
          break;
        }
        rest -= lengths[id];
      }
      mesh.visible = true;
    });

    const key = hot.sort().join("|");
    if (key !== lastHot.current) {
      lastHot.current = key;
      onHot(key);
    }
  });

  return (
    <>
      {refs.map((r, i) => (
        <mesh key={i} ref={r} visible={false}>
          <sphereGeometry args={[0.075, 16, 12]} />
          <meshBasicMaterial color={C.packet} />
        </mesh>
      ))}
    </>
  );
}

function CameraRig({ reduce }: { reduce: boolean }) {
  const look = useMemo(() => V(0, -0.1, 0), []);
  const base = useMemo(() => V(0.3, 0.7, 12.4), []);
  const target = useMemo(() => V(0, 0, 0), []);
  useFrame(({ camera, pointer }) => {
    if (reduce) {
      camera.position.copy(base);
    } else {
      // ~1.5° of travel at most: the scene should feel dimensional, not steerable.
      target.set(base.x + pointer.x * 0.38, base.y + pointer.y * 0.22, base.z);
      camera.position.lerp(target, 0.04);
    }
    camera.lookAt(look);
  });
  return null;
}

function OperationsLayer({ time, geometry }: Shared & { geometry: THREE.BoxGeometry }) {
  const group = useRef<THREE.Group>(null);
  const label = useRef<HTMLParagraphElement>(null);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: C.layer, roughness: 1, transparent: true, opacity: 0 }), []);
  useFrame(() => {
    const k = seg(time.current, 0.6, 1.4);
    mat.opacity = k * 0.85;
    if (label.current) label.current.style.opacity = String(k);
    if (group.current) group.current.visible = k > 0.01;
  });
  return (
    <group ref={group} position={[0.05, -0.82, -0.62]}>
      <mesh geometry={geometry} material={mat} scale={[6.55, 3.45, 0.08]}>
        <Edges color={C.layerBorder} threshold={20} />
      </mesh>
      <Html position={[-3.12, 1.56, 0.06]} zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
        <p ref={label} className="whitespace-nowrap font-mono text-[10.5px] uppercase tracking-[0.08em] text-mute opacity-0">
          Quishub · operations layer
        </p>
      </Html>
    </group>
  );
}

function EdgeLabel({ text, position, time }: Shared & { text: string; position: THREE.Vector3 }) {
  const ref = useRef<HTMLSpanElement>(null);
  useFrame(() => {
    if (ref.current) ref.current.style.opacity = String(seg(time.current, 1.5, 2.1));
  });
  return (
    <Html position={position} center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
      <span ref={ref} className="whitespace-nowrap font-mono text-[10.5px] text-mute opacity-0">
        {text}
      </span>
    </Html>
  );
}

export default function WorkflowScene({
  activeId,
  onActivate,
  onRoute,
  reduce,
}: {
  activeId: string | null;
  onActivate: (id: string) => void;
  onRoute: (r: Route) => void;
  reduce: boolean;
}) {
  const time = useRef(reduce ? 99 : 0);
  const [hot, setHot] = useState("");

  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const faceMat = useMemo(() => new THREE.MeshStandardMaterial({ color: C.face, roughness: 0.92, metalness: 0 }), []);
  const finalMat = useMemo(() => new THREE.MeshStandardMaterial({ color: C.final, roughness: 0.85, metalness: 0 }), []);

  const { curves, lengths, points } = useMemo(() => {
    const curves: Record<string, THREE.CatmullRomCurve3> = {};
    const lengths: Record<string, number> = {};
    const points: Record<string, THREE.Vector3[]> = {};
    for (const e of edges) {
      const c = curveFor(e);
      curves[e.id] = c;
      lengths[e.id] = c.getLength();
      points[e.id] = c.getPoints(40);
    }
    return { curves, lengths, points };
  }, []);

  useFrame((_, delta) => {
    if (!reduce) time.current += Math.min(delta, 0.05);
  });

  const hotSet = new Set(hot.split("|").filter(Boolean));

  return (
    <>
      <ambientLight intensity={2.3} />
      <directionalLight position={[-3, 5, 9]} intensity={1.5} />
      <CameraRig reduce={reduce} />

      <group rotation={[-0.08, -0.2, 0]} position={[-0.15, 0.1, 0]}>
        <OperationsLayer time={time} geometry={geometry} />

        {edges.map((e) => (
          <Connection
            key={e.id}
            e={e}
            points={points[e.id]}
            time={time}
            hot={hotSet.has(e.id)}
            focus={activeId != null && (e.from === activeId || e.to === activeId)}
          />
        ))}

        <EdgeLabel text="automated" position={curves["process-done"].getPointAt(0.62).add(V(0.62, -0.18, 0))} time={time} />
        <EdgeLabel text="exception" position={curves["process-review"].getPointAt(0.5).add(V(-0.62, 0, 0))} time={time} />

        {nodes.map((n) => (
          <WorkflowNode3D
            key={n.id}
            n={n}
            time={time}
            active={n.id === activeId}
            onActivate={onActivate}
            geometry={geometry}
            faceMat={faceMat}
            finalMat={finalMat}
          />
        ))}

        <Packets time={time} curves={curves} lengths={lengths} reduce={reduce} onHot={setHot} onRoute={onRoute} />
      </group>
    </>
  );
}
