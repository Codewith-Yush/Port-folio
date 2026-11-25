import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { cn } from "../utils/cn";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type WriteOnTextProps = {
  text: string;
  eyebrow?: string;
  className?: string;
};

/**
 * Scroll-scrubbed editorial word reveal matching jeppesen.dev's `.write-on` section.
 * Words start at ghost opacity (0.28) and illuminate to full ink as the user scrolls.
 */
export function WriteOnText({ text, eyebrow, className }: WriteOnTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const words = text.split(" ");

  useGSAP(
    () => {
      if (reducedMotion || !containerRef.current) return;
      const wordEls = containerRef.current.querySelectorAll<HTMLElement>("[data-write-word]");
      if (!wordEls.length) return;

      gsap.fromTo(
        wordEls,
        { opacity: 0.28 },
        {
          opacity: 1,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            end: "bottom 55%",
            scrub: true,
          },
        },
      );
    },
    { scope: containerRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative w-full bg-[var(--page)] px-[var(--site-margin)] py-[var(--section-high)] text-[var(--ink)] transition-colors duration-300",
        className,
      )}
    >
      <div className="grid grid-cols-12 gap-[var(--gutter)]">
        <div className="col-span-12 md:col-span-10 md:col-start-2">
          {eyebrow && (
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
              {eyebrow}
            </p>
          )}
          <p className="font-display text-[clamp(2rem,4.5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.03em]">
            {words.map((word, idx) => (
              <span key={`${word}-${idx}`} data-write-word className="inline-block mr-[0.26em]">
                {word}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
