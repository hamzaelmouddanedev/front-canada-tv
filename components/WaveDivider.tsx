import { useId } from "react";

/** Triangular peaks: `step` px wide, crest at `top`, valley at `bottom`, filled down to `base`. */
function zigzag(step: number, top: number, bottom: number, base: number, shift: number) {
  let d = `M${-shift} ${bottom}`;
  for (let x = -shift; x < 1440 + step * 2; x += step * 2) d += ` L${x + step} ${top} L${x + step * 2} ${bottom}`;
  return `${d} V${base} H${-shift} Z`;
}

/** Round arches: `w` px wide, crest at `top`, joins at `bottom`, filled down to `base`. */
function scallops(w: number, top: number, bottom: number, base: number, shift: number) {
  let d = `M${-shift} ${bottom}`;
  for (let x = -shift; x < 1440 + w; x += w) d += ` Q${x + w / 2} ${top * 2 - bottom} ${x + w} ${bottom}`;
  return `${d} V${base} H${-shift} Z`;
}

const VARIANTS = {
  // About → Movies: smooth double wave, flamingo → magenta → periwinkle
  a: {
    id: "wave-grad-a",
    stops: ["var(--color-flamingo)", "var(--color-magenta)", "var(--color-periwinkle)"],
    back: "M0 50 C 240 10, 480 90, 760 50 S 1200 10, 1440 50 V 90 C 1200 130, 1000 60, 760 100 S 240 130, 0 90 Z",
    front: "M0 62 C 260 30, 500 100, 780 66 S 1180 30, 1440 64 V 78 C 1180 110, 1020 60, 780 90 S 260 110, 0 78 Z",
  },
  // Movies → Plans: wide rolling hills with a tilted crest, magenta → periwinkle → azure
  b: {
    id: "wave-grad-b",
    stops: ["var(--color-magenta)", "var(--color-periwinkle)", "var(--color-azure)"],
    back: "M0 90 C 160 20, 340 20, 480 70 S 760 130, 960 60 S 1300 0, 1440 70 V 100 C 1300 50, 1140 120, 960 100 S 640 150, 480 105 S 160 70, 0 120 Z",
    front: "M0 96 C 180 50, 340 50, 500 84 S 780 120, 960 80 S 1280 40, 1440 84 V 96 C 1280 70, 1140 112, 960 96 S 660 130, 500 100 S 180 80, 0 108 Z",
  },
  // Channels → About: shark-fin ridges, ruby → orchid → amethyst
  c: {
    id: "wave-grad-c",
    flip: true, // fins point down; hangs strictly below the boundary so it never covers the section above
    stops: ["var(--color-ruby)", "var(--color-orchid)", "var(--color-amethyst)"],
    back: "M0 80 C 101 80, 158 20, 245 20 Q 259 68, 288 80 C 389 80, 446 20, 533 20 Q 547 68, 576 80 C 677 80, 734 20, 821 20 Q 835 68, 864 80 C 965 80, 1022 20, 1109 20 Q 1123 68, 1152 80 C 1253 80, 1310 20, 1397 20 Q 1411 68, 1440 80 V 110 H0 Z",
    front: "M0 100 C 72 100, 113 52, 175 52 Q 185 90, 206 100 C 278 100, 319 52, 381 52 Q 391 90, 411 100 C 483 100, 525 52, 586 52 Q 597 90, 617 100 C 689 100, 730 52, 792 52 Q 802 90, 823 100 C 895 100, 936 52, 998 52 Q 1008 90, 1029 100 C 1101 100, 1142 52, 1203 52 Q 1214 90, 1234 100 C 1306 100, 1347 52, 1409 52 Q 1419 90, 1440 100 V 125 H0 Z",
  },
  // Zigzag peaks, scarlet → ruby → orchid
  d: {
    id: "wave-grad-d",
    stops: ["var(--color-scarlet)", "var(--color-ruby)", "var(--color-orchid)"],
    back: zigzag(60, 30, 100, 130, 0),
    front: zigzag(60, 50, 90, 110, 30),
  },
  // Scalloped arches, periwinkle → azure → cerulean
  e: {
    id: "wave-grad-e",
    stops: ["var(--color-periwinkle)", "var(--color-azure)", "var(--color-cerulean)"],
    back: scallops(120, 30, 100, 130, 0),
    front: scallops(120, 55, 95, 115, 60),
  },
  // Big smooth arc under page heroes, ruby → orchid → amethyst
  f: {
    id: "wave-grad-f",
    stops: ["var(--color-ruby)", "var(--color-orchid)", "var(--color-amethyst)"],
    back: "M0 30 Q 720 150 1440 30 V 110 Q 720 -10 0 110 Z",
    front: "M0 50 Q 720 150 1440 50 V 80 Q 720 -10 0 80 Z",
  },
  // Diagonal slanted bands, orchid → amethyst → lagoon
  g: {
    id: "wave-grad-g",
    stops: ["var(--color-orchid)", "var(--color-amethyst)", "var(--color-lagoon)"],
    back: "M0 110 L1440 20 V70 L0 130 Z",
    front: "M0 80 L1440 50 V90 L0 105 Z",
  },
} as const;

/**
 * Decorative SVG wave that bridges two sections.
 * The wrapper has zero height and sits exactly on the section boundary; the SVG is
 * centered on that line (half over the section above, half over the one below).
 */
export function WaveDivider({ variant = "a" }: { variant?: keyof typeof VARIANTS }) {
  const v = VARIANTS[variant];
  const flipped = "flip" in v && v.flip;
  // Unique per instance: the same variant can appear several times on a page.
  const gradId = `${v.id}-${useId().replace(/:/g, "")}`;

  // Ribbon motion is a CSS animation on `.wave-path` (app/globals.css).
  // z-10: the next section is also positioned and later in the DOM, so at z-0 its
  // background would paint over the lower half of the wave.
  // Height is shared through --wave-h so the negative margins always cancel it out:
  // the divider occupies no layout space and overlaps its neighbours instead.
  return (
    <div
      aria-hidden
      className={`pointer-events-none relative z-10 h-(--wave-h) w-full overflow-hidden [--wave-h:80px] sm:[--wave-h:100px] lg:[--wave-h:120px] ${
        flipped ? "-mb-(--wave-h)" : "-mt-[calc(var(--wave-h)/2)] -mb-[calc(var(--wave-h)/2)]"
      }`}
    >
      <svg
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        className="block h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor={v.stops[0]} />
            <stop offset="50%" stopColor={v.stops[1]} />
            <stop offset="100%" stopColor={v.stops[2]} />
          </linearGradient>
        </defs>
        <g transform={flipped ? "translate(0 140) scale(1 -1)" : undefined}>
          <path className="wave-path" d={v.back} fill={`url(#${gradId})`} opacity="0.35" />
          <path className="wave-path" d={v.front} fill={`url(#${gradId})`} opacity="0.7" />
        </g>
      </svg>
    </div>
  );
}
