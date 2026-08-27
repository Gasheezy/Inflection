"use client";

import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label, Textarea } from "@/components/ui/field";
import { OutputBox } from "@/components/flow/output-box";
import { callCoach } from "@/lib/ai/call-coach";
import { TierId } from "@/lib/types";

interface Gap {
  keyword: string;
  type: "surfaced" | "gap";
  note: string;
}

interface CVCheckOutput {
  gaps: Gap[];
  rewrittenBullets: string[];
}

export interface CVCheckData {
  cvText: string;
  jobDescription: string;
  output: CVCheckOutput;
}

export function CVCheckStep({
  tier,
  initial,
  onContinue,
}: {
  tier: TierId;
  initial?: CVCheckData;
  onContinue: (data: CVCheckData) => void;
}) {
  const [cvText, setCvText] = useState(initial?.cvText ?? "");
  const [jobDescription, setJobDescription] = useState(initial?.jobDescription ?? "");
  const [output, setOutput] = useState<CVCheckOutput | null>(initial?.output ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!cvText.trim() || !jobDescription.trim()) {
      setError("Paste your CV and the target job description first.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await callCoach<CVCheckOutput>("cv-check", tier, {
        cvText,
        jobDescription,
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
        <Label htmlFor="cv-text">Your CV (paste as text)</Label>
        <Textarea
          id="cv-text"
          value={cvText}
          onChange={(e) => setCvText(e.target.value)}
          placeholder="Paste your CV content here..."
          className="min-h-48"
        />
      </div>
      <div>
        <Label htmlFor="jd-text">Target job description</Label>
        <Textarea
          id="jd-text"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description you're targeting..."
        />
      </div>

      {error && (
        <p className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}

      {!output && (
        <Button onClick={handleAnalyze} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Analyzing…
            </>
          ) : (
            "Run positioning check"
          )}
        </Button>
      )}

      {output && (
        <div className="space-y-5">
          <OutputBox label="Keywords in the job description">
            <ul className="space-y-2">
              {output.gaps.map((gap) => (
                <li key={gap.keyword}>
                  <span className="font-semibold">{gap.keyword}</span>{" "}
                  <span
                    className={
                      gap.type === "surfaced"
                        ? "text-xs uppercase tracking-wide text-gold-deep"
                        : "text-xs uppercase tracking-wide text-red-700"
                    }
                  >
                    {gap.type === "surfaced" ? "Not surfaced" : "Genuine gap"}
                  </span>
                  <p className="text-charcoal/80">{gap.note}</p>
                </li>
              ))}
            </ul>
          </OutputBox>
          <OutputBox label="Rewritten bullets">
            <ul className="list-disc pl-5 space-y-1">
              {output.rewrittenBullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </OutputBox>
          <div className="flex gap-3">
            <Button
              variant="outline-navy"
              onClick={() => setOutput(null)}
              disabled={loading}
            >
              Re-run
            </Button>
            <Button onClick={() => onContinue({ cvText, jobDescription, output })}>
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
