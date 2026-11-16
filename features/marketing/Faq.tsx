"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { faqs } from "@/lib/content";
import { LastUpdated } from "@/components/layout/SiteChrome";
import { Section, SectionHeader } from "./Sections";

/** Two-column accordion (FAQSection columns2 + AccordionDrawer). */
export function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const half = Math.ceil(faqs.length / 2);
  const columns = [faqs.slice(0, half), faqs.slice(half)];

  return (
    <Section id="faq">
      <SectionHeader title="Frequently asked questions" />
      <div className="flex w-full flex-col gap-6 md:flex-row md:items-start">
        {columns.map((col, c) => (
          <div key={c} className="flex min-w-0 flex-1 flex-col gap-6">
            {col.map((f) => {
              const i = faqs.indexOf(f);
              const isOpen = open === i;
              return (
                <div key={f.q} className="overflow-hidden rounded-lg border border-line-soft bg-surface p-5">
                  <h3 className="m-0 flex font-sans">
                    <button
                      type="button"
                      id={`faq-q-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className={cn(
                        "flex w-full items-center justify-between gap-4 border-b text-left transition-[padding,border-color] duration-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-foam-200",
                        isOpen ? "border-line pb-3" : "border-transparent",
                      )}
                    >
                      <span className="text-lg font-medium leading-[26px] text-ink">{f.q}</span>
                      <ChevronDown className={cn("size-6 shrink-0 text-ink-2 transition-transform duration-200", isOpen && "rotate-180")} aria-hidden="true" />
                    </button>
                  </h3>
                  <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className="do-accordion-content" data-open={isOpen}>
                    <div>
                      <p className="pt-4 text-base text-ink-2">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <LastUpdated className="text-center" />
    </Section>
  );
}
