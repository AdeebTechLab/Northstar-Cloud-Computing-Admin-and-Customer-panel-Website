import { Hero } from "@/features/marketing/Hero";
import { PlatformLayers } from "@/features/marketing/Platform";
import { CtaBanner, Performance, Resources } from "@/features/marketing/Sections";
import { Pricing } from "@/features/marketing/Pricing";
import { Faq } from "@/features/marketing/Faq";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PlatformLayers />
      <Pricing />
      <Performance />
      <Resources />
      <Faq />
      <CtaBanner />
    </>
  );
}
