type SkillMeterProps = {
  name: string;
  level: number;
};

export function SkillMeter({ name, level }: SkillMeterProps) {
  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-4">
        <span className="text-xs sm:text-sm font-medium text-[var(--ink)]">{name}</span>
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--flame)] dark:text-[var(--blush)]">
          {level}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10 p-[1px]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--flame)] via-[var(--ember)] to-[var(--blush)] transition-all duration-1000 ease-out"
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
}
