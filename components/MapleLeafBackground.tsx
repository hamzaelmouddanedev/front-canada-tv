import { MapleLeaf } from "./MapleLeaf";

/** Position, size and timing of each leaf. Negative delays desync them from the first frame. */
const LEAVES = [
  { top: "6%", left: "4%", size: 200, drift: "26s", driftDelay: "0s", hueDelay: "0s", opacity: 0.2, tilt: -12 },
  { top: "12%", left: "72%", size: 150, drift: "20s", driftDelay: "-6s", hueDelay: "-2s", opacity: 0.17, tilt: 14 },
  { top: "48%", left: "40%", size: 260, drift: "32s", driftDelay: "-12s", hueDelay: "-4s", opacity: 0.11, tilt: -6 },
  { top: "62%", left: "8%", size: 120, drift: "18s", driftDelay: "-3s", hueDelay: "-6s", opacity: 0.19, tilt: 20 },
  { top: "70%", left: "80%", size: 180, drift: "24s", driftDelay: "-9s", hueDelay: "-1s", opacity: 0.15, tilt: -18 },
  { top: "34%", left: "88%", size: 100, drift: "16s", driftDelay: "-14s", hueDelay: "-5s", opacity: 0.19, tilt: 8 },
];

/** Decorative layer of drifting, colour-shifting maple leaves. Place inside a `relative` container. */
export function MapleLeafBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {LEAVES.map((l, i) => (
        <div
          key={i}
          className="absolute animate-leaf-drift motion-reduce:animate-none"
          style={{
            top: l.top,
            left: l.left,
            width: l.size,
            height: l.size,
            opacity: l.opacity,
            animationDuration: l.drift,
            animationDelay: l.driftDelay,
          }}
        >
          <MapleLeaf
            className="size-full animate-word-hue motion-reduce:animate-none"
            style={{ animationDelay: l.hueDelay, rotate: `${l.tilt}deg` }}
          />
        </div>
      ))}
    </div>
  );
}
