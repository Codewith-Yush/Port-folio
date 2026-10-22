import { cn } from "../utils/cn";

type SectionHeadingProps = {
  serial?: string;
  eyebrow: string;
  title: string;
  accent?: string;
  copy?: string;
  className?: string;
};

export function SectionHeading({
  serial,
  eyebrow,
  title,
  accent,
  copy,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] sm:mb-6 sm:text-xs">
        {serial && <span className="text-[var(--ink)] font-semibold">{serial} <span className="px-1 text-emerald-700 dark:text-emerald-400">/</span> </span>}
        {eyebrow}
      </p>
      <h2 className="font-sans text-[clamp(2.5rem,5.5vw,4.8rem)] font-bold uppercase leading-[0.88] tracking-[-0.07em] text-[var(--ink)]">
        <span>{title}</span>
        {accent && (
          <>
            {" "}
            <span className="font-serif font-normal italic lowercase tracking-[-0.07em] text-emerald-700 dark:text-emerald-400">
              {accent}
            </span>
          </>
        )}
      </h2>
      {copy ? (
        <p className="mt-6 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base font-normal">
          {copy}
        </p>
      ) : null}
    </div>
  );
}
