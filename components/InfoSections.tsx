import Image from "next/image";
import { Fragment } from "react";
import { MapleLeafBackground } from "@/components/MapleLeafBackground";
import { WaveDivider } from "@/components/WaveDivider";
import { altText } from "@/lib/i18n";
import { getI18n } from "@/lib/locale";
import { hasImage, urlFor } from "@/lib/sanity/image";
import type { InfoSection } from "@/lib/sanity/types";
import { featureIcon, infoCard, infoCardHover, section, sectionLabel, sectionSub, sectionTitle } from "@/lib/ui";

type Feature = { icon?: string; text: string };

type Props = {
  sections: InfoSection[];
  /** Optional feature rows rendered under the first section (aboutPage.list). */
  features?: Feature[];
  id?: string;
  /** Show the animated maple-leaf background (home and about pages). */
  leaves?: boolean;
};

/** "About" block(s) driven by Sanity `infoSection` documents. */
export async function InfoSections({ sections, features, id = "about", leaves = false }: Props) {
  const { ui, tr } = await getI18n();
  const items: (InfoSection | null)[] = sections.length ? sections : [null];

  return (
    <section id={id} className={`${section} relative isolate overflow-hidden`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-35 animate-rainbow bg-size-[400%_400%] bg-[linear-gradient(120deg,var(--color-crimson),var(--color-violet),var(--color-teal),var(--color-steel),var(--color-crimson))]" />
        <div className="absolute inset-0 opacity-35 [animation-delay:-7s] mask-[linear-gradient(90deg,transparent_25%,#000_75%)] max-md:mask-[linear-gradient(180deg,transparent_25%,#000_75%)] animate-rainbow bg-size-[400%_400%] bg-[linear-gradient(120deg,var(--color-crimson),var(--color-violet),var(--color-teal),var(--color-steel),var(--color-crimson))]" />
        {leaves && <MapleLeafBackground />}
      </div>
      {items.map((s, i) => {
        const title = s ? tr(s.title) : ui.about.title;
        const text = s ? tr(s.text) : "";
        const imageLeft = s?.imagePosition === "left";
        const alt = s && title ? altText(ui.alt.section, title) : ui.about.imageAlt;

        return (
          <Fragment key={s?._id ?? i}>
          {i > 0 && <WaveDivider variant={i % 2 ? "g" : "f"} />}
          <div className="relative mx-auto grid max-w-[1200px] grid-cols-2 items-center gap-20 not-first:mt-24 max-lg:gap-12 max-md:grid-cols-1">
            <div className={`max-md:order-2 ${imageLeft ? "order-2" : "order-1"}`}>
              {i === 0 && <span className={sectionLabel}>{ui.about.label}</span>}
              <h2 className={sectionTitle}>{title}</h2>
              {text && <p className={sectionSub}>{text}</p>}

              {i === 0 && features && features.length > 0 && (
                <div className="mt-10 flex flex-col gap-4">
                  {features.map((f, j) => (
                    <div className={`${infoCard} ${infoCardHover}`} key={j}>
                      <div className={featureIcon} aria-hidden>{f.icon || "✓"}</div>
                      <h3 className="text-[0.95rem] font-semibold text-fg">{f.text}</h3>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={`relative max-md:order-1 ${imageLeft ? "order-1" : "order-2"}`}>
              <div className="pointer-events-none absolute -inset-2 rounded-3xl border border-teal/20" />
              <div className="pointer-events-none absolute -inset-px z-1 rounded-[20px] bg-linear-135 from-crimson/15 via-teal/10 to-transparent to-60%" />
              {s && hasImage(s.image) ? (
                <Image
                  src={urlFor(s.image).width(1200).url()}
                  alt={alt}
                  width={1200}
                  height={800}
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="block h-auto w-full rounded-[20px]"
                />
              ) : (
                <Image
                  src="/canda_infosection.jpeg"
                  alt={alt}
                  width={1024}
                  height={1024}
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="block h-auto w-full rounded-[20px]"
                />
              )}
            </div>
          </div>
          </Fragment>
        );
      })}
    </section>
  );
}
