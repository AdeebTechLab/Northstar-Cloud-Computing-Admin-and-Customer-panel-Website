import { ButtonLink } from "@/components/ui/Button";
import { customerLogos, heroStats } from "@/lib/content";
import { Cityscape } from "./Illustrations";
import { TextLink } from "./Sections";

/** A customer wordmark for the logo strip (demo names, rendered as text). */
function LogoItem({ name, index }: { name: string; index: number }) {
  const shapes = ["M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z", "M4 4h16v16H4z", "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z", "M12 2l10 18H2z"];
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap font-display text-[17px] font-bold tracking-tight text-deep-900/85">
      <svg viewBox="0 0 24 24" className="size-4 text-deep-900/70" fill="currentColor" aria-hidden="true">
        <path d={shapes[index % shapes.length]} />
      </svg>
      {name}
    </span>
  );
}

function LogoMarquee() {
  return (
    <div className="do-section w-full">
      <div className="do-inner do-inner-flush-bottom gap-8 px-0!">
        <p className="max-w-[864px] text-center text-base text-ink-2">From real-time apps to trillion-request workloads, teams that need to ship run on Northstar.</p>
        <div className="do-marquee">
          {[0, 1, 2].map((track) => (
            <ul key={track} className="do-marquee-track" aria-hidden={track !== 0}>
              {customerLogos.map((name, i) => (
                <li key={name} className="flex h-20 w-36 shrink-0 items-center justify-center">
                  <LogoItem name={name} index={i} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <div className="relative isolate overflow-clip bg-canvas">
      <section className="do-section do-hero-glow">
        <div className="do-inner">
          <div className="flex w-full flex-col items-center gap-8 text-center">
            <div className="flex max-w-[864px] flex-col gap-2">
              <h1 className="t-xl6 t-display whitespace-pre-line text-deep-1000">{"Cloud infrastructure.\nWithout compromise."}</h1>
              <p className="mx-auto max-w-[640px] text-base text-ink-2">One integrated platform, from bare metal to your app, with pricing that stays predictable as you scale.</p>
            </div>
            <div className="flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center">
              <ButtonLink href="/register">Get started</ButtonLink>
              <ButtonLink href="/products" variant="hero-ghost">
                Explore products
              </ButtonLink>
            </div>
            <LogoMarquee />
          </div>
        </div>
      </section>
      <HeroStats />
    </div>
  );
}

/** Three stat cards over the skyline backdrop (HomeHero "below" + FeatureCardGrid). */
export function HeroStats() {
  return (
    <div className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-36 bottom-0 -z-10 [mask-image:linear-gradient(180deg,black_70%,transparent)] md:-top-48">
        <Cityscape />
      </div>
      <section id="customers" className="do-section scroll-mt-20">
        <div className="do-inner do-inner-compact">
          <div className="grid w-full gap-6 md:grid-cols-3">
            {heroStats.map((s) => (
              <article key={s.value} className="do-card do-card-border-soft flex flex-col">
                <div className="flex flex-1 flex-col gap-6 px-8 pt-8">
                  <div className="flex flex-col gap-1">
                    <h3 className="t-xl4 t-display">{s.value}</h3>
                    <p className="text-base font-bold text-ink-2">{s.label}</p>
                  </div>
                  <p className="text-base text-ink-2">{s.body}</p>
                </div>
                <div className="flex flex-col items-start gap-6 px-8 pb-8 pt-6">
                  <span className="font-display text-xl font-bold text-deep-900">{s.company}</span>
                  <TextLink href={s.href}>View case study</TextLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
