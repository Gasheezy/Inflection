import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { GoldRule } from "@/components/ui/gold-rule";
import { TierCard } from "@/components/ui/tier-card";
import { TIERS, TIER_ORDER } from "@/lib/tiers";

export const metadata: Metadata = {
  title: "Tiers — Inflection",
  description: "Compare Position, Compete, and Elevate — Inflection's career positioning tiers.",
};

export default function TiersPage() {
  return (
    <>
      <Header minimal />
      <main className="flex-1 bg-deep-navy radial-glow">
        <Container className="py-20">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep">
              Choose your tier
            </p>
            <h1 className="mt-4 font-display text-4xl text-ice">
              Every tier includes the one before it.
            </h1>
            <GoldRule center className="mt-6" />
            <p className="mt-6 text-ice/70">
              Pick the tier that matches where you are today. You can always move up as your
              search moves forward.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {TIER_ORDER.map((id) => (
              <TierCard key={id} tier={TIERS[id]} featured={id === "compete"} />
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
