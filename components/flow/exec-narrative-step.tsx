"use client";

import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label, Input, Textarea } from "@/components/ui/field";
import { OutputBox } from "@/components/flow/output-box";
import { callCoach } from "@/lib/ai/call-coach";
import { TierId } from "@/lib/types";

interface ExecNarrativeOutput {
  narrative: string;
  icVsLeadershipNote: string;
}

export interface ExecNarrativeData {
  currentTitle: string;
  teamSize: string;
  orgImpact: string;
  output: ExecNarrativeOutput;
}

export function ExecNarrativeStep({
  tier,
  initial,
  onContinue,
}: {
  tier: TierId;
  initial?: ExecNarrativeData;
  onContinue: (data: ExecNarrativeData) => void;
}) {
  const [currentTitle, setCurrentTitle] = useState(initial?.currentTitle ?? "");
  const [teamSize, setTeamSize] = useState(initial?.teamSize ?? "");
  const [orgImpact, setOrgImpact] = useState(initial?.orgImpact ?? "");
  const [output, setOutput] = useState<ExecNarrativeOutput | null>(initial?.output ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuild() {
    if (!currentTitle.trim() || !orgImpact.trim()) {
      setError("Fill in your current title and the org-level impact you've had.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await callCoach<ExecNarrativeOutput>("exec-narrative", tier, {
        currentTitle,
        teamSize,
        orgImpact,
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
        <Label htmlFor="en-title">Current title / scope</Label>
        <Input id="en-title" value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="en-team">Team / org size you&apos;ve led (if any)</Label>
        <Input id="en-team" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="en-impact">Org-level impact, in your own words</Label>
        <Textarea
          id="en-impact"
          value={orgImpact}
          onChange={(e) => setOrgImpact(e.target.value)}
          placeholder="What changed at the org level because of what you did?"
        />
      </div>

      {error && (
        <p className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}

      {!output && (
        <Button onClick={handleBuild} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Building narrative…
            </>
          ) : (
            "Build my narrative"
          )}
        </Button>
      )}

      {output && (
        <div className="space-y-5">
          <OutputBox label="Your leadership narrative">{output.narrative}</OutputBox>
          <OutputBox label="IC story vs. leadership story">{output.icVsLeadershipNote}</OutputBox>
          <div className="flex gap-3">
            <Button variant="outline-navy" onClick={() => setOutput(null)} disabled={loading}>
              Re-run
            </Button>
            <Button onClick={() => onContinue({ currentTitle, teamSize, orgImpact, output })}>
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
