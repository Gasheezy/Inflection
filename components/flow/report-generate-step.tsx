"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { FlowSessionData } from "@/lib/types";

export function ReportGenerateStep({ session }: { session: FlowSessionData }) {
  const router = useRouter();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    (async () => {
      try {
        await fetch("/api/report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: session.sessionId,
            tier: session.tier,
            report: session.stepData,
          }),
        });
      } catch {
        // Best-effort — the report still renders from local session data.
      }
      router.push(`/report/${session.sessionId}`);
    })();
  }, [router, session]);

  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <Loader2 className="h-6 w-6 animate-spin text-gold-deep" />
      <p className="text-charcoal/70">Putting your positioning report together…</p>
    </div>
  );
}
