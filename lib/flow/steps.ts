import { FlowStepDefinition, TierId } from "../types";

// Steps are additive: Compete = Position's steps + its own, Elevate = Compete's + its own.
const POSITION_STEPS: FlowStepDefinition[] = [
  {
    id: "welcome",
    tier: "position",
    stage: "targeting",
    kind: "info",
    title: "Welcome",
    description: "Get oriented before you start.",
  },
  {
    id: "cv-check",
    tier: "position",
    stage: "targeting",
    kind: "form-ai",
    title: "CV Positioning Check",
    description: "See what your CV isn't surfacing for the role you want.",
  },
  {
    id: "linkedin-draft",
    tier: "position",
    stage: "targeting",
    kind: "form-ai",
    title: "LinkedIn Positioning Draft",
    description: "A headline and About section that state your value, not hope for it.",
  },
  {
    id: "company-shortlist",
    tier: "position",
    stage: "targeting",
    kind: "form-ai",
    title: "Target Company Shortlist",
    description: "Name targets with a real reason each, not 'they're hiring.'",
  },
];

const COMPETE_STEPS: FlowStepDefinition[] = [
  {
    id: "mock-interview",
    tier: "compete",
    stage: "conversion",
    kind: "chat-ai",
    title: "AI Mock Interview",
    description: "A live product-sense case, with a debrief on composure vs. risk.",
  },
  {
    id: "question-builder",
    tier: "compete",
    stage: "conversion",
    kind: "form-ai",
    title: "Calibrated Question Builder",
    description: "Two strong questions to ask your interviewer.",
  },
];

const ELEVATE_STEPS: FlowStepDefinition[] = [
  {
    id: "comp-prep",
    tier: "elevate",
    stage: "closing",
    kind: "form-ai",
    title: "Compensation Prep",
    description: "Set your walk-away number and your anchor before a figure is ever named.",
  },
  {
    id: "exec-narrative",
    tier: "elevate",
    stage: "closing",
    kind: "form-ai",
    title: "Executive Narrative Builder",
    description: "A leadership story built on scope and org impact, not task lists.",
  },
  {
    id: "elevate-closing",
    tier: "elevate",
    stage: "closing",
    kind: "info",
    title: "What Happens Next",
    description: "Elevate includes direct follow-up with Kenneth.",
  },
];

const REPORT_STEP: Omit<FlowStepDefinition, "tier"> = {
  id: "report",
  stage: null,
  kind: "report",
  title: "Your Positioning Report",
  description: "Everything you built, in one place.",
};

export function getFlowSteps(tier: TierId): FlowStepDefinition[] {
  const steps = [...POSITION_STEPS];
  if (tier === "compete" || tier === "elevate") steps.push(...COMPETE_STEPS);
  if (tier === "elevate") steps.push(...ELEVATE_STEPS);
  steps.push({ ...REPORT_STEP, tier });
  return steps;
}

export function getStep(tier: TierId, stepId: string): FlowStepDefinition | undefined {
  return getFlowSteps(tier).find((s) => s.id === stepId);
}
