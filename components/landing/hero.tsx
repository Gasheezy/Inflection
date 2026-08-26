import { ButtonLink } from "@/components/ui/button";
import { GoldRule } from "@/components/ui/gold-rule";
import { Container } from "@/components/ui/container";

export function Hero() {
  return (
    <section className="radial-glow bg-deep-navy py-24 sm:py-32">
      <Container className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep">
          Career positioning for product managers
        </p>
        <h1 className="mt-6 font-display text-4xl sm:text-6xl leading-tight text-ice">
          Assets get you noticed.
          <br />
          <span className="text-gold">Positioning gets you chosen.</span>
        </h1>
        <GoldRule center className="mt-8" />
        <p className="mx-auto mt-8 max-w-2xl text-lg text-ice/80">
          A polished CV gets a glance. A positioned candidate gets the call. Inflection is the
          automated coaching layer that turns what you&apos;ve done into a case an employer can&apos;t
          ignore — targeting, persistence, conversion, and close.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <ButtonLink href="/tiers" variant="gold">
            See the tiers
          </ButtonLink>
          <ButtonLink href="/checkout?tier=position" variant="outline-ice">
            Start with Position
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
