import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { isTierId } from "@/lib/tiers";

/** Best-effort sync of in-progress flow state, so Kenneth can see where
 * someone dropped off even if they never finish. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { sessionId, tier, email, name, stepData } = body ?? {};

  if (!sessionId || !tier || !isTierId(tier)) {
    return NextResponse.json({ error: "sessionId and a valid tier are required." }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ ok: true, persisted: false });
  }

  const { error } = await supabase.from("flow_sessions").upsert(
    {
      session_id: sessionId,
      tier,
      email,
      name,
      step_data: stepData ?? {},
      updated_at: new Date().toISOString(),
    },
    { onConflict: "session_id" }
  );
  if (error) console.error("[session] upsert failed:", error.message);

  return NextResponse.json({ ok: true, persisted: !error });
}
