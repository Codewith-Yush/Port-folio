import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "../components/Container";
import { navItems, projects } from "../data/portfolio";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { ChromaticImage } from "@/components/ui/chromatic-image";
import { playClick, playSuccess } from "../utils/soundEffects";
import { scrollToSection } from "../utils/scrollToSection";

gsap.registerPlugin(ScrollTrigger);

const EMAIL = "ayushsingh7360@gmail.com";

const SOCIALS = [
  { name: "GitHub", url: "https://github.com/codewith-Yush", handle: "@codewith-Yush" },
  { name: "LinkedIn", url: "https://linkedin.com/in/ayush-singh-643a4b25a", handle: "in/ayush-singh" },
  { name: "Twitter", url: "https://twitter.com/ayushsingh", handle: "@ayushsingh" },
];

const MARQUEE_ITEMS = [
  "Full stack architecture",
  "System craft & resilience",
  "Creative direction",
  "Generative AI integrations",
  "High performance web",
  "Available for select engagements",
];

const CSS = `
@keyframes ft-marquee { from { transform: translate3d(0,0,0); } to { transform: translate3d(-50%,0,0); } }
.ft-marquee-track { display: flex; width: max-content; animation: ft-marquee 60s linear infinite; }
.ft-marquee:hover .ft-marquee-track { animation-play-state: paused; }
.ft-link { position: relative; display: inline-block; }
.ft-link::after {
  content: ""; position: absolute; left: 0; bottom: -2px; height: 1px; width: 100%;
  background: currentColor; transform: scaleX(0); transform-origin: right;
  transition: transform .45s cubic-bezier(.65,0,.35,1);
}
.ft-link:hover::after, .ft-link:focus-visible::after { transform: scaleX(1); transform-origin: left; }
@media (prefers-reduced-motion: reduce) { .ft-marquee-track { animation: none; } }
`;

function FooterClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    let timer = 0;
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    const start = () => {
      window.clearInterval(timer);
      tick();
      timer = window.setInterval(tick, 1000);
    };
    const onVis = () => (document.hidden ? window.clearInterval(timer) : start());

    start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <p className="font-mono text-sm tabular-nums text-[var(--ink)]">
      {time || "00:00:00 AM"}
      <span className="ml-2 text-[var(--muted)]">IST</span>
    </p>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
      {children}
    </span>
  );
}

export function Footer() {
  const reducedMotion = usePrefersReducedMotion();
  const footerRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".ft-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          },
        );
      });
    }, footerRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  const scrollToTop = () => {
    playClick();
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  };

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

  const year = new Date().getFullYear();

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--page)] pb-8 text-[var(--ink)]"
    >
      <style>{CSS}</style>

      {/* Marquee — single quiet ticker */}
      <div className="ft-marquee relative overflow-hidden border-b border-[var(--line)] py-3">
        <div className="ft-marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={copy === 1}>
              {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                <span
                  key={i}
                  className="flex items-center gap-10 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]"
                >
                  {item}
                  <span className="h-px w-6 bg-[var(--line)]" />
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[var(--page)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[var(--page)] to-transparent" />
      </div>

      <Container>
        {/* Selected work */}
        <section className="ft-reveal pt-16 sm:pt-24">
          <div className="mb-8 flex items-end justify-between border-b border-[var(--line)] pb-4">
            <div className="flex items-baseline gap-4">
              <Label>01</Label>
              <h3 className="font-sans text-xl font-bold uppercase tracking-[-0.04em] sm:text-2xl">
                Selected work
              </h3>
            </div>
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                playClick();
                scrollToSection("#work");
              }}
              className="ft-link text-[13px] text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
            >
              View all →
            </a>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {projects.slice(0, 3).map((project, idx) => {
              const inner = (
                <>
                  <div className="relative aspect-[16/10] w-full overflow-hidden border border-[var(--line)] bg-[var(--surface)]">
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
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-mono text-[11px] text-[var(--muted)]">
                        0{idx + 1} — {project.year}
                      </p>
                      <p className="mt-1 truncate font-sans text-base font-bold uppercase tracking-tight">
                        <span className="ft-link">{project.title}</span>
                      </p>
                    </div>
                    <span className="text-lg text-[var(--muted)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--ink)]">
                      ↗
                    </span>
                  </div>
                  <p className="mt-2 text-[13px] text-[var(--muted)]">
                    {project.stack.slice(0, 3).join(" · ")}
                  </p>
                </>
              );

              return project.galleryLink ? (
                <Link key={project.title} to={project.galleryLink} className="group block">
                  {inner}
                </Link>
              ) : (
                <a
                  key={project.title}
                  href={project.link || "#work"}
                  target={project.link?.startsWith("http") ? "_blank" : undefined}
                  rel={project.link?.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group block"
                >
                  {inner}
                </a>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="ft-reveal py-20 sm:py-32">
          <Label>02 — Contact</Label>
          <h2 className="mt-6 max-w-4xl font-sans text-[clamp(2.5rem,7vw,6rem)] font-bold uppercase leading-[0.92] tracking-[-0.04em]">
            Have a project
            <br />
            in mind?
          </h2>

          <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                playClick();
                scrollToSection("#contact");
              }}
              className="btn-neo-base btn-neo-primary group inline-flex h-12 items-center justify-between gap-6 pl-6 pr-2.5"
            >
              <span>Start a project</span>
              <span className="btn-icon-pod h-8 w-8 bg-[var(--page)] text-[var(--ink)] dark:bg-black dark:text-[#C7ED70]">
                <span className="text-sm font-bold transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="group inline-flex items-center gap-3 text-left"
              aria-live="polite"
            >
              <span className="ft-link font-mono text-sm">{copied ? "Copied ✓" : EMAIL}</span>
              {!copied && (
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
                  Click to copy
                </span>
              )}
            </button>
          </div>
        </section>

        {/* Info columns — hairline dividers, no cards */}
        <section className="ft-reveal grid grid-cols-1 border-t border-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4 border-b border-[var(--line)] py-8 sm:pr-8 lg:border-b-0 lg:border-r">
            <Label>Location</Label>
            <div>
              <p className="font-sans text-base font-bold uppercase tracking-tight">New Delhi, India</p>
              <div className="mt-1">
                <FooterClock />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-b border-[var(--line)] py-8 sm:pl-8 lg:border-b-0 lg:border-r lg:px-8">
            <Label>Status</Label>
            <p className="flex items-center gap-2.5 text-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Open to freelance &amp; full-time
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-4 border-b border-[var(--line)] py-8 sm:pr-8 lg:border-b-0 lg:border-r lg:px-8">
            <Label>Index</Label>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  {item.href.startsWith("/") ? (
                    <Link
                      to={item.href}
                      onClick={() => playClick()}
                      className="ft-link text-sm text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        playClick();
                        scrollToSection(item.href);
                      }}
                      className="ft-link text-sm text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-4 py-8 sm:pl-8 lg:pl-8">
            <Label>Elsewhere</Label>
            <ul className="flex flex-col gap-1.5">
              {SOCIALS.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.name} — ${s.handle}`}
                    className="group flex items-center justify-between text-sm text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                  >
                    <span className="ft-link">{s.name}</span>
                    <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Name */}
        <div
          aria-hidden
          className="ft-reveal select-none overflow-hidden border-t border-[var(--line)] pt-10 text-center sm:pt-14"
        >
          <div
            className="whitespace-nowrap font-sans font-black uppercase leading-[0.8] tracking-[-0.07em] text-[var(--ink)]"
            style={{ fontSize: "clamp(3.5rem, 14vw, 11.5rem)" }}
          >
            Ayush Singh
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[var(--line)] pt-6 text-[13px] text-[var(--muted)] sm:flex-row">
          <span>© {year} Ayush Singh. All rights reserved.</span>
          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex items-center gap-1.5 transition-colors hover:text-[var(--ink)]"
          >
            <span className="ft-link">Back to top</span>
            <span className="transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
          </button>
        </div>
      </Container>
    </footer>
  );
}