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
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: "some" }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="group/skill border-b border-[var(--line)] pb-3 last:border-b-0 last:pb-0"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-sans text-sm font-medium tracking-tight text-[var(--ink)]">
          {name}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] tabular-nums text-[var(--muted)]">
            {level}%
          </span>
          <span className="inline-flex items-center rounded-[2.5px] border border-[var(--line)] bg-[var(--surface-strong)] px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-[var(--ink)]">
            {tier}
          </span>
        </div>
      </div>

      {/* Clean 1px architectural hairline meter matching jeppesen.dev */}
      <div className="h-[2px] w-full overflow-hidden bg-[var(--line)]">
        <motion.div
          className="h-full bg-[var(--ink)]"
          initial={reducedMotion ? { width: `${level}%` } : { width: "0%" }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true, amount: "some" }}
          transition={{
            duration: 0.9,
            delay: reducedMotion ? 0 : 0.08 + index * 0.04,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>

      {tags && tags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-[2.5px] border border-[var(--line)] bg-transparent px-2 py-0.5 font-mono text-[10px] text-[var(--muted)] transition-colors duration-200 hover:border-[var(--ink)] hover:text-[var(--ink)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
