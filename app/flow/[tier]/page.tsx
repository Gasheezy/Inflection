import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { isTierId } from "@/lib/tiers";
import FlowClient from "./flow-client";

export const metadata: Metadata = {
  title: "Your Positioning Flow — Inflection",
};

export default async function FlowPage({
  params,
}: {
  params: Promise<{ tier: string }>;
}) {
  const { tier } = await params;
  if (!isTierId(tier)) notFound();

  return (
    <Suspense fallback={null}>
      <FlowClient tier={tier} />
    </Suspense>
  );
}
