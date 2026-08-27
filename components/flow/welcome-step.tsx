import { Button } from "@/components/ui/button";
import { Tier } from "@/lib/types";

export function WelcomeStep({ tier, onContinue }: { tier: Tier; onContinue: () => void }) {
  return (
    <div>
      <p className="text-charcoal/80 leading-relaxed">
        I&apos;m going to walk you through {tier.flowTitle.toLowerCase()} the same way I would in
        a session — one exercise at a time. We start with Targeting: getting your materials in
        front of the right roles, in a way that gets you noticed for the right reasons.
      </p>
      <p className="mt-4 text-charcoal/80 leading-relaxed">
        A few ground rules. I&apos;ll only work with what you actually give me — no invented
        experience, no padded metrics. And you don&apos;t need every box checked before moving on.
        If the gist feels right, keep going.
      </p>
      <div className="mt-8">
        <Button onClick={onContinue}>Let&apos;s start</Button>
      </div>
    </div>
  );
}
