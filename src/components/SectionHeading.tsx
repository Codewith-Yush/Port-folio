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
      <h2 className="font-sans text-[clamp(2.2rem,4.5vw,3.75rem)] font-bold tracking-tight text-[var(--ink)]">
        {fullTitle}
      </h2>
      {copy ? (
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--muted)] font-normal">
          {copy}
        </p>
      ) : null}
    </div>
  );
}
