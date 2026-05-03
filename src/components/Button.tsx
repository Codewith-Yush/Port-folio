import type { AnchorHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../utils/cn";

type ButtonProps = PropsWithChildren<
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    variant?: "primary" | "secondary";
  }
>;

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <a
      className={cn(
        "premium-button group inline-flex min-h-12 items-center justify-center gap-3 border px-5 text-sm font-bold uppercase tracking-[0.18em] transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--page)]",
        variant === "primary"
          ? "premium-button--primary border-flame bg-flame text-white shadow-shape hover:-translate-y-1 hover:bg-ember dark:shadow-shape-dark"
          : "premium-button--secondary border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:-translate-y-1 hover:border-flame",
        className,
      )}
      {...props}
    >
      {children}
      <span aria-hidden="true" className="transition duration-300 group-hover:translate-x-1">
        →
      </span>
    </a>
  );
}
