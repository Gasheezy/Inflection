import clsx from "clsx";
import { ReactNode } from "react";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx("mx-auto w-full max-w-6xl px-6", className)}>{children}</div>;
}
