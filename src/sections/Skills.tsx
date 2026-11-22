import { motion } from "framer-motion";
import { Container } from "../components/Container";
import { SectionHeading } from "../components/SectionHeading";
import { SkillMeter } from "../components/SkillMeter";
import { skillGroups } from "../data/portfolio";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export function Skills() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="skills"
      className="relative flex min-h-[100svh] flex-col justify-center scroll-mt-16 overflow-hidden bg-[var(--page)] py-12 text-[var(--ink)] transition-colors duration-300 sm:scroll-mt-20 sm:py-14 md:scroll-mt-24 lg:py-12 xl:py-16"
    >
      <Container className="relative z-10 my-auto">
        {/* Architectural Sub-Bar */}
        <div className="mb-4 flex items-center justify-between border-b border-[var(--line)] pb-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] sm:mb-6 sm:pb-3 sm:text-[11px]">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-[#B39CFF]" aria-hidden="true" />
            <span className="font-semibold text-[var(--ink)]">[03 // CAPABILITIES & ARCHITECTURE]</span>
          </div>
          <span className="hidden sm:inline text-[#1E90FF]">[PRODUCTION &amp; INTELLIGENCE STACK]</span>
        </div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionHeading
            title="Technical Systems & Architecture"
            copy="Core engineering disciplines across scalable frontend architectures, analytical Power BI data pipelines, and creative design systems."
          />
        </motion.div>

        {/* Minimal Brutalist Responsive Skills Grid */}
        <div
          className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:gap-6"
          aria-label="Skill Categories"
        >
          {skillGroups.map((group, gIdx) => (
            <motion.article
              key={group.title}
              initial={reducedMotion ? false : { opacity: 0, y: 32 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: gIdx * 0.08, ease: "easeOut" }}
              className="skills-card group relative flex flex-col justify-between rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 transition-all duration-300 hover:border-[#B39CFF]/50 hover:shadow-[0_12px_30px_-15px_rgba(179,156,255,0.15)] sm:p-6 lg:p-5 xl:p-6"
            >
              {/* Corner crosshair stamp */}
              <span className="brutal-corner-cross left-3 top-2.5 text-[#B39CFF]">+</span>
              <span className="brutal-corner-cross right-3 top-2.5 font-mono text-[10px] text-[#1E90FF] font-semibold">
                0{gIdx + 1}
              </span>

              <div>
                <div className="mb-2 flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                  <span className="text-[#1E90FF] font-medium">[{group.category}]</span>
                </div>
                <h3 className="mb-4 font-sans text-lg font-bold tracking-tight text-[var(--ink)] sm:mb-5 sm:text-xl">
                  {group.title}
                </h3>
                <div className="grid gap-3 lg:gap-3 xl:gap-3.5">
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
    </section>
  );
}
