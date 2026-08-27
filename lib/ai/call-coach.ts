import { TierId } from "../types";

export async function callCoach<T>(
  stepId: string,
  tier: TierId,
  input: Record<string, unknown>
): Promise<T> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stepId, tier, input }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "The AI coach couldn't complete this step.");
  }
  return data.output as T;
}
