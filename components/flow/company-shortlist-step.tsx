"use client";

import { useState } from "react";
import { Loader2, AlertCircle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label, Input } from "@/components/ui/field";
import { OutputBox } from "@/components/flow/output-box";
import { callCoach } from "@/lib/ai/call-coach";
import { TierId } from "@/lib/types";

interface CompanyEntry {
  name: string;
  reason: string;
}

interface EvaluatedCompany extends CompanyEntry {
  verdict: "specific" | "generic";
  feedback: string;
}

interface ShortlistOutput {
  evaluated: EvaluatedCompany[];
}

export interface CompanyShortlistData {
  targetSector: string;
  companies: CompanyEntry[];
  output: ShortlistOutput;
}

export function CompanyShortlistStep({
  tier,
  initial,
  onContinue,
}: {
  tier: TierId;
  initial?: CompanyShortlistData;
  onContinue: (data: CompanyShortlistData) => void;
}) {
  const [targetSector, setTargetSector] = useState(initial?.targetSector ?? "");
  const [companies, setCompanies] = useState<CompanyEntry[]>(
    initial?.companies ?? [
      { name: "", reason: "" },
      { name: "", reason: "" },
    ]
  );
  const [output, setOutput] = useState<ShortlistOutput | null>(initial?.output ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateCompany(i: number, field: keyof CompanyEntry, value: string) {
    setCompanies((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
  }

  async function handleEvaluate() {
    const filled = companies.filter((c) => c.name.trim() && c.reason.trim());
    if (!targetSector.trim() || filled.length === 0) {
      setError("Add your target sector and at least one company with a reason.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await callCoach<ShortlistOutput>("company-shortlist", tier, {
        targetSector,
        companies: filled,
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
        <Label htmlFor="sector">Target sector</Label>
        <Input
          id="sector"
          value={targetSector}
          onChange={(e) => setTargetSector(e.target.value)}
          placeholder="e.g. East African fintech"
        />
      </div>

      <div className="space-y-4">
        <Label>Target companies and your reason for each</Label>
        {companies.map((c, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input
                value={c.name}
                onChange={(e) => updateCompany(i, "name", e.target.value)}
                placeholder="Company name"
              />
              <Input
                value={c.reason}
                onChange={(e) => updateCompany(i, "reason", e.target.value)}
                placeholder="Why this company?"
              />
            </div>
            <button
              type="button"
              onClick={() => setCompanies((prev) => prev.filter((_, idx) => idx !== i))}
              className="mt-2.5 text-charcoal/40 hover:text-red-600"
              aria-label="Remove company"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setCompanies((prev) => [...prev, { name: "", reason: "" }])}
          className="flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-gold-deep"
        >
          <Plus className="h-4 w-4" /> Add another company
        </button>
      </div>

      {error && (
        <p className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}

      {!output && (
        <Button onClick={handleEvaluate} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Evaluating…
            </>
          ) : (
            "Check my shortlist"
          )}
        </Button>
      )}

      {output && (
        <div className="space-y-5">
          <OutputBox label="Shortlist review">
            <ul className="space-y-3">
              {output.evaluated.map((c) => (
                <li key={c.name}>
                  <span className="font-semibold">{c.name}</span>{" "}
                  <span
                    className={
                      c.verdict === "specific"
                        ? "text-xs uppercase tracking-wide text-gold-deep"
                        : "text-xs uppercase tracking-wide text-red-700"
                    }
                  >
                    {c.verdict}
                  </span>
                  <p className="text-charcoal/80">{c.feedback}</p>
                </li>
              ))}
            </ul>
          </OutputBox>
          <div className="flex gap-3">
            <Button variant="outline-navy" onClick={() => setOutput(null)} disabled={loading}>
              Re-run
            </Button>
            <Button onClick={() => onContinue({ targetSector, companies, output })}>
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
