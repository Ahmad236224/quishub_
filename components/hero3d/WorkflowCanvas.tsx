"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import WorkflowScene from "./WorkflowScene";
import type { Route } from "./model";

class GLBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

type Props = {
  activeId: string | null;
  onActivate: (id: string) => void;
  onRoute: (r: Route) => void;
  onReady: () => void;
  onFail: () => void;
  reduce: boolean;
};

export default function WorkflowCanvas({ activeId, onActivate, onRoute, onReady, onFail, reduce }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "80px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <GLBoundary onError={onFail}>
        <Canvas
          flat
          dpr={[1, 1.5]}
          camera={{ position: [0.3, 0.7, 12.4], fov: 32, near: 0.1, far: 60 }}
          gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
          // Stop rendering off-screen; with reduced motion only render on change.
          frameloop={!visible ? "never" : reduce ? "demand" : "always"}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener("webglcontextlost", onFail, { once: true });
            onReady();
          }}
        >
          <WorkflowScene activeId={activeId} onActivate={onActivate} onRoute={onRoute} reduce={reduce} />
        </Canvas>
      </GLBoundary>
    </div>
  );
}
