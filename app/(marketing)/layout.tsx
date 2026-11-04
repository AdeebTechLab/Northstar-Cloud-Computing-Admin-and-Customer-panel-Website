import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { FloatingContact } from "@/components/marketing/FloatingContact";
import { BackToTop, ScrollProgress } from "@/components/layout/SiteChrome";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      <BackToTop className="bottom-20 sm:bottom-[88px]" />
      <FloatingContact />
    </>
  );
}
