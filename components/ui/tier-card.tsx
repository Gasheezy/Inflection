import { Check } from "lucide-react";
import clsx from "clsx";
import { Tier } from "@/lib/types";
import { ButtonLink } from "./button";
import { GoldRule } from "./gold-rule";

export function TierCard({ tier, featured = false }: { tier: Tier; featured?: boolean }) {
  return (
    <div
      className={clsx(
        "flex flex-col rounded-md p-8 h-full",
        featured
          ? "bg-navy text-ice ring-1 ring-gold shadow-xl shadow-navy/20 relative"
          : "bg-white text-charcoal ring-1 ring-navy/10"
      )}
    >
      {featured && (
        <span className="absolute -top-3 left-8 rounded-full bg-gold px-3 py-1 text-xs font-semibold tracking-wide text-deep-navy">
          Most chosen
        </span>
      )}
      <p
        className={clsx(
          "text-xs font-semibold uppercase tracking-[0.2em]",
          featured ? "text-gold" : "text-gold-deep"
        )}
      >
        {tier.name}
      </p>
      <h3 className={clsx("mt-2 font-display text-2xl", featured ? "text-ice" : "text-navy")}>
        KES {tier.priceKES.toLocaleString()}
      </h3>
      <GoldRule className="mt-4" />
      <p className={clsx("mt-4 text-sm", featured ? "text-ice/80" : "text-charcoal/80")}>
        <span className="font-semibold">Best for:</span> {tier.bestFor}
      </p>
      <ul className="mt-6 flex-1 space-y-3">
        {tier.includes.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm">
            <Check
              className={clsx(
                "mt-0.5 h-4 w-4 shrink-0",
                featured ? "text-gold" : "text-gold-deep"
              )}
            />
            <span className={featured ? "text-ice/90" : "text-charcoal/90"}>{item}</span>
          </li>
        ))}
      </ul>
      <ButtonLink
        href={`/checkout?tier=${tier.id}`}
        variant={featured ? "gold" : "outline-navy"}
        className="mt-8 w-full"
      >
        {tier.ctaLabel}
      </ButtonLink>
    </div>
  );
}
