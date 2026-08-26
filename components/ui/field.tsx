import { LabelHTMLAttributes, TextareaHTMLAttributes, InputHTMLAttributes } from "react";
import clsx from "clsx";

export function Label({ className, ...rest }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={clsx("block text-sm font-semibold text-navy mb-1.5", className)}
      {...rest}
    />
  );
}

const controlClasses =
  "w-full rounded-sm border border-navy/20 bg-white px-3.5 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold";

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={clsx(controlClasses, className)} {...rest} />;
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={clsx(controlClasses, "min-h-32 resize-y", className)} {...rest} />;
}

export function FieldHelp({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs text-charcoal/60">{children}</p>;
}
