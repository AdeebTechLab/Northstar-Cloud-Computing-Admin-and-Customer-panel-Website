import type { Metadata } from "next";
import Link from "next/link";
import { communityPage } from "@/lib/pages";
import { CardGrid, CtaStrip, PostCard, SplitBand } from "@/features/marketing/Blocks";
import { Tabs, TypeList } from "@/features/marketing/Interactive";
import { Cityscape, LayerArt } from "@/features/marketing/Illustrations";
import { CtaBanner, Section, TextLink } from "@/features/marketing/Sections";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Community" };

export default function CommunityPage() {
  return (
    <>
      <section className="do-section do-glow-soft">
        <div className="do-inner do-inner-flush-bottom pb-10!">
          <div className="flex w-full flex-col gap-2">
            <h1 className="t-xl4 t-display">{communityPage.intro.title}</h1>
            <p className="max-w-[640px] text-base text-ink-2">{communityPage.intro.body}</p>
          </div>
        </div>
      </section>

      {/* Featured banner */}
      <Section size="compact" gap="gap-0">
        <article className="do-card do-card-border-soft relative flex min-h-[320px] w-full flex-col justify-end overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0 opacity-80 [mask-image:linear-gradient(180deg,black,transparent_90%)]">
            <Cityscape />
          </div>
          <div className="relative flex flex-col items-start gap-4 p-8 md:p-10">
            <span className="rounded-full bg-foam-200 px-3 py-1 text-xs font-medium text-deep-50">{communityPage.featured.tag}</span>
            <h2 className="t-xl3 t-display max-w-[640px]">{communityPage.featured.title}</h2>
            <p className="text-sm text-ink-2">
              {communityPage.featured.date} · {communityPage.featured.read} read
            </p>
            <ButtonLink href={communityPage.featured.href} variant="white" size="sm">
              Read
            </ButtonLink>
          </div>
        </article>
      </Section>

      {/* Sidebar + latest posts */}
      <Section size="compact" gap="gap-0">
        <div className="grid w-full gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
          <aside>
            <TypeList types={communityPage.types} />
          </aside>
          <div className="flex min-w-0 flex-col gap-10">
            <CtaStrip text="Sign up now and you will be up and running on Northstar in just minutes." cta="Get started" href="/register" />
            <div className="flex flex-col gap-6">
              <h2 className="t-xl3 t-display">Latest posts</h2>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {communityPage.latest.map((p) => (
                  <PostCard key={p.title} post={p} />
                ))}
              </div>
              <TextLink href="/docs">View all tutorials</TextLink>
            </div>
          </div>
        </div>
      </Section>

      {/* Start here */}
      <Section gap="gap-8">
        <div className="flex w-full flex-col gap-2">
          <h2 className="t-xl4 t-display">Start here</h2>
          <p className="max-w-[640px] text-base text-ink-2">Whether you are deploying your first server or running a fleet, these resources will get you moving.</p>
        </div>
        <Tabs
          label="Start here"
          tabs={communityPage.startHere.map((t) => ({
            label: t.tab,
            content: (
              <ul className="grid w-full gap-4 md:grid-cols-2">
                {t.links.map((l) => (
                  <li key={l}>
                    <Link href="/docs" className="do-textlink text-base font-bold">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            ),
          }))}
        />
      </Section>

      {/* Topic feeds */}
      <Section gap="gap-12">
        <h2 className="t-xl4 t-display w-full max-w-[864px]">From compute to networking, start building with these educational resources</h2>
        {communityPage.topics.map((t) => (
          <div key={t.title} className="flex w-full flex-col gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <h3 className="t-xl3 t-display">{t.title}</h3>
              <TextLink href="/docs">View all</TextLink>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {t.posts.map((p) => (
                <PostCard key={p.title} post={p} />
              ))}
            </div>
          </div>
        ))}
        <TextLink href="/docs">Explore all topic areas</TextLink>
      </Section>

      <Section size="compact" gap="gap-0">
        <SplitBand title={communityPage.deployBand.title} body={communityPage.deployBand.body} cta={communityPage.deployBand.cta} href="/register" art={<LayerArt index={0} />} />
      </Section>

      <Section gap="gap-8">
        <h2 className="t-xl4 t-display w-full">Additional community resources</h2>
        <CardGrid items={communityPage.extras} columns={3} variant="link" />
      </Section>

      <Section size="compact" gap="gap-0">
        <SplitBand title={communityPage.developerCloud.title} body={communityPage.developerCloud.body} cta={communityPage.developerCloud.cta} href="/products" art={<LayerArt index={5} />} artSide="left" />
      </Section>

      <CtaBanner />
    </>
  );
}
