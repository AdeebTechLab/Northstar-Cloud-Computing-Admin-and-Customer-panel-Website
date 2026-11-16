import type { Metadata } from "next";
import { productsPage } from "@/lib/pages";
import { CardGrid, CategoryHeader, PageHero, Testimonial } from "@/features/marketing/Blocks";
import { CtaBanner, Section } from "@/features/marketing/Sections";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
  return (
    <>
      <PageHero title={productsPage.hero.title} body={productsPage.hero.body} secondary={{ label: "Contact sales", href: "/contact" }} primary={{ label: "Get started", href: "/register" }} />

      <Section gap="gap-10">
        <h2 className="t-xl3 t-display w-full max-w-[864px]">{productsPage.overviewTitle}</h2>
        <CardGrid items={productsPage.overview} columns={3} variant="link" />
      </Section>

      <Section size="compact">
        <Testimonial {...productsPage.testimonial} />
      </Section>

      {productsPage.categories.map((c) => (
        <Section key={c.id} id={c.id} gap="gap-8" size="compact">
          <CategoryHeader title={c.title} description={c.description} learnMore={c.learnMore} />
          <CardGrid items={c.items} columns={c.columns} variant={c.variant} compact />
        </Section>
      ))}

      <Section id="infrastructure" gap="gap-8" size="compact">
        <CategoryHeader title="Infrastructure" />
        <CardGrid items={productsPage.infrastructure} columns={2} variant="button" />
      </Section>

      <CtaBanner />
    </>
  );
}
