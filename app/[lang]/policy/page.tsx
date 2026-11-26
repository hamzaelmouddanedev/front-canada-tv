import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { WaveDivider } from "@/components/WaveDivider";
import { localePath } from "@/lib/i18n";
import { ORG_ID, WEBSITE_ID } from "@/lib/jsonld";
import { getI18n } from "@/lib/locale";
import { siteUrl } from "@/lib/sanity/env";
import { buildMetadata } from "@/lib/seo";
import { btnPrimary, panelCard, proseText, section } from "@/lib/ui";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, ui } = await getI18n();
  return buildMetadata(undefined, { title: ui.policy.title, description: ui.policy.sub, path: "/policy" }, locale);
}

export default async function PolicyPage() {
  const { locale, ui, href } = await getI18n();
  const url = `${siteUrl}${localePath(locale, "/policy")}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${url}#webpage`,
          url,
          name: ui.policy.title,
          description: ui.policy.sub,
          inLanguage: locale,
          isPartOf: { "@id": WEBSITE_ID },
          publisher: { "@id": ORG_ID },
        }}
      />
      <PageHero label={ui.policy.label} title={ui.policy.title} sub={ui.policy.sub} />
      <WaveDivider variant="f" />
      <section className={section}>
        <div className="mx-auto grid max-w-[820px] gap-6">
          {ui.policy.sections.map(([title, text]) => (
            <article key={title} className={panelCard}>
              <h2 className="mb-3 text-[1.2rem] font-extrabold text-white">{title}</h2>
              <p className={proseText}>{text}</p>
            </article>
          ))}
          <div className="mt-4 text-center">
            <Link href={href("/contact")} className={btnPrimary}>
              {ui.contactUs}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
