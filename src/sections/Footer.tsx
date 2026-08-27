import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "../components/Container";
import { navItems, projects } from "../data/portfolio";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useTheme } from "../hooks/useTheme";

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
    url: "https://twitter.com",
    handle: "@ayushsingh",
    icon: (
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    ),
  },
];

const MARQUEE_ITEMS = [
  "INNOVATION & CRAFT",
  "FULL STACK ARCHITECTURE",
  "CREATIVE DIRECTION",
  "AI EXPERIENCES",
  "DATA SCIENCE & ANALYTICS",
  "AVAILABLE FOR SELECT PROJECTS",
];

export function Footer() {
  const reducedMotion = usePrefersReducedMotion();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const footerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const visualReelRef = useRef<HTMLDivElement>(null);

  const [time, setTime] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [activeProjectHover, setActiveProjectHover] = useState<number | null>(null);

  // Live Local Time Updater (IST / New Delhi)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Interactive Particle Constellation Canvas Effect with Theme Adaptability
  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    const particleCount = Math.min(Math.floor(width / 22), 50);
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }> = [];

    // Adaptive Theme Particle Palette
    const colors = isDark
      ? [
          "rgba(16, 185, 129, 0.45)",
          "rgba(6, 182, 212, 0.45)",
          "rgba(129, 140, 248, 0.4)",
          "rgba(255, 255, 255, 0.35)",
        ]
      : [
          "rgba(37, 42, 52, 0.3)",
          "rgba(6, 182, 212, 0.35)",
          "rgba(16, 185, 129, 0.35)",
          "rgba(107, 114, 128, 0.3)",
        ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Subtle mouse repulsion
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist2 < 95) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDark
              ? `rgba(255, 255, 255, ${0.12 * (1 - dist2 / 95)})`
              : `rgba(37, 42, 52, ${0.1 * (1 - dist2 / 95)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion, isDark]);

  // Entrance Animations with GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion) return;

      gsap.fromTo(
        ".footer-fade-in",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 80%",
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Smooth Scroll to Top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Copy Email to Clipboard
  const handleCopyEmail = () => {
    navigator.clipboard.writeText("ayushsingh7360@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-[var(--page)] text-[var(--ink)] pt-16 sm:pt-20 md:pt-24 pb-10 border-t border-black/10 dark:border-white/10 transition-colors duration-500"
    >
      {/* Background Interactive Starfield Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-auto absolute inset-0 h-full w-full opacity-60 z-0"
      />

      {/* Atmospheric Ambient Lighting Halos */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-[var(--flame)]/5 dark:bg-emerald-500/10 blur-[130px] z-0 transition-colors duration-500" />
      <div className="pointer-events-none absolute bottom-10 right-1/4 h-96 w-96 rounded-full bg-[var(--blush)]/5 dark:bg-cyan-500/10 blur-[150px] z-0 transition-colors duration-500" />

      {/* Infinite Glowing Marquee Ticker */}
      <div className="relative z-10 overflow-hidden border-y border-black/10 dark:border-white/10 py-3.5 bg-black/[0.02] dark:bg-white/[0.02] backdrop-blur-md mb-12 sm:mb-16">
        <div className="footer-marquee-track flex gap-8 whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
            <span
              key={idx}
              className="flex items-center gap-6 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[var(--ink)]/70 dark:text-white/70"
            >
              <span>{item}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--flame)] dark:bg-emerald-400 shadow-[0_0_8px_#10b981]" />
            </span>
          ))}
        </div>
        {/* Subtle Side Fade Scrims */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-[var(--page)] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-[var(--page)] to-transparent z-10" />
      </div>

      <Container className="relative z-10">
        {/* Visual Creative Showcase Dock */}
        <div ref={visualReelRef} className="footer-fade-in mb-14 sm:mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--flame)] dark:text-emerald-400">
                Visual Showcase
              </span>
              <h3 className="text-xl sm:text-2xl font-light text-[var(--ink)] tracking-tight mt-1">
                Selected Works & Creations
              </h3>
            </div>
            <a
              href="#work"
              className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--ink)]/60 dark:text-white/60 hover:text-[var(--ink)] dark:hover:text-white transition-colors"
            >
              <span>Explore All Projects</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>

          {/* 3-Card Interactive Visual Showcase Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {projects.slice(0, 3).map((project, idx) => (
              <a
                key={project.title}
                href={project.link || project.galleryLink || "#work"}
                target={project.link?.startsWith("http") ? "_blank" : undefined}
                rel={project.link?.startsWith("http") ? "noopener noreferrer" : undefined}
                onMouseEnter={() => setActiveProjectHover(idx)}
                onMouseLeave={() => setActiveProjectHover(null)}
                className={`group relative overflow-hidden rounded-2xl border bg-black/[0.02] dark:bg-white/[0.03] p-3 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 ${
                  activeProjectHover === idx
                    ? "border-[var(--flame)]/60 dark:border-emerald-400/60 shadow-[0_16px_36px_rgba(0,0,0,0.1)] dark:shadow-[0_16px_36px_rgba(16,185,129,0.22)] scale-[1.02]"
                    : "border-black/10 dark:border-white/10 hover:border-[var(--flame)]/40 dark:hover:border-emerald-500/40 hover:shadow-lg"
                }`}
              >
                {/* Visual Thumbnail */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-900">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                  {/* Top Floating Badge */}
                  <span className="absolute top-2.5 right-2.5 rounded-full border border-white/20 bg-black/60 px-2.5 py-0.5 text-[9px] font-mono uppercase text-white backdrop-blur-md">
                    {project.year}
                  </span>

                  {/* Bottom Image Overlay Text */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                    <span className="text-xs font-bold tracking-tight truncate pr-2">
                      {project.title}
                    </span>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-black text-xs font-bold transition-transform duration-300 group-hover:scale-110 group-hover:bg-emerald-400">
                      ↗
                    </span>
                  </div>
                </div>

                {/* Tech Tags */}
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {project.stack.slice(0, 2).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-black/5 dark:bg-white/5 px-2 py-0.5 text-[9px] font-medium text-[var(--ink)]/60 dark:text-white/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Central Kinetic Statement */}
        <div className="footer-fade-in text-center my-12 sm:my-16">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--ink)]/50 dark:text-white/50 mb-3">
            Let&apos;s Create Something Next
          </span>
          <h2
            ref={headingRef}
            className="text-[clamp(2.2rem,6.5vw,5.5rem)] font-light leading-[1.08] tracking-tight text-[var(--ink)] max-w-4xl mx-auto"
          >
            Have a project in mind?{" "}
            <span className="font-serif italic font-normal text-[var(--flame)] dark:bg-gradient-to-r dark:from-emerald-300 dark:via-teal-200 dark:to-cyan-300 dark:bg-clip-text dark:text-transparent">
              Let&apos;s build it together.
            </span>
          </h2>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contact"
              className="group relative inline-flex h-[52px] w-full sm:w-[210px] items-center justify-center rounded-full bg-[#252A34] text-white dark:bg-white dark:text-black px-8 text-xs font-bold uppercase tracking-[0.2em] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-400 active:scale-95"
            >
              <span>Start a Project</span>
              <span className="ml-2 text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="group relative inline-flex h-[52px] w-full sm:w-[210px] items-center justify-center rounded-full border border-black/15 dark:border-white/20 bg-black/5 dark:bg-white/[0.04] backdrop-blur-xl px-8 text-xs font-bold uppercase tracking-[0.2em] text-[var(--ink)] dark:text-white transition-all duration-300 hover:scale-105 hover:border-[var(--flame)]/50 dark:hover:border-white/50 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95"
            >
              <span>{copied ? "✓ Copied!" : "Copy Email"}</span>
            </button>
          </div>
        </div>

        {/* Bento Control & Info Grid */}
        <div className="footer-fade-in grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 border-t border-black/10 dark:border-white/10 pt-10 sm:pt-12">
          {/* Card 1: Telemetry & Availability */}
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-5 backdrop-blur-md flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ink)]/50 dark:text-white/50">
                Location & Time
              </span>
              <span className="text-xs">🇮🇳</span>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--ink)]">New Delhi, India (IST)</p>
              <p className="font-mono text-xs text-[var(--flame)] dark:text-emerald-400 mt-1 font-bold">
                {time || "00:00:00 AM"} • UTC+5:30
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-black/5 dark:border-white/5 text-[11px] text-[var(--ink)]/70 dark:text-white/70">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
              </span>
              <span>Open to Freelance & Full-time</span>
            </div>
          </div>

          {/* Card 2: Quick Navigation */}
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-5 backdrop-blur-md flex flex-col justify-between gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ink)]/50 dark:text-white/50">
              Navigation
            </span>
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-xs font-semibold text-[var(--ink)]/70 dark:text-white/70 hover:text-[var(--flame)] dark:hover:text-emerald-400 transition-colors uppercase tracking-wider py-1"
                >
                  {item.label} ↗
                </a>
              ))}
            </div>
            <div className="pt-2 border-t border-black/5 dark:border-white/5 text-[11px] text-[var(--ink)]/50 dark:text-white/50">
              Crafted with React, GSAP & Tailwind
            </div>
          </div>

          {/* Card 3: Social Connectivity & Back to Top */}
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-5 backdrop-blur-md flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ink)]/50 dark:text-white/50">
                Network & Socials
              </span>
              <button
                type="button"
                onClick={scrollToTop}
                className="group flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--ink)]/60 dark:text-white/60 hover:text-[var(--flame)] dark:hover:text-emerald-400 transition-colors"
                title="Scroll back to top"
              >
                <span>Top</span>
                <span className="transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
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
                  className="flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/[0.03] px-3 py-2 text-xs text-[var(--ink)]/80 dark:text-white/80 transition-all duration-300 hover:scale-105 hover:border-[var(--flame)]/50 dark:hover:border-emerald-400/50 hover:text-[var(--ink)] dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                    {social.icon}
                  </svg>
                  <span className="text-[11px] font-medium">{social.name}</span>
                </a>
              ))}
            </div>

            <div className="pt-2 border-t border-black/5 dark:border-white/5 text-[11px] text-[var(--ink)]/50 dark:text-white/50">
              © {new Date().getFullYear()} Ayush Singh. All rights reserved.
            </div>
          </div>
        </div>

        {/* Minimal Bottom Studio Stamp */}
        <div className="footer-fade-in mt-10 pt-6 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between text-[10px] uppercase tracking-[0.25em] text-[var(--ink)]/40 dark:text-white/40 gap-3">
          <span>Ayush Singh • Portfolio 2026</span>
          <button
            type="button"
            onClick={scrollToTop}
            className="hover:text-[var(--flame)] dark:hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            <span>Back to top</span>
            <span>↑</span>
          </button>
        </div>
      </Container>
    </footer>
  );
}