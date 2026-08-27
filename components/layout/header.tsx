import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

export function Header({ minimal = false }: { minimal?: boolean }) {
  return (
    <header className="border-b border-navy/10 bg-off-white/95 backdrop-blur sticky top-0 z-40">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold text-navy tracking-tight">
          Inflection
        </Link>
        {!minimal && (
          <nav className="hidden sm:flex items-center gap-8 text-sm font-semibold text-charcoal">
            <Link href="/#framework" className="hover:text-navy">
              Method
            </Link>
            <Link href="/tiers" className="hover:text-navy">
              Tiers
            </Link>
          </nav>
        )}
        <ButtonLink href="/tiers" variant="outline-navy" className="!px-4 !py-2 text-xs">
          Get Started
        </ButtonLink>
      </Container>
    </header>
  );
}
