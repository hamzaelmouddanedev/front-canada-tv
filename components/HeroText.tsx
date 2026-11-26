"use client";

import { useLayoutEffect, useRef } from "react";

const CARET = "3px 0 0 var(--color-lagoon)";
const CARET_EMPTY = "-3px 0 0 var(--color-lagoon)";
// type (6s) -> hold (5s) -> erase (5s) -> pause (4s) -> repeat; first run starts after 0.3s.
const TYPE_MS = 6000;
const HOLD_MS = 5000;
const ERASE_MS = 5000;
const PAUSE_MS = 4000;
const START_MS = 300;

/**
 * Hero headline: typewriter loop: types, holds, erases, repeats.
 * Plain timers instead of a per-frame tween: each step only touches the one or two
 * characters whose state changes, keeping the main thread idle between steps.
 */
export function HeroTitle({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const chars = Array.from(el.querySelectorAll<HTMLElement>(".hc"));
    const len = chars.length;
    if (!len) return;

    let n = 0;
    const caretAt = (count: number) => {
      if (count > 0) chars[count - 1].style.boxShadow = CARET;
      else chars[0].style.boxShadow = CARET_EMPTY; // caret before the first character while empty
    };
    const clearCaret = (count: number) => {
      chars[Math.max(0, count - 1)].style.boxShadow = "none";
    };

    chars.forEach((c) => {
      c.style.opacity = "0";
      c.style.boxShadow = "none";
    });
    caretAt(0);

    let timer = 0;
    const step = (dir: 1 | -1) => {
      clearCaret(n);
      if (dir === 1) chars[n].style.opacity = "1";
      else chars[n - 1].style.opacity = "0";
      n += dir;
      caretAt(n);
    };
    const type = () => {
      if (n < len) {
        step(1);
        timer = window.setTimeout(type, TYPE_MS / len);
      } else timer = window.setTimeout(erase, HOLD_MS);
    };
    const erase = () => {
      if (n > 0) {
        step(-1);
        timer = window.setTimeout(erase, ERASE_MS / len);
      } else timer = window.setTimeout(type, PAUSE_MS);
    };
    timer = window.setTimeout(type, START_MS);

    return () => {
      clearTimeout(timer);
      chars.forEach((c) => {
        c.style.opacity = "";
        c.style.boxShadow = "";
      });
    };
  }, [text]);

  return (
    <h1 ref={ref} className={`text-white ${className ?? ""}`} aria-label={text}>
      {text.split(" ").map((w, i, arr) => (
        <span
          key={i}
          aria-hidden
          className="inline-block whitespace-nowrap motion-safe:animate-word-hue"
          style={{ animationDelay: `${-8 + i * 0.6}s` }}
        >
          {Array.from(w).map((c, j) => (
            <span key={j} className="hc">
              {c}
            </span>
          ))}
          {i < arr.length - 1 ? " " : ""}
        </span>
      ))}
    </h1>
  );
}
