"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function MouseTracker() {
  const pathname = usePathname();
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });

  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isTouchPointer, setIsTouchPointer] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/studio")) return;

    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouchPointer(true);
      return;
    }

    document.body.classList.add("mouse-tracker-on");

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animate = () => {
      currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.14);
      currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.14);

      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px)`;
      }
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${targetPos.current.x}px, ${targetPos.current.y}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    const onMove = (event: MouseEvent) => {
      targetPos.current = { x: event.clientX, y: event.clientY };
      const target = event.target as Element | null;
      if (target?.closest(".chatbot-widget")) {
        if (visible) setVisible(false);
      } else {
        if (!visible) setVisible(true);
      }
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const interactive = target?.closest(
        "a, button, [role='button'], input, textarea, select, summary, .surface-chip, .surface-card"
      );
      setHovered(Boolean(interactive));
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    rafRef.current = requestAnimationFrame(animate);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.body.classList.remove("mouse-tracker-on");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [visible, pathname]);

  if (isTouchPointer || pathname.startsWith("/studio")) return null;

  const outerSize = hovered ? 44 : pressed ? 18 : 32;
  const innerSize = pressed ? 3 : 5;

  return (
    <>
      <div
        ref={outerRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: outerSize,
          height: outerSize,
          marginLeft: -(outerSize / 2),
          marginTop: -(outerSize / 2),
          borderRadius: "999px",
          zIndex: 99999,
          pointerEvents: "none",
          border: "1.5px solid rgba(124, 58, 237, 0.9)",
          background: hovered ? "rgba(124, 58, 237, 0.2)" : "transparent",
          opacity: visible ? (hovered ? 0.7 : 0.45) : 0,
          transition:
            "width 0.2s ease, height 0.2s ease, margin 0.2s ease, opacity 0.25s ease, background 0.2s ease",
          willChange: "transform",
        }}
      />
      <div
        ref={innerRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: innerSize,
          height: innerSize,
          marginLeft: -(innerSize / 2),
          marginTop: -(innerSize / 2),
          borderRadius: "999px",
          zIndex: 99999,
          pointerEvents: "none",
          background: "rgb(124, 58, 237)",
          boxShadow: "0 0 8px rgba(124, 58, 237, 0.7)",
          opacity: visible ? 1 : 0,
          transition: "width 0.12s ease, height 0.12s ease, margin 0.12s ease, opacity 0.2s ease",
          willChange: "transform",
        }}
      />
    </>
  );
}
