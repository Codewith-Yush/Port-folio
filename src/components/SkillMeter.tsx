import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type SkillMeterProps = {
  name: string;
  level: number;
  tier?: "Advanced" | "Core" | "Specialized" | "Production";
  tags?: string[];
  index?: number;
};

export function SkillMeter({ name, level, tier = "Advanced", tags, index = 0 }: SkillMeterProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
      className="group/skill border-b border-[var(--line)] pb-3 last:border-b-0 last:pb-0"
    >
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="font-sans text-xs font-bold tracking-tight text-[var(--ink)] sm:text-sm">
          {name}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] tabular-nums text-[var(--muted)]">
            {level}%
          </span>
          <span className="inline-flex items-center rounded-sm border border-[var(--line)] bg-[var(--surface-strong)] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider font-semibold text-[var(--ink)]">
            {tier}
          </span>
        </div>
      </div>

      <div className="h-1 w-full overflow-hidden rounded-none bg-[var(--line)]">
        <motion.div
          className="h-full bg-[var(--flame)] dark:bg-[#C7ED70]"
          initial={reducedMotion ? { width: `${level}%` } : { width: "0%" }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: 1.1,
            delay: reducedMotion ? 0 : 0.1 + index * 0.04,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>

      {tags && tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-sm border border-[var(--line)] bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted)]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
