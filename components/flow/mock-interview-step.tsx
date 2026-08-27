"use client";

import { useState } from "react";
import { Loader2, AlertCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label, Input, Textarea } from "@/components/ui/field";
import { OutputBox } from "@/components/flow/output-box";
import { callCoach } from "@/lib/ai/call-coach";
import { ChatTurn, TierId } from "@/lib/types";

interface Debrief {
  composureNotes: string[];
  riskSignals: string[];
  overall: string;
}

export interface MockInterviewData {
  targetRole: string;
  targetCompany: string;
  question: string;
  transcript: ChatTurn[];
  debrief: Debrief;
}

type Phase = "setup" | "interviewing" | "debriefed";

export function MockInterviewStep({
  tier,
  initial,
  onContinue,
}: {
  tier: TierId;
  initial?: MockInterviewData;
  onContinue: (data: MockInterviewData) => void;
}) {
  const [targetRole, setTargetRole] = useState(initial?.targetRole ?? "");
  const [targetCompany, setTargetCompany] = useState(initial?.targetCompany ?? "");
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [transcript, setTranscript] = useState<ChatTurn[]>(initial?.transcript ?? []);
  const [reply, setReply] = useState("");
  const [debrief, setDebrief] = useState<Debrief | null>(initial?.debrief ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const phase: Phase = debrief ? "debriefed" : question ? "interviewing" : "setup";

  async function handleStart() {
    if (!targetRole.trim()) {
      setError("Tell me the role you're targeting first.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await callCoach<{ question: string }>("mock-interview-start", tier, {
        targetRole,
        targetCompany,
      });
      setQuestion(result.question);
      setTranscript([{ role: "interviewer", content: result.question }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleSend() {
    if (!reply.trim()) return;
    setTranscript((prev) => [...prev, { role: "candidate", content: reply }]);
    setReply("");
  }

  async function handleDebrief() {
    if (transcript.filter((t) => t.role === "candidate").length === 0) {
      setError("Answer the question at least once before asking for a debrief.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const transcriptText = transcript
        .map((t) => `${t.role === "interviewer" ? "Interviewer" : "Candidate"}: ${t.content}`)
        .join("\n\n");
      const result = await callCoach<Debrief>("mock-interview-debrief", tier, {
        question,
        transcript: transcriptText,
      });
      setDebrief(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (phase === "setup") {
    return (
      <div className="space-y-6">
        <div>
          <Label htmlFor="mi-role">Target role</Label>
          <Input
            id="mi-role"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Senior Product Manager"
          />
        </div>
        <div>
          <Label htmlFor="mi-company">Target company or sector (optional)</Label>
          <Input
            id="mi-company"
            value={targetCompany}
            onChange={(e) => setTargetCompany(e.target.value)}
            placeholder="e.g. a Series B logistics startup"
          />
        </div>
        {error && (
          <p className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" /> {error}
          </p>
        )}
        <Button onClick={handleStart} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Preparing case…
            </>
          ) : (
            "Start mock interview"
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {transcript.map((turn, i) => (
          <div
            key={i}
            className={
              turn.role === "interviewer"
                ? "border-l-2 border-navy/30 bg-off-white rounded-r-sm p-4 text-sm"
                : "border-l-2 border-gold bg-white rounded-r-sm p-4 text-sm ring-1 ring-navy/10"
            }
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/50 mb-1">
              {turn.role === "interviewer" ? "Interviewer" : "You"}
            </p>
            {turn.content}
          </div>
        ))}
      </div>

      {phase === "interviewing" && (
        <div className="space-y-3">
          <Textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your response…"
          />
          <div className="flex flex-wrap gap-3">
            <Button variant="outline-navy" onClick={handleSend} disabled={!reply.trim()}>
              <Send className="h-4 w-4" /> Send response
            </Button>
            <Button onClick={handleDebrief} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Debriefing…
                </>
              ) : (
                "End interview & get debrief"
              )}
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}

      {debrief && (
        <div className="space-y-5">
          <OutputBox label="What read as composure">
            <ul className="list-disc pl-5 space-y-1">
              {debrief.composureNotes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </OutputBox>
          <OutputBox label="What read as risk">
            <ul className="list-disc pl-5 space-y-1">
              {debrief.riskSignals.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </OutputBox>
          <OutputBox label="Overall">{debrief.overall}</OutputBox>
          <Button
            onClick={() =>
              onContinue({ targetRole, targetCompany, question, transcript, debrief })
            }
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}
