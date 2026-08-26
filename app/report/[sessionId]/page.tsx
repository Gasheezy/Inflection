import { Metadata } from "next";
import ReportClient from "./report-client";

export const metadata: Metadata = {
  title: "Your Positioning Report — Inflection",
};

export default async function ReportPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  return <ReportClient sessionId={sessionId} />;
}
