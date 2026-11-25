import { sectionLabel, sectionSubCenter } from "@/lib/ui";

type Props = { label?: string; title: string; sub?: string };

const bg =
  "bg-[image:radial-gradient(ellipse_at_20%_0%,rgb(0_147_213/0.18)_0%,transparent_55%),linear-gradient(135deg,rgb(220_20_60/0.72)_0%,rgb(92_75_138/0.75)_50%,rgb(13_8_16/0.94)_100%),url('/_opt/candaherosection-1264.webp')] bg-cover bg-center bg-no-repeat";

export function PageHero({ label, title, sub }: Props) {
  return (
    <header
      className={`relative border-b border-teal/20 px-8 pt-18 pb-14 text-center max-[480px]:px-[1.2rem] ${bg}`}
    >
      {label && <span className={sectionLabel}>{label}</span>}
      <h1 className="mb-4 text-[clamp(2rem,4.5vw,3rem)] leading-[1.2] font-black text-white">{title}</h1>
      {sub && <p className={sectionSubCenter}>{sub}</p>}
    </header>
  );
}
