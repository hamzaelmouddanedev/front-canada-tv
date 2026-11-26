import { altText, getDict, localePath, t, type Locale } from "@/lib/i18n";
import { getI18n } from "@/lib/locale";
import { hasImage, urlFor } from "@/lib/sanity/image";
import type { Plan, PlanSection } from "@/lib/sanity/types";
import { formatPrice } from "@/lib/site";
import { emptyNote, section as sectionPadding, sectionHeadCenter, sectionLabel, sectionSubCenter, sectionTitle } from "@/lib/ui";
import { MapleLeafBackground } from "./MapleLeafBackground";
import { PlanSlider } from "./PlanSlider";
import { PlanCard, type PlanCardData } from "./PlanCard";

type Props = {
  plans: Plan[];
  section: PlanSection;
  /** Inner pages render their own <h1>, so the section header can be hidden. */
  showHeader?: boolean;
  /** Show the animated maple-leaf background (home and about pages). */
  leaves?: boolean;
};

export function toPlanCard(plan: Plan, locale: Locale, featuredId?: string): PlanCardData {
  const save =
    plan.oldPrice && plan.price && plan.oldPrice > plan.price
      ? Math.round((1 - plan.price / plan.oldPrice) * 100)
      : undefined;
  const title = t(plan.title, locale);
  return {
    id: plan._id,
    href: localePath(locale, `/plans/${plan.slug}`),
    title,
    shortDescription: t(plan.shortDescription, locale),
    description: t(plan.description, locale),
    price: formatPrice(plan.price, plan.currency, locale),
    oldPrice: save ? formatPrice(plan.oldPrice, plan.currency, locale) : undefined,
    savePercent: save,
    imageAlt: altText(getDict(locale).alt.plan, title),
    imageUrl: hasImage(plan.image) ? urlFor(plan.image).width(640).height(400).fit("crop").url() : undefined,
    salesCount: plan.salesCount,
    featured: plan._id === featuredId,
    yearly: isYearly(plan),
  };
}

/** 12-month plan (detected from its slug or EN/FR title, e.g. "12 Months" / "12 mois"). */
function isYearly(plan: Plan) {
  const text = `${plan.slug ?? ""} ${t(plan.title, "en")} ${t(plan.title, "fr")}`;
  return /(^|\D)12(\D|$)|year|annual|\ban\b|annuel/i.test(text);
}

/** The best-selling plan gets the "featured" treatment from the design. */
export function bestSellerId(plans: Plan[]) {
  const top = plans.reduce<Plan | undefined>(
    (best, p) => ((p.salesCount ?? 0) > (best?.salesCount ?? 0) ? p : best),
    undefined,
  );
  return top?._id;
}

export async function PricingSection({ plans, section, showHeader = true, leaves = false }: Props) {
  const { locale, ui, tr } = await getI18n();
  const featuredId = bestSellerId(plans);
  const labels = {
    bestSeller: ui.plans.bestSeller,
    sold: ui.plans.sold,
    save: ui.plans.save,
    showDetails: ui.plans.showDetails,
    hideDetails: ui.plans.hideDetails,
    oneTime: ui.plans.oneTime,
    cta: ui.subscribeNow,
  };

  return (
    <section id="plans" className={`${sectionPadding} relative isolate scroll-mt-20 overflow-hidden`}>
      {leaves && (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <MapleLeafBackground />
        </div>
      )}
      {showHeader ? (
        <div className={sectionHeadCenter}>
          <span className={sectionLabel}>{ui.plans.label}</span>
          <h2 className={sectionTitle}>{tr(section?.title) || ui.plans.title}</h2>
          <p className={sectionSubCenter}>{tr(section?.shorttext) || ui.plans.sub}</p>
        </div>
      ) : (
        <h2 className="sr-only">{tr(section?.title) || ui.plans.title}</h2>
      )}

      {plans.length ? (
        <PlanSlider prev={ui.plans.prev} next={ui.plans.next}>
          {plans.map((plan) => (
            <div key={plan._id} className="w-[360px] shrink-0 snap-center max-md:w-full max-md:max-w-none">
              <PlanCard plan={toPlanCard(plan, locale, featuredId)} labels={labels} />
            </div>
          ))}
        </PlanSlider>
      ) : (
        <p className={emptyNote}>{ui.plans.empty}</p>
      )}
    </section>
  );
}
