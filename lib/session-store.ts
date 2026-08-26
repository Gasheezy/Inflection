"use client";

import { FlowSessionData, TierId } from "./types";

const KEY_PREFIX = "inflection:session:";

export function newSessionId(): string {
  return crypto.randomUUID();
}

export function createSession(tier: TierId, overrides?: Partial<FlowSessionData>): FlowSessionData {
  const session: FlowSessionData = {
    sessionId: newSessionId(),
    tier,
    createdAt: new Date().toISOString(),
    paymentStatus: "pending",
    stepData: {},
    ...overrides,
  };
  saveSession(session);
  return session;
}

export function saveSession(session: FlowSessionData): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY_PREFIX + session.sessionId, JSON.stringify(session));
}

export function loadSession(sessionId: string): FlowSessionData | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY_PREFIX + sessionId);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as FlowSessionData;
  } catch {
    return null;
  }
}

export function updateStepData(
  sessionId: string,
  stepId: string,
  data: unknown
): FlowSessionData | null {
  const session = loadSession(sessionId);
  if (!session) return null;
  session.stepData[stepId] = data;
  saveSession(session);
  return session;
}
