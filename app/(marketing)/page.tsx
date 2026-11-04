import { Hero, StatsStrip } from "@/features/marketing/Hero";
import { CtaBanner, Features, WhyNorthstar, Workflows } from "@/features/marketing/Sections";
import { Pricing } from "@/features/marketing/Pricing";
import { Faq } from "@/features/marketing/Faq";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <Features />
      <Workflows />
      <Pricing />
      <Faq />
      <WhyNorthstar />
      <CtaBanner />
    </>
  );
}
