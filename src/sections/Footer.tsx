import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Container } from "../components/Container";
import { navItems } from "../data/portfolio";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, SplitText);

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

/* ─── Noise SVG overlay (data-URI, no external dep) ─── */
const NOISE_URI =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")";

/* ─── Animated glowing orb ─── */
function GlowOrb({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-[120px] opacity-20 dark:opacity-30 ${className}`}
    />
  );
}

/* ─── Marquee strip ─── */
function MarqueeStrip() {
  const items = ["AVAILABLE FOR WORK", "OPEN TO COLLABS", "LET'S BUILD TOGETHER", "CREATIVE DEV", "UI/UX ENGINEER"];
  const track = [...items, ...items]; // duplicate for seamless loop
  return (
    <div className="relative overflow-hidden border-y border-black/10 dark:border-white/10 py-3 my-10 md:my-14">
      <div
        className="flex gap-8 whitespace-nowrap"
        style={{ animation: "marquee 22s linear infinite" }}
      >
        {track.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-6 text-xs font-black uppercase tracking-[0.25em] text-[var(--ink)] opacity-50"
          >
            {t}
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#DF6C4F]" />
          </span>
        ))}
      </div>
      {/* fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[var(--page)] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[var(--page)] to-transparent z-10" />
    </div>
  );
}

/* ─── Cursor dot (desktop only) ─── */
function CursorDot({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }) {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    const dot = dotRef.current;
    if (!el || !dot) return;

    const move = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      gsap.to(dot, {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });
    };

    const enter = () => gsap.to(dot, { scale: 1, opacity: 1, duration: 0.3 });
    const leave = () => gsap.to(dot, { scale: 0, opacity: 0, duration: 0.3 });

    el.addEventListener("mousemove", move);
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, [containerRef]);

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full border border-[#DF6C4F] opacity-0 scale-0 hidden md:block mix-blend-difference"
      style={{ top: 0, left: 0 }}
    />
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
  const marqueeRef = useRef<HTMLDivElement>(null);

  /* ── Hover state for big text shine ── */
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let ctx = gsap.context(() => {
      if (reducedMotion) return;

      const mm = gsap.matchMedia();

      /* ── Initial hidden states ── */
      gsap.set(textRef.current, { y: 80, opacity: 0, skewX: -3 });
      gsap.set([topBarRef.current, linksRef.current, bottomBarRef.current, marqueeRef.current], {
        opacity: 0,
        y: 40,
      });
      gsap.set(accentLineRef.current, { scaleX: 0, transformOrigin: "left center" });

      /* ── Entrance timeline ── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 88%",
          end: "bottom bottom",
          toggleActions: "play none none none",
        },
      });

      tl.to(accentLineRef.current, { scaleX: 1, duration: 0.7, ease: "expo.out" })
        .to(topBarRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
        .to(textRef.current, { y: 0, opacity: 1, skewX: 0, duration: 1.1, ease: "expo.out" }, "-=0.6")
        .to(marqueeRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.5")
        .to(linksRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.4")
        .to(bottomBarRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.5");

      /* ── Desktop parallax ── */
      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          parallaxWrapperRef.current,
          { y: -40 },
          {
            y: 40,
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

      /* ── Magnetic interactions (hover-capable devices) ── */
      mm.add("(hover: hover) and (pointer: fine)", () => {
        const socials = linksRef.current?.querySelectorAll(".magnetic-item");
        const navLinks = topBarRef.current?.querySelectorAll("a");
        const cleanupFns: (() => void)[] = [];

        const addMagnetic = (
          el: Element,
          strength: number = 0.25,
          iconEl?: Element | null
        ) => {
          const onMove = (e: Event) => {
            const me = e as MouseEvent;
            const rect = el.getBoundingClientRect();
            const x = me.clientX - rect.left - rect.width / 2;
            const y = me.clientY - rect.top - rect.height / 2;
            gsap.to(el, { x: x * strength, y: y * strength, duration: 0.35, ease: "power2.out" });
            if (iconEl) gsap.to(iconEl, { x: x * (strength * 0.5), y: y * (strength * 0.5), duration: 0.35, ease: "power2.out" });
          };
          const onLeave = () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
            if (iconEl) gsap.to(iconEl, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
          };
          el.addEventListener("mousemove", onMove);
          el.addEventListener("mouseleave", onLeave);
          cleanupFns.push(() => {
            el.removeEventListener("mousemove", onMove);
            el.removeEventListener("mouseleave", onLeave);
          });
        };

        socials?.forEach((item) => addMagnetic(item, 0.25, item.querySelector("svg")));
        navLinks?.forEach((link) => addMagnetic(link, 0.18));

        return () => cleanupFns.forEach((fn) => fn());
      });
    }, footerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <>
      {/* Inject keyframes once */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes spin-slow {
          to { transform: rotate(360deg); }
        }
        .spin-slow { animation: spin-slow 20s linear infinite; }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        .pulse-ring::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          border: 1px solid #DF6C4F;
          animation: pulse-ring 2s ease-out infinite;
        }
      `}</style>

      <footer
        ref={footerRef}
        className="relative bg-[var(--page)] text-[var(--ink)] pt-16 md:pt-28 pb-8 md:pb-14 overflow-hidden"
      >
        {/* ── Noise texture overlay ── */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: NOISE_URI, backgroundSize: "200px 200px" }}
        />

        {/* ── Glow orbs ── */}
        <GlowOrb className="h-72 w-72 md:h-[500px] md:w-[500px] bg-[#DF6C4F] -top-20 -left-24 md:-left-40" />
        <GlowOrb className="h-60 w-60 md:h-96 md:w-96 bg-indigo-500 bottom-0 right-10 md:right-24" />

        {/* ── Accent top border line (animated) ── */}
        <div
          ref={accentLineRef}
          className="absolute top-0 left-0 h-[2px] w-full"
          style={{ background: "linear-gradient(to right, #DF6C4F, transparent 60%)" }}
        />

        {/* ── Custom cursor dot ── */}
        <CursorDot containerRef={footerRef} />

        <Container>
          {/* ── Top Nav Bar ── */}
          <div
            ref={topBarRef}
            className="flex flex-col sm:flex-row justify-between sm:items-center pb-8 border-b border-black/10 dark:border-white/10 mb-10 md:mb-14 gap-5"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-[var(--ink)] opacity-50 shrink-0">
              Explore
            </span>
            <nav className="flex flex-wrap gap-x-5 gap-y-3 md:gap-x-8">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="group relative overflow-hidden text-sm font-semibold text-[var(--ink)] opacity-60 hover:opacity-100 transition-opacity inline-block"
                >
                  <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
                    {item.label}
                  </span>
                  <span className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 text-[#DF6C4F]">
                    {item.label}
                  </span>
                </a>
              ))}
            </nav>
          </div>

          {/* ── Big Hero Text ── */}
          <div
            ref={parallaxWrapperRef}
            className="flex justify-center items-center overflow-hidden py-2 cursor-default"
          >
            <h2
              ref={textRef}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="select-none text-[clamp(3.5rem,13vw,11rem)] font-black leading-none tracking-[-0.04em] uppercase inline-block whitespace-nowrap text-transparent bg-clip-text will-change-transform"
              style={{
                WebkitTextStroke: "1.5px var(--ink)",
                backgroundImage: hovered
                  ? "linear-gradient(135deg, #DF6C4F 0%, #f5c6b3 40%, var(--ink) 60%)"
                  : "linear-gradient(to right, var(--ink) 50%, transparent 50%)",
                backgroundSize: "200% 100%",
                backgroundPosition: hovered ? "0 0" : "100% 0",
                transition: "background-position 0.65s cubic-bezier(0.16,1,0.3,1), background-image 0.3s ease",
                filter: hovered ? "drop-shadow(0 0 40px rgba(223,108,79,0.35))" : "none",
              }}
            >
              LET'S TALK
            </h2>
          </div>

          {/* ── Marquee strip ── */}
          <div ref={marqueeRef}>
            <MarqueeStrip />
          </div>

          {/* ── Bottom: CTA email + socials + copyright ── */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 md:gap-8">

            {/* Left: copyright + email pill */}
            <div ref={bottomBarRef} className="flex flex-col gap-4 order-2 md:order-1">
              {/* Email CTA pill */}
              <a
                href="mailto:ayushsingh7360@gmail.com"
                className="group inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-black/15 dark:border-white/15 hover:border-[#DF6C4F] transition-colors duration-300 w-fit"
              >
                <span className="relative flex h-2.5 w-2.5 pulse-ring shrink-0">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#DF6C4F] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#DF6C4F]" />
                </span>
                <span className="text-xs font-semibold tracking-wide text-[var(--ink)] opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                  ayushsingh7360@gmail.com
                </span>
              </a>

              <span className="text-xs font-semibold text-[var(--ink)] opacity-40 mt-1">
                © {new Date().getFullYear()} Ayush Singh — All rights reserved.
              </span>
              <span className="text-xs text-[var(--ink)] opacity-40 flex items-center gap-1.5 font-medium">
                Crafted with{" "}
                <span className="text-red-500 animate-pulse text-sm">♥</span>
              </span>
            </div>

            {/* Right: Social icons */}
            <div ref={linksRef} className="flex flex-wrap gap-3 sm:gap-4 order-1 md:order-2">
              {SOCIALS.map((s, i) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group magnetic-item relative overflow-hidden flex h-11 w-11 sm:h-13 sm:w-13 md:h-14 md:w-14 items-center justify-center rounded-full border border-black/12 dark:border-white/12 text-[var(--ink)] opacity-70 hover:opacity-100 transition-all duration-300"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* fill circle */}
                  <span className="absolute inset-0 bg-[#DF6C4F] rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="relative z-10 h-[18px] w-[18px] pointer-events-none transition-colors duration-300 group-hover:text-white group-hover:stroke-white"
                  >
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* ── Decorative bottom grid line ── */}
          <div className="mt-10 md:mt-14 pt-5 border-t border-black/8 dark:border-white/8 flex items-center justify-between gap-4">
            {/* Rotating badge */}
            <div className="relative h-12 w-12 shrink-0 hidden sm:flex items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 spin-slow opacity-30"
                aria-hidden
              >
                <defs>
                  <path id="circle-path" d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                </defs>
                <text className="fill-current text-[var(--ink)]" fontSize="13" fontWeight="700" letterSpacing="4">
                  <textPath href="#circle-path">AYUSH SINGH • PORTFOLIO •</textPath>
                </text>
              </svg>
              <span className="text-[10px] font-black text-[#DF6C4F]">AS</span>
            </div>

            <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--ink)] opacity-30 font-bold text-right">
              Designed & Built by Ayush Singh
            </span>
          </div>
        </Container>
      </footer>
    </>
  );
}