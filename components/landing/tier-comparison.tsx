import { Container } from "@/components/ui/container";
import { GoldRule } from "@/components/ui/gold-rule";
import { TierCard } from "@/components/ui/tier-card";
import { TIERS, TIER_ORDER } from "@/lib/tiers";

export function TierComparison() {
  return (
    <section className="bg-navy py-20">
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Pick your starting point
          </p>
          <h2 className="mt-4 font-display text-3xl text-ice">Three tiers, one method.</h2>
          <GoldRule center className="mt-6" />
          <p className="mt-6 text-ice/70">
            Each tier includes everything below it, plus what&apos;s specific to where you are.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {TIER_ORDER.map((id) => (
            <TierCard key={id} tier={TIERS[id]} featured={id === "compete"} />
          ))}
        </div>
      </Container>
    </section>
  );
}
