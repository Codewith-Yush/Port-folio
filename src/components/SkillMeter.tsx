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
        <span className="text-sm font-medium text-[var(--ink)] tracking-tight">
          {name}
        </span>
        <span
          ref={numberRef}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
        >
          {tier}
        </span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--line)]">
        <div
          ref={barRef}
          className="h-full rounded-full bg-emerald-500"
          style={{ width: reducedMotion ? `${level}%` : "0%" }}
        />
      </div>

      {tags && tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-[var(--muted)] bg-[var(--surface-strong)] px-2.5 py-0.5 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
