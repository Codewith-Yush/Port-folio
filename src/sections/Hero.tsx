import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { projects } from "../data/portfolio";
import { useMagnetic } from "../hooks/useMagnetic";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { playClick } from "../utils/soundEffects";
import { scrollToSection } from "../utils/scrollToSection";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/codewith-Yush" },
  { label: "LinkedIn", href: "https://linkedin.com/in/ayush-singh-643a4b25a" },
  { label: "X", href: "https://twitter.com/ayushsingh" },
];

/* ─────────────────────────────────── Hero ─────────────────────────────────── */

export function Hero() {
  const reducedMotion = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const cardLinkRef = useRef<HTMLAnchorElement>(null);
  const ctaMagnetic = useMagnetic<HTMLAnchorElement>(0.2, reducedMotion);
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  /* ---------- Smooth auto-cycle through all project images ---------- */
  useEffect(() => {
    if (reducedMotion || paused || projects.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % projects.length);
    }, 3400);
    return () => window.clearInterval(id);
  }, [reducedMotion, paused]);

  const activeProject = projects[activeIdx] ?? projects[0];

  /* ---------- Intro: one calm reveal ---------- */
  useGSAP(
    () => {
      if (!heroRef.current) return;

      if (reducedMotion) {
        gsap.set(".hero-fade, .hero-card, .hero-word, .hero-line", {
          opacity: 1,
          y: 0,
          yPercent: 0,
        });
        return;
      }

      gsap
        .timeline({ defaults: { ease: "power3.out", force3D: true } })
        .fromTo(
          ".hero-line",
          { yPercent: 108 },
          { yPercent: 0, duration: 1.0, stagger: 0.1, ease: "expo.out" },
          0,
        )
        .fromTo(
          ".hero-fade",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.08 },
          0.12,
        )
        .fromTo(
          ".hero-card",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9 },
          0.3,
        )
        .fromTo(
          ".hero-word",
          { yPercent: 100 },
          { yPercent: 0, duration: 1.3, ease: "expo.out" },
          0.1,
        );

      // Smooth scroll-linked parallax as the user scrolls past Hero
      gsap.to(".hero-card", {
        y: -28,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(".hero-word", {
        y: -24,
        opacity: 0.72,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: heroRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden bg-[var(--page)] text-[var(--ink)] transition-colors duration-500 lg:h-[100svh] lg:min-h-[680px]"
    >
      <style>{`
        @keyframes hero-ping { 0% { transform: scale(1); opacity: .6; } 80%,100% { transform: scale(2.6); opacity: 0; } }
        .hero-ping { animation: hero-ping 2.2s cubic-bezier(0,0,.2,1) infinite; }
        @media (prefers-reduced-motion: reduce) { .hero-ping { animation: none; } }
      `}</style>

      {/* ───────── Content ───────── */}
      <div className="mx-auto flex w-full max-w-none flex-1 flex-col px-[var(--site-margin)] pt-24 sm:pt-28 lg:pt-[112px]">
        {/* 1 · Headline — masked line-by-line reveal */}
        <h1 className="font-sans text-[clamp(1.9rem,2.9vw,3.4rem)] leading-[1.06] tracking-[-0.035em]">
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="hero-line block font-extrabold">
              I build thoughtful digital products.
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="hero-line block font-light text-[var(--ink)]/90">
              From the first interface to the systems behind it.
            </span>
          </span>
        </h1>

        {/* 2 · Copy + actions (left)  ·  media (right, bottom-aligned) */}
        <div className="mt-8 grid flex-1 items-end gap-[var(--gutter)] md:mt-0 md:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
          <div className="flex flex-col items-start lg:pb-1">
            <p className="hero-fade max-w-[30rem] text-[15px] font-medium leading-[1.65] text-[var(--ink)]/65">
              Independent full stack developer and data science student in New
              Delhi. I bring engineering, analytics and design together to make
              useful things feel effortless.
            </p>

            <div className="hero-fade mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
              <a
                ref={ctaMagnetic.ref}
                onMouseMove={ctaMagnetic.onMouseMove}
                onMouseLeave={ctaMagnetic.onMouseLeave}
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  playClick();
                  scrollToSection("#work");
                }}
                className="group inline-flex h-11 items-center gap-3 rounded-[3px] bg-[var(--ink)] px-5 text-sm font-semibold text-[var(--page)] transition-opacity duration-200 hover:opacity-85 will-change-transform"
              >
                Explore selected work
                <ArrowDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
              </a>

              <Link
                to="/resume"
                className="group inline-flex items-center gap-1.5 border-b border-[var(--ink)]/25 pb-0.5 text-sm font-semibold transition-colors duration-200 hover:border-[var(--ink)]"
              >
                View résumé
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <figure
            className="hero-card w-full md:w-[clamp(260px,23vw,380px)]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <Link
              ref={cardLinkRef}
              to="/projects"
              onClick={() => playClick()}
              onPointerMove={(e) => {
                if (reducedMotion || e.pointerType !== "mouse" || !cardLinkRef.current) return;
                const r = cardLinkRef.current.getBoundingClientRect();
                const rx = (((e.clientY - r.top) / r.height - 0.5) * -5).toFixed(2);
                const ry = (((e.clientX - r.left) / r.width - 0.5) * 5).toFixed(2);
                cardLinkRef.current.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
              }}
              onPointerLeave={() => {
                if (cardLinkRef.current) {
                  cardLinkRef.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
                }
              }}
              data-cursor="View"
              aria-label={`View project: ${activeProject.title}`}
              className="group relative block aspect-[16/10] overflow-hidden rounded-[4px] border-[6px] border-[var(--surface)] bg-[var(--surface)] shadow-[0_20px_50px_-20px_rgba(37,37,37,0.22)] transition-transform duration-300 ease-out sm:border-8 will-change-transform"
            >
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={activeProject.image}
                  initial={
                    reducedMotion
                      ? { opacity: 1 }
                      : { clipPath: "inset(0% 0% 0% 100%)", scale: 1.08 }
                  }
                  animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
                  exit={
                    reducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0.4, scale: 0.96 }
                  }
                  transition={{
                    duration: 0.85,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute inset-0 h-full w-full bg-[#1e1e1e] will-change-transform"
                >
                  <img
                    src={activeProject.image}
                    alt={activeProject.title}
                    className="h-full w-full object-contain object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Subtle bottom progress bars */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center gap-1.5 bg-gradient-to-t from-black/55 via-black/15 to-transparent px-3 pb-2.5 pt-6">
                {projects.map((p, i) => (
                  <span
                    key={p.title}
                    className="relative h-[2px] flex-1 overflow-hidden bg-white/30"
                  >
                    {i === activeIdx && (
                      <motion.span
                        key={`bar-${activeIdx}-${paused}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: paused ? 0.5 : 1 }}
                        transition={{ duration: paused ? 0.2 : 3.4, ease: "linear" }}
                        className="absolute inset-0 origin-left bg-white"
                      />
                    )}
                    {i < activeIdx && <span className="absolute inset-0 bg-white/80" />}
                  </span>
                ))}
              </div>
            </Link>

            <figcaption className="mt-2.5 flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink)]/65">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={activeProject.title}
                  initial={reducedMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="truncate"
                >
                  {activeProject.title}
                </motion.span>
              </AnimatePresence>
              <span className="shrink-0 tabular-nums">
                {String(activeIdx + 1).padStart(2, "0")} /{" "}
                {String(projects.length).padStart(2, "0")}
              </span>
            </figcaption>
          </figure>
        </div>

        {/* 3 · One slim utility row */}
        <div className="hero-fade mt-8 flex flex-col gap-3 text-xs font-medium sm:flex-row sm:items-center sm:justify-between lg:mt-7">
          <span className="inline-flex items-center gap-2.5 text-[var(--ink)]/65">
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
              <span className="hero-ping absolute inline-flex h-full w-full rounded-full bg-[#252525] dark:bg-[#5b5b5b]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#252525] dark:bg-[#5b5b5b]" />
            </span>
            Open to select freelance &amp; full-time roles
          </span>

          <nav aria-label="Social links" className="flex items-center gap-6">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 transition-opacity duration-200 hover:opacity-55"
              >
                {s.label}
                <ArrowUpRight
                  className="h-3 w-3 opacity-50 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* ───────── Wordmark: edge-to-edge SVG matching jeppesen.dev ───────── */}
      <div
        aria-hidden="true"
        className="mt-4 select-none overflow-hidden px-[var(--site-margin)] pb-1 sm:pb-2"
      >
        <svg
          viewBox="0 0 1000 185"
          className="hero-word block h-auto w-full fill-[var(--ink)]"
          preserveAspectRatio="xMidYMid meet"
        >
          <text
            x="500"
            y="168"
            textAnchor="middle"
            textLength="992"
            lengthAdjust="spacing"
            className="font-display font-extrabold uppercase"
            style={{ fontSize: "212px", letterSpacing: "-0.04em" }}
          >
            AYUSH
          </text>
        </svg>
      </div>
    </section>
  );
}

export default Hero;