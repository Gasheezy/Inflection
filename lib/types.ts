export type TierId = "position" | "compete" | "elevate";

export type FrameworkStage = "targeting" | "persistence" | "conversion" | "closing";

export interface Tier {
  id: TierId;
  name: string;
  priceKES: number;
  flowTitle: string;
  positioning: string;
  bestFor: string;
  includes: string[];
  ctaLabel: string;
}

export type StepKind = "info" | "form-ai" | "chat-ai" | "report";

export interface FlowStepDefinition {
  id: string;
  tier: TierId;
  stage: FrameworkStage | null;
  kind: StepKind;
  title: string;
  description: string;
}

export interface FlowSessionData {
  sessionId: string;
  tier: TierId;
  name?: string;
  email?: string;
  createdAt: string;
  paymentStatus: "skipped" | "paid" | "pending";
  stepData: Record<string, unknown>;
}

export interface ChatTurn {
  role: "interviewer" | "candidate";
  content: string;
}
