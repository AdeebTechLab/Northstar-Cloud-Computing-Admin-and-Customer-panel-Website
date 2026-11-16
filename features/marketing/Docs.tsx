"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { docs } from "@/lib/content";
import { longDate } from "@/lib/format";
import { Input } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/States";
import { LastUpdated } from "@/components/layout/SiteChrome";
import { Section, SectionHeader } from "./Sections";
import { CodeBlock } from "./Terminal";

const categories = ["All", "Getting started", "Servers", "Security", "Billing", "API"] as const;

export function DocsView() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const [open, setOpen] = useState<string | null>(null);

  // Open the article named in the URL hash (e.g. /docs#ssh-keys from search).
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.slice(1);
      if (id && docs.some((d) => d.id === id)) {
        setOpen(id);
        window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return docs.filter((d) => (cat === "All" || d.category === cat) && (!t || `${d.title} ${d.summary} ${d.steps.join(" ")}`.toLowerCase().includes(t)));
  }, [q, cat]);

  return (
    <div className="do-glow-soft">
      <Section gap="gap-10" innerClassName="max-w-[944px]">
        <div className="flex w-full flex-col items-center gap-8">
          <SectionHeader as="h1" eyebrow="Documentation" title="Guides and developer docs" body="Everything you need to deploy, secure and manage your Northstar Cloud servers." />
          <div className="w-full max-w-lg">
            <Input leading={<Search />} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the docs, e.g. ssh, firewall, invoice" aria-label="Search the documentation" className="h-11 rounded-full pl-10!" />
          </div>
          {/* Category tabs (Tabs.buttonContainer) */}
          <div className="scroll-none flex max-w-full gap-2 overflow-x-auto rounded-full bg-surface p-2" role="group" aria-label="Filter by category">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                aria-pressed={cat === c}
                className={cn("shrink-0 rounded-[64px] px-4 py-2 text-base transition-colors duration-200", cat === c ? "bg-foam-200 font-medium text-deep-50" : "text-ink-2 hover:bg-surface-2")}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col gap-6">
          {list.length === 0 ? (
            <div className="rounded-lg border border-line-soft bg-surface">
              <EmptyState title="No articles match your search" message="Try a different word or clear the category filter." />
            </div>
          ) : (
            list.map((d) => {
              const isOpen = open === d.id;
              return (
                <article key={d.id} id={d.id} className="scroll-mt-24 overflow-hidden rounded-lg border border-line-soft bg-surface p-5">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : d.id)}
                    aria-expanded={isOpen}
                    aria-controls={`doc-${d.id}`}
                    className={cn("flex w-full items-start gap-4 border-b text-left transition-[padding,border-color] duration-200", isOpen ? "border-line pb-4" : "border-transparent")}
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-lg border border-line bg-canvas text-foam-200">
                      <BookOpen className="size-6" strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="text-sm font-medium text-foam-200">{d.category}</span>
                      <span className="mt-0.5 block text-lg font-medium leading-[26px] text-ink">{d.title}</span>
                      <span className="mt-1 block text-sm text-muted">{d.summary}</span>
                    </span>
                    <ChevronDown className={cn("mt-3 size-6 shrink-0 text-ink-2 transition-transform duration-200", isOpen && "rotate-180")} aria-hidden="true" />
                  </button>
                  <div id={`doc-${d.id}`} className="do-accordion-content" data-open={isOpen}>
                    <div>
                      <div className="flex flex-col gap-4 pt-4 sm:pl-16">
                        <ol className="list-decimal space-y-1.5 pl-6 text-base text-ink-2 marker:font-semibold marker:text-foam-200">
                          {d.steps.map((s) => (
                            <li key={s}>{s}</li>
                          ))}
                        </ol>
                        {d.code ? <CodeBlock title={d.title} code={d.code} /> : null}
                        <p className="text-sm text-muted">Article updated {longDate(d.updated)}</p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
        <LastUpdated className="text-center" />
      </Section>
    </div>
  );
}
