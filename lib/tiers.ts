import { Tier, TierId } from "./types";

export const TIERS: Record<TierId, Tier> = {
  position: {
    id: "position",
    name: "Position",
    priceKES: 8500,
    flowTitle: "Build the Foundation",
    positioning: "For aspiring PMs and career-changers",
    bestFor: "You're breaking into product or switching lanes and need your materials to say it clearly.",
    includes: [
      "Professional materials built right — CV, LinkedIn, positioning diagnostic",
      "CV positioning check against a real target role",
      "LinkedIn headline + About section, rewritten",
      "Target company shortlist with real reasons, not guesses",
    ],
    ctaLabel: "Start with Position",
  },
  compete: {
    id: "compete",
    name: "Compete",
    priceKES: 12500,
    flowTitle: "Win the Room",
    positioning: "For PMs actively interviewing",
    bestFor: "You're getting interviews but not offers, and need to close the gap between the two.",
    includes: [
      "Everything in Position",
      "Strategy session + real interview run-through",
      "AI-run mock product-sense interview with a written debrief",
      "Calibrated questions to ask your interviewer",
    ],
    ctaLabel: "Start with Compete",
  },
  elevate: {
    id: "elevate",
    name: "Elevate",
    priceKES: 25000,
    flowTitle: "Negotiate & Lead",
    positioning: "For senior PMs repositioning for Head of Product / CPO track",
    bestFor: "You're already senior and repositioning for a leadership seat, not another IC role.",
    includes: [
      "Everything in Compete",
      "Sessions, simulations, network access, proprietary market intelligence",
      "Compensation prep — walk-away number and anchor, before anyone names a figure",
      "Executive narrative built around scope and org impact",
      "Direct follow-up access to Kenneth",
    ],
    ctaLabel: "Start with Elevate",
  },
};

export const TIER_ORDER: TierId[] = ["position", "compete", "elevate"];

export function isTierId(value: string): value is TierId {
  return value === "position" || value === "compete" || value === "elevate";
}
