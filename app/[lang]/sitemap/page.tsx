import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { formatDate } from "@/components/PostCard";
import { WaveDivider } from "@/components/WaveDivider";
import { localePath, preferredLocale, type Locale } from "@/lib/i18n";
import { getI18n } from "@/lib/locale";
import { getRouteIndex, type RouteEntry, type Section } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { formatPrice } from "@/lib/site";
import { chip, panelCard, section } from "@/lib/ui";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, ui } = await getI18n();
  return buildMetadata(undefined, { title: ui.sitemap.title, description: ui.sitemap.sub, path: "/sitemap" }, locale);
}

const SECTIONS: { key: Section; icon: string }[] = [
  { key: "pages", icon: "🧭" },
  { key: "plans", icon: "📺" },
  { key: "blog", icon: "📰" },
];

export default async function SitemapPage() {
  const [{ locale, ui, tr }, routes] = await Promise.all([getI18n(), getRouteIndex()]);

  const label = (entry: RouteEntry) =>
    entry.pageKey === "sitemap"
      ? ui.sitemap.title
      : entry.pageKey === "policy"
        ? ui.footer.policy
        : entry.pageKey ? ui.nav[entry.pageKey] : tr(entry.title) || entry.path;

  const detail = (entry: RouteEntry) => {
    if (entry.section === "plans" && entry.price != null) return formatPrice(entry.price, entry.currency, locale);
    if (entry.section === "blog" && entry.publishedAt) return formatDate(entry.publishedAt, locale);
    return null;
  };

  return (
    <>
      <PageHero label={ui.sitemap.label} title={ui.sitemap.title} sub={ui.sitemap.sub} />
      <WaveDivider variant="f" />
      <section className={section}>
        <div className="mx-auto grid max-w-[1200px] grid-cols-3 items-start gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
          {SECTIONS.map(({ key, icon }) => {
            const entries = routes.filter((e) => e.section === key && e.locales.length);
            if (!entries.length) return null;
            return (
              <nav
                key={key}
                aria-labelledby={`sitemap-${key}`}
                className={panelCard}
              >
                <h2 id={`sitemap-${key}`} className="mb-5 flex items-center gap-3 text-[1.1rem] font-extrabold text-white">
                  <span className="flex size-9 items-center justify-center rounded-[10px] bg-cta text-base" aria-hidden>
                    {icon}
                  </span>
                  {ui.sitemap[key]}
                  <span className="ml-auto text-[0.8rem] font-semibold text-muted">{entries.length}</span>
                </h2>
                <ul className="grid gap-1">
                  {entries.map((entry) => {
                    // A document without content in this language links to the language that has it.
                    const target: Locale = entry.locales.includes(locale) ? locale : preferredLocale(entry.locales);
                    const info = detail(entry);
                    return (
                      <li key={entry.path}>
                        <Link
                          href={localePath(target, entry.path)}
                          hrefLang={target}
                          className="group flex items-baseline gap-3 rounded-xl px-3 py-[0.55rem] text-[0.92rem] text-fg transition-colors duration-200 hover:bg-lagoon/8 hover:text-ice"
                        >
                          <span className="text-lagoon transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden>
                            ›
                          </span>
                          <span className="min-w-0 flex-1 break-words">{label(entry)}</span>
                          {target !== locale && (
                            <span className={chip} title={ui.sitemap.otherLanguage}>
                              {target.toUpperCase()}
                            </span>
                          )}
                          {info && <span className="shrink-0 text-[0.78rem] whitespace-nowrap text-muted">{info}</span>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            );
          })}
        </div>
      </section>
    </>
  );
}
