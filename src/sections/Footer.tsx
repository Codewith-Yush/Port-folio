import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "../components/Container";
import { navItems, projects } from "../data/portfolio";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { ChromaticImage } from "@/components/ui/chromatic-image";
import { playClick, playSuccess } from "../utils/soundEffects";

gsap.registerPlugin(ScrollTrigger);

const SOCIALS = [
  {
    name: "GitHub",
    url: "https://github.com/codewith-Yush",
    handle: "@codewith-Yush",
    icon: (
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    ),
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/ayush-singh-643a4b25a",
    handle: "in/ayush-singh",
    icon: (
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" />
    ),
  },
  {
    name: "Twitter",
    url: "https://twitter.com/ayushsingh",
    handle: "@ayushsingh",
    icon: (
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    ),
  },
];

const MARQUEE_ITEMS = [
  "FULL STACK ARCHITECTURE",
  "SYSTEM CRAFT & RESILIENCE",
  "CREATIVE DIRECTION",
  "GENERATIVE AI INTEGRATIONS",
  "HIGH PERFORMANCE WEB",
  "AVAILABLE FOR SELECT ENGAGEMENTS",
];

function FooterClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    let timer: number;
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    };

    updateTime();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(timer);
      } else {
        clearInterval(timer);
        timer = window.setInterval(updateTime, 1000);
        updateTime();
      }
    };

    timer = window.setInterval(updateTime, 1000);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <p className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-1 tracking-wider">
      {time || "00:00:00 AM"} • IST [UTC+5:30]
    </p>
  );
}

export function Footer() {
  const reducedMotion = usePrefersReducedMotion();

  const footerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const visualReelRef = useRef<HTMLDivElement>(null);

  const [copied, setCopied] = useState(false);
  const [activeProjectHover, setActiveProjectHover] = useState<number | null>(
    null,
  );

  // Snappy entrance reveal
  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
              once: true,
            },
          },
        );
      }

      if (visualReelRef.current) {
        gsap.fromTo(
          visualReelRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: visualReelRef.current,
              start: "top 85%",
              once: true,
            },
          },
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Smooth Scroll to Top
  const scrollToTop = () => {
    playClick();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Copy Email to Clipboard
  const handleCopyEmail = () => {
    playSuccess();
    navigator.clipboard.writeText("ayushsingh7360@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-[var(--page)] text-[var(--ink)] pt-16 sm:pt-20 pb-10 border-t border-[var(--line)] transition-colors duration-500"
    >
      {/* Editorial Monospace Marquee Ticker */}
      <div className="relative z-10 overflow-hidden border-y border-[var(--line)] py-3 bg-[var(--surface)] mb-12 sm:mb-16">
        <div className="footer-marquee-track flex gap-8 whitespace-nowrap">
          {[
            ...MARQUEE_ITEMS,
            ...MARQUEE_ITEMS,
            ...MARQUEE_ITEMS,
            ...MARQUEE_ITEMS,
          ].map((item, idx) => (
            <span
              key={idx}
              className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]"
            >
              <span>{item}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            </span>
          ))}
        </div>
        {/* Side Fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-[var(--page)] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-[var(--page)] to-transparent z-10" />
      </div>

      <Container className="relative z-10">
        {/* Frame Rule Header matching Hero & Sections */}
        <div className="mb-12 sm:mb-14 flex items-center justify-between border-b border-[var(--line)] pb-4 font-mono text-[10px] uppercase tracking-[0.18em] sm:text-[11px] text-[var(--muted)]">
          <span className="flex items-center gap-3">
            <span
              className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"
              aria-hidden="true"
            />
            <span>
              06 — Colophon <span className="text-[var(--ink)] font-semibold">/ Synthesis</span>
            </span>
          </span>
          <span>Archive / 2026</span>
        </div>

        {/* Visual Creative Showcase Dock */}
        <div ref={visualReelRef} className="footer-fade-in mb-16 sm:mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3 pb-3 border-b border-[var(--line)]">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                Index // Selected Archives
              </span>
              <h3 className="font-sans text-xl sm:text-2xl font-bold uppercase tracking-[-0.05em] text-[var(--ink)] mt-1">
                Visual catalogue & artifacts.
              </h3>
            </div>
            <a
              href="#work"
              onClick={() => playClick()}
              className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
            >
              <span>Explore all projects</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>

          {/* 3-Card Editorial Brutalist Visual Showcase Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {projects.slice(0, 3).map((project, idx) => {
              const cardClass = `footer-showcase-card group relative overflow-hidden border bg-[var(--surface)] p-3 transition-colors duration-300 ${
                activeProjectHover === idx
                  ? "border-[var(--ink)]"
                  : "border-[var(--line)] hover:border-[var(--ink)]"
              }`;

              const cardContent = (
                <>
                  {/* Visual Thumbnail */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden border border-[var(--line)] bg-[var(--page)]">
                    <ChromaticImage
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full"
                      imageClassName="object-cover"
                      zoom={0.16}
                      displacement={0.04}
                      chromaticShift={0.015}
                      tilt={0.35}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

                    {/* Top Index & Year Badge */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                      <span className="border border-[var(--line)] bg-[var(--page)]/90 backdrop-blur-md px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[var(--ink)]">
                        [ 0{idx + 1} ]
                      </span>
                      <span className="bg-[var(--ink)] text-[var(--page)] px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider">
                        {project.year}
                      </span>
                    </div>

                    {/* Bottom Image Overlay Text */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-tight truncate pr-2">
                        {project.title}
                      </span>
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-white/20 bg-black/60 font-mono text-xs text-white transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#C7ED70] group-hover:text-black">
                        ↗
                      </span>
                    </div>
                  </div>

                  {/* Tech Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.stack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="border border-[var(--line)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--muted)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </>
              );

              return project.galleryLink ? (
                <Link
                  key={project.title}
                  to={project.galleryLink}
                  onMouseEnter={() => setActiveProjectHover(idx)}
                  onMouseLeave={() => setActiveProjectHover(null)}
                  className={cardClass}
                >
                  {cardContent}
                </Link>
              ) : (
                <a
                  key={project.title}
                  href={project.link || "#work"}
                  target={
                    project.link?.startsWith("http") ? "_blank" : undefined
                  }
                  rel={
                    project.link?.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  onMouseEnter={() => setActiveProjectHover(idx)}
                  onMouseLeave={() => setActiveProjectHover(null)}
                  className={cardClass}
                >
                  {cardContent}
                </a>
              );
            })}
          </div>
        </div>

        {/* Central Kinetic Hero Statement */}
        <div className="footer-fade-in text-center my-14 sm:my-20">
          <div className="inline-flex items-center gap-2 border border-[var(--line)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted)] mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            <span>Transmission // Initialize new inquiry</span>
          </div>

          <h2
            ref={headingRef}
            className="font-sans text-[clamp(2.5rem,7vw,5.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.075em] text-[var(--ink)] max-w-4xl mx-auto"
          >
            Have a project in mind?{" "}
            <span className="font-serif font-normal italic lowercase tracking-[-0.07em] text-emerald-700 dark:text-emerald-400">
              let&apos;s build it together.
            </span>
          </h2>

          <p className="mt-5 max-w-lg mx-auto text-sm leading-6 text-[var(--muted)]">
            Available for select high-impact full-stack architecture, frontend engineering, and AI-driven products.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#contact"
              onClick={() => playClick()}
              className="group inline-flex h-12 w-full sm:w-auto items-center justify-between gap-6 border border-[var(--ink)] bg-[var(--ink)] px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--page)] transition-colors duration-300 hover:bg-transparent hover:text-[var(--ink)]"
            >
              <span>Start a project</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="group inline-flex h-12 w-full sm:w-auto items-center justify-between gap-6 border border-[var(--line)] bg-transparent px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink)] transition-colors duration-300 hover:border-[var(--ink)]"
            >
              <span>{copied ? "✓ Copied to clipboard" : "Copy direct email"}</span>
              <span className="font-mono text-xs text-[var(--muted)]">@</span>
            </button>
          </div>
        </div>

        {/* Bento Control & Info Grid */}
        <div className="footer-bento-grid grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-[var(--line)] pt-10 sm:pt-14">
          {/* Card 1: Telemetry & Availability */}
          <div className="footer-bento-card border border-[var(--line)] bg-[var(--surface)] p-6 flex flex-col justify-between gap-5 transition-colors hover:border-[var(--ink)]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                01 / Station & Coordinates
              </span>
              <span className="font-mono text-xs text-[var(--muted)]">IN // 28.61° N</span>
            </div>
            <div>
              <p className="font-sans text-base font-bold uppercase tracking-tight text-[var(--ink)]">
                New Delhi, India [IST]
              </p>
              <FooterClock />
            </div>
            <div className="flex items-center gap-2 pt-4 border-t border-[var(--line)] font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
              </span>
              <span>Available for freelance & full-time</span>
            </div>
          </div>

          {/* Card 2: Quick Navigation */}
          <div className="footer-bento-card border border-[var(--line)] bg-[var(--surface)] p-6 flex flex-col justify-between gap-5 transition-colors hover:border-[var(--ink)]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                02 / Directory Index
              </span>
              <span className="font-mono text-xs text-[var(--muted)]">[ 06 ]</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) =>
                item.href.startsWith("/") ? (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => playClick()}
                    className="font-mono text-[11px] uppercase tracking-wider text-[var(--muted)] hover:text-[var(--ink)] transition-colors py-1 flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <span>↗</span>
                  </Link>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => playClick()}
                    className="font-mono text-[11px] uppercase tracking-wider text-[var(--muted)] hover:text-[var(--ink)] transition-colors py-1 flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <span>↓</span>
                  </a>
                ),
              )}
            </div>
            <div className="pt-4 border-t border-[var(--line)] font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
              Architecture: React • GSAP • Tailwind
            </div>
          </div>

          {/* Card 3: Social Connectivity & Back to Top */}
          <div className="footer-bento-card border border-[var(--line)] bg-[var(--surface)] p-6 flex flex-col justify-between gap-5 transition-colors hover:border-[var(--ink)]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                03 / Dispatch & Network
              </span>
              <button
                type="button"
                onClick={scrollToTop}
                className="group flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
                title="Scroll back to top"
              >
                <span>[ Top ]</span>
                <span className="transition-transform duration-300 group-hover:-translate-y-0.5">
                  ↑
                </span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="inline-flex items-center gap-2 border border-[var(--line)] bg-transparent px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-[var(--ink)] transition-colors hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--page)]"
                >
                  <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current">
                    {social.icon}
                  </svg>
                  <span>{social.name} ↗</span>
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-[var(--line)] font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
              © {new Date().getFullYear()} Ayush Singh. All rights reserved.
            </div>
          </div>
        </div>

        {/* Massive Editorial Studio Signature */}
        <div className="mt-14 sm:mt-20 overflow-hidden select-none pointer-events-none opacity-20 dark:opacity-15">
          <div className="font-sans text-[clamp(3.5rem,14vw,11.5rem)] font-black uppercase tracking-[-0.075em] leading-[0.8] text-[var(--ink)] text-center whitespace-nowrap">
            Ayush Singh
          </div>
        </div>

        {/* Minimal Bottom Studio Stamp */}
        <div className="footer-bottom-stamp mt-8 pt-6 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] gap-3">
          <span>Ayush Singh • Portfolio Edition 2026</span>
          <button
            type="button"
            onClick={scrollToTop}
            className="hover:text-[var(--ink)] transition-colors flex items-center gap-1.5"
          >
            <span>Back to top</span>
            <span>↑</span>
          </button>
        </div>
      </Container>
    </footer>
  );
}
