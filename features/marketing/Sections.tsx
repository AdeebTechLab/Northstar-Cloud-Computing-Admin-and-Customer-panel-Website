import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { BookOpen, FileText, Newspaper } from "lucide-react";
import { cn } from "@/lib/cn";
import { resources } from "@/lib/content";
import { ButtonLink } from "@/components/ui/Button";
import { CtaArcs, PerformanceArt } from "./Illustrations";
import { TerminalWindow } from "./Terminal";

/* ------------------------------------------------------------------
   Layout primitives cloned from DigitalOcean's Section / SectionHeader /
   TextLink components.
------------------------------------------------------------------- */

export function Section({
  id,
  className,
  innerClassName,
  size,
  gap = "gap-16",
  children,
}: {
  id?: string;
  className?: string;
  innerClassName?: string;
  size?: "compact" | "small" | "medium";
  gap?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("do-section scroll-mt-20", className)}>
      <div className={cn("do-inner", size === "compact" && "do-inner-compact", size === "medium" && "do-inner-medium", innerClassName)}>
        <div className={cn("flex w-full flex-col items-center", gap)}>{children}</div>
      </div>
    </section>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string; dot?: boolean }) {
  return <p className={cn("text-sm font-medium text-foam-200", className)}>{children}</p>;
}

export function SectionHeader({
  title,
  body,
  cta,
  eyebrow,
  align = "center",
  bodyWeight = "normal",
  as: Tag = "h2",
  className,
}: {
  title: ReactNode;
  body?: ReactNode;
  cta?: ReactNode;
  eyebrow?: ReactNode;
  align?: "center" | "left";
  bodyWeight?: "normal" | "medium";
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const center = align === "center";
  return (
    <div className={cn("flex w-full max-w-[864px] flex-col gap-4", center ? "mx-auto items-center text-center" : "items-start text-left", className)}>
      <div className="flex w-full flex-col gap-2">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <Tag className={cn(Tag === "h1" ? "t-xl5" : "t-xl4", "t-display")}>{title}</Tag>
        {body ? <p className={cn("max-w-[640px] text-base text-ink-2", bodyWeight === "medium" && "font-medium", center && "mx-auto")}>{body}</p> : null}
      </div>
      {cta ? <div className={cn("flex w-full", center ? "justify-center" : "justify-start")}>{cta}</div> : null}
    </div>
  );
}

/** Arrow that grows in on hover (TextLink arrowShaft / arrowHead). */
export function LinkArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={cn("size-5 shrink-0", className)} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path className="arrow-shaft" d="M4 10h11" />
      <path className="arrow-head" d="M10 5l5 5-5 5" />
    </svg>
  );
}

export function TextLink({ className, children, onColor, ...rest }: ComponentProps<typeof Link> & { onColor?: boolean }) {
  return (
    <Link className={cn("do-textlink", onColor && "text-deep-1000", className)} {...rest}>
      {children}
      <LinkArrow />
    </Link>
  );
}

/* ------------------------------------------------------------------
   "Performance, economics, and simplicity — together."  (FeatureSplit)
------------------------------------------------------------------- */
export function Performance() {
  return (
    <Section id="performance">
      <SectionHeader title="Performance, economics, and simplicity — together." />
      <div className="flex w-full flex-col gap-16">
        <div className="flex w-full flex-col items-center gap-12 md:flex-row md:gap-16">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <h3 className="t-xl4 font-display font-bold text-ink">Performance proven in production</h3>
            <div className="flex flex-col gap-4 text-base text-ink-2">
              <p>Servers ready in about a minute. 3× higher sustained throughput than entry-level providers on the same NVMe workload. The most consistent latency across regions of any platform we have benchmarked.</p>
              <p>
                <strong className="font-bold">Open images you already trust</strong>
              </p>
              <p>Ubuntu, Debian, Rocky Linux and Docker-ready images, plus your own snapshots, on one API. Pick the image per deployment and your tooling does not change when a better one ships.</p>
              <p>
                <strong className="font-bold">Built for how builders ship</strong>
              </p>
              <p>One CLI. One API. One bill. Deploy in one command, and leave on the same terms. The complexity of stitching together multiple vendors is gone.</p>
              <p>
                <strong className="font-bold">Economics that compound as you scale</strong>
              </p>
              <p>Northstar runs the hardware, the network fabric and the control plane end-to-end. Every optimisation below the line passes forward automatically. Performance and unit economics improve together.</p>
            </div>
          </div>
          <div className="w-full min-w-0 flex-1">
            <PerformanceArt />
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-12 md:flex-row-reverse md:gap-16">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <h3 className="t-xl4 font-display font-bold text-ink">From terminal to production, without the friction</h3>
            <div className="flex flex-col gap-4 text-base text-ink-2">
              <p>A cloud platform should feel like a tool, not a maze. Provision infrastructure, automate repetitive work, and get back to building the product your users love.</p>
              <p>
                <strong className="font-bold">Infrastructure as code</strong> brings repeatable environments into your existing workflow. <strong className="font-bold">Predictable performance</strong> maps compute to your workload and growth. <strong className="font-bold">Observability that helps</strong> shows instance health and resource usage at a glance.
              </p>
            </div>
            <TextLink href="/docs">Explore developer docs</TextLink>
          </div>
          <div className="w-full min-w-0 flex-1">
            <TerminalWindow />
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------
   Resources carousel
------------------------------------------------------------------- */
const typeIcon = { Tutorials: BookOpen, Articles: FileText, Blog: Newspaper } as const;

export function Resources() {
  return (
    <Section id="resources" gap="gap-8">
      <div className="flex min-h-10 w-full flex-wrap items-center gap-6">
        <h2 className="t-xl4 t-display">Resources</h2>
        <ButtonLink href="/community" variant="secondary" size="sm">
          View all
        </ButtonLink>
      </div>
      <div className="scroll-none -mx-6 flex w-[calc(100%+3rem)] snap-x snap-mandatory gap-8 overflow-x-auto px-6 pb-1 md:mx-0 md:w-full md:px-0">
        {resources.map((r) => {
          const Icon = typeIcon[r.type];
          return (
            <article key={r.title} className="do-card do-card-border-light flex min-h-[200px] w-[84%] shrink-0 snap-start flex-col justify-between sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)]">
              <div className="flex flex-col gap-6 px-6 pt-6 md:px-8">
                <span className="inline-flex items-center gap-4">
                  <span className="grid size-12 place-items-center rounded-lg border border-line bg-canvas text-foam-200">
                    <Icon className="size-6" strokeWidth={1.75} />
                  </span>
                  <span className="text-base text-ink">{r.type}</span>
                </span>
                <h3 className="t-xl2 font-display font-bold text-ink">{r.title}</h3>
              </div>
              <div className="px-6 pb-6 pt-6 md:px-8">
                <TextLink href={r.href}>Get started</TextLink>
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------
   Final call to action (CTAText alignCenter on the purple gradient)
------------------------------------------------------------------- */
export function CtaBanner() {
  return (
    <Section size="compact" gap="gap-0">
      <div className="relative flex w-full flex-col items-center overflow-clip rounded-3xl bg-surface px-6 py-12 text-center md:py-14">
        <div aria-hidden="true" className="do-cta-aurora absolute inset-0 z-0" />
        <CtaArcs side="left" />
        <CtaArcs side="right" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="flex max-w-[720px] flex-col gap-2">
            <h3 className="t-xl5 t-display text-deep-1000">Start building today</h3>
            <p className="text-base text-deep-950 md:text-lg">
              From high-performance compute and cloud firewalls to backups and billing, get everything you need to build, scale, and deploy your applications.
            </p>
          </div>
          <ButtonLink href="/register" variant="white">
            Sign up
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
