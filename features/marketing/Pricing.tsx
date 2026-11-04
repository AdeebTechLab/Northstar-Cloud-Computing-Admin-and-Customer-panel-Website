"use client";

import { ArrowRight, BarChart3, Check, Info, Server, Zap } from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { cn } from "@/lib/cn";
import { money0 } from "@/lib/format";
import { ButtonLink } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Reveal } from "@/components/layout/SiteChrome";
import { SectionHeading } from "./Sections";

/** Product lines shown on the website, each starting from a plan in the shared catalog. */
const lines = [
  {
    name: "Cloud Compute",
    planId: "starter",
    text: "Flexible, reliable compute for everyday workloads and growing applications.",
    icon: <Server />,
    features: ["Scalable virtual machines", "SSD-backed storage", "Flexible resource management"],
  },
  {
    name: "High Performance",
    planId: "business",
    text: "More compute power for demanding workloads and performance- sensitive applications.",
    icon: <Zap />,
    features: ["High-performance processors", "Fast NVMe storage options", "Optimized compute performance"],
    recommended: true,
  },
  {
    name: "Optimized Cloud Compute",
    planId: "professional",
    text: "Balanced resources tailored for specialized workloads and consistent application performance.",
    icon: <BarChart3 />,
    features: ["Workload-focused configurations", "Dedicated resource options", "Predictable scaling capabilities"],
  },
];

export function Pricing() {
  const { data: plans, loading } = useApi(() => api.catalog.plans(), [], { live: false });

  return (
    <section id="pricing" className="bg-[#f8faff] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Straightforward pricing"
          title="Simple, Transparent Cloud Pricing"
          sub="Get the performance your applications need without the complexity. Pay only for the cloud resources you use, with flexible options that grow alongside your business."
        />
        <div className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-3 md:items-stretch">
          {lines.map((l, i) => {
            const plan = plans?.find((p) => p.id === l.planId);
            return (
              <Reveal key={l.name} delay={i * 90} className="h-full">
                <div
                  className={cn(
                    "relative flex h-full flex-col rounded-2xl border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-pop sm:p-7",
                    l.recommended ? "border-brand-300 bg-gradient-to-b from-brand-50/80 to-white shadow-[0_10px_40px_-18px_rgba(37,99,235,0.45)] ring-1 ring-brand-200" : "border-line",
                  )}
                >
                  {l.recommended ? (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow">Recommended</span>
                  ) : null}
                  <span className={cn("grid size-10 place-items-center rounded-lg [&_svg]:size-[18px]", l.recommended ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-600")}>{l.icon}</span>
                  <h3 className="mt-6 text-lg font-semibold text-slate-900">{l.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{l.text}</p>
                  <div className="mt-6 flex items-end gap-1.5 border-b border-line pb-6">
                    {loading || !plan ? (
                      <Skeleton className="h-8 w-32" />
                    ) : (
                      <>
                        <span className={cn("text-[28px] font-bold leading-none tracking-tight", l.recommended ? "text-brand-600" : "text-slate-900")}>From {money0(plan.priceMonthly)}</span>
                        <span className="pb-0.5 text-[13px] text-slate-500">/ month</span>
                      </>
                    )}
                  </div>
                  <ul className="mt-6 flex-1 space-y-3">
                    {l.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                        <Check className="size-4 shrink-0 text-brand-600" strokeWidth={2.5} /> {f}
                      </li>
                    ))}
                  </ul>
                  <ButtonLink href={`/register?plan=${l.planId}`} variant={l.recommended ? "primary" : "secondary"} className="group mt-8 w-full" iconRight={<ArrowRight className="transition-transform group-hover:translate-x-0.5" />}>
                    Get Started
                  </ButtonLink>
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-10 flex items-center justify-center gap-2 text-center text-[13px] text-slate-500">
          <Info className="size-4 shrink-0" /> Demo pricing from the shared plan catalog. Final cost depends on your selected configuration and usage.
        </p>
      </div>
    </section>
  );
}
