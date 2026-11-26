import type { ReactNode } from "react";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { getI18n } from "@/lib/locale";
import { section, sectionHeadCenter, sectionLabel, sectionSubCenter, sectionTitle } from "@/lib/ui";

/** Lucide-style 24×24 stroke icon. */
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width={28}
      height={28}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feature-icon"
    >
      {children}
    </svg>
  );
}

/**
 * Card visuals, in the same order as `ui.features.items` (lib/i18n.ts holds the
 * localized stat / title / text). Edit both together to add or reorder cards.
 */
const CARDS: { accent: string; icon: ReactNode }[] = [
  {
    accent: "#f43f5e",
    icon: (
      <Icon>
        <rect width="20" height="15" x="2" y="7" rx="2" />
        <polyline points="17 2 12 7 7 2" />
      </Icon>
    ),
  },
  {
    accent: "#a855f7",
    icon: (
      <Icon>
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M7 3v18M3 7.5h4M3 12h18M3 16.5h4M17 3v18M17 7.5h4M17 16.5h4" />
      </Icon>
    ),
  },
  {
    accent: "#38bdf8",
    icon: (
      <Icon>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </Icon>
    ),
  },
  {
    accent: "#ec4899",
    icon: (
      <Icon>
        <rect width="20" height="14" x="2" y="3" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <text x="12" y="12.6" textAnchor="middle" fontSize="6.5" fontWeight="800" fill="currentColor" stroke="none">
          4K
        </text>
      </Icon>
    ),
  },
  {
    accent: "#3b82f6",
    icon: (
      <Icon>
        <path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8" />
        <path d="M10 19v-3.96 3.15" />
        <path d="M7 19h5" />
        <rect width="6" height="10" x="16" y="12" rx="2" />
      </Icon>
    ),
  },
  {
    accent: "#fb7185",
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </Icon>
    ),
  },
];

type Props = { id?: string };

/** "Why choose us" grid of six feature cards (home page, under About). */
export async function FeaturesSection({ id = "features" }: Props) {
  const { ui } = await getI18n();
  const f = ui.features;
  const headingId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={headingId} className={`${section} relative isolate overflow-hidden`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Faint dot grid, faded toward the edges. */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[22px_22px] mask-[radial-gradient(ellipse_at_center,#000_40%,transparent_80%)]" />
        {/* Pink / blue glow in the bottom-right corner. */}
        <div className="absolute -right-40 -bottom-40 size-[640px] rounded-full opacity-[0.12] blur-3xl bg-[radial-gradient(circle_at_center,#ec4899,#3b82f6_55%,transparent_70%)]" />
      </div>

      <div className={sectionHeadCenter}>
        <span className={sectionLabel}>{f.label}</span>
        <h2 id={headingId} className={sectionTitle}>{f.title}</h2>
        <p className={sectionSubCenter}>{f.sub}</p>
      </div>

      <FeaturesGrid>
        {f.items.map((item, i) => {
          const card = CARDS[i % CARDS.length];
          return (
            <article
              key={item.title}
              className="feature-card relative overflow-hidden rounded-[20px] border border-white/6 bg-[#151826] p-8 max-[480px]:p-6"
              style={{ "--accent": card.accent, "--i": i } as React.CSSProperties}
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className="feature-icon-box flex size-16 shrink-0 items-center justify-center rounded-[14px] border border-white/8 bg-white/3"
                  style={{ color: card.accent }}
                >
                  {card.icon}
                </div>
                <span className="rounded-full border border-white/10 bg-white/4 px-[14px] py-1.5 text-[13px] font-semibold whitespace-nowrap text-slate-300">
                  {item.stat}
                </span>
              </div>
              <h3 className="mt-10 text-[22px] leading-snug font-bold text-white">{item.title}</h3>
              <p className="mt-3 text-base leading-[1.75] text-[#94a3b8]">{item.text}</p>
            </article>
          );
        })}
      </FeaturesGrid>
    </section>
  );
}
