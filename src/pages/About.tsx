import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Plus, Minus } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../sections/Footer";
import { personalInfo, skillGroups } from "../data/portfolio";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { playClick } from "../utils/soundEffects";

const TESTIMONIALS = [
  {
    quote:
      "Ayush bridged our product design and full-stack architecture seamlessly. Every interaction felt intentional, fast, and easy to ship.",
    author: "Product Lead · AI Creator Hub",
  },
  {
    quote:
      "His Power BI pipelines and React dashboards turned raw operational metrics into decisions our team could act on immediately.",
    author: "Analytics Partner · PulseAnalytics",
  },
  {
    quote:
      "Strong eye for typography, clean code structure, and reliable delivery from concept through production deployment.",
    author: "Design Collaborator · Brand Systems",
  },
];

const FAQS = [
  {
    q: "What kind of work do you focus on?",
    a: "I build full-stack web applications (React, Next.js, TypeScript, Node.js), interactive Power BI & Python data pipelines, and high-craft digital interfaces with thoughtful motion.",
  },
  {
    q: "Are you available for freelance or full-time roles?",
    a: "Yes — I am currently open to select freelance architecture engagements as well as full-time software engineering and data-focused roles.",
  },
  {
    q: "How do you approach a new project?",
    a: "Every engagement starts with clarity: defining the core user flow and data model first, then building a fast, accessible interface and validating performance end-to-end.",
  },
  {
    q: "Can you work with both design and engineering?",
    a: "Yes. I bridge product design, motion systems (GSAP & Framer Motion), and backend/data engineering so nothing is lost in handoff.",
  },
  {
    q: "How can we get started?",
    a: "Send a brief through the contact section or email me directly at ayushsingh7360@gmail.com — I typically reply within 12 hours.",
  },
];

function BrandMonogram({ className = "h-28 w-28" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <rect x="10" y="10" width="100" height="100" rx="4" strokeWidth="4" />
      <path
        d="M36 86L60 32L84 86"
        strokeWidth="5.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path d="M44 69H76" strokeWidth="5" strokeLinecap="square" />
    </svg>
  );
}

export default function About() {
  const reduced = usePrefersReducedMotion();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [tIdx, setTIdx] = useState(0);
  const activeTestimonial = TESTIMONIALS[tIdx];

  return (
    <div className="relative min-h-[100svh] overflow-x-clip bg-[var(--page)] text-[var(--ink)] transition-colors duration-300">
      <div aria-hidden="true" className="jeppesen-grain" />
      <Header />

      <motion.main
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* ── 1. Editorial Intro (12-col jeppesen.dev grid) ── */}
        <section className="px-[var(--site-margin)] pb-[var(--section-medium)] pt-32 sm:pt-40">
          <div className="grid grid-cols-12 gap-[var(--gutter)]">
            <div className="col-span-12 lg:col-span-10">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                About
              </p>
              <motion.h1
                initial={reduced ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-[clamp(2.25rem,5.2vw,5.25rem)] font-semibold leading-[0.96] tracking-[-0.035em]"
              >
                Engineering, data, and design — built as one system.
              </motion.h1>
              <p className="mt-6 max-w-[48ch] text-base leading-relaxed text-[var(--muted)] sm:text-lg">
                {personalInfo.bio}
              </p>
            </div>
          </div>
        </section>

        {/* ── 2. 3-Column Square Row matching jeppesen.dev Isotype/Bio Sequence ── */}
        <section className="px-[var(--site-margin)] pb-[var(--section-high)]">
          <div className="grid grid-cols-12 gap-[var(--gutter)]">
            {/* Slot 1: Geometric Brand Mark */}
            <div className="col-span-6 md:col-span-4 aspect-square rounded-[4px] border border-[var(--line)] bg-[var(--surface)] p-6 flex flex-col justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                01 / Identity
              </span>
              <div className="my-auto flex items-center justify-center text-[var(--ink)]">
                <BrandMonogram className="h-24 w-24 sm:h-36 sm:w-36 transition-transform duration-500 hover:scale-105" />
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                Ayush · 2026
              </span>
            </div>

            {/* Slot 2: Visual / Studio Frame */}
            <div className="col-span-6 md:col-span-4 aspect-square overflow-hidden rounded-[4px] border border-[var(--line)] bg-[var(--surface-strong)] relative">
              <img
                src="/images/hero-poster.webp"
                alt="Ayush creative engineering visual"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white/90">
                Creative Systems
              </span>
            </div>

            {/* Slot 3: Bio Metadata Card */}
            <article className="col-span-12 md:col-span-4 md:aspect-square rounded-[4px] border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  Ayush
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                  Full Stack Developer, Creative Technologist &amp; Data Science
                  Student.
                </p>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-[var(--line)] pt-5 text-xs sm:text-sm">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                    Based in
                  </dt>
                  <dd className="mt-1 font-medium text-[var(--ink)]">
                    New Delhi, India
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                    Focus
                  </dt>
                  <dd className="mt-1 font-medium text-[var(--ink)]">
                    Web, Data &amp; AI
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                    Stack
                  </dt>
                  <dd className="mt-1 font-medium text-[var(--ink)]">
                    React, TS, Python
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                    Status
                  </dt>
                  <dd className="mt-1 font-medium text-[var(--ink)]">
                    Open to roles
                  </dd>
                </div>
              </dl>
            </article>
          </div>
        </section>

        {/* ── 3. Dark #252525 Contrast Section (Capabilities + FAQ matching jeppesen.dev) ── */}
        <section
          style={
            {
              "--page": "#252525",
              "--surface": "#1e1e1e",
              "--surface-strong": "#2f2f2f",
              "--ink": "#f2ede4",
              "--muted": "#a3a3a3",
              "--line": "rgba(242, 237, 228, 0.18)",
            } as React.CSSProperties
          }
          className="bg-[#252525] px-[var(--site-margin)] py-[var(--section-high)] text-[#f2ede4]"
        >
          <div className="grid grid-cols-12 gap-[var(--gutter)]">
            <div className="col-span-12 lg:col-span-10 lg:col-start-2 grid grid-cols-1 gap-[var(--gutter)] lg:grid-cols-12">
              {/* Left 4 cols: Architectural Summary + 01/03 Testimonials */}
              <div className="lg:col-span-4 rounded-[4px] border border-white/15 bg-[#1e1e1e] p-6 flex flex-col justify-between gap-8">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#a3a3a3]">
                    Core Disciplines
                  </span>
                  <ul className="mt-4 space-y-3">
                    {skillGroups.map((g, i) => (
                      <li
                        key={g.title}
                        className="border-b border-white/10 pb-2.5 last:border-none"
                      >
                        <span className="font-mono text-[10px] text-[#a3a3a3]">
                          0{i + 1}
                        </span>
                        <p className="font-display text-base font-semibold text-[#f2ede4]">
                          {g.title}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* jeppesen.dev 01/03 Testimonial Switcher */}
                <div className="border-t border-white/15 pt-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          playClick();
                          setTIdx(
                            (i) =>
                              (i - 1 + TESTIMONIALS.length) %
                              TESTIMONIALS.length,
                          );
                        }}
                        aria-label="Previous testimonial"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-[2.5px] border border-white/20 text-[#f2ede4] transition-colors hover:border-white"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          playClick();
                          setTIdx((i) => (i + 1) % TESTIMONIALS.length);
                        }}
                        aria-label="Next testimonial"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-[2.5px] border border-white/20 text-[#f2ede4] transition-colors hover:border-white"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="font-mono text-xs tabular-nums text-[#a3a3a3]">
                      0{tIdx + 1}/0{TESTIMONIALS.length}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-[#f2ede4]/90 sm:text-sm">
                    &ldquo;{activeTestimonial.quote}&rdquo;
                  </p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#a3a3a3]">
                    {activeTestimonial.author}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <Link
                    to="/projects"
                    onClick={() => playClick()}
                    className="inline-flex h-[35px] items-center gap-1.5 rounded-[2.5px] bg-[#f2ede4] px-3.5 text-xs font-semibold text-[#252525] transition-opacity hover:opacity-85"
                  >
                    <span>View Projects</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    to="/resume"
                    onClick={() => playClick()}
                    className="inline-flex h-[35px] items-center gap-1.5 rounded-[2.5px] border border-white/20 px-3.5 text-xs font-semibold text-[#f2ede4] transition-colors hover:border-white"
                  >
                    <span>Résumé</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right 8 cols: FAQ Accordion */}
              <div className="lg:col-span-8">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-[#f2ede4] sm:text-3xl mb-6">
                  Frequently asked questions
                </h2>
                <div className="space-y-2">
                  {FAQS.map((item, idx) => {
                    const isOpen = openFaq === idx;
                    return (
                      <div
                        key={item.q}
                        className="rounded-[4px] border border-white/20 bg-[#1e1e1e]/60 transition-colors hover:border-white/35"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            playClick();
                            setOpenFaq(isOpen ? null : idx);
                          }}
                          aria-expanded={isOpen}
                          className="flex w-full items-center justify-between gap-4 px-5 py-3.5 text-left text-sm font-medium text-[#f2ede4] sm:text-base"
                        >
                          <span>{item.q}</span>
                          {isOpen ? (
                            <Minus className="h-4 w-4 shrink-0 text-[#a3a3a3]" />
                          ) : (
                            <Plus className="h-4 w-4 shrink-0 text-[#a3a3a3]" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-4 text-sm leading-relaxed text-[#a3a3a3]">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. Centered CTA matching jeppesen.dev "Book a call" ── */}
        <section className="flex min-h-[55svh] flex-col items-center justify-center px-[var(--site-margin)] py-[var(--section-high)] text-center">
          <h2 className="max-w-[22ch] font-display text-[clamp(2rem,4.5vw,4.5rem)] font-semibold leading-[1.0] tracking-[-0.03em]">
            Let&rsquo;s build something clear, fast, and memorable.
          </h2>
          <Link
            to="/#contact"
            onClick={() => playClick()}
            className="mt-8 inline-flex h-[46px] items-center gap-2.5 rounded-[4px] bg-[var(--ink)] px-6 text-sm font-semibold text-[var(--page)] transition-opacity hover:opacity-85"
          >
            <span>Talk to me</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </section>
      </motion.main>

      <Footer />
    </div>
  );
}
