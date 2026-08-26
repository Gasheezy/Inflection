"use client";

import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label, Input } from "@/components/ui/field";
import { OutputBox } from "@/components/flow/output-box";
import { callCoach } from "@/lib/ai/call-coach";
import { TierId } from "@/lib/types";

interface CompPrepOutput {
  walkAwayReasoning: string;
  anchorReasoning: string;
  caveat: string;
}

export interface CompPrepData {
  targetRole: string;
  targetCompany: string;
  currentComp: string;
  output: CompPrepOutput;
}

export function CompPrepStep({
  tier,
  initial,
  onContinue,
}: {
  tier: TierId;
  initial?: CompPrepData;
  onContinue: (data: CompPrepData) => void;
}) {
  const [targetRole, setTargetRole] = useState(initial?.targetRole ?? "");
  const [targetCompany, setTargetCompany] = useState(initial?.targetCompany ?? "");
  const [currentComp, setCurrentComp] = useState(initial?.currentComp ?? "");
  const [output, setOutput] = useState<CompPrepOutput | null>(initial?.output ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePrep() {
    if (!targetRole.trim()) {
      setError("Tell me the role you're negotiating for.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await callCoach<CompPrepOutput>("comp-prep", tier, {
        targetRole,
        targetCompany,
        currentComp,
      });
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="cp-role">Target role</Label>
        <Input id="cp-role" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="cp-company">Target company</Label>
        <Input
          id="cp-company"
          value={targetCompany}
          onChange={(e) => setTargetCompany(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="cp-current">Current compensation (optional, stays private)</Label>
        <Input
          id="cp-current"
          value={currentComp}
          onChange={(e) => setCurrentComp(e.target.value)}
          placeholder="e.g. KES 280,000/month"
        />
      </div>

      {error && (
        <p className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}

      {!output && (
        <Button onClick={handlePrep} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Working through it…
            </>
          ) : (
            "Set my numbers"
          )}
        </Button>
      )}

      {output && (
        <div className="space-y-5">
          <OutputBox label="Your walk-away number">{output.walkAwayReasoning}</OutputBox>
          <OutputBox label="Your anchor">{output.anchorReasoning}</OutputBox>
          <OutputBox label="Before you use these">{output.caveat}</OutputBox>
          <div className="flex gap-3">
            <Button variant="outline-navy" onClick={() => setOutput(null)} disabled={loading}>
              Re-run
            </Button>
            <Button onClick={() => onContinue({ targetRole, targetCompany, currentComp, output })}>
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
