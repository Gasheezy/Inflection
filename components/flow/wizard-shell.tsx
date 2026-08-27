import { ReactNode } from "react";
import { StepIndicator } from "@/components/ui/step-indicator";
import { Container } from "@/components/ui/container";
import { FrameworkStage, TierId } from "@/lib/types";

export function WizardShell({
  tier,
  activeStage,
  stepLabel,
  stepIndex,
  stepCount,
  title,
  description,
  children,
}: {
  tier: TierId;
  activeStage: FrameworkStage | null;
  stepLabel: string;
  stepIndex: number;
  stepCount: number;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-deep-navy radial-glow">
      <div className="border-b border-ice/10 bg-deep-navy/95 py-6 sticky top-0 z-30 backdrop-blur">
        <Container className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-display text-lg text-ice">Inflection</span>
            <span className="text-xs text-ice/50">
              Step {stepIndex + 1} of {stepCount} · {stepLabel}
            </span>
          </div>
          <StepIndicator tier={tier} activeStage={activeStage} />
        </Container>
      </div>
      <Container className="py-12 max-w-3xl">
        <div className="rounded-md bg-white p-8 sm:p-10 ring-1 ring-navy/10">
          <h1 className="font-display text-2xl sm:text-3xl text-navy">{title}</h1>
          <p className="mt-2 text-sm text-charcoal/70">{description}</p>
          <div className="mt-8">{children}</div>
        </div>
      </Container>
    </div>
  );
}
