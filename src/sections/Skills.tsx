import React, { useEffect, useRef, useState } from "react";
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
  reducedMotion,
  onSelect,
}: {
  service: Service;
  isSelected: boolean;
  reducedMotion: boolean;
  onSelect: () => void;
}) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [glare, setGlare] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reducedMotion || !cardRef.current || (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches)) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setTilt({
      x: ((y - centerY) / centerY) * -6,
      y: ((x - centerX) / centerX) * 6,
    });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-pressed={isSelected}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
        transition: isHovered ? "transform 0.12s ease-out" : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
      }}
      className={`skills-card-reveal group relative overflow-hidden rounded-3xl border p-7 sm:p-8 text-left transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#252A34] ${
        isSelected
          ? "border-[#252A34] dark:border-emerald-400 bg-[var(--surface)] backdrop-blur-xl shadow-xl ring-1 ring-[#252A34] dark:ring-emerald-400"
          : "border-black/10 dark:border-white/10 bg-[var(--surface-strong)]/60 backdrop-blur-md hover:border-[#252A34]/40 dark:hover:border-white/30 hover:bg-[var(--surface)]"
      }`}
    >
      {/* 3D Dynamic Interactive Glare Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.15) 0%, transparent 65%)`,
        }}
      />

      <div className="relative z-20">
        <div className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--page)] text-emerald-500 transition-all duration-300 shadow-sm group-hover:scale-110 group-hover:bg-emerald-500/10">
          <ServiceIcon icon={service.icon} />
        </div>
        <h3 className="mt-6 text-xl sm:text-2xl font-light text-[var(--ink)]">
          {service.title}
        </h3>
        <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[var(--ink)]/70 font-light">
          {service.description}
        </p>
        <span className="mt-6 inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-500 transition-colors">
          <span>{isSelected ? "Active View" : "View Details"}</span>
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1.5"
          >
            →
          </span>
        </span>
      </div>
    </button>
  );
}

function ServiceDetails({ service }: { service: Service }) {
  const detailWrapRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!detailWrapRef.current) return;
    gsap.fromTo(
      detailWrapRef.current,
      { opacity: 0, y: 25, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }
    );
  }, [service]);

  return (
    <article
      ref={detailWrapRef}
      className="mt-8 sm:mt-10 overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-[var(--surface)] backdrop-blur-xl shadow-xl transition-colors duration-500"
    >
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
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<HTMLDivElement>(null);
  const cardsWrapRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // GSAP ScrollTrigger Entrance Stagger
  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      if (loopRef.current) {
        gsap.fromTo(
          loopRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: loopRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      if (cardsWrapRef.current) {
        const cards = cardsWrapRef.current.querySelectorAll(".skills-card-reveal");
        gsap.fromTo(
          cards,
          { y: 45, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.85,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsWrapRef.current,
              start: "top 80%",
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
      className="relative overflow-hidden bg-[var(--page)] py-16 sm:py-20 md:py-24 text-[var(--ink)] border-t border-black/5 dark:border-white/5 transition-colors duration-500"
    >
      <div className="absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/4 -translate-y-1/4 rounded-full bg-[var(--flame)]/5 dark:bg-[var(--flame)]/10 blur-[130px] pointer-events-none" />

      <Container className="relative z-10">
        <div ref={headingRef}>
          <SectionHeading
            eyebrow="Skills & Services"
            title="Frontend depth with architectural precision."
            copy="I build where design artistry, AI workflows, and rock-solid systems intersect: fast UI, modular architectures, and details users can feel."
          />
        </div>

        {/* Infinite Skills Carousel with GPU Acceleration */}
        <div ref={loopRef} className="skill-loop mt-10 sm:mt-12" aria-label="Skill Categories">
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

        {/* 3D Interactive Services Cards */}
        <div ref={cardsWrapRef} className="mt-12 sm:mt-14 grid gap-5 sm:gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              service={service}
              isSelected={selectedService?.title === service.title}
              reducedMotion={reducedMotion}
              onSelect={() => setSelectedService(service)}
            />
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
