import { useEffect, useRef, useState } from "react";
import { Container } from "../components/Container";
import { SectionHeading } from "../components/SectionHeading";
import { ServiceIcon } from "../components/ServiceIcon";
import { SkillMeter } from "../components/SkillMeter";
import { services, skillGroups, type Service } from "../data/portfolio";

function ServiceDetails({ service }: { service: Service }) {
  return (
    <article className="service-detail mt-6 overflow-hidden border border-[var(--line)] bg-[var(--surface)]">
      <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="relative min-h-72 overflow-hidden border-b border-[var(--line)] bg-[var(--surface-strong)] p-8 lg:border-b-0 lg:border-r">
          <div className="service-detail-visual absolute inset-0" aria-hidden="true">
            <span className="absolute left-[12%] top-[14%] h-28 w-28 rounded-full bg-blush/70" />
            <span className="absolute right-[10%] top-[18%] h-32 w-32 rotate-6 bg-flame/70" />
            <span className="clip-semi absolute bottom-[10%] left-[18%] h-36 w-56 bg-ember/70" />
            <span className="clip-triangle absolute bottom-[16%] right-[14%] h-28 w-28 bg-flame/60" />
          </div>
          <div className="relative z-10 flex h-full min-h-56 flex-col justify-between">
            <div className="grid h-20 w-20 place-items-center border border-white/30 bg-[var(--page)]">
              <ServiceIcon icon={service.icon} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-flame dark:text-blush">
                Timeline
              </p>
              <p className="mt-3 text-5xl font-black leading-none text-[var(--ink)]">
                {service.timeline}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-flame dark:text-blush">
            Selected service
          </p>
          <h3 className="mt-4 text-4xl font-black leading-none text-[var(--ink)] sm:text-5xl">
            {service.title}
          </h3>
          <p className="mt-6 text-base leading-8 text-[var(--muted)]">
            {service.outcome}
          </p>

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-flame dark:text-blush">
                Deliverables
              </h4>
              <ul className="mt-4 grid gap-3">
                {service.deliverables.map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-bold leading-6 text-[var(--ink)]">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blush" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-flame dark:text-blush">
                Process
              </h4>
              <ol className="mt-4 grid gap-3">
                {service.process.map((item, index) => (
                  <li key={item} className="flex gap-3 text-sm font-bold leading-6 text-[var(--ink)]">
                    <span className="grid h-6 w-6 shrink-0 place-items-center bg-flame text-[0.65rem] text-white">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-flame dark:text-blush">
                Best for
              </h4>
              <div className="mt-4 flex flex-wrap gap-2">
                {service.bestFor.map((item) => (
                  <span
                    key={item}
                    className="border border-[var(--line)] bg-[var(--page)] px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--ink)]"
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
    if (!selectedService) {
      return;
    }

    window.requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [selectedService]);

  return (
    <section id="skills" className="cv-auto relative overflow-hidden py-12 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="Skills & services"
          title="Frontend depth with product-shaped edges."
          copy="I work best where craft and systems meet: fast UI, clear components, resilient delivery, and details that people can feel."
        />

        <div className="skill-loop mt-8 sm:mt-10" aria-label="Skill categories">
          <div className="skill-loop__track">
            {[...skillGroups, ...skillGroups].map((group, index) => (
              <article
                key={`${group.title}-${index}`}
                className="skill-loop__card border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-7"
                aria-hidden={index >= skillGroups.length}
              >
                <h3 className="mb-7 text-2xl font-black text-[var(--ink)]">{group.title}</h3>
                <div className="grid gap-6">
                  {group.skills.map((skill) => (
                    <SkillMeter key={skill.name} name={skill.name} level={skill.level} />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {services.map((service) => (
            <button
              type="button"
              key={service.title}
              onClick={() => setSelectedService(service)}
              aria-pressed={selectedService?.title === service.title}
              className="service-card group border border-[var(--line)] bg-[var(--surface-strong)] p-7 text-left transition duration-300 hover:-translate-y-1 hover:border-flame focus:outline-none focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--page)]"
              data-active={selectedService?.title === service.title}
            >
              <ServiceIcon icon={service.icon} />
              <h3 className="mt-7 text-2xl font-black text-[var(--ink)]">{service.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{service.description}</p>
              <span className="mt-6 inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-flame dark:text-blush">
                Explore service
                <span aria-hidden="true" className="transition duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </button>
          ))}
        </div>

        <div ref={detailRef}>
          {selectedService ? (
            <ServiceDetails service={selectedService} />
          ) : (
            <div className="mt-6 border border-dashed border-[var(--line)] bg-[var(--surface)] px-5 py-5 text-sm font-bold leading-7 text-[var(--muted)]">
              Select any service card to open a detailed service view with process, deliverables, and outcomes.
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
