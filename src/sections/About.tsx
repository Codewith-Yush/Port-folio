import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "../components/Container";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const paragraphs = [
  "I am Ayush Singh, a passionate full-stack developer and AI creator focused on engineering modern, responsive, and visually engaging digital experiences.",
  "My work combines high-performance frontend architecture, creative design systems, AI-powered automation, and clean user interfaces that leave lasting impressions.",
  "I believe every digital product should be lightning fast, beautifully minimal, accessible, and crafted with both visual artistry and structural precision in mind.",
];

const stats = [
  { value: "15+", label: "Projects Completed", sub: "Production-ready web apps" },
  { value: "4+", label: "Years of Learning", sub: "Continuous growth & research" },
  { value: "25+", label: "Skills & Tools", sub: "Modern stacks & ecosystems" },
];

const values = ["Modern UI", "Creative Design", "AI Innovation", "Performance"];

export function About() {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion) return;

      const elements = contentRef.current?.children;
      if (elements) {
        gsap.fromTo(
          elements,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
            },
          }
        );
      }

      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { scale: 0.94, opacity: 0, y: 40 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative overflow-hidden bg-[var(--page)] py-12 sm:py-16 md:py-20 text-[var(--ink)] border-t border-black/5 dark:border-white/5 transition-colors duration-500"
    >
      {/* Ambient background glow orbs */}
      <div className="absolute left-0 top-0 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--flame)]/5 dark:bg-[var(--flame)]/10 blur-[130px] pointer-events-none transition-colors duration-500" />
      <div className="absolute right-0 bottom-0 h-[450px] w-[450px] translate-x-1/3 translate-y-1/3 rounded-full bg-[var(--blush)]/5 dark:bg-[var(--blush)]/10 blur-[120px] pointer-events-none transition-colors duration-500" />

      <Container className="relative z-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        {/* Left Column: Bio and Stats */}
        <div ref={contentRef} className="relative z-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--flame)] dark:text-[var(--blush)] backdrop-blur-md transition-colors duration-500">
            About Me
          </div>

          <h2 className="max-w-2xl text-3xl sm:text-4xl lg:text-5xl font-light leading-[1.1] tracking-tight text-[var(--ink)] transition-colors duration-500">
            Engineering modern digital platforms with{" "}
            <span className="font-serif italic text-[var(--flame)] dark:text-[var(--blush)]">creativity</span> and structural purpose.
          </h2>

          <p className="mt-5 max-w-xl text-base sm:text-lg font-medium leading-relaxed text-[var(--ink)]/80 transition-colors duration-500">
            Clean architectures, AI-empowered workflows, and user-centric design experiences.
          </p>

          <div className="mt-8 grid gap-4">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="max-w-xl text-sm sm:text-base leading-relaxed text-[var(--ink)]/70 dark:text-[var(--ink)]/65 transition-colors duration-500"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="group relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--flame)]/40 hover:shadow-lg"
              >
                <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[var(--flame)]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <p className="text-3xl sm:text-4xl font-light text-[var(--ink)] tracking-tight">
                  {item.value}
                </p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--ink)]/80">
                  {item.label}
                </p>
                <p className="mt-1 text-[10px] text-[var(--ink)]/50 hidden sm:block">
                  {item.sub}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Mindset & Core Principles Card */}
        <div
          ref={cardRef}
          className="group relative min-h-[440px] sm:min-h-[500px] w-full overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-black/[0.02] to-black/[0.05] dark:from-white/[0.04] dark:to-white/[0.01] p-6 sm:p-8 backdrop-blur-md transition-all duration-500 shadow-sm hover:shadow-xl"
        >
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.08),transparent_55%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(244,114,182,0.08),transparent_55%)] pointer-events-none" />

          {/* Top Header Panel */}
          <div className="relative z-10 flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--flame)] dark:text-[var(--blush)]">
                Vision & Principles
              </span>
              <h3 className="mt-1 text-lg font-semibold text-[var(--ink)]">
                The Engineering Standard
              </h3>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-xs">
              ⚡
            </div>
          </div>

          {/* Central Mindset Statement */}
          <div className="relative z-10 my-8 rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-black/40 p-5 sm:p-6 backdrop-blur-xl shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ink)]/50">
              Core Philosophy
            </p>
            <p className="mt-2 text-sm sm:text-base font-normal leading-relaxed text-[var(--ink)]">
              "Deliver digital experiences where mathematical clarity, smooth kinetic motion, and intuitive ergonomics operate in complete harmony."
            </p>
          </div>

          {/* Value Tags */}
          <div className="relative z-10 grid grid-cols-2 gap-2.5 sm:gap-3">
            {values.map((value) => (
              <div
                key={value}
                className="flex items-center gap-2 rounded-xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/50 px-3.5 py-2.5 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-[var(--flame)]/30"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--flame)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--ink)]">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Floating Subtle Ambient Decorative Badges */}
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-36 w-36 rounded-full bg-[var(--flame)]/10 blur-2xl" />
        </div>
      </Container>
    </section>
  );
}
