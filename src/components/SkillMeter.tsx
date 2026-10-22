import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type SkillMeterProps = {
  name: string;
  level: number;
  tier?: "Advanced" | "Core" | "Specialized" | "Production";
  tags?: string[];
};

export function SkillMeter({ name, level, tier = "Advanced", tags }: SkillMeterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      if (barRef.current) barRef.current.style.width = `${level}%`;
      if (numberRef.current) numberRef.current.innerText = tier;
      return;
    }

    const ctx = gsap.context(() => {
      const counterObj = { val: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 92%",
          once: true,
        },
      });

      tl.to(
        counterObj,
        {
          val: level,
          duration: 1.4,
          ease: "power2.out",
          onUpdate: () => {
            if (numberRef.current) {
              numberRef.current.innerText = tier;
            }
          },
        },
        0
      );

      if (barRef.current) {
        tl.fromTo(
          barRef.current,
          { width: "0%" },
          { width: `${level}%`, duration: 1.4, ease: "power3.out" },
          0
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [level, tier, reducedMotion]);

  return (
    <div ref={containerRef} className="group/skill">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs sm:text-sm font-medium text-[var(--ink)] tracking-tight">
          {name}
        </span>
        <span
          ref={numberRef}
          className="inline-flex items-center px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/10 text-[9px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-[#C7ED70]"
        >
          {tier}
        </span>
      </div>

      <div className="h-1.5 w-full overflow-hidden bg-[var(--line)]">
        <div
          ref={barRef}
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-[#C7ED70] shadow-[0_0_8px_rgba(16,185,129,0.35)]"
          style={{ width: reducedMotion ? `${level}%` : "0%" }}
        />
      </div>

      {tags && tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5 opacity-80 group-hover/skill:opacity-100 transition-opacity">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-mono text-[var(--muted)] bg-[var(--surface)] border border-[var(--line)] px-1.5 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
