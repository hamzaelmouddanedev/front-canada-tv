import type { Metadata } from "next";
import { ChannelsSlider } from "@/components/ChannelsSlider";
import { FaqSection } from "@/components/FaqSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Hero } from "@/components/Hero";
import { InfoSections } from "@/components/InfoSections";
import { MoviesSlider } from "@/components/MoviesSlider";
import { JsonLd } from "@/components/JsonLd";
import { WaveDivider } from "@/components/WaveDivider";
import { PricingSection } from "@/components/PricingSection";
import { getFaqPage, getHomePage, getInfoSections, getPlanSection, getPlans } from "@/lib/data";
import { getI18n } from "@/lib/locale";
import { faqNode, graph, productNode } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [{ locale, tr }, home] = await Promise.all([getI18n(), getHomePage()]);
  return buildMetadata(home?.seo, {
    title: tr(home?.title),
    description: tr(home?.shortDescription),
    path: "/",
  }, locale);
}

export default async function HomePage() {
  const [{ locale, ui, tr }, home, infoSections, plans, planSection, faq] = await Promise.all([
    getI18n(),
    getHomePage(),
    getInfoSections(),
    getPlans(),
    getPlanSection(),
    getFaqPage(),
  ]);

  const jsonLd = graph(
    ...plans.map((plan) => productNode(plan, locale)),
    ...(faq?.questions?.length ? [faqNode(faq, "/", tr(faq.title) || ui.faq.title, locale)] : []),
  );

  return (
    <>
      {jsonLd["@graph"].length > 0 && <JsonLd data={jsonLd} />}
      <Hero home={home} />
      <ChannelsSlider />
      <InfoSections sections={infoSections} leaves mockup />
      <FeaturesSection />
      <WaveDivider />
      <MoviesSlider />
      <WaveDivider variant="b" />
      <PricingSection plans={plans} section={planSection} leaves />
      <WaveDivider />
      <FaqSection faq={faq} />
    </>
  );
}
