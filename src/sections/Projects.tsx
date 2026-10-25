import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CheckCircle2,
  X,
  Zap,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDown,
} from "lucide-react";
import { cn } from "../utils/cn";
import { projects, type Project } from "../data/portfolio";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useMagnetic } from "../hooks/useMagnetic";
import { Container } from "../components/Container";
import { ChromaticImage } from "@/components/ui/chromatic-image";
import { playTab, playClick } from "../utils/soundEffects";

gsap.registerPlugin(ScrollTrigger);

type FilterCategory = "all" | "web" | "data" | "design";
type Category = Exclude<FilterCategory, "all">;

const FILTER_OPTIONS: { key: FilterCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "web", label: "Web Apps" },
  { key: "data", label: "Data & AI" },
  { key: "design", label: "Design Showcase" },
];

const CATEGORY_LABEL: Record<Category, { short: string; long: string; modal: string }> = {
  design: { short: "Design", long: "Design Portfolio", modal: "Design" },
  data: { short: "Data & ML", long: "Data Intelligence", modal: "Data & ML" },
  web: { short: "Web App", long: "Full Stack Architecture", modal: "Web App" },
};

const isDesignProject = (p: Project) =>
  p.category === "design" ||
  Boolean(p.galleryLink) ||
  p.stack.includes("Canva") ||
  p.stack.includes("Branding");

const isDataProject = (p: Project) =>
  p.category === "data" ||
  p.stack.includes("Power BI") ||
  p.stack.includes("Python") ||
  p.stack.includes("Data Science");

const isWebProject = (p: Project) =>
  p.category === "web" || (!isDesignProject(p) && !isDataProject(p));

// Single source of truth so cards, modal and filters always agree.
const getCategory = (p: Project): Category =>
  isDesignProject(p) ? "design" : isDataProject(p) ? "data" : "web";

const pad = (n: number) => String(n).padStart(2, "0");

/* -------------------------------------------------------------------------- */
/*  Modal                                                                      */
/* -------------------------------------------------------------------------- */
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
  const contentRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);
  const firstSwapRef = useRef(true);
  const [isClosing, setIsClosing] = useState(false);

  const category = getCategory(project);
  const labels = CATEGORY_LABEL[category];

  const animateOut = (onComplete: () => void) => {
    if (closingRef.current) return;
    if (reducedMotion || !cardRef.current) {
      onComplete();
      return;
    }
    closingRef.current = true;
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

  // Keep the key handler pointed at the latest props without re-subscribing.
  const latest = useRef({ index, requestClose, onNavigate });
  latest.current = { index, requestClose, onNavigate };

  // Mount: scroll lock (without layout jump), focus management, entrance, keys.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    closeButtonRef.current?.focus();

    if (!reducedMotion && cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 24, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out" },
      );
    }

    const onKey = (e: KeyboardEvent) => {
      const { index: i, requestClose: close, onNavigate: go } = latest.current;
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key === "ArrowRight") go(i + 1);
      if (e.key === "ArrowLeft") go(i - 1);

      // Focus trap
      if (e.key === "Tab" && cardRef.current) {
        const focusables = cardRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
      previouslyFocused?.focus?.();
    };
  }, [reducedMotion]);

  // Soft cross-fade when stepping between projects
  useEffect(() => {
    if (firstSwapRef.current) {
      firstSwapRef.current = false;
      return;
    }
    if (reducedMotion || !contentRef.current) return;
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
    );
  }, [project, reducedMotion]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity duration-300",
          isClosing ? "opacity-0" : "opacity-100",
        )}
        onClick={requestClose}
      />

      <div
        ref={cardRef}
        className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[var(--ink)]/30 bg-[var(--surface)] p-6 text-[var(--ink)] shadow-2xl sm:p-8 md:p-10 dark:border-[var(--line)]"
      >
        {/* Header bar */}
        <div className="mb-6 flex items-center justify-between border-b border-[var(--line)] pb-6">
          <div className="flex items-center gap-3">
            <span className="badge-neo-pill">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              <span>{labels.long}</span>
            </span>
            {total > 1 && (
              <span className="font-mono text-xs tabular-nums text-[var(--muted)]">
                {pad(index + 1)} / {pad(total)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {total > 1 && (
              <>
                <button
                  onClick={() => onNavigate(index - 1)}
                  className="btn-neo-control flex h-9 w-9 items-center justify-center rounded-xl font-mono active:scale-95"
                  aria-label="Previous project"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onNavigate(index + 1)}
                  className="btn-neo-control flex h-9 w-9 items-center justify-center rounded-xl font-mono active:scale-95"
                  aria-label="Next project"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
            <button
              ref={closeButtonRef}
              onClick={requestClose}
              className="btn-neo-control flex h-9 w-9 items-center justify-center rounded-xl text-sm active:scale-95"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div ref={contentRef} className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          {/* Media */}
          <div className="space-y-4">
            <div className="relative aspect-[16/10] overflow-hidden border border-[var(--line)] bg-black/5 dark:bg-black/40">
              <ChromaticImage
                src={project.image}
                alt={project.title}
                className="h-full w-full"
                imageClassName="object-top"
                zoom={0.16}
                displacement={0.04}
                chromaticShift={0.015}
                tilt={0.35}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {project.metrics.map((m) => (
                <div
                  key={m.label}
                  className="border border-[var(--line)] bg-[var(--surface-strong)]/60 p-4 text-center"
                >
                  <div className="font-sans text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                    {m.value}
                  </div>
                  <div className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div>
              <h3
                id="project-modal-title"
                className="font-sans text-2xl font-bold uppercase tracking-[-0.05em] sm:text-3xl"
              >
                {project.title}
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                {project.description}
              </p>

              <dl className="mt-5 grid grid-cols-3 gap-3 border-y border-[var(--line)] py-4 font-mono text-xs">
                <div>
                  <dt className="block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                    Role
                  </dt>
                  <dd className="mt-1 font-semibold">{project.role}</dd>
                </div>
                <div>
                  <dt className="block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                    Timeline
                  </dt>
                  <dd className="mt-1 font-semibold">{project.year}</dd>
                </div>
                <div>
                  <dt className="block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                    Category
                  </dt>
                  <dd className="mt-1 font-semibold">{labels.modal}</dd>
                </div>
              </dl>

              <div className="mt-5 border-l-2 border-emerald-600 pl-4 dark:border-emerald-400">
                <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                  <Zap className="h-3.5 w-3.5" />
                  <span>Impact &amp; Purpose</span>
                </div>
                <p className="text-xs leading-relaxed text-[var(--muted)]">{project.impact}</p>
              </div>

              <div className="mt-6">
                <h4 className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                  Key Deliverables
                </h4>
                <ul className="space-y-2">
                  {project.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-xs text-[var(--muted)]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <h4 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((t) => (
                    <span key={t} className="badge-neo-pill">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[var(--line)] pt-6">
              {project.galleryLink ? (
                <button
                  onClick={() =>
                    animateOut(() => {
                      onClose();
                      navigate(project.galleryLink!);
                    })
                  }
                  className="btn-neo-base btn-neo-primary group inline-flex h-12 flex-1 items-center justify-between gap-4 pl-6 pr-2 text-[11px]"
                >
                  <span>Open Canva Showcase</span>
                  <span className="btn-icon-pod h-8 w-8 bg-[var(--page)] text-[var(--ink)] dark:bg-black dark:text-[#C7ED70]">
                    <ArrowUpRight className="btn-icon-pod-arrow h-3.5 w-3.5" />
                  </span>
                </button>
              ) : project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-neo-base btn-neo-primary group inline-flex h-12 flex-1 items-center justify-between gap-4 pl-6 pr-2 text-[11px]"
                >
                  <span>Launch Live Demo</span>
                  <span className="btn-icon-pod h-8 w-8 bg-[var(--page)] text-[var(--ink)] dark:bg-black dark:text-[#C7ED70]">
                    <ArrowUpRight className="btn-icon-pod-arrow h-3.5 w-3.5" />
                  </span>
                </a>
              ) : null}

              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-neo-base btn-neo-secondary group inline-flex h-12 items-center justify-between gap-3 pl-5 pr-2 text-[11px]"
                >
                  <span>Source Code</span>
                  <span className="btn-icon-pod h-8 w-8 border border-[var(--line)] bg-[var(--page)]/60 text-[var(--ink)]">
                    <ArrowUpRight className="btn-icon-pod-arrow h-3.5 w-3.5 text-emerald-600 dark:text-[#C7ED70]" />
                  </span>
                </a>
              )}

              <button
                onClick={requestClose}
                className="btn-neo-base btn-neo-secondary inline-flex h-12 items-center justify-center px-6 text-[11px]"
              >
                Close
              </button>
            </div>

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
                    aria-current={i === index ? "true" : undefined}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === index
                        ? "w-6 bg-[#252A34] dark:bg-white"
                        : "w-1.5 bg-black/15 hover:bg-black/30 dark:bg-white/20 dark:hover:bg-white/40",
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

/* -------------------------------------------------------------------------- */
/*  Showcase media                                                             */
/* -------------------------------------------------------------------------- */
function ShowcaseMediaFrame({
  project,
  indexLabel,
  featured,
  onClick,
}: {
  project: Project;
  indexLabel: string;
  featured: boolean;
  onClick: () => void;
}) {
  const labels = CATEGORY_LABEL[getCategory(project)];

  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View ${project.title}`}
      className="group relative block cursor-pointer border border-[var(--line)] bg-[var(--surface)] p-2 transition-colors duration-300 hover:border-[var(--ink)] focus-visible:border-[var(--ink)] focus-visible:outline-none"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-950">
        <ChromaticImage
          src={project.image}
          alt={project.title}
          className="h-full w-full"
          imageClassName="object-top"
          zoom={0.18}
          displacement={0.045}
          chromaticShift={0.016}
          tilt={0.4}
        />

        {/* Hover scrim + action */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="btn-neo-base btn-neo-primary inline-flex h-11 translate-y-1 items-center gap-3 rounded-full pl-5 pr-2 shadow-2xl transition-transform duration-300 group-hover:translate-y-0">
            <span>Explore Project</span>
            <span className="btn-icon-pod h-7 w-7 rounded-full bg-[var(--page)] text-[var(--ink)] dark:bg-black dark:text-[#C7ED70]">
              <ArrowUpRight className="btn-icon-pod-arrow h-3.5 w-3.5" />
            </span>
          </span>
        </div>
      </div>

      {/* Caption strip */}
      <div className="flex items-center justify-between px-1 pb-0.5 pt-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
        <span className="flex items-center gap-2">
          <span className="tabular-nums">{indexLabel}</span>
          <span className="h-px w-4 bg-[var(--line)]" />
          <span>{labels.short}</span>
          {featured && (
            <span className="ml-1 flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              Featured
            </span>
          )}
        </span>
        <span>{project.year}</span>
      </div>
    </div>
  );
}

function ShowcaseItem({
  project,
  indexLabel,
  isEven,
  featured,
  reducedMotion,
  onOpen,
}: {
  project: Project;
  indexLabel: string;
  isEven: boolean;
  featured: boolean;
  reducedMotion: boolean;
  onOpen: () => void;
}) {
  const primaryCta = useMagnetic<HTMLAnchorElement>(0.18, reducedMotion);
  const secondaryCta = useMagnetic<HTMLButtonElement>(0.18, reducedMotion);

  return (
    <article
      className={cn(
        "showcase-item grid items-center gap-8 sm:gap-12 lg:gap-16",
        "border-t border-[var(--line)] pt-12 first:border-t-0 first:pt-0 sm:pt-16",
        isEven ? "lg:grid-cols-[1fr_1.25fr]" : "lg:grid-cols-[1.25fr_1fr]",
      )}
    >
      <div data-media className={cn("w-full", isEven && "lg:order-2")}>
        <ShowcaseMediaFrame
          project={project}
          indexLabel={indexLabel}
          featured={featured}
          onClick={onOpen}
        />
      </div>

      <div data-content className={cn("flex flex-col justify-center", isEven && "lg:order-1")}>
        <div className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em]">
          <span className="font-semibold text-emerald-700 dark:text-emerald-400">{project.role}</span>
          <span className="h-px w-6 bg-[var(--line)]" />
          <span className="text-[var(--muted)]">{project.year}</span>
        </div>

        <h3 className="font-sans text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl lg:text-4xl">
          <button
            type="button"
            onClick={onOpen}
            className="text-left transition-colors hover:text-emerald-600 focus-visible:underline focus-visible:outline-none dark:hover:text-emerald-400"
          >
            {project.title}
          </button>
        </h3>

        <p className="mt-4 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          {project.description}
        </p>

        <div className="mt-6 border-l-2 border-emerald-600 pl-4 dark:border-emerald-400">
          <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
            Impact &amp; Outcome
          </span>
          <p className="text-sm leading-relaxed text-[var(--muted)]">{project.impact}</p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((t) => (
            <span key={t} className="badge-neo-pill">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-6 border-t border-[var(--line)] pt-6">
          <dl className="flex items-center gap-8">
            {project.metrics.map((m) => (
              <div key={m.label}>
                <dd className="font-sans text-xl font-bold tracking-tight text-[var(--ink)] sm:text-2xl">
                  {m.value}
                </dd>
                <dt className="mt-0.5 text-xs font-medium text-[var(--muted)]">{m.label}</dt>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap items-center gap-2.5">
            {project.galleryLink ? (
              <Link
                ref={primaryCta.ref}
                onMouseMove={primaryCta.onMouseMove}
                onMouseLeave={primaryCta.onMouseLeave}
                to={project.galleryLink}
                className="btn-neo-base btn-neo-primary group inline-flex h-11 items-center justify-between gap-4 pl-4 pr-1.5"
              >
                <span>Showcase</span>
                <span className="btn-icon-pod h-8 w-8 bg-[var(--page)] text-[var(--ink)] dark:bg-black dark:text-[#C7ED70]">
                  <ArrowUpRight className="btn-icon-pod-arrow h-3.5 w-3.5" />
                </span>
              </Link>
            ) : project.link ? (
              <a
                ref={primaryCta.ref}
                onMouseMove={primaryCta.onMouseMove}
                onMouseLeave={primaryCta.onMouseLeave}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-neo-base btn-neo-primary group inline-flex h-11 items-center justify-between gap-4 pl-4 pr-1.5"
              >
                <span>Live Demo</span>
                <span className="btn-icon-pod h-8 w-8 bg-[var(--page)] text-[var(--ink)] dark:bg-black dark:text-[#C7ED70]">
                  <ArrowUpRight className="btn-icon-pod-arrow h-3.5 w-3.5" />
                </span>
              </a>
            ) : null}

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-neo-base btn-neo-secondary group inline-flex h-11 items-center justify-between gap-3 pl-3.5 pr-1.5"
                title="View Source Code on GitHub"
              >
                <span>Code</span>
                <span className="btn-icon-pod h-8 w-8 border border-[var(--line)] bg-[var(--page)]/60 text-[var(--ink)]">
                  <ArrowUpRight className="btn-icon-pod-arrow h-3.5 w-3.5 text-emerald-600 dark:text-[#C7ED70]" />
                </span>
              </a>
            )}

            <button
              ref={secondaryCta.ref}
              onMouseMove={secondaryCta.onMouseMove}
              onMouseLeave={secondaryCta.onMouseLeave}
              onClick={onOpen}
              className="btn-neo-base btn-neo-secondary group inline-flex h-11 items-center justify-between gap-3 pl-3.5 pr-1.5"
            >
              <span>Details</span>
              <span className="btn-icon-pod h-8 w-8 border border-[var(--line)] bg-[var(--page)]/60 text-[var(--ink)]">
                <ArrowDown className="btn-icon-pod-down h-3.5 w-3.5" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                    */
/* -------------------------------------------------------------------------- */
export function Projects() {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const showcaseListRef = useRef<HTMLDivElement>(null);
  const tabsWrapRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<FilterCategory, HTMLButtonElement>>(new Map());
  const indicatorPlacedRef = useRef(false);

  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const counts = useMemo(
    () => ({
      all: projects.length,
      web: projects.filter(isWebProject).length,
      data: projects.filter(isDataProject).length,
      design: projects.filter(isDesignProject).length,
    }),
    [],
  );

  const filteredProjects = useMemo(
    () =>
      projects.filter((p) => {
        if (activeFilter === "web") return isWebProject(p);
        if (activeFilter === "data") return isDataProject(p);
        if (activeFilter === "design") return isDesignProject(p);
        return true;
      }),
    [activeFilter],
  );

  const changeFilter = (key: FilterCategory) => {
    if (key === activeFilter) return;
    playTab();
    setSelectedIndex(null);
    setActiveFilter(key);
  };

  /* Sliding filter indicator — wrap-safe, font-safe, no first-paint sweep */
  useLayoutEffect(() => {
    const place = (animate: boolean) => {
      const activeEl = tabRefs.current.get(activeFilter);
      const wrapEl = tabsWrapRef.current;
      const indicatorEl = indicatorRef.current;
      if (!activeEl || !wrapEl || !indicatorEl) return;

      const wrap = wrapEl.getBoundingClientRect();
      const rect = activeEl.getBoundingClientRect();
      const vars = {
        x: rect.left - wrap.left - wrapEl.clientLeft,
        y: rect.top - wrap.top - wrapEl.clientTop,
        width: rect.width,
        height: rect.height,
      };

      if (animate) {
        gsap.to(indicatorEl, { ...vars, duration: 0.5, ease: "power3.out", overwrite: true });
      } else {
        gsap.set(indicatorEl, vars);
      }
    };

    place(indicatorPlacedRef.current && !reducedMotion);
    indicatorPlacedRef.current = true;

    const ro = new ResizeObserver(() => place(false));
    if (tabsWrapRef.current) ro.observe(tabsWrapRef.current);
    document.fonts?.ready.then(() => place(false));

    return () => ro.disconnect();
  }, [activeFilter, reducedMotion]);

  /* Header intro — runs once (no longer replays on every filter change) */
  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      if (!headerRef.current) return;
      gsap
        .timeline({
          scrollTrigger: { trigger: headerRef.current, start: "top 85%", once: true },
        })
        .fromTo(
          ".projects-header-title",
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", force3D: true },
        )
        .fromTo(
          ".projects-header-desc",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", force3D: true },
          "-=0.4",
        )
        .fromTo(
          tabsWrapRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", force3D: true },
          "-=0.4",
        )
        .fromTo(
          ".projects-header-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.9, ease: "power2.inOut", force3D: true },
          "-=0.4",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  /* Per-item reveal — each project animates as it enters, and on filter change */
  useEffect(() => {
    if (reducedMotion || !showcaseListRef.current) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".showcase-item").forEach((item) => {
        const media = item.querySelector("[data-media]");
        const content = item.querySelector("[data-content]");
        gsap
          .timeline({
            scrollTrigger: { trigger: item, start: "top 88%", once: true },
          })
          .fromTo(
            media,
            { opacity: 0, y: 32 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", force3D: true },
          )
          .fromTo(
            content,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", force3D: true },
            "-=0.55",
          );
      });
    }, showcaseListRef);

    return () => ctx.revert();
  }, [reducedMotion, activeFilter]);

  const openProject = (idx: number) => {
    playClick();
    setSelectedIndex(idx);
  };
  const closeProject = () => {
    playClick();
    setSelectedIndex(null);
  };
  const navigateProject = (targetIndex: number) => {
    if (filteredProjects.length === 0) return;
    playTab();
    const wrapped = (targetIndex + filteredProjects.length) % filteredProjects.length;
    setSelectedIndex(wrapped);
  };

  const selectedProject = selectedIndex !== null ? filteredProjects[selectedIndex] : null;

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--page)] py-16 transition-colors duration-500 sm:py-24 md:py-28"
    >
      <Container>
        {/* Sub-bar */}
        <div className="mb-12 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)] sm:mb-16">
          <span className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span>( 03 ) — Work</span>
          </span>
          <span>2025–2026 Index</span>
        </div>

        {/* Header */}
        <div
          ref={headerRef}
          className="relative mb-14 flex flex-col justify-between gap-6 pb-8 sm:mb-20 md:flex-row md:items-end"
        >
          <div className="max-w-2xl">
            <h2 className="projects-header-title font-sans text-[clamp(2.2rem,4.5vw,3.75rem)] font-bold tracking-tight text-[var(--ink)]">
              Selected Works
            </h2>
            <p className="projects-header-desc mt-4 max-w-xl text-base font-normal leading-relaxed text-[var(--muted)]">
              A curated selection of production web applications, predictive intelligence
              platforms, and high-impact visual design systems.
            </p>
          </div>

          {/* Segmented filter */}
          <div
            ref={tabsWrapRef}
            role="group"
            aria-label="Filter projects"
            className="relative flex flex-wrap items-center gap-1 self-start rounded-full border border-[var(--line)] bg-[var(--surface)] p-1.5 md:self-auto"
          >
            <div
              ref={indicatorRef}
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 rounded-full bg-[var(--ink)]"
            />
            {FILTER_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                ref={(el) => {
                  if (el) tabRefs.current.set(key, el);
                }}
                onClick={() => changeFilter(key)}
                aria-pressed={activeFilter === key}
                className={cn(
                  "relative z-10 flex select-none items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors duration-200",
                  activeFilter === key
                    ? "font-bold text-[var(--page)]"
                    : "text-[var(--muted)] hover:text-[var(--ink)]",
                )}
              >
                <span>{label}</span>
                <span
                  className={cn(
                    "inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-xs tabular-nums",
                    activeFilter === key
                      ? "bg-white/20 font-bold text-current"
                      : "bg-black/5 text-[var(--muted)] dark:bg-white/10",
                  )}
                >
                  {counts[key]}
                </span>
              </button>
            ))}
          </div>

          <div
            aria-hidden="true"
            className="projects-header-line absolute bottom-0 left-0 right-0 h-px origin-left bg-[var(--line)]"
          />
        </div>

        {/* Showcase list */}
        <div ref={showcaseListRef} className="flex flex-col gap-12 sm:gap-16" aria-live="polite">
          {filteredProjects.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                No projects in this category yet
              </p>
              <button
                type="button"
                onClick={() => changeFilter("all")}
                className="btn-neo-base btn-neo-secondary mt-6 inline-flex h-11 items-center justify-center px-6"
              >
                Show all projects
              </button>
            </div>
          ) : (
            filteredProjects.map((project, idx) => (
              <ShowcaseItem
                key={project.title}
                project={project}
                indexLabel={`${pad(idx + 1)} / ${pad(filteredProjects.length)}`}
                isEven={idx % 2 === 1}
                featured={activeFilter === "all" && idx === 0}
                reducedMotion={reducedMotion}
                onOpen={() => openProject(idx)}
              />
            ))
          )}
        </div>
      </Container>

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