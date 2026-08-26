import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-ice/10 bg-deep-navy py-10">
      <Container className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-display text-lg text-ice">Inflection</p>
          <p className="mt-1 text-xs text-ice/50">Reinvention Made Repeatable.</p>
        </div>
        <p className="text-xs text-ice/40">
          &copy; {new Date().getFullYear()} Inflection. Career positioning for product managers
          in East Africa.
        </p>
      </Container>
    </footer>
  );
}
