import clsx from "clsx";

export function GoldRule({ className, center }: { className?: string; center?: boolean }) {
  return <hr className={clsx("gold-rule", center && "mx-auto", className)} />;
}
