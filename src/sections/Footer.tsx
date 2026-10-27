import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ArrowUpRight,
  ArrowUp,
  Copy,
  Check,
  Terminal,
  Clock,
  Sparkles,
  Command,
} from "lucide-react";
import { Container } from "../components/Container";
import { navItems, personalInfo } from "../data/portfolio";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { playClick, playSuccess } from "../utils/soundEffects";
import { scrollToSection } from "../utils/scrollToSection";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EMAIL = personalInfo.email || "ayushsingh7360@gmail.com";
const FIRST_NAME = "AYUSH";
const LAST_NAME = "SINGH";
const FULL_NAME = `${FIRST_NAME} ${LAST_NAME}`;
const ASCII_CHARS = "01<>/\\[]{}#$%@!?*+=~";

const SOCIALS = [
  {
    name: "GitHub",
    url: personalInfo.github || "https://github.com/codewith-Yush",
    handle: "@codewith-Yush",
    role: "Open Source Repos",
  },
  {
    name: "LinkedIn",
    url: personalInfo.linkedin || "https://linkedin.com/in/ayush-singh-643a4b25a",
    handle: "in/ayush-singh",
    role: "Professional Network",
  },
  {
    name: "Twitter / X",
    url: personalInfo.twitter || "https://twitter.com/ayushsingh",
    handle: "@ayushsingh",
    role: "Engineering Notes",
  },
];

const MARQUEE_ITEMS = [
  "FULL-STACK ARCHITECTURE",
  "CREATIVE TECHNOLOGY",
  "PREDICTIVE DATA INTELLIGENCE",
  "INTERACTIVE 3D & SHADERS",
  "HIGH-PERFORMANCE WEB",
  "POWER BI ANALYTICS",
  "SYSTEM RESILIENCE & CRAFT",
  "NEW DELHI, INDIA [IST]",
];

const TECH_SPEC = [
  { label: "Core Engine", value: "React 19 · Vite · TypeScript" },
  { label: "Motion Layer", value: "GSAP 3 · Framer Motion 14" },
  { label: "Design System", value: "Architectural Obsidian · #C7ED70" },
  { label: "Audio Engine", value: "Synthesized Web Audio API" },
];

const CSS = `
@keyframes ft-marquee {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
}
.ft-marquee-track {
  display: flex;
  width: max-content;
  animation: ft-marquee 38s linear infinite;
  will-change: transform;
}
.ft-marquee-container:hover .ft-marquee-track {
  animation-play-state: paused;
}
.ft-link {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.ft-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -2px;
  height: 1px;
  width: 100%;
  background: var(--flame, #C7ED70);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.ft-link:hover::after,
.ft-link:focus-visible::after {
  transform: scaleX(1);
  transform-origin: left;
}
.ft-signature-first {
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s ease;
}
.ft-signature-last {
  -webkit-text-stroke: 1.5px currentColor;
  color: transparent;
  transition: color 0.35s cubic-bezier(0.16, 1, 0.3, 1), -webkit-text-stroke-color 0.35s ease;
}
.group:hover .ft-signature-first {
  color: var(--flame, #C7ED70);
}
.group:hover .ft-signature-last {
  color: var(--flame, #C7ED70);
  -webkit-text-stroke-color: var(--flame, #C7ED70);
}
@media (prefers-reduced-motion: reduce) {
  .ft-marquee-track {
    animation: none;
  }
}
`;

/**
 * Real-time architectural clock for New Delhi (IST, UTC+5:30)
 */
function FooterClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    let timer = 0;
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    const start = () => {
      window.clearInterval(timer);
      tick();
      timer = window.setInterval(tick, 1000);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        window.clearInterval(timer);
      } else {
        start();
      }
    };

    start();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <div className="flex items-center gap-2.5 font-mono text-xs tabular-nums text-[var(--ink)]">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="font-semibold">{time || "12:00:00 PM"}</span>
      <span className="rounded bg-[var(--surface-strong)] px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
        IST · UTC+5:30
      </span>
    </div>
  );
}

function SectionTag({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
      <span className="text-[var(--flame, #C7ED70)] font-bold">[{index}]</span>
      <span>{label}</span>
    </div>
  );
}

export function Footer() {
  const reducedMotion = usePrefersReducedMotion();
  const footerRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [scrambledFirst, setScrambledFirst] = useState(FIRST_NAME);
  const [scrambledLast, setScrambledLast] = useState(LAST_NAME);

  // Scroll entrance animation
  useGSAP(
    () => {
      if (reducedMotion) return;
      gsap.utils.toArray<HTMLElement>(".ft-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          }
        );
      });
    },
    { scope: footerRef, dependencies: [reducedMotion] }
  );

  // Tactile ASCII Decryption Effect on Hover
  const handleScrambleStart = useCallback(() => {
    if (reducedMotion || isDecoding) return;
    setIsDecoding(true);
    playClick("interactive");

    let iteration = 0;
    const maxIterations = 18;

    const interval = window.setInterval(() => {
      iteration += 1;

      // Scramble First Name
      setScrambledFirst(
        FIRST_NAME.split("")
          .map((_, index) => {
            if (index < Math.floor((iteration / maxIterations) * FIRST_NAME.length)) {
              return FIRST_NAME[index];
            }
            return ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
          })
          .join("")
      );

      // Scramble Last Name
      setScrambledLast(
        LAST_NAME.split("")
          .map((_, index) => {
            if (index < Math.floor((iteration / maxIterations) * LAST_NAME.length)) {
              return LAST_NAME[index];
            }
            return ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
          })
          .join("")
      );

      if (iteration >= maxIterations) {
        window.clearInterval(interval);
        setScrambledFirst(FIRST_NAME);
        setScrambledLast(LAST_NAME);
        setIsDecoding(false);
      }
    }, 38);
  }, [reducedMotion, isDecoding]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = EMAIL;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    playSuccess();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2400);
  };

  const scrollToTop = () => {
    playClick("interactive");
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--page)] text-[var(--ink)]"
      aria-label="Site Footer and Architectural Colophon"
    >
      <style>{CSS}</style>

      {/* ── 0. KINETIC ARCHITECTURAL MARQUEE RIBBON ── */}
      <div className="ft-marquee-container relative overflow-hidden border-b border-[var(--line)] bg-[var(--surface)] py-3 select-none">
        <div className="ft-marquee-track">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex shrink-0 items-center gap-12 pr-12"
              aria-hidden={copy === 1}
            >
              {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-12 whitespace-nowrap font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--flame, #C7ED70)] opacity-75" />
                    {item}
                  </span>
                  <span className="h-px w-6 bg-[var(--line)]" />
                </span>
              ))}
            </div>
          ))}
        </div>
        {/* Soft edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--surface)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--surface)] to-transparent" />
      </div>

      <Container className="relative z-10 pt-16 pb-12 sm:pt-20 sm:pb-16">
        {/* ── 1. ARCHITECTURAL 4-COLUMN BENTO / COLOPHON ── */}
        <div className="ft-reveal grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8 pb-16 sm:pb-20 border-b border-[var(--line)]">
          {/* Column 1: Identity & Transmission Protocol (4 cols) */}
          <div className="flex flex-col justify-between gap-6 lg:col-span-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface)] font-mono text-xs font-black tracking-tighter text-[var(--ink)] shadow-sm">
                  AS
                </span>
                <div>
                  <h3 className="font-sans text-lg font-bold tracking-tight text-[var(--ink)]">
                    {personalInfo.name}
                  </h3>
                  <p className="font-mono text-xs text-[var(--muted)]">
                    Creative Technologist & Full Stack
                  </p>
                </div>
              </div>

              <p className="max-w-sm text-sm leading-relaxed text-[var(--muted)]">
                Engineering high-performance web systems, creative shaders, and resilient data
                architectures. Committed to clarity, accessibility, and out-of-distribution craft.
              </p>
            </div>

            {/* Direct Email 1-Click Action */}
            <div className="flex flex-col gap-2 pt-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                Direct Inquiries
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${EMAIL}`}
                  onClick={() => playClick("interactive")}
                  className="ft-link font-mono text-xs sm:text-sm font-semibold text-[var(--ink)] hover:text-[var(--flame, #C7ED70)] transition-colors"
                >
                  {EMAIL}
                </a>
                <motion.button
                  type="button"
                  onClick={handleCopyEmail}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative inline-flex items-center gap-1 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1 text-[11px] font-mono text-[var(--muted)] transition-colors hover:border-[var(--flame, #C7ED70)] hover:text-[var(--ink)]"
                  title="Copy email to clipboard"
                  aria-label="Copy email address"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 transition-transform group-hover:scale-110" />
                      <span>Copy</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Column 2: Fast Navigation & Directory (3 cols) */}
          <div className="flex flex-col gap-5 lg:col-span-3 lg:border-l lg:border-[var(--line)] lg:pl-8">
            <SectionTag index="01" label="DIRECTORY" />
            <nav aria-label="Footer quick navigation">
              <ul className="flex flex-col gap-2.5 font-sans text-sm">
                {navItems.map((item, idx) => {
                  const isRoute = item.href.startsWith("/");
                  const labelIndex = `0${idx + 1}`;

                  return (
                    <li key={item.label}>
                      {isRoute ? (
                        <Link
                          to={item.href}
                          onClick={() => playClick("interactive")}
                          className="group flex items-center justify-between text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="font-mono text-[10px] text-[var(--line)] group-hover:text-[var(--flame, #C7ED70)] transition-colors">
                              {labelIndex}
                            </span>
                            <span className="ft-link font-medium">{item.label}</span>
                          </span>
                          <span className="font-mono text-xs opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100 text-[var(--flame, #C7ED70)]">
                            →
                          </span>
                        </Link>
                      ) : (
                        <a
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault();
                            playClick("interactive");
                            scrollToSection(item.href);
                          }}
                          className="group flex items-center justify-between text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="font-mono text-[10px] text-[var(--line)] group-hover:text-[var(--flame, #C7ED70)] transition-colors">
                              {labelIndex}
                            </span>
                            <span className="ft-link font-medium">{item.label}</span>
                          </span>
                          <span className="font-mono text-xs opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100 text-[var(--flame, #C7ED70)]">
                            →
                          </span>
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Column 3: Network & External Nodes (3 cols) */}
          <div className="flex flex-col gap-5 lg:col-span-3 lg:border-l lg:border-[var(--line)] lg:pl-8">
            <SectionTag index="02" label="NETWORK" />
            <ul className="flex flex-col gap-3 font-sans text-sm">
              {SOCIALS.map((soc) => (
                <li key={soc.name}>
                  <a
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playClick("interactive")}
                    className="group flex flex-col gap-0.5 rounded-lg border border-transparent p-1 -m-1 transition-colors hover:border-[var(--line)] hover:bg-[var(--surface)]"
                    aria-label={`${soc.name}: ${soc.handle}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="ft-link font-semibold text-[var(--ink)] group-hover:text-[var(--flame, #C7ED70)] transition-colors">
                        {soc.name}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-[var(--muted)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--ink)]" />
                    </div>
                    <div className="flex items-center justify-between font-mono text-[11px] text-[var(--muted)]">
                      <span>{soc.handle}</span>
                      <span className="text-[10px] uppercase tracking-wider text-[var(--muted)]/70">
                        {soc.role}
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: System Telemetry & Clock (2 cols) */}
          <div className="flex flex-col justify-between gap-6 lg:col-span-2 lg:border-l lg:border-[var(--line)] lg:pl-8">
            <div className="flex flex-col gap-4">
              <SectionTag index="03" label="STATUS" />

              {/* Live Engagement Badge */}
              <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3.5 shadow-sm">
                <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  AVAILABLE
                </div>
                <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed">
                  Open for contract architecture, high-impact roles, and creative engineering.
                </p>
              </div>

              {/* Local Clock */}
              <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3.5 shadow-sm">
                <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1.5">
                  <Clock className="h-3 w-3" />
                  <span>LOCAL TIME</span>
                </div>
                <FooterClock />
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. THE MONUMENTAL SIGNATURE EXPERIENCE ── */}
        <section
          className="ft-reveal group relative isolate mt-12 overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:mt-16 sm:p-12 md:p-16 transition-all duration-500 hover:border-[var(--flame, #C7ED70)]/40 shadow-sm"
          onMouseEnter={handleScrambleStart}
          onTouchStart={handleScrambleStart}
          aria-label="Ayush Singh Monumental Signature"
        >
          {/* Ambient luminous glow behind the signature */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full bg-[var(--flame, #C7ED70)]/10 blur-[100px] transition-opacity duration-700 group-hover:opacity-100 opacity-40"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -bottom-20 -z-10 h-72 w-72 rounded-full bg-[#818CF8]/10 blur-[100px] transition-opacity duration-700 group-hover:opacity-100 opacity-40"
          />

          {/* Top header bar within card */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-6 font-mono text-[11px] text-[var(--muted)]">
            <div className="flex items-center gap-2 uppercase tracking-[0.2em]">
              <Terminal className="h-3.5 w-3.5 text-[var(--flame, #C7ED70)]" />
              <span>COLOPHON SPECIFICATION // REPO ID: AYUSH-SINGH</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block uppercase tracking-[0.18em]">
                {isDecoding ? "DECODING TRANSMISSION..." : "HOVER TO DECRYPT SIGNATURE"}
              </span>
              <Sparkles className="h-3.5 w-3.5 text-[var(--flame, #C7ED70)] transition-transform duration-500 group-hover:rotate-45" />
            </div>
          </div>

          {/* Monumental Headline Name */}
          <div className="py-8 sm:py-12 select-none">
            <h2
              className="m-0 flex flex-wrap items-baseline gap-x-[0.25em] font-sans font-black uppercase leading-[0.85] tracking-[-0.05em] sm:tracking-[-0.075em] text-[clamp(2.8rem,11.5vw,9.5rem)]"
              aria-label={FULL_NAME}
            >
              <span className="ft-signature-first whitespace-nowrap text-[var(--ink)]">
                {scrambledFirst}
              </span>
              <span className="ft-signature-last whitespace-nowrap">
                {scrambledLast}
              </span>
            </h2>
          </div>

          {/* Technical Colophon Specifications Grid */}
          <div className="grid grid-cols-2 gap-4 border-t border-[var(--line)] pt-6 sm:grid-cols-4 font-mono text-xs text-[var(--muted)]">
            {TECH_SPEC.map((spec) => (
              <div key={spec.label} className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]/80">
                  {spec.label}
                </span>
                <span className="font-sans text-xs font-semibold text-[var(--ink)]">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. BOTTOM UTILITY & BACK-TO-TOP BAR ── */}
        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-[var(--line)] pt-8 text-xs text-[var(--muted)] sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-sans font-medium">
              © {currentYear} Ayush Singh. All rights reserved.
            </span>
            <span className="hidden sm:inline text-[var(--line)]">/</span>
            <span className="font-mono text-[11px] text-[var(--muted)]">
              Crafted with intention and architectural discipline.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 font-mono text-[10px] text-[var(--muted)]">
              <Command className="h-2.5 w-2.5" />
              <span>Press ⌘K or Ctrl+K for quick menu</span>
            </div>

            {/* Back to top magnetic button */}
            <motion.button
              type="button"
              onClick={scrollToTop}
              whileHover={reducedMotion ? {} : { y: -2, scale: 1.02 }}
              whileTap={reducedMotion ? {} : { scale: 0.96 }}
              className="group inline-flex items-center gap-2.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink)] shadow-sm transition-all duration-300 hover:border-[var(--flame, #C7ED70)] hover:bg-[var(--surface-strong)]"
              aria-label="Scroll back to top of page"
            >
              <span>TOP</span>
              <ArrowUp className="h-3.5 w-3.5 text-[var(--flame, #C7ED70)] transition-transform duration-300 group-hover:-translate-y-0.5" />
            </motion.button>
          </div>
        </div>
      </Container>
    </footer>
  );
}
