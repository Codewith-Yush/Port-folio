import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
  X,
  Zap,
  ArrowUpRight,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "../utils/cn";
import { projects, type Project } from "../data/portfolio";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { Container } from "../components/Container";

gsap.registerPlugin(ScrollTrigger);

type FilterCategory = "all" | "web" | "design";

const FILTER_OPTIONS: { key: FilterCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "web", label: "Web Apps" },
  { key: "design", label: "Design Showcase" },
];

// Single source of truth for "is this a design/Canva showcase piece" — used by
// both the filter counts and the filter itself, so they can never drift apart.
const isDesignProject = (p: Project) =>
  Boolean(p.galleryLink) || p.stack.includes("Canva") || p.stack.includes("Branding");

/**
 * Nudges an element a fraction of the way toward the cursor and springs back
 * on mouse leave. No-ops for touch pointers and reduced-motion so it never
 * fights the platform or the user's accessibility preference.
 */
function useMagnetic<T extends HTMLElement>(strength = 0.2, disabled = false) {
  const ref = useRef<T>(null);

  const onMouseMove = (e: React.MouseEvent) => {
    if (disabled || !ref.current || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(ref.current, { x: x * strength, y: y * strength, duration: 0.4, ease: "power2.out" });
  };

  const onMouseLeave = () => {
    if (disabled || !ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  };

  return { ref, onMouseMove, onMouseLeave };
}

// Project Quick-View Deep Dive Modal
function ProjectModal({
  project,
  index,
  total,
  reducedMotion,
  onClose,
  onNavigate,
}: {
  project: Project;
  index: number;
  total: number;
  reducedMotion: boolean;
  onClose: () => void;
  onNavigate: (targetIndex: number) => void;
}) {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const isCanva = Boolean(project.galleryLink);

  const animateOut = (onComplete: () => void) => {
    if (reducedMotion || !cardRef.current) {
      onComplete();
      return;
    }
    setIsClosing(true);
    gsap.to(cardRef.current, {
      opacity: 0,
      y: 16,
      scale: 0.97,
      duration: 0.25,
      ease: "power2.in",
      onComplete,
    });
  };

  const requestClose = () => animateOut(onClose);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    if (!reducedMotion && cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 24, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out" }
      );
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
      if (e.key === "ArrowRight") onNavigate(index + 1);
      if (e.key === "ArrowLeft") onNavigate(index - 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity duration-300",
          isClosing ? "opacity-0" : "opacity-100"
        )}
        onClick={requestClose}
      />

      {/* Modal Content Window */}
      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-black/15 dark:border-white/15 bg-[var(--surface)] p-6 sm:p-8 md:p-10 text-[var(--ink)] shadow-2xl backdrop-blur-2xl"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--ink)]">
              <Sparkles className="h-3 w-3 text-emerald-500" />
              <span>{isCanva ? "Design Portfolio" : "Full Stack Architecture"}</span>
            </span>
            {total > 1 && (
              <span className="text-xs font-mono text-[var(--ink)]/50">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {total > 1 && (
              <>
                <button
                  onClick={() => onNavigate(index - 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 transition-all hover:scale-110 hover:bg-[#252A34] hover:text-white dark:hover:bg-white dark:hover:text-black"
                  aria-label="Previous project"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onNavigate(index + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 transition-all hover:scale-110 hover:bg-[#252A34] hover:text-white dark:hover:bg-white dark:hover:text-black"
                  aria-label="Next project"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
            <button
              ref={closeButtonRef}
              onClick={requestClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-sm transition-all hover:scale-110 hover:bg-[#252A34] hover:text-white dark:hover:bg-white dark:hover:text-black"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          {/* Media Side */}
          <div className="space-y-4">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 shadow-xl bg-black/5 dark:bg-black/40">
              <img
                src={project.image}
                alt={project.title}
                className="h-full w-full object-cover object-top"
              />
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 gap-3">
              {project.metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl border border-black/5 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] p-4 text-center"
                >
                  <div className="text-2xl font-bold text-emerald-500">{m.value}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink)]/60 mt-1">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details Side */}
          <div className="flex flex-col justify-between">
            <div>
              <h3
                id="project-modal-title"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)]"
              >
                {project.title}
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-[var(--ink)]/75">
                {project.description}
              </p>

              {/* Role, Timeline & Category info */}
              <div className="mt-5 grid grid-cols-3 gap-3 p-3.5 rounded-2xl border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-xs">
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-[var(--ink)]/50 block">
                    Role
                  </span>
                  <span className="font-semibold text-[var(--ink)]">{project.role}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-[var(--ink)]/50 block">
                    Timeline
                  </span>
                  <span className="font-semibold text-[var(--ink)]">{project.year}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-[var(--ink)]/50 block">
                    Category
                  </span>
                  <span className="font-semibold text-[var(--ink)]">
                    {isCanva ? "Design" : "Web App"}
                  </span>
                </div>
              </div>

              {/* Impact Statement */}
              <div className="mt-4 rounded-2xl border border-black/10 dark:border-white/10 border-l-4 border-l-emerald-500/70 bg-black/[0.03] dark:bg-white/[0.03] p-4 text-xs leading-relaxed text-[var(--ink)]">
                <div className="flex items-center gap-1.5 text-emerald-500 font-bold uppercase text-[10px] tracking-wider mb-1.5">
                  <Zap className="h-3.5 w-3.5" />
                  <span>Impact & Purpose</span>
                </div>
                <p className="text-[var(--ink)]/80">{project.impact}</p>
              </div>

              {/* Key Features List */}
              <div className="mt-5">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink)]/50 mb-3">
                  Key Deliverables
                </h4>
                <ul className="space-y-2">
                  {project.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-xs text-[var(--ink)]/80">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack Chips */}
              <div className="mt-5">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink)]/50 mb-2">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-[10px] font-semibold text-[var(--ink)]/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="mt-8 flex flex-wrap gap-3 pt-6 border-t border-black/10 dark:border-white/10">
              {project.galleryLink ? (
                <button
                  onClick={() =>
                    animateOut(() => {
                      onClose();
                      navigate(project.galleryLink!);
                    })
                  }
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#252A34] text-white dark:bg-white dark:text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-400 dark:hover:text-black hover:scale-[1.02] transition-all shadow-lg"
                >
                  <Layers className="h-4 w-4" />
                  <span>Open Canva Showcase ↗</span>
                </button>
              ) : project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#252A34] text-white dark:bg-white dark:text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-400 dark:hover:text-black hover:scale-[1.02] transition-all shadow-lg"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Launch Live Demo ↗</span>
                </a>
              ) : null}

              <button
                onClick={requestClose}
                className="px-6 py-3 border border-black/15 dark:border-white/15 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#252A34] hover:text-white hover:border-[#252A34] dark:hover:bg-white dark:hover:text-black transition-all text-[var(--ink)]"
              >
                Close
              </button>
            </div>

            {/* Pagination Dots */}
            {total > 1 && (
              <div
                className="mt-6 flex items-center justify-center gap-2"
                role="group"
                aria-label="Jump to another project"
              >
                {Array.from({ length: total }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => onNavigate(i)}
                    aria-label={`Go to project ${i + 1}`}
                    aria-current={i === index}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === index
                        ? "w-6 bg-[#252A34] dark:bg-white"
                        : "w-1.5 bg-black/15 dark:bg-white/20 hover:bg-black/30 dark:hover:bg-white/40"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Interactive Media Showcase Frame with Parallax Hover Physics
function ShowcaseMediaFrame({
  project,
  featured,
  reducedMotion,
  onClick,
}: {
  project: Project;
  featured: boolean;
  reducedMotion: boolean;
  onClick: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [glare, setGlare] = useState({ x: 50, y: 50 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const isCanva = Boolean(project.galleryLink);

  // Covers the case where the browser served the image from cache before
  // this component ever attached its onLoad handler.
  useEffect(() => {
    if (imgRef.current?.complete) setImageLoaded(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !containerRef.current || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setTilt({
      x: ((y - centerY) / centerY) * -5,
      y: ((x - centerX) / centerX) * 5,
    });
    setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setTilt({ x: 0, y: 0 });
      }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        transform: isHovered
          ? `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.015)`
          : "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)",
        transition: isHovered ? "transform 0.12s ease-out" : "transform 0.6s ease-out",
      }}
      className="group relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/15 bg-black/5 dark:bg-black/50 shadow-2xl cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={`View ${project.title}`}
    >
      {/* Studio Window Chrome Bar — dots for shipped systems, layered squares for design/gallery work */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/[0.03] dark:bg-white/[0.03] border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-1.5">
          {isCanva ? (
            <>
              <Layers className="h-3 w-3 text-[var(--ink)]/50" />
              <Layers className="h-3 w-3 text-[var(--ink)]/30" />
              <Layers className="h-3 w-3 text-[var(--ink)]/15" />
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-red-400/80" />
              <span className="h-2 w-2 rounded-full bg-amber-400/80" />
              <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
            </>
          )}
        </div>
        <span className="text-[10px] font-mono tracking-widest text-[var(--ink)]/40 dark:text-white/40 uppercase">
          {isCanva ? "gallery.exhibition" : "system.production"}
        </span>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-[var(--flame)] dark:text-emerald-400">
            {project.year}
          </span>
        </div>
      </div>

      {/* Main Image Frame with Ambient Hover Scrim */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-950">
        {/* Blur-up placeholder while the image loads */}
        <div
          className={cn(
            "absolute inset-0 bg-black/10 animate-pulse transition-opacity duration-500",
            imageLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
        />
        <img
          ref={imgRef}
          src={project.image}
          alt={project.title}
          onLoad={() => setImageLoaded(true)}
          className={cn(
            "h-full w-full object-cover object-top transition-all duration-700 ease-out group-hover:scale-105",
            imageLoaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
          )}
        />

        {/* Cursor-tracking glare — reinforces the "glass display" read of the chrome bar above */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.35), transparent 45%)`,
          }}
        />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-45 group-hover:opacity-70 transition-opacity duration-500" />

        {/* Top Floating Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3.5 py-1 font-mono text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-md shadow-lg">
            <Sparkles className="h-3 w-3 text-emerald-400" />
            <span>
              {project.stack[0]} • {project.stack[1] || "Core"}
            </span>
          </span>
        </div>

        {/* Featured Ribbon (first project, only while browsing "All") */}
        {featured && (
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-emerald-500/90 px-3 py-1 font-mono text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-md shadow-lg">
              Featured
            </span>
          </div>
        )}

        {/* Center Hover Action Capsule */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-xs font-bold uppercase tracking-wider shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Eye className="h-4 w-4 text-emerald-600" />
            <span>Explore Case Study</span>
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        {/* Bottom Corner Metrics Preview */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-white">
          <span className="text-xs font-bold tracking-wider uppercase opacity-90 drop-shadow-md">
            {project.role}
          </span>
          <span className="rounded-md border border-white/20 bg-black/70 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-300 backdrop-blur-md">
            {project.metrics[0]?.value} {project.metrics[0]?.label}
          </span>
        </div>
      </div>
    </div>
  );
}

// A single exhibition row — media frame + editorial copy. Its own component
// (rather than inline JSX inside a .map) so it can safely own hooks, like the
// magnetic CTA buttons below.
function ShowcaseItem({
  project,
  idx,
  isEven,
  featured,
  reducedMotion,
  onOpen,
}: {
  project: Project;
  idx: number;
  isEven: boolean;
  featured: boolean;
  reducedMotion: boolean;
  onOpen: () => void;
}) {
  const indexStr = String(idx + 1).padStart(2, "0");
  const primaryCta = useMagnetic<HTMLAnchorElement>(0.18, reducedMotion);
  const secondaryCta = useMagnetic<HTMLButtonElement>(0.18, reducedMotion);

  return (
    <div
      className={cn(
        "showcase-item grid lg:grid-cols-[1.25fr_1fr] gap-8 sm:gap-12 lg:gap-16 items-center",
        isEven && "lg:grid-cols-[1fr_1.25fr]"
      )}
      data-even={isEven}
    >
      {/* Media Image Showcase Column with 3D Parallax Tilt */}
      <div data-media className={cn("w-full", isEven && "lg:order-2")}>
        <ShowcaseMediaFrame
          project={project}
          featured={featured}
          reducedMotion={reducedMotion}
          onClick={onOpen}
        />
      </div>

      {/* Editorial Content Column */}
      <div data-content className={cn("flex flex-col justify-center", isEven && "lg:order-1")}>
        {/* Serial Number & Index */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl sm:text-3xl font-light font-mono text-[var(--flame)] dark:text-emerald-400">
            /{indexStr}
          </span>
          <span className="h-[1px] w-12 bg-black/15 dark:bg-white/15" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ink)]/50 dark:text-white/50">
            {project.role}
          </span>
        </div>

        {/* Project Title */}
        <h3
          onClick={onOpen}
          className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[var(--ink)] cursor-pointer hover:text-[var(--flame)] dark:hover:text-emerald-400 transition-colors"
        >
          {project.title}
        </h3>

        {/* Description */}
        <p className="mt-5 text-sm sm:text-base leading-relaxed text-[var(--ink)]/75 dark:text-white/75 font-light">
          {project.description}
        </p>

        {/* Impact Highlight Card */}
        <div className="mt-6 p-4 rounded-2xl border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-xs leading-relaxed text-[var(--ink)]/80 dark:text-white/80">
          <span className="text-emerald-500 font-bold uppercase text-[9px] tracking-wider block mb-1">
            Key Impact
          </span>
          {project.impact}
        </div>

        {/* Tech Stack Pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((t) => (
            <span
              key={t}
              className="px-3 py-1 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] text-[11px] font-medium text-[var(--ink)]/80 dark:text-white/80"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Metrics & Action Buttons */}
        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {project.metrics.map((m) => (
              <div key={m.label}>
                <div className="text-xl sm:text-2xl font-semibold text-[var(--ink)]">{m.value}</div>
                <div className="text-[9px] uppercase tracking-wider text-[var(--ink)]/50 dark:text-white/50 font-semibold mt-0.5">
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {project.galleryLink ? (
              <a
                ref={primaryCta.ref}
                onMouseMove={primaryCta.onMouseMove}
                onMouseLeave={primaryCta.onMouseLeave}
                href={project.galleryLink}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#252A34] text-white dark:bg-white dark:text-black text-xs font-semibold uppercase tracking-wider hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-400 dark:hover:text-black transition-colors shadow-md"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Showcase</span>
              </a>
            ) : project.link ? (
              <a
                ref={primaryCta.ref}
                onMouseMove={primaryCta.onMouseMove}
                onMouseLeave={primaryCta.onMouseLeave}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#252A34] text-white dark:bg-white dark:text-black text-xs font-semibold uppercase tracking-wider hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-400 dark:hover:text-black transition-colors shadow-md"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Live Demo</span>
              </a>
            ) : null}

            <button
              ref={secondaryCta.ref}
              onMouseMove={secondaryCta.onMouseMove}
              onMouseLeave={secondaryCta.onMouseLeave}
              onClick={onOpen}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-black/15 dark:border-white/15 text-xs font-semibold uppercase tracking-wider text-[var(--ink)] hover:border-black/40 dark:hover:border-white/40 transition-colors"
            >
              <span>Details</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const showcaseListRef = useRef<HTMLDivElement>(null);
  const tabsWrapRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<FilterCategory, HTMLButtonElement>>(new Map());

  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Counts derived live from the data set, so the filter bar never lies about
  // how many projects are actually in each bucket.
  const counts = useMemo(
    () => ({
      all: projects.length,
      web: projects.filter((p) => !isDesignProject(p)).length,
      design: projects.filter(isDesignProject).length,
    }),
    []
  );

  const filteredProjects = useMemo(
    () =>
      projects.filter((p) => {
        if (activeFilter === "web") return !isDesignProject(p);
        if (activeFilter === "design") return isDesignProject(p);
        return true;
      }),
    [activeFilter]
  );

  // Close the deep-dive view whenever the filter changes, so we can never end
  // up pointing at an index that no longer exists in the filtered list.
  useEffect(() => {
    setSelectedIndex(null);
  }, [activeFilter]);

  // Slide the active-filter pill under whichever tab is selected.
  useLayoutEffect(() => {
    const positionIndicator = () => {
      const activeEl = tabRefs.current.get(activeFilter);
      const wrapEl = tabsWrapRef.current;
      const indicatorEl = indicatorRef.current;
      if (!activeEl || !wrapEl || !indicatorEl) return;

      const wrapRect = wrapEl.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      const x = activeRect.left - wrapRect.left;
      const width = activeRect.width;

      if (reducedMotion) {
        gsap.set(indicatorEl, { x, width });
      } else {
        gsap.to(indicatorEl, { x, width, duration: 0.5, ease: "power3.out" });
      }
    };

    positionIndicator();
    window.addEventListener("resize", positionIndicator);
    return () => window.removeEventListener("resize", positionIndicator);
  }, [activeFilter, reducedMotion]);

  // GSAP ScrollTrigger Entrance Animation for Exhibition Items — each row
  // reveals its media from whichever side it sits on, echoing the alternating
  // asymmetrical layout instead of a generic fade-up.
  useEffect(() => {
    if (reducedMotion || !showcaseListRef.current) return;

    const ctx = gsap.context(() => {
      const items = showcaseListRef.current?.querySelectorAll<HTMLElement>(".showcase-item");
      items?.forEach((item) => {
        const media = item.querySelector<HTMLElement>("[data-media]");
        const content = item.querySelector<HTMLElement>("[data-content]");
        const isEven = item.dataset.even === "true";

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });

        if (media) {
          tl.fromTo(
            media,
            { opacity: 0, x: isEven ? 40 : -40 },
            { opacity: 1, x: 0, duration: 0.9, ease: "power3.out" },
            0
          );
        }
        if (content) {
          tl.fromTo(
            content,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            0.12
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion, activeFilter]);

  const openProject = (idx: number) => setSelectedIndex(idx);
  const closeProject = () => setSelectedIndex(null);
  const navigateProject = (targetIndex: number) => {
    if (filteredProjects.length === 0) return;
    const wrapped = (targetIndex + filteredProjects.length) % filteredProjects.length;
    setSelectedIndex(wrapped);
  };

  const selectedProject = selectedIndex !== null ? filteredProjects[selectedIndex] : null;

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative bg-[var(--page)] py-16 sm:py-24 md:py-28 overflow-hidden transition-colors duration-500"
    >
      {/* Ambient Lighting Halos */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-[var(--flame)]/5 dark:bg-emerald-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 rounded-full bg-[var(--blush)]/5 dark:bg-cyan-500/10 blur-[150px] pointer-events-none" />

      <Container>
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 pb-8 border-b border-black/10 dark:border-white/10 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-black/[0.03] dark:bg-white/[0.04] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--flame)] dark:text-emerald-400 backdrop-blur-md mb-4">
              <Sparkles className="h-3 w-3" />
              <span>Selected Works 2025–2026</span>
            </div>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[var(--ink)] leading-[1.05]">
              Featured{" "}
              <span className="font-serif italic text-[var(--flame)] dark:text-emerald-400 font-normal">
                Projects
              </span>
            </h2>

            <p className="mt-4 text-base sm:text-lg text-[var(--ink)]/70 max-w-xl font-light leading-relaxed">
              A curated selection of modern web applications, bespoke design systems, and creative AI architectures.
            </p>
          </div>

          {/* Segmented Filter Control — a sliding pill tracks the active tab */}
          <div
            ref={tabsWrapRef}
            className="relative flex flex-wrap items-center gap-1 self-start md:self-auto p-1 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]"
          >
            <div
              ref={indicatorRef}
              aria-hidden="true"
              className="absolute inset-y-1 left-0 rounded-full bg-[#252A34] dark:bg-white shadow-md"
            />
            {FILTER_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                ref={(el) => {
                  if (el) tabRefs.current.set(key, el);
                }}
                onClick={() => setActiveFilter(key)}
                aria-pressed={activeFilter === key}
                className={cn(
                  "relative z-10 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors duration-300",
                  activeFilter === key
                    ? "text-white dark:text-black"
                    : "text-[var(--ink)]/70 hover:text-[var(--ink)]"
                )}
              >
                {label} ({counts[key]})
              </button>
            ))}
          </div>
        </div>

        {/* Cinematic Asymmetrical Exhibition Showcase */}
        <div ref={showcaseListRef} className="flex flex-col gap-16 sm:gap-24 md:gap-28">
          {filteredProjects.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--ink)]/50">
                No projects in this category yet
              </p>
            </div>
          ) : (
            filteredProjects.map((project, idx) => (
              <ShowcaseItem
                key={project.title}
                project={project}
                idx={idx}
                isEven={idx % 2 === 1}
                featured={activeFilter === "all" && idx === 0}
                reducedMotion={reducedMotion}
                onOpen={() => openProject(idx)}
              />
            ))
          )}
        </div>
      </Container>

      {/* Quick View Deep Dive Modal */}
      {selectedProject && selectedIndex !== null && (
        <ProjectModal
          project={selectedProject}
          index={selectedIndex}
          total={filteredProjects.length}
          reducedMotion={reducedMotion}
          onClose={closeProject}
          onNavigate={navigateProject}
        />
      )}
    </section>
  );
}