import { sectionLabel, sectionSubCenter } from "@/lib/ui";

type Props = { label?: string; title: string; sub?: string };

// Photo under a scarlet → ruby → orchid wash (the start of the page spectrum). The layer's bottom is
// masked out so it dissolves into main's bg-flow and the next section continues the same colours.
const bg =
  "bg-[image:linear-gradient(120deg,color-mix(in_oklab,var(--color-scarlet)_55%,var(--color-bg))_0%,color-mix(in_oklab,var(--color-ruby)_55%,var(--color-bg))_45%,color-mix(in_oklab,var(--color-orchid)_45%,var(--color-bg))_100%),url('/_opt/candaherosection-1376.webp')] bg-cover bg-center bg-no-repeat bg-blend-multiply mask-[linear-gradient(180deg,#000_65%,transparent)]";

export function PageHero({ label, title, sub }: Props) {
  return (
    <header className="relative isolate px-8 pt-18 pb-14 text-center max-[480px]:px-[1.2rem]">
      <div aria-hidden className={`absolute inset-0 -z-10 opacity-85 ${bg}`} />
      {label && <span className={sectionLabel}>{label}</span>}
      <h1 className="mb-4 text-[clamp(2rem,4.5vw,3rem)] leading-[1.2] font-black text-white">{title}</h1>
      {sub && <p className={sectionSubCenter}>{sub}</p>}
    </header>
  );
}
