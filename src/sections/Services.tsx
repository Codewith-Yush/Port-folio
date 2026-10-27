import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import { Container } from "../components/Container";
import { SectionHeading } from "../components/SectionHeading";
import { ServiceIcon } from "../components/ServiceIcon";
import { services, type Service } from "../data/portfolio";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { playClick, playTab } from "../utils/soundEffects";
import { scrollToSection } from "../utils/scrollToSection";

export function Services() {
  const reducedMotion = usePrefersReducedMotion();
  const [activeService, setActiveService] = useState<Service | null>(services[0]);
  const detailRef = useRef<HTMLDivElement>(null);

  const handleSelectService = (service: Service) => {
    playTab();
    setActiveService(service);
  };

  return (
    <section
      id="services"
      className="relative scroll-mt-20 overflow-hidden bg-[var(--page)] pt-16 pb-20 text-[var(--ink)] transition-colors duration-300 sm:scroll-mt-24 sm:pt-20 sm:pb-24 md:scroll-mt-28 md:pt-24 md:pb-28"
    >
      <Container className="relative z-10">
        {/* Architectural Sub-Bar */}
        <div className="mb-6 flex items-center justify-between border-b border-[var(--line)] pb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)] sm:mb-8">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-[#1E90FF]" aria-hidden="true" />
            <span className="font-semibold text-[var(--ink)]">[04 // SERVICES & SOLUTIONS]</span>
          </div>
          <span className="hidden sm:inline text-[#B39CFF] font-medium">[SYSTEMS · INTELLIGENCE · DESIGN]</span>
        </div>

        <div>
          <SectionHeading
            title="Specialized Services & Client Solutions"
            copy="High-impact engineering engagements spanning full-stack web platforms, automated Power BI analytics pipelines, and generative visual storytelling."
          />
        </div>

        {/* 3-Column Services Overview Grid */}
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
          {services.map((service, idx) => {
            const isSelected = activeService?.title === service.title;
            return (
              <motion.article
                key={service.title}
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
                onClick={() => handleSelectService(service)}
                className={`group relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 cursor-pointer sm:p-7 ${
                  isSelected
                    ? "border-[#B39CFF] bg-[var(--surface-strong)] shadow-[0_12px_32px_-16px_rgba(179,156,255,0.22)]"
                    : "border-[var(--line)] bg-[var(--surface)] hover:border-[#B39CFF]/50 hover:bg-[var(--surface-strong)]"
                }`}
              >
                {/* Corner Crosshair Stamps */}
                <span className="brutal-corner-cross left-3 top-2.5 text-[#B39CFF]">+</span>
                <span className="brutal-corner-cross right-3 top-2.5 font-mono text-[10px] text-[#1E90FF] font-semibold">
                  0{idx + 1}
                </span>

                <div>
                  <div className="flex items-center justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] transition-transform duration-300 group-hover:scale-105">
                      <ServiceIcon icon={service.icon} className="h-6 w-6" />
                    </div>
                    <span className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[#1E90FF] font-semibold">
                      {service.timeline}
                    </span>
                  </div>

                  <h3 className="mt-5 font-sans text-xl font-bold tracking-tight text-[var(--ink)] group-hover:text-[#B39CFF] transition-colors">
                    {service.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted)]">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[var(--line)] pt-4">
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--muted)] group-hover:text-[#B39CFF] transition-colors">
                    {isSelected ? "Active View" : "Explore Details"}
                  </span>
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300 ${
                    isSelected ? "border-[#B39CFF] bg-[#B39CFF] text-[#0D0D0D]" : "border-[var(--line)] text-[var(--muted)] group-hover:border-[#B39CFF] group-hover:text-[#B39CFF] group-hover:translate-x-0.5"
                  }`}>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Detailed Service Inspection Panel */}
        <div ref={detailRef} className="mt-8">
          <AnimatePresence mode="wait">
            {activeService && (
              <motion.div
                key={activeService.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8 md:p-10 shadow-xl"
              >
                {/* Subtle top hairline */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B39CFF]/40 to-transparent" />

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                  {/* Left Column: Scope & Outcome */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                    <div>
                      <div className="flex items-center gap-2.5 font-mono text-xs text-[#B39CFF] font-semibold uppercase tracking-wider mb-2">
                        <Sparkles className="h-4 w-4" />
                        <span>Scope &amp; Deliverables Spec</span>
                      </div>
                      <h4 className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">
                        {activeService.title}
                      </h4>
                      <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
                        {activeService.outcome}
                      </p>
                    </div>

                    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4 sm:p-5">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--muted)] block mb-1.5">
                        Target Timeline
                      </span>
                      <span className="font-sans text-2xl sm:text-3xl font-extrabold text-[var(--ink)]">
                        {activeService.timeline}
                      </span>
                      <span className="block mt-1 text-xs text-[var(--muted)]">
                        From project initiation to production handover
                      </span>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          playClick();
                          scrollToSection("#contact");
                        }}
                        className="btn-neo-base btn-neo-primary inline-flex h-12 w-full sm:w-auto items-center justify-between gap-5 px-6"
                      >
                        <span>Initiate Project Inquiry</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Breakdown Grid */}
                  <div className="lg:col-span-7 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Deliverables List */}
                    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-5 sm:p-6">
                      <h5 className="font-mono text-xs uppercase tracking-wider text-[#B39CFF] font-bold mb-4 flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Key Deliverables
                      </h5>
                      <ul className="space-y-3">
                        {activeService.deliverables.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--ink)]">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E90FF]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Step-by-Step Process */}
                    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-5 sm:p-6">
                      <h5 className="font-mono text-xs uppercase tracking-wider text-[#1E90FF] font-bold mb-4 flex items-center gap-2">
                        <span>//</span>
                        Execution Process
                      </h5>
                      <ol className="space-y-3">
                        {activeService.process.map((step, sIdx) => (
                          <li key={step} className="flex items-center gap-3 text-xs sm:text-sm text-[var(--ink)]">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-[var(--line)] bg-[var(--surface)] font-mono text-[10px] font-bold text-[#B39CFF]">
                              {sIdx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Best For Tags (Full Span in right column) */}
                    <div className="sm:col-span-2 rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-5 sm:p-6">
                      <span className="font-mono text-xs uppercase tracking-wider text-[var(--muted)] font-bold block mb-3">
                        Recommended Use Cases &amp; Engagements
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {activeService.bestFor.map((item) => (
                          <span
                            key={item}
                            className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 font-mono text-xs text-[var(--ink)] transition-colors hover:border-[#FF0099]/40 hover:text-[#FF0099]"
                          >
                            #{item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
