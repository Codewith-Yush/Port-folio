type SkillMeterProps = {
  name: string;
  level: number;
};

export function SkillMeter({ name, level }: SkillMeterProps) {
  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-4">
        <span className="text-sm font-bold text-[var(--ink)]">{name}</span>
        <span className="text-xs font-black uppercase tracking-[0.16em] text-flame dark:text-blush">
          {level}%
        </span>
      </div>
      <div className="h-3 border border-[var(--line)] bg-[var(--page)]">
        <div
          className="h-full bg-gradient-to-r from-flame via-ember to-blush transition-[width] duration-1000"
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
}
