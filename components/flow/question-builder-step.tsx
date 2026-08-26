"use client";

import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label, Input, Textarea } from "@/components/ui/field";
import { OutputBox } from "@/components/flow/output-box";
import { callCoach } from "@/lib/ai/call-coach";
import { TierId } from "@/lib/types";

interface QuestionItem {
  question: string;
  why: string;
}

interface QuestionOutput {
  questions: QuestionItem[];
}

export interface QuestionBuilderData {
  role: string;
  company: string;
  concerns: string;
  output: QuestionOutput;
}

export function QuestionBuilderStep({
  tier,
  initial,
  onContinue,
}: {
  tier: TierId;
  initial?: QuestionBuilderData;
  onContinue: (data: QuestionBuilderData) => void;
}) {
  const [role, setRole] = useState(initial?.role ?? "");
  const [company, setCompany] = useState(initial?.company ?? "");
  const [concerns, setConcerns] = useState(initial?.concerns ?? "");
  const [output, setOutput] = useState<QuestionOutput | null>(initial?.output ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuild() {
    if (!role.trim()) {
      setError("Tell me the role you're interviewing for.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await callCoach<QuestionOutput>("question-builder", tier, {
        role,
        company,
        concerns,
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
        <Label htmlFor="qb-role">Role you&apos;re interviewing for</Label>
        <Input id="qb-role" value={role} onChange={(e) => setRole(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="qb-company">Company</Label>
        <Input id="qb-company" value={company} onChange={(e) => setCompany(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="qb-concerns">What are you unsure about — the team, the scope, growth?</Label>
        <Textarea id="qb-concerns" value={concerns} onChange={(e) => setConcerns(e.target.value)} />
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
              <Loader2 className="h-4 w-4 animate-spin" /> Building…
            </>
          ) : (
            "Build my questions"
          )}
        </Button>
      )}

      {output && (
        <div className="space-y-5">
          <OutputBox label="Your calibrated questions">
            <ol className="list-decimal pl-5 space-y-3">
              {output.questions.map((q, i) => (
                <li key={i}>
                  <p className="font-semibold">{q.question}</p>
                  <p className="text-charcoal/70">{q.why}</p>
                </li>
              ))}
            </ol>
          </OutputBox>
          <div className="flex gap-3">
            <Button variant="outline-navy" onClick={() => setOutput(null)} disabled={loading}>
              Re-run
            </Button>
            <Button onClick={() => onContinue({ role, company, concerns, output })}>
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
