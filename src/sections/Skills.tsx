import { useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Container } from "../components/Container";
import { SkillMeter } from "../components/SkillMeter";
import { skillGroups } from "../data/portfolio";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Skills() {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reducedMotion || !sectionRef.current || !surfaceRef.current) return;
      gsap.fromTo(
        surfaceRef.current,
        { clipPath: "inset(2.5% 2.5% 0% 2.5% round 8px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 92%",
            end: "top 30%",
            scrub: true,
          },
        },
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="skills"
      style={
        {
          "--page": "#252525",
          "--surface": "#1e1e1e",
          "--surface-strong": "#2f2f2f",
          "--ink": "#f2ede4",
          "--muted": "#a3a3a3",
          "--line": "rgba(242, 237, 228, 0.16)",
        } as React.CSSProperties
      }
      className="relative scroll-mt-16 overflow-hidden bg-[var(--page)] text-[#f2ede4] sm:scroll-mt-20 md:scroll-mt-24"
    >
      <div
        ref={surfaceRef}
        className="flex min-h-[100svh] flex-col justify-center bg-[#252525] py-[var(--section-high)] will-change-transform"
      >
        <Container className="relative z-10 my-auto">
          {/* Editorial 12-Col Header matching jeppesen.dev */}
          <div className="grid grid-cols-12 gap-[var(--gutter)] border-b border-[var(--line)] pb-8">
            <div className="col-span-12 lg:col-span-8">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                Capabilities
              </p>
              <motion.h2
                initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: "some" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-[clamp(2rem,4.4vw,4.25rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-[var(--ink)]"
              >
                Technical systems &amp; architecture.
              </motion.h2>
            </div>
            <div className="col-span-12 flex items-end lg:col-span-4 lg:justify-end">
              <p className="max-w-[38ch] text-sm leading-relaxed text-[var(--muted)] sm:text-base lg:text-right">
                Scalable frontend engineering, Power BI data pipelines, and creative design systems.
              </p>
            </div>
          </div>

          {/* Balanced 3-Column Editorial Grid matching jeppesen.dev 20px gutter & 4px radius */}
          <div
            className="mt-10 grid grid-cols-1 gap-[var(--gutter)] md:grid-cols-3"
            aria-label="Skill Categories"
          >
            {skillGroups.map((group, gIdx) => (
              <motion.article
                key={group.title}
                initial={reducedMotion ? false : { opacity: 0, y: 24 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: "some" }}
                transition={{ duration: 0.55, delay: gIdx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col justify-between rounded-[4px] border border-[var(--line)] bg-[#1e1e1e]/75 p-6 transition-colors duration-300 hover:border-[#f2ede4]/40 sm:p-7"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between border-b border-[var(--line)] pb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    <span>{group.category}</span>
                    <span className="tabular-nums text-[var(--ink)]">0{gIdx + 1}</span>
                  </div>
                  <h3 className="mb-6 font-display text-xl font-semibold tracking-tight text-[var(--ink)] sm:text-2xl">
                    {group.title}
                  </h3>
                  <div className="grid gap-4">
                    {group.skills.map((skill, sIdx) => (
                      <SkillMeter
                        key={skill.name}
                        name={skill.name}
                        level={skill.level}
                        tier={skill.tier}
                        tags={skill.tags}
                        index={sIdx}
                      />
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
