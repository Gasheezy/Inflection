import { Button } from "@/components/ui/button";
import { GoldRule } from "@/components/ui/gold-rule";

export function ElevateClosingStep({ onContinue }: { onContinue: () => void }) {
  return (
    <div>
      <p className="text-charcoal/80 leading-relaxed">
        That&apos;s the diagnostic work done — your CV, LinkedIn, shortlist, interview composure,
        questions, comp numbers, and leadership narrative are all built and grounded in what you
        actually gave me.
      </p>
      <GoldRule className="my-6" />
      <p className="text-charcoal/80 leading-relaxed">
        Elevate is the one tier this app doesn&apos;t fully automate on purpose. At the Head of
        Product / CPO track, the calls are too specific to your situation for a script. This
        report is your starting point — the follow-up conversation with Kenneth is where it gets
        sharpened.
      </p>
      <div className="mt-8">
        <Button onClick={onContinue}>See my report</Button>
      </div>
    </div>
  );
}
