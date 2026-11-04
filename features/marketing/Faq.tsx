"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { faqs } from "@/lib/content";
import { LastUpdated, Reveal } from "@/components/layout/SiteChrome";
import { Eyebrow } from "./Sections";

/** Expandable FAQ (accordion). First question is open, like the design. */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal className="text-center">
          <Eyebrow dot={false}>Help center</Eyebrow>
          <h2 className="mt-4 text-[28px] font-bold tracking-[-0.02em] text-slate-900 sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-slate-500">Find answers to common questions about our cloud infrastructure, deployment process, pricing, and support.</p>
        </Reveal>
        <Reveal className="mt-12 border-t border-line">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className={cn("text-[15px] font-semibold transition-colors", isOpen ? "text-brand-600" : "text-slate-900 group-hover:text-brand-600")}>{f.q}</span>
                    <span className={cn("grid size-7 shrink-0 place-items-center rounded-full transition-all duration-300", isOpen ? "rotate-180 bg-brand-600 text-white" : "bg-brand-50 text-brand-600 group-hover:bg-brand-100")}>
                      {isOpen ? <Minus className="size-3.5" strokeWidth={3} /> : <Plus className="size-3.5" strokeWidth={3} />}
                    </span>
                  </button>
                </h3>
                <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className={cn("grid transition-[grid-template-rows] duration-300 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden">
                    <p className="pb-5 pr-12 text-sm leading-relaxed text-slate-500">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
        <LastUpdated className="mt-6 text-center" />
      </div>
    </section>
  );
}
