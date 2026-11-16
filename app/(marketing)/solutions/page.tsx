import type { Metadata } from "next";
import { Boxes, Code2, Gamepad2, Globe, Server, ShieldCheck } from "lucide-react";
import { solutionsPage } from "@/lib/pages";
import { CategoryHeader, JumpNav, LogoTile, PageHero } from "@/features/marketing/Blocks";
import { CtaBanner, Section, TextLink } from "@/features/marketing/Sections";

export const metadata: Metadata = { title: "Solutions" };

const icons = { "developer-tools": Code2, gaming: Gamepad2, hosting: Server, security: ShieldCheck, web: Globe } as Record<string, typeof Boxes>;

function SolutionGrid({ id, variant, items }: { id: string; variant: "text" | "icon" | "logo"; items: string[] }) {
  const Icon = icons[id] ?? Boxes;
  return (
    <div className={variant === "logo" ? "grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-4" : "grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3"}>
      {items.map((title) => (
        <article key={title} className="do-card do-card-border-light flex flex-col justify-between gap-6 p-6">
          <div className="flex flex-col gap-4">
            {variant === "icon" ? (
              <span className="grid size-12 place-items-center rounded-lg border border-line bg-canvas text-foam-200">
                <Icon className="size-6" strokeWidth={1.75} />
              </span>
            ) : null}
            {variant === "logo" ? <LogoTile name={title.split(" ")[0]} /> : null}
            <h3 className="text-lg font-bold leading-[26px] text-ink">{title}</h3>
          </div>
          <TextLink href="/register">Learn more</TextLink>
        </article>
      ))}
    </div>
  );
}

export default function SolutionsPage() {
  return (
    <>
      <PageHero title={solutionsPage.hero.title} body={solutionsPage.hero.body}>
        <JumpNav title="Categories" items={solutionsPage.categories.map((c) => ({ label: c.title, href: `#${c.id}` }))} />
      </PageHero>

      {solutionsPage.categories.map((c) => (
        <Section key={c.id} id={c.id} gap="gap-8" size="compact">
          <CategoryHeader title={c.title} description={c.description} />
          <SolutionGrid id={c.id} variant={c.variant} items={c.items} />
        </Section>
      ))}

      <CtaBanner />
    </>
  );
}
