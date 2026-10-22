import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export function Hero() {
  const reducedMotion = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const context = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(".hero-reveal", { opacity: 1, y: 0 });
        gsap.set(".hero-poster", { opacity: 1, clipPath: "inset(0 0 0 0)" });
        return;
      }

      gsap.set(".hero-reveal", { opacity: 0, y: 18 });
      gsap.set(".hero-poster", { opacity: 0, clipPath: "inset(0 0 0 100%)" });

      const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
      entrance
        .to(".hero-reveal", {
          opacity: 1,
          y: 0,
          duration: 0.72,
          stagger: 0.09,
        })
        .to(
          ".hero-poster",
          {
            opacity: 1,
            clipPath: "inset(0 0 0 0)",
            duration: 1.05,
            ease: "power2.inOut",
          },
          0.22,
        );
    }, heroRef);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[var(--page)] text-[var(--ink)]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-6 pt-24 pb-8 sm:px-10 sm:pt-28 sm:pb-10 lg:px-16 lg:pt-32">
        <div className="hero-reveal flex items-center justify-between border-b border-[var(--line)] pb-4 font-mono text-[10px] uppercase tracking-[0.18em] sm:text-[11px]">
          <span className="flex items-center gap-3 text-[var(--muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" aria-hidden="true" />
            <span>Portfolio <span className="text-[var(--ink)] font-semibold">/ 2026</span></span>
          </span>
          <span className="text-[var(--muted)]">Digital craft <span className="px-2">/</span> India</span>
        </div>

        <main className="grid flex-1 items-center gap-10 py-10 md:grid-cols-[1.05fr_0.95fr] md:gap-6 lg:py-12">
          <div className="relative z-10 flex flex-col items-start">
            <p className="hero-reveal mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] sm:mb-7 sm:text-xs">
              Full stack engineer <span className="px-1 text-emerald-700 dark:text-emerald-400">×</span> creative technologist
            </p>

            <h1
              aria-label="Make the web feel alive"
              className="font-sans text-[clamp(3.3rem,8vw,7rem)] font-bold uppercase leading-[0.82] tracking-[-0.075em]"
            >
              <span className="hero-reveal block">Make the</span>
              <span className="hero-reveal block">web</span>
              <span className="hero-reveal block font-serif font-normal italic lowercase tracking-[-0.07em] text-emerald-700 dark:text-emerald-400">
                feel
              </span>
              <span className="hero-reveal block">alive.</span>
            </h1>

            <p className="hero-reveal mt-6 max-w-md text-sm leading-7 text-[var(--muted)] sm:mt-8 sm:text-base">
              I turn complex ideas into expressive interfaces and fast, dependable systems.
            </p>

            <div className="hero-reveal mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row">
              <a
                href="#work"
                className="group inline-flex h-12 items-center justify-between gap-8 border border-[var(--ink)] bg-[var(--ink)] px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.13em] text-[var(--page)] transition-colors duration-300 hover:bg-transparent hover:text-[var(--ink)] sm:min-w-[190px]"
              >
                <span>Explore my work</span>
                <span className="text-base transition-transform duration-300 group-hover:translate-y-1">↓</span>
              </a>
              <Link
                to="/resume"
                className="group inline-flex h-12 items-center justify-between gap-8 border border-[var(--line)] px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.13em] transition-colors duration-300 hover:border-[var(--ink)] sm:min-w-[160px]"
              >
                <span>Résumé</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
              </Link>
            </div>

            <nav
              aria-label="Social links"
              className="hero-reveal mt-8 flex items-center gap-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] sm:mt-10"
            >
              <a className="transition-colors hover:text-[var(--ink)]" href="https://github.com/codewith-Yush" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
              <a className="transition-colors hover:text-[var(--ink)]" href="https://linkedin.com/in/ayush-singh-643a4b25a" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
              <a className="transition-colors hover:text-[var(--ink)]" href="https://twitter.com/ayushsingh" target="_blank" rel="noopener noreferrer">X ↗</a>
            </nav>
          </div>

          <div className="hero-poster relative mx-auto aspect-[0.88] w-full max-w-[520px] select-none" aria-hidden="true">
            <div
              className="absolute left-[12%] top-[7%] h-[76%] w-[76%] -rotate-3 overflow-hidden border border-[var(--ink)] bg-[#C7ED70]"
              style={{
                backgroundImage: "linear-gradient(rgb(20 20 18 / 0.08) 1px, transparent 1px), linear-gradient(90deg, rgb(20 20 18 / 0.08) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            >
              <span className="absolute left-[7%] top-[2%] font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-black">
                Interface / 01
              </span>
              <span className="absolute -left-[3%] top-[10%] font-serif text-[clamp(15rem,38vw,25rem)] leading-[0.9] tracking-[-0.12em] text-black">
                &amp;
              </span>
              <span className="absolute bottom-[7%] right-[7%] font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-black">
                Code + character
              </span>
              <span className="absolute right-[8%] top-[8%] h-3 w-3 bg-black" />
            </div>

            <div className="absolute bottom-[9%] right-[1%] flex h-[27%] w-[58%] flex-col justify-between bg-[var(--ink)] p-4 text-[var(--page)] sm:p-5">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--page)]/60">
                Thoughtfully engineered
              </span>
              <span className="font-sans text-2xl font-semibold uppercase leading-[0.9] tracking-[-0.06em] sm:text-3xl">
                Ideas into<br />experiences<span className="text-emerald-400">.</span>
              </span>
            </div>

            <span className="absolute left-[2%] top-[35%] -rotate-90 font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--muted)]">
              Design / Develop / Refine
            </span>
            <span className="absolute bottom-[5%] left-[12%] font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
              01 <span className="px-2">—</span> Portfolio
            </span>
          </div>
        </main>

        <div className="hero-reveal flex items-center justify-between border-t border-[var(--line)] pt-4 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--muted)] sm:text-[10px]">
          <span>Available for select projects</span>
          <a href="#work" className="group flex items-center gap-3 transition-colors hover:text-[var(--ink)]">
            Scroll to explore
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--line)] transition-transform duration-300 group-hover:translate-y-1">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
