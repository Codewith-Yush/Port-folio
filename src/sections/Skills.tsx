import { useEffect, useRef, useState } from "react";
import { Container } from "../components/Container";
import { SectionHeading } from "../components/SectionHeading";
import { ServiceIcon } from "../components/ServiceIcon";
import { SkillMeter } from "../components/SkillMeter";
import { services, skillGroups, type Service } from "../data/portfolio";

function ServiceDetails({ service }: { service: Service }) {
  return (
    <article className="mt-8 sm:mt-10 overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-[var(--surface)] backdrop-blur-xl shadow-md transition-all duration-500">
      <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="relative min-h-64 overflow-hidden border-b border-black/10 dark:border-white/10 bg-[var(--surface-strong)] p-8 sm:p-10 lg:border-b-0 lg:border-r transition-colors duration-500">
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.08),transparent_60%)] pointer-events-none"
            aria-hidden="true"
          />
          <div className="relative z-10 flex h-full min-h-48 flex-col justify-between">
            <div className="grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--page)] transition-colors duration-500 text-[var(--flame)] dark:text-[var(--blush)] shadow-sm">
              <ServiceIcon icon={service.icon} />
            </div>
            <div className="mt-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--ink)]/60">
                Estimated Timeline
              </p>
              <p className="mt-2 text-3xl sm:text-4xl font-light leading-none text-[var(--ink)]">
                {service.timeline}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10 lg:p-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--flame)] dark:text-[var(--blush)]">
            Service Breakdown
          </span>
          <h3 className="mt-3 text-2xl sm:text-3xl font-light text-[var(--ink)]">
            {service.title}
          </h3>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-[var(--ink)]/70">
            {service.outcome}
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ink)]/80">
                Deliverables
              </h4>
              <ul className="mt-4 grid gap-2.5">
                {service.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-xs font-normal leading-relaxed text-[var(--ink)]/75"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--flame)]"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ink)]/80">
                Workflow
              </h4>
              <ol className="mt-4 grid gap-2.5">
                {service.process.map((item, index) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-xs font-normal leading-relaxed text-[var(--ink)]/75"
                  >
                    <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 text-[9px] font-bold text-[var(--ink)]">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ink)]/80">
                Ideal For
              </h4>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {service.bestFor.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--ink)]/75"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function Skills() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedService) return;
    window.requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }, [selectedService]);

  return (
    <section
      id="skills"
      className="relative overflow-hidden bg-[var(--page)] py-12 sm:py-16 md:py-20 text-[var(--ink)] border-t border-black/5 dark:border-white/5 transition-colors duration-500"
    >
      <div className="absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/4 -translate-y-1/4 rounded-full bg-[var(--flame)]/5 dark:bg-[var(--flame)]/10 blur-[130px] pointer-events-none" />

      <Container className="relative z-10">
        <SectionHeading
          eyebrow="Skills & Services"
          title="Frontend depth with architectural precision."
          copy="I build where design artistry, AI workflows, and rock-solid systems intersect: fast UI, modular architectures, and details users can feel."
        />

        {/* Infinite Skills Carousel */}
        <div className="skill-loop mt-8 sm:mt-10" aria-label="Skill Categories">
          <div className="skill-loop__track">
            {[...skillGroups, ...skillGroups].map((group, index) => (
              <article
                key={`${group.title}-${index}`}
                className="skill-loop__card rounded-3xl border border-black/10 dark:border-white/10 bg-[var(--surface)] p-6 sm:p-8 backdrop-blur-md transition-colors duration-500 shadow-sm"
                aria-hidden={index >= skillGroups.length}
              >
                <h3 className="mb-6 text-lg sm:text-xl font-light text-[var(--ink)]">
                  {group.title}
                </h3>
                <div className="grid gap-5">
                  {group.skills.map((skill) => (
                    <SkillMeter key={skill.name} name={skill.name} level={skill.level} />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Services Cards */}
        <div className="mt-12 grid gap-5 sm:gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <button
              type="button"
              key={service.title}
              onClick={() => setSelectedService(service)}
              aria-pressed={selectedService?.title === service.title}
              className={`group relative overflow-hidden rounded-3xl border p-7 sm:p-8 text-left transition-all duration-300 hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#252A34] ${
                selectedService?.title === service.title
                  ? "border-[#252A34] dark:border-emerald-400 bg-[var(--surface)] backdrop-blur-xl shadow-lg ring-1 ring-[#252A34] dark:ring-emerald-400"
                  : "border-black/10 dark:border-white/10 bg-[var(--surface-strong)]/60 backdrop-blur-md hover:border-[#252A34]/40 hover:bg-[var(--surface)]"
              }`}
            >
              <div className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--page)] text-emerald-500 transition-colors duration-500 shadow-sm">
                <ServiceIcon icon={service.icon} />
              </div>
              <h3 className="mt-6 text-xl sm:text-2xl font-light text-[var(--ink)]">
                {service.title}
              </h3>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[var(--ink)]/70">
                {service.description}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-500 transition-colors group-hover:opacity-100">
                <span>View Details</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* Selected Service Detailed View */}
        <div ref={detailRef}>
          {selectedService ? (
            <ServiceDetails service={selectedService} />
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-black/10 dark:border-white/10 bg-[var(--surface)]/50 px-6 py-6 text-center text-xs font-normal text-[var(--ink)]/60 backdrop-blur-sm transition-colors duration-500">
              Select any service above to reveal process breakdown, timeline, and key deliverables.
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
