import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { isTierId } from "@/lib/tiers";
import { TIERS } from "@/lib/tiers";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { sessionId, tier, email, eventType } = body ?? {};

  if (
    !sessionId ||
    !tier ||
    !isTierId(tier) ||
    (eventType !== "skipped" && eventType !== "paid")
  ) {
    return NextResponse.json(
      { error: "sessionId, a valid tier, and eventType ('skipped' | 'paid') are required." },
      { status: 400 }
    );
  }

  const amountKes = TIERS[tier].priceKES;

  const supabase = getSupabaseServer();
  if (!supabase) {
    console.log("[payment]", eventType, { sessionId, tier, email, amountKes });
    return NextResponse.json({ ok: true, persisted: false });
  }

  const { error: eventError } = await supabase.from("payment_events").insert({
    session_id: sessionId,
    tier,
    email,
    event_type: eventType,
    amount_kes: amountKes,
  });
  if (eventError) console.error("[payment] insert failed:", eventError.message);

  const { error: sessionError } = await supabase
    .from("flow_sessions")
    .upsert(
      {
        session_id: sessionId,
        tier,
        email,
        payment_status: eventType,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "session_id" }
    );
  if (sessionError) console.error("[payment] session upsert failed:", sessionError.message);

  return NextResponse.json({ ok: true, persisted: !eventError });
}
