"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { TextLink } from "./Sections";

/** Pill tab bar (Tabs.buttonContainer) with one panel per tab. */
export function Tabs({ tabs, label }: { tabs: { label: string; content: ReactNode }[]; label: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className="flex w-full flex-col items-center gap-8">
      <div role="tablist" aria-label={label} className="scroll-none flex max-w-full gap-2 overflow-x-auto rounded-full bg-surface p-2">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={cn("shrink-0 rounded-[64px] px-4 py-2 text-base transition-colors duration-200", i === active ? "bg-foam-200 font-medium text-deep-50" : "text-ink-2 hover:bg-surface-2")}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" key={active} className="w-full animate-fade-in">
        {tabs[active]?.content}
      </div>
    </div>
  );
}

/** Accordion list (AccordionDrawer), one or two columns. */
export function Accordion({ items, columns = 1, idPrefix = "acc" }: { items: { q: string; a: string }[]; columns?: 1 | 2; idPrefix?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const half = Math.ceil(items.length / 2);
  const groups = columns === 2 ? [items.slice(0, half), items.slice(half)] : [items];
  return (
    <div className="flex w-full flex-col gap-6 md:flex-row md:items-start">
      {groups.map((group, g) => (
        <div key={g} className="flex min-w-0 flex-1 flex-col gap-6">
          {group.map((f) => {
            const i = items.indexOf(f);
            const isOpen = open === i;
            return (
              <div key={f.q} className="overflow-hidden rounded-lg border border-line-soft bg-surface p-5">
                <h3 className="m-0 flex font-sans">
                  <button
                    type="button"
                    id={`${idPrefix}-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${idPrefix}-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className={cn("flex w-full items-center justify-between gap-4 border-b text-left transition-[padding,border-color] duration-200", isOpen ? "border-line pb-3" : "border-transparent")}
                  >
                    <span className="text-lg font-medium leading-[26px] text-ink">{f.q}</span>
                    <ChevronDown className={cn("size-6 shrink-0 text-ink-2 transition-transform duration-200", isOpen && "rotate-180")} aria-hidden="true" />
                  </button>
                </h3>
                <div id={`${idPrefix}-a-${i}`} role="region" aria-labelledby={`${idPrefix}-q-${i}`} className="do-accordion-content" data-open={isOpen}>
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
  );
}

/** Provider price comparison with a CPU-count tab bar. */
export function ComparisonTable({ tabs, heading, rows }: { tabs: string[]; heading: string; rows: { tab: string; memory: string; storage: string; bandwidth: string; us: string; a: string; b: string; c: string }[] }) {
  const [tab, setTab] = useState(tabs[0]);
  const visible = rows.filter((r) => r.tab === tab);
  return (
    <div className="flex w-full flex-col gap-6">
      <div role="tablist" aria-label="CPU count" className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t} type="button" role="tab" aria-selected={t === tab} onClick={() => setTab(t)} className={cn("rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-200", t === tab ? "border-transparent bg-foam-200 text-deep-50" : "border-line text-ink-2 hover:bg-hover")}>
            {t}
          </button>
        ))}
      </div>
      <div className="do-card do-card-border-light overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <caption className="px-6 pt-6 text-left font-sans text-lg font-bold leading-[26px] text-ink">{heading}</caption>
          <thead>
            <tr className="text-xs uppercase tracking-wide text-muted">
              {["Memory", "Storage", "Bandwidth", "Northstar", "Provider A", "Provider B", "Provider C"].map((h, i) => (
                <th key={h} scope="col" className={cn("px-6 py-4 font-semibold", i === 3 && "text-foam-200")}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.memory} className="border-t border-line text-ink-2">
                <td className="px-6 py-4">{r.memory}</td>
                <td className="px-6 py-4">{r.storage}</td>
                <td className="px-6 py-4">{r.bandwidth}</td>
                <td className="px-6 py-4 font-display text-lg font-bold text-foam-200">
                  {r.us} <span className="text-xs font-normal text-muted">bandwidth incl.</span>
                </td>
                <td className="px-6 py-4">{r.a}</td>
                <td className="px-6 py-4">{r.b}</td>
                <td className="px-6 py-4">{r.c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Quote carousel with pagination dots (split image + quote). */
export function TestimonialCarousel({ slides }: { slides: { company: string; quote: string; name: string; role: string }[] }) {
  const [i, setI] = useState(0);
  const s = slides[i];
  return (
    <div className="do-card do-card-border-light flex w-full flex-col md:flex-row">
      <div className="flex min-h-[220px] flex-1 items-center justify-center bg-surface-2 p-8 md:min-h-[320px]">
        <span className="font-display text-3xl font-extrabold text-deep-900">{s.company}</span>
      </div>
      <div key={i} className="flex flex-1 flex-col justify-between gap-8 p-8 animate-fade-in md:p-10">
        <blockquote className="t-xl2 font-display font-bold text-ink">“{s.quote}”</blockquote>
        <div className="flex flex-col gap-6">
          <p className="text-sm text-ink-2">
            <span className="block font-medium text-ink">{s.name}</span>
            {s.role}
          </p>
          <div className="flex items-center justify-between gap-4">
            <ButtonLink href="/customers" variant="secondary" size="sm">
              Read the full story
            </ButtonLink>
            <div className="flex gap-2" role="tablist" aria-label="Testimonials">
              {slides.map((_, d) => (
                <button key={d} type="button" role="tab" aria-selected={d === i} aria-label={`Testimonial ${d + 1}`} onClick={() => setI(d)} className={cn("size-2.5 rounded-full transition-colors", d === i ? "bg-foam-200" : "bg-deep-500 hover:bg-deep-600")} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Case-study grid with filter chips. */
export function CaseStudyGrid({ chips, items }: { chips: string[]; items: { company: string; summary: string; stat?: string; products: string[]; tag: string }[] }) {
  const [chip, setChip] = useState(chips[0]);
  const visible = items.filter((it) => chip === chips[0] || it.tag === chip);
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter stories">
        {chips.map((c) => (
          <button key={c} type="button" aria-pressed={c === chip} onClick={() => setChip(c)} className={cn("rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-200", c === chip ? "border-transparent bg-foam-200 text-deep-50" : "border-line text-ink-2 hover:bg-hover")}>
            {c}
          </button>
        ))}
      </div>
      <div className="grid w-full gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((it) => (
          <article key={it.company} className="do-card do-card-border-light flex flex-col justify-between animate-fade-in">
            <div className="flex flex-col gap-4 p-6 md:p-8">
              <div className="flex items-center justify-between gap-3">
                <span className="font-display text-xl font-bold text-deep-900">{it.company}</span>
                <span className="rounded-full bg-foam-900 px-2.5 py-0.5 text-xs font-medium text-foam-200">{it.tag}</span>
              </div>
              <div className="flex h-24 items-end rounded-xl bg-surface-2 p-4">
                <span className="font-display text-2xl font-extrabold text-ink">{it.stat ?? "Case study"}</span>
              </div>
              <p className="text-base text-ink-2">{it.summary}</p>
              <p className="text-sm text-muted">{it.products.join(" · ")}</p>
            </div>
            <div className="px-6 pb-6 md:px-8 md:pb-8">
              <TextLink href="/customers">Learn more</TextLink>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/** Vertical list of content types with the active one highlighted (Community sidebar). */
export function TypeList({ types }: { types: string[] }) {
  const [active, setActive] = useState(types[0]);
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-sans text-lg font-bold leading-[26px] text-ink">Content types</h2>
      <ul className="flex flex-wrap gap-2 md:flex-col md:gap-1">
        {types.map((t) => (
          <li key={t}>
            <Link href="/docs" onClick={() => setActive(t)} className={cn("block rounded-full px-4 py-2 text-base transition-colors duration-200 md:rounded-lg", t === active ? "bg-hover font-medium text-ink" : "text-ink-2 hover:bg-hover hover:text-ink")}>
              {t}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
