import Link from "next/link";
import { ArrowRight, Check, CircleDollarSign, Cpu, Globe, LayoutList, Network, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import { Reveal } from "@/components/layout/SiteChrome";
import { ButtonLink } from "@/components/ui/Button";
import { TerminalWindow } from "./Terminal";

function Eyebrow({ children, dot = true }: { children: React.ReactNode; dot?: boolean }) {
  return (
    <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-600">
      {dot ? <span className="size-1.5 rounded-full bg-brand-600" /> : null}
      {children}
    </p>
  );
}

function SectionHeading({ eyebrow, title, sub, dot }: { eyebrow: string; title: React.ReactNode; sub?: string; dot?: boolean }) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <Eyebrow dot={dot}>{eyebrow}</Eyebrow>
      <h2 className="mt-4 text-[28px] font-bold leading-tight tracking-[-0.02em] text-slate-900 sm:text-4xl">{title}</h2>
      {sub ? <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-500">{sub}</p> : null}
    </Reveal>
  );
}

function FeatureCard({ icon, title, text, delay }: { icon: React.ReactNode; title: string; text: string; delay: number }) {
  return (
    <Reveal delay={delay}>
      <div className="group h-full rounded-xl border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-pop">
        <span className="grid size-10 place-items-center rounded-lg bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white [&_svg]:size-[18px]">{icon}</span>
        <h3 className="mt-6 text-base font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
      </div>
    </Reveal>
  );
}

export function Features() {
  const items = [
    { icon: <Cpu />, title: "High-Performance Compute", text: "Power demanding applications with fast, dependable compute resources built for consistent performance." },
    { icon: <Globe />, title: "Global Data Centers", text: "Deploy closer to your users with geographically distributed infrastructure and flexible location options." },
    { icon: <TrendingUp />, title: "Scalable Resources", text: "Adjust compute, storage, and capacity as your applications evolve, without unnecessary infrastructure complexity." },
    { icon: <ShieldCheck />, title: "Advanced Security", text: "Support your security strategy with controlled access, network protection, and infrastructure safeguards." },
    { icon: <Network />, title: "Reliable Networking", text: "Connect applications and services with dependable network connectivity designed for modern cloud environments." },
    { icon: <LayoutList />, title: "Easy Management", text: "Provision and organize your cloud resources through a streamlined experience designed to simplify daily operations." },
  ];
  return (
    <section id="features" className="bg-[#f8faff] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Built for modern workloads"
          title={<>Powerful Cloud Infrastructure for Every Workload</>}
          sub="From your first deployment to enterprise-scale applications, access the performance, flexibility, and control you need to build confidently in the cloud."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <FeatureCard key={it.title} {...it} delay={(i % 3) * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Workflows() {
  const points = [
    { t: "Infrastructure as code", d: "Bring repeatable environments into your existing development workflow." },
    { t: "Predictable performance", d: "Choose compute resources that map to your workload and growth." },
    { t: "Observability that helps", d: "Understand instance health and resource usage at a glance." },
  ];
  return (
    <section id="workflows" className="bg-white py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <Reveal>
          <Eyebrow dot={false}>Made for real workflows</Eyebrow>
          <h2 className="mt-4 text-[30px] font-bold leading-[1.1] tracking-[-0.02em] text-slate-900 sm:text-[40px]">
            From terminal to production, <br className="hidden sm:block" />
            without the friction.
          </h2>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-slate-500">
            A cloud platform should feel like a tool, not a maze. Provision infrastructure, automate repetitive work, and get back to building the product your users love.
          </p>
          <ul className="mt-8 space-y-5">
            {points.map((p) => (
              <li key={p.t} className="flex gap-3.5">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-600">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-slate-900">{p.t}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{p.d}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/docs" className="group mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
            Explore developer docs <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
        <Reveal delay={120}>
          <TerminalWindow />
        </Reveal>
      </div>
    </section>
  );
}

export function WhyNorthstar() {
  const items = [
    { icon: <Zap />, title: "Fast Deployment", text: "Launch cloud servers in seconds. Get your projects up and running quickly with a streamlined deployment experience." },
    { icon: <CircleDollarSign />, title: "Predictable Pricing", text: "Keep costs clear with simple pricing designed to help you plan your cloud spending without surprises." },
    { icon: <Globe />, title: "Global Infrastructure", text: "Deploy closer to your users worldwide with flexible infrastructure options designed for distributed applications." },
  ];
  return (
    <section id="why" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Northstar Cloud"
          title={<>Built for Developers. Designed for Performance.</>}
          sub="Spend less time managing infrastructure and more time building what matters. Get the speed, clarity, and global reach your applications need to grow."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {items.map((it, i) => (
            <FeatureCard key={it.title} {...it} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBanner() {
  return (
    <section className="bg-[#f8faff] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <Reveal className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-800 via-brand-700 to-brand-500 px-6 py-10 sm:px-10 md:flex md:items-center md:justify-between md:gap-8">
          <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
          <div className="relative">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-[28px]">Your next big thing starts here.</h2>
            <p className="mt-2 text-[15px] text-brand-100">Get your first environment running and keep your focus on what you want to build.</p>
          </div>
          <ButtonLink href="/register" variant="white" size="lg" className="group relative mt-6 md:mt-0" iconRight={<ArrowRight className="transition-transform group-hover:translate-x-0.5" />}>
            Create your account
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}

export { Eyebrow, SectionHeading };
