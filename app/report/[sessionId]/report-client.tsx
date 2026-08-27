"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Printer, ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button, ButtonLink } from "@/components/ui/button";
import { GoldRule } from "@/components/ui/gold-rule";
import { OutputBox } from "@/components/flow/output-box";
import { loadSession } from "@/lib/session-store";
import { TIERS } from "@/lib/tiers";
import { FlowSessionData } from "@/lib/types";
import { CVCheckData } from "@/components/flow/cv-check-step";
import { LinkedInDraftData } from "@/components/flow/linkedin-draft-step";
import { CompanyShortlistData } from "@/components/flow/company-shortlist-step";
import { MockInterviewData } from "@/components/flow/mock-interview-step";
import { QuestionBuilderData } from "@/components/flow/question-builder-step";
import { CompPrepData } from "@/components/flow/comp-prep-step";
import { ExecNarrativeData } from "@/components/flow/exec-narrative-step";

export default function ReportClient({ sessionId }: { sessionId: string }) {
  const [session, setSession] = useState<FlowSessionData | null | undefined>(undefined);

  useEffect(() => {
    // Reports live in localStorage, an external store only readable after
    // mount — this effect syncs it into React state on load.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(loadSession(sessionId));
  }, [sessionId]);

  if (session === undefined) return null;

  if (!session) {
    return (
      <Container className="py-24 text-center">
        <p className="text-charcoal/70">
          We couldn&apos;t find this report on this device. Reports are saved locally to the
          browser that completed the flow.
        </p>
        <ButtonLink href="/tiers" className="mt-6 inline-flex">
          Start a new flow
        </ButtonLink>
      </Container>
    );
  }

  const tier = TIERS[session.tier];
  const cv = session.stepData["cv-check"] as CVCheckData | undefined;
  const linkedin = session.stepData["linkedin-draft"] as LinkedInDraftData | undefined;
  const shortlist = session.stepData["company-shortlist"] as CompanyShortlistData | undefined;
  const interview = session.stepData["mock-interview"] as MockInterviewData | undefined;
  const questions = session.stepData["question-builder"] as QuestionBuilderData | undefined;
  const comp = session.stepData["comp-prep"] as CompPrepData | undefined;
  const narrative = session.stepData["exec-narrative"] as ExecNarrativeData | undefined;

  return (
    <div className="bg-off-white min-h-screen">
      <div className="no-print border-b border-navy/10 bg-white sticky top-0 z-30">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" className="font-display text-lg font-bold text-navy">
            Inflection
          </Link>
          <div className="flex gap-3">
            <ButtonLink href="/" variant="ghost-navy" className="!px-3 !py-2 text-xs">
              <ArrowLeft className="h-3.5 w-3.5" /> Home
            </ButtonLink>
            <Button
              variant="outline-navy"
              className="!px-3 !py-2 text-xs"
              onClick={() => window.print()}
            >
              <Printer className="h-3.5 w-3.5" /> Print / Save as PDF
            </Button>
          </div>
        </Container>
      </div>

      <Container className="max-w-3xl py-12">
        <div className="rounded-md bg-white p-8 sm:p-12 ring-1 ring-navy/10 print:ring-0 print:shadow-none">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep">
            Positioning Report
          </p>
          <h1 className="mt-3 font-display text-3xl text-navy">
            {session.name ? `${session.name} — ` : ""}
            {tier.name} Tier
          </h1>
          <p className="mt-1 text-sm text-charcoal/60">
            Generated {new Date(session.createdAt).toLocaleDateString()}
          </p>
          <GoldRule className="mt-6" />

          {cv && (
            <Section title="CV Positioning Check" stage="Targeting">
              <OutputBox label="Keywords in the job description">
                <ul className="space-y-2">
                  {cv.output.gaps.map((gap) => (
                    <li key={gap.keyword}>
                      <span className="font-semibold">{gap.keyword}</span>{" "}
                      <span className="text-xs uppercase tracking-wide text-gold-deep">
                        {gap.type === "surfaced" ? "Not surfaced" : "Genuine gap"}
                      </span>
                      <p className="text-charcoal/80">{gap.note}</p>
                    </li>
                  ))}
                </ul>
              </OutputBox>
              <OutputBox label="Rewritten bullets" className="mt-4">
                <ul className="list-disc pl-5 space-y-1">
                  {cv.output.rewrittenBullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </OutputBox>
            </Section>
          )}

          {linkedin && (
            <Section title="LinkedIn Positioning" stage="Targeting">
              <OutputBox label="Headline">{linkedin.output.headline}</OutputBox>
              <OutputBox label="About" className="mt-4">
                {linkedin.output.about}
              </OutputBox>
            </Section>
          )}

          {shortlist && (
            <Section title="Target Company Shortlist" stage="Targeting">
              <OutputBox label="Shortlist review">
                <ul className="space-y-3">
                  {shortlist.output.evaluated.map((c) => (
                    <li key={c.name}>
                      <span className="font-semibold">{c.name}</span>{" "}
                      <span className="text-xs uppercase tracking-wide text-gold-deep">
                        {c.verdict}
                      </span>
                      <p className="text-charcoal/80">{c.feedback}</p>
                    </li>
                  ))}
                </ul>
              </OutputBox>
            </Section>
          )}

          {interview && (
            <Section title="Mock Interview Debrief" stage="Conversion">
              <OutputBox label="Case question">{interview.question}</OutputBox>
              <OutputBox label="What read as composure" className="mt-4">
                <ul className="list-disc pl-5 space-y-1">
                  {interview.debrief.composureNotes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </OutputBox>
              <OutputBox label="What read as risk" className="mt-4">
                <ul className="list-disc pl-5 space-y-1">
                  {interview.debrief.riskSignals.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </OutputBox>
              <OutputBox label="Overall" className="mt-4">
                {interview.debrief.overall}
              </OutputBox>
            </Section>
          )}

          {questions && (
            <Section title="Calibrated Questions" stage="Conversion">
              <OutputBox label="Ask these">
                <ol className="list-decimal pl-5 space-y-3">
                  {questions.output.questions.map((q, i) => (
                    <li key={i}>
                      <p className="font-semibold">{q.question}</p>
                      <p className="text-charcoal/70">{q.why}</p>
                    </li>
                  ))}
                </ol>
              </OutputBox>
            </Section>
          )}

          {comp && (
            <Section title="Compensation Prep" stage="Closing">
              <OutputBox label="Walk-away number">{comp.output.walkAwayReasoning}</OutputBox>
              <OutputBox label="Anchor" className="mt-4">
                {comp.output.anchorReasoning}
              </OutputBox>
              <OutputBox label="Before you use these" className="mt-4">
                {comp.output.caveat}
              </OutputBox>
            </Section>
          )}

          {narrative && (
            <Section title="Executive Narrative" stage="Closing">
              <OutputBox label="Your leadership narrative">{narrative.output.narrative}</OutputBox>
              <OutputBox label="IC story vs. leadership story" className="mt-4">
                {narrative.output.icVsLeadershipNote}
              </OutputBox>
            </Section>
          )}

          {session.tier === "elevate" && (
            <Section title="What Happens Next" stage="Closing">
              <p className="text-charcoal/80 leading-relaxed">
                This report is your diagnostic starting point. Elevate includes direct follow-up
                access to Kenneth to sharpen it for your specific situation — reply to your
                confirmation email to schedule it.
              </p>
            </Section>
          )}

          <GoldRule className="mt-10" />
          <p className="mt-6 text-xs text-charcoal/50">
            Built with Inflection — Reinvention Made Repeatable.
          </p>
        </div>
      </Container>
    </div>
  );
}

function Section({
  title,
  stage,
  children,
}: {
  title: string;
  stage: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-navy/50">{stage}</p>
      <h2 className="mt-1 font-display text-xl text-navy">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
