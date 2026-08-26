import { Check } from "lucide-react";
import { Tier } from "@/lib/types";
import { GoldRule } from "@/components/ui/gold-rule";

export function OrderSummary({ tier }: { tier: Tier }) {
  return (
    <div className="rounded-md bg-navy p-8 text-ice">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Order summary</p>
      <h2 className="mt-3 font-display text-2xl">{tier.name}</h2>
      <p className="mt-1 text-sm text-ice/70">{tier.positioning}</p>
      <GoldRule className="mt-5" />
      <p className="mt-5 font-display text-3xl text-gold">
        KES {tier.priceKES.toLocaleString()}
      </p>
      <p className="text-xs text-ice/50">one-time, per positioning cycle</p>
      <ul className="mt-6 space-y-3">
        {tier.includes.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <span className="text-ice/90">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
