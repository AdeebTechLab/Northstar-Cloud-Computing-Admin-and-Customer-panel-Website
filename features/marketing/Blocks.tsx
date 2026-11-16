import Link from "next/link";
import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import type { CardItem, Post } from "@/lib/pages";
import { ButtonLink } from "@/components/ui/Button";
import { NorthstarMark } from "@/components/layout/Logos";
import { Section, TextLink } from "./Sections";

/* ------------------------------------------------------------------
   Server-side building blocks shared by the catalogue pages. Each one
   mirrors a DigitalOcean component (HeroContent, JumpNav, SlotBasedCard
   grid, TestimonialCard, CTAText, LogoGrid, ...).
------------------------------------------------------------------- */

/** Left-aligned page hero (HeroContent.split). */
export function PageHero({ title, body, primary, secondary, center, children }: { title: string; body: string; primary?: { label: string; href: string }; secondary?: { label: string; href: string }; center?: boolean; children?: ReactNode }) {
  return (
    <section className="do-section do-glow-soft">
      <div className="do-inner do-inner-flush-bottom pb-16!">
        <div className={cn("flex w-full flex-col gap-8", center ? "items-center text-center" : "items-start text-left")}>
          <div className={cn("flex max-w-[864px] flex-col gap-2", center && "items-center")}>
            <h1 className="t-xl6 t-display">{title}</h1>
            <p className="max-w-[640px] text-base text-ink-2">{body}</p>
          </div>
          {primary || secondary ? (
            <div className="flex flex-wrap gap-4">
              {primary ? <ButtonLink href={primary.href}>{primary.label}</ButtonLink> : null}
              {secondary ? (
                <ButtonLink href={secondary.href} variant="secondary">
                  {secondary.label}
                </ButtonLink>
              ) : null}
            </div>
          ) : null}
          {children}
        </div>
      </div>
    </section>
  );
}

/** Numbered in-page anchor list ("Categories"). */
export function JumpNav({ title, items }: { title?: string; items: { label: string; href: string }[] }) {
  return (
    <nav aria-label="On this page" className="flex w-full flex-col gap-4">
      {title ? <h2 className="font-sans text-lg font-bold leading-[26px] text-ink">{title}</h2> : null}
      <ol className="flex flex-wrap gap-x-8 gap-y-3">
        {items.map((it, i) => (
          <li key={it.href}>
            <Link href={it.href} className="do-textlink text-base">
              <span className="mr-1 font-mono text-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
              {it.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

const cols = { 2: "md:grid-cols-2", 3: "md:grid-cols-2 lg:grid-cols-3", 4: "md:grid-cols-2 lg:grid-cols-4", 5: "md:grid-cols-3 lg:grid-cols-5" } as const;

/** Grid of product cards: title, description, optional tag/bullets, link or button. */
export function CardGrid({ items, columns = 3, variant = "link", compact }: { items: CardItem[]; columns?: 2 | 3 | 4 | 5; variant?: "link" | "button" | "text"; compact?: boolean }) {
  return (
    <div className={cn("grid w-full gap-6", cols[columns])}>
      {items.map((it) => (
        <article key={it.title} className="do-card do-card-border-light flex flex-col justify-between">
          <div className={cn("flex flex-col gap-3", compact ? "p-6" : "px-6 pt-6 md:px-8 md:pt-8")}>
            <div className="flex items-start justify-between gap-3">
              <h3 className={cn("font-display font-bold text-ink", compact ? "text-lg leading-[26px]" : "t-xl2")}>{it.title}</h3>
              {it.tag ? <span className="shrink-0 rounded-full bg-foam-900 px-2.5 py-0.5 text-xs font-medium text-foam-200">{it.tag}</span> : null}
            </div>
            {it.description ? <p className="text-base text-ink-2">{it.description}</p> : null}
            {it.bullets ? (
              <ul className="mt-1 flex flex-col gap-1.5">
                {it.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-ink-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-foam-200" strokeWidth={2.25} /> {b}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          {variant !== "text" && it.href ? (
            <div className={cn(compact ? "px-6 pb-6 pt-4" : "px-6 pb-6 pt-6 md:px-8 md:pb-8")}>
              {variant === "button" ? (
                <ButtonLink href={it.href} variant="secondary" size="sm">
                  {it.cta ?? "Learn more"}
                </ButtonLink>
              ) : (
                <TextLink href={it.href}>{it.cta ?? "Learn more"}</TextLink>
              )}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

/** Section heading row with optional "Learn more" link, used above category grids. */
export function CategoryHeader({ id, title, description, learnMore }: { id?: string; title: string; description?: string; learnMore?: string }) {
  return (
    <div id={id} className="flex w-full scroll-mt-24 flex-col gap-2">
      <div className="flex flex-wrap items-center gap-4">
        <h2 className="t-xl3 t-display">{title}</h2>
        {learnMore ? <TextLink href={learnMore}>Learn more</TextLink> : null}
      </div>
      {description ? <p className="max-w-[640px] text-base text-ink-2">{description}</p> : null}
    </div>
  );
}

/** Centered quote with logo and attribution (TestimonialCard). */
export function Testimonial({ logo, quote, name, role }: { logo: string; quote: string; name: string; role: string }) {
  return (
    <figure className="flex w-full max-w-[864px] flex-col items-center gap-6 text-center">
      <span className="font-display text-2xl font-bold text-deep-900">{logo}</span>
      <blockquote className="t-xl2 font-display font-bold text-ink">“{quote}”</blockquote>
      <figcaption className="flex items-center gap-3 text-sm text-ink-2">
        <span className="grid size-10 place-items-center rounded-full bg-foam-900 font-display text-sm font-bold text-foam-200">{name.split(" ").map((n) => n[0]).join("")}</span>
        <span>
          <span className="block font-medium text-ink">{name}</span>
          {role}
        </span>
      </figcaption>
    </figure>
  );
}

/** Full-width announcement banner. */
export function Banner({ title, body, cta, href }: { title: string; body: string; cta: string; href: string }) {
  return (
    <div className="do-card do-card-border-soft flex w-full flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
      <div className="flex flex-col gap-1">
        <h3 className="font-sans text-lg font-bold leading-[26px] text-ink">{title}</h3>
        <p className="text-base text-ink-2">{body}</p>
      </div>
      <ButtonLink href={href} variant="secondary" className="shrink-0">
        {cta}
      </ButtonLink>
    </div>
  );
}

/** Text + illustration band (CTAText contentLeft / contentRight). */
export function SplitBand({ title, body, cta, href, art, artSide = "right", onColor }: { title: string; body?: ReactNode; cta?: string; href?: string; art: ReactNode; artSide?: "left" | "right"; onColor?: boolean }) {
  return (
    <div className={cn("do-card do-card-border-light flex w-full flex-col md:min-h-[296px] md:flex-row md:items-center", artSide === "left" && "md:flex-row-reverse")}>
      <div className="flex max-w-[560px] flex-col gap-6 px-6 py-8 md:px-10">
        <div className="flex flex-col gap-2">
          <h3 className={cn("t-xl3 t-display", onColor && "text-deep-1000")}>{title}</h3>
          {body ? <div className="text-base text-ink-2">{body}</div> : null}
        </div>
        {cta && href ? (
          <div>
            <ButtonLink href={href}>{cta}</ButtonLink>
          </div>
        ) : null}
      </div>
      <div className="min-w-0 flex-1 self-stretch p-6 md:p-8">{art}</div>
    </div>
  );
}

/** Thin band: sentence + button (e.g. "Learn how customers are building"). */
export function CtaStrip({ text, cta, href }: { text: string; cta: string; href: string }) {
  return (
    <div className="do-card do-card-border-light flex w-full flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:px-8">
      <p className="text-lg font-medium leading-[26px] text-ink">{text}</p>
      <ButtonLink href={href} variant="secondary" className="shrink-0">
        {cta}
      </ButtonLink>
    </div>
  );
}

/** Checklist with illustration ("Platform benefits"). */
export function ChecklistBand({ title, items, art }: { title: string; items: string[]; art: ReactNode }) {
  return (
    <div className="flex w-full flex-col items-center gap-10 md:flex-row md:gap-16">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <h3 className="t-xl3 t-display">{title}</h3>
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-base text-ink-2">
              <Check className="mt-1 size-4 shrink-0 text-foam-200" strokeWidth={2.25} /> {b}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full min-w-0 flex-1">{art}</div>
    </div>
  );
}

/** Pricing card ("Starting at" + bullets + "View pricing"). */
export function PricingCard({ item }: { item: CardItem }) {
  return (
    <article className="do-card do-card-border-light flex flex-col justify-between">
      <div className="flex flex-col gap-4 px-6 pt-6 md:px-8 md:pt-8">
        <h3 className="t-xl2 font-display font-bold text-ink">{item.title}</h3>
        {item.price ? (
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted">Starting at</span>
            <span className="font-display text-[28px] font-extrabold leading-9 tracking-[-1px] text-ink">{item.price}</span>
            {item.priceNote ? <span className="text-sm text-muted">{item.priceNote}</span> : null}
          </div>
        ) : null}
        <p className="text-base text-ink-2">{item.description}</p>
        {item.bullets ? (
          <ul className="flex flex-col gap-2">
            {item.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-ink-2">
                <Check className="mt-0.5 size-4 shrink-0 text-foam-200" strokeWidth={2.25} /> {b}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="px-6 pb-6 pt-6 md:px-8 md:pb-8">
        <ButtonLink href={item.href ?? "/pricing"} variant="secondary" size="sm">
          {item.cta ?? "View pricing"}
        </ButtonLink>
      </div>
    </article>
  );
}

/** Wordmark tile for logo grids. */
export function LogoTile({ name, big }: { name: string; big?: boolean }) {
  return (
    <span className={cn("inline-flex items-center justify-center gap-2 font-display font-bold text-deep-900/85", big ? "h-20 w-36 text-lg" : "h-12 text-base")}>
      <NorthstarMark size={big ? 22 : 18} className="text-deep-800/70" />
      {name}
    </span>
  );
}

export function LogoGrid({ names }: { names: string[] }) {
  return (
    <ul className="flex w-full flex-wrap justify-center gap-x-20 gap-y-10">
      {names.map((n) => (
        <li key={n}>
          <LogoTile name={n} big />
        </li>
      ))}
    </ul>
  );
}

/** Community post card (type label, title, date, read time, Read link). */
export function PostCard({ post }: { post: Post }) {
  return (
    <article className="do-card do-card-border-light flex min-h-[220px] flex-col justify-between">
      <div className="flex flex-col gap-3 p-6">
        <span className="text-sm font-medium text-foam-200">{post.type}</span>
        <h3 className="t-xl font-display font-bold text-ink">{post.title}</h3>
        <p className="text-sm text-muted">
          {post.date} · {post.read} read
        </p>
      </div>
      <div className="px-6 pb-6">
        <TextLink href={post.href}>Read</TextLink>
      </div>
    </article>
  );
}

/** Convenience wrapper: a titled section with a gap-8 column (used for category feeds). */
export function Block({ id, title, cta, children, size }: { id?: string; title?: ReactNode; cta?: ReactNode; children: ReactNode; size?: "compact" | "small" | "medium" }) {
  return (
    <Section id={id} gap="gap-8" size={size}>
      {title ? (
        <div className="flex w-full flex-wrap items-center justify-between gap-4">
          <h2 className="t-xl4 t-display">{title}</h2>
          {cta}
        </div>
      ) : null}
      {children}
    </Section>
  );
}
