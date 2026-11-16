import type { Metadata } from "next";
import { pricingPage } from "@/lib/pages";
import { CategoryHeader, ChecklistBand, CtaStrip, JumpNav, PageHero, PricingCard, SplitBand } from "@/features/marketing/Blocks";
import { Accordion } from "@/features/marketing/Interactive";
import { LayerArt, PerformanceArt } from "@/features/marketing/Illustrations";
import { CtaBanner, Section, SectionHeader } from "@/features/marketing/Sections";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <>
      <PageHero title={pricingPage.hero.title} body={pricingPage.hero.body} primary={{ label: "Get Started", href: "/register" }}>
        <JumpNav items={pricingPage.categories.map((c) => ({ label: c.title, href: `#${c.id}` }))} />
      </PageHero>

      <Section size="compact" gap="gap-6">
        <SectionHeader title={pricingPage.intro.title} cta={<ButtonLink href="/contact" variant="secondary">{pricingPage.intro.cta}</ButtonLink>} />
      </Section>

      {pricingPage.categories.map((c) => (
        <Section key={c.id} id={c.id} gap="gap-8" size="compact">
          <CategoryHeader title={c.title} />
          <div className="grid w-full gap-6 md:grid-cols-2 lg:grid-cols-3">
            {c.items.map((it) => (
              <PricingCard key={it.title} item={it} />
            ))}
          </div>
        </Section>
      ))}

      <Section size="compact" gap="gap-0">
        <CtaStrip text="Have custom needs or a large deployment to plan? Our team can help." cta="Contact sales" href="/contact" />
      </Section>

      <Section size="compact" gap="gap-0">
        <SplitBand title="See how much you will pay with our pricing calculator" body="Pick a region, image and plan and see the monthly estimate before you deploy." cta="We will do the math" href="/dashboard/servers/new" art={<PerformanceArt />} />
      </Section>

      <Section gap="gap-0">
        <ChecklistBand title="Platform benefits" items={pricingPage.benefits} art={<LayerArt index={4} />} />
      </Section>

      <Section size="compact" gap="gap-6">
        <SplitBand title="Experience a 186% return on investment" body="An independent study of Northstar customers found $2.37M in benefits against $829K in costs over three years, with payback in under six months." cta="Read the study" href="/customers" art={<LayerArt index={5} />} />
        <SplitBand title="Industry-leading bandwidth pricing" body="Every server includes an outbound transfer quota starting at 500 GiB per month, pooled across your account. Overage is just $0.01 per GiB." cta="Go to bandwidth calculator" href="/dashboard/servers/new" art={<LayerArt index={2} />} artSide="left" />
      </Section>

      <Section gap="gap-10">
        <SectionHeader title="Frequently asked questions" />
        <Accordion items={pricingPage.faqs} idPrefix="faq-pricing" />
      </Section>

      <Section size="compact" gap="gap-0">
        <CtaStrip text="Still have questions? Our sales team can walk you through pricing for your workload." cta="Contact sales" href="/contact" />
      </Section>

      <CtaBanner />
    </>
  );
}
