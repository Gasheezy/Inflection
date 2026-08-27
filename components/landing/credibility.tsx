import { Container } from "@/components/ui/container";
import { GoldRule } from "@/components/ui/gold-rule";

const STATS = [
  { value: "8+", label: "years as a product manager" },
  { value: "4", label: "sectors — fintech, edtech, insurtech, healthtech" },
  { value: "100+", label: "PMs mentored through ProductNBO" },
];

export function Credibility() {
  return (
    <section className="bg-white py-20">
      <Container className="max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep">
          Why listen to me
        </p>
        <h2 className="mt-4 font-display text-3xl text-navy">
          Built by someone who has done the hiring, not just the applying.
        </h2>
        <GoldRule center className="mt-6" />
        <p className="mt-6 text-charcoal/80">
          Kenneth Gachango has spent 8+ years as a product manager across East Africa&apos;s
          fintech, edtech, insurtech, and healthtech companies — and mentors 100+ PMs through
          ProductNBO. Inflection is that same coaching, systematized.
        </p>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-4xl text-navy">{stat.value}</p>
              <p className="mt-2 text-sm text-charcoal/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
