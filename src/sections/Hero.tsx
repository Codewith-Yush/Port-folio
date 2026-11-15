import { useEffect, useRef, useState } from "react";
import type { ReactNode, PointerEvent as ReactPointerEvent } from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion"; // spring = 2D magnetic pull only
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { playClick } from "../utils/soundEffects";
import { scrollToSection } from "../utils/scrollToSection";

gsap.registerPlugin(useGSAP);

/** Files live in /public → served from the site root */
const VIDEO_SRC = "/hero.mp4";
const VIDEO_WEBM_SRC: string | null = null; // e.g. "/hero.webm" if you add a WebM version
const POSTER_SRC = "/images/hero-poster.webp";

const ROLES = [
  "Full Stack & Creative Systems",
  "Freelance Developer",
  "Data Science Student",
];

/** Edit this list to match your real stack — it feeds the marquee strip at the bottom */
const TECH = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "SQL",
  "Tailwind",
  "Framer Motion",
  "GSAP",
  "Pandas",
  "scikit-learn",
];

const CAPABILITIES = [
  {
    n: "01",
    title: "Build",
    body: "Full stack applications, APIs, and reliable product foundations.",
  },
  {
    n: "02",
    title: "Understand",
    body: "Data pipelines, predictive thinking, and clear visual analytics.",
  },
  {
    n: "03",
    title: "Make it memorable",
    body: "Distinctive interfaces with thoughtful motion and detail.",
  },
];

const chipClass =
  "inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-[#F4F2F0]/80 text-neutral-800 shadow-sm hover:border-[#8C6BFF]/60 hover:bg-white hover:text-[#6941C6] dark:border-white/20 dark:bg-black/30 dark:text-white dark:shadow-none dark:hover:border-white/60 dark:hover:bg-white/15 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] backdrop-blur-md transition-all duration-200";

const GITHUB_PATH =
  "M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z";
const LINKEDIN_PATH =
  "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z";
const X_PATH =
  "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z";

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/codewith-Yush",
    path: GITHUB_PATH,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/ayush-singh-643a4b25a",
    path: LINKEDIN_PATH,
  },
  { label: "X", href: "https://twitter.com/ayushsingh", path: X_PATH },
];

/* ─────────────────────────── small building blocks ─────────────────────────── */

/** Pulls its children slightly toward the cursor (mouse only). */
function Magnetic({
  children,
  strength = 0.22,
  disabled = false,
  className,
}: {
  children: ReactNode;
  strength?: number;
  disabled?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    if (!rectRef.current) {
      rectRef.current = el.getBoundingClientRect();
    }
    const r = rectRef.current;
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };
  const onLeave = () => {
    rectRef.current = null;
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SocialLinks({
  className,
  disabled,
}: {
  className?: string;
  disabled?: boolean;
}) {
  return (
    <nav aria-label="Social links" className={className}>
      {SOCIALS.map((s) => (
        <span key={s.label} className="hero-chip inline-flex">
          <Magnetic strength={0.3} disabled={disabled} className="inline-flex">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={chipClass}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 fill-current opacity-80"
                aria-hidden="true"
              >
                <path d={s.path} />
              </svg>
              <span>{s.label}</span>
              <span className="opacity-50">↗</span>
            </motion.a>
          </Magnetic>
        </span>
      ))}
    </nav>
  );
}

/** Rotating role text. State-driven so it can never get stuck blank. */
function RoleCycler({ paused }: { paused: boolean }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(
      () => setI((v) => (v + 1) % ROLES.length),
      3200,
    );
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <span className="relative inline-flex h-[1.5em] items-center overflow-hidden align-bottom">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={i}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block whitespace-nowrap font-semibold text-neutral-900 dark:text-[var(--ink)]"
        >
          {ROLES[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Glass card with a subtle 3D tilt and a cursor-following spotlight. */
function CapabilityCard({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const onMove = (e: ReactPointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || reducedMotion) return;
    if (!rectRef.current) {
      rectRef.current = el.getBoundingClientRect();
    }
    const r = rectRef.current;
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const onLeave = () => {
    rectRef.current = null;
  };

  return (
    <div className="hero-visual-card relative ml-auto hidden w-full max-w-[400px] lg:block">
      <aside
        ref={ref}
        aria-label="What I bring"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="hero-card relative overflow-hidden rounded-2xl border border-black/[0.12] bg-[#F7F5F5]/90 p-5 text-neutral-900 shadow-xl shadow-purple-950/[0.06] backdrop-blur-xl transition-colors duration-300 dark:border-white/15 dark:bg-black/25 dark:text-white dark:shadow-none"
      >
        {/* spotlight that follows the cursor inside the card */}
        <div
          aria-hidden="true"
          className="hero-spot pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(140,107,255,.18), transparent 70%)",
          }}
        />

        <div className="relative mb-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-700 dark:text-white/65">
          <span>What I bring</span>
          <span>01 — 03</span>
        </div>
        <ul className="relative divide-y divide-black/[0.07] dark:divide-white/15">
          {CAPABILITIES.map((c) => (
            <li
              key={c.n}
              className="group -mx-2 grid grid-cols-[48px_1fr] gap-3 rounded-lg px-2 py-4 transition-colors duration-300 hover:bg-black/[0.03] dark:hover:bg-white/[0.06]"
            >
              <span className="font-serif text-3xl italic leading-none text-[#6941C6] transition-transform duration-300 group-hover:translate-x-1 dark:text-[#B39CFF]">
                {c.n}
              </span>
              <div>
                <h2 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white">
                  {c.title}
                </h2>
                <p className="mt-0.5 text-[13px] leading-relaxed text-neutral-700 dark:text-white/70">
                  {c.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

/* ─────────────────────────────────── Hero ─────────────────────────────────── */

export function Hero() {
  const reducedMotion = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  /* ---------- Video: play only while visible, pause on hidden tab / reduced motion ---------- */
  useEffect(() => {
    const video = videoRef.current;
    const section = heroRef.current;
    if (!video || !section) return;

    if (reducedMotion) {
      video.pause();
      return;
    }

    let inView = true;
    const sync = () => {
      if (inView && !document.hidden) video.play().catch(() => {});
      else video.pause();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { threshold: 0.05 },
    );
    io.observe(section);
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [reducedMotion]);

  /* ---------- Depth: lerped pointer + scroll parallax + cursor spotlight + content fade (one rAF loop) ---------- */
  useEffect(() => {
    if (reducedMotion) return;
    const media = mediaRef.current;
    const section = heroRef.current;
    const spot = spotRef.current;
    const content = contentRef.current;
    if (!media || !section) return;

    let raf = 0;
    let inView = true;
    let sectionHeight = section.offsetHeight || window.innerHeight;
    let sectionRect: DOMRect | null = null;
    const target = { x: 0, y: 0, s: 0 };
    const cur = { x: 0, y: 0, s: 0 };
    const glow = { x: 0, y: 0, tx: 0, ty: 0, o: 0, to: 0 };

    const updateSectionRect = () => {
      if (section) sectionRect = section.getBoundingClientRect();
    };
    updateSectionRect();

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) updateSectionRect();
      },
      { threshold: 0.01 },
    );
    io.observe(section);

    const onResize = () => {
      sectionHeight = section.offsetHeight || window.innerHeight;
      updateSectionRect();
    };
    window.addEventListener("resize", onResize, { passive: true });

    const loop = () => {
      raf = 0;
      cur.x += (target.x - cur.x) * 0.07;
      cur.y += (target.y - cur.y) * 0.07;
      cur.s += (target.s - cur.s) * 0.12;
      glow.x += (glow.tx - glow.x) * 0.14;
      glow.y += (glow.ty - glow.y) * 0.14;
      glow.o += (glow.to - glow.o) * 0.1;

      media.style.transform = `translate3d(${cur.x * -18}px, ${cur.y * -10 + cur.s * 70}px, 0) scale(${1.07 + cur.s * 0.05})`;

      if (spot) {
        spot.style.transform = `translate3d(${glow.x}px, ${glow.y}px, 0)`;
        spot.style.opacity = String(glow.o);
      }
      if (content) {
        content.style.opacity = String(Math.max(0, 1 - cur.s * 0.9));
        content.style.transform = `translate3d(0, ${cur.s * -36}px, 0)`;
      }

      const settled =
        Math.abs(target.x - cur.x) < 0.001 &&
        Math.abs(target.y - cur.y) < 0.001 &&
        Math.abs(target.s - cur.s) < 0.001 &&
        Math.abs(glow.tx - glow.x) < 0.3 &&
        Math.abs(glow.ty - glow.y) < 0.3 &&
        Math.abs(glow.to - glow.o) < 0.01;
      if (!settled) raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (!inView) return;
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;

      if (e.pointerType === "mouse") {
        if (!sectionRect) updateSectionRect();
        const r = sectionRect;
        if (r) {
          const inside = e.clientY >= r.top && e.clientY <= r.bottom;
          glow.tx = e.clientX - r.left;
          glow.ty = e.clientY - r.top;
          glow.to = inside ? 1 : 0;
        }
      }
      kick();
    };
    const onScroll = () => {
      if (!inView && window.scrollY > sectionHeight) return;
      target.s = Math.min(
        1,
        Math.max(0, window.scrollY / (sectionHeight || 1)),
      );
      updateSectionRect();
      kick();
    };

    onScroll();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  /* ---------- Intro timeline ---------- */
  useGSAP(
    () => {
      const root = heroRef.current;
      if (!root) return;

      if (reducedMotion) {
        gsap.set(
          ".hero-fade, .hero-name-line, .hero-chip, .hero-visual-card, .hero-status",
          {
            opacity: 1,
            y: 0,
            yPercent: 0,
            x: 0,
            scale: 1,
          },
        );
        gsap.set(".hero-line", { scaleX: 1 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".hero-status",
        { y: 8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
      )
        .fromTo(
          ".hero-name-line",
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.95,
            stagger: 0.09,
            ease: "expo.out",
          },
          "-=0.3",
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
        .fromTo(
          ".hero-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: "power3.inOut" },
          "-=0.8",
        )
        .fromTo(
          ".hero-visual-card",
          { x: 36, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.05, ease: "expo.out" },
          0.3,
        );
    },
    { scope: heroRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden bg-[var(--page)] text-[var(--ink)] transition-colors duration-500"
    >
      <style>{`
        @keyframes hero-ping { 0% { transform: scale(1); opacity: .6; } 80%,100% { transform: scale(2.6); opacity: 0; } }
        .hero-ping { animation: hero-ping 2.2s cubic-bezier(0,0,.2,1) infinite; }

        /* light mode: soft pale halo so text stays readable over the bright video */
        .hero-shadow { text-shadow: 0 1px 16px rgba(247,245,245,.9), 0 0 3px rgba(247,245,245,.7); }
        .dark .hero-shadow { text-shadow: 0 2px 28px rgba(0,0,0,.6), 0 0 2px rgba(0,0,0,.35); }

        .hero-grain {
          position: absolute; inset: 0; opacity: .04; pointer-events: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
        }

        /* slow breathing glow that echoes the storm */
        @keyframes hero-breathe { 0%,100% { opacity: .35; transform: scale(1); } 50% { opacity: .6; transform: scale(1.08); } }
        .hero-breathe { animation: hero-breathe 7s ease-in-out infinite; will-change: transform, opacity; }

        /* light sweeping through the italic surname */
        @keyframes hero-shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
        .hero-shimmer { background-size: 220% auto; animation: hero-shimmer 6s ease-in-out infinite alternate; }

        /* hand-drawn underline under the key phrase of the headline */
        @keyframes hero-underline { to { background-size: 100% 0.16em; } }
        .hero-underline {
          background-image: linear-gradient(90deg, #8C6BFF, #B39CFF);
          background-repeat: no-repeat; background-position: 0 94%; background-size: 0 0.16em;
          padding-bottom: .06em;
          -webkit-box-decoration-break: clone; box-decoration-break: clone;
          animation: hero-underline .9s cubic-bezier(.22,1,.36,1) 1.6s forwards;
        }

        /* tech ticker */
        @keyframes hero-marquee { to { transform: translateX(-50%); } }
        .hero-marquee { animation: hero-marquee 34s linear infinite; }

        .hero-card:hover .hero-spot { opacity: 1; }

        @media (prefers-reduced-motion: reduce) {
          .hero-ping, .hero-breathe, .hero-shimmer, .hero-marquee { animation: none; }
          .hero-underline { animation: none; background-size: 100% 0.16em; }
        }
      `}</style>

      {/* ── VIDEO BACKGROUND (anchored to the bottom so the scene stays in frame) ── */}
      <div
        ref={mediaRef}
        className="absolute inset-0 -z-20 will-change-transform"
        style={{ transform: "scale(1.07)", transformOrigin: "50% 100%" }}
        aria-hidden="true"
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover transition-all duration-700 dark:opacity-90 opacity-80 filter saturate-[1.1] contrast-[1.02] dark:filter-none"
          style={{ objectPosition: "50% 100%" }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={POSTER_SRC}
          disablePictureInPicture
          tabIndex={-1}
        >
          {VIDEO_WEBM_SRC ? (
            <source src={VIDEO_WEBM_SRC} type="video/webm" />
          ) : null}
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      </div>

      {/* ── READABILITY + ATMOSPHERE ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500"
      >
        <div className="absolute inset-0 bg-black/40 lg:bg-transparent dark:block hidden" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10 lg:hidden block dark:hidden" />

        {/* text side darkening (dark mode) */}
        <div
          className="absolute inset-0 hidden lg:block dark:block opacity-0 dark:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,.82) 0%, rgba(0,0,0,.55) 36%, rgba(0,0,0,.18) 62%, transparent 80%)",
          }}
        />
        {/* text side soft contrast (light mode - natural, not flat white) */}
        <div
          className="absolute inset-0 hidden lg:block dark:hidden opacity-100 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(to right, rgba(247,245,245,0.82) 0%, rgba(247,245,245,0.58) 40%, rgba(247,245,245,0.14) 66%, transparent 86%)",
          }}
        />

        {/* extra pool behind the lower-left copy */}
        <div
          className="absolute inset-0 hidden lg:block dark:block opacity-0 dark:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(60% 55% at 6% 72%, rgba(0,0,0,.55), transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 hidden lg:block dark:hidden opacity-100 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(65% 60% at 6% 72%, rgba(247,245,245,0.60), transparent 72%)",
          }}
        />

        <div
          className="absolute inset-x-0 top-0 h-56 dark:block hidden"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,.75), transparent)",
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-48 block dark:hidden"
          style={{
            background:
              "linear-gradient(to bottom, rgba(247,245,245,0.45), transparent)",
          }}
        />

        <div
          className="absolute inset-0 dark:block hidden"
          style={{
            background:
              "radial-gradient(ellipse at 50% 55%, transparent 50%, rgba(0,0,0,.55) 100%)",
          }}
        />

        {/* violet bloom that slowly breathes, ties the video to the site accent */}
        <div
          className="hero-breathe absolute -right-[10%] top-[8%] h-[55vmax] w-[55vmax] rounded-full blur-3xl opacity-50 dark:opacity-60"
          style={{
            background:
              "radial-gradient(circle, rgba(179,156,255,.45), transparent 65%)",
          }}
        />

        {/* ambient electric blue bloom on bottom-left for color richness in light mode */}
        <div
          className="absolute -left-[5%] bottom-[5%] h-[38vmax] w-[38vmax] rounded-full blur-3xl opacity-25 dark:opacity-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(30,144,255,.3), transparent 65%)",
          }}
        />

        {/* cursor spotlight (moved by the rAF loop, mouse only) */}
        <div
          ref={spotRef}
          className="absolute left-0 top-0 -ml-[290px] -mt-[290px] h-[580px] w-[580px] rounded-full opacity-0 will-change-transform"
          style={{
            background:
              "radial-gradient(circle, rgba(140,107,255,.22), rgba(140,107,255,.08) 40%, transparent 68%)",
          }}
        />

        <div
          className="absolute inset-x-0 bottom-0 h-24"
          style={{
            background: "linear-gradient(to bottom, transparent, var(--page))",
          }}
        />
        <div className="hero-grain" />
      </div>

      <div
        ref={contentRef}
        className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between px-6 pb-6 pt-20 will-change-transform sm:px-10 sm:pb-8 sm:pt-24 lg:px-16 lg:pt-24"
      >
        {/* Status row */}
        <div
          data-ui="status"
          className="hero-status flex flex-wrap items-center justify-between gap-2 border-b border-black/[0.08] dark:border-[var(--line)] py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-800 dark:text-[var(--muted)] sm:py-2.5 transition-colors duration-300"
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="hero-ping absolute inline-flex h-full w-full rounded-full bg-[#8C6BFF] dark:bg-[#B39CFF]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8C6BFF] dark:bg-[#B39CFF]" />
            </span>
            <span className="text-neutral-700 dark:text-[var(--muted)]">
              Now
            </span>
            <span aria-hidden="true" className="opacity-40">
              /
            </span>
            <RoleCycler paused={reducedMotion} />
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">[28.6139° N, 77.2090° E]</span>
            <span className="rounded-sm border border-[#8C6BFF]/30 bg-[#8C6BFF]/10 text-[#6B46C1] dark:border-white/25 dark:bg-black/30 dark:text-[#B39CFF] px-2.5 py-0.5 font-semibold backdrop-blur-sm transition-colors duration-300">
              OPEN TO ROLES
            </span>
          </div>
        </div>

        {/* Main grid: bottom padding reserves the foreground of the scene */}
        <div className="grid flex-1 items-center gap-10 pb-[18svh] pt-10 sm:pt-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12 lg:pb-[13svh] xl:gap-20">
          <div className="relative z-10 flex flex-col items-start">
            <p className="hero-fade hero-shadow mb-5 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-800 dark:text-white/75 sm:mb-6 transition-colors duration-300">
              <span className="h-px w-7 bg-[#7C5CFC] dark:bg-[#B39CFF]" />
              Independent developer · New Delhi, India
            </p>

            <h1
              aria-label="Ayush Singh"
              className="flex flex-col font-sans text-[clamp(3.8rem,8.4vw,8.2rem)] font-extrabold uppercase leading-[0.84] tracking-[-0.07em] drop-shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:drop-shadow-[0_8px_36px_rgba(0,0,0,0.55)] transition-all duration-300"
            >
              <span className="hero-name-line inline-block bg-gradient-to-b from-[#0F0F12] via-[#1C1C24] to-[#404048] dark:from-white dark:via-white dark:to-white/70 bg-clip-text pb-2 text-transparent">
                Ayush
              </span>
              <span className="hero-name-line hero-shimmer inline-block bg-gradient-to-r from-[#6941C6] via-[#9E77ED] to-[#6941C6] dark:from-[#8C6BFF] dark:via-[#E2D8FF] dark:to-[#8C6BFF] bg-clip-text pb-2 pr-3 font-serif font-normal italic tracking-[-0.06em] text-transparent">
                Singh
                <span className="text-neutral-900 [-webkit-text-fill-color:currentColor] dark:text-white dark:[-webkit-text-fill-color:white]">
                  .
                </span>
              </span>
            </h1>

            <p className="hero-fade hero-shadow mt-6 max-w-xl text-xl font-medium leading-snug tracking-[-0.025em] text-neutral-900 dark:text-white sm:mt-8 sm:text-2xl transition-colors duration-300">
              I build{" "}
              <span className="hero-underline">
                thoughtful digital products
              </span>
              , from the first interface to the systems behind it.
            </p>
            {/* secondary copy only when the viewport is tall enough to afford it */}
            <p className="hero-fade hero-shadow mt-3 hidden max-w-lg text-sm leading-relaxed text-neutral-800 dark:text-white/75 sm:text-base [@media(min-height:860px)]:block transition-colors duration-300">
              Full stack developer, creative technologist, and data science
              student. I bring engineering, analytics, and design together to
              make useful things feel effortless.
            </p>

            <div className="hero-fade mt-7 flex w-full flex-col gap-3.5 sm:mt-8 sm:w-auto sm:flex-row">
              <Magnetic
                disabled={reducedMotion}
                className="flex sm:inline-flex"
              >
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href="#work"
                  onClick={(e) => {
                    e.preventDefault();
                    playClick();
                    scrollToSection("#work");
                  }}
                  className="group relative inline-flex h-12 w-full items-center justify-between gap-5 overflow-hidden rounded-xl bg-[#141416] text-white shadow-[0_10px_30px_-8px_rgba(20,20,22,0.4)] hover:bg-black dark:bg-white dark:text-black dark:shadow-[0_10px_40px_-10px_rgba(179,156,255,0.6)] dark:hover:shadow-[0_14px_50px_-8px_rgba(179,156,255,0.9)] px-6 text-sm font-semibold transition-all duration-300 sm:w-auto sm:min-w-[210px]"
                >
                  {/* light sweep on hover */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[320%] dark:via-[#8C6BFF]/30"
                  />
                  <span className="relative">Explore Selected Work</span>
                  <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-[#B39CFF] dark:bg-black dark:text-[#B39CFF]">
                    <ArrowDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
                  </span>
                </motion.a>
              </Magnetic>

              <Magnetic
                disabled={reducedMotion}
                className="flex sm:inline-flex"
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex w-full"
                >
                  <Link
                    to="/resume"
                    className="group inline-flex h-12 w-full items-center justify-between gap-4 rounded-xl border border-black/[0.12] bg-[#F4F2F0]/80 text-neutral-900 shadow-sm hover:bg-[#EAE7E4] dark:border-white/30 dark:bg-white/10 dark:text-white dark:shadow-none dark:hover:bg-white/20 px-6 text-sm font-medium backdrop-blur-md transition-colors duration-300 sm:min-w-[170px]"
                  >
                    <span>View Résumé</span>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.06] text-[#6941C6] dark:bg-white/15 dark:text-[#B39CFF]">
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </motion.div>
              </Magnetic>
            </div>

            {/* mobile: socials sit under the buttons; desktop: they move to the bottom bar */}
            <SocialLinks
              className="mt-6 flex flex-wrap items-center gap-2.5 sm:hidden"
              disabled
            />
          </div>

          {/* Capabilities: slim, light glass so the storm stays visible (desktop only) */}
          <CapabilityCard reducedMotion={reducedMotion} />
        </div>

        {/* Bottom bar: only the outer corners, so the centre of the scene stays clear */}
        <div className="pt-2">
          {/* tech ticker */}
          <div
            className="hero-fade relative mb-3 overflow-hidden"
            aria-hidden="true"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
            }}
          >
            <div className="hero-marquee flex w-max">
              {[...TECH, ...TECH].map((t, k) => (
                <span
                  key={`${t}-${k}`}
                  className="hero-shadow inline-flex items-center gap-8 pr-8 font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-800 dark:text-white/60"
                >
                  {t}
                  <span className="h-1 w-1 rounded-full bg-[#8C6BFF] dark:bg-[#B39CFF]" />
                </span>
              ))}
            </div>
          </div>

          <div className="hero-line h-px w-full origin-left bg-black/[0.08] dark:bg-white/20 transition-colors duration-300" />
          <div className="hero-fade hero-shadow flex flex-col gap-3 pt-3 text-xs font-medium text-neutral-800 dark:text-white/75 sm:flex-row sm:items-center sm:justify-between sm:pt-3.5 transition-colors duration-300">
            <span className="inline-flex items-center gap-2.5">
              <span
                className="relative flex h-2 w-2 shrink-0"
                aria-hidden="true"
              >
                <span className="hero-ping absolute inline-flex h-full w-full rounded-full bg-[#8C6BFF] dark:bg-[#B39CFF]" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8C6BFF] dark:bg-[#B39CFF]" />
              </span>
              Available for select freelance &amp; full-time engagements
            </span>
            <SocialLinks
              className="hidden items-center gap-2.5 sm:flex"
              disabled={reducedMotion}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
