import { LucideIcon } from "lucide-react";
import clsx from "clsx";

export function IconBadge({
  icon: Icon,
  className,
}: {
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex h-12 w-12 items-center justify-center rounded-full bg-navy ring-1 ring-gold",
        className
      )}
    >
      <Icon className="h-5 w-5 text-gold" strokeWidth={1.75} />
    </div>
  );
}
