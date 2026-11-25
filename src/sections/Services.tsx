import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Container } from "../components/Container";
import { ServiceIcon } from "../components/ServiceIcon";
import { services, type Service } from "../data/portfolio";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { playClick, playTab } from "../utils/soundEffects";
import { scrollToSection } from "../utils/scrollToSection";
import { cn } from "../utils/cn";

export function Services() {
  const reducedMotion = usePrefersReducedMotion();
  const [activeService, setActiveService] = useState<Service>(services[0]);

  const handleSelectService = (service: Service) => {
    playTab();
    setActiveService(service);
  };

  return (
    <section
      id="services"
      className="relative scroll-mt-16 overflow-hidden bg-[var(--page)] py-[var(--section-high)] text-[var(--ink)] transition-colors duration-300 sm:scroll-mt-20 lg:scroll-mt-24"
    >
      <Container className="relative z-10">
        {/* Editorial Header matching jeppesen.dev */}
        <div className="mb-10 border-b border-[var(--line)] pb-6">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            Services
          </p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.75rem)] font-semibold leading-[0.98] tracking-[-0.03em]">
            Specialized services &amp; solutions.
          </h2>
        </div>

        {/* jeppesen.dev 12-Column Editorial Split */}
        <div className="grid grid-cols-1 items-start gap-[var(--gutter)] lg:grid-cols-12">
          {/* Left 7 Cols: Oversized Interactive Service Titles */}
          <ul className="flex flex-col divide-y divide-[var(--line)] lg:col-span-7" aria-label="Services">
            {services.map((service, idx) => {
              const isSelected = activeService.title === service.title;
              return (
                <li key={service.title}>
                  <button
                    type="button"
                    onClick={() => handleSelectService(service)}
                    onMouseEnter={() => setActiveService(service)}
                    aria-pressed={isSelected}
                    className={cn(
                      "group relative flex w-full items-center justify-between gap-4 py-5 pl-4 text-left transition-all duration-300 sm:py-7",
                      isSelected
                        ? "translate-x-1 text-[var(--ink)]"
                        : "text-[var(--muted)] hover:translate-x-1 hover:text-[var(--ink)]",
                    )}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="service-active-bar"
                        aria-hidden="true"
                        transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute left-0 top-5 bottom-5 w-[2px] bg-[var(--ink)] sm:top-7 sm:bottom-7"
                      />
                    )}
                    <div className="flex items-baseline gap-4 sm:gap-6">
                      <span className="font-mono text-xs tabular-nums opacity-60">
                        0{idx + 1}
                      </span>
                      <span className="font-display text-[clamp(1.75rem,4.2vw,4rem)] font-semibold leading-[0.98] tracking-[-0.03em]">
                        {service.title}
                      </span>
                    </div>

                    <span className="hidden shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] opacity-70 sm:inline">
                      {service.timeline}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right 5 Cols: Sticky Architectural Inspection Panel */}
          <div className="lg:sticky lg:top-24 lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.title}
                initial={reducedMotion ? false : { opacity: 0, y: 8, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -8, scale: 0.985 }}
                transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-[4px] border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8"
              >
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-[4px] border border-[var(--line)] bg-[var(--page)]">
                      <ServiceIcon icon={activeService.icon} className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                        Target Timeline
                      </span>
                      <span className="font-sans text-sm font-semibold text-[var(--ink)]">
                        {activeService.timeline}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-[2.5px] border border-[var(--line)] bg-[var(--page)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                    Scope Spec
                  </span>
                </div>

                <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-[var(--ink)]">
                  {activeService.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted)]">
                  {activeService.outcome}
                </p>

                {/* Key Deliverables */}
                <div className="mt-6 border-t border-[var(--line)] pt-5">
                  <h4 className="mb-3 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink)]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[var(--muted)]" />
                    <span>Key Deliverables</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-[var(--muted)] sm:text-sm">
                    {activeService.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ink)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tags */}
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {activeService.bestFor.map((item) => (
                    <span
                      key={item}
                      className="rounded-[2.5px] border border-[var(--line)] bg-[var(--page)] px-2.5 py-1 font-mono text-[11px] text-[var(--muted)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    scrollToSection("#contact");
                  }}
                  className="mt-6 inline-flex h-[46px] w-full items-center justify-between rounded-[4px] bg-[var(--ink)] px-5 text-sm font-semibold text-[var(--page)] transition-opacity hover:opacity-85"
                >
                  <span>Initiate Project Inquiry</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
