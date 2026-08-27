import { Container } from "@/components/ui/container";
import { TestimonialCard } from "@/components/ui/testimonial-card";

const TESTIMONIALS = [
  {
    quote:
      "I'd applied to 40 roles with no callbacks. After Position, my CV said in six bullets what I'd been trying to explain in interviews. Three callbacks in two weeks.",
    name: "Wanjiru M.",
    role: "Associate PM, moved from Nairobi fintech to a Series B startup",
  },
  {
    quote:
      "The mock interview debrief was the first honest feedback I'd gotten. I was over-explaining every answer. Fixing that one thing changed how the next three interviews went.",
    name: "David O.",
    role: "Senior PM, healthtech",
  },
];

export function Testimonials() {
  return (
    <section className="bg-off-white py-20">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </Container>
    </section>
  );
}
