import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cacheLife } from "next/cache";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Navbar } from "@/components/Navbar";
import { ScrollToTop } from "@/components/ScrollToTop";
import { getContactInfo, getFooter, getNavbar } from "@/lib/data";
import { LOCALES, t } from "@/lib/i18n";
import { graph, organizationNode, websiteNode } from "@/lib/jsonld";
import { getI18n } from "@/lib/locale";
import { siteUrl } from "@/lib/sanity/env";
import { SITE_NAME, buildNav } from "@/lib/site";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

// Both languages are prerendered; proxy.ts redirects locale-less URLs to one of them.
export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { ui } = await getI18n();
  return {
    metadataBase: new URL(siteUrl),
    title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
    description: ui.hero.desc,
  };
}

async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const { locale, ui, href } = await getI18n();
  const [navbar, footer, contact, year] = await Promise.all([
    getNavbar(),
    getFooter(),
    getContactInfo(),
    currentYear(),
  ]);
  const nav = buildNav(navbar, locale);

  return (
    <html lang={locale} className={`${inter.variable} scroll-smooth motion-reduce:scroll-auto`}>
      <body className="flex min-h-screen flex-col overflow-x-hidden bg-bg font-sans text-fg">
        <JsonLd data={graph(organizationNode(contact, locale, t(footer?.text, locale)), websiteNode(locale))} />
        <Navbar
          items={nav}
          locale={locale}
          homeHref={href("/")}
          ctaHref={href("/#plans")}
          ctaLabel={ui.subscribeNow}
          menuLabel={ui.menu}
          languageLabel={ui.language}
        />
        {/* bg-flow: one spectrum for the whole page; sections stay transparent so it reads as continuous. */}
        <main className="flex-1 bg-flow">{children}</main>
        <ScrollToTop label={ui.backToTop} />
        <Footer footer={footer} contact={contact} nav={nav} year={year} />
      </body>
    </html>
  );
}
