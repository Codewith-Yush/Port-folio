import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Container } from "../components/Container";
import { SectionHeading } from "../components/SectionHeading";
import { SkillMeter } from "../components/SkillMeter";
import { skillGroups } from "../data/portfolio";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Skills() {
  const reducedMotion = usePrefersReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reducedMotion) return;

      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      const cards = gridRef.current?.querySelectorAll(".skills-card");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative scroll-mt-20 overflow-hidden bg-[var(--page)] pt-14 pb-14 text-[var(--ink)] transition-colors duration-300 sm:scroll-mt-24 sm:pt-16 sm:pb-16 md:scroll-mt-28 md:pt-18 md:pb-18"
    >
      <Container className="relative z-10">
        {/* Architectural Sub-Bar */}
        <div className="mb-6 flex items-center justify-between border-b border-[var(--line)] pb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)] sm:mb-8">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-[#B39CFF]" aria-hidden="true" />
            <span className="font-semibold text-[var(--ink)]">[03 // CAPABILITIES & ARCHITECTURE]</span>
          </div>
          <span className="hidden sm:inline text-[#1E90FF]">[PRODUCTION &amp; INTELLIGENCE STACK]</span>
        </div>

        <div ref={headingRef}>
          <SectionHeading
            title="Technical Systems & Architecture"
            copy="Core engineering disciplines across scalable frontend architectures, analytical Power BI data pipelines, and creative design systems."
          />
        </div>

        {/* Minimal Brutalist Responsive Skills Grid */}
        <div
          ref={gridRef}
          className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-6"
          aria-label="Skill Categories"
        >
          {skillGroups.map((group, gIdx) => (
            <article
              key={group.title}
              className="skills-card group relative flex flex-col justify-between rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 transition-all duration-300 hover:border-[#B39CFF]/50 hover:shadow-[0_12px_30px_-15px_rgba(179,156,255,0.15)] sm:p-7"
            >
              {/* Corner crosshair stamp */}
              <span className="brutal-corner-cross left-3 top-2.5 text-[#B39CFF]">+</span>
              <span className="brutal-corner-cross right-3 top-2.5 font-mono text-[10px] text-[#1E90FF] font-semibold">
                0{gIdx + 1}
              </span>

              <div>
                <div className="mb-2.5 flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                  <span className="text-[#1E90FF] font-medium">[{group.category}]</span>
                </div>
                <h3 className="mb-6 font-sans text-xl font-bold tracking-tight text-[var(--ink)]">
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
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
