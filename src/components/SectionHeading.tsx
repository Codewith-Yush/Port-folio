import { cn } from "../utils/cn";

type SectionHeadingProps = {
  serial?: string;
  eyebrow?: string;
  title: string;
  accent?: string;
  copy?: string;
  className?: string;
};

export function SectionHeading({
  title,
  accent,
  copy,
  className,
}: SectionHeadingProps) {
  const fullTitle = accent ? `${title} ${accent}` : title;

  return (
    <div className={cn("max-w-3xl", className)}>
      <h2 className="font-sans text-[clamp(1.85rem,3.4vw,3rem)] font-bold tracking-tight leading-[1.08] text-[var(--ink)] sm:text-[clamp(2rem,3.6vw,3.25rem)]">
        {fullTitle}
      </h2>
      {copy ? (
        <p className="mt-2.5 max-w-xl text-xs sm:text-sm leading-relaxed text-[var(--muted)] font-normal sm:mt-3">
          {copy}
        </p>
      ) : null}
    </div>
  );
}
