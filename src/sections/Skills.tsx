import { useEffect, useRef, useState } from "react";
import { Container } from "../components/Container";
import { SectionHeading } from "../components/SectionHeading";
import { ServiceIcon } from "../components/ServiceIcon";
import { SkillMeter } from "../components/SkillMeter";
import { services, skillGroups, type Service } from "../data/portfolio";

function ServiceDetails({ service }: { service: Service }) {
  return (
    <article className="mt-10 overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-md transition-colors duration-500">
      <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="relative min-h-72 overflow-hidden border-b border-black/10 dark:border-white/10 bg-[var(--surface-strong)] p-10 lg:border-b-0 lg:border-r transition-colors duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.05),transparent_60%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none transition-colors duration-500" aria-hidden="true" />
          <div className="relative z-10 flex h-full min-h-56 flex-col justify-between">
            <div className="grid h-16 w-16 place-items-center rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--page)] transition-colors duration-500 text-[var(--ink)]">
              <ServiceIcon icon={service.icon} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--muted)]">
                Timeline
              </p>
              <p className="mt-3 text-4xl font-light leading-none text-[var(--ink)]">
                {service.timeline}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-12 lg:p-14">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--muted)]">
            Selected service
          </p>
          <h3 className="mt-4 text-3xl font-light leading-none text-[var(--ink)] sm:text-4xl">
            {service.title}
          </h3>
          <p className="mt-6 text-base leading-relaxed text-[var(--muted)]">
            {service.outcome}
          </p>

          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ink)] opacity-80">
                Deliverables
              </h4>
              <ul className="mt-5 grid gap-4">
                {service.deliverables.map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-normal leading-relaxed text-[var(--muted)]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black/30 dark:bg-white/30" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ink)] opacity-80">
                Process
              </h4>
              <ol className="mt-5 grid gap-4">
                {service.process.map((item, index) => (
                  <li key={item} className="flex gap-3 text-sm font-normal leading-relaxed text-[var(--muted)]">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 text-[9px] text-[var(--ink)]">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ink)] opacity-80">
                Best for
              </h4>
              <div className="mt-5 flex flex-wrap gap-2">
                {service.bestFor.map((item) => (
                  <span key={item} className="rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
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
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [selectedService]);

  return (
    <section id="skills" className="relative overflow-hidden bg-[var(--page)] py-24 sm:py-32 text-[var(--ink)] border-t border-black/5 dark:border-white/5 transition-colors duration-500">
      <div className="absolute right-0 top-0 h-[600px] w-[600px] translate-x-1/4 -translate-y-1/4 rounded-full bg-black/5 dark:bg-white/5 blur-[120px] pointer-events-none transition-colors duration-500" />
      
      <Container className="relative z-10">
        <SectionHeading
          eyebrow="Skills & services"
          title="Frontend depth with cinematic precision."
          copy="I work best where craft and systems meet: fast UI, clear components, resilient delivery, and details that people can feel."
        />

        <div className="skill-loop mt-12 sm:mt-16" aria-label="Skill categories">
          <div className="skill-loop__track">
            {[...skillGroups, ...skillGroups].map((group, index) => (
              <article key={`${group.title}-${index}`} className="skill-loop__card rounded-3xl border border-black/10 dark:border-white/10 bg-[var(--surface)] p-8 backdrop-blur-md transition-colors duration-500" aria-hidden={index >= skillGroups.length}>
                <h3 className="mb-8 text-xl font-light text-[var(--ink)]">{group.title}</h3>
                <div className="grid gap-6">
                  {group.skills.map((skill) => (
                    <SkillMeter key={skill.name} name={skill.name} level={skill.level} />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <button
              type="button"
              key={service.title}
              onClick={() => setSelectedService(service)}
              aria-pressed={selectedService?.title === service.title}
              className={`group relative overflow-hidden rounded-3xl border p-8 text-left transition-all duration-500 hover:-translate-y-2 focus:outline-none ${
                selectedService?.title === service.title 
                  ? 'border-black/30 dark:border-white/30 bg-[var(--surface)] backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_rgba(255,255,255,0.05)]' 
                  : 'border-black/10 dark:border-white/10 bg-[var(--surface-strong)] backdrop-blur-md hover:border-black/20 dark:hover:border-white/20 hover:bg-[var(--surface)]'
              }`}
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--page)] text-[var(--ink)] transition-colors duration-500">
                <ServiceIcon icon={service.icon} />
              </div>
              <h3 className="mt-8 text-2xl font-light text-[var(--ink)]">{service.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{service.description}</p>
              <span className="mt-8 inline-flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--ink)] opacity-80 transition-colors group-hover:opacity-100">
                Explore service
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </button>
          ))}
        </div>

        <div ref={detailRef}>
          {selectedService ? (
            <ServiceDetails service={selectedService} />
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-black/10 dark:border-white/10 bg-[var(--surface)] px-8 py-8 text-center text-sm font-normal leading-relaxed text-[var(--muted)] backdrop-blur-sm transition-colors duration-500">
              Select any service card to open a detailed service view with process, deliverables, and outcomes.
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
