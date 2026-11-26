"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Grid wrapper for FeaturesSection: reveals the (server-rendered) cards with a stagger
 * when the grid scrolls into view, and drives the mouse-following spotlight via --x/--y.
 */
export function FeaturesGrid({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  // Entrance: set data-in once; the CSS handles the staggered fade/slide (and reduced motion).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.in = "";
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Spotlight: one delegated listener; card rect read once per hover, writes batched per frame.
  useEffect(() => {
    const grid = ref.current;
    if (!grid) return;
    if (!matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    let card: HTMLElement | null = null;
    let rect: DOMRect | null = null;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      const target = (e.target as Element).closest<HTMLElement>(".feature-card");
      if (!target) return;
      if (target !== card) {
        card = target;
        rect = target.getBoundingClientRect();
      }
      const x = e.clientX - rect!.left;
      const y = e.clientY - rect!.top;
      const el = target;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--x", `${x}px`);
        el.style.setProperty("--y", `${y}px`);
      });
    };
    const onLeave = () => {
      card = null;
      rect = null;
    };
    grid.addEventListener("pointermove", onMove);
    grid.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onLeave, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      grid.removeEventListener("pointermove", onMove);
      grid.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="features-grid mx-auto grid max-w-[1280px] grid-cols-3 gap-9 max-lg:grid-cols-2 max-lg:gap-8 max-md:grid-cols-1"
    >
      {children}
    </div>
  );
}
