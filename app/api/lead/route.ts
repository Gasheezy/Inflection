import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { isTierId } from "@/lib/tiers";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { email, name, tier, sessionId } = body ?? {};

  if (!email || typeof email !== "string" || !tier || !isTierId(tier)) {
    return NextResponse.json({ error: "email and a valid tier are required." }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    console.log("[lead] Supabase not configured, skipping persistence:", { email, tier });
    return NextResponse.json({ ok: true, persisted: false });
  }

  const { error: leadError } = await supabase.from("leads").insert({ email, name, tier });
  if (leadError) console.error("[lead] insert failed:", leadError.message);

  if (sessionId) {
    const { error: sessionError } = await supabase
      .from("flow_sessions")
      .upsert(
        { session_id: sessionId, tier, email, name, updated_at: new Date().toISOString() },
        { onConflict: "session_id" }
      );
    if (sessionError) console.error("[lead] session upsert failed:", sessionError.message);
  }

  return NextResponse.json({ ok: true, persisted: !leadError });
}
