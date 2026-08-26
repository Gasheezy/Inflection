import { Compass, Clock, MessagesSquare, Handshake } from "lucide-react";
import { Container } from "@/components/ui/container";
import { IconBadge } from "@/components/ui/icon-badge";
import { GoldRule } from "@/components/ui/gold-rule";

const STAGES = [
  {
    icon: Compass,
    title: "Targeting",
    body: "There's a formal job market — posted roles, maximum competition — and a real one: referrals, being known before a role opens. Most candidates only compete in the formal one.",
  },
  {
    icon: Clock,
    title: "Persistence",
    body: "Effort, targeting, and follow-up are yours. Response and timeline aren't. Surviving the silence between applying and hearing back is a skill, not luck.",
  },
  {
    icon: MessagesSquare,
    title: "Conversion",
    body: "Interviewers assess hiring risk, not just correctness. A confident answer stops when it's made its point. An anxious one keeps going to fill the silence.",
  },
  {
    icon: Handshake,
    title: "Closing",
    body: "Know your walk-away number before a figure is ever named — or the first number said in the room becomes the anchor.",
  },
];

export function Framework() {
  return (
    <section id="framework" className="bg-off-white py-20">
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep">
            The method
          </p>
          <h2 className="mt-4 font-display text-3xl text-navy">
            Four stages. Every recommendation traces back to one.
          </h2>
          <GoldRule center className="mt-6" />
        </div>
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STAGES.map((stage) => (
            <div key={stage.title} className="text-center sm:text-left">
              <div className="flex justify-center sm:justify-start">
                <IconBadge icon={stage.icon} />
              </div>
              <h3 className="mt-4 font-display text-xl text-navy">{stage.title}</h3>
              <p className="mt-2 text-sm text-charcoal/75 leading-relaxed">{stage.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
