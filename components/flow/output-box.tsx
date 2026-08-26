import { ReactNode } from "react";
import clsx from "clsx";

export function OutputBox({
  label,
  children,
  className,
}: {
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("border-l-2 border-gold bg-off-white rounded-r-sm p-5", className)}>
      {label && (
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-deep mb-2">
          {label}
        </p>
      )}
      <div className="text-sm text-charcoal leading-relaxed whitespace-pre-wrap">{children}</div>
    </div>
  );
}
