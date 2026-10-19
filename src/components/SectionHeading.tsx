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
      <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-black/[0.03] dark:bg-white/[0.04] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--flame)] dark:text-emerald-400 backdrop-blur-md">
        {eyebrow}
      </p>
      <h2 className="text-balance text-4xl font-light leading-[1.05] tracking-tight text-[var(--ink)] sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {copy ? (
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--ink)]/75 dark:text-white/75 sm:text-lg font-light">
          {copy}
        </p>
      ) : null}
    </div>
  );
}
