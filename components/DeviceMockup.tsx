"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/* Content: edit text and images here.                                 */
/* ------------------------------------------------------------------ */

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?fit=crop`;

type TabKey = "movies" | "sports" | "live";

type Screen = {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  meta: string;
  progressLabel: string;
  progress: number;
};

type MockupContent = {
  stream: string;
  tabsLabel: string;
  tabs: Record<TabKey, string>;
  screens: Record<TabKey, Screen>;
  badges: { premiere: string; audio: string };
  play: string;
  pause: string;
  vod: { image: string; alt: string; label: string; title: string; sub: string };
  sports: { image: string; alt: string; live: string; label: string; fps: string; title: string; sub: string };
  categories: { label: string; color: string }[];
  scroll: string;
};

const images = {
  neon: unsplash("1536440136628-849c177e76a1"),
  stadium: unsplash("1522778119026-d647f0596c20"),
  space: unsplash("1534447677768-be436bb09401"),
  seats: unsplash("1489599849927-2ee91cede3ba"),
  pitch: unsplash("1574629810360-7efbbe195018"),
};

const categoryColors = ["var(--mk-pink)", "var(--mk-indigo)", "var(--mk-cyan)"];

export const deviceMockupContent: Record<Locale, MockupContent> = {
  en: {
    stream: "4K HEVC Stream • 28.4 Mbps",
    tabsLabel: "Content type",
    tabs: { movies: "Movies 4K", sports: "Live Sports", live: "Live TV" },
    screens: {
      movies: {
        image: images.neon,
        alt: "Neon-lit cinema entrance at night",
        eyebrow: "On Demand • Ultra HD Blockbuster",
        title: "Cyber Horizon: Beyond the Orbit",
        meta: "2026 • Sci-Fi / Thriller • 2160p HDR10+ • Multi-Audio & Subtitles",
        progressLabel: "Live / 60FPS",
        progress: 60,
      },
      sports: {
        image: images.stadium,
        alt: "Floodlit football stadium packed with fans",
        eyebrow: "Live Now • Sports 4K",
        title: "Champions League: Matchday Live",
        meta: "Live • Football • 2160p 60FPS • Multi-Camera & Commentary",
        progressLabel: "Live / 60FPS",
        progress: 72,
      },
      live: {
        image: images.space,
        alt: "Starry night sky reflected on calm water",
        eyebrow: "Live TV • 20,000+ Channels",
        title: "Deep Space: Live Documentary",
        meta: "Now Playing • Documentary • 1080p / 4K • Catch-Up & EPG",
        progressLabel: "Live / HD",
        progress: 38,
      },
    },
    badges: { premiere: "4K Premiere", audio: "Dolby Atmos" },
    play: "Play",
    pause: "Pause",
    vod: { image: images.seats, alt: "Rows of red cinema seats", label: "VOD Library", title: "60,000+ Movies", sub: "Updated Daily in 4K HDR" },
    sports: {
      image: images.pitch,
      alt: "Football player at the ball on a stadium pitch",
      live: "Live",
      label: "Sports 4K",
      fps: "60 FPS",
      title: "Champions League",
      sub: "Stadium Feed • Zero Delay",
    },
    categories: ["Cinema", "Sports PPV", "News & Kids"].map((label, i) => ({ label, color: categoryColors[i] })),
    scroll: "Scroll to the movies section",
  },
  fr: {
    stream: "Flux 4K HEVC • 28,4 Mb/s",
    tabsLabel: "Type de contenu",
    tabs: { movies: "Films 4K", sports: "Sports en direct", live: "Télé en direct" },
    screens: {
      movies: {
        image: images.neon,
        alt: "Entrée de cinéma illuminée de néons la nuit",
        eyebrow: "Sur demande • Superproduction Ultra HD",
        title: "Cyber Horizon : au-delà de l'orbite",
        meta: "2026 • Science-fiction / Thriller • 2160p HDR10+ • Multi-audio et sous-titres",
        progressLabel: "Direct / 60 IPS",
        progress: 60,
      },
      sports: {
        image: images.stadium,
        alt: "Stade de football illuminé rempli de partisans",
        eyebrow: "En direct • Sports 4K",
        title: "Ligue des champions : match en direct",
        meta: "Direct • Football • 2160p 60 IPS • Multi-caméras et commentaires",
        progressLabel: "Direct / 60 IPS",
        progress: 72,
      },
      live: {
        image: images.space,
        alt: "Ciel étoilé se reflétant sur une eau calme",
        eyebrow: "Télé en direct • 20 000+ chaînes",
        title: "Espace profond : documentaire en direct",
        meta: "En ce moment • Documentaire • 1080p / 4K • Rattrapage et guide",
        progressLabel: "Direct / HD",
        progress: 38,
      },
    },
    badges: { premiere: "Première 4K", audio: "Dolby Atmos" },
    play: "Lecture",
    pause: "Pause",
    vod: { image: images.seats, alt: "Rangées de sièges de cinéma rouges", label: "Vidéothèque", title: "60 000+ films", sub: "Mise à jour quotidienne en 4K HDR" },
    sports: {
      image: images.pitch,
      alt: "Joueur de football au ballon sur la pelouse d'un stade",
      live: "Direct",
      label: "Sports 4K",
      fps: "60 IPS",
      title: "Ligue des champions",
      sub: "Signal du stade • Aucun délai",
    },
    categories: ["Cinéma", "Sports PPV", "Nouvelles et jeunesse"].map((label, i) => ({ label, color: categoryColors[i] })),
    scroll: "Défiler vers la section des films",
  },
};

/* ------------------------------------------------------------------ */

const TAB_KEYS: TabKey[] = ["movies", "sports", "live"];
const glass =
  "rounded-2xl border border-(--mk-line) bg-(--mk-glass) shadow-[0_24px_60px_-12px_rgba(0,0,0,0.65)] backdrop-blur-[16px]";
const eyebrowCls = "text-[0.62rem] font-bold tracking-[0.08em] uppercase";

/** Entrance (fade + slide, staggered) on the outer box, gentle bob on the inner one. */
function Float({
  className = "",
  innerClassName = "",
  delay,
  bob,
  children,
}: {
  className?: string;
  innerClassName?: string;
  delay: number;
  bob?: number;
  children: ReactNode;
}) {
  return (
    <div className={`mockup-in ${className}`} style={{ "--d": `${delay}s` } as CSSProperties}>
      <div className={`${bob ? "mockup-bob" : ""} ${innerClassName}`} style={bob ? ({ "--bob-d": `${bob}s` } as CSSProperties) : undefined}>
        {children}
      </div>
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return (
    <span className="relative flex size-2 shrink-0" aria-hidden>
      <span className="absolute inset-0 rounded-full opacity-60 mockup-ping" style={{ background: color }} />
      <span className="relative size-2 rounded-full animate-pulse-dot" style={{ background: color }} />
    </span>
  );
}

type Props = { locale: Locale; content?: MockupContent; scrollTarget?: string };

/** Layered "device mockup": TV screen with floating glass cards, switchable tabs and a mouse tilt. */
export function DeviceMockup({ locale, content = deviceMockupContent[locale], scrollTarget = "#movies" }: Props) {
  const [tab, setTab] = useState<TabKey>("movies");
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const screen = content.screens[tab];

  // Start the entrance animation when the mockup scrolls into view.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Subtle 3D tilt following the mouse (fine pointers only, off for reduced motion).
  useEffect(() => {
    const root = rootRef.current;
    const tilt = tiltRef.current;
    if (!root || !tilt) return;
    if (!matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const MAX = 6;
    let rect: DOMRect | null = null;
    let frame = 0;
    const onEnter = () => {
      rect = root.getBoundingClientRect(); // read once per hover, not per move
    };
    const onMove = (e: PointerEvent) => {
      if (!rect) rect = root.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        tilt.style.setProperty("--ry", `${(x * 2 * MAX).toFixed(2)}deg`);
        tilt.style.setProperty("--rx", `${(-y * 2 * MAX).toFixed(2)}deg`);
      });
    };
    const onLeave = () => {
      rect = null;
      cancelAnimationFrame(frame);
      tilt.style.setProperty("--rx", "0deg");
      tilt.style.setProperty("--ry", "0deg");
    };
    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onLeave, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onLeave);
    };
  }, []);

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = TAB_KEYS[(i + dir + TAB_KEYS.length) % TAB_KEYS.length];
    setTab(next);
    document.getElementById(`mockup-tab-${next}`)?.focus();
  };

  return (
    <div ref={rootRef} className="mockup relative isolate mx-auto w-full max-w-[640px] py-6" data-in={inView || undefined}>
      {/* Background: glows, vignette and grain, faded at the edges so there is no hard box. */}
      <div aria-hidden className="pointer-events-none absolute -inset-x-10 -inset-y-12 -z-10 mask-[radial-gradient(closest-side,#000_60%,transparent)] max-sm:-inset-x-4">
        <div className="absolute inset-0 rounded-[48px] bg-(--mk-bg) opacity-70" />
        <div className="absolute bottom-[5%] left-[2%] size-[55%] rounded-full bg-(--mk-pink) opacity-35 blur-[80px]" />
        <div className="absolute top-[2%] left-[25%] size-[50%] rounded-full bg-(--mk-purple) opacity-40 blur-[90px]" />
        <div className="absolute top-[25%] right-[0%] size-[45%] rounded-full bg-(--mk-blue) opacity-30 blur-[80px]" />
        <div className="mockup-noise absolute inset-0 opacity-[0.07] mix-blend-overlay" />
      </div>

      <div ref={tiltRef} className="mockup-tilt">
        {/* Top row: stream indicator + tabs, overlapping the top edge of the screen. */}
        <div className="relative z-20 flex items-end justify-between gap-3 sm:-mb-5 max-sm:mb-3 max-sm:flex-col max-sm:items-stretch">
          <Float delay={0.15} bob={6} className="sm:-ml-4 lg:-ml-8">
            <div className={`${glass} inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.72rem] font-semibold whitespace-nowrap text-white`}>
              <Dot color="var(--mk-green)" />
              {content.stream}
            </div>
          </Float>

          <Float delay={0.25} bob={7} className="min-w-0 sm:-mr-4 lg:-mr-8">
            <div
              role="tablist"
              aria-label={content.tabsLabel}
              className={`${glass} flex gap-1 overflow-x-auto rounded-full p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
            >
              {TAB_KEYS.map((key, i) => {
                const active = key === tab;
                return (
                  <button
                    key={key}
                    id={`mockup-tab-${key}`}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls="mockup-screen"
                    tabIndex={active ? 0 : -1}
                    onClick={() => setTab(key)}
                    onKeyDown={(e) => onTabKey(e, i)}
                    className={`shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-[0.72rem] font-bold whitespace-nowrap transition-colors duration-300 ${
                      active ? "bg-(image:--mk-grad) text-white shadow-[0_6px_20px_-6px_var(--mk-pink)]" : "text-white/55 hover:text-white"
                    }`}
                  >
                    {content.tabs[key]}
                  </button>
                );
              })}
            </div>
          </Float>
        </div>

        {/* Screen + overlapping cards. On phones the cards drop into a grid under the screen. */}
        <div className="relative sm:mb-12">
          <Float delay={0}>
            <div className="relative rounded-[20px] border border-(--mk-line) bg-[#05070d] p-2 shadow-[0_40px_90px_-20px_rgba(0,0,0,0.85),0_0_0_1px_rgba(0,0,0,0.6)]">
              <div
                id="mockup-screen"
                role="tabpanel"
                aria-labelledby={`mockup-tab-${tab}`}
                className="relative aspect-video overflow-hidden rounded-[14px] bg-black max-sm:aspect-4/3"
              >
                {TAB_KEYS.map((key) => (
                  <Image
                    key={key}
                    src={content.screens[key].image}
                    alt={key === tab ? content.screens[key].alt : ""}
                    aria-hidden={key !== tab}
                    fill
                    sizes="(max-width: 640px) 100vw, 640px"
                    className={`object-cover transition-[opacity,scale] duration-700 ${key === tab ? "scale-100 opacity-100" : "scale-105 opacity-0"}`}
                  />
                ))}
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/45 to-transparent max-sm:via-black/60" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-(--mk-red) px-2.5 py-1 text-[0.6rem] font-extrabold tracking-[0.08em] text-white uppercase">
                    <span className="size-1.5 rounded-full bg-white animate-pulse-dot" aria-hidden />
                    {content.badges.premiere}
                  </span>
                  <span className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[0.6rem] font-bold tracking-[0.08em] text-white uppercase backdrop-blur-md">
                    {content.badges.audio}
                  </span>
                </div>

                {/* Title block */}
                <div key={tab} className="mockup-fade absolute inset-x-0 bottom-0 flex items-end gap-4 p-4 pb-5 sm:p-5 sm:pb-7">
                  <div className="min-w-0 flex-1">
                    <p className={`${eyebrowCls} text-(--mk-cyan)`}>{screen.eyebrow}</p>
                    <p className="mt-1 text-[clamp(1.05rem,2.6vw,1.55rem)] leading-tight font-extrabold text-white">{screen.title}</p>
                    <p className="mt-1 truncate text-[0.72rem] text-white/60">{screen.meta}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
                        <div
                          className="mockup-progress h-full rounded-full bg-(image:--mk-grad)"
                          data-paused={playing ? undefined : ""}
                          style={{ width: `${screen.progress}%` }}
                        />
                      </div>
                      <span className="shrink-0 text-[0.6rem] font-bold tracking-[0.08em] text-white/70 uppercase">{screen.progressLabel}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPlaying((p) => !p)}
                    aria-label={playing ? content.pause : content.play}
                    className="mockup-glow flex size-14 shrink-0 cursor-pointer items-center justify-center rounded-full bg-(image:--mk-grad) text-white transition-transform duration-300 hover:scale-110 max-sm:size-11"
                  >
                    {playing ? (
                      <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
                        <rect x="6" y="5" width="4" height="14" rx="1" />
                        <rect x="14" y="5" width="4" height="14" rx="1" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="ml-0.5 size-5" fill="currentColor" aria-hidden>
                        <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
            {/* Stand */}
            <div aria-hidden className="absolute top-full left-1/2 -translate-x-1/2 max-sm:hidden">
              <div className="mx-auto h-7 w-16 bg-linear-to-b from-[#1a1d2b] to-[#0d0f18]" />
              <div className="h-2 w-44 rounded-full bg-linear-to-b from-[#232738] to-[#0d0f18] shadow-[0_10px_30px_rgba(0,0,0,0.7)]" />
            </div>
          </Float>

          <div className="grid grid-cols-2 gap-3 max-sm:mt-4 max-[420px]:grid-cols-1 sm:contents">
            {/* VOD library card */}
            <Float delay={0.4} bob={8} className="z-10 sm:absolute sm:top-[14%] sm:-right-6 lg:-right-12">
              <div className={`${glass} flex items-center gap-3 p-2.5 pr-4`}>
                <div className="relative size-12 shrink-0 overflow-hidden rounded-xl sm:size-14">
                  <Image src={content.vod.image} alt={content.vod.alt} fill sizes="56px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className={`${eyebrowCls} text-(--mk-cyan)`}>{content.vod.label}</p>
                  <p className="text-[0.95rem] font-extrabold whitespace-nowrap text-white">{content.vod.title}</p>
                  <p className="truncate text-[0.68rem] text-white/55">{content.vod.sub}</p>
                </div>
              </div>
            </Float>

            {/* Sports card */}
            <Float delay={0.55} bob={7} className="z-10 sm:absolute sm:top-[calc(100%-1.75rem)] sm:-left-6 sm:w-60 lg:-left-12">
              <div className={`${glass} flex items-center gap-3 p-2.5`}>
                <div className="relative size-12 shrink-0 overflow-hidden rounded-xl sm:size-14">
                  <Image src={content.sports.image} alt={content.sports.alt} fill sizes="56px" className="object-cover" />
                  <span className="absolute top-1 left-1 rounded bg-(--mk-red) px-1 text-[0.5rem] font-extrabold tracking-[0.08em] text-white uppercase">
                    {content.sports.live}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`${eyebrowCls} text-(--mk-pink)`}>{content.sports.label}</p>
                    <p className="text-[0.6rem] font-bold text-white/60">{content.sports.fps}</p>
                  </div>
                  <p className="truncate text-[0.95rem] font-extrabold text-white">{content.sports.title}</p>
                  <p className="truncate text-[0.68rem] text-white/55">{content.sports.sub}</p>
                </div>
              </div>
            </Float>
          </div>
        </div>

        {/* Category pills + scroll arrow */}
        <Float delay={0.7} className="mt-5 sm:mt-10" innerClassName="flex flex-col items-center gap-4">
          <ul className="flex flex-wrap justify-center gap-2">
            {content.categories.map((c) => (
              <li key={c.label} className={`${glass} flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.72rem] font-semibold text-white/85`}>
                <span className="size-2 rounded-full" style={{ background: c.color, boxShadow: `0 0 10px ${c.color}` }} aria-hidden />
                {c.label}
              </li>
            ))}
          </ul>
          <a
            href={scrollTarget}
            aria-label={content.scroll}
            className={`${glass} mockup-nudge flex size-10 items-center justify-center rounded-full text-white/80 transition-colors hover:text-white`}
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </a>
        </Float>
      </div>
    </div>
  );
}
