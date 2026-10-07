"use client";

import { useEffect } from "react";

export default function HomeEffects() {
  useEffect(() => {
    // Ensure density and accent are set correctly for the new design
    document.documentElement.setAttribute("data-accent", "warm");
    document.documentElement.setAttribute("data-density", "compact");
    const hero = document.querySelector(".hero");
    if (hero) hero.setAttribute("data-hero", "A");

    // reveal on scroll
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    // count-up numbers
    const countIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target as HTMLElement;
          const target = parseFloat(el.getAttribute("data-count") || "0");
          const dur = 1400;
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - t0) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            const cur = target * eased;
            el.textContent = target >= 10 ? Math.round(cur).toString() : cur.toFixed(0);
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target.toString();
          };
          requestAnimationFrame(tick);
          countIO.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    document.querySelectorAll("[data-count]").forEach((el) => countIO.observe(el));

    // card hover glow (mouse-follow via delegation)
    const handleMouseMove = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest(".card, .pcard, .tcard, .step") as HTMLElement;
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - r.left + "px");
        card.style.setProperty("--my", e.clientY - r.top + "px");
      }
    };
    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    // subtle parallax on hero blobs
    const mesh = document.querySelector(".hero__mesh");
    const b1 = mesh?.querySelector(".blob--1") as HTMLElement;
    const b2 = mesh?.querySelector(".blob--2") as HTMLElement;
    const handleScroll = () => {
      const y = window.scrollY;
      if (y > 800) return;
      if (b1) b1.style.transform = `translate3d(0, ${y * 0.1}px, 0)`;
      if (b2) b2.style.transform = `translate3d(0, ${y * 0.06}px, 0)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      io.disconnect();
      countIO.disconnect();
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
}
