"use client";

import { BarChart3, Check, Server, Zap } from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { cn } from "@/lib/cn";
import { money0 } from "@/lib/format";
import { ButtonLink } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Section, SectionHeader } from "./Sections";

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
    text: "More compute power for demanding workloads and performance-sensitive applications.",
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
    <Section id="pricing">
      <SectionHeader
        title="Simple, transparent cloud pricing"
        body="Get the performance your applications need without the complexity. Pay only for the cloud resources you use, with flexible options that grow alongside your business."
      />
      <div className="grid w-full gap-6 md:grid-cols-3">
        {lines.map((l) => {
          const plan = plans?.find((p) => p.id === l.planId);
          return (
            <article key={l.name} className={cn("do-card flex flex-col", l.recommended ? "border border-foam-200" : "do-card-border-light")}>
              <div className="flex flex-1 flex-col gap-6 px-8 pt-8">
                <div className="flex items-center justify-between gap-3">
                  <span className="grid size-12 place-items-center rounded-lg border border-line bg-canvas text-foam-200 [&_svg]:size-6">{l.icon}</span>
                  {l.recommended ? <span className="rounded-full bg-foam-200 px-3 py-1 text-xs font-medium text-deep-50">Recommended</span> : null}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="t-xl2 font-display font-bold text-ink">{l.name}</h3>
                  <p className="text-base text-ink-2">{l.text}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-end gap-1.5">
                    {loading || !plan ? (
                      <Skeleton className="h-10 w-32" />
                    ) : (
                      <>
                        <span className="t-xl4 t-display">{money0(plan.priceMonthly)}</span>
                        <span className="pb-1.5 text-base text-muted">/ month</span>
                      </>
                    )}
                  </div>
                  {plan ? (
                    <p className="text-sm text-muted">
                      {plan.vcpu} vCPU · {plan.memoryGb} GB memory · {plan.storageGb} GB SSD · {plan.bandwidthTb} TB transfer
                    </p>
                  ) : (
                    <Skeleton className="h-4 w-48" />
                  )}
                </div>
                <hr className="border-0 border-b border-line" />
                <ul className="flex flex-col gap-3">
                  {l.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-base text-ink-2">
                      <Check className="size-5 shrink-0 text-foam-200" strokeWidth={2.25} /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-8 pb-8 pt-8">
                <ButtonLink href={`/register?plan=${l.planId}`} variant={l.recommended ? "primary" : "secondary"} className="w-full">
                  Get started
                </ButtonLink>
              </div>
            </article>
          );
        })}
      </div>
      <p className="max-w-[640px] text-center text-sm text-muted">Demo pricing from the shared plan catalog. Final cost depends on your selected configuration and usage.</p>
    </Section>
  );
}
