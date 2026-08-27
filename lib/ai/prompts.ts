import { buildStepSystemPrompt } from "./coach-persona";
import { TierId } from "../types";

export interface PromptResult {
  system: string;
  user: string;
  expectJSON: boolean;
}

type Builder = (tier: TierId, input: Record<string, unknown>) => PromptResult;

const str = (v: unknown) => (typeof v === "string" ? v : JSON.stringify(v ?? ""));

const builders: Record<string, Builder> = {
  "cv-check": (_tier, input) => ({
    expectJSON: true,
    system: buildStepSystemPrompt(
      `Run a CV Positioning Check (Targeting stage). Compare the candidate's CV
against the target job description. Identify the top 6-8 keywords or skills
from the job description that are not clearly reflected in the CV. For each,
decide honestly: "surfaced" (the candidate has this experience, it's just not
visible in the CV text they gave you) or "gap" (there is no evidence in the CV
that they have done this). Never guess the candidate into experience they did
not describe. Then rewrite up to 3 existing CV bullets — using only what the
candidate actually wrote — to naturally surface real keywords. One line each,
action-verb led, no invented numbers or outcomes.

Return JSON only, matching exactly:
{
  "gaps": [{ "keyword": string, "type": "surfaced" | "gap", "note": string }],
  "rewrittenBullets": [string]
}`
    ),
    user: `CANDIDATE CV:\n${str(input.cvText)}\n\nTARGET JOB DESCRIPTION:\n${str(
      input.jobDescription
    )}`,
  }),

  "linkedin-draft": (_tier, input) => ({
    expectJSON: true,
    system: buildStepSystemPrompt(
      `Draft a LinkedIn headline and About section (Targeting stage) from the
candidate's own answers below. Use declarative framing throughout — state
facts, never hedge. Do not invent employers, titles, or achievements beyond
what the candidate told you.

Return JSON only, matching exactly:
{ "headline": string, "about": string }`
    ),
    user: `CURRENT ROLE / SITUATION:\n${str(input.currentRole)}\n\nYEARS OF EXPERIENCE:\n${str(
      input.yearsExperience
    )}\n\nKEY STRENGTHS (in their own words):\n${str(
      input.keyStrengths
    )}\n\nTARGET ROLE:\n${str(input.targetRole)}`,
  }),

  "company-shortlist": (_tier, input) => ({
    expectJSON: true,
    system: buildStepSystemPrompt(
      `Evaluate a target company shortlist (Targeting stage). For each company
the candidate listed, judge whether their stated reason is specific (ties to
something real about that company — a product bet, a team, a growth stage,
a named connection) or generic ("they're hiring," "big brand," "good
culture"). For generic ones, suggest what a specific reason would need to
reference, without inventing facts about the company yourself.

Return JSON only, matching exactly:
{ "evaluated": [{ "name": string, "reason": string, "verdict": "specific" | "generic", "feedback": string }] }`
    ),
    user: `TARGET SECTOR:\n${str(input.targetSector)}\n\nCOMPANIES AND REASONS:\n${str(
      input.companies
    )}`,
  }),

  "mock-interview-start": (_tier, input) => ({
    expectJSON: true,
    system: buildStepSystemPrompt(
      `Open an AI Mock Interview (Conversion stage). You are playing the
interviewer for a product-sense or case interview. Ask exactly one realistic,
specific PM case question suited to the candidate's target role. No preamble,
no "great, let's begin" — just the question, as an interviewer would actually
ask it.

Return JSON only, matching exactly:
{ "question": string }`
    ),
    user: `TARGET ROLE:\n${str(input.targetRole)}\n\nTARGET COMPANY OR SECTOR:\n${str(
      input.targetCompany
    )}`,
  }),

  "mock-interview-debrief": (_tier, input) => ({
    expectJSON: true,
    system: buildStepSystemPrompt(
      `Write the debrief for a completed AI Mock Interview (Conversion stage).
You were the interviewer; the transcript below is the full exchange. Judge
composure, not just correctness: did the candidate stop once they'd made
their point, or keep talking to fill silence? Did they hedge? Did they ask
anything back? Call out specific moments from the transcript as evidence.

Return JSON only, matching exactly:
{ "composureNotes": [string], "riskSignals": [string], "overall": string }`
    ),
    user: `CASE QUESTION:\n${str(input.question)}\n\nTRANSCRIPT:\n${str(input.transcript)}`,
  }),

  "question-builder": (_tier, input) => ({
    expectJSON: true,
    system: buildStepSystemPrompt(
      `Build a Calibrated Question Set (Conversion stage). Draft exactly 2
strong questions the candidate should ask their interviewer, calibrated to
their target role and what they said concerns them. Good questions read as
already-thinking-like-the-role, e.g. "what does success in this role look
like in 90 days?" — not generic ("what's the culture like?").

Return JSON only, matching exactly:
{ "questions": [{ "question": string, "why": string }] }`
    ),
    user: `TARGET ROLE:\n${str(input.role)}\n\nTARGET COMPANY:\n${str(
      input.company
    )}\n\nWHAT THEY'RE UNSURE ABOUT:\n${str(input.concerns)}`,
  }),

  "comp-prep": (_tier, input) => ({
    expectJSON: true,
    system: buildStepSystemPrompt(
      `Walk through Compensation Prep (Closing stage). Help the candidate set a
walk-away number and an anchor number for negotiation. Reason generally about
how to think about market positioning — do not fabricate precise salary
figures or claim specific market data you don't have. Always caveat that real
figures need independent research (e.g. levels.fyi-style sources, recruiter
conversations, peer benchmarking) specific to their market and company.

Return JSON only, matching exactly:
{ "walkAwayReasoning": string, "anchorReasoning": string, "caveat": string }`
    ),
    user: `TARGET ROLE:\n${str(input.targetRole)}\n\nTARGET COMPANY:\n${str(
      input.targetCompany
    )}\n\nCURRENT COMPENSATION (if shared):\n${str(input.currentComp)}`,
  }),

  "exec-narrative": (_tier, input) => ({
    expectJSON: true,
    system: buildStepSystemPrompt(
      `Build an Executive Narrative (Closing stage) for a candidate targeting
Head of Product / CPO-track roles. Articulate a leadership narrative built on
scope of ownership and org impact — distinct from an IC-level PM story. Use
only what the candidate provided; do not invent scope, headcount, or results.

Return JSON only, matching exactly:
{ "narrative": string, "icVsLeadershipNote": string }`
    ),
    user: `CURRENT TITLE / SCOPE:\n${str(input.currentTitle)}\n\nTEAM / ORG SIZE LED:\n${str(
      input.teamSize
    )}\n\nORG-LEVEL IMPACT (in their own words):\n${str(input.orgImpact)}`,
  }),
};

export function buildPrompt(
  stepId: string,
  tier: TierId,
  input: Record<string, unknown>
): PromptResult {
  const builder = builders[stepId];
  if (!builder) {
    throw new Error(`No AI prompt defined for step "${stepId}".`);
  }
  return builder(tier, input);
}
