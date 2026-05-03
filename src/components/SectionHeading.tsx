import { cn } from "../utils/cn";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  copy?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  copy,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-flame dark:text-blush">
        {eyebrow}
      </p>
      <h2 className="text-balance text-4xl font-black leading-[0.95] text-[var(--ink)] sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {copy ? (
        <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
          {copy}
        </p>
      ) : null}
    </div>
  );
}
