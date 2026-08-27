import { NextRequest, NextResponse } from "next/server";
import { askCoach, parseCoachJSON } from "@/lib/ai/client";
import { buildPrompt } from "@/lib/ai/prompts";
import { isTierId } from "@/lib/tiers";

export async function POST(req: NextRequest) {
  let body: { stepId?: string; tier?: string; input?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { stepId, tier, input } = body;
  if (!stepId || !tier || !isTierId(tier)) {
    return NextResponse.json({ error: "stepId and a valid tier are required." }, { status: 400 });
  }

  let prompt;
  try {
    prompt = buildPrompt(stepId, tier, input ?? {});
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown step." },
      { status: 400 }
    );
  }

  try {
    const raw = await askCoach({ system: prompt.system, user: prompt.user });
    if (!prompt.expectJSON) {
      return NextResponse.json({ output: raw });
    }
    try {
      const parsed = parseCoachJSON(raw);
      return NextResponse.json({ output: parsed });
    } catch {
      // The model didn't return clean JSON — surface the raw text rather
      // than failing the step outright.
      return NextResponse.json({ output: { raw } });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "The AI coach is unavailable.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
