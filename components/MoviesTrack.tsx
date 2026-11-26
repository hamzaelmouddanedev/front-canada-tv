"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/** `alt` is built on the server (MoviesSlider) because this client component has no access to the dictionary. */
type Movie = { file: string; title: string; alt: string };

// Scrolling poster track: the poster closest to the horizontal centre grows and rises above its neighbours.
export function MoviesTrack({ movies }: { movies: Movie[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLElement | null)[]>([]);
  const loop = [...movies, ...movies];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = false;
    const last: number[] = []; // last applied emphasis per poster
    const tick = () => {
      raf = 0;
      // Read every rect first, then write styles: interleaving reads and writes forces
      // a synchronous layout per poster (Lighthouse "forced reflow").
      const box = el.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const reach = Math.min(260, box.width / 2);
      const nodes = items.current;
      const centers = nodes.map((f) => {
        if (!f) return null;
        const r = f.getBoundingClientRect();
        return r.left + r.width / 2;
      });
      let best = -1;
      let bestIdx = 0;
      nodes.forEach((f, i) => {
        const c = centers[i];
        if (!f || c == null) return;
        const t = Math.max(0, 1 - Math.abs(c - cx) / reach);
        // Rounded so posters far from the centre (most of them) skip style writes entirely.
        const e = Math.round(t * t * (3 - 2 * t) * 1000) / 1000;
        if (e > best) {
          best = e;
          bestIdx = i;
        }
        if (last[i] === e) return;
        last[i] = e;
        f.style.transform = `scale(${1 + 0.4 * e})`;
        f.style.zIndex = String(Math.round(e * 10));
        f.style.filter = `brightness(${0.7 + 0.3 * e})`;
      });
      if (best > 0) setActive(bestIdx % movies.length);
      if (!reduce && visible) raf = requestAnimationFrame(tick);
    };
    // Only run while the track is on screen; the first callback also gives an initial
    // frame without measuring during hydration.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [movies.length]);

  return (
    <>
    {/* Blurred backdrop, masked top and bottom so it fades into the page spectrum. */}
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden mask-[linear-gradient(180deg,transparent,#000_30%,#000_70%,transparent)]" aria-hidden="true">
      {movies.map((m, i) => (
        <Image
          key={m.file}
          src={`/movies/${encodeURIComponent(m.file)}`}
          alt=""
          fill
          unoptimized
          className={`scale-125 object-cover blur-2xl transition-opacity duration-700 ${i === active ? "opacity-45" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-bg/30" />
    </div>
    <div ref={wrap} className="relative overflow-x-clip mask-[linear-gradient(90deg,transparent,#000_120px,#000_calc(100%-120px),transparent)]">
      <div className="flex w-max animate-scroll-rtl [animation-duration:40s] gap-5 py-12 hover:[animation-play-state:paused] motion-reduce:animate-none">
        {loop.map((m, i) => (
          <figure
            ref={(n) => {
              items.current[i] = n;
            }}
            className="group relative m-0 w-[180px] shrink-0 will-change-transform max-[480px]:w-[140px]"
            key={i}
            aria-hidden={i >= movies.length}
          >
            <div className="relative aspect-[2/3] rounded-[14px] border border-lagoon/20 bg-white/4 shadow-[0_10px_30px_rgb(0_0_0/0.35)] transition-colors duration-300 group-hover:border-flamingo/60">
              <Image
                src={`/movies/${encodeURIComponent(m.file)}`}
                alt={i < movies.length ? m.alt : ""}
                fill
                unoptimized
                // The marquee slides posters in from off-screen, so lazy loading shows empty boxes.
                loading="eager"
                fetchPriority={i < 6 ? "high" : "low"}
                className="rounded-[14px] object-cover"
              />
            </div>
            <figcaption className="mt-[0.7rem] truncate text-center text-[0.85rem] font-semibold text-muted transition-colors duration-300 group-hover:text-white">
              {m.title}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
    </>
  );
}
