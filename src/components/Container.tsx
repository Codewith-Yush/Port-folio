import type { PropsWithChildren } from "react";
import { cn } from "../utils/cn";

type ContainerProps = PropsWithChildren<{
  className?: string;
}>;

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-16", className)}>
      {children}
    </div>
  );
}
