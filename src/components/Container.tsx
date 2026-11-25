import type { PropsWithChildren } from "react";
import { cn } from "../utils/cn";

type ContainerProps = PropsWithChildren<{
  className?: string;
}>;

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-none px-[var(--site-margin)]", className)}>
      {children}
    </div>
  );
}
