"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { docs } from "@/lib/content";
import { longDate } from "@/lib/format";
import { CopyButton } from "@/components/ui/CopyButton";
import { Input } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/States";
import { LastUpdated } from "@/components/layout/SiteChrome";
import { Eyebrow } from "./Sections";

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
    <section className="bg-[#f8faff] py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center animate-fade-up">
          <Eyebrow>Documentation</Eyebrow>
          <h1 className="mt-4 text-[32px] font-bold tracking-[-0.02em] text-slate-900 sm:text-4xl">Guides &amp; developer docs</h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] text-slate-500">Everything you need to deploy, secure and manage your Northstar Cloud servers.</p>
          <div className="mx-auto mt-8 max-w-lg">
            <Input leading={<Search />} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the docs, e.g. ssh, firewall, invoice" aria-label="Search the documentation" className="h-11" />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter by category">
            {categories.map((c) => (
              <button key={c} type="button" onClick={() => setCat(c)} aria-pressed={cat === c} className={cn("rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors", cat === c ? "border-brand-600 bg-brand-600 text-white" : "border-line bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900")}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 space-y-3">
          {list.length === 0 ? (
            <div className="rounded-xl border border-line bg-white">
              <EmptyState title="No articles match your search" message="Try a different word or clear the category filter." />
            </div>
          ) : (
            list.map((d) => {
              const isOpen = open === d.id;
              return (
                <article key={d.id} id={d.id} className={cn("scroll-mt-24 rounded-xl border bg-white transition-shadow", isOpen ? "border-brand-200 shadow-pop" : "border-line hover:shadow-card")}>
                  <button type="button" onClick={() => setOpen(isOpen ? null : d.id)} aria-expanded={isOpen} className="flex w-full items-start gap-4 p-5 text-left">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600"><BookOpen className="size-[18px]" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">{d.category}</span>
                      <span className="mt-0.5 block text-base font-semibold text-slate-900">{d.title}</span>
                      <span className="mt-1 block text-sm text-slate-500">{d.summary}</span>
                    </span>
                    <ChevronDown className={cn("mt-1 size-5 shrink-0 text-slate-400 transition-transform duration-300", isOpen && "rotate-180 text-brand-600")} />
                  </button>
                  {isOpen ? (
                    <div className="border-t border-line px-5 pb-5 pt-4 animate-fade-in sm:pl-[76px]">
                      <ol className="list-decimal space-y-1.5 pl-5 text-sm text-slate-600 marker:font-semibold marker:text-brand-600">
                        {d.steps.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ol>
                      {d.code ? (
                        <div className="relative mt-4 overflow-hidden rounded-lg bg-navy-900">
                          <div className="absolute right-2 top-2">
                            <CopyButton value={d.code} dark showText />
                          </div>
                          <pre className="overflow-x-auto p-4 pr-24 font-mono text-[12.5px] leading-relaxed text-slate-200"><code>{d.code}</code></pre>
                        </div>
                      ) : null}
                      <p className="mt-4 text-xs text-slate-500">Article updated {longDate(d.updated)}</p>
                    </div>
                  ) : null}
                </article>
              );
            })
          )}
        </div>
        <LastUpdated className="mt-8 text-center" />
      </div>
    </section>
  );
}
