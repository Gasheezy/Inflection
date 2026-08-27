"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getFlowSteps } from "@/lib/flow/steps";
import { TIERS } from "@/lib/tiers";
import { TierId, FlowSessionData } from "@/lib/types";
import { loadSession, createSession, updateStepData } from "@/lib/session-store";
import { WizardShell } from "@/components/flow/wizard-shell";
import { WelcomeStep } from "@/components/flow/welcome-step";
import { CVCheckStep, CVCheckData } from "@/components/flow/cv-check-step";
import { LinkedInDraftStep, LinkedInDraftData } from "@/components/flow/linkedin-draft-step";
import {
  CompanyShortlistStep,
  CompanyShortlistData,
} from "@/components/flow/company-shortlist-step";
import { MockInterviewStep, MockInterviewData } from "@/components/flow/mock-interview-step";
import {
  QuestionBuilderStep,
  QuestionBuilderData,
} from "@/components/flow/question-builder-step";
import { CompPrepStep, CompPrepData } from "@/components/flow/comp-prep-step";
import { ExecNarrativeStep, ExecNarrativeData } from "@/components/flow/exec-narrative-step";
import { ElevateClosingStep } from "@/components/flow/elevate-closing-step";
import { ReportGenerateStep } from "@/components/flow/report-generate-step";

function syncSession(session: FlowSessionData) {
  fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: session.sessionId,
      tier: session.tier,
      email: session.email,
      name: session.name,
      stepData: session.stepData,
    }),
  }).catch(() => {
    // Best-effort — local session state is the source of truth for the UI.
  });
}

export default function FlowClient({ tier }: { tier: TierId }) {
  const router = useRouter();
  const params = useSearchParams();
  const sessionIdParam = params.get("session");

  const [session, setSession] = useState<FlowSessionData | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = getFlowSteps(tier);

  useEffect(() => {
    let active = sessionIdParam ? loadSession(sessionIdParam) : null;
    if (!active) {
      active = createSession(tier);
      router.replace(`/flow/${tier}?session=${active.sessionId}`);
    }
    // Session state lives in localStorage, an external store only readable
    // after mount — this effect syncs it into React state on load.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(active);
    const resumeIndex = steps.findIndex((s) => !(s.id in active!.stepData));
    setStepIndex(resumeIndex === -1 ? steps.length - 1 : resumeIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionIdParam, tier]);

  if (!session) return null;

  const currentStep = steps[stepIndex];
  const tierInfo = TIERS[tier];

  function completeStep(data: unknown) {
    const updated = updateStepData(session!.sessionId, currentStep.id, data);
    if (updated) {
      setSession(updated);
      syncSession(updated);
    }
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  if (currentStep.kind === "report") {
    return <ReportGenerateStep session={session} />;
  }

  return (
    <WizardShell
      tier={tier}
      activeStage={currentStep.stage}
      stepLabel={currentStep.title}
      stepIndex={stepIndex}
      stepCount={steps.length}
      title={currentStep.title}
      description={currentStep.description}
    >
      {currentStep.id === "welcome" && (
        <WelcomeStep tier={tierInfo} onContinue={() => completeStep({ acknowledged: true })} />
      )}
      {currentStep.id === "cv-check" && (
        <CVCheckStep
          tier={tier}
          initial={session.stepData["cv-check"] as CVCheckData | undefined}
          onContinue={completeStep}
        />
      )}
      {currentStep.id === "linkedin-draft" && (
        <LinkedInDraftStep
          tier={tier}
          initial={session.stepData["linkedin-draft"] as LinkedInDraftData | undefined}
          onContinue={completeStep}
        />
      )}
      {currentStep.id === "company-shortlist" && (
        <CompanyShortlistStep
          tier={tier}
          initial={session.stepData["company-shortlist"] as CompanyShortlistData | undefined}
          onContinue={completeStep}
        />
      )}
      {currentStep.id === "mock-interview" && (
        <MockInterviewStep
          tier={tier}
          initial={session.stepData["mock-interview"] as MockInterviewData | undefined}
          onContinue={completeStep}
        />
      )}
      {currentStep.id === "question-builder" && (
        <QuestionBuilderStep
          tier={tier}
          initial={session.stepData["question-builder"] as QuestionBuilderData | undefined}
          onContinue={completeStep}
        />
      )}
      {currentStep.id === "comp-prep" && (
        <CompPrepStep
          tier={tier}
          initial={session.stepData["comp-prep"] as CompPrepData | undefined}
          onContinue={completeStep}
        />
      )}
      {currentStep.id === "exec-narrative" && (
        <ExecNarrativeStep
          tier={tier}
          initial={session.stepData["exec-narrative"] as ExecNarrativeData | undefined}
          onContinue={completeStep}
        />
      )}
      {currentStep.id === "elevate-closing" && (
        <ElevateClosingStep onContinue={() => completeStep({ acknowledged: true })} />
      )}
    </WizardShell>
  );
}
