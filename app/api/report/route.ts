import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { isTierId } from "@/lib/tiers";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { sessionId, tier, report } = body ?? {};

  if (!sessionId || !tier || !isTierId(tier) || !report) {
    return NextResponse.json(
      { error: "sessionId, a valid tier, and report are required." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ ok: true, persisted: false });
  }

  const { error } = await supabase
    .from("positioning_reports")
    .insert({ session_id: sessionId, tier, report });
  if (error) console.error("[report] insert failed:", error.message);

  return NextResponse.json({ ok: true, persisted: !error });
}
