import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "../components/Container";
import { SectionHeading } from "../components/SectionHeading";
import { ServiceIcon } from "../components/ServiceIcon";
import { SkillMeter } from "../components/SkillMeter";
import { services, skillGroups, type Service } from "../data/portfolio";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

function ServiceCard({
  service,
  isSelected,
  onSelect,
}: {
  service: Service;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`skills-card-reveal group relative overflow-hidden rounded-2xl border p-6 sm:p-7 text-left transition-colors duration-200 focus:outline-none ${isSelected
          ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--page)]"
          : "border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--ink)]"
        }`}
    >
      <div className="relative z-20 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className={isSelected ? "text-emerald-400 font-semibold" : "text-emerald-600 dark:text-emerald-400 font-semibold"}>
              {service.timeline}
            </span>
            <span className={isSelected ? "text-[var(--page)]/70 text-xs" : "text-[var(--muted)] text-xs"}>
              {service.bestFor[0]}
            </span>
          </div>

          <h3 className="mt-4 font-sans text-xl font-bold tracking-tight">
            {service.title}
          </h3>
          <p className={`mt-2.5 text-sm leading-relaxed ${isSelected ? "text-[var(--page)]/80" : "text-[var(--muted)]"}`}>
            {service.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {service.deliverables.slice(0, 2).map((d) => (
              <span
                key={d}
                className={`text-xs px-2.5 py-1 rounded-full ${isSelected
                    ? "bg-white/10 text-[var(--page)]"
                    : "bg-[var(--surface-strong)] text-[var(--muted)]"
                  }`}
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs font-semibold">
          <span>{isSelected ? "Active View" : "View Scope & Deliverables"}</span>
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </button>
  );
}

function ServiceDetails({ service, onClose }: { service: Service; onClose: () => void }) {
  const detailWrapRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!detailWrapRef.current) return;
    gsap.fromTo(
      detailWrapRef.current,
      { opacity: 0, y: 25, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out", force3D: true }
    );
  }, [service]);

  return (
    <article
      ref={detailWrapRef}
      className="relative mt-8 sm:mt-10 overflow-hidden rounded-3xl border border-[var(--ink)]/30 dark:border-[var(--line)] bg-[var(--surface)] shadow-2xl transition-colors duration-500"
    >
      <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="relative min-h-64 overflow-hidden border-b border-[var(--line)] bg-[var(--surface-strong)]/80 p-8 sm:p-10 lg:border-b-0 lg:border-r transition-colors duration-500">
          <div className="relative z-10 flex h-full min-h-48 flex-col justify-between">
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-emerald-600 dark:text-emerald-400 shadow-sm">
              <ServiceIcon icon={service.icon} />
            </div>
            <div className="mt-8">
              <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                Estimated Timeline
              </p>
              <p className="mt-2 font-sans text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[var(--ink)]">
                {service.timeline}
              </p>
            </div>
          </div>
        </div>

        <div className="relative p-6 sm:p-10 lg:p-12">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-400">
              Service Breakdown
            </span>
            <button
              onClick={onClose}
              className="btn-neo-control h-8 px-4 rounded-full font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)] hover:text-[var(--ink)] active:scale-95"
            >
              Close ✕
            </button>
          </div>
          <h3 className="mt-3 font-sans text-2xl sm:text-3xl font-bold uppercase tracking-[-0.04em] text-[var(--ink)]">
            {service.title}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted)] font-normal">
            {service.outcome}
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div>
              <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--ink)]">
                Deliverables
              </h4>
              <ul className="mt-4 grid gap-2.5">
                {service.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-xs font-normal leading-relaxed text-[var(--muted)]"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-emerald-600 dark:bg-emerald-400"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--ink)]">
                Methodology
              </h4>
              <ol className="mt-4 grid gap-2.5">
                {service.process.map((step, idx) => (
                  <li
                    key={step}
                    className="flex gap-2.5 text-xs font-normal leading-relaxed text-[var(--muted)]"
                  >
                    <span className="font-mono text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                      0{idx + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--ink)]">
                Recommended For
              </h4>
              <ul className="mt-4 grid gap-2.5">
                {service.bestFor.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-xs font-normal leading-relaxed text-[var(--muted)]"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[var(--ink)]"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function Skills() {
  const reducedMotion = usePrefersReducedMotion();
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<HTMLDivElement>(null);
  const cardsWrapRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      const cards = cardsWrapRef.current?.querySelectorAll(".skills-card-reveal");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardsWrapRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--page)] py-16 sm:py-24 md:py-28 text-[var(--ink)] transition-colors duration-300"
    >
      <Container className="relative z-10">
        {/* Frame Top Sub-Bar */}
        <div className="flex items-center justify-between pb-4 text-xs text-[var(--muted)] mb-12 sm:mb-16">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span className="text-[var(--ink)] font-semibold">Technical Architecture</span>
          </div>
          <span>Core Engineering Disciplines</span>
        </div>

        <div ref={headingRef}>
          <SectionHeading
            title="Technical Systems & Architecture"
            copy="I build where design precision, generative AI workflows, and high-performance full-stack architectures intersect: fast UI, modular systems, and details users can feel."
          />
        </div>

        {/* Responsive Skills Grid */}
        <div
          ref={loopRef}
          className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          aria-label="Skill Categories"
        >
          {skillGroups.map((group) => (
            <article
              key={group.title}
              className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 text-xs text-[var(--muted)]">
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{group.category}</span>
                </div>
                <h3 className="mb-6 font-sans text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink)]">
                  {group.title}
                </h3>
                <div className="grid gap-6">
                  {group.skills.map((skill) => (
                    <SkillMeter
                      key={skill.name}
                      name={skill.name}
                      level={skill.level}
                      tier={skill.tier}
                      tags={skill.tags}
                    />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* 3D Interactive Services Cards */}
        <div ref={cardsWrapRef} className="mt-12 sm:mt-16 grid gap-5 sm:gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              service={service}
              isSelected={selectedService?.title === service.title}
              onSelect={() => {
                if (selectedService?.title === service.title) {
                  setSelectedService(null);
                } else {
                  setSelectedService(service);
                  setTimeout(() => {
                    detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                  }, 120);
                }
              }}
            />
          ))}
        </div>

        {/* Selected Service Detailed View */}
        <div ref={detailRef}>
          {selectedService ? (
            <ServiceDetails service={selectedService} onClose={() => setSelectedService(null)} />
          ) : (
            <div className="mt-8 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-6 py-5 text-center text-xs text-[var(--muted)]">
              Select any capability above to review its workflow process, timeline, and key deliverables.
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
