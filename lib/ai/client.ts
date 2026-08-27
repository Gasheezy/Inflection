import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to your environment to enable the AI coach."
    );
  }
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

export async function askCoach(params: {
  system: string;
  user: string;
  maxTokens?: number;
}): Promise<string> {
  const anthropic = getClient();
  const message = await anthropic.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: params.maxTokens ?? 1200,
    system: params.system,
    messages: [{ role: "user", content: params.user }],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("The AI coach returned no text output.");
  }
  return textBlock.text;
}

/** Strips accidental markdown code fences and parses the model's JSON output. */
export function parseCoachJSON<T>(raw: string): T {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  return JSON.parse(cleaned) as T;
}
