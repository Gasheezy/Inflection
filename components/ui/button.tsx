import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Variant = "gold" | "outline-ice" | "outline-navy" | "ghost-navy";

const variantClasses: Record<Variant, string> = {
  gold: "bg-gold text-deep-navy hover:bg-[#c29e2e] border border-transparent",
  "outline-ice": "border border-ice/40 text-ice hover:bg-white/5 bg-transparent",
  "outline-navy": "border border-navy text-navy hover:bg-navy/5 bg-transparent",
  "ghost-navy": "text-navy hover:bg-navy/5 bg-transparent border border-transparent",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 font-body font-semibold tracking-wide text-sm transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "gold",
  className,
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={clsx(base, variantClasses[variant], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "gold",
  className,
  children,
  href,
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={clsx(base, variantClasses[variant], className)}>
      {children}
    </Link>
  );
}
