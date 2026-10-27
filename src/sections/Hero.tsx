import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { playClick } from "../utils/soundEffects";
import { scrollToSection } from "../utils/scrollToSection";
import { FlipFadeText } from "../components/ui/flip-fade-text";
import { HeroVisual } from "../components/ui/HeroVisual";

gsap.registerPlugin(useGSAP);

const HEADLINE = ["Crafting", "resilient", "web", "systems", "&", "tools."];
const ROLES = ["Full Stack & Creative Systems", "Freelance Developer", "Data Science Student"];

const chipClass =
  "hero-chip inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink)] transition-colors duration-200 hover:border-[var(--ink)] hover:bg-[var(--surface-strong)]";

export function Hero() {
  const reducedMotion = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = heroRef.current;
      if (!root) return;
      const cleanups: Array<() => void> = [];

      if (reducedMotion) {
        gsap.set(
          ".hero-fade, .hero-word, .hero-chip, .hero-visual-card",
          { opacity: 1, y: 0, yPercent: 0, x: 0, scale: 1 },
        );
        gsap.set(".hero-underline, .hero-line", { scaleX: 1 });
        return;
      }

      /* ---------- Intro ---------- */
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(".hero-status", { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
        .fromTo(
          ".hero-word",
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.95, stagger: 0.07, ease: "expo.out" },
          "-=0.3",
        )
        .fromTo(
          ".hero-underline",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.75, ease: "power3.inOut" },
          "-=0.5",
        )
        .fromTo(
          ".hero-fade",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 },
          "-=0.65",
        )
        .fromTo(
          ".hero-chip",
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.07 },
          "-=0.5",
        )
        .fromTo(".hero-line", { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "power3.inOut" }, "-=0.8")
        .fromTo(
          ".hero-visual-card",
          { y: 36, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 1.05, ease: "expo.out" },
          0.3,
        );

      /* ---------- Role text cycler ---------- */
      const roleEl = roleRef.current;
      if (roleEl) {
        let i = 0;
        const roleTl = gsap.timeline({ repeat: -1, delay: 3 });
        roleTl
          .to(roleEl, { yPercent: -110, opacity: 0, duration: 0.4, ease: "power2.in", delay: 2.4 })
          .call(() => {
            i = (i + 1) % ROLES.length;
            roleEl.textContent = ROLES[i];
          })
          .fromTo(
            roleEl,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
          );
        cleanups.push(() => {
          roleEl.textContent = ROLES[0];
        });
      }

      return () => {
        cleanups.forEach((fn) => fn());
      };
    },
    { scope: heroRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-[var(--page)] text-[var(--ink)]"
    >
      <style>{`
        @keyframes hero-ping { 0% { transform: scale(1); opacity: .6; } 80%,100% { transform: scale(2.6); opacity: 0; } }
        .hero-ping { animation: hero-ping 2.2s cubic-bezier(0,0,.2,1) infinite; }
        @keyframes hero-glow-pulse {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(20px, -8px, 0) scale(1.08); }
        }
        .hero-glow {
          animation: hero-glow-pulse 8s ease-in-out infinite;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          contain: layout style paint;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-ping { animation: none; }
          .hero-glow { animation: none; }
        }
      `}</style>

      {/* Single soft lavender glow behind the poster */}
      <div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute right-[-5%] top-1/4 h-[320px] w-[320px] rounded-full bg-[#B39CFF] opacity-15 blur-[90px] sm:h-[440px] sm:w-[440px] sm:blur-[120px]"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between px-6 pb-6 pt-20 sm:px-10 sm:pb-8 sm:pt-24 lg:px-16 lg:pt-24">
        {/* Architectural Status Row */}
        <div
          data-ui="status"
          className="hero-status flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] sm:py-2.5"
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="hero-ping absolute inline-flex h-full w-full rounded-full bg-[#B39CFF]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#B39CFF]" />
            </span>
            <span className="font-semibold text-[var(--ink)]">AYUSH SINGH</span>
            <span aria-hidden="true" className="opacity-40">/</span>
            <span className="relative inline-block h-[1.3em] overflow-hidden align-bottom">
              <span ref={roleRef} className="inline-block text-[var(--ink)]">
                {ROLES[0]}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">[28.6139° N, 77.2090° E]</span>
            <span className="border border-[var(--line)] px-2 py-0.5 rounded-sm text-[#B39CFF] font-semibold">
              AVAILABLE Q2/Q3
            </span>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid flex-1 items-center gap-10 py-6 sm:py-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 xl:gap-14">
          <div className="relative z-10 flex max-w-2xl flex-col items-start">
            <h1
              aria-label="Crafting resilient web systems & tools."
              className="font-sans text-[clamp(2.5rem,5.2vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-[var(--ink)]"
            >
              {HEADLINE.map((word, i) => {
                const accent = word === "resilient";
                return (
                  <span key={`${word}-${i}`} aria-hidden="true">
                    <span className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
                      <span
                        className={`hero-word relative inline-block will-change-transform ${accent ? "font-serif font-normal italic tracking-[-0.02em]" : ""
                          }`}
                      >
                        {word}
                        {accent && (
                          <span className="hero-underline absolute -bottom-[0.02em] left-0 h-[0.1em] w-full origin-left rounded-full bg-[#B39CFF]" />
                        )}
                      </span>
                    </span>{" "}
                  </span>
                );
              })}
            </h1>

            <p className="hero-fade mt-5 max-w-xl text-base leading-relaxed text-[var(--ink)]/85 sm:mt-6 sm:text-lg">
              Full stack developer, freelancer, and data science student. Bridging high-performance
              data architecture, production web applications, and thoughtful design craft.
            </p>

            <div className="hero-fade mt-7 flex w-full flex-col gap-3.5 sm:mt-8 sm:w-auto sm:flex-row">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  playClick();
                  scrollToSection("#work");
                }}
                className="btn-neo-base btn-neo-primary group inline-flex h-12 items-center justify-between gap-5 px-6 sm:min-w-[200px]"
              >
                <span>Explore Selected Work</span>
                <span className="btn-icon-pod h-7 w-7 rounded-full bg-[var(--page)] text-[var(--ink)] dark:bg-black dark:text-[#B39CFF]">
                  <ArrowDown className="btn-icon-pod-down h-3.5 w-3.5" />
                </span>
              </motion.a>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-flex">
                <Link
                  to="/resume"
                  className="btn-neo-base btn-neo-secondary group inline-flex h-12 w-full items-center justify-between gap-4 px-6 sm:min-w-[160px]"
                >
                  <span>View Résumé</span>
                  <span className="btn-icon-pod h-7 w-7 rounded-full bg-[var(--surface-strong)] text-[var(--ink)]">
                    <ArrowUpRight className="btn-icon-pod-arrow h-3.5 w-3.5 text-[#1E90FF] dark:text-[#B39CFF]" />
                  </span>
                </Link>
              </motion.div>
            </div>

            <nav
              aria-label="Social links"
              className="mt-6 flex flex-wrap items-center gap-2.5 text-xs text-[var(--muted)] sm:mt-8 sm:gap-3"
            >
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={chipClass}
                href="https://github.com/codewith-Yush"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current opacity-80" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                <span>GitHub</span>
                <span className="opacity-50">↗</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={chipClass}
                href="https://linkedin.com/in/ayush-singh-643a4b25a"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current opacity-80" aria-hidden="true">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <span>LinkedIn</span>
                <span className="opacity-50">↗</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={chipClass}
                href="https://twitter.com/ayushsingh"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current opacity-80" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>X</span>
                <span className="opacity-50">↗</span>
              </motion.a>
            </nav>
          </div>

          {/* Architectural Kinetic Core & Intelligence Visualizer */}
          <div className="hero-visual-card relative mx-auto w-full flex items-center justify-center">
            <HeroVisual />
          </div>
        </div>

        {/* Focus & Specialization Architectural Banner */}
        <div className="hero-fade my-4 sm:my-6 flex flex-col items-center justify-between gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-5 py-3.5 shadow-sm sm:flex-row sm:gap-6 sm:px-6">
          <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B39CFF] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#B39CFF]" />
            </span>
            <span className="font-semibold text-[var(--ink)]">[SPECIALIZATION]</span>
          </div>

          <FlipFadeText
            words={["FULL STACK ARCHITECTURE", "DATA INTELLIGENCE (POWER BI)", "CREATIVE SYSTEMS", "AI WORKFLOWS"]}
            interval={2600}
            className="min-h-[44px] py-0"
            textClassName="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-[var(--ink)]"
          />

          <div className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] sm:block">
            <span className="text-[#1E90FF] font-semibold">2026 // PRODUCTION</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-2">
          <div className="hero-line h-px w-full origin-left bg-[var(--line)]" />
          <div className="hero-fade flex flex-col gap-2.5 pt-3 sm:flex-row sm:items-center sm:justify-between sm:pt-3.5 text-xs text-[var(--muted)]">
            <span>Available for select freelance &amp; full-time engagements</span>
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                playClick();
                scrollToSection("#work");
              }}
              className="group inline-flex items-center gap-2 text-[var(--ink)] hover:underline"
            >
              <span>Explore works</span>
              <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}