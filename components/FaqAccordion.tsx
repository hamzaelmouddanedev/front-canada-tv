"use client";

import { useId, useState } from "react";

type Item = { question: string; answer: string };

/** One item open at a time, like the design's accordion. */
export function FaqAccordion({ items }: { items: Item[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div>
      {items.map((item, i) => {
        const open = openIndex === i;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={i} className={`mb-[0.8rem] overflow-hidden rounded-[14px] border transition-colors duration-200 ${open ? "border-lagoon/45" : "border-lagoon/20"}`}>
            <h3>
              <button
                type="button"
                className={`flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-[1.2rem] text-left text-[0.98rem] font-semibold transition-colors duration-200 hover:bg-lagoon/8 ${open ? "bg-lagoon/8 text-ice" : "bg-harbor/10 text-fg"}`}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : i)}
              >
                <span>{item.question}</span>
                <span className={`flex size-7 min-w-7 items-center justify-center rounded-full border border-lagoon/25 text-xs text-lagoon transition duration-300 ${open ? "rotate-180 bg-lagoon/15" : ""}`} aria-hidden>▼</span>
              </button>
            </h3>
            <div id={panelId} role="region" className={`grid transition-[grid-template-rows] duration-350 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`} aria-hidden={!open}>
              <div className="overflow-hidden">
                <p className="px-6 pt-4 pb-[1.4rem] text-[0.92rem] leading-[1.8] whitespace-pre-line text-muted">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
