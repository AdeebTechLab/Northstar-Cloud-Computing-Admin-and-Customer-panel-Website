import type { Metadata } from "next";
import { customersPage } from "@/lib/pages";
import { CtaStrip, LogoGrid, PageHero } from "@/features/marketing/Blocks";
import { CaseStudyGrid } from "@/features/marketing/Interactive";
import { Cityscape } from "@/features/marketing/Illustrations";
import { Section, SectionHeader, TextLink } from "@/features/marketing/Sections";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Customers" };

export default function CustomersPage() {
  const strip = <CtaStrip text={customersPage.strip.text} cta={customersPage.strip.cta} href="#customer-stories" />;
  return (
    <>
      <PageHero title={customersPage.hero.title} body={customersPage.hero.body} center>
        <ButtonLink href="#customer-stories">{customersPage.hero.cta}</ButtonLink>
        <div className="do-card do-card-border-soft h-56 w-full md:h-80">
          <Cityscape />
        </div>
      </PageHero>

      <Section size="compact" gap="gap-0">
        <LogoGrid names={customersPage.logos} />
      </Section>

      {/* Featured stories */}
      <Section gap="gap-10">
        <SectionHeader title="Featured stories" align="left" />
        <div className="flex w-full flex-col gap-8">
          {customersPage.featured.map((f, i) => (
            <article key={f.company} className={cn("do-card do-card-border-light flex flex-col md:flex-row", i % 2 === 1 && "md:flex-row-reverse")}>
              <div className="flex min-h-[220px] flex-1 items-center justify-center bg-surface-2 p-8">
                <span className="font-display text-3xl font-extrabold text-deep-900">{f.company}</span>
              </div>
              <div className="flex flex-1 flex-col justify-between gap-6 p-8 md:p-10">
                <div className="flex flex-col gap-4">
                  {f.headline ? <h3 className="t-xl3 t-display">{f.headline}</h3> : null}
                  {f.quote ? <blockquote className="t-xl2 font-display font-bold text-ink">“{f.quote}”</blockquote> : null}
                  {f.attribution ? <p className="text-sm text-ink-2">{f.attribution}</p> : null}
                  {f.stat ? <p className="text-sm font-medium text-foam-200">{f.stat}</p> : null}
                  <p className="text-sm text-muted">{f.products.join(" · ")}</p>
                </div>
                <TextLink href="#customer-stories">Learn more</TextLink>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section size="compact" gap="gap-0">
        {strip}
      </Section>

      <Section id="customer-stories" gap="gap-10">
        <SectionHeader title="See how teams like yours are building" align="left" />
        <CaseStudyGrid chips={customersPage.chips} items={customersPage.grid} />
      </Section>

      <Section gap="gap-10">
        <SectionHeader title="Proof at every layer" align="left" />
        <div className="grid w-full gap-6 md:grid-cols-2 lg:grid-cols-5">
          {customersPage.proof.map((q) => (
            <article key={q.company} className="do-card do-card-border-light flex flex-col justify-between gap-6 p-6">
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-medium text-foam-200">{q.category}</h3>
                <span className="font-display text-lg font-bold text-deep-900">{q.company}</span>
                <blockquote className="text-base text-ink">“{q.quote}”</blockquote>
                <p className="text-sm text-muted">{q.attribution}</p>
              </div>
              <TextLink href={q.href}>Learn more</TextLink>
            </article>
          ))}
        </div>
      </Section>

      <Section size="compact" gap="gap-0">
        {strip}
      </Section>
    </>
  );
}
