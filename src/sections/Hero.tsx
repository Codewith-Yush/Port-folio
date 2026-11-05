import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
const POSTER_SRC = "/hero-poster.jpg";

const ROLES = ["Full Stack & Creative Systems", "Freelance Developer", "Data Science Student"];

const CAPABILITIES = [
  { n: "01", title: "Build", body: "Full stack applications, APIs, and reliable product foundations." },
  { n: "02", title: "Understand", body: "Data pipelines, predictive thinking, and clear visual analytics." },
  { n: "03", title: "Make it memorable", body: "Distinctive interfaces with thoughtful motion and detail." },
];

const chipClass =
  "hero-chip inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white backdrop-blur-md transition-colors duration-200 hover:border-white/60 hover:bg-white/15";

const GITHUB_PATH =
  "M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z";
const LINKEDIN_PATH =
  "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z";
const X_PATH =
  "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/codewith-Yush", path: GITHUB_PATH },
  { label: "LinkedIn", href: "https://linkedin.com/in/ayush-singh-643a4b25a", path: LINKEDIN_PATH },
  { label: "X", href: "https://twitter.com/ayushsingh", path: X_PATH },
];

function SocialLinks({ className }: { className?: string }) {
  return (
    <nav aria-label="Social links" className={className}>
      {SOCIALS.map((s) => (
        <motion.a
          key={s.label}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={chipClass}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current opacity-80" aria-hidden="true">
            <path d={s.path} />
          </svg>
          <span>{s.label}</span>
          <span className="opacity-50">↗</span>
        </motion.a>
      ))}
    </nav>
  );
}

export function Hero() {
  const reducedMotion = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  /* ---------- Video depth: lerped pointer + scroll parallax (one smooth rAF loop) ---------- */
  useEffect(() => {
    if (reducedMotion) return;
    const media = mediaRef.current;
    const section = heroRef.current;
    if (!media || !section) return;

    let raf = 0;
    const target = { x: 0, y: 0, s: 0 };
    const cur = { x: 0, y: 0, s: 0 };

    const loop = () => {
      raf = 0;
      cur.x += (target.x - cur.x) * 0.07;
      cur.y += (target.y - cur.y) * 0.07;
      cur.s += (target.s - cur.s) * 0.12;
      media.style.transform = `translate3d(${cur.x * -18}px, ${cur.y * -10 + cur.s * 70}px, 0) scale(${1.07 + cur.s * 0.05})`;

      const settled =
        Math.abs(target.x - cur.x) < 0.001 &&
        Math.abs(target.y - cur.y) < 0.001 &&
        Math.abs(target.s - cur.s) < 0.001;
      if (!settled) raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (section.getBoundingClientRect().bottom < 0) return;
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
      kick();
    };
    const onScroll = () => {
      target.s = Math.min(1, Math.max(0, window.scrollY / (section.offsetHeight || 1)));
      kick();
    };

    onScroll();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  useGSAP(
    () => {
      const root = heroRef.current;
      if (!root) return;
      const cleanups: Array<() => void> = [];

      if (reducedMotion) {
        gsap.set(
          ".hero-fade, .hero-name-line, .hero-chip, .hero-visual-card",
          { opacity: 1, y: 0, yPercent: 0, x: 0, scale: 1 },
        );
        gsap.set(".hero-line", { scaleX: 1 });
        return;
      }

      /* ---------- Intro ---------- */
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(".hero-status", { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
        .fromTo(
          ".hero-name-line",
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.95, stagger: 0.07, ease: "expo.out" },
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
        .fromTo(".hero-line", { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "power3.inOut" }, "-=0.8")
        .fromTo(
          ".hero-visual-card",
          { x: 36, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.05, ease: "expo.out" },
          0.3,
        );

      /* ---------- Role text cycler ---------- */
      const roleEl = roleRef.current;
      if (roleEl) {
        let i = 0;
        const roleTl = gsap.timeline({ repeat: -1, delay: 3 });
        roleTl
          .to(roleEl, { yPercent: -110, opacity: 0, duration: 0.4, ease: "power2.in", delay: 2.4 })
          .call(() => {
            i = (i + 1) % ROLES.length;
            roleEl.textContent = ROLES[i];
          })
          .fromTo(
            roleEl,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
          );
        cleanups.push(() => {
          roleEl.textContent = ROLES[0];
        });
      }

      return () => {
        cleanups.forEach((fn) => fn());
      };
    },
    { scope: heroRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden bg-black text-white"
    >
      <style>{`
        @keyframes hero-ping { 0% { transform: scale(1); opacity: .6; } 80%,100% { transform: scale(2.6); opacity: 0; } }
        .hero-ping { animation: hero-ping 2.2s cubic-bezier(0,0,.2,1) infinite; }

        .hero-shadow { text-shadow: 0 2px 28px rgba(0,0,0,.6), 0 0 2px rgba(0,0,0,.35); }

        @keyframes hero-grain {
          0% { transform: translate(0,0); } 25% { transform: translate(-3%,2%); }
          50% { transform: translate(2%,-3%); } 75% { transform: translate(-2%,-1%); } 100% { transform: translate(0,0); }
        }
        .hero-grain {
          position: absolute; inset: -50%; opacity: .07; mix-blend-mode: overlay; pointer-events: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
          animation: hero-grain 1.1s steps(5) infinite;
        }

        /* slow breathing glow that echoes the storm */
        @keyframes hero-breathe { 0%,100% { opacity: .35; transform: scale(1); } 50% { opacity: .6; transform: scale(1.08); } }
        .hero-breathe { animation: hero-breathe 7s ease-in-out infinite; }

        @keyframes hero-cue { 0% { transform: scaleY(0); transform-origin: top; } 45% { transform: scaleY(1); transform-origin: top; } 55% { transform: scaleY(1); transform-origin: bottom; } 100% { transform: scaleY(0); transform-origin: bottom; } }

        @media (prefers-reduced-motion: reduce) {
          .hero-ping, .hero-grain, .hero-breathe { animation: none; }
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
          className="h-full w-full object-cover"
          style={{ objectPosition: "50% 100%" }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={POSTER_SRC}
          disablePictureInPicture
          tabIndex={-1}
        >
          {VIDEO_WEBM_SRC ? <source src={VIDEO_WEBM_SRC} type="video/webm" /> : null}
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      </div>

      {/* ── READABILITY + ATMOSPHERE ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-black/40 lg:bg-transparent" />
        {/* text side darkening, scene stays open on the right */}
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,.78) 0%, rgba(0,0,0,.5) 36%, rgba(0,0,0,.14) 62%, transparent 80%)",
          }}
        />
        {/* extra pool behind the lower-left copy (it sits over the bright sunset) */}
        <div
          className="absolute inset-0 hidden lg:block"
          style={{ background: "radial-gradient(60% 55% at 6% 72%, rgba(0,0,0,.55), transparent 70%)" }}
        />
        <div
          className="absolute inset-x-0 top-0 h-56"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,.72), transparent)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 55%, transparent 50%, rgba(0,0,0,.55) 100%)" }}
        />
        {/* violet bloom that slowly breathes, ties the video to the site accent */}
        <div
          className="hero-breathe absolute -right-[10%] top-[8%] h-[55vmax] w-[55vmax] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(118,84,214,.35), transparent 65%)", mixBlendMode: "screen" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-20"
          style={{ background: "linear-gradient(to bottom, transparent, var(--page))" }}
        />
        <div className="hero-grain" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between px-6 pb-6 pt-20 sm:px-10 sm:pb-8 sm:pt-24 lg:px-16 lg:pt-24">
        {/* Status row */}
        <div
          data-ui="status"
          className="hero-status flex flex-wrap items-center justify-between gap-2 border-b border-white/20 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/75 sm:py-2.5"
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="hero-ping absolute inline-flex h-full w-full rounded-full bg-[#B39CFF]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#B39CFF]" />
            </span>
            <span className="text-white/55">Now</span>
            <span aria-hidden="true" className="opacity-40">/</span>
            <span className="relative inline-block h-[1.3em] overflow-hidden align-bottom">
              <span ref={roleRef} className="inline-block text-white">
                {ROLES[0]}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">[28.6139° N, 77.2090° E]</span>
            <span className="rounded-sm border border-white/25 bg-black/30 px-2 py-0.5 font-semibold text-[#B39CFF] backdrop-blur-sm">
              OPEN TO ROLES
            </span>
          </div>
        </div>

        {/* Main grid: bottom padding reserves the foreground of the scene */}
        <div className="grid flex-1 items-center gap-10 pb-[18svh] pt-10 sm:pt-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12 lg:pb-[13svh] xl:gap-20">
          <div className="relative z-10 flex flex-col items-start">
            <p className="hero-fade hero-shadow mb-5 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/75 sm:mb-6">
              <span className="h-px w-7 bg-[#B39CFF]" />
              Independent developer · New Delhi, India
            </p>

            <h1
              aria-label="Ayush Singh"
              className="flex flex-col font-sans text-[clamp(3.8rem,8.4vw,8.2rem)] font-extrabold uppercase leading-[0.84] tracking-[-0.07em] drop-shadow-[0_8px_36px_rgba(0,0,0,0.55)]"
            >
              <span className="hero-name-line inline-block bg-gradient-to-b from-white via-white to-white/70 bg-clip-text pb-2 text-transparent">
                Ayush
              </span>
              <span className="hero-name-line inline-block bg-gradient-to-r from-[#E2D8FF] via-[#B39CFF] to-[#8C6BFF] bg-clip-text pb-2 font-serif font-normal italic tracking-[-0.06em] text-transparent">
                Singh<span className="text-white [-webkit-text-fill-color:white]">.</span>
              </span>
            </h1>

            <p className="hero-fade hero-shadow mt-6 max-w-xl text-xl font-medium leading-snug tracking-[-0.025em] text-white sm:mt-8 sm:text-2xl">
              I build thoughtful digital products, from the first interface to the systems behind it.
            </p>
            {/* secondary copy only when the viewport is tall enough to afford it */}
            <p className="hero-fade hero-shadow mt-3 hidden max-w-lg text-sm leading-relaxed text-white/75 sm:text-base [@media(min-height:860px)]:block">
              Full stack developer, creative technologist, and data science student. I bring engineering, analytics, and design together to make useful things feel effortless.
            </p>

            <div className="hero-fade mt-7 flex w-full flex-col gap-3.5 sm:mt-8 sm:w-auto sm:flex-row">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  playClick();
                  scrollToSection("#work");
                }}
                className="group inline-flex h-12 items-center justify-between gap-5 rounded-xl bg-white px-6 text-sm font-semibold text-black shadow-[0_10px_40px_-10px_rgba(179,156,255,0.6)] transition-shadow duration-300 hover:shadow-[0_14px_50px_-8px_rgba(179,156,255,0.9)] sm:min-w-[210px]"
              >
                <span>Explore Selected Work</span>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black text-[#B39CFF]">
                  <ArrowDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
                </span>
              </motion.a>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-flex">
                <Link
                  to="/resume"
                  className="group inline-flex h-12 w-full items-center justify-between gap-4 rounded-xl border border-white/30 bg-white/10 px-6 text-sm font-medium text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/20 sm:min-w-[170px]"
                >
                  <span>View Résumé</span>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#B39CFF] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </motion.div>
            </div>

            {/* mobile: socials sit under the buttons; desktop: they move to the bottom bar */}
            <SocialLinks className="mt-6 flex flex-wrap items-center gap-2.5 sm:hidden" />
          </div>

          {/* Capabilities: slim, light glass so the storm stays visible (desktop only) */}
          <aside
            aria-label="What I bring"
            className="hero-visual-card relative ml-auto hidden w-full max-w-[400px] rounded-2xl border border-white/15 bg-black/25 p-5 backdrop-blur-md lg:block"
          >
            <div className="mb-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-white/65">
              <span>What I bring</span>
              <span>01 — 03</span>
            </div>
            <ul className="divide-y divide-white/15">
              {CAPABILITIES.map((c) => (
                <li key={c.n} className="group grid grid-cols-[48px_1fr] gap-3 py-4">
                  <span className="font-serif text-3xl italic leading-none text-[#B39CFF] transition-transform duration-300 group-hover:translate-x-1">
                    {c.n}
                  </span>
                  <div>
                    <h2 className="text-base font-semibold tracking-tight text-white">{c.title}</h2>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-white/70">{c.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        {/* Bottom bar: only the outer corners, so the centre of the scene stays clear */}
        <div className="pt-2">
          <div className="hero-line h-px w-full origin-left bg-white/20" />
          <div className="hero-fade hero-shadow flex flex-col gap-3 pt-3 text-xs text-white/75 sm:flex-row sm:items-center sm:justify-between sm:pt-3.5">
            <span className="inline-flex items-center gap-2.5">
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                <span className="hero-ping absolute inline-flex h-full w-full rounded-full bg-[#B39CFF]" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#B39CFF]" />
              </span>
              Available for select freelance &amp; full-time engagements
            </span>
            <SocialLinks className="hidden items-center gap-2.5 sm:flex" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;