"use client";

import { useEffect, useRef, useState } from "react";

export function PlanSlider({ children, prev, next }: { children: React.ReactNode; prev: string; next: string }) {
  const ref = useRef<HTMLDivElement>(null);

  // Start with the middle card centered in view. Measured inside a ResizeObserver callback,
  // which runs after layout, so reading offsets doesn't force a synchronous reflow.
  useEffect(() => {
    const el = ref.current;
    const mid = el?.children[Math.floor(el.children.length / 2)] as HTMLElement | undefined;
    if (!el || !mid) return;
    const ro = new ResizeObserver(() => {
      ro.disconnect();
      el.scrollLeft = mid.offsetLeft - (el.clientWidth - mid.offsetWidth) / 2;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    // Move exactly one card (card width + the 24px gap).
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? el.clientWidth) + 24), behavior: "smooth" });
  };

  const [paused, setPaused] = useState(false);

  // Auto-advance one card every few seconds, only when some cards are out of view.
  useEffect(() => {
    const el = ref.current;
    if (!el || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (el.scrollWidth <= el.clientWidth + 4) return; // everything is visible
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
      else scroll(1);
    }, 4000);
    return () => clearInterval(id);
  }, [paused]);


  const arrow =
    "absolute top-1/2 z-10 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-teal/40 bg-bg/90 text-xl text-teal transition hover:scale-110 hover:bg-teal hover:text-white";

  return (
    <div
      className="relative mx-auto max-w-[1200px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setTimeout(() => setPaused(false), 6000)}
    >
      <button type="button" aria-label={prev} onClick={() => scroll(-1)} className={`${arrow} left-0 max-md:left-1 md:-left-5`}>
        ‹
      </button>
      <div
        ref={ref}
        className="flex snap-x justify-center-safe snap-mandatory items-start gap-6 overflow-x-auto scroll-smooth px-2 py-6 max-md:px-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <button type="button" aria-label={next} onClick={() => scroll(1)} className={`${arrow} right-0 max-md:right-1 md:-right-5`}>
        ›
      </button>
    </div>
  );
}
