"use client";

import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label, Input, Textarea } from "@/components/ui/field";
import { OutputBox } from "@/components/flow/output-box";
import { callCoach } from "@/lib/ai/call-coach";
import { TierId } from "@/lib/types";

interface LinkedInOutput {
  headline: string;
  about: string;
}

export interface LinkedInDraftData {
  currentRole: string;
  yearsExperience: string;
  keyStrengths: string;
  targetRole: string;
  output: LinkedInOutput;
}

export function LinkedInDraftStep({
  tier,
  initial,
  onContinue,
}: {
  tier: TierId;
  initial?: LinkedInDraftData;
  onContinue: (data: LinkedInDraftData) => void;
}) {
  const [currentRole, setCurrentRole] = useState(initial?.currentRole ?? "");
  const [yearsExperience, setYearsExperience] = useState(initial?.yearsExperience ?? "");
  const [keyStrengths, setKeyStrengths] = useState(initial?.keyStrengths ?? "");
  const [targetRole, setTargetRole] = useState(initial?.targetRole ?? "");
  const [output, setOutput] = useState<LinkedInOutput | null>(initial?.output ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDraft() {
    if (!currentRole.trim() || !keyStrengths.trim() || !targetRole.trim()) {
      setError("Fill in your current role, key strengths, and target role.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await callCoach<LinkedInOutput>("linkedin-draft", tier, {
        currentRole,
        yearsExperience,
        keyStrengths,
        targetRole,
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
        <Label htmlFor="current-role">Current role / situation</Label>
        <Input
          id="current-role"
          value={currentRole}
          onChange={(e) => setCurrentRole(e.target.value)}
          placeholder="e.g. Business Analyst at a payments startup"
        />
      </div>
      <div>
        <Label htmlFor="years">Years of relevant experience</Label>
        <Input
          id="years"
          value={yearsExperience}
          onChange={(e) => setYearsExperience(e.target.value)}
          placeholder="e.g. 3 years"
        />
      </div>
      <div>
        <Label htmlFor="strengths">Your key strengths, in your own words</Label>
        <Textarea
          id="strengths"
          value={keyStrengths}
          onChange={(e) => setKeyStrengths(e.target.value)}
          placeholder="What are you actually good at? Be specific."
        />
      </div>
      <div>
        <Label htmlFor="target-role">Target role</Label>
        <Input
          id="target-role"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="e.g. Product Manager, fintech"
        />
      </div>

      {error && (
        <p className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}

      {!output && (
        <Button onClick={handleDraft} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Drafting…
            </>
          ) : (
            "Draft my LinkedIn"
          )}
        </Button>
      )}

      {output && (
        <div className="space-y-5">
          <OutputBox label="Headline">{output.headline}</OutputBox>
          <OutputBox label="About">{output.about}</OutputBox>
          <div className="flex gap-3">
            <Button variant="outline-navy" onClick={() => setOutput(null)} disabled={loading}>
              Re-run
            </Button>
            <Button
              onClick={() =>
                onContinue({ currentRole, yearsExperience, keyStrengths, targetRole, output })
              }
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
