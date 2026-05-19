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
      <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-black/50 dark:text-white/50">
        {eyebrow}
      </p>
      <h2 className="text-balance text-4xl font-light leading-[1.05] tracking-tight text-black dark:text-white sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {copy ? (
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-black/60 dark:text-white/60 sm:text-lg">
          {copy}
        </p>
      ) : null}
    </div>
  );
}
