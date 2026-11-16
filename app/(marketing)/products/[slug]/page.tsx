import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { productDetails } from "@/lib/pages";
import { Banner, CardGrid, LogoGrid, PageHero, SplitBand } from "@/features/marketing/Blocks";
import { Accordion, ComparisonTable, Tabs, TestimonialCarousel } from "@/features/marketing/Interactive";
import { LayerArt } from "@/features/marketing/Illustrations";
import { CtaBanner, Section, SectionHeader, TextLink } from "@/features/marketing/Sections";
import { ButtonLink } from "@/components/ui/Button";

export function generateStaticParams() {
  return productDetails.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = productDetails.find((x) => x.slug === slug);
  return { title: p ? p.name : "Product" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = productDetails.find((x) => x.slug === slug);
  if (!p) notFound();
  const artIndex = Math.max(0, productDetails.indexOf(p));

  return (
    <>
      <PageHero title={p.hero.title} body={p.hero.body} primary={{ label: "Get started", href: "/register" }} secondary={{ label: "Contact sales", href: "/contact" }} />

      <Section size="compact" gap="gap-0">
        <Banner {...p.banner} />
      </Section>

      {/* Feature showcase */}
      <Section gap="gap-10">
        <SectionHeader title={p.showcase.title} />
        <div className="grid w-full gap-8 lg:grid-cols-[20rem_1fr] lg:items-start">
          <LayerArt index={artIndex} />
          <CardGrid items={p.showcase.cards} columns={3} variant="button" compact />
        </div>
        <p className="flex flex-wrap gap-6 text-sm">
          <Link href="/#customers" className="do-inlinelink">
            Regional availability
          </Link>
          <Link href="/legal#terms" className="do-inlinelink">
            Service-level agreements
          </Link>
        </p>
      </Section>

      {/* Plan type cards */}
      <Section gap="gap-10">
        <SectionHeader title={p.plans.title} />
        <CardGrid items={p.plans.cards} columns={4} variant="button" compact />
        <div className="grid w-full gap-6 md:grid-cols-2">
          <div className="do-card do-card-border-soft flex flex-col gap-3 p-6">
            <h3 className="font-sans text-lg font-bold leading-[26px] text-ink">{p.plans.callout}</h3>
            <TextLink href={p.plans.calloutLink}>Learn more about Premium servers</TextLink>
          </div>
          <div className="do-card do-card-border-soft flex flex-col gap-3 p-6">
            <h3 className="font-sans text-lg font-bold leading-[26px] text-ink">{p.plans.promo}</h3>
            <TextLink href={p.plans.promoLink}>Learn more about one-click deploys</TextLink>
          </div>
        </div>
      </Section>

      {/* Savings band */}
      <Section size="compact" gap="gap-0">
        <SplitBand title={p.savings.title} cta={p.savings.cta} href="/contact" art={<LayerArt index={(artIndex + 2) % 6} />} />
      </Section>

      {/* Pricing comparison */}
      <Section gap="gap-10">
        <SectionHeader title={p.comparison.title} body={p.comparison.body} cta={<ButtonLink href="/pricing">{p.comparison.cta}</ButtonLink>} />
        <ComparisonTable tabs={p.comparison.tabs} heading={p.comparison.heading} rows={p.comparison.rows} />
      </Section>

      {/* Tools grid */}
      <Section gap="gap-10">
        <SectionHeader title={p.tools.title} />
        <CardGrid items={p.tools.cards} columns={3} variant="link" compact />
      </Section>

      {/* Distributions / images */}
      <Section gap="gap-10">
        <SectionHeader title={p.images.title} />
        <Tabs label="Images" tabs={p.images.tabs.map((t) => ({ label: t.label, content: <LogoGrid names={t.logos} /> }))} />
      </Section>

      {/* Testimonials */}
      <Section size="compact" gap="gap-0">
        <TestimonialCarousel slides={p.testimonials} />
      </Section>

      {/* FAQ */}
      <Section gap="gap-10">
        <SectionHeader title={`Frequently asked questions about Northstar ${p.name}`} />
        <Accordion items={p.faqs} idPrefix={`faq-${p.slug}`} />
      </Section>

      <CtaBanner />
    </>
  );
}
