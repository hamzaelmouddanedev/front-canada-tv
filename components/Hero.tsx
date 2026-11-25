import Image from "next/image";
import Link from "next/link";
import { getI18n } from "@/lib/locale";
import type { HomePage } from "@/lib/sanity/types";
import { btnOutline, btnPrimary } from "@/lib/ui";
import { HeroTitle } from "@/components/HeroText";
import heroImage from "@/public/candaherosection.jpeg";

export async function Hero({ home }: { home: HomePage }) {
  const { ui, tr, href } = await getI18n();
  const title = tr(home?.title) || ui.hero.title;
  const desc = tr(home?.shortDescription) || ui.hero.desc;

  return (
    <section id="hero" className="relative isolate flex min-h-screen items-center overflow-hidden">
      <Image
        src={heroImage}
        alt={ui.alt.hero}
        fill
        // LCP image: load immediately at high priority (`priority` is deprecated in Next 16 and
        // emits a preload without fetchpriority). The <img> is in the SSR HTML, so it's discovered at once.
        loading="eager"
        fetchPriority="high"
        placeholder="blur"
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-bg/80 via-bg/40 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_50%,rgb(0_147_213/0.18)_0%,transparent_60%)]" />

      <div className="relative z-2 ml-[8%] max-w-[760px] px-8 max-md:ml-0 max-[480px]:px-[1.2rem]">
        <div className="mb-[1.8rem] inline-flex items-center gap-2 rounded-full border border-teal/35 bg-teal/15 px-4 py-[0.4rem] text-[0.82rem] font-semibold text-teal-light">
          <span className="size-[7px] animate-pulse-dot rounded-full bg-teal" />
          {ui.hero.badge}
        </div>

        <HeroTitle text={title} className="mb-[1.4rem] text-[clamp(2rem,5vw,3.6rem)] leading-[1.25] font-black text-white" />
        {/* Paragraph, buttons and stats fade/slide in one after another (CSS: .hero-reveal in globals.css). */}
        <div className="hero-reveal">
        <p className="mb-[2.4rem] max-w-[580px] text-[1.08rem] leading-[1.9] text-fg">
          {desc.split(" ").map((w, i) => (
            <span
              key={i}
              className="animate-hue-text motion-reduce:animate-none"
              style={{ animationDelay: `${-i * 0.5}s` }}
            >
              {w}{" "}
            </span>
          ))}
        </p>

        <div className="flex flex-wrap gap-4 max-[480px]:flex-col">
          <Link href={href("/#plans")} className={btnPrimary}>
            🎬 {ui.explorePlans}
          </Link>
          <Link href={href("/contact")} className={btnOutline}>
            {ui.contactUs}
          </Link>
        </div>

        <div className="mt-12 flex gap-10 border-t border-white/10 pt-8 max-md:gap-6 max-[480px]:flex-wrap">
          {ui.hero.stats.map(([num, label]) => (
            <div className="text-center" key={label}>
              <span className="block text-[1.8rem] font-black text-teal-light">{num}</span>
              <span className="text-[0.8rem] font-medium text-muted">{label}</span>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
