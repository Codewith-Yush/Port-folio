import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "../components/Container";
import { navItems } from "../data/portfolio";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/codewith-Yush",
    icon: "M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/ayush-singh-643a4b25a",
    icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z",
  },
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: "M22.162 5.656a8.384 8.384 0 01-2.402.658A4.196 4.196 0 0021.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 00-7.126 3.814 11.874 11.874 0 01-8.62-4.37 4.168 4.168 0 00-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 01-1.894-.523v.052a4.185 4.185 0 003.355 4.101 4.21 4.21 0 01-1.89.072A4.185 4.185 0 007.97 16.65a8.394 8.394 0 01-6.191 1.732 11.83 11.83 0 006.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 002.087-2.165z",
  },
  {
    label: "Email",
    href: "mailto:ayushsingh7360@gmail.com",
    icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  },
];

/* Marquee strip */
function MarqueeStrip() {
  const items = [
    "AVAILABLE FOR WORK",
    "OPEN TO COLLABORATIONS",
    "FULL STACK ARCHITECTURES",
    "AI SYSTEMS",
    "UI/UX ENGINEERING",
  ];
  const track = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-black/10 dark:border-white/10 py-2.5 my-5 md:my-8">
      <div
        className="flex gap-8 whitespace-nowrap"
        style={{ animation: "footer-marquee 24s linear infinite" }}
      >
        {track.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-6 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[var(--ink)] opacity-60"
          >
            {t}
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--flame)]" />
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-[var(--page)] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-[var(--page)] to-transparent z-10" />
    </div>
  );
}

export function Footer() {
  const reducedMotion = usePrefersReducedMotion();
  const footerRef = useRef<HTMLElement>(null);
  const parallaxWrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const accentLineRef = useRef<HTMLDivElement>(null);

  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion) return;

      const mm = gsap.matchMedia();

      gsap.set(textRef.current, { y: 60, opacity: 0 });
      gsap.set([topBarRef.current, linksRef.current, bottomBarRef.current], {
        opacity: 0,
        y: 30,
      });
      gsap.set(accentLineRef.current, { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      tl.to(accentLineRef.current, { scaleX: 1, duration: 0.6, ease: "power3.out" })
        .to(topBarRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
        .to(textRef.current, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.4")
        .to(linksRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.3")
        .to(bottomBarRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4");

      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          parallaxWrapperRef.current,
          { y: -25 },
          {
            y: 25,
            ease: "none",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      });
    }, footerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <>
      <style>{`
        @keyframes footer-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes footer-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <footer
        ref={footerRef}
        className="relative bg-[var(--page)] text-[var(--ink)] pt-10 md:pt-16 pb-8 md:pb-10 overflow-hidden transition-colors duration-500"
      >
        {/* Glow orbs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 md:h-96 md:w-96 rounded-full bg-[var(--flame)]/10 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-0 right-10 h-64 w-64 md:h-96 md:w-96 rounded-full bg-[var(--blush)]/10 blur-[130px]" />

        {/* Accent top border line */}
        <div
          ref={accentLineRef}
          className="absolute top-0 left-0 h-[2px] w-full"
          style={{ background: "linear-gradient(to right, var(--flame), var(--blush), transparent 80%)" }}
        />

        <Container>
          {/* Top Nav Bar */}
          <div
            ref={topBarRef}
            className="flex flex-col sm:flex-row justify-between sm:items-center pb-5 border-b border-black/10 dark:border-white/10 mb-6 md:mb-8 gap-4"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--ink)] opacity-50 shrink-0">
              Quick Navigation
            </span>
            <nav className="flex flex-wrap gap-x-5 gap-y-2 md:gap-x-7">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink)]/60 hover:text-[var(--flame)] dark:hover:text-[var(--blush)] transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Big Parallax Hero Text */}
          <div
            ref={parallaxWrapperRef}
            className="flex justify-center items-center overflow-hidden py-2 cursor-default"
          >
            <h2
              ref={textRef}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="select-none text-[clamp(2.75rem,11vw,9.5rem)] font-black leading-none tracking-tight uppercase inline-block whitespace-nowrap text-transparent bg-clip-text transition-all duration-500"
              style={{
                WebkitTextStroke: "1.5px var(--ink)",
                backgroundImage: hovered
                  ? "linear-gradient(135deg, var(--flame) 0%, var(--blush) 60%, var(--ink) 100%)"
                  : "linear-gradient(to right, var(--ink) 50%, transparent 50%)",
                backgroundSize: "200% 100%",
                backgroundPosition: hovered ? "0 0" : "100% 0",
              }}
            >
              LET'S TALK
            </h2>
          </div>

          {/* Marquee strip */}
          <MarqueeStrip />

          {/* Bottom Bar: CTA + Socials + Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-6 mt-6">
            {/* Left: copyright & direct email */}
            <div ref={bottomBarRef} className="flex flex-col gap-3 order-2 md:order-1">
              <a
                href="mailto:ayushsingh7360@gmail.com"
                className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-black/15 dark:border-white/15 hover:border-[var(--flame)] transition-colors duration-300 w-fit text-xs font-semibold text-[var(--ink)]/80 hover:text-[var(--ink)]"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--flame)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--flame)]" />
                </span>
                <span>ayushsingh7360@gmail.com</span>
              </a>

              <p className="text-xs text-[var(--ink)]/50 mt-1">
                © {new Date().getFullYear()} Ayush Singh. All rights reserved.
              </p>
            </div>

            {/* Right: Social icons */}
            <div ref={linksRef} className="flex flex-wrap gap-2.5 sm:gap-3 order-1 md:order-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden flex h-11 w-11 items-center justify-center rounded-full border border-black/10 dark:border-white/10 text-[var(--ink)]/70 hover:text-white transition-all duration-300 hover:scale-105 hover:border-[var(--flame)] shadow-sm"
                >
                  <span className="absolute inset-0 bg-[var(--flame)] rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" />
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="relative z-10 h-4 w-4 pointer-events-none transition-colors"
                  >
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Decorative bottom line */}
          <div className="mt-8 md:mt-12 pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[9px] uppercase tracking-[0.2em] font-semibold text-[var(--ink)]/40">
            <span>Engineering & Design</span>
            <span>Made with precision</span>
          </div>
        </Container>
      </footer>
    </>
  );
}