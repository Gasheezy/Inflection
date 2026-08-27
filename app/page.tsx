import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { Credibility } from "@/components/landing/credibility";
import { Framework } from "@/components/landing/framework";
import { TierComparison } from "@/components/landing/tier-comparison";
import { Testimonials } from "@/components/landing/testimonials";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Credibility />
        <Framework />
        <TierComparison />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
