"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cardOldPrice, cardPrice, cardSave } from "@/lib/ui";

export type PlanCardData = {
  id: string;
  href: string;
  title: string;
  shortDescription: string;
  description: string;
  price: string;
  oldPrice?: string;
  savePercent?: number;
  imageUrl?: string;
  imageAlt: string;
  salesCount?: number;
  featured: boolean;
  /** 12-month plan: gets its own warm colour so it stands out from the others. */
  yearly?: boolean;
};

type Labels = {
  bestSeller: string;
  sold: string;
  save: string;
  showDetails: string;
  hideDetails: string;
  oneTime: string;
  cta: string;
};

export function PlanCard({ plan, labels }: { plan: PlanCardData; labels: Labels }) {
  const router = useRouter();

  // Clicking the card body opens the plan page; its own links/buttons keep their behavior.
  const onCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a, button")) return;
    router.push(plan.href);
  };

  return (
    <>
    <article
      className={`relative flex cursor-pointer flex-col overflow-hidden rounded-[20px] border px-8 py-10 text-center transition duration-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[20px] before:bg-linear-to-b before:from-orchid/8 before:to-transparent before:to-60% ${
        plan.yearly
          ? "border-2 border-gold shadow-[0_0_30px_-10px_rgba(255,210,122,0.45)] hover:-translate-y-3 hover:scale-[1.02] hover:shadow-[0_18px_60px_-12px_rgba(255,210,122,0.7)]"
          : plan.featured
            ? "border-vivid hover:-translate-y-2"
            : "border-lagoon/15 bg-harbor/10 hover:-translate-y-1.5 hover:border-lagoon/45"
      }`}
      onClick={onCardClick}
    >
      {plan.featured && <div className="absolute top-4 left-1/2 z-2 -translate-x-1/2 rounded-full bg-cta px-4 py-1 text-[0.72rem] font-bold whitespace-nowrap text-white">{labels.bestSeller}</div>}

      {plan.imageUrl ? (
        <div className={`relative mx-auto mb-[1.2rem] aspect-[16/10] w-full overflow-hidden rounded-[14px] border ${plan.yearly ? "border-peach/40" : "border-lagoon/20"} bg-linear-135 from-orchid/20 to-harbor/20 ${plan.featured ? "mt-[1.8rem]" : ""}`}>
          <Image src={plan.imageUrl} alt={plan.imageAlt} fill sizes="(max-width: 768px) 90vw, 360px" className="object-contain" />
        </div>
      ) : (
        <div
          className={`mx-auto mb-[1.2rem] flex size-14 items-center justify-center rounded-2xl border bg-linear-135 text-2xl ${
            plan.yearly
              ? `border-peach/50 from-peach/40 to-flamingo/30 ${plan.featured ? "mt-[1.8rem]" : ""}`
              : plan.featured ? "mt-[1.8rem] border-transparent from-ruby via-orchid to-periwinkle" : "border-lagoon/20 from-orchid/20 to-harbor/20"
          }`}
          aria-hidden
        >📺</div>
      )}

      <h3 className="mb-[0.4rem] text-[1.35rem] font-extrabold text-white">{plan.title}</h3>
      {plan.salesCount ? (
        <div className="mb-[1.2rem] text-[0.82rem] font-semibold text-lagoon">
          {plan.salesCount}+ {labels.sold}
        </div>
      ) : (
        <div className="mb-[1.2rem] text-[0.82rem] font-semibold text-lagoon">&nbsp;</div>
      )}

      <div className={`${cardPrice} ${plan.yearly ? "text-peach!" : ""}`}>{plan.price}</div>
      {plan.oldPrice && (
        <div className={cardOldPrice}>
          <s className="opacity-80">{plan.oldPrice}</s>
          {plan.savePercent ? (
            <span className={cardSave}>
              {labels.save} {plan.savePercent}%
            </span>
          ) : null}
        </div>
      )}
      <div className="mb-[1.2rem] text-[0.78rem] text-muted">{labels.oneTime}</div>

      {/* Cards show only the short description; the full one lives on the plan page. */}
      <p className="mb-4 min-h-[72px] text-left text-[0.95rem] leading-[1.7] whitespace-pre-line text-muted">{plan.shortDescription}</p>

      <Link
        href={plan.href}
        className={`mt-auto block w-full cursor-pointer rounded-full border p-[0.8rem] text-[0.95rem] font-bold transition-[background-position,background-color,scale] duration-300 hover:scale-[1.03] ${
          plan.yearly
            ? "border-transparent bg-linear-to-r from-peach to-flamingo text-white hover:brightness-110"
            : plan.featured
            ? "border-transparent bg-cta text-white hover:bg-right"
            : "border-lagoon/40 bg-transparent text-lagoon hover:bg-lagoon/10"
        }`}
      >
        {labels.cta}
      </Link>
    </article>

    </>
  );
}
