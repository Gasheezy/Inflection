export function TestimonialCard({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role: string;
}) {
  return (
    <figure className="rounded-md bg-white p-8 ring-1 ring-navy/10">
      <blockquote className="font-display text-xl leading-relaxed text-navy">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <div className="mt-6 h-px w-12 bg-gold" />
      <figcaption className="mt-4 text-sm">
        <span className="font-semibold text-charcoal">{name}</span>
        <span className="text-charcoal/60"> — {role}</span>
      </figcaption>
    </figure>
  );
}
