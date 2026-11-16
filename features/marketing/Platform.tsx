"use client";

import Link from "next/link";
import { useState } from "react";
import { Cpu, Database, Globe, LayoutGrid, Server, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/cn";
import { platformLayers } from "@/lib/content";
import { LayerArt } from "./Illustrations";
import { Section, SectionHeader, TextLink } from "./Sections";

const icons = [Cpu, Database, Globe, ShieldCheck, LayoutGrid, Server];

/** Vertical tabs + illustration/copy split ("Built for … Open at every layer."). */
export function PlatformLayers() {
  const [active, setActive] = useState(0);
  const layer = platformLayers[active];

  return (
    <Section id="platform">
      <SectionHeader
        title="Built for every workload. Open at every layer."
        body="From compute to networking to the hardware underneath, every layer is purpose-built and integrated end-to-end. Most providers only offer one or two services, or bury them among 300 disconnected products."
        bodyWeight="medium"
        cta={<TextLink href="/products">Browse all products</TextLink>}
      />
      <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">
        <div role="tablist" aria-orientation="vertical" aria-label="Platform layers" className="scroll-none -mx-6 flex gap-2 overflow-x-auto px-6 lg:mx-0 lg:w-72 lg:shrink-0 lg:flex-col lg:overflow-visible lg:px-0">
          {platformLayers.map((l, i) => {
            const Icon = icons[i];
            const on = i === active;
            return (
              <button
                key={l.id}
                type="button"
                role="tab"
                id={`tab-${l.id}`}
                aria-selected={on}
                aria-controls={`panel-${l.id}`}
                onClick={() => setActive(i)}
                className="group inline-flex min-h-10 shrink-0 items-center gap-2 text-left outline-none"
              >
                <span className={cn("grid shrink-0 place-items-center text-foam-200 transition-all duration-200", on ? "size-10" : "size-8")}>
                  <Icon className="size-full" strokeWidth={1.5} />
                </span>
                <span
                  className={cn(
                    "rounded-[64px] px-4 py-2 text-base transition-colors duration-200 group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-foam-200",
                    on ? "bg-foam-200 font-medium text-deep-50" : "text-ink-2 group-hover:bg-surface-2",
                  )}
                >
                  {l.label}
                </span>
              </button>
            );
          })}
        </div>

        <div key={layer.id} role="tabpanel" id={`panel-${layer.id}`} aria-labelledby={`tab-${layer.id}`} className="grid w-full min-w-0 flex-1 gap-8 animate-fade-in md:grid-cols-[20rem_1fr] md:items-start">
          <div className="w-full">
            <LayerArt index={active} />
          </div>
          <div className="flex min-w-0 flex-col">
            <h2 className="t-xl3 t-display">{layer.heading}</h2>
            <p className="mt-4 text-base text-ink-2">{layer.body}</p>
            <hr className="my-6 border-0 border-b border-line" />
            <p className="text-base font-bold text-ink-2">Products</p>
            <ul className="my-2 list-disc pl-6 text-base text-ink-2">
              {layer.products.map((p) => (
                <li key={p.label}>
                  {p.href ? (
                    <Link href={p.href} className="do-inlinelink">
                      {p.label}
                    </Link>
                  ) : (
                    p.label
                  )}
                  {p.note ? ` (${p.note})` : ""}
                </li>
              ))}
            </ul>
            <hr className="my-6 border-0 border-b border-line" />
            <p className="text-base font-bold text-ink-2">Open Source Integrations</p>
            <p className="mt-2 text-base text-ink-2">{layer.integrations}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
