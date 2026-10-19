import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type SkillMeterProps = {
  name: string;
  level: number;
};

export function SkillMeter({ name, level }: SkillMeterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      if (barRef.current) barRef.current.style.width = `${level}%`;
      if (numberRef.current) numberRef.current.innerText = `${level}%`;
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
              numberRef.current.innerText = `${Math.round(counterObj.val)}%`;
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
  }, [level, reducedMotion]);

  return (
    <div ref={containerRef}>
      <div className="mb-2 flex items-end justify-between gap-4">
        <span className="text-xs sm:text-sm font-medium text-[var(--ink)]">{name}</span>
        <span
          ref={numberRef}
          className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-400"
        >
          {reducedMotion ? `${level}%` : "0%"}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10 p-[1px]">
        <div
          ref={barRef}
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-[0_0_10px_rgba(16,185,129,0.35)]"
          style={{ width: reducedMotion ? `${level}%` : "0%" }}
        />
      </div>
    </div>
  );
}
